import { createContext, useContext } from "react";
import type { Theme } from "./types";
import { defaultTheme } from "./registry";

const ThemeContext = createContext<Theme>(defaultTheme);

export const ThemeProvider = ThemeContext.Provider;

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
