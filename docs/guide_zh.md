# VideoAgent - Remotion 视频工作流

一个基于 Remotion 的视频制作工作流，用于可复用的模板和资源。

## 快速开始

```bash
bun install          # 安装依赖
bun run dev          # 在 http://localhost:3000 启动 Studio 预览
bun run render:manga # 将 manga-recommend 模板渲染到 out/manga.mp4
```

要求：Bun >= 1.3，无需额外的全局包。

---

## 项目结构

```
videoagent/
  src/
    index.ts                          # 入口：registerRoot(RemotionRoot)
    Root.tsx                          # 合成注册表（所有模板在此注册）
    index.css                         # Tailwind CSS 入口
    styles/
      types.ts                        #   主题接口定义
      registry.ts                     #   主题名称 -> 主题映射，getTheme(), registerTheme()
      context.tsx                     #   ThemeProvider + useTheme() hook
      index.ts                        #   导出聚合
      themes/                         #   主题定义（14 个，每个一个文件）
        dark.ts                       #     默认暗色主题
        warm.ts                       #     暖色大地色调
        tokyo-night.ts                #     冷蓝夜景
        cyberpunk-neon.ts             #     赛博朋克霓虹
        nord.ts                       #     北欧清冷蓝
        dracula.ts                    #     Dracula 紫/粉/青
        aurora.ts                     #     极光渐变 + 毛玻璃
        vaporwave.ts                  #     蒸汽波复古
        neo-brutalism.ts              #     新粗野主义
        sunset-warm.ts                #     暖橘日落
        minimal-white.ts              #     极简白
        gruvbox-dark.ts               #     Gruvbox 暖色复古
        rose-pine.ts                  #     玫瑰松
        glassmorphism.ts              #     毛玻璃
    components/                       # 公共复用组件
      TitleCard.tsx                   #   带有弹簧动画的渐变标题卡片
      Subtitle.tsx                    #   带有淡入效果的底部字幕栏
      Outro.tsx                       #   带有频道名称的片尾卡片
      ImageMontage.tsx                #   带有 Ken Burns 效果 + 交叉淡入淡出的图片幻灯片
      FadeTransition.tsx              #   通用的淡入/淡出包装器
    compositions/                     # 视频模板（每个模板一个子文件夹）
      manga-recommend/                #   漫画/小说推荐模板
        index.tsx                     #     主合成组件（包装 ThemeProvider）
        types.ts                      #     MangaRecommendData 接口
        components/                   #     模板特定子组件
          HookSlide.tsx               #       开场钩子引用句
          WorkCard.tsx                #       作品标题 + 作者 + 类型
          HighlightCard.tsx           #       带编号的亮点介绍
          AudienceTags.tsx            #       “推荐人群”标签列表
      tech-share/                     #   （未来模板占位符）
      learning-log/                   #   （未来模板占位符）
    lib/                              # 工具函数（根据需要扩展）
  public/                             # 静态资源
    audio/                            #   音频文件 (BGM, 配音)
    images/                           #   图像资源
    fonts/                            #   自定义字体文件
  data/                               # 模板数据文件
    examples/
      manga-recommend.json            #   manga-recommend 模板的示例数据
  docs/                               # 文档
```

---

## 主题系统

