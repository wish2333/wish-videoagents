// Visual regression: extract key frames from Remotion and hyperframes outputs, compare screenshots.
// Requires: npm install pixelmatch pngjs
// Usage: node scripts/screenshot-compare.mjs <remotion-mp4> <hyperframes-mp4> [interval-seconds]

import { execSync } from "child_process";
import { mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log("Usage: node screenshot-compare.mjs <remotion-mp4> <hyperframes-mp4> [interval-seconds]");
  process.exit(1);
}

const remotionMp4 = resolve(args[0]);
const hyperMp4 = resolve(args[1]);
const interval = args[2] ? parseFloat(args[2]) : 10;

const outDir = resolve(__dirname, "../.screenshots");
mkdirSync(outDir, { recursive: true });

function extractFrames(mp4, label) {
  const dir = resolve(outDir, label);
  mkdirSync(dir, { recursive: true });
  console.log(`Extracting ${label} frames every ${interval}s from ${mp4}...`);
  execSync(
    `ffmpeg -y -i "${mp4}" -vf "fps=1/${interval}" "${dir}/frame_%04d.png"`,
    { stdio: "inherit" }
  );
}

extractFrames(remotionMp4, "remotion");
extractFrames(hyperMp4, "hyperframes");

console.log(`\nFrames extracted to ${outDir}`);
console.log("To compare visually, open both directories side by side.");
console.log("For pixel-level diff, install pixelmatch + pngjs and extend this script.");
