# Reading History 模板复用文档

## 适用场景

- 个人阅读/观影/游戏史回顾视频
- 按 timeline 叙事的盘点类视频
- 需要展示多部作品封面的推荐/回顾类视频

## 快速开始

### 1. 准备数据文件

复制 `src/compositions/reading-history/slides-data.ts`，修改导出名避免冲突。

### 2. 编写幻灯片数据

#### 章节划分

用 `sectionIndex` 和 `sectionTitle` 划分章节。同一 sectionIndex 的幻灯片属于同一章节。

#### 幻灯片类型选择

| 场景 | 使用类型 | 说明 |
|------|----------|------|
| 视频开头 | title | 显示标题 + 副标题 |
| 时代/年份转折 | timeline-marker | 大号年份 + 时代标签 |
| 讲述正文 | narrative | 文字 + 可选配图 |
| 总结/收尾 | closing | 与 narrative 相同，浅灰背景 |
| 展示作品合集 | works-grid | 纯图片网格 |
| 引言/金句 | quote | 深色底大字 |
| 视频结尾 | outro | 感谢语 + 频道名 |

#### 配图规则（narrative/closing）

在幻灯片的 `works` 数组中添加作品：

```
works: [
  { title: "作品名", author: "作者", mediaType: "anime", imageSrc: "" }
]
```

**布局自动选择逻辑：**

| works 数量 | 布局方式 | 卡片比例 |
|------------|----------|----------|
| 1 张 | 左右（文字左，图片右） | 420x560 竖向 3:4 |
| 2 张 | 左右（文字左，图片右） | 300x400 竖向 3:4 |
| 3-6 张 | 上下（文字上，图片下） | 360x270 横向 4:3 |

> 注意：单张图片卡片会被自动放大，适合需要突出展示的关键作品。

#### mediaType 可选值

| 值 | 显示为 |
|----|--------|
| manga | manga |
| anime | anime |
| novel | novel |
| audio-drama | audio-drama |

### 3. 时间戳对齐

如果需要与录音/字幕同步：

1. 准备 SRT 字幕文件
2. 将 SRT 条目按语义段落分组
3. 每组对应一张幻灯片
4. 计算：`durationInFrames = ceil((end_time - start_time) * 30)`
5. title 保持 180 帧，timeline-marker 保持 90 帧
6. 更新 `totalDurationFrames` 为所有幻灯片帧数之和

### 4. 注册 Composition

在 `src/Root.tsx` 中添加：

```tsx
import { MyData, myTotalFrames } from "./compositions/reading-history/my-data";

const myData: ReadingHistoryData = {
  title: "我的标题",
  subtitle: "我的副标题",
  channelName: "我的频道",
  audioSrc: "",
  totalDurationFrames: myTotalFrames,
  slides: mySlides,
};

// 在 RemotionRoot 中添加
<Composition
  id="MyReadingHistory"
  component={ReadingHistoryC}
  durationInFrames={myTotalFrames}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{ data: myData, themeName: "dark" }}
/>
```

### 5. 准备图片

将图片放入 `public/` 目录，在数据中引用：

```ts
{ title: "Given", mediaType: "anime", imageSrc: "/images/given.jpg" }
```

空字符串 `""` 会显示占位卡片（灰色底 + 作品名）。

### 6. 预览与渲染

```bash
bun run dev          # 启动 Remotion Studio 预览
bun run build        # 构建
npx remotion render  # 渲染最终视频
```

## 自定义样式

所有样式硬编码在组件中（Apple Design Language），修改方式：

| 修改项 | 位置 |
|--------|------|
| 字体栈 | `fonts.ts` 中的 DISPLAY_FONT / BODY_FONT / QUOTE_FONT 常量 |
| 背景色 | 各组件 backgroundColor |
| 文字大小 | NarrativeSlide 的 fontSize 变量 |
| 卡片尺寸 | NarrativeSlide 顶部的 CARD_* 常量 |
| 进度条颜色 | index.tsx 的 ProgressBar 组件 |
| 标题页/片尾 | index.tsx 的 TitleCardApple / OutroApple |
