import type { LyricLine, LyricWord } from "./types";

const parseLrcTime = (time: string): number => {
  const [min, sec] = time.split(":");
  return Number(min) * 60 + Number(sec);
};

const parseSrtTime = (time: string): number => {
  const parts = time.trim().replace(",", ".").split(":");
  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);
  const seconds = Number(parts[2]);
  return hours * 3600 + minutes * 60 + seconds;
};

const stripAssTags = (text: string): string =>
  text.replace(/\{[^}]*\}/g, "").replace(/\\N/g, " ").trim();

const isWordLrc = (lrc: string): boolean => {
  const lines = lrc.split("\n").filter((l) => l.trim());
  for (const line of lines) {
    const matches = [...line.matchAll(/\[(\d{2}:\d{2}\.\d{2,3})\]([^\[]+)/g)];
    if (matches.length > 1) return true;
  }
  return false;
};

const parseWordLrc = (lrc: string): LyricLine[] => {
  const lines = lrc.split("\n").filter((l) => l.trim());
  const result: LyricLine[] = [];

  for (const line of lines) {
    const matches = [...line.matchAll(/\[(\d{2}:\d{2}\.\d{2,3})\]([^\[]+)/g)];
    if (matches.length === 0) continue;

    const words: LyricWord[] = matches.map((match, i) => {
      const start = parseLrcTime(match[1]);
      const next = matches[i + 1];
      const end = next ? parseLrcTime(next[1]) : start + 0.6;
      return { text: match[2], start, end };
    });

    const text = words.map((w) => w.text).join("");
    const start = words[0].start;
    const end = words[words.length - 1].end;

    result.push({ text, start, end, words });
  }

  return result;
};

const parseLineLrc = (lrc: string): LyricLine[] => {
  const lines = lrc.split("\n").filter((l) => l.trim());
  const result: LyricLine[] = [];

  for (const line of lines) {
    const match = line.match(/^\[(\d{2}:\d{2}\.\d{2,3})\](.+)/);
    if (!match) continue;

    const start = parseLrcTime(match[1]);
    const text = match[2].trim();

    if (result.length > 0) {
      result[result.length - 1].end = start;
    }

    result.push({ text, start, end: start + 5 });
  }

  if (result.length > 0) {
    const last = result[result.length - 1];
    last.end = last.start + Math.max(last.text.length * 0.3, 3);
  }

  return result;
};

const parseSrt = (text: string): LyricLine[] => {
  const blocks = text.trim().split(/\n\s*\n/);
  const result: LyricLine[] = [];

  for (const block of blocks) {
    const lines = block.trim().split("\n");
    if (lines.length < 3) continue;

    const timeMatch = lines[1].match(
      /(\d{2}:\d{2}:\d{2}[,.]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,.]\d{3})/
    );
    if (!timeMatch) continue;

    const start = parseSrtTime(timeMatch[1]);
    const end = parseSrtTime(timeMatch[2]);
    const content = lines.slice(2).join(" ").trim();

    if (content) {
      result.push({ text: content, start, end });
    }
  }

  return result;
};

const parseAss = (text: string): LyricLine[] => {
  const result: LyricLine[] = [];
  const lines = text.split("\n");

  for (const line of lines) {
    const match = line.match(/^Dialogue:\s*\d+,\s*([^,]+),\s*([^,]+),\s*[^,]*,\s*[^,]*,\s*[^,]*,\s*[^,]*,\s*[^,]*,\s*(.+)$/i);
    if (!match) continue;

    const parseAssTime = (t: string): number => {
      const trimmed = t.trim();
      const parts = trimmed.split(":");
      const hours = Number(parts[0]);
      const minutes = Number(parts[1]);
      const seconds = Number(parts[2]);
      return hours * 3600 + minutes * 60 + seconds;
    };

    const start = parseAssTime(match[1]);
    const end = parseAssTime(match[2]);
    const content = stripAssTags(match[3]);

    if (content) {
      result.push({ text: content, start, end });
    }
  }

  result.sort((a, b) => a.start - b.start);
  return result;
};

export const parseLyrics = (text: string, filename: string): LyricLine[] => {
  const ext = filename.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "lrc":
      return isWordLrc(text) ? parseWordLrc(text) : parseLineLrc(text);
    case "srt":
      return parseSrt(text);
    case "ass":
    case "ssa":
      return parseAss(text);
    default:
      return isWordLrc(text) ? parseWordLrc(text) : parseLineLrc(text);
  }
};
