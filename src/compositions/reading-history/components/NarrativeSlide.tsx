import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import type { ReferencedWork } from "../types";
import { DISPLAY_FONT, BODY_FONT } from "../fonts";
import { useIsPortrait } from "../layout";

interface NarrativeSlideProps {
  text: string;
  year?: string;
  works?: ReferencedWork[];
  variant?: "default" | "closing";
}

const SINGLE_W = 400;
const SINGLE_H = 530;
const SINGLE_W_P = 440;
const SINGLE_H_P = 580;

const DUAL_W = 360;
const DUAL_H = 470;
const DUAL_W_P = 400;
const DUAL_H_P = 520;

const MANY_W = 260;
const MANY_H = 347;
const MANY_W_P = 400;
const MANY_H_P = 300;

function WorkCard({
  work,
  width,
  height,
  delay,
}: {
  work: ReferencedWork;
  width: number;
  height: number;
  delay: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        position: "relative",
        width,
        height,
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "rgba(0, 0, 0, 0.22) 3px 5px 30px",
      }}
    >
      {work.imageSrc ? (
        <>
          <img
            src={work.imageSrc}
            alt={work.title}
            style={{ width, height, objectFit: "cover" }}
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
            width,
            height,
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
}

export const NarrativeSlide: React.FC<NarrativeSlideProps> = ({
  text,
  year,
  works,
  variant = "default",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useIsPortrait();

  const textOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const yearScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const isClosing = variant === "closing";
  const workCount = works?.length ?? 0;
  const hasWorks = workCount > 0;

  const textColor = isClosing ? "#333333" : "#1d1d1f";
  const fontSize = isClosing
    ? (p ? 42 : 40)
    : (p ? 44 : 44);

  const textStyle: React.CSSProperties = {
    opacity: textOpacity,
    color: textColor,
    fontSize,
    fontWeight: 400,
    lineHeight: 1.47,
    letterSpacing: p ? "1px" : "-0.374px",
    textAlign: p ? "center" : "left",
    whiteSpace: "pre-wrap" as const,
  };

  const cards = (w: number, h: number, max: number, baseDelay: number, gap: number) =>
    works!.slice(0, max).map((work, i) => (
      <WorkCard key={i} work={work} width={w} height={h} delay={baseDelay + i * gap} />
    ));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: isClosing ? "#f5f5f7" : "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: BODY_FONT,
        padding: p ? "80px 40px" : "80px 120px",
      }}
    >
      {year && (
        <div
          style={{
            position: "absolute",
            top: p ? 30 : 48,
            right: p ? 30 : 80,
            transform: `scale(${yearScale})`,
            color: "#0066cc",
            fontSize: p ? 14 : 17,
            fontWeight: 600,
            letterSpacing: p ? "0.5px" : "-0.374px",
            lineHeight: 1.24,
          }}
        >
          {year}
        </div>
      )}

      {!hasWorks ? (
        <div style={{ ...textStyle, maxWidth: p ? 950 : 1400 }}>
          {text}
        </div>
      ) : p ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 40,
            width: "100%",
            maxWidth: 980,
          }}
        >
          <div style={{ ...textStyle, maxWidth: 950 }}>
            {text}
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: workCount === 1 ? "1fr" : "repeat(2, auto)",
            justifyContent: "center",
            gap: 24,
          }}>
            {workCount === 1
              ? cards(SINGLE_W_P, SINGLE_H_P, 1, 20, 8)
              : workCount === 2
                ? cards(DUAL_W_P, DUAL_H_P, 2, 20, 8)
                : works!.slice(0, 6).map((work, i) => (
                    <div key={i} style={i === works!.slice(0, 6).length - 1 && works!.slice(0, 6).length % 2 === 1 ? { gridColumn: "1 / -1", justifySelf: "center" } : undefined}>
                      <WorkCard work={work} width={MANY_W_P} height={MANY_H_P} delay={20 + i * 6} />
                    </div>
                  ))}
          </div>
        </div>
      ) : workCount <= 2 ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 80,
            width: "100%",
            maxWidth: 1600,
          }}
        >
          <div style={{ ...textStyle, flex: 1, minWidth: 0 }}>
            {text}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24, flexShrink: 0 }}>
            {workCount === 1
              ? cards(SINGLE_W, SINGLE_H, 1, 20, 8)
              : cards(DUAL_W, DUAL_H, 2, 20, 8)}
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 48,
            width: "100%",
            maxWidth: 1600,
          }}
        >
          <div style={{ ...textStyle, maxWidth: 1400 }}>
            {text}
          </div>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
          }}>
            {works!.slice(0, 6).map((work, i) => (
              <WorkCard key={i} work={work} width={MANY_W} height={MANY_H} delay={20 + i * 6} />
            ))}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
