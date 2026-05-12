import type { Theme } from "../types";

export const darkTheme: Theme = {
  colors: {
    primary: "#1a1a2e",
    secondary: "#16213e",
    accent: "#e94560",
    textPrimary: "#ffffff",
    textSecondary: "#b0b0b0",
    background: "#0f0f23",
    cardBackground: "#1a1a3e",
    subtitleBackground: "rgba(0, 0, 0, 0.75)",
    subtitleText: "#ffffff",
    gradientStart: "#e94560",
    gradientEnd: "#533483",
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
    kickerLetterSpacing: "4px",
    kickerTextTransform: "uppercase",
  },
  effects: {
    cardBorderRadius: 12,
    cardShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
    imageBorderRadius: 12,
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
