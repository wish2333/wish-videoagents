import { darkTheme } from "./themes/dark";
import { warmTheme } from "./themes/warm";
import { tokyoNightTheme } from "./themes/tokyo-night";
import { cyberpunkNeonTheme } from "./themes/cyberpunk-neon";
import { nordTheme } from "./themes/nord";
import { draculaTheme } from "./themes/dracula";
import { auroraTheme } from "./themes/aurora";
import { vaporwaveTheme } from "./themes/vaporwave";
import { neoBrutalismTheme } from "./themes/neo-brutalism";
import { sunsetWarmTheme } from "./themes/sunset-warm";
import { minimalWhiteTheme } from "./themes/minimal-white";
import { gruvboxDarkTheme } from "./themes/gruvbox-dark";
import { rosePineTheme } from "./themes/rose-pine";
import { glassmorphismTheme } from "./themes/glassmorphism";
import type { Theme } from "./types";

const themes: Record<string, Theme> = {
  dark: darkTheme,
  warm: warmTheme,
  "tokyo-night": tokyoNightTheme,
  "cyberpunk-neon": cyberpunkNeonTheme,
  nord: nordTheme,
  dracula: draculaTheme,
  aurora: auroraTheme,
  vaporwave: vaporwaveTheme,
  "neo-brutalism": neoBrutalismTheme,
  "sunset-warm": sunsetWarmTheme,
  "minimal-white": minimalWhiteTheme,
  "gruvbox-dark": gruvboxDarkTheme,
  "rose-pine": rosePineTheme,
  glassmorphism: glassmorphismTheme,
};

export function getTheme(name: string): Theme {
  return themes[name] ?? darkTheme;
}

export function registerTheme(name: string, theme: Theme): void {
  themes[name] = theme;
}

export const defaultTheme = darkTheme;
