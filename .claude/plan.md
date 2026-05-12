# Hyperframes Integration & Migration Plan

## Overview

Add hyperframes (HeyGen's HTML-native video framework) as a parallel rendering pipeline alongside the existing Remotion system, then migrate ReadingHistory and PlayerStyle/WhiteVoice compositions from React/Remotion to HTML + GSAP.

## Constraints

- Existing Remotion code (`src/`, `package.json`, all scripts) remains untouched
- Hyperframes projects live in isolated `hyperframes/` directory
- Node.js 22+ required (current: v22.21.0 - OK)

## Target Directory Structure

```
hyperframes/
  package.json                    # Separate deps: gsap, @hyperframes/*
  reading-history/
    meta.json                     # 1920x1080, 30fps, 23247 frames
    index.html                    # Master composition HTML + GSAP timeline
    data.js                       # Slide data ported from slides-data.ts
    components/
      title-card.js               # TitleCardApple HTML generator + GSAP
      timeline-marker.js          # TimelineMarker HTML + GSAP
      narrative-slide.js          # NarrativeSlide + WorkCard HTML + GSAP
      quote-slide.js              # QuoteSlide HTML + GSAP
      works-showcase.js           # WorksShowcase HTML + GSAP
      outro.js                    # OutroApple HTML + GSAP
      fade-transition.js          # Shared fade-in/fade-out wrapper
      progress-bar.js             # Top progress bar
  white-voice/
    meta.json                     # 1920x1080, 30fps, 6120 frames
    index.html                    # Main composition HTML + GSAP timeline
    data.js                       # Song/lyrics data from sample-data.ts
    components/
      vinyl-disc.js               # Rotating vinyl disc HTML + GSAP
      lyrics-panel.js             # Scrolling lyrics + word highlight
      player-controls.js          # Progress bar + controls
    assets/
      white-noise.wav             # Copied from public/
      white-noise-cover.jpg       # Copied from public/
```

---

## Phase 1: Scaffolding (Low Risk)

### Step 1: Create hyperframes/package.json
- Dependencies: `gsap`, `@hyperframes/cli`
- Scripts: `preview`, `render:white-voice`, `render:reading-history`
- Run `bun install` in hyperframes/

### Step 2: Verify hyperframes CLI works
- Run `npx hyperframes --help` from hyperframes/
- Confirm Node 22 + Chrome availability

---

## Phase 2: WhiteVoice Migration (Medium-High Risk)

Do WhiteVoice first - smaller scope (~3.5 min), tests the full pipeline, exercises audio + image + time-based animation.

### Step 3: Port data
- Convert `sample-data.ts` to `hyperframes/white-voice/data.js`
- Export as `window.__whiteVoiceData`

### Step 4: Copy assets
- Copy `public/white-noise.wav` and `public/white-noise-cover.jpg` to `hyperframes/white-voice/assets/`

### Step 5: Create VinylDisc component
- CSS `repeating-radial-gradient` for grooves
- GSAP: `gsap.to(vinyl, { rotation: 360, duration: 8, repeat: -1, ease: "none" })`
- Circular cover image rotates with vinyl; square cover stays static

### Step 6: Create LyricsPanel component (HIGHEST RISK)
- Build GSAP master timeline with labels at each `lyrics[i].start`
- Scroll: spring-like ease `"back.out(1.2)"` on `translateY` at each line transition
- Line styling: tween fontSize, fontWeight, opacity at each line's start time
- Word highlight: per-word `width` tween for clip-reveal effect (if `words` array exists)

### Step 7: Create PlayerControls component
- Mostly static HTML (CSS shapes for buttons)
- Linear GSAP tween for progress bar width 0% -> 100%

### Step 8: Assemble index.html
- Gradient background + dot grid overlay
- Flex layout: vinyl-disc (left) + right panel (title, artist, divider, lyrics, controls)
- `<audio>` with `data-start`, `data-duration`, `data-track-index`
- Register timeline on `window.__timelines["WhiteVoice"]`

### Step 9: Test preview and render
- `npx hyperframes preview` - verify in browser
- `npx hyperframes render WhiteVoice out/white-voice-hf.mp4`

---

## Phase 3: ReadingHistory Migration (High Risk)

45+ slides, 13-minute video, 6 heterogeneous slide types.

### Step 10: Port slide data
- Convert `readingHistorySlides` (517 lines, ~45 slides) to `data.js`
- Export as `window.__readingHistorySlides`

### Step 11: Create fade-transition utility
- Shared function: wraps a slide element with 8-frame fade-in and 8-frame fade-out
- Uses GSAP `autoAlpha` (opacity + visibility)

### Step 12: Create progress-bar component
- 2px blue bar, linear width tween over 774.9 seconds

### Step 13: Create title-card component
- Two opacity tweens: title (0->1 over 30 frames), subtitle (20->45 frames)

### Step 14: Create outro component
- Two opacity tweens: message (10->30 frames), channelName (25->45 frames)

### Step 15: Create timeline-marker component
- Three staggered tweens: year opacity, line width, label opacity

### Step 16: Create narrative-slide component (HIGHEST RISK)
- Text fade-in + year scale spring
- Conditional layout: 0/1/2/3+ works, portrait vs landscape
- WorkCard sub-component with staggered spring animations
- GSAP approximation of Remotion spring: `"back.out(1.4)"` ease

### Step 17: Create quote-slide component
- Spring scale for content (damping: 16, stiffness: 80)
- Attribution fade at frames 25-45

### Step 18: Create works-showcase component
- Staggered spring per card
- CSS Grid layout with centering for odd counts

### Step 19: Assemble ReadingHistory index.html (HIGH RISK)
- Iterate all slides, generate HTML per slide type
- Build single GSAP timeline with labels at each slide's start time
- Each slide wrapped in fade-transition container
- Register timeline on `window.__timelines["ReadingHistory"]`

### Step 20: Test preview and render
- `npx hyperframes preview` - spot-check key slides
- `npx hyperframes render ReadingHistory out/reading-history-hf.mp4`

---

## Phase 4: Polish

### Step 21: Add portrait variant
- Separate composition directory or width/height swap in meta.json
- Adjust all component layouts for portrait mode

### Step 22: Add npm scripts
- `bun run preview` -> hyperframes preview
- `bun run render:white-voice` -> render WhiteVoice
- `bun run render:reading-history` -> render ReadingHistory

---

## Migration Patterns: Remotion -> GSAP

### interpolate -> GSAP tween
```
Remotion: opacity = interpolate(frame, [0, 30], [0, 1], { clamp })
GSAP:     tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1.0 }, startTime)
```

### spring -> GSAP back/elastic ease
```
Remotion: scale = spring({ frame, fps, config: { damping: 15, stiffness: 100 } })
GSAP:     tl.fromTo(el, { scale: 0 }, { scale: 1, duration: 0.6, ease: "back.out(1.4)" }, startTime)
```

### Sequence -> GSAP timeline labels + autoAlpha
```
Remotion: <Sequence from={offset} durationInFrames={dur}>
GSAP:     tl.set(el, { autoAlpha: 0 }, offset/fps)
          tl.to(el, { autoAlpha: 1, duration: fadeIn/fps }, offset/fps)
          tl.to(el, { autoAlpha: 0, duration: fadeOut/fps }, (offset+dur-fadeOut)/fps)
```

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| hyperframes CLI Windows compatibility | HIGH | Test early in Phase 1 |
| GSAP spring vs Remotion spring mismatch | MEDIUM | Visually match with back.out/elastic.out |
| LyricsPanel word highlight complexity | HIGH | Build incrementally, test line-level first |
| 45-slide ReadingHistory timeline | MEDIUM | Build per-slide, test incrementally |
| bun + @hyperframes compatibility | MEDIUM | Fall back to npm if needed |
| GSAP CustomEase licensing | LOW | Standard eases should suffice |

## Estimated Effort

| Phase | Steps | Effort |
|-------|-------|--------|
| Phase 1: Scaffolding | 2 | 1-2h |
| Phase 2: WhiteVoice | 7 | 6-10h |
| Phase 3: ReadingHistory | 11 | 12-18h |
| Phase 4: Polish | 2 | 2-3h |
| **Total** | **22** | **21-33h** |
