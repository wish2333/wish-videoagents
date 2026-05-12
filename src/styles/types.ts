export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    textPrimary: string;
    textSecondary: string;
    background: string;
    cardBackground: string;
    subtitleBackground: string;
    subtitleText: string;
    gradientStart: string;
    gradientEnd: string;
  };

  fonts: {
    title: string;
    body: string;
    subtitle: string;
  };

  typography: {
    titleSize: number;
    titleWeight: number;
    bodySize: number;
    subtitleSize: number;
    tagSize: number;
    tagTextTransform: "none" | "uppercase";
    tagLetterSpacing: string;
    kickerSize: number;
    kickerLetterSpacing: string;
    kickerTextTransform: "none" | "uppercase";
  };

  effects: {
    titleTextShadow?: string;
    titleGradient?: boolean;
    titleLetterSpacing: string;
    titleTextTransform: "none" | "uppercase";
    cardBorder?: string;
    cardBorderRadius: number;
    cardShadow: string;
    cardBackdropFilter?: string;
    pillBorder?: string;
    pillBorderRadius: number;
    pillShadow?: string;
    imageBorderRadius: number;
    imageBorder?: string;
    imageShadow?: string;
    backgroundOverlay?: string;
    dividerShadow?: string;
  };

  spacing: {
    pagePadding: number;
    cardPadding: number;
    elementGap: number;
  };

  layout: {
    landscape: { width: number; height: number };
    portrait: { width: number; height: number };
  };

  animation: {
    defaultDuration: number;
    titleCardDuration: number;
    transitionDuration: number;
  };

  fps: number;
}
