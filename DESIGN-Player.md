# Player-Style Composition Design

## Overview

A Remotion composition that renders a music player-style video: rotating vinyl disc with album cover on the left, song info + multi-line lyrics + progress bar + player controls on the right. Background uses cover-color gradient with texture layer.

## Visual Layout (1920x1080)

```
+-------------------------------------------+
|  [gradient bg: bg1 -> bg2 + dot texture]   |
|                                            |
|   [Cover]        Song Title (700wt)       |
|   + [Vinyl]      Artist Name             |
|                   ---                     |
|                   Line -1 (past, dim)     |
|                 > Current Line (bright) < |
|                   Line +1 (upcoming)      |
|                   Line +2 (upcoming)      |
|                   Line +3 (upcoming)      |
|                                            |
|                   0:32 ----o---- 3:45      |
|                     <  ||  >   >>          |
+-------------------------------------------+
```

## Source Files

```
src/compositions/player-style/
  types.ts              - LyricWord, LyricLine, PlayerThemeColors, PlayerStyleData
  parseLyrics.ts        - Unified parser: LRC (word/line), ASS, SRT -> LyricLine[]
  fonts.ts              - DISPLAY_FONT, LYRICS_FONT, UI_FONT
  sample-data.ts        - Demo data with parsed lyrics
  index.tsx             - Main PlayerStyle composition
  components/
    VinylDisc.tsx       - Square cover + rotating vinyl with grooves
    LyricsPanel.tsx     - 5-line lyrics with spring scroll animation
    PlayerControls.tsx  - Progress bar + time + play/pause controls
```

## Data Interface

```ts
interface LyricWord {
  text: string;    // Single character or syllable
  start: number;   // Start time in seconds
  end: number;     // End time in seconds
}

interface LyricLine {
  text: string;           // Full line text
  start: number;          // Line start time (seconds)
  end: number;            // Line end time (seconds)
  words?: LyricWord[];    // If present -> KTV fill mode
}

interface PlayerThemeColors {
  accent: string;   // Highlight color (lyrics, progress)
  bg1: string;      // Gradient start
  bg2: string;      // Gradient end
}

interface PlayerStyleData {
  title: string;
  artist: string;
  audioSrc: string;         // Filename in public/
  coverSrc: string;         // Filename in public/
  lyrics: LyricLine[];      // Pre-parsed lyrics data
  duration: number;         // Total seconds
  theme: PlayerThemeColors; // Cover-derived colors
}
```

## Design Tokens

### Background
- Gradient: `linear-gradient(145deg, bg1, bg2)` with `radial-gradient` light spot at 22% 42%
- Texture: 3px dot grid at 15% opacity, overlay blend mode

### Typography
- Title: 68px, font-weight 700, letter-spacing 6px
- Artist: 26px, opacity 0.88
- Lyrics active: 34px, font-weight 700
- Lyrics inactive: 26px, font-weight 400, opacity fades by distance
- Time display: 22px, UI font

### Cover & Vinyl
- Cover: 440x440 square, box-shadow for depth
- Vinyl: 440x440 circle, offset 220px right from cover
- Vinyl grooves: `repeating-radial-gradient` pattern
- Vinyl center: 110px circular cover + 28px spindle hole
- Rotation: continuous 360deg per 8 seconds

### Lyrics Panel
- Visible lines: 5 (1.5 past + current + 2.5 upcoming)
- Line height: 54px fixed
- Scroll: Remotion `spring()` animation (damping: 20, stiffness: 90, mass: 0.8)
- KTV mode: horizontal clip-fill per word using `overflow: hidden`, fill color white (not accent)
- Scroll mode: current line bright white, past lines soft white (0.4 opacity), future lines slightly brighter (0.55 opacity)
- Opacity decay: past lines fade faster (0.35/line), upcoming lines fade slower (0.2/line)
- Scale: current line 1.0, past lines 0.92, upcoming lines 0.94
- Long lines: `whiteSpace: normal` for natural wrapping

### Player Controls
- Progress bar: 4px height, white fill with 14px circular thumb
- Time format: m:ss
- Control icons: CSS triangles for prev/next, CSS rectangles for pause

## Lyrics Parser (`parseLyrics.ts`)

Auto-detects format by file extension:

| Format | Detection | Output |
|--------|-----------|--------|
| `.lrc` word-by-word | Multiple `[time]char` per line | LyricLine with words[] |
| `.lrc` line-by-line | Single `[time]text` per line | LyricLine without words[] |
| `.srt` | Standard SRT blocks | LyricLine without words[] |
| `.ass`/`.ssa` | Dialogue lines, strip ASS tags | LyricLine without words[] |

Usage: `parseLyrics(textContent, filename) -> LyricLine[]`

## Rendering

```bash
# Studio preview
bun run dev

# CLI render
bun remotionb render PlayerStyle out/player-style.mp4
```

## Reuse Guide

To create a video for a new song:

1. Place audio, cover image in `public/`
2. Prepare lyrics data (use `parseLyrics.ts` to convert LRC/SRT/ASS, or write manually)
3. Create a data object matching `PlayerStyleData`
4. Either update `sample-data.ts` or register a new `<Composition>` in `Root.tsx`

### Theme Color Selection

Pick `accent`, `bg1`, `bg2` from the album cover:
- `bg1`: Dominant dark color from cover
- `bg2`: Lighter analogous color
- `accent`: Complementary warm tone for highlights

### Adding Word-Level KTV

Populate `words[]` on each `LyricLine`:
```ts
{
  text: "hello world",
  start: 1,
  end: 3,
  words: [
    { text: "hello ", start: 1, end: 2 },
    { text: "world", start: 2, end: 3 },
  ]
}
```

When `words[]` is present, the current line renders word-by-word horizontal fill highlight instead of simple color change.
