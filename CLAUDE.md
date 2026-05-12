# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A triple-engine programmatic video production system. The project runs three rendering pipelines in parallel:

- **Remotion** (React/TypeScript) — Frame-by-frame rendering via React components. Used for MangaRecommend, ReadingHistory, and PlayerStyle compositions.
- **Hyperframes** (HTML/GSAP) — HTML-native video framework by HeyGen. Used for ReadingHistory and WhiteVoice (PlayerStyle) compositions with simpler HTML+GSAP timelines.
- **Motion Canvas** (TypeScript/Canvas) — Generator-based canvas rendering framework with built-in FFmpeg export and browser-based editor. Used for ReadingHistory (landscape) composition.

All engines share the same data sources but have independent rendering pipelines with full file isolation.

## Commands

### Remotion Pipeline (root directory)

```bash
bun run dev                       # Start Remotion Studio (live preview)
bun run build                     # Bundle for rendering
bun run lint                      # ESLint + TypeScript check (eslint src && tsc)
bun run render:manga              # Render manga landscape to out/manga.mp4
bun run render:manga-vertical     # Render manga portrait to out/manga-vertical.mp4
bun remotionb render ReadingHistory out/reading-history.mp4
bun remotionb render PlayerStyle out/player-style.mp4
```

### Hyperframes Pipeline (hyperframes/ directory)

```bash
cd hyperframes

# Preview (opens browser studio)
bun run preview:white-voice
bun run preview:reading-history
bun run preview:reading-history-vertical

# Render to MP4
bun run render:white-voice
bun run render:reading-history
bun run render:reading-history-vertical
bun run render:all

# Data conversion (regenerate data.js from TypeScript sources)
bun run convert:data

# Lint all compositions
bun run lint
```

### Motion Canvas Pipeline (motion-canvas/ directory)

```bash
cd motion-canvas

# Visual editor (opens browser with timeline scrubbing and live preview)
bun run dev

# Build for production
bun run build

# Data conversion (regenerate from TypeScript sources)
bun run convert:data
```

Root-level proxy commands:

```bash
bun run motion-canvas:dev          # Open editor
bun run motion-canvas:build        # Build for production
bun run motion-canvas:convert:data # Regenerate data
```

**Rendering to MP4**: Motion Canvas renders through the browser editor UI. After running `bun run dev`, open the editor, use the timeline to scrub, then click "RENDER" in the editor to export frames. The `@motion-canvas/ffmpeg` plugin adds a "Video" exporter option that encodes frames to MP4 via FFmpeg.

## Architecture

### Triple-Engine Layout

```
videoagent/
  src/                  # Remotion pipeline (React/TypeScript)
  hyperframes/          # Hyperframes pipeline (HTML/GSAP) — fully isolated
  motion-canvas/        # Motion Canvas pipeline (TypeScript/Canvas) — fully isolated
  public/               # Shared static assets (audio, images)
  out/                  # Remotion output
  hyperframes/out/      # Hyperframes output
  motion-canvas/output/ # Motion Canvas output
```

The three pipelines are completely independent: separate `package.json`, separate `node_modules`, separate build toolchains. They share only the data sources (`slides-data.ts`, `sample-data.ts`) via conversion scripts.

### Remotion Compositions

#### Composition Registration

`src/Root.tsx` registers all Remotion compositions. Each `<Composition>` binds a component ID, dimensions, FPS, duration, and default props. Currently registered: 14 MangaRecommend theme variants + 6 ReadingHistory variants + 1 PlayerStyle.

#### Three Composition Systems

**MangaRecommend** (`src/compositions/manga-recommend/`) — Theme-driven. A single component template accepts a `themeName` prop and pulls visual tokens from the theme registry. Structure: title card, hook slide, work card, highlight cards, audience tags, outro.

**ReadingHistory** (`src/compositions/reading-history/`) — Data-driven. Slide data in `slides-data.ts` drives a timeline of heterogeneous slide types (title, timeline-marker, narrative, quote, works-grid, closing, outro). Each slide type maps to its own component. This composition has its own font system in `fonts.ts` that is independent of the theme system.

**PlayerStyle** (`src/compositions/player-style/`) — Data-driven. Accepts a `PlayerStyleData` prop containing song metadata, pre-parsed lyrics, cover-derived theme colors, and asset paths. Layout: rotating vinyl disc + cover (left), song info + scrolling lyrics + player controls (right). Includes a lyrics parser (`parseLyrics.ts`) supporting LRC (word-by-word / line-by-line), SRT, and ASS formats. Visual styling is self-contained via `PlayerThemeColors`, not the shared theme system.

### Hyperframes Compositions

