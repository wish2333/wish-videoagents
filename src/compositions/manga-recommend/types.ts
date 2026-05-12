export interface MangaRecommendData {
  title: string;
  workTitle: string;
  workAuthor: string;
  workGenre: string[];
  hookText: string;
  highlights: {
    title: string;
    description: string;
    imageSrc: string;
  }[];
  targetAudience: string[];
  rating: number;
  outroMessage: string;
  channelName: string;
  audioSrc: string;
  totalDurationFrames: number;
}
