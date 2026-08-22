import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { ThemeColors } from "../types";
import type { sharedTokens, SpacingScale } from "../typography";
import { textMetrics } from "../typography";
import { useColors } from "./theme";
import {
  useRadius,
  useShadow,
  useSpacing,
  useTypography,
  useZIndex,
} from "./tokens";

type Tokens = {
  colors: ThemeColors;
  spacing: SpacingScale;
  radius: typeof sharedTokens.radius;
  typography: typeof sharedTokens.typography;
  shadow: typeof sharedTokens.shadow;
  zIndex: typeof sharedTokens.zIndex;
  textMetrics: typeof textMetrics;
};

type SheetStyle<T> = StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>;

type StyleFn<T extends SheetStyle<T>> = (tokens: Tokens) => T;

function useStyles<T extends SheetStyle<T>>(fn: StyleFn<T>): T {
  const colors = useColors();
  const spacing = useSpacing();
  const radius = useRadius();
  const typography = useTypography();
  const shadow = useShadow();
  const zIndex = useZIndex();
  return useMemo(
    () =>
      StyleSheet.create(
        fn({
          colors,
          spacing,
          radius,
          typography,
          shadow,
          zIndex,
          textMetrics,
        }),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [colors],
  );
}

export function makeStyles<T extends SheetStyle<T>>(fn: StyleFn<T>): () => T {
  return function useCreatedStyles() {
    return useStyles(fn);
  };
}
