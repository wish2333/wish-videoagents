import React from "react";
import {
  AbsoluteFill,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { VinylDisc } from "./components/VinylDisc";
import { LyricsPanel } from "./components/LyricsPanel";
import { PlayerControls } from "./components/PlayerControls";
import type { PlayerStyleData, PlayerStyleProps } from "./types";
import { DISPLAY_FONT, UI_FONT } from "./fonts";

const PlayerStyle: React.FC<PlayerStyleProps> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTime = frame / fps;

  const rotation = interpolate(frame, [0, fps * 8], [0, 360], {
    extrapolateRight: "extend",
  });

  const progress = Math.min(currentTime / data.duration, 1);
  const accent = data.theme.accent;
  const bg1 = data.theme.bg1;
  const bg2 = data.theme.bg2;

  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(circle at 22% 42%, rgba(255,255,255,0.15), transparent 32%),
          linear-gradient(145deg, ${bg1}, ${bg2})
        `,
        fontFamily: DISPLAY_FONT,
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* Audio */}
      {data.audioSrc && <Audio src={staticFile(data.audioSrc)} />}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.15,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
          mixBlendMode: "overlay",
        }}
      />

      {/* Main layout */}
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
          gap: 120,
          boxSizing: "border-box",
        }}
      >
        {/* Left: Cover + Vinyl */}
        <VinylDisc coverSrc={data.coverSrc ? staticFile(data.coverSrc) : ""} rotation={rotation} />

        {/* Right: Player panel */}
        <div style={{ width: 620 }}>
          {/* Song title */}
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              letterSpacing: 6,
              fontFamily: DISPLAY_FONT,
              marginBottom: 18,
            }}
          >
            {data.title}
          </div>

          {/* Artist */}
          <div
            style={{
              fontSize: 26,
              fontFamily: UI_FONT,
              opacity: 0.88,
              marginBottom: 46,
            }}
          >
            {data.artist}
          </div>

          {/* Divider */}
          <div
            style={{
              width: 34,
              height: 2,
              background: "rgba(255,255,255,0.8)",
              marginBottom: 30,
            }}
          />

          {/* Lyrics */}
          <LyricsPanel
            lyrics={data.lyrics}
            accent={accent}
            visibleCount={5}
          />

          {/* Controls */}
          <PlayerControls
            progress={progress}
            currentTime={currentTime}
            duration={data.duration}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export { PlayerStyle };
export type { PlayerStyleData, PlayerStyleProps };
