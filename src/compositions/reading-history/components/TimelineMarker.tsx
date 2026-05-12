import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { DISPLAY_FONT, BODY_FONT } from "../fonts";
import { useIsPortrait } from "../layout";

interface TimelineMarkerProps {
  year: string;
  eraLabel?: string;
}

export const TimelineMarker: React.FC<TimelineMarkerProps> = ({
  year,
  eraLabel,
}) => {
  const frame = useCurrentFrame();
  const p = useIsPortrait();

  const yearOpacity = interpolate(frame, [5, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineWidth = interpolate(frame, [10, 35], [0, 60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const labelOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: DISPLAY_FONT,
      }}
    >
      <div
        style={{
          opacity: yearOpacity,
          color: "#1d1d1f",
          fontSize: p ? 140 : 240,
          fontWeight: 600,
          letterSpacing: p ? "-2px" : "-4px",
          lineHeight: 1.07,
        }}
      >
        {year}
      </div>
      <div
        style={{
          width: `${lineWidth}%`,
          height: 2,
          backgroundColor: "rgba(0,0,0,0.1)",
          marginTop: p ? 24 : 32,
        }}
      />
      {eraLabel && (
        <div
          style={{
            opacity: labelOpacity,
            color: "#7a7a7a",
            fontSize: 28,
            fontWeight: 400,
            marginTop: p ? 18 : 24,
            letterSpacing: "0.196px",
            lineHeight: 1.14,
          }}
        >
          {eraLabel}
        </div>
      )}
    </AbsoluteFill>
  );
};
