# Videoagent 项目总览

## 项目(Composition) - 主题 - 文件 - 制作进度

### 项目 1: MangaRecommend (漫画推荐)

| 项目 | 主题 | Composition ID | 主题文件 | 制作进度 |
|------|------|---------------|----------|----------|
| MangaRecommend | dark (默认/横版) | MangaRecommend | dark.ts | 样例数据, 功能完成 |
| MangaRecommend | dark (竖版) | MangaRecommendVertical | dark.ts | 样例数据, 功能完成 |
| MangaRecommend | tokyo-night | MangaTokyoNight | tokyo-night.ts | 样例数据, 功能完成 |
| MangaRecommend | cyberpunk-neon | MangaCyberpunk | cyberpunk-neon.ts | 样例数据, 功能完成 |
| MangaRecommend | nord | MangaNord | nord.ts | 样例数据, 功能完成 |
| MangaRecommend | dracula | MangaDracula | dracula.ts | 样例数据, 功能完成 |
| MangaRecommend | aurora | MangaAurora | aurora.ts | 样例数据, 功能完成 |
| MangaRecommend | vaporwave | MangaVaporwave | vaporwave.ts | 样例数据, 功能完成 |
| MangaRecommend | neo-brutalism | MangaNeoBrutalism | neo-brutalism.ts | 样例数据, 功能完成 |
| MangaRecommend | sunset-warm | MangaSunsetWarm | sunset-warm.ts | 样例数据, 功能完成 |
| MangaRecommend | minimal-white | MangaMinimalWhite | minimal-white.ts | 样例数据, 功能完成 |
| MangaRecommend | gruvbox-dark | MangaGruvboxDark | gruvbox-dark.ts | 样例数据, 功能完成 |
| MangaRecommend | rose-pine | MangaRosePine | rose-pine.ts | 样例数据, 功能完成 |
| MangaRecommend | glassmorphism | MangaGlassmorphism | glassmorphism.ts | 样例数据, 功能完成 |

**源文件:** `src/compositions/manga-recommend/`
- types.ts, index.tsx
- components: HookSlide, WorkCard, HighlightCard, AudienceTags

---

### 项目 2: ReadingHistory (阅读史 - Animemory #0)

| 项目 | 主题 | Composition ID | 主题文件 | 制作进度 |
|------|------|---------------|----------|----------|
| ReadingHistory | dark (默认/横版) | ReadingHistory | dark.ts | 时间戳已对齐, 图片待补充(39张) |
| ReadingHistory | dark (竖版) | ReadingHistoryVertical | dark.ts | 同上 |
| ReadingHistory | rose-pine | ReadingHistoryRosePine | rose-pine.ts | 同上 |
| ReadingHistory | tokyo-night | ReadingHistoryTokyoNight | tokyo-night.ts | 同上 |
| ReadingHistory | aurora | ReadingHistoryAurora | aurora.ts | 同上 |
| ReadingHistory | vaporwave | ReadingHistoryVaporwave | vaporwave.ts | 同上 |

> ReadingHistory 采用 Apple Design Language 硬编码样式，主题仅影响 fps/尺寸等基础配置。

**源文件:** `src/compositions/reading-history/`
- types.ts
- index.tsx (TitleCardApple, OutroApple, ProgressBar)
- slides-data.ts (45 张幻灯片, 23247 帧, 约 12:55)
- components: NarrativeSlide, TimelineMarker, QuoteSlide, WorksShowcase, SectionTransition(未使用)

**制作进度明细:**

| 项目 | 状态 |
|------|------|
| 模板架构 | 完成 |
| 组件开发 | 完成 (5 个组件) |
| SRT 时间戳对齐 | 完成 |
| 文案数据录入 | 完成 |
| 图片素材 | 待补充 (0/39) |
| 开头新内容(待加) | 未开始 |
| 最终渲染 | 未开始 |

---

### 项目 3: PlayerStyle (播放器风格)

| 项目 | Composition ID | 尺寸 | 制作进度 |
|------|---------------|------|----------|
| PlayerStyle | PlayerStyle | 1920x1080 @ 30fps | 模板完成, 白色声音样例数据就绪 |

