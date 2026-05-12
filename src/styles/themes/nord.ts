import type { Theme } from "../types";

export const nordTheme: Theme = {
  colors: {
    primary: "#3b4252",
    secondary: "#434c5e",
    accent: "#88c0d0",
    textPrimary: "#eceff4",
    textSecondary: "#d8dee9",
    background: "#2e3440",
    cardBackground: "#3b4252",
    subtitleBackground: "rgba(46, 52, 64, 0.85)",
    subtitleText: "#eceff4",
    gradientStart: "#88c0d0",
    gradientEnd: "#b48ead",
  },
  fonts: {
    title: "Inter, Noto Sans SC, sans-serif",
    body: "Inter, Noto Sans SC, sans-serif",
    subtitle: "Inter, Noto Sans SC, sans-serif",
  },
  typography: {
    titleSize: 72,
    titleWeight: 700,
    bodySize: 32,
    subtitleSize: 28,
    tagSize: 32,
    tagTextTransform: "none",
    tagLetterSpacing: "0px",
    kickerSize: 26,
    kickerLetterSpacing: "4px",
    kickerTextTransform: "uppercase",
  },
  effects: {
    cardBorder: "1px solid rgba(236, 239, 244, 0.12)",
    cardBorderRadius: 12,
    cardShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
    imageBorderRadius: 12,
    titleLetterSpacing: "0px",
    titleTextTransform: "none",
    pillBorder: "1px solid rgba(236, 239, 244, 0.12)",
    pillBorderRadius: 12,
  },
  spacing: {
    pagePadding: 80,
    cardPadding: 40,
    elementGap: 24,
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
