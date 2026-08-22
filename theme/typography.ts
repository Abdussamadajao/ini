import { Platform } from "react-native";

const spacingKeys = Array.from({ length: 233 }, (_, i) => i * 0.5);

// Spacing scale: keys are multiples of 0.5, from 0 to 116, mapped to px (key * 4)
export type SpacingScale = Record<number, number>;

const spacing: SpacingScale = Object.fromEntries(
  spacingKeys.map((k) => [k, k * 4]),
);

// --- Font families ---
export const fontFamily = {
  Manrope: {
    ExtraLight: "Manrope-ExtraLight",
    Light: "Manrope-Light",
    Regular: "Manrope-Regular",
    Medium: "Manrope-Medium",
    SemiBold: "Manrope-SemiBold",
    Bold: "Manrope-Bold",
    ExtraBold: "Manrope-ExtraBold",
  },
  Inter: {
    Light: "Inter-Light",
    Regular: "Inter-Regular",
    Medium: "Inter-Medium",
    SemiBold: "Inter-SemiBold",
    Bold: "Inter-Bold",
  },
} as const;

// --- Typography scale ---
export const typography = {
  fontFamily,
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 28,
    "4xl": 32,
    "5xl": 36,
    "6xl": 40,
    "7xl": 44,
    "8xl": 48,
    "9xl": 52,
    "10xl": 56,
  },
  fontWeight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeight: {
    tight: 1.25,
    snug: 1.4,
    normal: 1.6,
    relaxed: 1.75,
  },
} as const;

// Compatibility export matching the supplied theme code.
export const fontSize = typography.fontSize;

// --- Text metrics helper ---
// RN doesn't derive lineHeight from fontSize automatically, and Manrope's
// internal ascent/descent metrics run tighter than its glyphs need at these
// sizes — any Text style that sets only fontSize (no lineHeight) risks
// clipping ascenders/descenders, especially on Android and in release/preview
// builds. Use this anywhere a style sets fontSize from the typography scale,
// instead of setting fontSize alone.
//
// Usage:
//   notificationTitle: {
//     ...textMetrics("md", "snug"),
//     fontFamily: typography.fontFamily.Manrope.Medium,
//   },
type FontSizeKey = keyof typeof typography.fontSize;
type LineHeightKey = keyof typeof typography.lineHeight;

export function textMetrics(
  size: FontSizeKey,
  leading: LineHeightKey = "snug",
): { fontSize: number; lineHeight: number } {
  const fontSizeValue = typography.fontSize[size];
  const ratio = typography.lineHeight[leading];
  return {
    fontSize: fontSizeValue,
    lineHeight: Math.round(fontSizeValue * ratio),
  };
}

// Shared KeyboardAvoidingView defaults.
export const keyboardAvoiding = {
  behavior: Platform.select<"padding" | "height" | undefined>({
    ios: "padding",
    default: undefined,
  }),
  defaultVerticalOffset: 0,
} as const;

// --- Shared design tokens ---
export const sharedTokens = {
  spacing,
  radius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999,
  },
  typography,
  shadow: {
    none: {
      shadowColor: "transparent",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    // The Emerald Vault ambient glow.
    glow: {
      color: "rgba(16, 185, 129, 0.08)",
      blurMin: 40,
      blurMax: 60,
      spread: -5,
    },
  },
  zIndex: {
    base: 0,
    raised: 1,
    dropdown: 100,
    modal: 200,
    toast: 300,
  },
} as const;

// Compatibility export matching the supplied theme code.
export const border = {
  borderRadius: {
    DEFAULT: 8,
    lg: 16,
    xl: 24,
    full: 999,
  },
} as const;

// Compatibility export matching the supplied theme code.
export const spacingTokens = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
  40: 160,
  48: 192,
  56: 224,
  64: 256,
  72: 288,
  80: 320,
  88: 352,
  96: 384,
  104: 416,
} as const;

export const elevation = sharedTokens.shadow;
