import React from "react";
import { UI_FONT } from "../fonts";

interface PlayerControlsProps {
  progress: number;
  currentTime: number;
  duration: number;
}

const formatTime = (time: number): string => {
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  progress,
  currentTime,
  duration,
}) => {
  return (
    <div style={{ marginTop: 42 }}>
      {/* Time display */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          fontFamily: UI_FONT,
          opacity: 0.85,
          marginBottom: 10,
        }}
      >
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 4,
          background: "rgba(255,255,255,0.35)",
          position: "relative",
          borderRadius: 2,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            background: "white",
            borderRadius: 2,
          }}
        />

        {/* Thumb dot */}
        <div
          style={{
            position: "absolute",
            left: `${progress * 100}%`,
            top: "50%",
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "white",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        />
      </div>

      {/* Control buttons */}
      <div
        style={{
          marginTop: 38,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 44,
        }}
      >
        {/* Previous */}
        <div
          style={{
            width: 0,
            height: 0,
            borderTop: "10px solid transparent",
            borderBottom: "10px solid transparent",
            borderRight: "16px solid rgba(255,255,255,0.75)",
          }}
        />
        <div
          style={{
            width: 0,
            height: 0,
            borderTop: "10px solid transparent",
            borderBottom: "10px solid transparent",
            borderRight: "16px solid rgba(255,255,255,0.75)",
            marginLeft: -36,
          }}
        />

        {/* Play/Pause */}
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Pause bars */}
          <div style={{ display: "flex", gap: 8 }}>
            <div
              style={{
                width: 6,
                height: 28,
                background: "rgba(255,255,255,0.9)",
                borderRadius: 2,
              }}
            />
            <div
              style={{
                width: 6,
                height: 28,
                background: "rgba(255,255,255,0.9)",
                borderRadius: 2,
              }}
            />
          </div>
        </div>

        {/* Next */}
        <div
          style={{
            width: 0,
            height: 0,
            borderTop: "10px solid transparent",
            borderBottom: "10px solid transparent",
            borderLeft: "16px solid rgba(255,255,255,0.75)",
          }}
        />
        <div
          style={{
            width: 0,
            height: 0,
            borderTop: "10px solid transparent",
            borderBottom: "10px solid transparent",
            borderLeft: "16px solid rgba(255,255,255,0.75)",
            marginLeft: -36,
          }}
        />
      </div>
    </div>
  );
};
