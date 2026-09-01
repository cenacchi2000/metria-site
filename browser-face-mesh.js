/* Metria browser face mesh
 * Free GitHub Pages implementation: MediaPipe Face Landmarker runs locally,
 * then its 478 3D landmarks are rendered as a depth-aware facial mesh.
 * Camera frames and landmarks never leave the browser.
 */
(() => {
  const boot = () => {
    const video = document.querySelector('#faceVideo');
    const stage = document.querySelector('.face-stage');
    const start = document.querySelector('#startFaceTwin');
    const stop = document.querySelector('#stopFaceTwin');
    const status = document.querySelector('#faceStatus');
    const placeholder = document.querySelector('#facePlaceholder');
    const twinVisual = document.querySelector('.human-twin-visual');
    if (!video || !stage || !start || !stop) return;

    // Replace legacy handlers without changing the visible controls.
    const startButton = start.cloneNode(true);
    const stopButton = stop.cloneNode(true);
    start.replaceWith(startButton);
    stop.replaceWith(stopButton);

    const meshCanvas = document.createElement('canvas');
    meshCanvas.id = 'liveFaceMesh';
    meshCanvas.setAttribute('aria-label', 'Live local 3D facial landmark mesh');
    stage.appendChild(meshCanvas);

    let stream = null;
    let landmarker = null;
    let raf = 0;
    let lastVideoTime = -1;
    let loading = false;

    const setStatus = (text, message) => {
      if (status) status.textContent = text;
      if (placeholder && message) placeholder.textContent = message;
    };

    const fitCanvas = (canvas, box) => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, box.clientWidth);
      const h = Math.max(1, box.clientHeight);
      if (canvas.width !== Math.round(w * ratio) || canvas.height !== Math.round(h * ratio)) {
        canvas.width = Math.round(w * ratio);
        canvas.height = Math.round(h * ratio);
      }
      return {w, h, ratio};
    };

    const drawMesh = (landmarks) => {
      const {w, h, ratio} = fitCanvas(meshCanvas, stage);
      const ctx = meshCanvas.getContext('2d');
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (!landmarks?.length) return;

      // Fit the observed face into a stable 3D viewport using MediaPipe z-depth.
      let minX=1, maxX=0, minY=1, maxY=0;
      landmarks.forEach(p => { minX=Math.min(minX,p.x); maxX=Math.max(maxX,p.x); minY=Math.min(minY,p.y); maxY=Math.max(maxY,p.y); });
      const cx=(minX+maxX)/2, cy=(minY+maxY)/2;
      const scale=Math.min(w/(maxX-minX+0.12), h/(maxY-minY+0.12));
      const pts=landmarks.map(p => {
        const z=Math.max(-0.16, Math.min(0.16, p.z || 0));
        return {x:w/2+(p.x-cx)*scale*(1-z*1.8), y:h/2+(p.y-cy)*scale*(1-z*1.8), z};
      });

      const glow=ctx.createRadialGradient(w/2,h/2,5,w/2,h/2,Math.min(w,h)*.48);
      glow.addColorStop(0,'rgba(255,170,165,.28)');
      glow.addColorStop(.5,'rgba(130,115,223,.18)');
      glow.addColorStop(1,'rgba(130,115,223,0)');
      ctx.fillStyle=glow; ctx.fillRect(0,0,w,h);

      // Local k-neighbour topology: visible edges are derived from the real
      // landmark positions, not a pre-drawn silhouette.
      const edges=[];
      const stride=4;
      for(let i=0;i<pts.length;i+=stride){
        const nearest=[];
        for(let j=0;j<pts.length;j+=stride){
          if(i===j) continue;
          const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
          const d=dx*dx+dy*dy;
          if(d<Math.pow(Math.min(w,h)*.105,2)) nearest.push([d,j]);
        }
        nearest.sort((a,b)=>a[0]-b[0]).slice(0,3).forEach(([,j])=>edges.push([i,j]));
      }
      ctx.lineWidth=Math.max(.45,Math.min(1.15,w/360));
      edges.forEach(([a,b])=>{
        const pa=pts[a], pb=pts[b];
        const alpha=Math.max(.16,Math.min(.7,1-Math.abs(pa.z-pb.z)*3));
        ctx.strokeStyle='rgba(185,243,108,'+alpha+')';
        ctx.beginPath(); ctx.moveTo(pa.x,pa.y); ctx.lineTo(pb.x,pb.y); ctx.stroke();
      });

      pts.forEach((p,i)=>{
        const r=i%7===0?1.7:1.05;
        ctx.fillStyle=i%11===0?'#ffaaa5':'#b9f36c';
        ctx.shadowColor=ctx.fillStyle; ctx.shadowBlur=i%11===0?7:4;
        ctx.beginPath(); ctx.arc(p.x,p.y,r,0,Math.PI*2); ctx.fill();
      });
      ctx.shadowBlur=0;

      // Mirror the camera-facing mesh into the compact twin card.
      if (twinVisual) {
        let twinCanvas=twinVisual.querySelector('#twinFaceMesh');
        if (!twinCanvas) {
          twinCanvas=document.createElement('canvas');
          twinCanvas.id='twinFaceMesh';
          twinCanvas.setAttribute('aria-label','Metria live facial mesh twin');
          Object.assign(twinCanvas.style,{position:'absolute',inset:'18px 24% 18px 24%',width:'52%',height:'calc(100% - 36px)',zIndex:'3',pointerEvents:'none',filter:'drop-shadow(0 0 12px rgba(130,115,223,.85))'});
          twinVisual.appendChild(twinCanvas);
          const figure=twinVisual.querySelector('.twin-human');
          if (figure) figure.style.opacity='.08';
        }
        const tw=fitCanvas(twinCanvas,twinVisual);
        const tctx=twinCanvas.getContext('2d');
        tctx.setTransform(tw.ratio,0,0,tw.ratio,0,0); tctx.clearRect(0,0,tw.w,tw.h);
        const sx=tw.w/w, sy=tw.h/h;
        edges.forEach(([a,b])=>{tctx.strokeStyle='rgba(185,243,108,.42)';tctx.lineWidth=.7;tctx.beginPath();tctx.moveTo(pts[a].x*sx,pts[a].y*sy);tctx.lineTo(pts[b].x*sx,pts[b].y*sy);tctx.stroke();});
        pts.forEach((p,i)=>{tctx.fillStyle=i%11===0?'#ffaaa5':'#b9f36c';tctx.beginPath();tctx.arc(p.x*sx,p.y*sy,.8,0,Math.PI*2);tctx.fill();});
      }
    };

    const loadModel = async () => {
      if (landmarker || loading) return landmarker;
      loading=true; setStatus('Camera on · loading local mesh','Camera active — loading the local 478-point face model');
      const vision=await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/vision_bundle.mjs');
      const fileset=await vision.FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm');
      const base={modelAssetPath:'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',delegate:'GPU'};
      try { landmarker=await vision.FaceLandmarker.createFromOptions(fileset,{baseOptions:base,runningMode:'VIDEO',numFaces:1,outputFaceBlendshapes:false,outputFacialTransformationMatrixes:true}); }
      catch (e) { landmarker=await vision.FaceLandmarker.createFromOptions(fileset,{baseOptions:{...base,delegate:'CPU'},runningMode:'VIDEO',numFaces:1,outputFaceBlendshapes:false,outputFacialTransformationMatrixes:true}); }
      loading=false; return landmarker;
    };

    const loop = () => {
      if (!stream) return;
      if (video.readyState >= 2 && video.currentTime !== lastVideoTime && landmarker) {
        lastVideoTime=video.currentTime;
        try {
          const result=landmarker.detectForVideo(video,performance.now());
          const points=result.faceLandmarks?.[0];
          drawMesh(points);
          setStatus(points?'Live 3D mesh':'Looking for face',points?'478 local landmarks mapped into the twin':'Move into view to begin reconstruction');
        } catch (e) { setStatus('Mesh paused','Adjust lighting or move closer to the camera'); }
      }
      raf=requestAnimationFrame(loop);
    };

    const stopCamera = () => {
      if (raf) cancelAnimationFrame(raf); raf=0;
      stream?.getTracks().forEach(track=>track.stop()); stream=null;
      video.srcObject=null; video.classList.remove('active');
      startButton.disabled=false; stopButton.disabled=true;
      setStatus('Camera off','Start the camera to create a live face mesh');
      const ctx=meshCanvas.getContext('2d'); ctx?.clearRect(0,0,meshCanvas.width,meshCanvas.height);
    };

    startButton.addEventListener('click',async()=>{
      if (stream) return;
      if (!navigator.mediaDevices?.getUserMedia) { setStatus('Camera unavailable','Use HTTPS and a camera-enabled browser'); return; }
      startButton.disabled=true; setStatus('Requesting camera','Allow camera access to build the local mesh');
      try {
        stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:1280},height:{ideal:720}},audio:false});
        video.srcObject=stream; video.classList.add('active'); await video.play();
        stopButton.disabled=false;
        await loadModel();
        setStatus('Camera on · tracking','Camera active — building your local 3D face mesh');
        loop();
      } catch (error) {
        stopCamera();
        setStatus(error?.name==='NotAllowedError'?'Camera blocked':'Camera unavailable',error?.name==='NotAllowedError'?'Camera access is blocked for this site. Check the browser camera icon.':'Could not start the camera on this device.');
      }
    });
    stopButton.addEventListener('click',stopCamera);
    window.addEventListener('resize',()=>{ if(stream) drawMesh(null); });

    // Explicit consent boundary: the browser-only reconstruction is opt-in.
    setStatus('Camera off','Start the camera to create a live face mesh');
  };
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
