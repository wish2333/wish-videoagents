# Plan: Add Motion Canvas as Fourth Rendering Pipeline

## Requirements Restatement

Add Motion Canvas (https://github.com/motion-canvas/motion-canvas) as a fourth rendering pipeline to the videoagent project:
- **File isolation**: Complete isolation like `revideo/` and `hyperframes/` — own `package.json`, `node_modules`, build toolchain
- **Composition**: Migrate ReadingHistory landscape (1920x1080, 45 slides) to Motion Canvas
- **Data pipeline**: Conversion script from canonical `slides-data.ts` to Motion Canvas format
- **Root proxy scripts**: `motion-canvas:dev`, `motion-canvas:render:reading-history`, `motion-canvas:convert:data`

## Architecture Analysis

### Motion Canvas vs Revideo — Key Similarities
Both frameworks share nearly identical paradigms, making migration straightforward:

| Aspect | Revideo | Motion Canvas |
|--------|---------|---------------|
| Scene creation | `makeScene2D(function* (view) {...})` | `makeScene2D(function* (view) {...})` |
| Animation | `yield*` generator coroutines | `yield*` generator coroutines |
| Flow control | `chain()`, `all()`, `sequence()`, `waitFor()` | `chain()`, `all()`, `sequence()`, `waitFor()` |
| References | `createRef<T>()` | `createRef<T>()` |
| JSX scene graph | Custom JSX factory (not React) | Custom JSX factory (not React) |
| Components | `Rect`, `Circle`, `Txt`, `Layout`, `Line`, `Img` | `Rect`, `Circle`, `Txt`, `Layout`, `Line`, `Img`, `Path`, `Code`, `Latex` |
| Build | Vite + custom plugin | Vite + custom plugin |
| Scene import | `?scene` suffix | `?scene` suffix |
| Project config | `makeProject({ scenes })` | `makeProject({ scenes })` |
| Easing | `easeInOutCubic`, `easeOutQuad`, etc. | `easeInOutCubic`, `easeOutQuad`, etc. |
| Signals | `createSignal()` | `createSignal()` |

### Motion Canvas Advantages Over Revideo
- **Mature rendering pipeline**: Built-in FFmpeg plugin for MP4 export (`@motion-canvas/ffmpeg`)
- **Richer component set**: `Code`, `Latex`, `Path`, `Spline`, `Polygon`, `Ray`, `Video`
- **Better editor**: Browser-based UI with timeline scrubbing, parameter adjustment, and live preview
- **Player embedding**: `<animation-player>` custom element for web embedding
- **Active ecosystem**: Larger community, more examples, better documentation
- **Signal-driven reactivity**: Property tweens are first-class — `circle().fill('#red', 1)` directly

### Rendering Pipeline
Motion Canvas renders via browser + FFmpeg:
1. Dev server runs `@motion-canvas/ui` editor in browser
2. Editor renders animation on HTML Canvas in real-time
3. Click "RENDER" to capture frames to `/output` directory
4. `@motion-canvas/ffmpeg` plugin encodes frames to MP4 via Node.js FFmpeg bridge

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| FFmpeg plugin requires FFmpeg installed on system | HIGH | Check FFmpeg availability in setup; document installation |
| Rendering is browser-based, not headless by default | MEDIUM | Can use Puppeteer to automate the editor for CI/CD |
| Motion Canvas uses npm (not bun) | LOW | Use `bun install` which is npm-compatible |
| Scene import `?scene` suffix may conflict with Vite config | LOW | Standard Motion Canvas pattern, well-documented |
| 45 slides with complex layouts — scene file may get large | MEDIUM | Split into per-slide-type renderer functions (same pattern as Revideo) |

## Implementation Phases

### Phase 1: Project Scaffolding
**Goal**: Create the `motion-canvas/` directory with working dev server

1. Create `motion-canvas/` directory structure:
   ```
   motion-canvas/
     package.json
     vite.config.ts
     tsconfig.json
     src/
       project.ts
       scenes/
         reading-history.tsx
       lib/
         fonts.ts
         layout.ts
         animation.ts
         slide-renderers.ts
       data/
         reading-history.ts
     scripts/
       convert-slides-data.mjs
     output/
     public/
   ```

2. Create `package.json`:
   - Dependencies: `@motion-canvas/2d`, `@motion-canvas/core`, `@motion-canvas/vite-plugin`, `@motion-canvas/ffmpeg`
   - Dev dependencies: `typescript`, `vite`
   - Scripts: `dev`, `render:reading-history`, `convert:data`

3. Create `vite.config.ts`:
   ```typescript
   import {defineConfig} from 'vite';
   import motionCanvas from '@motion-canvas/vite-plugin';
   import ffmpeg from '@motion-canvas/ffmpeg';

   export default defineConfig({
     plugins: [motionCanvas(), ffmpeg()],
   });
   ```

4. Create `tsconfig.json` — target ES2022, JSX preserve (handled by Vite plugin)

5. Create `src/project.ts`:
   ```typescript
   import {makeProject} from '@motion-canvas/core';
   import readingHistory from './scenes/reading-history?scene';

   export default makeProject({
     scenes: [readingHistory],
   });
   ```

6. Install dependencies and verify dev server starts

### Phase 2: Data Conversion Script
**Goal**: Convert canonical `slides-data.ts` to Motion Canvas TypeScript format

1. Create `scripts/convert-slides-data.mjs`:
   - Read `src/compositions/reading-history/slides-data.ts`
   - Extract slide data (same regex approach as Hyperframes/Revideo)
   - Convert frame durations to seconds (`frames / 30`)
   - Output TypeScript module to `src/data/reading-history.ts`
   - Export typed data matching the slide type definitions

2. Data format (same as Revideo):
   ```typescript
   export const readingHistoryData = {
     title: "...",
     subtitle: "...",
     channelName: "...",
     totalDurationSeconds: 774.9,
     slides: [
       { id: "...", type: "title", durationSeconds: 14.97, ... },
       // ...
     ],
   };
   ```

3. Run conversion and verify output

### Phase 3: Library Modules
**Goal**: Create shared utility modules for the scene

1. `src/lib/fonts.ts`:
   - Same font stacks as Remotion/Revideo: `DISPLAY_FONT`, `BODY_FONT`, `QUOTE_FONT`
   - Motion Canvas uses `fontFamily` prop on `Txt` components

2. `src/lib/layout.ts`:
   - Canvas dimensions: 1920x1080
   - Color constants (background #1a1a2e, text #f0f0f0, accent #4a9eff, etc.)
   - Spacing constants
   - Card dimension presets (SINGLE, DUAL, MANY)

3. `src/lib/animation.ts`:
   - Fade duration constant: 0.267s (8 frames / 30fps)
   - Text opacity duration: 0.67s
   - Card spring duration: 0.6s with `back.out(1.4)` easing
   - Card stagger interval: 0.2s
   - Helper functions wrapping Motion Canvas's `all()`, `chain()`, `sequence()`, `waitFor()`

4. `src/lib/slide-renderers.ts`:
   - One function per slide type, each returns a generator that adds nodes to `view` and animates them
   - Functions: `renderTitleCard`, `renderTimelineMarker`, `renderNarrativeSlide`, `renderQuoteSlide`, `renderWorksShowcase`, `renderOutro`
   - Each function follows the pattern: add nodes → animate in → yield* duration → animate out → remove

### Phase 4: Scene Implementation
**Goal**: Create the ReadingHistory scene

1. `src/scenes/reading-history.tsx`:
   ```tsx
   import {makeScene2D} from '@motion-canvas/2d';
   import {readingHistoryData} from '../data/reading-history';
   import {renderTitleCard, renderTimelineMarker, ...} from '../lib/slide-renderers';

   const SLIDE_RENDERERS = {
     'title': renderTitleCard,
     'timeline-marker': renderTimelineMarker,
     'narrative': renderNarrativeSlide,
     'closing': renderNarrativeSlide,
     'quote': renderQuoteSlide,
     'works-grid': renderWorksShowcase,
     'outro': renderOutro,
   };

   export default makeScene2D(function* (view) {
     view.fill('#1a1a2e');

     for (const slide of readingHistoryData.slides) {
       const renderer = SLIDE_RENDERERS[slide.type];
       yield* renderer(view, slide);
     }
   });
   ```

2. Implement each slide renderer using Motion Canvas components:
   - **TitleCard**: `<Rect>` background + `<Txt>` title/subtitle, centered layout
   - **TimelineMarker**: `<Txt>` year (large) + `<Rect>` line + `<Txt>` era label
   - **NarrativeSlide**: `<Txt>` text + work cards (`<Rect>` + `<Img>` + `<Txt>`)
   - **QuoteSlide**: Dark `<Rect>` bg + decorative `<Txt>` quote mark + content
   - **WorksShowcase**: Grid of `<Rect>` cards with `<Img>` + `<Txt>`
   - **Outro**: Centered `<Txt>` message + channel name

3. Animation pattern per slide:
   ```typescript
   function* renderTitleCard(view: View2D, slide: TitleSlide) {
     const bg = createRef<Rect>();
     const title = createRef<Txt>();
     view.add(
       <Rect ref={bg} opacity={0} ...>
         <Txt ref={title} text={slide.title} ... />
       </Rect>
     );
     // Fade in
     yield* all(
       bg().opacity(1, 0.267),
     );
     // Hold
     yield* waitFor(slide.durationSeconds - 0.534);
     // Fade out
     yield* bg().opacity(0, 0.267);
     // Remove
     bg().remove();
   }
   ```

### Phase 5: Root Integration
**Goal**: Add proxy scripts to root `package.json`

1. Add to root `package.json` scripts:
   ```json
   "motion-canvas:dev": "cd motion-canvas && bun run dev",
   "motion-canvas:render:reading-history": "cd motion-canvas && bun run render:reading-history",
   "motion-canvas:convert:data": "cd motion-canvas && bun run convert:data"
   ```

2. Update `CLAUDE.md` with Motion Canvas pipeline documentation

### Phase 6: Testing & Verification
**Goal**: Verify the full pipeline works end-to-end

1. Run `bun run motion-canvas:dev` — verify browser editor opens and scene renders
2. Run `bun run motion-canvas:convert:data` — verify data conversion
3. Run `bun run motion-canvas:render:reading-history` — verify MP4 output
4. Compare output visually with Remotion/Hyperframes versions

## File Inventory

| File | Purpose | Lines (est.) |
|------|---------|-------------|
| `motion-canvas/package.json` | Dependencies & scripts | 30 |
| `motion-canvas/vite.config.ts` | Vite + Motion Canvas plugin | 15 |
| `motion-canvas/tsconfig.json` | TypeScript config | 20 |
| `motion-canvas/src/project.ts` | Project entry point | 15 |
| `motion-canvas/src/scenes/reading-history.tsx` | Main scene | 80 |
| `motion-canvas/src/lib/fonts.ts` | Font stacks | 20 |
| `motion-canvas/src/lib/layout.ts` | Dimensions, colors, spacing | 60 |
| `motion-canvas/src/lib/animation.ts` | Animation helpers | 40 |
| `motion-canvas/src/lib/slide-renderers.ts` | Per-slide-type renderers | 400 |
| `motion-canvas/src/data/reading-history.ts` | Auto-generated data | 500+ |
| `motion-canvas/scripts/convert-slides-data.mjs` | Data conversion | 80 |
| `package.json` (root) | Add proxy scripts | +3 lines |
| `CLAUDE.md` | Documentation update | +40 lines |

**Total new code**: ~1,260 lines across 13 files

## Complexity Assessment

**Overall: MEDIUM**

- The generator-based animation model is nearly identical to Revideo — the Revideo scene code can be adapted with minimal changes
- The main work is translating component APIs (Revideo `Rect` → Motion Canvas `Rect`, etc.) which are very similar
- The data pipeline and conversion script follow the same pattern as Hyperframes/Revideo
- The biggest risk is the FFmpeg rendering pipeline — need to verify FFmpeg is available on the system

## Estimated Effort

| Phase | Time |
|-------|------|
| Phase 1: Scaffolding | 15 min |
| Phase 2: Data conversion | 15 min |
| Phase 3: Library modules | 30 min |
| Phase 4: Scene implementation | 60 min |
| Phase 5: Root integration | 10 min |
| Phase 6: Testing | 30 min |
| **Total** | **~2.5 hours** |

---

**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
