import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = path.join(root, "dist");
let html = await readFile(path.join(dist, "index.html"), "utf8");
const scriptTag = html.match(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/);
const styleTag = html.match(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/);
if (!scriptTag || !styleTag) throw new Error("Vite build assets were not found.");

let javascript = await readFile(path.join(dist, scriptTag[1]), "utf8");
const stylesheet = await readFile(path.join(dist, styleTag[1]), "utf8");
const images = new Set(javascript.match(/\/images\/[a-zA-Z0-9_-]+\.svg/g));
if (!images.size) throw new Error("Product images were not found in the bundle.");
for (const image of images) {
  const data = await readFile(path.join(dist, image));
  javascript = javascript.replaceAll(image, `data:image/svg+xml;base64,${data.toString("base64")}`);
}
const favicon = await readFile(path.join(dist, "favicon.svg"));
html = html
  .replace('/favicon.svg', `data:image/svg+xml;base64,${favicon.toString("base64")}`)
  .replace(scriptTag[0], () => `<script type="module">${javascript.replace(/<\/script/gi, "<\\/script")}</script>`)
  .replace(styleTag[0], () => `<style>${stylesheet}</style>`);
await writeFile(path.join(root, "demo.html"), html);
console.log("demo.html tayyor. Brauzerda serversiz ochishingiz mumkin.");
