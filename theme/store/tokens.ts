import { create } from "zustand";
import { sharedTokens } from "../typography";

type Spacing = typeof sharedTokens.spacing;
type Radius = typeof sharedTokens.radius;
type Typography = typeof sharedTokens.typography;
type Shadow = typeof sharedTokens.shadow;
type ZIndex = typeof sharedTokens.zIndex;

interface TokenState {
  spacing: Spacing;
  radius: Radius;
  typography: Typography;
  shadow: Shadow;
  zIndex: ZIndex;
}

export const useTokenStore = create<TokenState>(() => ({
  spacing: sharedTokens.spacing,
  radius: sharedTokens.radius,
  typography: sharedTokens.typography,
  shadow: sharedTokens.shadow,
  zIndex: sharedTokens.zIndex,
}));

export const useSpacing = () => useTokenStore((s) => s.spacing);
export const useRadius = () => useTokenStore((s) => s.radius);
export const useTypography = () => useTokenStore((s) => s.typography);
export const useShadow = () => useTokenStore((s) => s.shadow);
export const useZIndex = () => useTokenStore((s) => s.zIndex);
