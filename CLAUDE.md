# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Remotion-based programmatic video production system. Videos are React components rendered frame-by-frame into MP4 files. The project currently produces three video formats: manga recommendation shorts, reading-history narrative videos, and player-style music lyric videos.

## Commands

```bash
bun run dev          # Start Remotion Studio (live preview)
bun run build        # Bundle for rendering
bun run lint         # ESLint + TypeScript check (eslint src && tsc)
bun run render:manga              # Render manga landscape to out/manga.mp4
bun run render:manga-vertical     # Render manga portrait to out/manga-vertical.mp4
```

Rendering other compositions requires the CLI directly:
```bash
bun remotionb render ReadingHistory out/reading-history.mp4
bun remotionb render PlayerStyle out/player-style.mp4
```

## Architecture

### Composition Registration

`src/Root.tsx` registers all Remotion compositions. Each `<Composition>` binds a component ID, dimensions, FPS, duration, and default props. Currently registered: 14 MangaRecommend theme variants + 6 ReadingHistory variants + 1 PlayerStyle.

### Three Composition Systems

**MangaRecommend** (`src/compositions/manga-recommend/`) — Theme-driven. A single component template accepts a `themeName` prop and pulls visual tokens from the theme registry. Structure: title card, hook slide, work card, highlight cards, audience tags, outro.

**ReadingHistory** (`src/compositions/reading-history/`) — Data-driven. Slide data in `slides-data.ts` drives a timeline of heterogeneous slide types (title, timeline-marker, narrative, quote, works-grid, closing, outro). Each slide type maps to its own component. This composition has its own font system in `fonts.ts` that is independent of the theme system.

**PlayerStyle** (`src/compositions/player-style/`) — Data-driven. Accepts a `PlayerStyleData` prop containing song metadata, pre-parsed lyrics, cover-derived theme colors, and asset paths. Layout: rotating vinyl disc + cover (left), song info + scrolling lyrics + player controls (right). Includes a lyrics parser (`parseLyrics.ts`) supporting LRC (word-by-word / line-by-line), SRT, and ASS formats. Visual styling is self-contained via `PlayerThemeColors`, not the shared theme system.

### Theme System (`src/styles/`)

- `types.ts` — `Theme` interface (colors, fonts, typography, effects, spacing, layout, animation, fps)
- `themes/*.ts` — 14 theme definitions (dark, warm, tokyo-night, cyberpunk-neon, nord, dracula, aurora, vaporwave, neo-brutalism, sunset-warm, minimal-white, gruvbox-dark, rose-pine, glassmorphism)
- `registry.ts` — `getTheme(name)` and `registerTheme(name, theme)`; falls back to `dark`
- `context.tsx` — React context provider; components access via `useTheme()`

The MangaRecommend composition uses this theme system. ReadingHistory and PlayerStyle do **not** use it; they have their own inline styling and font stacks.

### Shared Components (`src/components/`)

TitleCard, Subtitle, Outro, FadeTransition, ImageMontage — used by MangaRecommend. These consume `useTheme()` for styling.

### Design Language

`DESIGN-Apple.md` defines an Apple-inspired design system (ReadingHistory). `DESIGN-Player.md` defines the player-style design system (PlayerStyle).

## Key Conventions

- **Font stacks** are centralized per composition in `fonts.ts`. ReadingHistory uses `DISPLAY_FONT`, `BODY_FONT`, `QUOTE_FONT`. PlayerStyle uses `DISPLAY_FONT`, `LYRICS_FONT`, `UI_FONT`. Do not hardcode font-family in individual components.
- **Animation** uses Remotion's `spring()` and `interpolate()` — never CSS animations or transitions.
- **Styling** is inline `React.CSSProperties` objects (no CSS modules, no styled-components). Tailwind v4 is configured but primarily for utility needs.
- **Tailwind** is enabled via `@remotion/tailwind-v4` in `remotion.config.ts`.
- **Frame timing**: All durations are in frames. Default FPS is 30 (1 second = 30 frames). ReadingHistory slide durations in `slides-data.ts` are aligned to SRT subtitle timestamps.
- **No emoji in code** — emoji characters can cause rendering issues in the terminal and build pipeline.
- **Immutability** — never mutate objects in place; always return new objects.
- **Package manager**: bun. The Remotion CLI is invoked as `remotionb` (bun-native).
- **Static assets** (audio, images) placed in `public/` are accessed via Remotion's `staticFile()` function.

## Project Structure

```
src/
  index.ts              # Entry point (registerRoot)
  Root.tsx              # All Composition registrations
  components/           # Shared components (TitleCard, Subtitle, Outro, etc.)
  styles/               # Theme system (types, registry, context, 14 themes)
  compositions/
    manga-recommend/    # Theme-driven manga recommendation template
    reading-history/    # Data-driven reading timeline template
      fonts.ts          # Centralized font stacks
      slides-data.ts    # All slide content and frame durations
      types.ts          # Slide type definitions
      components/       # Per-slide-type components
    player-style/       # Data-driven music player lyric video template
      types.ts          # LyricWord, LyricLine, PlayerStyleData
      parseLyrics.ts    # LRC/SRT/ASS unified lyrics parser
      fonts.ts          # Centralized font stacks
      sample-data.ts    # Demo song data
      index.tsx         # Main composition
      components/       # VinylDisc, LyricsPanel, PlayerControls
docs/                   # Design docs, workflow guides, image checklists
public/                 # Static assets (audio, cover images)
```

## Development Environment

- **OS**: Windows 11
- **Runtime**: Python 3.11+ / Node 20+
- **Package Manager (frontend)**: bun
- **Package Manager (backend)**: uv
- **Build Check (frontend)**: bun run build
# currentDate
Today's date is 2026/05/12.