主题控制视频的**完整视觉身份**：配色、字体排版、卡片风格、特效、间距和背景处理。所有主题配色和设计令牌均改编自 [html-ppt-skill](https://github.com/lewislulu/html-ppt-skill)。

### 工作原理

通过 React Context 将主题值从合成层传播到所有子组件，组件通过 `useTheme()` 读取。每个合成通过 `themeName` 选择主题。

```
Root.tsx (为每个 Composition 选择 themeName)
  |
  Composition props: { data, themeName: "cyberpunk-neon" }
    |
    MangaRecommend (查找主题，将子组件包装在 ThemeProvider 中)
      |
      TitleCard / Subtitle / WorkCard ... (全部调用 useTheme())
```

### 可用主题

#### 深色主题 (11)

| 名称 | 视觉特征 |
|------|---------|
| `dark` | 深紫/红色，高对比度（默认） |
| `warm` | 大地棕/琥珀色调 |
| `tokyo-night` | 冷蓝夜景，细腻边框，Inter 字体 |
| `cyberpunk-neon` | 纯黑 + 霓虹发光边框/阴影 + 等宽标题 + 径向渐变叠加层 |
| `nord` | 北欧石板蓝，冰霜青色点缀 |
| `dracula` | 经典 Dracula 紫/粉/青，细腻边框 |
| `aurora` | 深空 + 极光绿/紫渐变 + 毛玻璃卡片 |
| `vaporwave` | 渐变文字标题 + 粉/青毛玻璃卡片 + 分隔线发光 |
| `gruvbox-dark` | 复古暖色琥珀/金色，小圆角，深重阴影 |
| `rose-pine` | 柔和玫瑰/薄荷配深紫，精致排版 |
| `glassmorphism` | 深色毛玻璃 + blur/饱和度 + 天蓝/紫色 + 径向渐变叠加层 |

#### 浅色主题 (3)

| 名称 | 视觉特征 |
|------|---------|
| `neo-brutalism` | 奶油/黄色 + 3px 粗黑边 + 6px 硬偏移阴影 + 全大写标签 |
| `sunset-warm` | 暖橘/珊瑚配奶油底，柔和圆角卡片 |
| `minimal-white` | 纯白底，紧字间距，超细阴影，留白充裕 |

### 切换主题

在 `Root.tsx` 中，在每个 Composition 的 `defaultProps` 中设置 `themeName`：

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

在 Studio 中，所有 14 个合成都会出现在侧边栏。

### 创建新主题

1. 在 `src/styles/themes/` 中创建新文件，实现全部 6 个部分：

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

2. 在 `src/styles/registry.ts` 中注册：

```ts
import { oceanTheme } from "./themes/ocean";

const themes: Record<string, Theme> = {
  dark: darkTheme,
  // ... 已有主题 ...
  ocean: oceanTheme,
};
```

3. 在 `Root.tsx` 中使用：`defaultProps={{ data: sampleMangaData, themeName: "ocean" }}`

### 主题接口参考

`Theme` 接口定义在 `src/styles/types.ts`，包含 6 个部分：

#### `colors` -- 色彩方案

| 字段 | 描述 |
|------|------|
| `primary` | 主表面背景 |
| `secondary` | 次要表面 |
| `accent` | 高亮/强调颜色 |
| `textPrimary` | 主要文本 |
| `textSecondary` | 次要/柔和文本 |
| `background` | 最深层背景 |
| `cardBackground` | 卡片/容器背景 |
| `subtitleBackground` | 字幕栏背景（半透明） |
| `subtitleText` | 字幕文本颜色 |
| `gradientStart` | 渐变起始颜色 |
| `gradientEnd` | 渐变结束颜色 |

#### `fonts` -- 字体族

| 字段 | 描述 |
|------|------|
| `title` | 标题字体族 |
| `body` | 正文字体族 |
| `subtitle` | 字幕字体族 |

#### `typography` -- 字号、字重、大小写

| 字段 | 类型 | 描述 |
|------|------|------|
| `titleSize` | number | 标题字号 (px) |
| `titleWeight` | number | 标题字重 |
| `bodySize` | number | 正文字号 (px) |
| `subtitleSize` | number | 字幕字号 (px) |
| `tagSize` | number | 标签/药丸字号 (px) |
| `tagTextTransform` | "none" \| "uppercase" | 标签文字转换 |
| `tagLetterSpacing` | string | 标签字间距 |
| `kickerSize` | number | 提示语/小标签字号 (px) |
| `kickerLetterSpacing` | string | 提示语字间距 |
| `kickerTextTransform` | "none" \| "uppercase" | 提示语文字转换 |

#### `effects` -- 视觉特效和卡片样式

| 字段 | 类型 | 描述 |
|------|------|------|
| `titleTextShadow` | string? | 标题 CSS text-shadow |
| `titleGradient` | boolean? | 启用渐变文字（background-clip） |
| `titleLetterSpacing` | string | 标题字间距 |
| `titleTextTransform` | "none" \| "uppercase" | 标题文字转换 |
| `cardBorder` | string? | 卡片 CSS border |
| `cardBorderRadius` | number | 卡片圆角 (px) |
| `cardShadow` | string | 卡片 CSS box-shadow |
| `cardBackdropFilter` | string? | 卡片 CSS backdrop-filter（毛玻璃效果） |
| `pillBorder` | string? | 标签/药丸 CSS border |
| `pillBorderRadius` | number | 药丸圆角 (px) |
| `pillShadow` | string? | 药丸 CSS box-shadow |
| `imageBorderRadius` | number | 图片圆角 (px) |
| `imageBorder` | string? | 图片 CSS border |
| `imageShadow` | string? | 图片 CSS box-shadow |
| `backgroundOverlay` | string? | 额外的背景渐变叠加层 |
| `dividerShadow` | string? | 分隔线发光效果 |

#### `spacing` -- 留白节奏

| 字段 | 描述 |
|------|------|
| `pagePadding` | 页面级内边距 (px) |
| `cardPadding` | 卡片内边距 (px) |
| `elementGap` | 堆叠元素间距 (px) |

#### `layout`、`animation`、`fps`

| 字段 | 描述 |
|------|------|
| `layout.landscape` | { width, height } 横屏分辨率 |
| `layout.portrait` | { width, height } 竖屏分辨率 |
| `animation.defaultDuration` | 默认章节时长 (帧) |
| `animation.titleCardDuration` | 标题卡时长 (帧) |
| `animation.transitionDuration` | 过渡时长 (帧) |
| `fps` | 每秒帧数 |

### 在组件中使用主题

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
      带主题的内容
    </div>
  );
};
```

`useTheme()` 从最近的 `ThemeProvider` 祖先读取，无需 prop 逐层传递。

### 程序化注册

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

## 使用工作流

### 1. 在 Studio 中预览

```bash
bun run dev
```

在 `http://localhost:3000` 打开 Remotion Studio。左侧侧边栏显示所有已注册的合成。点击其中一个即可通过播放控制进行逐帧预览。

