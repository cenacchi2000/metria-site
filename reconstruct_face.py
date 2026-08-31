#!/usr/bin/env python3
"""
Metria multi-frame 3D face reconstruction service.

This uses the official DECA/FLAME-style PyTorch pipeline:
- captures a short burst of frames;
- estimates identity shape from the temporal median;
- keeps the latest expression and pose;
- returns the reconstructed mesh topology and vertices as JSON.

Run after installing the official DECA repository:
  git clone https://github.com/yfeng95/DECA.git
  pip install -r requirements-face.txt
  python reconstruct_face.py

The endpoint is intentionally local-first. Raw frames are not written to disk.
"""
from __future__ import annotations

import base64
import io
import os
from typing import Any

import cv2
import numpy as np
import torch
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

try:
    from decalib.deca import DECA, deca_cfg
    from decalib.utils.config import cfg as global_cfg
except ImportError as exc:
    raise RuntimeError(
        "Install the official DECA implementation and its dependencies before running this service."
    ) from exc

app = FastAPI(title="Metria PyTorch Face Reconstruction", version="1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://cenacchi2000.github.io", "http://localhost:8000", "http://127.0.0.1:8000"],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
DECA_MODEL = os.environ.get("DECA_MODEL", "data/deca_model.tar")
_deca: DECA | None = None


def get_deca() -> DECA:
    global _deca
    if _deca is None:
        config = deca_cfg
        config.model.use_tex = True
        config.rasterizer_type = "pytorch3d"
        _deca = DECA(config=config, device=DEVICE)
    return _deca


def image_tensor(raw: bytes) -> torch.Tensor:
    image = Image.open(io.BytesIO(raw)).convert("RGB")
    array = np.asarray(image)
    return torch.from_numpy(array).float().permute(2, 0, 1).unsqueeze(0) / 255.0


def to_list(value: Any) -> list:
    if torch.is_tensor(value):
        value = value.detach().cpu().numpy()
    return np.asarray(value).tolist()


def temporal_average(codes: list[dict[str, torch.Tensor]]) -> dict[str, torch.Tensor]:
    if not codes:
        raise ValueError("No frames were reconstructed")
    result: dict[str, torch.Tensor] = {}
    identity_keys = {"shape", "tex", "detail"}
    for key in codes[0]:
        values = [entry[key] for entry in codes if key in entry]
        if not values:
            continue
        stack = torch.cat(values, dim=0)
        result[key] = torch.median(stack, dim=0, keepdim=True).values if key in identity_keys else values[-1]
    return result


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ready", "device": DEVICE, "model": "DECA-FLAME"}


@app.post("/reconstruct")
async def reconstruct(frames: list[UploadFile] = File(...)) -> dict[str, Any]:
    if not 8 <= len(frames) <= 60:
        raise HTTPException(status_code=400, detail="Send between 8 and 60 frames.")
    deca = get_deca()
    codes: list[dict[str, torch.Tensor]] = []
    with torch.inference_mode():
        for upload in frames:
            raw = await upload.read()
            if not raw:
                continue
            codes.append(deca.encode(image_tensor(raw).to(DEVICE)))
    if len(codes) < 8:
        raise HTTPException(status_code=400, detail="At least 8 valid frames are required.")
    merged = temporal_average(codes)
    with torch.inference_mode():
        opdict, _ = deca.decode(merged)
    vertices = opdict.get("trans_verts", opdict["verts"])[0]
    faces = deca.face_buf.detach().cpu().numpy() if hasattr(deca, "face_buf") else np.asarray(deca.faces)
    return {
        "model": "DECA-FLAME",
        "device": DEVICE,
        "frame_count": len(codes),
        "vertices": to_list(vertices),
        "faces": faces.astype(int).tolist(),
        "landmarks2d": to_list(opdict.get("landmarks2d", [])),
        "identity_shape": to_list(merged.get("shape", [])),
        "expression": to_list(merged.get("exp", [])),
        "pose": to_list(merged.get("pose", [])),
        "privacy": "Frames are processed in memory and are not written by this service.",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "7860")))
