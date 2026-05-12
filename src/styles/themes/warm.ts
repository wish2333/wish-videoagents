import type { Theme } from "../types";

export const warmTheme: Theme = {
  colors: {
    primary: "#2d1b0e",
    secondary: "#3d2a1a",
    accent: "#d4853b",
    textPrimary: "#fdf6ec",
    textSecondary: "#c4a882",
    background: "#1a1008",
    cardBackground: "#3d2a1a",
    subtitleBackground: "rgba(26, 16, 8, 0.8)",
    subtitleText: "#fdf6ec",
    gradientStart: "#d4853b",
    gradientEnd: "#8b4513",
  },
  fonts: {
    title: "Noto Sans SC",
    body: "Noto Sans SC",
    subtitle: "Noto Sans SC",
  },
  typography: {
    titleSize: 72,
    titleWeight: 700,
    bodySize: 32,
    subtitleSize: 28,
    tagSize: 32,
    tagTextTransform: "none",
    tagLetterSpacing: "0px",
    kickerSize: 28,
    kickerLetterSpacing: "3px",
    kickerTextTransform: "uppercase",
  },
  effects: {
    cardBorderRadius: 14,
    cardShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
    imageBorderRadius: 14,
    titleLetterSpacing: "0px",
    titleTextTransform: "none",
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