### 2. 准备数据

每个模板都消耗结构化数据。对于 `manga-recommend` 模板，请创建一个遵循 `MangaRecommendData` 模式的 JSON 文件：

```json
{
  "title": "您的视频标题 (显示在标题卡上)",
  "workTitle": "漫画/小说的名称",
  "workAuthor": "作者姓名",
  "workGenre": ["类型1", "类型2"],
  "hookText": "开场钩子语句 (作为引用文本显示)",
  "highlights": [
    {
      "title": "亮点标题",
      "description": "详情文本 (也用作字幕)",
      "imageSrc": "图片的路径或 URL"
    }
  ],
  "targetAudience": ["受众类型 1", "受众类型 2"],
  "rating": 5,
  "outroMessage": "结束语",
  "channelName": "您的频道名称",
  "audioSrc": "音频文件路径",
  "totalDurationFrames": 630
}
```

将数据文件放在 `data/` 目录下。

### 3. 将数据接入 Root.tsx

导入您的数据并将其作为 `defaultProps` 传递：

```tsx
import myData from "../data/my-video.json";
import { getTheme } from "./styles";

const data = myData as MangaRecommendData;
const theme = getTheme("dark");

// 在 RemotionRoot 内部:
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

### 4. 渲染为 MP4

```bash
bun run render:manga              # 横屏 1920x1080
bun run render:manga-vertical     # 竖屏  1080x1920
```

或者通过 ID 渲染特定的合成：

```bash
bunx remotionb render <CompositionId> <output-path>
```

输出文件默认存放在 `out/` 目录。

---

## 模板架构

### 模板如何工作

每个模板都是 `src/compositions/<template-name>/` 下的一个 React 组件。它通过 props 接收类型化数据，并使用 Remotion 的 `<Sequence>` 组件在时间轴上编排子组件。

合成会将所有子组件包装在 `<ThemeProvider>` 中，以便内部每个组件都能通过 `useTheme()` 访问主题值。

**时间模型：** 所有内容均基于帧。在 30fps 下，630 帧 = 21 秒。每个章节都有一个 `start` 帧和 `durationInFrames`。

```
帧数:   0        75       165      255       330       405       480      555    630
         | 标题   | 钩子   | 作品卡 | 亮点1  |  亮点2   |  亮点3   | 标签   | 结尾 |
         | 2.5s   | 3s     | 3s     | 2.5s   | 2.5s     | 2.5s     | 2.5s | 2.5s |
