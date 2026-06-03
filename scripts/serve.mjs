import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(".");
const port = Number(process.env.PORT || 5173);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

async function resolveFile(requestUrl) {
  const url = new URL(requestUrl, `http://localhost:${port}`);
  const pathname = decodeURIComponent(url.pathname);
  const normalizedPath = normalize(pathname).replace(/^([/\\])+/, "");
  let filePath = resolve(join(root, normalizedPath));

  if (!filePath.startsWith(root)) {
    throw new Error("Forbidden");
  }

  const fileStat = await stat(filePath).catch(() => null);
  if (fileStat?.isDirectory()) {
    filePath = join(filePath, "index.html");
  }

  return filePath;
}

createServer(async (request, response) => {
  try {
    const filePath = await resolveFile(request.url || "/");
    const body = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    response.end(body);
  } catch (error) {
    response.writeHead(error.message === "Forbidden" ? 403 : 404, {
      "Content-Type": "text/plain; charset=utf-8"
    });
    response.end(error.message === "Forbidden" ? "Forbidden" : "Not found");
  }
}).listen(port, () => {
  console.log(`Local server: http://localhost:${port}`);
});
