> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [sass-node2.chatshare.biz](https://sass-node2.chatshare.biz/c/6a020d71-4d9c-8329-b34f-5dae7e08e3f5)

> ChatGPT 是一款供日常使用的 AI 聊天机器人。与最先进的 AI 模型互动，探索创意、解决问题以及提升学习效率。

##### 你说：

逐字 lrc 怎么渲染成字幕

  

###### ChatGPT 说：

你想把 **逐字 LRC（歌词时间轴到每个字或音节）** 渲染成字幕，通常有两种主要思路：**直接渲染成视频字幕** 或 **实时显示在播放器上**。我可以帮你梳理整个流程。下面是详细方法：

* * *

1️⃣ 理解逐字 LRC 格式
---------------

逐字 LRC 通常长这样：

```
代码
[00:12.00]你[00:12.10]好[00:12.20]世[00:12.30]界
```

*   `[时间]` 表示每个字的出现时间
    
*   字母 / 汉字紧跟时间
    
*   可以按秒或毫秒精确到 1 位或 2 位
    

* * *

2️⃣ 转成字幕文件格式
------------

### 方案 A：ASS/SSA 字幕

ASS（Advanced SubStation Alpha）支持 **精确到毫秒的字幕效果**，适合逐字显示。

**步骤：**

1.  **创建 ASS 模板**：
    

```
INI
[Script Info]
Title: Lyric Sub
ScriptType: v4.00+
Collisions: Normal
PlayResX: 1920
PlayResY: 1080
Timer: 100.0000

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, BackColour, Bold, Italic, Alignment, MarginL, MarginR, MarginV, Outline, Shadow, Encoding
Style: Default,Arial,48,&H00FFFFFF,&H00000000,0,0,2,10,10,10,1,0,1

[Events]
Format: Layer, Start, End, Style, Text
```

2.  **将逐字 LRC 转成 ASS 字幕事件**：  
    例如：
    

```
ass
Dialogue: 0,0:00:12.00,0:00:12.10,Default,你
Dialogue: 0,0:00:12.10,0:00:12.20,Default,好
Dialogue: 0,0:00:12.20,0:00:12.30,Default,世
Dialogue: 0,0:00:12.30,0:00:12.50,Default,界
```

> 小技巧：ASS 支持 `\k` 标签：

```
ass
Dialogue: 0,0:00:12.00,0:00:15.00,Default,{\\k10}你{\\k10}好{\\k10}世{\\k10}界
```

`\k10` 表示每个字显示 10 * 0.01 秒（0.1 秒），更紧凑，适合卡拉 OK 风格。

* * *

### 方案 B：SRT 字幕（不支持逐字精确）

SRT 只能精确到秒或毫秒，但不支持逐字效果，一般只能按整句显示。

```
代码
00:00:12,000 --> 00:00:15,000
你好世界
```

*   不建议用于逐字效果
    

* * *

3️⃣ 渲染成视频
---------

### 方法 A：用视频编辑软件

*   **软件推荐**：
    
    *   Adobe After Effects（支持 ASS / 导入 LRC 转成字幕）
        
    *   Aegisub（制作 ASS 字幕，再导出到视频）
        
*   **流程**：
    
    1.  导入 ASS 字幕
        
    2.  对齐音频
        
    3.  渲染视频或输出到 MP4
        

### 方法 B：用程序生成视频

*   Python + `moviepy` 或 `ffmpeg`
    
*   核心思路：
    
    1.  解析 LRC 文件
        
    2.  生成每个字的时间区间
        
    3.  叠加字幕到视频帧或生成动态字幕视频
        

示例 Python + `moviepy`：

```
Python
from moviepy.editor import *

audio = AudioFileClip("song.mp3")
clips = []

# 假设 lrc_data = [(time, char), ...]
for i, (start, char) in enumerate(lrc_data):
    end = lrc_data[i+1][0] if i+1 < len(lrc_data) else audio.duration
    txt_clip = TextClip(char, fontsize=48, color='white').set_start(start).set_end(end)
    clips.append(txt_clip)

video = CompositeVideoClip(clips, size=(1920,1080)).set_audio(audio)
video.write_videofile("lyric_video.mp4", fps=24)
```

* * *

✅ 总结流程
------

1.  **解析逐字 LRC** → 得到 `(时间, 字)` 列表
    
2.  **转换为 ASS**（推荐 `\k` 标签）或直接生成字幕图层
    
3.  **导入视频或生成视频**：
    
    *   Aegisub / After Effects / FFmpeg / MoviePy
        
4.  **渲染输出**：得到逐字显示的字幕效果
    

* * *

如果你需要，我可以帮你 **写一个 Python 脚本，把逐字 LRC 自动转换成 ASS 字幕，带 `\k` 卡拉 OK 风格**，直接可以用在视频里。

你想让我帮你写吗？

  

##### 你说：

可以通过 Remotion 实现这个逐字 KTV 效果吗

  

###### ChatGPT 说：

完全可以！🎵 用 **Remotion**（React + 视频渲染框架）实现逐字 KTV 风格字幕是很自然的方式，因为它允许你 **精确控制每一帧的渲染**。我给你梳理一下思路和方法。

* * *

1️⃣ 基本思路
--------

Remotion 视频渲染的核心是 **帧驱动渲染**，你可以：

1.  解析 **逐字 LRC** → 得到每个字的开始时间
    
2.  将时间转换为 **帧数**（`frame` / `fps`）
    
3.  在 React 组件里根据 **当前帧渲染已经出现的字**
    
4.  可以用动画（比如高亮或颜色变化）实现 KTV 风格
    

* * *

2️⃣ 核心逻辑示例
----------

假设你有一个 LRC 格式的数组：

```
TypeScript
const lrcData = [
  { char: '你', start: 12.0, end: 12.1 },
  { char: '好', start: 12.1, end: 12.2 },
  { char: '世', start: 12.2, end: 12.3 },
  { char: '界', start: 12.3, end: 12.5 },
];
```

### 转换时间到帧

```
TypeScript
import { useCurrentFrame, useVideoConfig, Sequence, AbsoluteFill } from 'remotion';

const fps = 30; // 假设视频30帧

const frameToTime = (frame: number) => frame / fps;
const timeToFrame = (time: number) => Math.floor(time * fps);
```

### 渲染逐字效果

```
TypeScript
export const KTVLyric: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 72, color: 'white' }}>
      {lrcData.map(({ char, start, end }, index) => {
        const startFrame = Math.floor(start * fps);
        const endFrame = Math.floor(end * fps);
        const isActive = frame >= startFrame && frame < endFrame;

        return (
          <span key={index} style={{ color: isActive ? 'yellow' : 'white' }}>
            {char}
          </span>
        );
      })}
    </AbsoluteFill>
  );
};
```

效果：

*   当前播放到的字变黄色（KTV 高亮）
    
*   其他字保持白色
    

* * *

3️⃣ 进一步优化
---------

1.  **平滑过渡**：
    
    *   可以用 Remotion 的 `interpolate` 或 `spring` 做渐变效果
        
    *   例如黄色字从白色渐变到黄色
        
2.  **滚动字幕**：
    
    *   如果歌词太长，可用 `translateY` 控制歌词滚动
        
    *   结合 `AbsoluteFill` 或 `div` 容器
        
3.  **卡拉 OK 风格**：
    
    *   字逐个高亮
        
    *   可以配合 `clip-path` 或 CSS 动画做填充效果
        
4.  **音频同步**：
    
    *   用 `Audio` 组件导入音乐
        
    *   时间轴和帧自动同步
        

* * *

✅ **总结**：

*   Remotion 可以完美实现逐字 KTV 效果
    
*   核心是 **将 LRC 时间转成帧，然后在 React 里按帧渲染高亮**
    
*   可以做颜色变化、填充动画、滚动等高级效果
    

* * *

如果你想，我可以帮你写一个 **完整的 Remotion KTV Lyric 组件模板**，直接把 LRC 导入就能生成视频，带 **逐字高亮动画**。

你希望我帮你写这个模板吗？

  

##### 你说：

帮我写一下这个模板吧

  

###### ChatGPT 说：

我会给你一个可直接放进 Remotion 项目的模板：包含 LRC 解析、逐字时间轴、KTV 填充高亮、音频同步和 Composition 示例。先确认一下当前 Remotion API 写法。

已思考 5s

可以。下面是一套 **Remotion 逐字 KTV 字幕模板**，核心用 `useCurrentFrame()` 按帧驱动、`useVideoConfig()` 拿 FPS，并用 `Html5Audio + staticFile()` 加载音频。[remotion.dev+2remotion.dev+2](https://www.remotion.dev/docs/use-current-frame/?utm_source=chatgpt.com)

### `src/KtvLyrics.tsx`

```
TypeScript
import React from "react";
import {
  AbsoluteFill,
  Html5Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type LyricChar = {
  text: string;
  start: number; // 秒
  end: number;   // 秒
};

const rawLrc = `[00:01.00]你[00:01.30]好[00:01.60]世[00:01.90]界
[00:03.00]这[00:03.25]是[00:03.50]逐[00:03.75]字[00:04.00]K[00:04.25]T[00:04.50]V`;

const parseTime = (time: string) => {
  const [min, sec] = time.split(":");
  return Number(min) * 60 + Number(sec);
};

const parseWordLrc = (lrc: string): LyricChar[] => {
  const matches = [...lrc.matchAll(/\[(\d{2}:\d{2}\.\d{2,3})\]([^\[]+)/g)];

  return matches.map((match, index) => {
    const start = parseTime(match[1]);
    const next = matches[index + 1];
    const end = next ? parseTime(next[1]) : start + 0.6;

    return {
      text: match[2],
      start,
      end,
    };
  });
};

const lyrics = parseWordLrc(rawLrc);

export const KtvLyrics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTime = frame / fps;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #111827, #020617)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "PingFang SC, Microsoft YaHei, sans-serif",
      }}
    >
      <Html5Audio src={staticFile("song.mp3")} />

      <div
        style={{
          fontSize: 76,
          fontWeight: 800,
          letterSpacing: 4,
          display: "flex",
          gap: 4,
          textShadow: "0 4px 20px rgba(0,0,0,0.8)",
          whiteSpace: "pre-wrap",
        }}
      >
        {lyrics.map((item, index) => {
          const progress = interpolate(
            currentTime,
            [item.start, item.end],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          const isPast = currentTime >= item.end;
          const isActive = currentTime >= item.start && currentTime < item.end;

          return (
            <span
              key={index}
              style={{
                position: "relative",
                display: "inline-block",
                color: isPast ? "#facc15" : "#ffffff",
                opacity: currentTime + 0.5 >= item.start ? 1 : 0.25,
                transform: isActive ? "scale(1.12)" : "scale(1)",
                transition: "transform 0.1s linear",
              }}
            >
              <span>{item.text}</span>

              {isActive && (
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: `${progress * 100}%`,
                    overflow: "hidden",
                    color: "#facc15",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.text}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
```

### `src/Root.tsx`

```
TypeScript
import React from "react";
import { Composition } from "remotion";
import { KtvLyrics } from "./KtvLyrics";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
     
      component={KtvLyrics}
      durationInFrames={30 * 10}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
```

### 文件放置

把音频放这里：

```
Plain text
public/song.mp3
```

运行：

```
Bash
npm run dev
```

渲染：

```
Bash
npx remotion render KtvLyrics out.mp4
```

这个模板实现的是 **字内横向填充高亮**，比单纯 “变黄” 更像 KTV。

  

##### 你说：

我想实现整个视频渲染出来的效果是左边是 1:1 的音乐封面截出来的圆形旋转唱片样式，右边是逐字歌词 + 进度条 + 播放按钮，这样一个极简但时尚的仿播放器效果

  

###### ChatGPT 说：

这个效果可以拆成一个完整 Composition：左侧旋转圆形封面唱片，右侧播放器面板，歌词按当前帧逐字填充，高亮同步音频。我会给你一个可直接改素材路径的版本。

已思考 5s

可以，下面是一个更完整的 Remotion 模板：**左侧旋转唱片封面 + 右侧逐字歌词 + 进度条 + 播放按钮**。

### `src/PlayerKtv.tsx`

```
TypeScript
import React from "react";
import {
  AbsoluteFill,
  Img,
  Html5Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

type LyricChar = {
  text: string;
  start: number;
  end: number;
};

const rawLrc = `[00:01.00]你[00:01.25]好[00:01.50]世[00:01.75]界
[00:03.00]这[00:03.20]是[00:03.40]一[00:03.60]个[00:03.85]播[00:04.10]放[00:04.35]器
[00:05.20]极[00:05.45]简[00:05.70]又[00:05.95]时[00:06.20]尚`;

const parseTime = (time: string) => {
  const [m, s] = time.split(":");
  return Number(m) * 60 + Number(s);
};

const parseWordLrc = (lrc: string): LyricChar[] => {
  const matches = [...lrc.matchAll(/\[(\d{2}:\d{2}\.\d{2,3})\]([^\[]+)/g)];

  return matches.map((match, index) => {
    const start = parseTime(match[1]);
    const next = matches[index + 1];
    const end = next ? parseTime(next[1]) : start + 0.6;

    return {
      text: match[2],
      start,
      end,
    };
  });
};

const lyrics = parseWordLrc(rawLrc);

const duration = 12;

export const PlayerKtv: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  const rotation = interpolate(frame, [0, fps * 8], [0, 360], {
    extrapolateRight: "extend",
  });

  const progress = Math.min(currentTime / duration, 1);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 25% 50%, #374151 0%, #111827 42%, #020617 100%)",
        color: "white",
        fontFamily:
          "Inter, PingFang SC, Microsoft YaHei, system-ui, sans-serif",
      }}
    >
      <Html5Audio src={staticFile("song.mp3")} />

      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 110,
          padding: 120,
          boxSizing: "border-box",
        }}
      >
        {/* 左侧唱片 */}
        <div
          style={{
            width: 560,
            height: 560,
            borderRadius: "50%",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 40px 120px rgba(0,0,0,0.55)",
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <Img
            src={staticFile("cover.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />

          {/* 黑胶暗层 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, transparent 0 16%, rgba(0,0,0,0.18) 17%, rgba(0,0,0,0.38) 100%)",
            }}
          />

          {/* 中心孔 */}
          <div
            style={{
              position: "absolute",
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: "#020617",
              border: "12px solid rgba(255,255,255,0.18)",
            }}
          />
        </div>

        {/* 右侧播放器 */}
        <div
          style={{
            width: 720,
            padding: "56px 64px",
            borderRadius: 40,
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 30px 90px rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.14)",
          }}
        >
          <div
            style={{
              fontSize: 34,
              fontWeight: 700,
              opacity: 0.95,
              marginBottom: 14,
            }}
          >
            Song Title
          </div>

          <div
            style={{
              fontSize: 22,
              opacity: 0.55,
              marginBottom: 70,
            }}
          >
            Artist Name
          </div>

          {/* 歌词 */}
          <div
            style={{
              fontSize: 54,
              fontWeight: 800,
              lineHeight: 1.55,
              minHeight: 180,
              letterSpacing: 2,
              display: "flex",
              flexWrap: "wrap",
              alignContent: "center",
            }}
          >
            {lyrics.map((item, index) => {
              const charProgress = interpolate(
                currentTime,
                [item.start, item.end],
                [0, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              );

              const isPast = currentTime >= item.end;
              const isActive =
                currentTime >= item.start && currentTime < item.end;

              return (
                <span
                  key={index}
                  style={{
                    position: "relative",
                    display: "inline-block",
                    color: isPast ? "#facc15" : "rgba(255,255,255,0.38)",
                    transform: isActive ? "scale(1.08)" : "scale(1)",
                    transition: "transform 0.1s linear",
                    marginRight: 2,
                  }}
                >
                  <span>{item.text}</span>

                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: `${charProgress * 100}%`,
                      overflow: "hidden",
                      color: "#facc15",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.text}
                  </span>
                </span>
              );
            })}
          </div>

          {/* 控制区 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              marginTop: 76,
            }}
          >
            {/* 播放按钮 */}
            <div
              style={{
                width: 74,
                height: 74,
                borderRadius: "50%",
                background: "#facc15",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 16px 40px rgba(250,204,21,0.35)",
              }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "16px solid transparent",
                  borderBottom: "16px solid transparent",
                  borderLeft: "24px solid #020617",
                  marginLeft: 6,
                }}
              />
            </div>

            {/* 进度条 */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  height: 8,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.18)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progress * 100}%`,
                    borderRadius: 999,
                    background: "#facc15",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 14,
                  fontSize: 18,
                  opacity: 0.5,
                }}
              >
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const formatTime = (time: number) => {
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};
```

### `src/Root.tsx`

```
TypeScript
import React from "react";
import { Composition } from "remotion";
import { PlayerKtv } from "./PlayerKtv";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
     
      component={PlayerKtv}
      durationInFrames={30 * 12}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
