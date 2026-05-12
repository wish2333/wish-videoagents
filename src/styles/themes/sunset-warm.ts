import type { Theme } from "../types";

export const sunsetWarmTheme: Theme = {
  colors: {
    primary: "#ffffff",
    secondary: "#fff2e0",
    accent: "#e36a2d",
    textPrimary: "#2a160a",
    textSecondary: "#6b4630",
    background: "#fff7ef",
    cardBackground: "#ffffff",
    subtitleBackground: "rgba(42, 22, 10, 0.8)",
    subtitleText: "#fff7ef",
    gradientStart: "#d94860",
    gradientEnd: "#f2a341",
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
    cardBorder: "1px solid rgba(120, 60, 20, 0.12)",
    cardBorderRadius: 18,
    cardShadow: "0 12px 32px rgba(227, 106, 45, 0.16)",
    imageBorderRadius: 16,
    imageShadow: "0 8px 24px rgba(227, 106, 45, 0.12)",
    titleLetterSpacing: "0px",
    titleTextTransform: "none",
    pillBorderRadius: 14,
  },
  spacing: {
    pagePadding: 80,
    cardPadding: 44,
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
