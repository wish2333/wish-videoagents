import type { Theme } from "../types";

export const minimalWhiteTheme: Theme = {
  colors: {
    primary: "#ffffff",
    secondary: "#f5f5f6",
    accent: "#111216",
    textPrimary: "#0c0d10",
    textSecondary: "#55596a",
    background: "#ffffff",
    cardBackground: "#ffffff",
    subtitleBackground: "rgba(12, 13, 16, 0.8)",
    subtitleText: "#ffffff",
    gradientStart: "#111216",
    gradientEnd: "#3b3f4a",
  },
  fonts: {
    title: "Inter, Noto Sans SC, sans-serif",
    body: "Inter, Noto Sans SC, sans-serif",
    subtitle: "Inter, Noto Sans SC, sans-serif",
  },
  typography: {
    titleSize: 68,
    titleWeight: 600,
    bodySize: 30,
    subtitleSize: 26,
    tagSize: 30,
    tagTextTransform: "none",
    tagLetterSpacing: "0px",
    kickerSize: 24,
    kickerLetterSpacing: "3px",
    kickerTextTransform: "uppercase",
  },
  effects: {
    cardBorder: "1px solid rgba(17, 18, 22, 0.08)",
    cardBorderRadius: 14,
    cardShadow: "0 1px 2px rgba(17, 18, 22, 0.04), 0 8px 24px rgba(17, 18, 22, 0.06)",
    imageBorderRadius: 12,
    titleLetterSpacing: "-0.035em",
    titleTextTransform: "none",
    pillBorder: "1px solid rgba(17, 18, 22, 0.08)",
    pillBorderRadius: 14,
  },
  spacing: {
    pagePadding: 100,
    cardPadding: 48,
    elementGap: 20,
  },
  layout: {
    landscape: { width: 1920, height: 1080 },
    portrait: { width: 1080, height: 1920 },
  },
  animation: {
    defaultDuration: 15,
    titleCardDuration: 90,
    transitionDuration: 10,
  },
  fps: 30,
};
