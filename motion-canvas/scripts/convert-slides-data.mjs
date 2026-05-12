import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcPath = resolve(__dirname, "../../src/compositions/reading-history/slides-data.ts");
const outPath = resolve(__dirname, "../src/data/reading-history.ts");

const ts = readFileSync(srcPath, "utf-8");

// Extract the readingHistorySlides array
const match = ts.match(/export const readingHistorySlides[^=]*=\s*(\[[\s\S]*?\n\]);\s*\n/);
if (!match) {
  console.error("Could not extract readingHistorySlides from slides-data.ts");
  process.exit(1);
}

let dataStr = match[1];

// Strip TypeScript-specific syntax
dataStr = dataStr.replace(/\s+as\s+const\b/g, "");
dataStr = dataStr.replace(/:\s*\w+\[\]/g, "");

// Convert frames to seconds (30fps)
const frameToSeconds = (str) => {
  return str.replace(/durationInFrames:\s*(\d+)/g, (_, frames) => {
    const seconds = (parseInt(frames, 10) / 30).toFixed(4);
    return `durationSeconds: ${seconds}`;
  });
};

dataStr = frameToSeconds(dataStr);

// Extract totalDurationFrames
const durMatch = ts.match(/export const totalDurationFrames\s*=\s*(\d+)/);
const totalFrames = durMatch ? parseInt(durMatch[1], 10) : 23247;
const totalSeconds = (totalFrames / 30).toFixed(4);

const output = `// Auto-generated from src/compositions/reading-history/slides-data.ts
// Run: bun run convert:data

export const readingHistoryData = {
  title: "Animemory #0\\n我的耽美阅读史",
  subtitle: "从八岁到研一，一路走来的阅读回忆",
  channelName: "Animemory",
  totalDurationSeconds: ${totalSeconds},
  slides: ${dataStr},
};
`;

writeFileSync(outPath, output, "utf-8");
console.log(`Written: ${outPath} (${totalFrames} frames -> ${totalSeconds}s)`);
