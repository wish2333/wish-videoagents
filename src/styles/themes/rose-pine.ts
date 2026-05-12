import type { Theme } from "../types";

export const rosePineTheme: Theme = {
  colors: {
    primary: "#26233a",
    secondary: "#2a2740",
    accent: "#ebbcba",
    textPrimary: "#e0def4",
    textSecondary: "#c4b8d8",
    background: "#191724",
    cardBackground: "#26233a",
    subtitleBackground: "rgba(25, 23, 36, 0.85)",
    subtitleText: "#e0def4",
    gradientStart: "#ebbcba",
    gradientEnd: "#9ccfd8",
  },
  fonts: {
    title: "Inter, Noto Sans SC, sans-serif",
    body: "Inter, Noto Sans SC, sans-serif",
    subtitle: "Inter, Noto Sans SC, sans-serif",
  },
  typography: {
    titleSize: 72,
    titleWeight: 600,
    bodySize: 30,
    subtitleSize: 26,
    tagSize: 30,
    tagTextTransform: "none",
    tagLetterSpacing: "1px",
    kickerSize: 24,
    kickerLetterSpacing: "5px",
    kickerTextTransform: "uppercase",
  },
  effects: {
    cardBorder: "1px solid rgba(224, 222, 244, 0.12)",
    cardBorderRadius: 14,
    cardShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
    imageBorderRadius: 14,
    titleLetterSpacing: "0px",
    titleTextTransform: "none",
    pillBorder: "1px solid rgba(224, 222, 244, 0.12)",
    pillBorderRadius: 14,
  },
  spacing: {
    pagePadding: 80,
    cardPadding: 44,
    elementGap: 22,
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
