import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcPath = resolve(__dirname, "../../src/compositions/player-style/sample-data.ts");
const outPath = resolve(__dirname, "../white-voice/data.js");

const ts = readFileSync(srcPath, "utf-8");

const match = ts.match(/export const samplePlayerData:\s*PlayerStyleData\s*=\s*(\{[\s\S]*?\n\});/);
if (!match) {
  console.error("Could not extract samplePlayerData from sample-data.ts");
  process.exit(1);
}

let dataStr = match[1];
// Replace single-quoted strings to double-quoted for valid JSON-like JS
dataStr = dataStr.replace(/'/g, '"');

const output = `// Auto-generated from src/compositions/player-style/sample-data.ts
// Run: node scripts/convert-sample-data.mjs
window.__whiteVoiceData = ${dataStr};
`;

writeFileSync(outPath, output, "utf-8");
console.log(`Written: ${outPath}`);
