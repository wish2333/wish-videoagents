import type { Theme } from "../types";

export const gruvboxDarkTheme: Theme = {
  colors: {
    primary: "#3c3836",
    secondary: "#504945",
    accent: "#fabd2f",
    textPrimary: "#ebdbb2",
    textSecondary: "#d5c4a1",
    background: "#282828",
    cardBackground: "#3c3836",
    subtitleBackground: "rgba(40, 40, 40, 0.85)",
    subtitleText: "#ebdbb2",
    gradientStart: "#fe8019",
    gradientEnd: "#b8bb26",
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
    cardBorder: "1px solid rgba(235, 219, 178, 0.14)",
    cardBorderRadius: 6,
    cardShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
    imageBorderRadius: 6,
    titleLetterSpacing: "0px",
    titleTextTransform: "none",
    pillBorder: "1px solid rgba(235, 219, 178, 0.14)",
    pillBorderRadius: 6,
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
