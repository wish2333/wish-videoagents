export interface LyricWord {
  text: string;
  start: number;
  end: number;
}

export interface LyricLine {
  text: string;
  start: number;
  end: number;
  words?: LyricWord[];
}

export interface PlayerThemeColors {
  accent: string;
  bg1: string;
  bg2: string;
}

export interface PlayerStyleData {
  title: string;
  artist: string;
  audioSrc: string;
  coverSrc: string;
  lyrics: LyricLine[];
  duration: number;
  theme: PlayerThemeColors;
}

export interface PlayerStyleProps {
  data: PlayerStyleData;
  themeName?: string;
}
