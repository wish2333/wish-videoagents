import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcPath = resolve(__dirname, "../../src/compositions/reading-history/slides-data.ts");
const outPath = resolve(__dirname, "../reading-history/data.js");

const ts = readFileSync(srcPath, "utf-8");

// Extract the readingHistorySlides array
const match = ts.match(/export const readingHistorySlides[^=]*=\s*(\[[\s\S]*?\n\]);\s*\n/);
if (!match) {
  console.error("Could not extract readingHistorySlides from slides-data.ts");
  process.exit(1);
}

let dataStr = match[1];

// Strip TypeScript-specific syntax
dataStr = dataStr.replace(/\s+as\s+const\b/g, "");  // remove "as const"
dataStr = dataStr.replace(/:\s*\w+\[\]/g, "");       // remove type annotations like ": string[]"

// Extract totalDurationFrames
const durMatch = ts.match(/export const totalDurationFrames\s*=\s*(\d+)/);
const totalDuration = durMatch ? durMatch[1] : "23247";

const output = `// Auto-generated from src/compositions/reading-history/slides-data.ts
// Run: node scripts/convert-slides-data.mjs
window.__readingHistorySlides = ${dataStr};
window.__readingHistoryTotalFrames = ${totalDuration};
`;

writeFileSync(outPath, output, "utf-8");
console.log(`Written: ${outPath}`);
