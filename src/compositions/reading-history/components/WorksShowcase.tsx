import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  staticFile,
} from "remotion";
import type { ReferencedWork } from "../types";
import { BODY_FONT } from "../fonts";
import { useIsPortrait } from "../layout";

interface WorksShowcaseProps {
  works: ReferencedWork[];
  title?: string;
}

const CARD_W = 260;
const CARD_H = 347;
const CARD_W_P = 400;
const CARD_H_P = 300;
const MAX_VISIBLE = 6;

export const WorksShowcase: React.FC<WorksShowcaseProps> = ({
  works,
  title,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useIsPortrait();

  const titleOpacity = Math.min(1, frame / 15);

  const visibleWorks = works.slice(0, MAX_VISIBLE);
  const cw = p ? CARD_W_P : CARD_W;
  const ch = p ? CARD_H_P : CARD_H;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: BODY_FONT,
        padding: p ? "80px 30px" : 80,
      }}
    >
      {title && (
        <div
          style={{
            opacity: titleOpacity,
            color: "#7a7a7a",
            fontSize: 21,
            fontWeight: 600,
            marginBottom: p ? 32 : 48,
            letterSpacing: "0.231px",
            lineHeight: 1.19,
          }}
        >
          {title}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, auto)",
          justifyContent: "center",
          gap: p ? 24 : 32,
        }}
      >
        {visibleWorks.map((work, i) => {
          const cardScale = spring({
            frame: frame - 10 - i * 6,
            fps,
            config: { damping: 15, stiffness: 100 },
          });

          const isLastOdd = i === visibleWorks.length - 1 && visibleWorks.length % 2 === 1;

          return (
            <div
              key={i}
              style={{
                transform: `scale(${cardScale})`,
                position: "relative",
                width: cw,
                height: ch,
                borderRadius: 18,
                overflow: "hidden",
                boxShadow: "rgba(0, 0, 0, 0.22) 3px 5px 30px",
                ...(isLastOdd ? { gridColumn: "1 / -1", justifySelf: "center" } : {}),
              }}
            >
              {work.imageSrc ? (
                <>
                  <img
                    src={staticFile(work.imageSrc)}
                    alt={work.title}
                    style={{ width: cw, height: ch, objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "14px 18px",
                      background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <div style={{ color: "#fff", fontSize: 17, fontWeight: 600, letterSpacing: "-0.374px", lineHeight: 1.24 }}>
                      {work.title}
                    </div>
                    {work.author && (
                      <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 400 }}>
                        {work.author}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div
                  style={{
                    width: cw,
                    height: ch,
                    backgroundColor: "#fafafc",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 6,
                    padding: 20,
                  }}
                >
                  <div style={{ color: "#1d1d1f", fontSize: 19, fontWeight: 600, letterSpacing: "-0.374px", textAlign: "center", lineHeight: 1.24 }}>
                    {work.title}
                  </div>
                  {work.author && (
                    <div style={{ color: "#7a7a7a", fontSize: 14, fontWeight: 400 }}>
                      {work.author}
                    </div>
                  )}
                  <span
                    style={{
                      backgroundColor: "#f0f0f2",
                      color: "#0066cc",
                      padding: "3px 12px",
                      borderRadius: 9999,
                      fontSize: 12,
                      fontWeight: 400,
                      letterSpacing: "-0.12px",
                      lineHeight: 1.0,
                      marginTop: 2,
                    }}
                  >
                    {work.mediaType}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