```

### 动画 API

| API                                                 | 用途           | 典型用法                          |
| --------------------------------------------------- | -------------- | --------------------------------- |
| `useCurrentFrame()`                                 | 获取当前帧数   | `const frame = useCurrentFrame()` |
| `interpolate(frame, inputRange, outputRange, opts)` | 将帧映射到值   | 透明度: `[0,10] -> [0,1]`         |
| `spring({ frame, fps, config })`                    | 基于物理的动画 | 带有自然回弹效果的缩放/位移       |
| `<Sequence from={n} durationInFrames={n}>`          | 安排一个章节   | 每个模板章节                      |
| `AbsoluteFill`                                      | 全视口容器     | 每个组件的根节点                  |

**Spring 配置选项：**

- `damping`: 越高 = 回弹越少 (典型值: 10-20)
- `stiffness`: 越高 = 动画越快 (典型值: 80-150)
- `mass`: 越高 = 越重/越慢 (默认值: 1)

---

## 修改模板

### 更改颜色和字体

编辑 `src/styles/themes/` 中的主题文件（例如 `dark.ts`）：

```ts
export const darkTheme: Theme = {
  colors: {
    primary: "#1a1a2e",        // 主背景
    accent: "#e94560",         // 高亮颜色
    gradientStart: "#e94560",  // 渐变起始
    gradientEnd: "#533483",    // 渐变结束
    // ... 查看文件以获取完整列表
  },
  fonts: {
    title: "Noto Sans SC",    // 更改为任何已安装的字体
  },
  fps: 30,                    // 每秒帧数 (影响所有时长)
};
```

所有使用 `useTheme()` 的组件都会自动反映更改。

### 调整章节时机

在 `src/compositions/manga-recommend/index.tsx` 中，修改 `SECTIONS` 常量：

```ts
const SECTIONS = {
  title:     { start: 0,   duration: 75 },   // 30fps 下为 2.5s
  hook:      { start: 75,  duration: 90 },   // 3s
  workCard:  { start: 165, duration: 90 },   // 3s
  highlight: { start: 255, perItem: 75 },    // 每个亮点 2.5s
  audience:  { start: 480, duration: 75 },   // 2.5s
  outro:     { start: 555, duration: 75 },   // 2.5s
};
```

更改时机时，也要更新 `Root.tsx` 中的总 `durationInFrames`。

### 修改动画速度

每个组件通过 `interpolate` 帧范围和 `spring` 配置来控制自己的动画时机。来自 `TitleCard.tsx` 的示例：

```tsx
// 字幕在该章节的第 20-35 帧之间出现
const subtitleOpacity = interpolate(frame, [20, 35], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});

// 标题入场的弹簧动画
const titleScale = spring({
  frame,
  fps,
  config: { damping: 15, stiffness: 100 },
});
```

### 向 ImageMontage 添加图片

```tsx
<ImageMontage
  images={[
    { src: "/images/scene1.jpg", durationInFrames: 90 },
    { src: "/images/scene2.jpg", durationInFrames: 90 },
    { src: "/images/scene3.jpg", durationInFrames: 60 },
  ]}
  transitionDuration={8}  // 图片之间的交叉淡入淡出帧数
/>
```

图片可以是 `public/` 下的本地路径，也可以是远程 URL。

### 添加音频轨道

在任何合成中使用 Remotion 的 `<Audio>` 组件：

```tsx
import { Audio } from "remotion";

// 在您的合成内部:
<Audio src={data.audioSrc} volume={1} />
```

---

## 创建新模板

### 第 1 步：创建模板目录

```
src/compositions/my-template/
  index.tsx       # 主合成组件
  types.ts        # 数据接口
  components/     # 子组件 (可选)
