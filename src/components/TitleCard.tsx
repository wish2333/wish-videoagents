import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { useTheme } from "../styles";

interface TitleCardProps {
  title: string;
  subtitle?: string;
  backgroundColor?: string;
}

export const TitleCard: React.FC<TitleCardProps> = ({
  title,
  subtitle,
  backgroundColor,
}) => {
  const theme = useTheme();
  const bg = backgroundColor ?? theme.colors.gradientStart;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const subtitleOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleStyle: React.CSSProperties = {
    transform: `scale(${titleScale})`,
    color: theme.colors.textPrimary,
    fontSize: theme.typography.titleSize,
    fontWeight: theme.typography.titleWeight,
    textAlign: "center",
    padding: "0 120px",
    letterSpacing: theme.effects.titleLetterSpacing,
    textTransform: theme.effects.titleTextTransform,
    textShadow: theme.effects.titleTextShadow ?? "0 4px 20px rgba(0,0,0,0.3)",
  };

  if (theme.effects.titleGradient) {
    titleStyle.background = `linear-gradient(135deg, ${theme.colors.gradientStart}, ${theme.colors.gradientEnd})`;
    titleStyle.WebkitBackgroundClip = "text";
    titleStyle.WebkitTextFillColor = "transparent";
    titleStyle.backgroundClip = "text";
  }

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${bg}, ${theme.colors.gradientEnd})`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: theme.fonts.title,
      }}
    >
      <div style={titleStyle}>{title}</div>
      {subtitle && (
        <div
          style={{
            opacity: subtitleOpacity,
            color: theme.colors.textSecondary,
            fontSize: theme.typography.bodySize,
            marginTop: 20,
            textAlign: "center",
            fontFamily: theme.fonts.body,
          }}
        >
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};
