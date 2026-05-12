import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { useTheme } from "../styles";

interface OutroProps {
  channelName?: string;
  message?: string;
}

export const Outro: React.FC<OutroProps> = ({
  channelName = "",
  message = "Thank you for watching",
}) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const textOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bgStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${theme.colors.gradientEnd}, ${theme.colors.primary})`,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: theme.fonts.title,
  };

  if (theme.effects.backgroundOverlay) {
    bgStyle.backgroundImage = `${theme.effects.backgroundOverlay}, linear-gradient(135deg, ${theme.colors.gradientEnd}, ${theme.colors.primary})`;
  }

  return (
    <AbsoluteFill style={bgStyle}>
      <div
        style={{
          transform: `scale(${iconScale})`,
          fontSize: 60,
          marginBottom: 30,
        }}
      >
        {"\u{1F44B}"}
      </div>
      <div
        style={{
          opacity: textOpacity,
          color: theme.colors.textPrimary,
          fontSize: 48,
          fontWeight: 700,
          textShadow: theme.effects.titleTextShadow,
        }}
      >
        {message}
      </div>
      {channelName && (
        <div
          style={{
            opacity: textOpacity,
            color: theme.colors.accent,
            fontSize: 36,
            marginTop: 20,
            fontWeight: 600,
          }}
        >
          @{channelName}
        </div>
      )}
    </AbsoluteFill>
  );
};
