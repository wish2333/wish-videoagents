# Motion Canvas Pipeline Guide

## Overview

Motion Canvas is the fourth rendering pipeline in the videoagent project. It uses TypeScript generator functions (`yield*`) with a JSX scene graph to create canvas-based animations. Compared to Revideo, Motion Canvas has a more mature ecosystem with built-in FFmpeg export, a richer component set, and a browser-based editor with timeline scrubbing.

## Project Structure

```
motion-canvas/
  package.json                # Standalone deps (@motion-canvas/2d, core, vite-plugin, ffmpeg, ui)
  vite.config.ts              # Vite config with motionCanvas() and ffmpeg() plugins
  tsconfig.json               # TypeScript config with JSX support
  src/
    project.ts                # makeProject entry point, registers scenes
    scenes/
      reading-history.tsx     # ReadingHistory scene (45 slides, generator-based)
    lib/
      fonts.ts                # Font stacks (shared with Remotion/Hyperframes)
      layout.ts               # Canvas dimensions, colors, spacing constants
      animation.ts            # Animation duration constants and re-exports
      slide-renderers.tsx     # Per-slide-type rendering functions (6 types)
    data/
      reading-history.ts      # Auto-generated from slides-data.ts (frames -> seconds)
  scripts/
    convert-slides-data.mjs   # slides-data.ts -> src/data/reading-history.ts
  docs/
    MIGRATION-motion-canvas.md
  output/                     # Rendered frames and video output
```

## Commands

From `motion-canvas/` directory:

```bash
# Visual editor (opens browser with timeline scrubbing and live preview)
bun run dev

# Build for production
bun run build

# Data conversion (regenerate from TypeScript sources)
bun run convert:data
```

From project root (proxy commands):

```bash
bun run motion-canvas:dev
bun run motion-canvas:build
bun run motion-canvas:convert:data
```

## How to Preview

```bash
cd motion-canvas
bun run dev
```

Opens the Motion Canvas editor in your browser at `http://localhost:9000/`. The editor provides:

- **Timeline scrubbing** — drag to any point in the animation
- **Live preview** — see changes in real-time
- **Parameter adjustment** — tweak signals and properties
- **Stage view** — canvas rendering of the current frame

## How to Render to MP4

Motion Canvas renders through the browser editor UI:

1. Run `bun run dev` to start the editor
2. Open the editor in your browser
3. Use the timeline to preview the animation
4. Click "RENDER" in the editor toolbar
5. Select "Video" as the export format (provided by `@motion-canvas/ffmpeg`)
6. Configure output settings (resolution, FPS, quality)
7. Click "Render" to start encoding

The `@motion-canvas/ffmpeg` plugin sends rendered frames to a Node.js server that uses FFmpeg to encode the video. Output goes to `motion-canvas/output/`.

**Requirements**: FFmpeg must be installed and available in PATH.

## Data Conversion

When source data changes (e.g., new slides in `slides-data.ts`):

```bash
cd motion-canvas
bun run convert:data
```

This reads `src/compositions/reading-history/slides-data.ts`, extracts the slide array, converts frame durations to seconds (divides by 30fps), and writes to `src/data/reading-history.ts`.

## Key Differences from Revideo

| Aspect | Revideo | Motion Canvas |
|--------|---------|---------------|
| Package scope | `@revideo/2d`, `@revideo/core` | `@motion-canvas/2d`, `@motion-canvas/core` |
| JSX import source | `@revideo/2d/lib` | `@motion-canvas/2d/lib` |
| Plugin | `@revideo/vite-plugin` | `@motion-canvas/vite-plugin` |
| FFmpeg export | Puppeteer + manual FFmpeg | Built-in `@motion-canvas/ffmpeg` plugin |
| Editor | Basic Vite dev server | Full-featured browser editor (`@motion-canvas/ui`) |
| Components | `Rect`, `Circle`, `Txt`, `Layout`, `Line`, `Img` | Same + `Code`, `Latex`, `Path`, `Spline`, `Polygon`, `Ray` |
| Signal API | `createSignal()` | Same, plus property-level signals on nodes |
| Rendering | Headless Puppeteer | Browser-based editor with FFmpeg plugin |

