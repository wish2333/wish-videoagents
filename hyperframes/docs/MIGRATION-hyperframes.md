# Hyperframes Migration Guide

## Project Structure

```
hyperframes/
  package.json              # Standalone deps (gsap, hyperframes CLI)
  white-voice/              # WhiteVoice composition (portrait music player)
    index.html              # HTML/GSAP composition
    data.js                 # Auto-generated from player-style/sample-data.ts
    meta.json               # Composition metadata
    hyperframes.json        # Hyperframes config
    assets/                 # Audio + cover image
  reading-history/          # ReadingHistory composition (landscape 1920x1080)
    index.html              # HTML/GSAP composition
    data.js                 # Auto-generated from reading-history/slides-data.ts
    meta.json / hyperframes.json
  reading-history-vertical/ # ReadingHistory portrait variant (1080x1920)
    index.html              # Portrait layout with adjusted dimensions
    data.js                 # Shared with reading-history (same data)
    meta.json / hyperframes.json
  scripts/
    convert-sample-data.mjs # player-style/sample-data.ts -> white-voice/data.js
    convert-slides-data.mjs # reading-history/slides-data.ts -> reading-history/data.js
    screenshot-compare.mjs  # Visual regression: extract frames from both outputs
  docs/
    MIGRATION-hyperframes.md
  out/                      # Rendered MP4 output
```

## How to Preview

```bash
cd hyperframes

# Preview a specific composition (opens browser studio)
bun run preview:white-voice
bun run preview:reading-history
bun run preview:reading-history-vertical

# Or use hyperframes CLI directly
npx hyperframes preview white-voice
npx hyperframes preview reading-history
```

## How to Render

```bash
cd hyperframes

# Render individual compositions
bun run render:white-voice
bun run render:reading-history
bun run render:reading-history-vertical

# Render all
bun run render:all
```

Output goes to `hyperframes/out/`.

## Data Conversion

When source data changes (e.g., new slides in `slides-data.ts` or new song in `sample-data.ts`):

```bash
cd hyperframes
bun run convert:data
```

This regenerates `white-voice/data.js` and `reading-history/data.js`.

## Linting

```bash
cd hyperframes
bun run lint
```

Checks all compositions for hyperframes compatibility (deterministic rendering, no infinite repeats, etc.).

## Known Differences from Remotion

| Aspect | Remotion | Hyperframes |
|--------|----------|-------------|
| Rendering | React component per frame | HTML + GSAP timeline |
| Animation | `spring()`, `interpolate()` | GSAP tweens with `back.out()`, `elastic.out()` |
| Timeline | `<Sequence from={frame}>` | `tl.to(el, {...}, startTimeSec)` |
| Fonts | System fonts via CSS | Same, loaded via CDN if needed |
| Audio | Remotion audio pipeline | `<audio>` element with `data-start`/`data-duration` |
| Deterministic | Frame-by-frame | Finite GSAP repeats, no `Date.now()`/`Math.random()` |

### LyricsPanel Differences

- **Remotion**: Per-frame recalculation with `useCurrentFrame()`, supports word-level highlight via clip-reveal
- **Hyperframes**: GSAP timeline with line-level animations only (word-level deferred)
- **Multiline lyrics**: Hyperframes handles wrapping correctly with dynamic height measurement; Remotion clips at fixed height

## Adding New Compositions

1. Create directory: `hyperframes/my-composition/`
2. Add `meta.json` with `id`, `name`, `createdAt`
3. Add `hyperframes.json` with standard paths config
4. Create `index.html` with:
   - `<div data-composition-id="MyComp" data-start="0" data-duration="..." data-width="..." data-height="...">`
   - GSAP timeline registered on `window.__timelines["MyComp"]`
5. Add `data.js` with composition data (or create conversion script)
6. Add preview/render scripts to `package.json`
7. Run `npx hyperframes lint` to verify
