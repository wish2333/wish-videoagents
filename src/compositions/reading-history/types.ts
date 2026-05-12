export type WorkMediaType = "manga" | "anime" | "novel" | "audio-drama";

export type SlideType =
  | "title"
  | "timeline-marker"
  | "narrative"
  | "quote"
  | "works-grid"
  | "closing"
  | "outro";

export interface ReferencedWork {
  title: string;
  author?: string;
  mediaType: WorkMediaType;
  year?: string;
  imageSrc: string;
}

export interface BaseSlide {
  id: string;
  type: SlideType;
  sectionIndex: number;
  sectionTitle: string;
  durationInFrames: number;
}

export interface TitleSlide extends BaseSlide {
  type: "title";
  title: string;
  subtitle?: string;
}

export interface TimelineMarkerSlide extends BaseSlide {
  type: "timeline-marker";
  year: string;
  eraLabel?: string;
}

export interface NarrativeSlide extends BaseSlide {
  type: "narrative" | "closing";
  text: string;
  year?: string;
  works?: ReferencedWork[];
  cardSize?: [number, number];
}

export interface QuoteSlide extends BaseSlide {
  type: "quote";
  text: string;
  attribution?: string;
}

export interface WorksGridSlide extends BaseSlide {
  type: "works-grid";
  title?: string;
  works: ReferencedWork[];
}

export interface OutroSlide extends BaseSlide {
  type: "outro";
  channelName?: string;
  message?: string;
}

export type Slide =
  | TitleSlide
  | TimelineMarkerSlide
  | NarrativeSlide
  | QuoteSlide
  | WorksGridSlide
  | OutroSlide;

export interface ReadingHistoryData {
  title: string;
  subtitle?: string;
  channelName: string;
  audioSrc: string;
  slides: Slide[];
  totalDurationFrames: number;
}