## Key Differences from Remotion

| Aspect | Remotion | Motion Canvas |
|--------|----------|---------------|
| Rendering | React component per frame | Generator-based scene with `yield*` |
| Animation | `spring()`, `interpolate()` | Signal tweens: `node.property(value, duration)` |
| Timeline | `<Sequence from={frame}>` | Generator flow: `all()`, `chain()`, `sequence()`, `waitFor()` |
| Layout | CSS flexbox (DOM) | Canvas 2D with `Layout` component (flexbox-like) |
| Timing | Frames (30fps) | Seconds |
| Styling | Inline CSSProperties | Component props (`fill`, `stroke`, `fontSize`, etc.) |
| References | React `ref` | `createRef<T>()` — callable to get node instance |

## Slide Type Renderers

Each slide type has a dedicated generator function in `src/lib/slide-renderers.tsx`:

| Function | Slide Type | Description |
|----------|-----------|-------------|
| `renderTitleCard` | `title` | White background, centered title/subtitle with fade-in |
| `renderTimelineMarker` | `timeline-marker` | Large year + animated line + era label |
| `renderNarrativeSlide` | `narrative`, `closing` | Text + optional work cards (3 layout modes) |
| `renderQuoteSlide` | `quote` | Dark background, decorative quote mark, attribution |
| `renderWorksShowcase` | `works-grid` | Grid of up to 6 work cards with stagger animation |
| `renderOutro` | `outro` | Channel name + message, centered |

### Animation Pattern

Each renderer follows the same pattern:

```typescript
export function* renderXxx(view: View2D, slide: XxxSlide) {
  clearView(view);                    // Remove previous slide
  // 1. Add nodes to view via JSX
  view.add(<Rect>...</Rect>);
  // 2. Fade in
  yield* bg().opacity(1, FADE_DURATION);
  // 3. Animate content
  yield* textNode().opacity(1, TEXT_OPACITY_DURATION);
  // 4. Hold for remaining duration
  yield* waitFor(holdTime);
  // 5. Fade out
  yield* bg().opacity(0, FADE_DURATION);
}
```

### Animation Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `FADE_DURATION` | 0.267s | Slide fade in/out (8 frames / 30fps) |
| `TEXT_OPACITY_DURATION` | 0.67s | Text element fade-in |
| `CARD_SPRING_DURATION` | 0.6s | Work card scale-in with `easeOutBack` |
| `CARD_STAGGER_INTERVAL` | 0.2s | Delay between card animations |
| `TIMELINE_LINE_DURATION` | 0.83s | Timeline marker line width animation |

## Adding New Compositions

1. Create scene file: `src/scenes/my-composition.tsx`
2. Export a `makeScene2D(function* (view) {...})` generator
3. Register in `src/project.ts`:
   ```typescript
   import myComposition from './scenes/my-composition?scene';
   export default makeProject({
     scenes: [readingHistory, myComposition],
   });
   ```
4. Add data conversion script if needed: `scripts/convert-my-data.mjs`
5. Add scripts to `package.json`

## Troubleshooting

### "motionCanvas is not a function"

The `@motion-canvas/vite-plugin` is CJS-only. If you get this error, make sure `package.json` does NOT have `"type": "module"`.

### "Cannot find module '@motion-canvas/ui'"

Install the UI package: `bun add @motion-canvas/ui`

### FFmpeg not found

Ensure FFmpeg is installed and in PATH:
```bash
ffmpeg -version
```

### Build fails with JSX errors

Make sure scene files use `.tsx` extension (not `.ts`). The Vite plugin handles JSX transformation.
