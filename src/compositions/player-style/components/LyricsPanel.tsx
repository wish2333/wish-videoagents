import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import type { LyricLine, LyricWord } from "../types";
import { LYRICS_FONT } from "../fonts";

interface LyricsPanelProps {
  lyrics: LyricLine[];
  accent: string;
  visibleCount?: number;
}

const LINE_HEIGHT = 54;
const ACTIVE_FONT_SIZE = 34;
const INACTIVE_FONT_SIZE = 26;

const PAST_LINES_ABOVE = 1.5;

const findCurrentLineIndex = (lyrics: LyricLine[], currentTime: number): number => {
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (currentTime >= lyrics[i].start) return i;
  }
  return -1;
};

const WordHighlight: React.FC<{
  word: LyricWord;
  currentTime: number;
  accent: string;
  isActive: boolean;
  isPast: boolean;
}> = ({ word, currentTime, accent, isActive, isPast }) => {
  const progress = interpolate(currentTime, [word.start, word.end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <span
      style={{
        position: "relative",
        display: "inline",
        color: isPast ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.5)",
        marginRight: 2,
      }}
    >
      <span>{word.text}</span>
      {isActive && (
        <span
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: `${progress * 100}%`,
            overflow: "hidden",
            color: "rgba(255,255,255,0.95)",
            whiteSpace: "nowrap",
          }}
        >
          {word.text}
        </span>
      )}
    </span>
  );
};

export const LyricsPanel: React.FC<LyricsPanelProps> = ({
  lyrics,
  accent,
  visibleCount = 5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  const currentIdx = findCurrentLineIndex(lyrics, currentTime);

  let scrollOffset = 0;
  if (currentIdx >= 0) {
    const lineStartFrame = Math.floor(lyrics[currentIdx].start * fps);
    const framesSinceStart = Math.max(0, frame - lineStartFrame);

    const sp = spring({
      frame: framesSinceStart,
      fps,
      config: { damping: 20, stiffness: 90, mass: 0.8 },
    });

    const prevOffset = Math.max(0, currentIdx - 1) * LINE_HEIGHT;
    const curOffset = currentIdx * LINE_HEIGHT;
    scrollOffset = interpolate(sp, [0, 1], [prevOffset, curOffset]);
  }

  const containerHeight = LINE_HEIGHT * visibleCount;
  const padding = PAST_LINES_ABOVE * LINE_HEIGHT;

  return (
    <div
      style={{
        height: containerHeight,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "100%",
          transform: `translateY(${-scrollOffset + padding}px)`,
        }}
      >
        {lyrics.map((line, idx) => {
          const isCurrent = idx === currentIdx;
          const isPast = idx < currentIdx;
          const distance = isPast
            ? currentIdx - idx
            : idx - currentIdx;

          let color: string;
          let opacity: number;
          let scale: number;

          if (isCurrent) {
            color = "rgba(255,255,255,0.95)";
            opacity = 1;
            scale = 1;
          } else if (isPast) {
            color = "rgba(255,255,255,0.4)";
            opacity = Math.max(0.25, 1 - distance * 0.35);
            scale = 0.92;
          } else {
            color = "rgba(255,255,255,0.55)";
            opacity = Math.max(0.2, 1 - distance * 0.2);
            scale = 0.94;
          }

          return (
            <div
              key={idx}
              style={{
                height: LINE_HEIGHT,
                display: "flex",
                alignItems: "center",
                opacity,
                transform: `scale(${scale})`,
                transformOrigin: "left center",
                fontFamily: LYRICS_FONT,
                fontSize: isCurrent ? ACTIVE_FONT_SIZE : INACTIVE_FONT_SIZE,
                fontWeight: isCurrent ? 700 : 400,
                color,
                letterSpacing: 1,
                whiteSpace: "normal",
                lineHeight: LINE_HEIGHT,
              }}
            >
              {isCurrent && line.words
                ? line.words.map((word, wi) => (
                    <WordHighlight
                      key={wi}
                      word={word}
                      currentTime={currentTime}
                      accent={accent}
                      isActive={
                        currentTime >= word.start && currentTime < word.end
                      }
                      isPast={currentTime >= word.end}
                    />
                  ))
                : line.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};