> PlayerStyle 不使用主题系统，视觉风格由数据中的 `theme: PlayerThemeColors` 控制。

**源文件:** `src/compositions/player-style/`
- types.ts (LyricWord, LyricLine, PlayerStyleData)
- parseLyrics.ts (LRC/SRT/ASS 统一解析器)
- fonts.ts (DISPLAY_FONT, LYRICS_FONT, UI_FONT)
- sample-data.ts (白色声音 - 41 行歌词, 204 秒)
- index.tsx (主组件)
- components: VinylDisc, LyricsPanel, PlayerControls

**制作进度明细:**

| 项目 | 状态 |
|------|------|
| 模板架构 | 完成 |
| 组件开发 | 完成 (3 个组件) |
| 歌词解析器 | 完成 (LRC/SRT/ASS) |
| 歌词滚动动画 | 完成 (spring 物理滚动) |
| KTV 逐字填充 | 完成 (words[] 模式) |
| 设计文档 | 完成 (DESIGN-Player.md) |
| 复用文档 | 完成 (docs/player-style-template-design.md) |
| 封面取色背景 | 完成 (theme.bg1/bg2 渐变 + 质感层) |

**设计文档:**

| 文件 | 内容 |
|------|------|
| DESIGN-Player.md | 播放器风格设计系统 (布局、Token、组件规格) |
| docs/player-style-template-design.md | 模板复用指南 (新歌曲接入流程) |
| docs/Reference-Player.md | 原始参考设计对话记录 |

---

## 主题系统

共 14 个主题, 定义在 `src/styles/themes/`:

| 主题名 | 文件 | 被引用 |
|--------|------|--------|
| dark | dark.ts | MangaRecommend, ReadingHistory |
| warm | warm.ts | 未注册为 Composition |
| tokyo-night | tokyo-night.ts | MangaRecommend, ReadingHistory |
| cyberpunk-neon | cyberpunk-neon.ts | MangaRecommend |
| nord | nord.ts | MangaRecommend |
| dracula | dracula.ts | MangaRecommend |
| aurora | aurora.ts | MangaRecommend, ReadingHistory |
| vaporwave | vaporwave.ts | MangaRecommend, ReadingHistory |
| neo-brutalism | neo-brutalism.ts | MangaRecommend |
| sunset-warm | sunset-warm.ts | MangaRecommend |
| minimal-white | minimal-white.ts | MangaRecommend |
| gruvbox-dark | gruvbox-dark.ts | MangaRecommend |
| rose-pine | rose-pine.ts | MangaRecommend, ReadingHistory |
| glassmorphism | glassmorphism.ts | MangaRecommend |

> PlayerStyle 不使用此主题系统，通过 `PlayerThemeColors` 自带配色。

---

## 文档

| 文件 | 内容 |
|------|------|
| DESIGN-Apple.md | Apple 风格设计系统 (ReadingHistory 使用) |
| DESIGN-Player.md | 播放器风格设计系统 (PlayerStyle 使用) |
| docs/guide.md | 英文项目指南 |
| docs/guide_zh.md | 中文项目指南 |
| docs/reading-history-template-design.md | ReadingHistory 模板设计文档 |
| docs/reading-history-template-reuse.md | ReadingHistory 模板复用文档 |
| docs/reading-history-workflow.md | 工作流复用文档 |
| docs/reading-history-image-checklist.md | 图片准备清单 (33 张) |
| docs/player-style-template-design.md | PlayerStyle 模板设计 & 复用文档 |
| docs/Reference-Player.md | 播放器风格原始参考 |
| docs/视频制作工具评估.md | 视频制作工具评估 |

---

## 统计

| 指标 | 数值 |
|------|------|
| Composition 总数 | 21 |
| 项目数 | 3 (MangaRecommend, ReadingHistory, PlayerStyle) |
| 主题数 | 14 |
| ReadingHistory 幻灯片数 | 45 |
| ReadingHistory 总时长 | 23247 帧 (12:55 @ 30fps) |
| PlayerStyle 样例时长 | 6120 帧 (3:24 @ 30fps) |
| 待补充图片 | 39 张 (ReadingHistory) |
| 组件文件数 | 13 |
