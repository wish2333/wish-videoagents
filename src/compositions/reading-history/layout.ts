import { useVideoConfig } from "remotion";

export function useIsPortrait(): boolean {
  const { width, height } = useVideoConfig();
  return height > width;
}
