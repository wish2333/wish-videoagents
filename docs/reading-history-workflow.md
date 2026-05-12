# 工作流复用文档

## 概述

本文档描述从文案到视频成品的完整工作流，适用于所有基于 reading-history 模板的视频制作。

## 工作流步骤

### Phase 1: 文案准备

1. **撰写脚本文案** - 按时间线叙事，自然分成段落
2. **标注作品引用** - 在文案中标出需要配图的作品（名称、作者、媒体类型）
3. **规划章节** - 按时代/阶段划分，确定章节标题

### Phase 2: 录制与字幕

1. **录音** - 按脚本录制音频
2. **生成字幕** - 使用语音识别工具生成 SRT 字幕文件
3. **校对字幕** - 修正识别错误，确保时间戳准确
4. **统一编码** - 确保字幕文件为 UTF-8 编码

### Phase 3: 数据构建

#### 3.1 幻灯片分切

将 SRT 字幕按语义段落分组，每段对应一张幻灯片：

| 分切原则 | 建议 |
|----------|------|
| 每张叙事页 | 200-500 帧（7-17秒） |
| 主题转换 | 用 timeline-marker |
| 作品展示密集段 | 考虑拆分为多张 |
| 引用金句 | 用 quote 类型 |

#### 3.2 时间戳计算

```
对每张幻灯片：
  start_time = 该段落第一条 SRT 的起始时间
  end_time = 该段落最后一条 SRT 的结束时间
  durationInFrames = ceil((end_time - start_time) * 30)
```

固定时长：
- title: 180 帧（6秒）
- timeline-marker: 90 帧（3秒）

#### 3.3 编写 slides-data.ts

```ts
export const mySlides = [
  { id: "s0-title", type: "title" as const, ... },
  { id: "s0-n1", type: "narrative" as const, text: "...", works: [...], ... },
  ...
];
export const totalDurationFrames = mySlides.reduce((sum, s) => sum + s.durationInFrames, 0);
```

#### 3.4 配图分配

根据叙事节奏分配配图：

| 配图数量 | 布局 | 适用场景 |
|----------|------|----------|
| 1 张 | 左右排版，图片放大 | 重点介绍某部作品 |
| 2 张 | 左右排版 | 对比或关联的两部作品 |
| 3-6 张 | 上下排版 | 一个时期的多部作品概览 |

### Phase 4: 图片准备

1. **收集封面图** - 按图片清单准备
2. **统一规格** - 建议 16:9 或 3:4 比例，最小 800px 宽
3. **放入 public 目录** - 如 `public/images/my-video/`
4. **更新 imageSrc** - 在 slides-data.ts 中填写路径

### Phase 5: 注册与预览

1. 在 `Root.tsx` 中注册新 Composition
2. `bun run dev` 启动预览
3. 在 Remotion Studio 中逐帧检查

### Phase 6: 渲染输出

```bash
# 渲染视频
npx remotion render src/index.tsx MyReadingHistory out/my-video.mp4

# 如需合并音频
ffmpeg -i out/my-video.mp4 -i audio.mp3 -c:v copy -c:a aac out/final.mp4
```

## SRT 对齐脚本模板

以下是半自动对齐的思路，可用脚本辅助：

```python
import re, math

def parse_srt(path):
    """解析 SRT 文件，返回 [(index, start_sec, end_sec, text), ...]"""
    with open(path, encoding='utf-8-sig') as f:
        content = f.read()
    # ... 解析逻辑

def calc_frames(start_sec, end_sec, fps=30):
    return math.ceil((end_sec - start_sec) * fps)

# 定义映射：slide_id -> (first_srt_index, last_srt_index)
MAPPING = {
    "s0-n1": (1, 5),
    "s0-n2": (6, 9),
    # ...
}

# 自动计算 durationInFrames 并输出
```

## 多视频管理

在 `slides-data.ts` 同级目录创建独立数据文件：

```
src/compositions/reading-history/
  slides-data.ts          # Animemory #0
  slides-data-ep01.ts     # Animemory #1
  ...
```

每个文件导出独立的 slides 数组和 totalDurationFrames，在 Root.tsx 中分别注册 Composition。
