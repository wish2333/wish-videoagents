import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { useTheme } from "../../../styles";

interface AudienceTagsProps {
  audiences: string[];
}

export const AudienceTags: React.FC<AudienceTagsProps> = ({ audiences }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bgStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${theme.colors.secondary}, ${theme.colors.primary})`,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: theme.fonts.title,
    padding: theme.spacing.pagePadding,
  };

  if (theme.effects.backgroundOverlay) {
    bgStyle.backgroundImage = `${theme.effects.backgroundOverlay}, linear-gradient(135deg, ${theme.colors.secondary}, ${theme.colors.primary})`;
  }

  return (
    <AbsoluteFill style={bgStyle}>
      <div
        style={{
          opacity: titleOpacity,
          color: theme.colors.textSecondary,
          fontSize: theme.typography.kickerSize,
          marginBottom: 40,
          textTransform: theme.typography.kickerTextTransform,
          letterSpacing: theme.typography.kickerLetterSpacing,
          fontFamily: theme.fonts.body,
        }}
      >
        Recommended for
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.elementGap }}>
        {audiences.map((audience, i) => {
          const tagScale = spring({
            frame: frame - i * 8,
            fps,
            config: { damping: 15, stiffness: 100 },
          });

          const pillStyle: React.CSSProperties = {
            transform: `scale(${tagScale})`,
            backgroundColor: theme.colors.cardBackground,
            border: theme.effects.pillBorder ?? `1px solid ${theme.colors.accent}`,
            color: theme.colors.textPrimary,
            padding: "20px 50px",
            borderRadius: theme.effects.pillBorderRadius,
            boxShadow: theme.effects.pillShadow,
            fontSize: theme.typography.tagSize,
            textAlign: "center",
            fontFamily: theme.fonts.body,
            textTransform: theme.typography.tagTextTransform,
            letterSpacing: theme.typography.tagLetterSpacing,
          };

          if (theme.effects.cardBackdropFilter) {
            pillStyle.backdropFilter = theme.effects.cardBackdropFilter;
          }

          return (
            <div key={i} style={pillStyle}>
              {audience}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
