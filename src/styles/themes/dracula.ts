import type { Theme } from "../types";

export const draculaTheme: Theme = {
  colors: {
    primary: "#343746",
    secondary: "#44475a",
    accent: "#bd93f9",
    textPrimary: "#f8f8f2",
    textSecondary: "#bdbde0",
    background: "#282a36",
    cardBackground: "#343746",
    subtitleBackground: "rgba(40, 42, 54, 0.85)",
    subtitleText: "#f8f8f2",
    gradientStart: "#bd93f9",
    gradientEnd: "#8be9fd",
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
    cardBorder: "1px solid rgba(248, 248, 242, 0.12)",
    cardBorderRadius: 12,
    cardShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
    imageBorderRadius: 12,
    titleLetterSpacing: "0px",
    titleTextTransform: "none",
    pillBorder: "1px solid rgba(248, 248, 242, 0.12)",
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
