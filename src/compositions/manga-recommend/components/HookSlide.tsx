import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { useTheme } from "../../../styles";

interface HookSlideProps {
  text: string;
}

export const HookSlide: React.FC<HookSlideProps> = ({ text }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const underlineWidth = interpolate(frame, [10, 40], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bgStyle: React.CSSProperties = {
    backgroundColor: theme.colors.accent,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: theme.fonts.title,
    padding: theme.spacing.pagePadding * 1.5,
  };

  if (theme.effects.backgroundOverlay) {
    bgStyle.backgroundImage = `${theme.effects.backgroundOverlay}`;
  }

  return (
    <AbsoluteFill style={bgStyle}>
      <div
        style={{
          transform: `scale(${scale})`,
          color: theme.colors.textPrimary,
          fontSize: Math.round(theme.typography.titleSize * 0.78),
          fontWeight: theme.typography.titleWeight,
          textAlign: "center",
          lineHeight: 1.5,
          position: "relative",
          textShadow: theme.effects.titleTextShadow,
        }}
      >
        &ldquo;{text}&rdquo;
        <div
          style={{
            position: "absolute",
            bottom: -8,
            left: "50%",
            transform: "translateX(-50%)",
            width: `${underlineWidth}%`,
            height: 4,
            backgroundColor: "rgba(255,255,255,0.6)",
            borderRadius: theme.effects.cardBorderRadius / 3,
            boxShadow: theme.effects.dividerShadow,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