**WhiteVoice** (`hyperframes/white-voice/`) — Music player with vinyl disc, scrolling lyrics, and player controls. Single HTML file with GSAP timeline. Data generated from `player-style/sample-data.ts` via `scripts/convert-sample-data.mjs`.

**ReadingHistory** (`hyperframes/reading-history/`) — Reading timeline with 6 slide types (title, timeline-marker, narrative, quote, works-grid, closing, outro). Landscape 1920x1080. Data generated from `reading-history/slides-data.ts` via `scripts/convert-slides-data.mjs`.

**ReadingHistory Vertical** (`hyperframes/reading-history-vertical/`) — Portrait variant (1080x1920) with adjusted layout parameters. Shares data.js with the landscape version.

### Motion Canvas Compositions

**ReadingHistory** (`motion-canvas/src/scenes/reading-history.tsx`) — Reading timeline with generator-based scene rendering. Uses `makeScene2D` to iterate through 45 slides, rendering each type (title, timeline-marker, narrative, quote, works-grid, closing, outro) with Canvas 2D nodes and `yield*` animations. Data from `motion-canvas/src/data/reading-history.ts` (converted from `reading-history/slides-data.ts`). Layout utilities in `motion-canvas/src/lib/`.

### Motion Canvas Pipeline Conventions

- **Animation** uses generator coroutines (`yield*`) with `@motion-canvas/2d` node tweens. `chain()` for sequential, `all()` for simultaneous animations.
- **Timing** is in seconds. Data conversion divides frame durations by FPS (30).
- **Rendering target** is HTML Canvas 2D (not DOM). Uses Layout component with flexbox for positioning.
- **JSX** is handled by `@motion-canvas/vite-plugin` at Vite build time. Do not run `tsc` directly on Motion Canvas files.
- **Data pipeline**: TypeScript data files are converted via `motion-canvas/scripts/`. Run `bun run convert:data` after source data changes.
- **Dev server**: `vite` launches a browser-based editor (`@motion-canvas/ui`) with timeline scrubbing and parameter adjustment.
- **Rendering**: Uses `@motion-canvas/ffmpeg` plugin for MP4 export. Requires FFmpeg installed on the system.
- **Signals**: Every node property is a signal. Call with no args to get, with value to set, with value + duration to tween.

### Theme System (`src/styles/`) — Remotion only

- `types.ts` — `Theme` interface (colors, fonts, typography, effects, spacing, layout, animation, fps)
- `themes/*.ts` — 14 theme definitions (dark, warm, tokyo-night, cyberpunk-neon, nord, dracula, aurora, vaporwave, neo-brutalism, sunset-warm, minimal-white, gruvbox-dark, rose-pine, glassmorphism)
- `registry.ts` — `getTheme(name)` and `registerTheme(name, theme)`; falls back to `dark`
- `context.tsx` — React context provider; components access via `useTheme()`

The MangaRecommend composition uses this theme system. ReadingHistory and PlayerStyle do **not** use it; they have their own inline styling and font stacks. Hyperframes compositions have no theme system — styling is inline in HTML.

### Shared Components (`src/components/`) — Remotion only

TitleCard, Subtitle, Outro, FadeTransition, ImageMontage — used by MangaRecommend. These consume `useTheme()` for styling.

### Design Language

`DESIGN-Apple.md` defines an Apple-inspired design system (ReadingHistory). `DESIGN-Player.md` defines the player-style design system (PlayerStyle). These apply to both Remotion and Hyperframes versions of the same compositions.

## Key Conventions

### Remotion Pipeline

- **Font stacks** are centralized per composition in `fonts.ts`. ReadingHistory uses `DISPLAY_FONT`, `BODY_FONT`, `QUOTE_FONT`. PlayerStyle uses `DISPLAY_FONT`, `LYRICS_FONT`, `UI_FONT`. Do not hardcode font-family in individual components.
- **Animation** uses Remotion's `spring()` and `interpolate()` — never CSS animations or transitions.
- **Styling** is inline `React.CSSProperties` objects (no CSS modules, no styled-components). Tailwind v4 is configured but primarily for utility needs.
- **Tailwind** is enabled via `@remotion/tailwind-v4` in `remotion.config.ts`.
- **Frame timing**: All durations are in frames. Default FPS is 30 (1 second = 30 frames). ReadingHistory slide durations in `slides-data.ts` are aligned to SRT subtitle timestamps.
- **Static assets** (audio, images) placed in `public/` are accessed via Remotion's `staticFile()` function.
- **Card sizing**: NarrativeSlide auto-sizes work cards by count (1 work: 400x530, 2: 360x470, 3+: 260x347). Set `cardSize?: [w, h]` on a slide to override. Used for: audio drama covers (s2-n5 to s4) at `[320,320]`, CV photos at `[200,200]`, Given at `[600,450]`.