```

### 第 2 步：定义数据接口

```tsx
// src/compositions/my-template/types.ts
export interface MyTemplateData {
  title: string;
  sections: { heading: string; body: string }[];
  // 添加您的模板需要的字段
}
```

### 第 3 步：构建合成组件

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
          {/* 在此处编写您的章节内容 */}
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

### 第 4 步：在 Root.tsx 中注册

```tsx
import { MyTemplate } from "./compositions/my-template";
import { getTheme } from "./styles";

const theme = getTheme("dark");

// 在 RemotionRoot 内部添加:
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

### 第 5 步：在 package.json 中添加渲染脚本

```json
{
  "scripts": {
    "render:my-template": "remotionb render MyTemplate out/my-template.mp4"
  }
}
```

---

## 工作流设计指南

### 每个视频的推荐流水线

```
1. 编写脚本 / 大纲
   |
2. 录制配音 -> 保存到 public/audio/
   |
3. 准备数据 JSON  -> 保存到 data/
   |
4. bun run dev        -> 在 Studio 中预览，调整时机
   |
5. bun run render:*   -> 输出 MP4
   |
6. 后期处理           -> 添加 BGM，在剪辑软件中精修
```

### 模板设计原则

1. **数据驱动**：所有内容（文本、图像路径、时机）都来自 props，而不是在组件中硬编码。这让您可以通过更换数据文件，让一个模板复用于许多视频。

2. **基于序列 (Sequence)**：使用 `<Sequence>` 来安排章节。每个章节都是独立的——修改一个章节的时机或内容不会影响其他章节。

3. **感知主题**：使用 `styles/` 中的 `useTheme()` 来处理颜色和字体。将您的合成包装在 `<ThemeProvider>` 中，以便所有子组件自动应用主题。这让同一个模板可以以不同的视觉风格进行渲染。

4. **感知分辨率**：在 `Root.tsx` 中同时注册横屏 (1920x1080) 和竖屏 (1080x1920) 合成，以适应需要不同宽高比的平台。

### 批量生产

使用不同的数据从同一个模板渲染多个视频：

```bash
bunx remotionb render MangaRecommend out/video-1.mp4 --props='{"data":{...}}'
bunx remotionb render MangaRecommend out/video-2.mp4 --props='{"data":{...}}'
```

使用不同的主题渲染同一个视频：

```bash
bunx remotionb render MangaRecommendWarm out/video-warm.mp4
bunx remotionb render MangaRecommend out/video-dark.mp4
```

或者通过 `@remotion/bundler` + `@remotion/renderer` 进行程序化处理，以构建服务端渲染流水线。

---

## 迁移指南

### 从现有的 Remotion 项目迁移

如果您有一个现有的 Remotion 项目并想采用此工作流结构：

1. **复制您的合成** 到 `src/compositions/<your-template>/`
2. **提取共享组件** 到 `src/components/`
3. **移动主题常量** 到 `src/styles/themes/` 下的主题文件中并进行注册
4. **替换直接的主题导入**，在所有组件中使用 `useTheme()`
5. **在每个合成的根部** 使用 `<ThemeProvider>` 进行包装
6. **按照现有模式** 在 `src/Root.tsx` 中注册合成
7. **将静态资源** 移动到 `public/` 子目录中
8. **将数据文件** 移动到 `data/`
9. **更新组件中的** 导入路径

### 到新机器

```bash
git clone <repo-url>
cd videoagent
bun install
bun run dev
```

除了 Bun 之外，不需要任何全局包或系统依赖。Remotion 使用捆绑的 Chrome/Chromium 进行渲染（在首次渲染时自动下载）。

### 添加 Tailwind CSS

本项目通过 `@remotion/tailwind-v4` 包含了 Tailwind CSS v4。您可以在任何组件中使用 Tailwind 工具类：

```tsx
<div className="flex items-center justify-center text-4xl font-bold text-white">
  Hello
</div>
```

Tailwind 通过 `remotion.config.ts` 中的 `Config.overrideWebpackConfig(enableTailwind)` 进行配置。

