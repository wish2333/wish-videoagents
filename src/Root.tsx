import "./index.css";
import React from "react";
import { Composition } from "remotion";
import { MangaRecommend } from "./compositions/manga-recommend";
import type { MangaRecommendData } from "./compositions/manga-recommend/types";
import { ReadingHistory } from "./compositions/reading-history";
import type { ReadingHistoryData } from "./compositions/reading-history/types";
import { readingHistorySlides, totalDurationFrames } from "./compositions/reading-history/slides-data";
import { PlayerStyle } from "./compositions/player-style";
import type { PlayerStyleData } from "./compositions/player-style/types";
import { samplePlayerData } from "./compositions/player-style/sample-data";
import { getTheme } from "./styles";

const sampleMangaData: MangaRecommendData = {
  title: "This manga made me re-read it 3 times",
  workTitle: "Vagabond",
  workAuthor: "Takehiko Inoue",
  workGenre: ["Action", "Drama", "Historical"],
  hookText:
    "Not because of the fights, but because of the choices the characters make in critical moments",
  highlights: [
    {
      title: "The Art",
      description:
        "Every panel looks like a painting. Inoue uses ink wash techniques that make fight scenes feel alive.",
      imageSrc: "",
    },
    {
      title: "The Growth",
      description:
        "Musashi starts as a killer and slowly learns what it means to be strong vs what it means to be invincible.",
      imageSrc: "",
    },
    {
      title: "The Philosophy",
      description:
        "It asks: after you become the strongest, then what? The answer is not what you expect.",
      imageSrc: "",
    },
  ],
  targetAudience: [
    "People who want more than just fighting",
    "Readers who appreciate art",
    "Anyone searching for meaning",
  ],
  rating: 5,
  outroMessage: "Read it. You will not regret it.",
  channelName: "manga deep dives",
  audioSrc: "",
  totalDurationFrames: 630,
};

const dark = getTheme("dark");
const portrait = getTheme("dark");
const tokyoNight = getTheme("tokyo-night");
const cyberpunkNeon = getTheme("cyberpunk-neon");
const nord = getTheme("nord");
const dracula = getTheme("dracula");
const aurora = getTheme("aurora");
const vaporwave = getTheme("vaporwave");
const neoBrutalism = getTheme("neo-brutalism");
const sunsetWarm = getTheme("sunset-warm");
const minimalWhite = getTheme("minimal-white");
const gruvboxDark = getTheme("gruvbox-dark");
const rosePine = getTheme("rose-pine");
const glassmorphism = getTheme("glassmorphism");

const MangaC = MangaRecommend as unknown as React.ComponentType<Record<string, unknown>>;
const ReadingHistoryC = ReadingHistory as unknown as React.ComponentType<Record<string, unknown>>;
const PlayerStyleC = PlayerStyle as unknown as React.ComponentType<Record<string, unknown>>;