```

### 素材路径

放到 `public` 目录：

```
Plain text
public/song.mp3
public/cover.jpg
```

### 渲染

```
Bash
npx remotion render PlayerKtv out.mp4
```

你只需要替换：

```
TypeScript
const rawLrc = `...`;
const duration = 12;
```

以及：

```
TypeScript
Song Title
Artist Name
```

就能生成这个仿播放器 KTV 视频。

  

##### 你说：

李俊毅 JUNI - 白色声音 (651349449).ass文件

李俊毅 JUNI - 白色声音 (651349449).srt文件

李俊毅 JUNI - 白色声音 (651349449)- 逐行. lrc文件

李俊毅 JUNI - 白色声音 (651349449)- 逐字. lrc文件

素材应该还支持逐字、逐行 lrc、ass 和逐行 srt 文件，类似这样的我给你看看，能否自带转换器，然后歌词同时呈现前后共 5 行，输入逐字字幕就逐字 KTV，输入逐行字幕就逐行滚动即可

  

###### ChatGPT 说：

我会把它设计成 “字幕适配层”：统一把 `.lrc / .ass / .srt` 转成同一种内部结构，再由同一个歌词组件决定逐字 KTV 或逐行滚动。先看一下你给的几种文件格式细节，避免解析器写偏。

已思考 19s

可以，自带转换器应该这样做：**所有格式统一转成 `LyricLine[]`**，再判断：

*   有 `words` → 逐字 KTV
    
*   没有 `words` → 逐行滚动
    
*   同屏显示当前行前后共 5 行：`前2 + 当前 + 后2`
    

你这几个样例里，`.ass / .srt / 逐行.lrc` 都是逐行；你给的 “逐字. lrc” 更像 **带行结束时间的逐行 LRC**，不是每个字独立时间。但下面模板也支持真正逐字 LRC / enhanced LRC。

* * *

`src/lyrics/parseLyrics.ts`
---------------------------

```
TypeScript
export type LyricWord = {
  text: string;
  start: number;
  end: number;
};