### 升级 Remotion

```bash
bun run upgrade
```

这会运行 `remotionb upgrade`，它会同时更新所有 `@remotion/*` 和 `remotion` 包。

---

## 参考：组件 Props

### TitleCard

| 属性            | 类型   | 默认值               | 描述                 |
| --------------- | ------ | -------------------- | -------------------- |
| title           | string | 必填                 | 主要标题文本         |
| subtitle        | string | 未定义               | 标题下方的可选副标题 |
| backgroundColor | string | 主题的 gradientStart | 背景渐变起始颜色     |

### Subtitle

| 属性     | 类型   | 默认值 | 描述                |
| -------- | ------ | ------ | ------------------- |
| text     | string | 必填   | 字幕文本内容        |
| fontSize | number | 42     | 文本大小 (px)       |
| bottom   | number | 80     | 距离底部的距离 (px) |

### Outro

| 属性        | 类型   | 默认值                   | 描述                 |
| ----------- | ------ | ------------------------ | -------------------- |
| channelName | string | ""                       | 消息后显示的频道名称 |
| message     | string | "Thank you for watching" | 结束语               |

### ImageMontage

| 属性               | 类型                                          | 默认值 | 描述                       |
| ------------------ | --------------------------------------------- | ------ | -------------------------- |
| images             | `{ src: string; durationInFrames: number }[]` | 必填   | 带有每张图片时长的图片列表 |
| transitionDuration | number                                        | 8      | 图片间的交叉淡入淡出帧数   |

### FadeTransition

| 属性             | 类型      | 默认值 | 描述         |
| ---------------- | --------- | ------ | ------------ |
| children         | ReactNode | 必填   | 要包装的内容 |
| fadeInFrames     | number    | 8      | 淡入帧数     |
| fadeOutFrames    | number    | 8      | 淡出帧数     |
| durationInFrames | number    | 必填   | 总时长       |

### MangaRecommendData

| 字段                | 类型                                                         | 描述              |
| ------------------- | ------------------------------------------------------------ | ----------------- |
| title               | string                                                       | 视频标题 (标题卡) |
| workTitle           | string                                                       | 漫画/小说名称     |
| workAuthor          | string                                                       | 作者姓名          |
| workGenre           | string[]                                                     | 类型标签          |
| hookText            | string                                                       | 开场钩子引用句    |
| highlights          | `{ title: string; description: string; imageSrc: string }[]` | 亮点介绍点        |
| targetAudience      | string[]                                                     | “推荐人群”标签    |
| rating              | number                                                       | 评分 (1-5)        |
| outroMessage        | string                                                       | 结束语            |
| channelName         | string                                                       | 频道名称          |
| audioSrc            | string                                                       | 音频文件路径      |
| totalDurationFrames | number                                                       | 总视频时长 (帧)   |

---

## 关键命令

| 命令                            | 用途                            |
| ------------------------------- | ------------------------------- |
| `bun run dev`                   | 启动 Remotion Studio 预览服务器 |
| `bun run build`                 | 打包项目 (用于程序化渲染)       |
| `bun run lint`                  | 运行 ESLint + TypeScript 检查   |
| `bun run render:manga`          | 渲染漫画模板 (横屏)             |
| `bun run render:manga-vertical` | 渲染漫画模板 (竖屏)             |
| `bun run upgrade`               | 升级所有 Remotion 包            |

## 配置文件

| 文件                     | 用途                                                    |
| ------------------------ | ------------------------------------------------------- |
| `remotion.config.ts`     | Remotion 设置：图像格式 (jpeg)、输出覆盖、Tailwind 集成 |
| `tsconfig.json`          | TypeScript 配置：ES2018 目标、严格模式、React JSX       |
| `eslint.config.mjs`      | 使用 `@remotion/eslint-config-flat` 的 ESLint 配置      |
| `src/styles/types.ts`    | 主题接口定义                                            |
| `src/styles/registry.ts` | 主题注册表 (名称 -> 主题映射)                           |
| `src/styles/themes/*.ts` | 单个主题定义                                            |