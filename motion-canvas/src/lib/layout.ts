// Canvas dimensions (1920x1080 landscape)
export const CANVAS_WIDTH = 1920;
export const CANVAS_HEIGHT = 1080;

// Color palette — matches Remotion ReadingHistory Apple design (white/light theme)
export const COLORS = {
  // Backgrounds
  background: '#ffffff',
  titleBackground: '#ffffff',
  closingBackground: '#f5f5f7',
  quoteBackground: '#272729',

  // Text
  titleText: '#1d1d1f',
  subtitleText: '#7a7a7a',
  bodyText: '#1d1d1f',
  closingText: '#333333',
  quoteText: '#ffffff',
  quoteAttribution: '#cccccc',
  sectionTitle: '#7a7a7a',

  // Accent
  accent: '#0066cc',
  accentLight: '#2997ff',
  quoteMark: 'rgba(41, 151, 255, 0.12)',

  // Cards
  cardBackground: '#fafafc',
  cardPillBackground: '#f0f0f2',
  cardShadow: 'rgba(0, 0, 0, 0.22)',
  cardOverlayTitle: '#ffffff',
  cardOverlayAuthor: 'rgba(255, 255, 255, 0.7)',

  // Decorative
  timelineLine: 'rgba(0, 0, 0, 0.1)',
} as const;

// Card dimensions (landscape)
export const CARD_DIMENSIONS = {
  SINGLE: {width: 400, height: 530},
  DUAL: {width: 360, height: 470},
  MANY: {width: 260, height: 347},
} as const;

// Spacing constants
export const SPACING = {
  slidePadding: 80,
  narrativePadding: 120,
  quotePaddingH: 160,
  quotePaddingV: 120,
  cardGap: 24,
  textGap: 40,
} as const;
