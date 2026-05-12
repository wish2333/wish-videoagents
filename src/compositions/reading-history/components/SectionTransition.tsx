import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { BODY_FONT } from "../fonts";

interface SectionTransitionProps {
  sectionTitle: string;
}

export const SectionTransition: React.FC<SectionTransitionProps> = ({
  sectionTitle,
}) => {
  const frame = useCurrentFrame();

  const lineScale = interpolate(frame, [5, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#f5f5f7",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: BODY_FONT,
      }}
    >
      <div
        style={{
          width: "40%",
          height: 1,
          backgroundColor: "#e0e0e0",
          transform: `scaleX(${lineScale})`,
        }}
      />
      <div
        style={{
          opacity: titleOpacity,
          color: "#7a7a7a",
          fontSize: 24,
          fontWeight: 300,
          marginTop: 24,
          letterSpacing: 0,
          lineHeight: 1.5,
        }}
      >
        {sectionTitle}
      </div>
    </AbsoluteFill>
  );
};
