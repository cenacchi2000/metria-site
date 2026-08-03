import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Metria startup homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Metria \| Review Systems for High-Stakes Decisions<\/title>/i);
  assert.match(html, /Turn complex cases into defensible outcomes/);
  assert.match(html, /psychologist-guided protocols/i);
  assert.match(html, /Protocol Builder/);
  assert.match(html, /Calibration Console/);
  assert.match(html, /Clinical intake review/);
  assert.match(html, /Assessment integrity/);
  assert.match(html, /Private pilot intake/);
  assert.doesNotMatch(html, /Cenacchi Labs|Evidence Generator|Macquarie|School of Computing|filippo\.cenacchi@mq\.edu\.au/i);
});

test("keeps the site product-led and free of starter scaffolding", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /const workflow/);
  assert.match(page, /const psychologistLoop/);
  assert.match(layout, /Metria helps teams review interviews/);
  assert.doesNotMatch(page, /SkeletonPreview|_sites-preview|codex-preview|Cenacchi Labs|Evidence Generator|Macquarie/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview|Cenacchi Labs|Evidence Generator/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