### Hyperframes Pipeline

- **Animation** uses GSAP timelines (`{ paused: true }`) registered on `window.__timelines["composition-id"]`.
- **Timing** is in seconds (not frames). Conversion: `frames / FPS = seconds`.
- **Deterministic rendering** required: no `repeat: -1`, no `Date.now()`, no `Math.random()`. Use finite repeat counts.
- **Data pipeline**: TypeScript data files are converted to plain JavaScript (`data.js`) via scripts in `hyperframes/scripts/`. Run `bun run convert:data` after source data changes.
- **`data-*` attributes** on the root element: `data-composition-id`, `data-start`, `data-duration`, `data-width`, `data-height`. Audio elements use `data-track-index`, `data-start`, `data-duration`.
- **Linting**: `npx hyperframes lint` checks for deterministic rendering issues, missing media, and caption exit safety.

### Shared Conventions

- **No emoji in code** — emoji characters can cause rendering issues in the terminal and build pipeline.
- **Immutability** — never mutate objects in place; always return new objects.
- **Package manager**: bun. The Remotion CLI is invoked as `remotionb` (bun-native). Hyperframes CLI is `npx hyperframes`.

## Project Structure

```
src/                              # Remotion pipeline (React/TypeScript)
  index.ts                        # Entry point (registerRoot)
  Root.tsx                        # All Composition registrations
  components/                     # Shared components (TitleCard, Subtitle, Outro, etc.)
  styles/                         # Theme system (types, registry, context, 14 themes)
  compositions/
    manga-recommend/              # Theme-driven manga recommendation template
    reading-history/              # Data-driven reading timeline template
      fonts.ts                    # Centralized font stacks
      slides-data.ts              # All slide content and frame durations
      types.ts                    # Slide type definitions
      components/                 # Per-slide-type components
    player-style/                 # Data-driven music player lyric video template
      types.ts                    # LyricWord, LyricLine, PlayerStyleData
      parseLyrics.ts              # LRC/SRT/ASS unified lyrics parser
      fonts.ts                    # Centralized font stacks
      sample-data.ts              # Demo song data
      index.tsx                   # Main composition
      components/                 # VinylDisc, LyricsPanel, PlayerControls
hyperframes/                      # Hyperframes pipeline (HTML/GSAP) — isolated
  package.json                    # Standalone dependencies (gsap, hyperframes)
  white-voice/                    # WhiteVoice composition (music player)
    index.html                    # HTML/GSAP composition
    data.js                       # Generated from player-style/sample-data.ts
    assets/                       # Audio + cover image
  reading-history/                # ReadingHistory landscape (1920x1080)
    index.html                    # HTML/GSAP composition
    data.js                       # Generated from reading-history/slides-data.ts
  reading-history-vertical/       # ReadingHistory portrait (1080x1920)
    index.html                    # Portrait layout variant
    data.js                       # Shared with reading-history
  scripts/
    convert-sample-data.mjs       # sample-data.ts -> white-voice/data.js
    convert-slides-data.mjs       # slides-data.ts -> reading-history/data.js
    screenshot-compare.mjs        # Visual regression: frame extraction + comparison
  out/                            # Hyperframes rendered output
motion-canvas/                    # Motion Canvas pipeline (TypeScript/Canvas) — isolated
  package.json                    # Standalone dependencies (@motion-canvas/2d, @motion-canvas/core, etc.)
  vite.config.ts                  # Vite config with @motion-canvas/vite-plugin and @motion-canvas/ffmpeg
  tsconfig.json                   # TypeScript config with JSX support
  src/
    project.ts                    # makeProject with scene list
    scenes/
      reading-history.tsx         # ReadingHistory scene (generator-based)
    lib/
      fonts.ts                    # Font stacks (shared with Remotion)
      layout.ts                   # Canvas dimensions, colors, spacing
      animation.ts                # Animation helpers (fadeIn, fadeOut, slideIn)
      slide-renderers.tsx         # Per-slide-type rendering functions
    data/
      reading-history.ts          # Converted slide data (auto-generated)
  scripts/
    convert-slides-data.mjs       # slides-data.ts -> reading-history.ts
  output/                         # Motion Canvas rendered output
docs/                             # Design docs, workflow guides, image checklists
public/                           # Shared static assets (audio, cover images)
out/                              # Remotion rendered output
```

## Development Environment

- **OS**: Windows 11
- **Runtime**: Python 3.11+ / Node 20+
- **Package Manager (frontend)**: bun
- **Package Manager (backend)**: uv
- **Build Check (Remotion)**: `bun run build`
- **Lint Check (Hyperframes)**: `cd hyperframes && bun run lint`
# currentDate
Today's date is 2026/05/12.
