# Player-Style Template Design

## Template Overview

A music player simulation composition. Renders as a static video showing a stylized music player with rotating vinyl, scrolling lyrics, and playback controls.

## Template Architecture

```
PlayerStyle (composition)
  +-- AbsoluteFill (gradient background + texture)
  +-- Audio (audio playback)
  +-- VinylDisc (left: cover + rotating vinyl)
  +-- Title / Artist / Divider
  +-- LyricsPanel (center: 5-line scrolling lyrics)
  +-- PlayerControls (bottom: progress + controls)
```

## Component Breakdown

### VinylDisc
- **Props**: `coverSrc` (resolved URL), `rotation` (degrees)
- Square album cover (440x440) positioned in front
- Vinyl record peeks from behind cover (220px offset right)
- Concentric groove pattern via CSS gradient
- Cover image in vinyl center (110px circle)
- Continuous rotation at 360deg / 8 seconds

### LyricsPanel
- **Props**: `lyrics: LyricLine[]`, `accent: string`, `visibleCount: number`
- Renders all lyrics, clips to visible window
- `translateY` driven by Remotion `spring()` for smooth scroll
- KTV mode: word-by-word fill when `words[]` present
- Scroll mode: color transition when no `words[]`
- Spring config: damping 20, stiffness 90, mass 0.8

### PlayerControls
- **Props**: `progress`, `currentTime`, `duration`
- Slim progress bar (4px) with accent fill + circular thumb
- Time display in m:ss format
- CSS-only prev/pause/next icons

## Font Stacks

Defined in `src/compositions/player-style/fonts.ts`:
- `DISPLAY_FONT` - Song title (OPPO Sans / Dream Han Sans / LXGW WenKai)
- `LYRICS_FONT` - Lyrics text (same CJK stack)
- `UI_FONT` - Time display and controls

## Data Flow

```
sample-data.ts -> PlayerStyleData -> PlayerStyle component
  +-- title, artist -> text display
  +-- audioSrc -> Audio component via staticFile()
  +-- coverSrc -> VinylDisc via staticFile()
  +-- lyrics[] -> LyricsPanel
  +-- duration -> progress calculation
  +-- theme -> background gradient + accent color
```

## Reuse for New Songs

### Step 1: Prepare Assets
Place in `public/`:
- Audio file (mp3/wav)
- Cover image (jpg/png)

### Step 2: Parse Lyrics
```ts
import { parseLyrics } from "./compositions/player-style/parseLyrics";
const lrcText = fs.readFileSync("path/to/lyrics.lrc", "utf-8");
const lyrics = parseLyrics(lrcText, "lyrics.lrc");
```

### Step 3: Create Data Object
```ts
const mySongData: PlayerStyleData = {
  title: "Song Title",
  artist: "Artist Name",
  audioSrc: "my-song.mp3",
  coverSrc: "my-cover.jpg",
  lyrics,
  duration: 240,
  theme: { accent: "#facc15", bg1: "#2f6f91", bg2: "#8fb8c6" },
};
```

### Step 4: Register Composition
Add to `Root.tsx`:
```tsx
<Composition
  id="MySongPlayer"
  component={PlayerStyleC}
  durationInFrames={mySongData.duration * 30}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{ data: mySongData }}
/>
```

### Step 5: Render
```bash
bun remotionb render MySongPlayer out/my-song.mp4
```
