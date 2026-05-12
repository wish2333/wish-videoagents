# Reading History 视频模板 - 设计文档

## 概述

reading-history 是一个数据驱动的 Remotion 视频模板，用于生成个人阅读/观看史叙事视频。模板采用 Apple Design Language，白底为主，通过扁平化的幻灯片数组驱动，每张幻灯片映射到一个 Remotion `<Sequence>`。

## 文件结构

```
src/compositions/reading-history/
  types.ts                          # TypeScript 类型定义
  fonts.ts                          # 字体栈常量 (DISPLAY_FONT / BODY_FONT / QUOTE_FONT)
  index.tsx                         # Composition 根组件（渲染引擎）
  slides-data.ts                    # 幻灯片数据（文本+时间戳+配图）
  components/
    TimelineMarker.tsx              # 年份标记页
    NarrativeSlide.tsx              # 叙事页（核心组件）
    QuoteSlide.tsx                  # 引言页
    WorksShowcase.tsx               # 作品展示网格
    SectionTransition.tsx           # 章节过渡（当前未使用）
```

## 数据架构

### Slide 联合类型

所有幻灯片通过 `type` 字段做可辨识联合（Discriminated Union）：

```
Slide = TitleSlide | TimelineMarkerSlide | NarrativeSlide | QuoteSlide | WorksGridSlide | OutroSlide
```

### 基础字段（BaseSlide）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 唯一标识，格式 `s{section}-{n}` |
| type | SlideType | 幻灯片类型 |
| sectionIndex | number | 章节 index，用于分组 |
| sectionTitle | string | 章节标题 |
| durationInFrames | number | 持续帧数（30fps） |

### 各类型特有字段

| 类型 | 额外字段 |
|------|----------|
| title | title, subtitle? |
| timeline-marker | year, eraLabel? |
| narrative / closing | text, year?, works?, cardSize? |
| quote | text, attribution? |
| works-grid | title?, works[] |
| outro | channelName?, message? |

### ReferencedWork

| 字段 | 类型 | 说明 |
|------|------|------|
| title | string | 作品名称 |
| author? | string | 作者 |
| mediaType | "manga" \| "anime" \| "novel" \| "audio-drama" | 媒体类型 |
| year? | string | 年份 |
| imageSrc | string | 图片路径（空字符串为占位），相对于 public/ 目录 |

### cardSize（卡片尺寸覆盖）

NarrativeSlide 支持 `cardSize?: [number, number]` 字段，用于覆盖默认的卡片尺寸计算。不设置时，按 works 数量自动选择尺寸。设置后，该幻灯片的所有作品卡片统一使用指定尺寸。

### ReadingHistoryData（顶层）

```
{
  title: string          // 视频标题
  subtitle?: string      // 副标题
  channelName: string    // 频道名
  audioSrc: string       // 音频路径
  slides: Slide[]        // 幻灯片数组
  totalDurationFrames: number  // 总帧数
}
```

## 组件设计

### NarrativeSlide（核心组件）

三种布局策略，按 works 数量自动选择，可通过 `cardSize` 覆盖：

| works 数量 | 布局 | 默认卡片尺寸 | 卡片方向 |
|------------|------|-------------|----------|
| 1 | 左右排版（文左图右） | 400x530 | 3:4 竖向 |
| 2 | 左右排版（文左图右） | 360x470 | 3:4 竖向 |
| 3+ | 上下排版（文上图下） | 260x347 | 3:4 竖向 |

**cardSize 覆盖**：在幻灯片数据中设置 `cardSize: [width, height]` 可覆盖默认尺寸，适用于特殊比例的图片。当前使用场景：
- 广播剧封面（s2-n5 至 s4）：`[320, 320]`（1:1 正方形）
- CV 照片（s3-n2）：`[200, 200]`（1:1 小正方形）
- Given（s0-n1）：`[600, 450]`（4:3 横向）

图片卡片设计：
- 有图：封面图 + 底部渐变叠加标题/作者
- 无图（占位）：浅灰底 + 居中标题 + 作者 + 媒体类型 pill

动画：
- 文字：帧 0-20 淡入
- 卡片：spring 逐张弹入（delay = 20 + i * 6~8 帧）

### TimelineMarker

白底，大号年份（240px）居中，下方分隔线 + 可选时代标签。
动画：年份和标签均为淡入（无缩放，与标签一致）。

### TitleCard

白底，标题 80px/600 weight，副标题 28px/灰色。淡入动画。

### Outro

白底，感谢语 52px/600 weight，频道名 28px/灰色。淡入动画。

### WorksShowcase

白底，标题 + 横向 4:3 卡片网格（360x270，最多 6 张）。

### QuoteSlide

深色底（#272729），大号装饰引号，居中引言文字。

## 全局设计

- 字体栈定义在 `fonts.ts`，三级优先：
  - DISPLAY_FONT（标题/展示）：OPPO Sans 4.0 > Dream Han Sans HC > LXGW WenKai > Noto Sans CJK Regular > Source Sans Pro
  - BODY_FONT（正文/UI）：OPPO Sans 4.0 > Dream Han Sans HC > LXGW WenKai > Noto Sans CJK Regular > IBM Plex Serif
  - QUOTE_FONT（引言/装饰）：Hina Mincho > LXGW WenKai > Noto Serif CJK SC > IBM Plex Serif
- 进度条：顶部 2px Action Blue (#0066cc)
- 过渡：FadeTransition 包裹每张幻灯片
- 背景：统一白色 (#ffffff)，closing 变体用浅灰 (#f5f5f7)
- 阴影：`rgba(0, 0, 0, 0.22) 3px 5px 30px`
- 圆角：18px（卡片），9999px（pill 标签）

## Composition 注册

在 `src/Root.tsx` 中注册，支持多主题变体：

```tsx
<Composition
  id="ReadingHistory"
  component={ReadingHistoryC}
  durationInFrames={totalDurationFrames}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{ data: sampleReadingHistoryData, themeName: "dark" }}
/>
```

## 时间戳对齐

幻灯片的 `durationInFrames` 通过 SRT 字幕文件对齐：

1. 将 SRT 条目按语义段落分组，映射到对应幻灯片
2. 每张幻灯片的 durationInFrames = ceil((最后一条 SRT end - 第一条 SRT start) * 30)
3. title 和 timeline-marker 类型保持固定时长（180 / 90 帧）
4. totalDurationFrames = 所有幻灯片 durationInFrames 之和
