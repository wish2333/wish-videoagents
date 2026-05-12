import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { useTheme } from "../styles";

interface SubtitleProps {
  text: string;
  fontSize?: number;
  bottom?: number;
}

export const Subtitle: React.FC<SubtitleProps> = ({
  text,
  fontSize,
  bottom = 80,
}) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const resolvedFontSize = fontSize ?? theme.typography.subtitleSize;

  const opacity = interpolate(frame, [0, 5, 10], [0, 0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: bottom,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity,
          backgroundColor: theme.colors.subtitleBackground,
          color: theme.colors.subtitleText,
          fontSize: resolvedFontSize,
          fontFamily: theme.fonts.subtitle,
          padding: "12px 36px",
          borderRadius: theme.effects.cardBorderRadius,
          maxWidth: "80%",
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
