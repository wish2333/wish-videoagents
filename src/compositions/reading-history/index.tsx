import React from "react";
import { Sequence, AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { FadeTransition } from "../../components/FadeTransition";
import { ThemeProvider, getTheme } from "../../styles";
import { TimelineMarker } from "./components/TimelineMarker";
import { NarrativeSlide } from "./components/NarrativeSlide";
import { QuoteSlide } from "./components/QuoteSlide";
import { WorksShowcase } from "./components/WorksShowcase";
import type { ReadingHistoryData, Slide } from "./types";
import { DISPLAY_FONT, BODY_FONT } from "./fonts";
import { useIsPortrait } from "./layout";

export interface ReadingHistoryProps {
  data: ReadingHistoryData;
  themeName?: string;
}

const TitleCardApple: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const p = useIsPortrait();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [20, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: DISPLAY_FONT,
        padding: p ? "100px 50px" : "80px 160px",
      }}
    >
      <div
        style={{
          opacity: titleOpacity,
          color: "#1d1d1f",
          fontSize: p ? 78 : 80,
          fontWeight: 600,
          letterSpacing: p ? "2px" : "-0.28px",
          lineHeight: 1.07,
          textAlign: "center",
          whiteSpace: "pre-wrap",
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div
          style={{
            opacity: subtitleOpacity,
            color: "#7a7a7a",
            fontSize: 30,
            fontWeight: 400,
            letterSpacing: p ? "1.5px" : "0.196px",
            lineHeight: 1.14,
            marginTop: p ? 28 : 32,
            textAlign: "center",
            padding: p ? "0 20px" : undefined,
          }}
        >
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};

const OutroApple: React.FC<{ channelName?: string; message?: string }> = ({
  channelName,
  message,
}) => {
  const frame = useCurrentFrame();
  const p = useIsPortrait();

  const msgOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const nameOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: DISPLAY_FONT,
        padding: p ? "100px 50px" : 80,
      }}
    >
      <div
        style={{
          opacity: msgOpacity,
          color: "#1d1d1f",
          fontSize: p ? 52 : 52,
          fontWeight: 600,
          letterSpacing: p ? "1.5px" : "-0.28px",
          lineHeight: 1.15,
          textAlign: "center",
          maxWidth: p ? 900 : 1200,
        }}
      >
        {message ?? "Thank you for watching"}
      </div>
      {channelName && (
        <div
          style={{
            opacity: nameOpacity,
            color: "#7a7a7a",
            fontSize: 30,
            fontWeight: 400,
            letterSpacing: "0.196px",
            lineHeight: 1.14,
            marginTop: 32,
          }}
        >
          @{channelName}
        </div>
      )}
    </AbsoluteFill>
  );
};

const SLIDE_RENDERER: Record<
  Slide["type"],
  (slide: Slide) => React.ReactNode
> = {
  title: (slide) => {
    const s = slide as import("./types").TitleSlide;
    return <TitleCardApple title={s.title} subtitle={s.subtitle} />;
  },

  "timeline-marker": (slide) => {
    const s = slide as import("./types").TimelineMarkerSlide;
    return <TimelineMarker year={s.year} eraLabel={s.eraLabel} />;
  },

  narrative: (slide) => {
    const s = slide as import("./types").NarrativeSlide;
    return (
      <NarrativeSlide
        text={s.text}
        year={s.year}
        works={s.works}
        cardSize={s.cardSize}
        variant="default"
      />
    );
  },

  closing: (slide) => {
    const s = slide as import("./types").NarrativeSlide;
    return (
      <NarrativeSlide
        text={s.text}
        year={s.year}
        works={s.works}
        cardSize={s.cardSize}
        variant="closing"
      />
    );
  },

  quote: (slide) => {
    const s = slide as import("./types").QuoteSlide;
    return <QuoteSlide text={s.text} attribution={s.attribution} />;
  },

  "works-grid": (slide) => {
    const s = slide as import("./types").WorksGridSlide;
    return <WorksShowcase works={s.works} title={s.title} />;
  },

  outro: (slide) => {
    const s = slide as import("./types").OutroSlide;
    return <OutroApple channelName={s.channelName} message={s.message} />;
  },
};

const ProgressBar: React.FC<{ totalFrames: number }> = ({ totalFrames }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, totalFrames], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: 2,
        width: `${progress}%`,
        backgroundColor: "#0066cc",
        zIndex: 100,
      }}
    />
  );
};

export const ReadingHistory: React.FC<ReadingHistoryProps> = ({
  data,
  themeName = "dark",
}) => {
  const theme = getTheme(themeName);

  let frameOffset = 0;

  return (
    <ThemeProvider value={theme}>
      <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
        <ProgressBar totalFrames={data.totalDurationFrames} />

        {data.slides.map((slide, i) => {
          const from = frameOffset;
          frameOffset += slide.durationInFrames;

          return (
            <Sequence key={slide.id} from={from} durationInFrames={slide.durationInFrames}>
              <FadeTransition durationInFrames={slide.durationInFrames}>
                {SLIDE_RENDERER[slide.type](slide)}
              </FadeTransition>
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </ThemeProvider>
  );
};
