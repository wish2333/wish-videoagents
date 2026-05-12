# VideoAgent - Remotion Video Workflow

A Remotion-based video production workflow for reusable templates and resources.

## Quick Start

```bash
bun install          # install dependencies
bun run dev          # start Studio preview at http://localhost:3000
bun run render:manga # render manga-recommend template to out/manga.mp4
```

Requirements: Bun >= 1.3, no additional global packages needed.

---

## Project Structure

```
videoagent/
  src/
    index.ts                          # Entry: registerRoot(RemotionRoot)
    Root.tsx                          # Composition registry (all templates registered here)
    index.css                         # Tailwind CSS entry
    styles/
      types.ts                        #   Theme interface definition
      registry.ts                     #   Theme name -> Theme map, getTheme(), registerTheme()
      context.tsx                     #   ThemeProvider + useTheme() hook
      index.ts                        #   Barrel re-export
      themes/                         #   Theme definitions (one file per theme)
        dark.ts                       #     Default dark theme
        warm.ts                       #     Warm earth-toned theme
    components/                       # Shared reusable components
      TitleCard.tsx                   #   Gradient title card with spring animation
      Subtitle.tsx                    #   Bottom subtitle bar with fade-in
      Outro.tsx                       #   End card with channel name
      ImageMontage.tsx                #   Image slideshow with Ken Burns + crossfade
      FadeTransition.tsx              #   Generic fade-in/fade-out wrapper
    compositions/                     # Video templates (one subfolder per template)
      manga-recommend/                #   Manga/novel recommendation template
        index.tsx                     #     Main composition component (wraps ThemeProvider)
        types.ts                      #     MangaRecommendData interface
        components/                   #     Template-specific sub-components
          HookSlide.tsx               #       Opening hook quote
          WorkCard.tsx                #       Work title + author + genre
          HighlightCard.tsx           #       Numbered highlight point
          AudienceTags.tsx            #       "Recommended for" tag list
      tech-share/                     #   (placeholder for future template)
      learning-log/                   #   (placeholder for future template)
    lib/                              # Utility functions (expand as needed)
  public/                             # Static assets
    audio/                            #   Audio files (BGM, voiceover)
    images/                           #   Image assets
    fonts/                            #   Custom font files
  data/                               # Template data files
    examples/
      manga-recommend.json            #   Sample data for manga-recommend template
  docs/                               # Documentation
```

---

## Theme System

