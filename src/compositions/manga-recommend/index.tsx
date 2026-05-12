import React from "react";
import { Sequence, AbsoluteFill } from "remotion";
import { TitleCard } from "../../components/TitleCard";
import { Subtitle } from "../../components/Subtitle";
import { Outro } from "../../components/Outro";
import { ThemeProvider, getTheme } from "../../styles";
import { WorkCard } from "./components/WorkCard";
import { HookSlide } from "./components/HookSlide";
import { HighlightCard } from "./components/HighlightCard";
import { AudienceTags } from "./components/AudienceTags";
import type { MangaRecommendData } from "./types";

const SECTIONS = {
  title: { start: 0, duration: 75 },
  hook: { start: 75, duration: 90 },
  workCard: { start: 165, duration: 90 },
  highlight: { start: 255, perItem: 75 },
  audience: { start: 480, duration: 75 },
  outro: { start: 555, duration: 75 },
} as const;

export interface MangaRecommendProps {
  data: MangaRecommendData;
  themeName?: string;
}

export const MangaRecommend: React.FC<MangaRecommendProps> = ({
  data,
  themeName = "dark",
}) => {
  const theme = getTheme(themeName);

  const bgStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
  };

  if (theme.effects.backgroundOverlay) {
    bgStyle.backgroundImage = theme.effects.backgroundOverlay;
  }

  return (
    <ThemeProvider value={theme}>
      <AbsoluteFill style={bgStyle}>
        <Sequence from={SECTIONS.title.start} durationInFrames={SECTIONS.title.duration}>
          <TitleCard title={data.title} />
        </Sequence>

        <Sequence from={SECTIONS.hook.start} durationInFrames={SECTIONS.hook.duration}>
          <HookSlide text={data.hookText} />
          <Subtitle text={data.hookText} />
        </Sequence>

        <Sequence from={SECTIONS.workCard.start} durationInFrames={SECTIONS.workCard.duration}>
          <WorkCard
            title={data.workTitle}
            author={data.workAuthor}
            genre={data.workGenre}
          />
        </Sequence>

        {data.highlights.map((highlight, i) => (
          <Sequence
            key={i}
            from={SECTIONS.highlight.start + i * SECTIONS.highlight.perItem}
            durationInFrames={SECTIONS.highlight.perItem}
          >
            <HighlightCard
              index={i + 1}
              title={highlight.title}
              description={highlight.description}
              imageSrc={highlight.imageSrc}
            />
            <Subtitle text={highlight.description} fontSize={28} />
          </Sequence>
        ))}

        <Sequence from={SECTIONS.audience.start} durationInFrames={SECTIONS.audience.duration}>
          <AudienceTags audiences={data.targetAudience} />
        </Sequence>

        <Sequence from={SECTIONS.outro.start} durationInFrames={SECTIONS.outro.duration}>
          <Outro channelName={data.channelName} message={data.outroMessage} />
        </Sequence>
      </AbsoluteFill>
    </ThemeProvider>
  );
};