export type LyricLine = {
  text: string;
  start: number;
  end: number;
  words?: LyricWord[];
};

const timeLrc = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;
const timeInline = /,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type LyricChar = {
  text: string;
  start: number; // 秒
  end: number;   // 秒
};

const rawLrc = `[00:01.00]你[00:01.30]好[00:01.60]世[00:01.90]界
[00:03.00]这[00:03.25]是[00:03.50]逐[00:03.75]字[00:04.00]K[00:04.25]T[00:04.50]V`;

const parseTime = (time: string) => {
  const [min, sec] = time.split(":");
  return Number(min) * 60 + Number(sec);
};

const parseWordLrc = (lrc: string): LyricChar[] => {
  const matches = [...lrc.matchAll(/\[(\d{2}:\d{2}\.\d{2,3})\]([^\[]+)/g)];

  return matches.map((match, index) => {
    const start = parseTime(match[1]);
    const next = matches[index + 1];
    const end = next ? parseTime(next[1]) : start + 0.6;

    return {
      text: match[2],
      start,
      end,
    };
  });
};

const lyrics = parseWordLrc(rawLrc);

export const KtvLyrics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTime = frame / fps;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #111827, #020617)",
        justifyContent: "center",
        alignItemsItems: "center",
        fontFamily: "PingFang SC, Microsoft YaHei, sans-serif",
      }}
    >
      <Html5Audio src={staticFile("song.mp3")} />

      <div
        style={{
          fontSize: 76,
          fontWeight: 800,
          letterSpacing: 4,
          display: "flex",
          gap: 4,
          textShadow: "0 4px 20px rgba(0,0,0,0.8)",
          whiteSpace: "pre-wrap",
        }}
      >
        {lyrics.map((item, index) => {
          const progress = interpolate(
            currentTime,
            [item.start, item.end],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          const isPast = currentTime >= item.end;
          const isActive = currentTime >= item.start && currentTime < item.end;

          return (
            <span
              key={index}
              style={{
                position: "relative",
                display: "inline-block",
                color: isPast ? "#facc15" : "#ffffff",
                opacity: currentTime + 0.5 >= item.start ? 1 : 0.25,
                transform: isActive ? "scale(1.12)" : "scale(1)",
                transition: "transform 0.1s linear",
              }}
            >
              <span>{item.text}</span>

              {isActive && (
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: `${progress * 100}%`,
                    overflow: "hidden",
                    color: "#facc15",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.text}
                </span>
              )}
            </span>
          );
        })}
 })}
      </div>
    </AbsoluteFill>
  );
};
```

### `src/Root.tsx`

```
TypeScript
import React from "react";
import { Composition } from "remotion";
import { KtvLyrics } from "./KtvLyrics";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
     
      component={KtvLyrics}
      durationInFrames={30 * 10}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