Themes control the **complete visual identity** of a video: colors, typography, card styling, effects, spacing, and background treatment. All themes are adapted from [html-ppt-skill](https://github.com/lewislulu/html-ppt-skill) color palettes and design tokens.

### How It Works

React Context propagates theme values from composition level to all child components via `useTheme()`. Each composition selects a theme by `themeName`.

```
Root.tsx (selects themeName per Composition)
  |
  Composition props: { data, themeName: "cyberpunk-neon" }
    |
    MangaRecommend (looks up theme, wraps children in ThemeProvider)
      |
      TitleCard / Subtitle / WorkCard ... (all call useTheme())
```

### Available Themes

#### Dark themes (11)

| Name | Visual Character |
|------|-----------------|
| `dark` | Deep purple/red, high contrast (default) |
| `warm` | Earthy brown/amber |
| `tokyo-night` | Cool blue night, subtle borders, Inter font |
| `cyberpunk-neon` | Pure black + neon glow borders/shadows + monospace title + radial gradient overlay |
| `nord` | Nordic slate blue, frost cyan accent |
| `dracula` | Classic Dracula purple/pink/cyan, subtle borders |
| `aurora` | Deep space + aurora green/purple gradient + blur glass cards |
| `vaporwave` | Gradient text titles + pink/cyan glass cards + divider glow |
| `gruvbox-dark` | Warm vintage amber/gold, small radius, heavy shadows |
| `rose-pine` | Soft rose/mint on deep purple, refined typography |
| `glassmorphism` | Dark glass + blur/saturate + sky blue/purple + radial gradient overlay |

#### Light themes (3)

| Name | Visual Character |
|------|-----------------|
| `neo-brutalism` | Cream/yellow + 3px solid black borders + 6px hard offset shadows + all-caps tags |
| `sunset-warm` | Warm orange/coral on cream, soft rounded cards |
| `minimal-white` | Pure white, tight letter-spacing, ultra-subtle shadows, generous spacing |

### Switching Themes

In `Root.tsx`, set `themeName` in each Composition's `defaultProps`:

```tsx
const MangaC = MangaRecommend as unknown as React.ComponentType<Record<string, unknown>>;
const cyberpunk = getTheme("cyberpunk-neon");

<Composition
  id="MangaCyberpunk"
  component={MangaC}
  durationInFrames={630}
  fps={cyberpunk.fps}
  width={cyberpunk.layout.landscape.width}
  height={cyberpunk.layout.landscape.height}
  defaultProps={{ data: sampleMangaData, themeName: "cyberpunk-neon" }}
/>
```

In Studio, all 14 compositions appear in the sidebar.

### Creating a New Theme

1. Create a new file in `src/styles/themes/` implementing all 6 sections:

```ts
// src/styles/themes/ocean.ts
import type { Theme } from "../types";

export const oceanTheme: Theme = {
  colors: {
    primary: "#0b1628",
    secondary: "#122a4e",
    accent: "#00bcd4",
    textPrimary: "#e0f7fa",
    textSecondary: "#80deea",
    background: "#061018",
    cardBackground: "#0d2137",
    subtitleBackground: "rgba(6, 16, 24, 0.8)",
    subtitleText: "#e0f7fa",
    gradientStart: "#00bcd4",
    gradientEnd: "#006064",
  },
  fonts: {
    title: "Inter, Noto Sans SC, sans-serif",
    body: "Inter, Noto Sans SC, sans-serif",
    subtitle: "Inter, Noto Sans SC, sans-serif",
  },
  typography: {
    titleSize: 72,
    titleWeight: 700,
    bodySize: 32,
    subtitleSize: 28,
    tagSize: 32,
    tagTextTransform: "none",
    tagLetterSpacing: "0px",
    kickerSize: 26,
    kickerLetterSpacing: "4px",
    kickerTextTransform: "uppercase",
  },
  effects: {
    titleLetterSpacing: "0px",
    titleTextTransform: "none",
    cardBorderRadius: 12,
    cardShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
    pillBorderRadius: 12,
    imageBorderRadius: 12,
  },
  spacing: {
    pagePadding: 80,
    cardPadding: 40,
    elementGap: 24,
  },
  layout: {
    landscape: { width: 1920, height: 1080 },
    portrait: { width: 1080, height: 1920 },
  },
  animation: {
    defaultDuration: 15,
    titleCardDuration: 90,
    transitionDuration: 10,
  },
  fps: 30,
};
```

2. Register in `src/styles/registry.ts`:

```ts
import { oceanTheme } from "./themes/ocean";

const themes: Record<string, Theme> = {
  dark: darkTheme,
  // ... existing themes ...
  ocean: oceanTheme,
};
```

3. Use in `Root.tsx`: `defaultProps={{ data: sampleMangaData, themeName: "ocean" }}`

### Theme Interface Reference

`Theme` interface from `src/styles/types.ts` has 6 sections:

#### `colors` -- Color palette

| Field | Description |
|-------|-------------|
| `primary` | Main surface background |
| `secondary` | Secondary surface |
| `accent` | Highlight/emphasis color |
| `textPrimary` | Primary text |
| `textSecondary` | Secondary/muted text |
| `background` | Deepest background layer |
| `cardBackground` | Card/container background |
| `subtitleBackground` | Subtitle bar background (semi-transparent) |
| `subtitleText` | Subtitle text color |
| `gradientStart` | Gradient start color |
| `gradientEnd` | Gradient end color |

#### `fonts` -- Font families

| Field | Description |
|-------|-------------|
| `title` | Title/heading font family |
| `body` | Body text font family |
| `subtitle` | Subtitle font family |

#### `typography` -- Font sizes, weights, transforms

| Field | Type | Description |
|-------|------|-------------|
| `titleSize` | number | Title font size (px) |
| `titleWeight` | number | Title font weight |
| `bodySize` | number | Body font size (px) |
| `subtitleSize` | number | Subtitle font size (px) |
| `tagSize` | number | Tag/pill font size (px) |
| `tagTextTransform` | "none" \| "uppercase" | Tag text transform |
| `tagLetterSpacing` | string | Tag letter spacing |
| `kickerSize` | number | Kicker/label font size (px) |
| `kickerLetterSpacing` | string | Kicker letter spacing |
| `kickerTextTransform` | "none" \| "uppercase" | Kicker text transform |

#### `effects` -- Visual effects and card styling

| Field | Type | Description |
|-------|------|-------------|
| `titleTextShadow` | string? | CSS text-shadow for titles |
| `titleGradient` | boolean? | Enable gradient text (background-clip) |
| `titleLetterSpacing` | string | Title letter spacing |
| `titleTextTransform` | "none" \| "uppercase" | Title text transform |
| `cardBorder` | string? | CSS border for cards |
| `cardBorderRadius` | number | Card border radius (px) |
| `cardShadow` | string | CSS box-shadow for cards |
| `cardBackdropFilter` | string? | CSS backdrop-filter (glass effect) |
| `pillBorder` | string? | CSS border for tag/pill elements |
| `pillBorderRadius` | number | Pill border radius (px) |
| `pillShadow` | string? | CSS box-shadow for pills |
| `imageBorderRadius` | number | Image border radius (px) |
| `imageBorder` | string? | CSS border for images |
| `imageShadow` | string? | CSS box-shadow for images |
| `backgroundOverlay` | string? | Additional background gradient overlay |
| `dividerShadow` | string? | Glow effect on divider lines |

#### `spacing` -- Whitespace rhythm

| Field | Description |
|-------|-------------|
| `pagePadding` | Page-level padding (px) |
| `cardPadding` | Card inner padding (px) |
| `elementGap` | Gap between stacked elements (px) |

#### `layout`, `animation`, `fps`

| Field | Description |
|-------|-------------|
| `layout.landscape` | { width, height } landscape resolution |
| `layout.portrait` | { width, height } portrait resolution |
| `animation.defaultDuration` | Default section duration (frames) |
| `animation.titleCardDuration` | Title card duration (frames) |
| `animation.transitionDuration` | Transition duration (frames) |
| `fps` | Frames per second |

### Using Theme in Components

```tsx
import { useTheme } from "../styles";

const MyComponent = () => {
  const theme = useTheme();
  return (
    <div style={{
      color: theme.colors.textPrimary,
      fontFamily: theme.fonts.body,
      fontSize: theme.typography.bodySize,
      borderRadius: theme.effects.cardBorderRadius,
      boxShadow: theme.effects.cardShadow,
      border: theme.effects.cardBorder,
      padding: theme.spacing.cardPadding,
    }}>
      Themed content
    </div>
  );
};
```

`useTheme()` reads from the nearest `ThemeProvider` ancestor. No prop drilling needed.

### Programmatic Registration

```ts
import { registerTheme } from "./styles";

registerTheme("custom", {
  colors: { /* ... */ },
  fonts: { /* ... */ },
  typography: { /* ... */ },
  effects: { /* ... */ },
  spacing: { /* ... */ },
  layout: { /* ... */ },
  animation: { /* ... */ },
  fps: 30,
});
```

---

## Usage Workflow

### 1. Preview in Studio

```bash
bun run dev
```

Opens Remotion Studio at `http://localhost:3000`. The left sidebar shows all registered compositions. Click one to preview it frame-by-frame with playback controls.

### 2. Prepare Your Data

Each template consumes structured data. For the manga-recommend template, create a JSON file following the `MangaRecommendData` schema:

```json
{
  "title": "Your video title (shown on title card)",
  "workTitle": "Name of the manga/novel",
  "workAuthor": "Author name",
  "workGenre": ["Genre1", "Genre2"],
  "hookText": "Opening hook line (shown as quoted text)",
  "highlights": [
    {
      "title": "Highlight heading",
      "description": "Detail text (also used as subtitle)",
      "imageSrc": "path or URL to image"
    }
  ],
  "targetAudience": ["Audience type 1", "Audience type 2"],
  "rating": 5,
  "outroMessage": "Closing message",
  "channelName": "Your channel name",
  "audioSrc": "path to audio file",
  "totalDurationFrames": 630
}
```

Place data files in `data/` directory.

### 3. Wire Data into Root.tsx

Import your data and pass it as `defaultProps`:

```tsx
import myData from "../data/my-video.json";
import { getTheme } from "./styles";

const data = myData as MangaRecommendData;
const theme = getTheme("dark");

// Inside RemotionRoot:
<Composition
  id="MyVideo"
  component={MangaRecommend as unknown as React.ComponentType<Record<string, unknown>>}
  durationInFrames={data.totalDurationFrames}
  fps={theme.fps}
  width={theme.layout.landscape.width}
  height={theme.layout.landscape.height}
  defaultProps={{ data, themeName: "dark" }}
/>
```

### 4. Render to MP4

```bash
bun run render:manga              # landscape 1920x1080
bun run render:manga-vertical     # portrait  1080x1920
```

Or render a specific composition by ID:

```bash
bunx remotionb render <CompositionId> <output-path>
```

Output files go to `out/` directory by default.

---

## Template Architecture

### How Templates Work

Each template is a React component under `src/compositions/<template-name>/`. It receives typed data through props and orchestrates child components using Remotion's `<Sequence>` to schedule sections on a timeline.

The composition wraps all children in a `<ThemeProvider>` so every component inside can access theme values via `useTheme()`.

**Time model:** Everything is frame-based. At 30fps, 630 frames = 21 seconds. Each section has a `start` frame and a `durationInFrames`.

```
Frame:   0        75       165      255       330       405       480      555    630
         | Title  | Hook   | WorkCard | HL 1  |  HL 2   |  HL 3   | Tags   | Outro |
         | 2.5s   | 3s     | 3s       | 2.5s  | 2.5s    | 2.5s    | 2.5s   | 2.5s  |
```

### Animation APIs

| API | Purpose | Typical Usage |
|-----|---------|---------------|
| `useCurrentFrame()` | Get current frame number | `const frame = useCurrentFrame()` |
| `interpolate(frame, inputRange, outputRange, opts)` | Map frame to value | Opacity: `[0,10] -> [0,1]` |
| `spring({ frame, fps, config })` | Physics-based animation | Scale/translate with natural bounce |
| `<Sequence from={n} durationInFrames={n}>` | Schedule a section | Each template section |
| `AbsoluteFill` | Full-viewport container | Every component's root |

**Spring config options:**
- `damping`: Higher = less bounce (typical: 10-20)
- `stiffness`: Higher = faster animation (typical: 80-150)
- `mass`: Higher = heavier/slower (default: 1)

---

## Modifying Templates

### Change Colors and Fonts

Edit the theme file in `src/styles/themes/` (e.g. `dark.ts`):

```ts
export const darkTheme: Theme = {
  colors: {
    primary: "#1a1a2e",        // main background
    accent: "#e94560",         // highlight color
    gradientStart: "#e94560",  // gradient begin
    gradientEnd: "#533483",    // gradient end
    // ... see file for full list
  },
  fonts: {
    title: "Noto Sans SC",    // change to any installed font
  },
  fps: 30,                    // frames per second (affects all durations)
};
```

All components using `useTheme()` automatically reflect the change.

### Adjust Section Timing

In `src/compositions/manga-recommend/index.tsx`, modify the `SECTIONS` constant:

```ts
const SECTIONS = {
  title:     { start: 0,   duration: 75 },   // 2.5s at 30fps
  hook:      { start: 75,  duration: 90 },   // 3s
  workCard:  { start: 165, duration: 90 },   // 3s
  highlight: { start: 255, perItem: 75 },    // 2.5s per highlight
  audience:  { start: 480, duration: 75 },   // 2.5s
  outro:     { start: 555, duration: 75 },   // 2.5s
};
```

When changing timing, also update the total `durationInFrames` in `Root.tsx`.

### Modify Animation Speed

Each component controls its own animation timing via `interpolate` frame ranges and `spring` config. Example from `TitleCard.tsx`:

```tsx
// Subtitle appears between frame 20-35 of this section
const subtitleOpacity = interpolate(frame, [20, 35], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});

// Spring animation for title entrance
const titleScale = spring({
  frame,
  fps,
  config: { damping: 15, stiffness: 100 },
});
```

### Add Images to ImageMontage

```tsx
<ImageMontage
  images={[
    { src: "/images/scene1.jpg", durationInFrames: 90 },
    { src: "/images/scene2.jpg", durationInFrames: 90 },
    { src: "/images/scene3.jpg", durationInFrames: 60 },
  ]}
  transitionDuration={8}  // crossfade frames between images
/>
```

Images can be local paths under `public/` or remote URLs.

### Add Audio Track

Use Remotion's `<Audio>` component inside any composition:

```tsx
import { Audio } from "remotion";

// Inside your composition:
<Audio src={data.audioSrc} volume={1} />
```

---

## Creating a New Template

### Step 1: Create the template directory

```
src/compositions/my-template/
  index.tsx       # main composition component
  types.ts        # data interface
  components/     # sub-components (optional)
```

### Step 2: Define the data interface

```tsx
// src/compositions/my-template/types.ts
export interface MyTemplateData {
  title: string;
  sections: { heading: string; body: string }[];
  // add fields your template needs
}
```

### Step 3: Build the composition component

```tsx
// src/compositions/my-template/index.tsx
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import { TitleCard } from "../../components/TitleCard";
import { Outro } from "../../components/Outro";
import { ThemeProvider, getTheme, useTheme } from "../../styles";
import type { MyTemplateData } from "./types";

interface MyTemplateProps {
  data: MyTemplateData;
  themeName?: string;
}

const MyTemplateInner: React.FC<{ data: MyTemplateData }> = ({ data }) => {
  const theme = useTheme();
  const SECTION_DURATION = 75;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <Sequence from={0} durationInFrames={SECTION_DURATION}>
        <TitleCard title={data.title} />
      </Sequence>
      {data.sections.map((section, i) => (
        <Sequence
          key={i}
          from={SECTION_DURATION + i * SECTION_DURATION}
          durationInFrames={SECTION_DURATION}
        >
          {/* Your section content here */}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const MyTemplate: React.FC<MyTemplateProps> = ({ data, themeName = "dark" }) => {
  const theme = getTheme(themeName);
  return (
    <ThemeProvider value={theme}>
      <MyTemplateInner data={data} />
    </ThemeProvider>
  );
};
```

### Step 4: Register in Root.tsx

```tsx
import { MyTemplate } from "./compositions/my-template";
import { getTheme } from "./styles";

const theme = getTheme("dark");

// Inside RemotionRoot, add:
<Composition
  id="MyTemplate"
  component={MyTemplate as unknown as React.ComponentType<Record<string, unknown>>}
  durationInFrames={300}
  fps={theme.fps}
  width={theme.layout.landscape.width}
  height={theme.layout.landscape.height}
  defaultProps={{ data: mySampleData, themeName: "dark" }}
/>
```

### Step 5: Add render script to package.json

```json
{
  "scripts": {
    "render:my-template": "remotionb render MyTemplate out/my-template.mp4"
  }
}
```

---

## Workflow Design Guide

### Recommended Pipeline for Each Video

```
1. Write script / outline
   |
2. Record voiceover -> save to public/audio/
   |
3. Prepare data JSON  -> save to data/
   |
4. bun run dev        -> preview in Studio, adjust timing
   |
5. bun run render:*   -> output MP4
   |
6. Post-process       -> add BGM, fine-tune in editing software
```

### Template Design Principles

1. **Data-driven**: All content (text, image paths, timing) comes from props, not hardcoded in components. This lets you reuse one template for many videos by swapping data files.

2. **Sequence-based**: Use `<Sequence>` to schedule sections. Each section is independent -- modifying one section's timing or content does not affect others.

3. **Theme-aware**: Use `useTheme()` from `styles/` for colors and fonts. Wrap your composition in `<ThemeProvider>` so all children pick up the theme automatically. This lets the same template render in different visual styles.

4. **Resolution-aware**: Register both landscape (1920x1080) and portrait (1080x1920) compositions in Root.tsx for platforms that require different aspect ratios.

### Batch Production

To render multiple videos from the same template with different data:

```bash
bunx remotionb render MangaRecommend out/video-1.mp4 --props='{"data":{...}}'
bunx remotionb render MangaRecommend out/video-2.mp4 --props='{"data":{...}}'
```

To render the same video with different themes:

```bash
bunx remotionb render MangaRecommendWarm out/video-warm.mp4
bunx remotionb render MangaRecommend out/video-dark.mp4
```

Or programmatically with `@remotion/bundler` + `@remotion/renderer` for server-side rendering pipelines.

---

## Migration Guide

### From an Existing Remotion Project

If you have an existing Remotion project and want to adopt this workflow structure:

1. **Copy your compositions** into `src/compositions/<your-template>/`
2. **Extract shared components** into `src/components/`
3. **Move theme constants** into a theme file under `src/styles/themes/` and register it
4. **Replace direct theme imports** with `useTheme()` in all components
5. **Wrap each composition** in `<ThemeProvider>` at its root
6. **Register compositions** in `src/Root.tsx` following the existing pattern
7. **Move static assets** into `public/` subdirectories
8. **Move data files** into `data/`
9. **Update import paths** in your components

### To a New Machine

```bash
git clone <repo-url>
cd videoagent
bun install
bun run dev
```

No global packages or system dependencies beyond Bun are required. Remotion uses a bundled Chrome/Chromium for rendering (auto-downloaded on first render).

### Adding Tailwind CSS

This project includes Tailwind CSS v4 via `@remotion/tailwind-v4`. You can use Tailwind utility classes in any component:

```tsx
<div className="flex items-center justify-center text-4xl font-bold text-white">
  Hello
</div>
```

Tailwind is configured in `remotion.config.ts` via `Config.overrideWebpackConfig(enableTailwind)`.

### Upgrading Remotion

```bash
bun run upgrade
```

This runs `remotionb upgrade` which updates all `@remotion/*` and `remotion` packages together.

---

## Reference: Component Props

### TitleCard
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | required | Main title text |
| subtitle | string | undefined | Optional subtitle below title |
| backgroundColor | string | theme's gradientStart | Background gradient start color |

### Subtitle
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| text | string | required | Subtitle text content |
| fontSize | number | 42 | Text size in px |
| bottom | number | 80 | Distance from bottom in px |

### Outro
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| channelName | string | "" | Channel name displayed after message |
| message | string | "Thank you for watching" | Closing message |

### ImageMontage
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| images | `{ src: string; durationInFrames: number }[]` | required | Image list with per-image duration |
| transitionDuration | number | 8 | Crossfade frames between images |

### FadeTransition
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | required | Content to wrap |
| fadeInFrames | number | 8 | Frames for fade-in |
| fadeOutFrames | number | 8 | Frames for fade-out |
| durationInFrames | number | required | Total duration |

### MangaRecommendData
| Field | Type | Description |
|-------|------|-------------|
| title | string | Video title (title card) |
| workTitle | string | Manga/novel name |
| workAuthor | string | Author name |
| workGenre | string[] | Genre tags |
| hookText | string | Opening hook quote |
| highlights | `{ title: string; description: string; imageSrc: string }[]` | Highlight points |
| targetAudience | string[] | "Recommended for" tags |
| rating | number | Rating score (1-5) |
| outroMessage | string | Closing message |
| channelName | string | Channel name |
| audioSrc | string | Audio file path |
| totalDurationFrames | number | Total video duration in frames |

---

## Key Commands

| Command | Purpose |
|---------|---------|
| `bun run dev` | Start Remotion Studio preview server |
| `bun run build` | Bundle the project (for programmatic rendering) |
| `bun run lint` | Run ESLint + TypeScript check |
| `bun run render:manga` | Render manga template (landscape) |
| `bun run render:manga-vertical` | Render manga template (portrait) |
| `bun run upgrade` | Upgrade all Remotion packages |

## Configuration Files

| File | Purpose |
|------|---------|
| `remotion.config.ts` | Remotion settings: image format (jpeg), output overwrite, Tailwind integration |
| `tsconfig.json` | TypeScript config: ES2018 target, strict mode, React JSX |
| `eslint.config.mjs` | ESLint config using `@remotion/eslint-config-flat` |
| `src/styles/types.ts` | Theme interface definition |
| `src/styles/registry.ts` | Theme registry (name -> Theme map) |
| `src/styles/themes/*.ts` | Individual theme definitions |
