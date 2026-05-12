import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { useTheme } from "../../../styles";

interface WorkCardProps {
  title: string;
  author: string;
  genre: string[];
}

export const WorkCard: React.FC<WorkCardProps> = ({ title, author, genre }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleY = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
    from: -40,
    to: 0,
  });

  const authorOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tagOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${theme.colors.cardBackground}, ${theme.colors.primary})`,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: theme.fonts.title,
  };

  if (theme.effects.backgroundOverlay) {
    cardStyle.backgroundImage = `${theme.effects.backgroundOverlay}, linear-gradient(135deg, ${theme.colors.cardBackground}, ${theme.colors.primary})`;
  }

  return (
    <AbsoluteFill style={cardStyle}>
      <div
        style={{
          transform: `translateY(${titleY}px)`,
          color: theme.colors.accent,
          fontSize: Math.round(theme.typography.titleSize * 0.9),
          fontWeight: 800,
          textAlign: "center",
          textShadow: `0 2px 20px ${theme.colors.accent}66`,
          letterSpacing: theme.effects.titleLetterSpacing,
          textTransform: theme.effects.titleTextTransform,
        }}
      >
        {title}
      </div>
      <div
        style={{
          opacity: authorOpacity,
          color: theme.colors.textSecondary,
          fontSize: theme.typography.bodySize,
          marginTop: 16,
          fontFamily: theme.fonts.body,
        }}
      >
        by {author}
      </div>
      <div
        style={{
          opacity: tagOpacity,
          display: "flex",
          gap: 16,
          marginTop: 30,
        }}
      >
        {genre.map((g, i) => (
          <div
            key={i}
            style={{
              backgroundColor: `${theme.colors.accent}33`,
              border: theme.effects.pillBorder ?? `1px solid ${theme.colors.accent}80`,
              color: theme.colors.accent,
              padding: "8px 20px",
              borderRadius: theme.effects.pillBorderRadius,
              fontSize: theme.typography.tagSize * 0.6,
              fontFamily: theme.fonts.body,
              boxShadow: theme.effects.pillShadow,
              textTransform: theme.typography.tagTextTransform,
              letterSpacing: theme.typography.tagLetterSpacing,
            }}
          >
            {g}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