```

### 文件放置

把音频放这里：

```
Plain text
public/song.mp3
```

运行：

```
Bash
npm run dev
```

渲染：

```
Bash
npx remotion render KtvLyrics out.mp4
```

这个模板实现的是 **字内横向填充高亮**，比单纯 “变黄” 更像 KTV。

  

##### 你说：

不对啊，为啥只有音频有文件放置

  

###### ChatGPT 说：

对，你说得对。应该是 **音频、封面、字幕文件都放 public**，不是只放音频。

推荐结构：

```
Plain text
public/
  song.mp3
  cover.jpg
  lyrics.ass
  lyrics.srt
  lyrics-line.lrc
  lyrics-word.lrc
```

然后在 Remotion 里读取字幕文件一般不能直接 `import` 文本，推荐用 `fetch(staticFile(...))`：

```
TypeScript
import { staticFile, delayRender, continueRender } from "remotion";
import React, { useEffect, useState } from "react";
import { parseLyrics, LyricLine } from "./lyrics/parseLyrics";

export const useLyricsFile = (filename: string) => {
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [handle] = useState(() => delayRender());

  useEffect(() => {
    fetch(staticFile(filename))
      .then((res) => res.text())
      .then((text) => {
        setLyrics(parseLyrics(text, filename));
        continueRender(handle);
      });
  }, [filename, handle]);

  return lyrics;
};
```

在组件里这样用：

```
TypeScript
const lyrics = useLyricsFile("lyrics.ass");
// 或：
// const lyrics = useLyricsFile("lyrics.srt");
// const lyrics = useLyricsFile("lyrics-line.lrc");
// const lyrics = useLyricsFile("lyrics-word.lrc");
```

完整素材路径应该是：

```
TypeScript
<Html5Audio src={staticFile("song.mp3")} />

