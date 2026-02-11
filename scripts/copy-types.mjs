import { copyFile, mkdir, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const srcDir = resolve(root, "types");
const distDir = resolve(root, "dist");

await mkdir(distDir, { recursive: true });
const files = await readdir(srcDir);

await Promise.all(
  files
    .filter((file) => file.endsWith(".d.ts"))
    .map((file) => copyFile(resolve(srcDir, file), resolve(distDir, file)))
);
