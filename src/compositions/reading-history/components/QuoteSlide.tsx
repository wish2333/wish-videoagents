import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { DISPLAY_FONT, BODY_FONT, QUOTE_FONT } from "../fonts";
import { useIsPortrait } from "../layout";

interface QuoteSlideProps {
  text: string;
  attribution?: string;
}

export const QuoteSlide: React.FC<QuoteSlideProps> = ({ text, attribution }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useIsPortrait();

  const contentScale = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 80 },
  });

  const attrOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#272729",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: BODY_FONT,
        padding: p ? "100px 45px" : "120px 160px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: p ? "6%" : "12%",
          left: p ? "6%" : "12%",
          fontSize: p ? 120 : 200,
          color: "#2997ff",
          opacity: 0.12,
          fontFamily: QUOTE_FONT,
          lineHeight: 1,
        }}
      >
        {"“"}
      </div>

      <div
        style={{
          transform: `scale(${contentScale})`,
          color: "#ffffff",
          fontSize: p ? 50 : 48,
          fontWeight: 600,
          letterSpacing: p ? "2px" : "-0.28px",
          lineHeight: 1.1,
          maxWidth: p ? 900 : 1100,
          textAlign: "center",
        }}
      >
        {text}
      </div>

      {attribution && (
        <div
          style={{
            opacity: attrOpacity,
            color: "#cccccc",
            fontSize: 22,
            fontWeight: 600,
            marginTop: p ? 24 : 32,
            letterSpacing: "0.231px",
            lineHeight: 1.19,
          }}
        >
          {"—— "}{attribution}
        </div>
      )}
    </AbsoluteFill>
  );
};