<Img src={staticFile("cover.jpg")} />

const lyrics = useLyricsFile("lyrics.ass");
```

所以最终模板应支持：

```
Plain text
public/song.mp3      音频
public/cover.jpg     封面
public/lyrics.ass    ASS 字幕
public/lyrics.srt    SRT 字幕
public/lyrics.lrc    LRC 字幕
```

之前我漏写了字幕文件放置，这里确实需要补上。

  

##### 你说：

但你这样没有做到项目隔离呀我发现，会降低 Remotion 的可复用性

  

###### ChatGPT 说：

对，应该做成 **数据驱动的项目隔离**，不要把素材名写死在组件里。

推荐结构：

```
Plain text
public/
  projects/
    white-voice/
      config.json
      song.mp3
      cover.jpg
      lyrics.ass

    another-song/
      config.json
      song.mp3
      cover.png
      lyrics-word.lrc
```

每个项目一个目录，组件只接收 `projectId`：

```
TypeScript
<Composition
 
  component={PlayerKtv}
  defaultProps={{
    projectId: "white-voice",
  }}
  durationInFrames={30 * 240}
  fps={30}
  width={1920}
  height={1080}
/>
```

`public/projects/white-voice/config.json`

```
JSON
{
  "title": "白色声音",
  "artist": "李俊毅 JUNI",
  "audio": "song.mp3",
  "cover": "cover.jpg",
  "lyrics": "lyrics.ass",
  "duration": 240,
  "theme": {
    "accent": "#facc15",
    "background": "#020617"
  }
}
```

然后封装一个 loader：

```
TypeScript
import { continueRender, delayRender, staticFile } from "remotion";
import { useEffect, useState } from "react";
import { parseLyrics, LyricLine } from "./lyrics/parseLyrics";

