import { darkTheme, lightTheme } from "./colors";

export type ColorScale<T extends Scale> = T;

export type Scale = {
  [key: number]: string;
};

export type Theme = typeof lightTheme | typeof darkTheme;
export type ThemeColors = Theme["colors"];
