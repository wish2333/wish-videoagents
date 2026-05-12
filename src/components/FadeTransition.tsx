import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";

interface FadeTransitionProps {
  children: React.ReactNode;
  fadeInFrames?: number;
  fadeOutFrames?: number;
  durationInFrames: number;
}

export const FadeTransition: React.FC<FadeTransitionProps> = ({
  children,
  fadeInFrames = 8,
  fadeOutFrames = 8,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, fadeInFrames, durationInFrames - fadeOutFrames, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
