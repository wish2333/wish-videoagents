import React from "react";
import { Img } from "remotion";

interface VinylDiscProps {
  coverSrc: string;
  rotation: number;
}

export const VinylDisc: React.FC<VinylDiscProps> = ({ coverSrc, rotation }) => {
  return (
    <div style={{ position: "relative", width: 660, height: 440, flexShrink: 0 }}>
      {/* Vinyl record - peeking from behind cover */}
      <div
        style={{
          position: "absolute",
          width: 440,
          height: 440,
          borderRadius: "50%",
          left: 220,
          top: 0,
          background:
            "repeating-radial-gradient(circle, #050505 0 8px, #151515 9px 12px, #070707 13px 18px)",
          boxShadow: "0 36px 80px rgba(0,0,0,0.5)",
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {/* Cover image in vinyl center */}
        {coverSrc && (
          <Img
            src={coverSrc}
            style={{
              position: "absolute",
              width: 110,
              height: 110,
              borderRadius: "50%",
              objectFit: "cover",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        )}

        {/* Center spindle hole */}
        <div
          style={{
            position: "absolute",
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#0a0a0a",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* Square cover image - in front */}
      {coverSrc && (
        <Img
          src={coverSrc}
          style={{
            position: "absolute",
            width: 440,
            height: 440,
            objectFit: "cover",
            boxShadow: "0 32px 70px rgba(0,0,0,0.45)",
          }}
        />
      )}
    </div>
  );
};