export type ProjectConfig = {
  title: string;
  artist: string;
  audio: string;
  cover: string;
  lyrics: string;
  duration: number;
  theme?: {
    accent?: string;
    background?: string;
  };
};

export const useProject = (projectId: string) => {
  const [handle] = useState(() => delayRender());
  const [data, setData] = useState<{
    config: ProjectConfig;
    lyrics: LyricLine[];
    basePath: string;
  } | null>(null);

  useEffect(() => {
    const basePath = `projects/${projectId}`;

    Promise.all([
      fetch(staticFile(`${basePath}/config.json`)).then((r) => r.json()),
    ]).then(async ([config]: [ProjectConfig]) => {
      const lyricText = await fetch(
        staticFile(`${basePath}/${config.lyrics}`)
      ).then((r) => r.text());

      setData({
        config,
        lyrics: parseLyrics(lyricText, config.lyrics),
        basePath,
      });

      continueRender(handle);
    });
  }, [projectId, handle]);

  return data;
};
```

在播放器组件里：

```
TypeScript
export const PlayerKtv: React.FC<{ projectId: string }> = ({ projectId }) => {
  const project = useProject(projectId);

  if (!project) return null;

  const { config, lyrics, basePath } = project;

  return (
    <>
      <Html5Audio src={staticFile(`${basePath}/${config.audio}`)} />
      <Img src={staticFile(`${basePath}/${config.cover}`)} />
      <LyricsPanel lyrics={lyrics} />
    </>
  );
};
```

这样就实现了：

```
Plain text
组件层：完全复用
项目层：只换 config.json + 素材
字幕层：自动识别 ass / srt / lrc
渲染层：同一个 Composition 可渲染不同项目
```

更进一步可以用：

```
Bash
npx remotion render PlayerKtv out.mp4 --props='{"projectId":"white-voice"}'
```

这样一个 Remotion 项目可以批量渲染很多首歌，不会互相污染。

  

##### 你说：

![](https://sass-node2.chatshare.biz/file_download/saasnexus-multimodal-2fa1c8ef-423021)

我看到一个很好看的风格，除了字幕部分他只显示一行，我希望显示多行，以及旋转的唱片以外，能否一比一复刻一下这个主题，并且他的背景也是选取歌曲封面的一个代表色带了一点浅渐变和质感层，也很高级

  

###### ChatGPT 说：

图片已创建 • 清新蓝调音乐播放器界面

分享

  

##### 你说：

不要生成图片，用 Remotion 复刻！！！

  

###### ChatGPT 说：

已思考 4s

对，应该 **不用生成图**，直接用 Remotion 复刻这个主题。我刚才误触发了图片生成，抱歉。

下面给你一个主题组件方向：**方形封面 + 右侧露出的旋转黑胶唱片 + 封面取色背景渐变 + 质感噪点层 + 右侧 5 行歌词 + 播放器控制区**。

项目结构
----

```
Plain text
public/
  projects/
    white-voice/
      config.json
      song.mp3
      cover.jpg
      lyrics.ass
