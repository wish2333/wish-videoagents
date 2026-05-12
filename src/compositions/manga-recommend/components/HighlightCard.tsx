import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { useTheme } from "../../../styles";

interface HighlightCardProps {
  index: number;
  title: string;
  description: string;
  imageSrc?: string;
}

export const HighlightCard: React.FC<HighlightCardProps> = ({
  index,
  title,
  description,
  imageSrc,
}) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const descOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const contentCardStyle: React.CSSProperties = {
    transform: `scale(${cardScale})`,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 60,
    maxWidth: 1600,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.effects.cardBorderRadius,
    border: theme.effects.cardBorder,
    boxShadow: theme.effects.cardShadow,
    padding: theme.spacing.cardPadding,
  };

  if (theme.effects.cardBackdropFilter) {
    contentCardStyle.backdropFilter = theme.effects.cardBackdropFilter;
  }

  const numberCircleStyle: React.CSSProperties = {
    backgroundColor: theme.colors.accent,
    color: theme.colors.textPrimary,
    width: 80,
    height: 80,
    borderRadius: theme.effects.cardBorderRadius > 14 ? "50%" : theme.effects.cardBorderRadius,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 40,
    fontWeight: 800,
    flexShrink: 0,
  };

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: theme.fonts.title,
        padding: theme.spacing.pagePadding,
      }}
    >
      {imageSrc ? (
        <div style={contentCardStyle}>
          <img
            src={imageSrc}
            alt={title}
            style={{
              width: 300,
              height: 300,
              objectFit: "cover",
              borderRadius: theme.effects.imageBorderRadius,
              border: theme.effects.imageBorder,
              boxShadow: theme.effects.imageShadow,
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                color: theme.colors.textPrimary,
                fontSize: Math.round(theme.typography.titleSize * 0.67),
                fontWeight: theme.typography.titleWeight,
                marginBottom: 16,
                letterSpacing: theme.effects.titleLetterSpacing,
              }}
            >
              {title}
            </div>
            <div
              style={{
                opacity: descOpacity,
                color: theme.colors.textSecondary,
                fontSize: theme.typography.subtitleSize,
                lineHeight: 1.6,
                maxWidth: 900,
                fontFamily: theme.fonts.body,
              }}
            >
              {description}
            </div>
          </div>
        </div>
      ) : (
        <div style={contentCardStyle}>
          <div style={numberCircleStyle}>{index}</div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                color: theme.colors.textPrimary,
                fontSize: Math.round(theme.typography.titleSize * 0.67),
                fontWeight: theme.typography.titleWeight,
                marginBottom: 16,
                letterSpacing: theme.effects.titleLetterSpacing,
              }}
            >
              {title}
            </div>
            <div
              style={{
                opacity: descOpacity,
                color: theme.colors.textSecondary,
                fontSize: theme.typography.subtitleSize,
                lineHeight: 1.6,
                maxWidth: 900,
                fontFamily: theme.fonts.body,
              }}
            >
              {description}
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