const sampleReadingHistoryData: ReadingHistoryData = {
  title: "Animemory #0 - 我的耽美阅读史",
  subtitle: "从八岁到研一，一路走来的阅读回忆",
  channelName: "Animemory",
  audioSrc: "",
  totalDurationFrames,
  slides: readingHistorySlides,
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="MangaRecommend" component={MangaC} durationInFrames={630}
        fps={dark.fps} width={dark.layout.landscape.width} height={dark.layout.landscape.height}
        defaultProps={{ data: sampleMangaData, themeName: "dark" }} />
      <Composition id="MangaRecommendVertical" component={MangaC} durationInFrames={630}
        fps={portrait.fps} width={portrait.layout.portrait.width} height={portrait.layout.portrait.height}
        defaultProps={{ data: sampleMangaData, themeName: "dark" }} />
      <Composition id="MangaTokyoNight" component={MangaC} durationInFrames={630}
        fps={tokyoNight.fps} width={tokyoNight.layout.landscape.width} height={tokyoNight.layout.landscape.height}
        defaultProps={{ data: sampleMangaData, themeName: "tokyo-night" }} />
      <Composition id="MangaCyberpunk" component={MangaC} durationInFrames={630}
        fps={cyberpunkNeon.fps} width={cyberpunkNeon.layout.landscape.width} height={cyberpunkNeon.layout.landscape.height}
        defaultProps={{ data: sampleMangaData, themeName: "cyberpunk-neon" }} />
      <Composition id="MangaNord" component={MangaC} durationInFrames={630}
        fps={nord.fps} width={nord.layout.landscape.width} height={nord.layout.landscape.height}
        defaultProps={{ data: sampleMangaData, themeName: "nord" }} />
      <Composition id="MangaDracula" component={MangaC} durationInFrames={630}
        fps={dracula.fps} width={dracula.layout.landscape.width} height={dracula.layout.landscape.height}
        defaultProps={{ data: sampleMangaData, themeName: "dracula" }} />
      <Composition id="MangaAurora" component={MangaC} durationInFrames={630}
        fps={aurora.fps} width={aurora.layout.landscape.width} height={aurora.layout.landscape.height}
        defaultProps={{ data: sampleMangaData, themeName: "aurora" }} />
      <Composition id="MangaVaporwave" component={MangaC} durationInFrames={630}
        fps={vaporwave.fps} width={vaporwave.layout.landscape.width} height={vaporwave.layout.landscape.height}
        defaultProps={{ data: sampleMangaData, themeName: "vaporwave" }} />
      <Composition id="MangaNeoBrutalism" component={MangaC} durationInFrames={630}
        fps={neoBrutalism.fps} width={neoBrutalism.layout.landscape.width} height={neoBrutalism.layout.landscape.height}
        defaultProps={{ data: sampleMangaData, themeName: "neo-brutalism" }} />
      <Composition id="MangaSunsetWarm" component={MangaC} durationInFrames={630}
        fps={sunsetWarm.fps} width={sunsetWarm.layout.landscape.width} height={sunsetWarm.layout.landscape.height}
        defaultProps={{ data: sampleMangaData, themeName: "sunset-warm" }} />
      <Composition id="MangaMinimalWhite" component={MangaC} durationInFrames={630}
        fps={minimalWhite.fps} width={minimalWhite.layout.landscape.width} height={minimalWhite.layout.landscape.height}
        defaultProps={{ data: sampleMangaData, themeName: "minimal-white" }} />
      <Composition id="MangaGruvboxDark" component={MangaC} durationInFrames={630}
        fps={gruvboxDark.fps} width={gruvboxDark.layout.landscape.width} height={gruvboxDark.layout.landscape.height}
        defaultProps={{ data: sampleMangaData, themeName: "gruvbox-dark" }} />
      <Composition id="MangaRosePine" component={MangaC} durationInFrames={630}
        fps={rosePine.fps} width={rosePine.layout.landscape.width} height={rosePine.layout.landscape.height}
        defaultProps={{ data: sampleMangaData, themeName: "rose-pine" }} />
      <Composition id="MangaGlassmorphism" component={MangaC} durationInFrames={630}
        fps={glassmorphism.fps} width={glassmorphism.layout.landscape.width} height={glassmorphism.layout.landscape.height}
        defaultProps={{ data: sampleMangaData, themeName: "glassmorphism" }} />

      <Composition id="ReadingHistory" component={ReadingHistoryC} durationInFrames={sampleReadingHistoryData.totalDurationFrames}
        fps={dark.fps} width={dark.layout.landscape.width} height={dark.layout.landscape.height}
        defaultProps={{ data: sampleReadingHistoryData, themeName: "dark" }} />
      <Composition id="ReadingHistoryVertical" component={ReadingHistoryC} durationInFrames={sampleReadingHistoryData.totalDurationFrames}
        fps={portrait.fps} width={portrait.layout.portrait.width} height={portrait.layout.portrait.height}
        defaultProps={{ data: sampleReadingHistoryData, themeName: "dark" }} />

      <Composition id="PlayerStyle" component={PlayerStyleC} durationInFrames={samplePlayerData.duration * 30}
        fps={30} width={1920} height={1080}
        defaultProps={{ data: samplePlayerData }} />
    </>
  );
};