```

`config.json`
-------------

```
JSON
{
  "title": "白色声音",
  "artist": "李俊毅",
  "audio": "song.mp3",
  "cover": "cover.jpg",
  "lyrics": "lyrics.ass",
  "duration": 217,
  "theme": {
    "accent": "#f6df5f",
    "bg1": "#2f6f91",
    "bg2": "#8fb8c6"
  }
}
```

核心布局 `PlayerTheme.tsx`
----------------------

```
TypeScript
import React from "react";
import {
  AbsoluteFill,
  Html5Audio,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { LyricsPanel } from "./components/LyricsPanel";
import { useProject } from "./useProject";

export const PlayerTheme: React.FC<{ projectId: string }> = ({ projectId }) => {
  const project = useProject(projectId);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!project) return null;

  const { config, lyrics, basePath } = project;
  const t = frame / fps;

  const rotate = interpolate(frame, [0, fps * 10], [0, 360], {
    extrapolateRight: "extend",
  });

  const progress = Math.min(t / config.duration, 1);
  const accent = config.theme?.accent ?? "#f6df5f";
  const bg1 = config.theme?.bg1 ?? "#2f6f91";
  const bg2 = config.theme?.bg2 ?? "#8fb8c6";

  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(circle at 22% 42%, rgba(255,255,255,0.18), transparent 32%),
          linear-gradient(145deg, ${bg1}, ${bg2})
        `,
        fontFamily: "PingFang SC, Microsoft YaHei, serif",
        color: "white",
        overflow: "hidden",
      }}
    >
      <Html5Audio src={staticFile(`${basePath}/${config.audio}`)} />

      {/* 质感颗粒层 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.18,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.25) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
          mixBlendMode: "overlay",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(0.2px)",
        }}
      />

      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          paddingLeft: 176,
          paddingRight: 220,
          gap: 210,
          boxSizing: "border-box",
        }}
      >
        {/* 左侧封面 + 黑胶 */}
        <div
          style={{
            position: "relative",
            width: 540,
            height: 540,
          }}
        >
          {/* 黑胶唱片 */}
          <div
            style={{
              position: "absolute",
              width: 520,
              height: 520,
              borderRadius: "50%",
              left: 260,
              top: 10,
              background:
                "repeating-radial-gradient(circle, #050505 0 8px, #151515 9px 12px, #070707 13px 18px)",
              boxShadow: "0 36px 80px rgba(0,0,0,0.5)",
              transform: `rotate(${rotate}deg)`,
            }}
          >
            <Img
              src={staticFile(`${basePath}/${config.cover}`)}
              style={{
                position: "absolute",
                width: 150,
                height: 150,
                borderRadius: "50%",
                objectFit: "cover",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />

            <div
              style={{
                position: "absolute",
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "#0a0a0a",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>

          {/* 方形封面 */}
          <Img
            src={staticFile(`${basePath}/${config.cover}`)}
            style={{
              position: "absolute",
              width: 540,
              height: 540,
              objectFit: "cover",
              boxShadow: "0 32px 70px rgba(0,0,0,0.45)",
            }}
          />
        </div>

        {/* 右侧播放器 */}
        <div style={{ width: 600 }}>
          <div
            style={{
              fontSize: 74,
              fontWeight: 300,
              letterSpacing: 8,
              marginBottom: 24,
            }}
          >
            {config.title}
          </div>

          <div
            style={{
              fontSize: 28,
              opacity: 0.92,
              marginBottom: 54,
            }}
          >
            演唱:{config.artist}
          </div>

          <div
            style={{
              width: 34,
              height: 2,
              background: "rgba(255,255,255,0.85)",
              marginBottom: 34,
            }}
          />

          <LyricsPanel
            lyrics={lyrics}
            accent={accent}
            visibleCount={5}
            mode="auto"
          />

          <div style={{ marginTop: 42 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 24,
                opacity: 0.95,
                marginBottom: 10,
              }}
            >
              <span>{formatTime(t)}</span>
              <span>{formatTime(config.duration)}</span>
            </div>

            <div
              style={{
                height: 4,
                background: "rgba(255,255,255,0.45)",
                position: "relative",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress * 100}%`,
                  background: "white",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  left: `${progress * 100}%`,
                  top: "50%",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "white",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>

            <div
              style={{
                marginTop: 42,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 46,
                fontSize: 48,
              }}
            >
              <span style={{ opacity: 0.75 }}>↢</span>
              <span style={{ opacity: 0.95 }}>◀</span>

              <div
                style={{
                  width: 112,
                  height: 112,
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.65)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 54,
                }}
              >
                ❚❚
              </div>

              <span style={{ opacity: 0.95 }}>▶</span>
              <span style={{ opacity: 0.75 }}>↣</span>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const formatTime = (time: number) => {
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};
```

`LyricsPanel` 继续用你前面那个 **5 行歌词组件**，只要稍微把 props 改成：

```
TypeScript
<LyricsPanel
  lyrics={lyrics}
  accent={accent}
  visibleCount={5}
  mode="auto"
/>
```

效果就是：

```
Plain text
左侧：方形封面 + 露出半张旋转黑胶
右侧：标题 / 歌手 / 5 行歌词 / 当前行高亮
底部：极简播放器控制
背景：来自封面代表色的浅渐变 + 颗粒质感
```

如果你要 “一比一更像截图”，关键参数是：

```
Plain text
封面尺寸：540
唱片 left：260
右侧标题字号：74
歌词区字号：当前行 34~38，非当前行 30 左右
背景：bg1 / bg2 从封面取色后写入 config
```