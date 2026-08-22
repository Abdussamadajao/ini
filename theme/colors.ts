import { Scale } from "./types";

export const palette = {
  blue: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    400: "#60A5FA",
    500: "#3B82F6",
    600: "#2563EB",
    700: "#1D4ED8",
    800: "#1E40AF",
    900: "#1E3A8A",
    950: "#172554",
  } satisfies Scale,

  indigo: {
    50: "#EEF2FF",
    100: "#E0E7FF",
    200: "#C7D2FE",
    300: "#A5B4FC",
    400: "#818CF8",
    500: "#6366F1",
    600: "#4F46E5",
    700: "#4338CA",
    800: "#3730A3",
    900: "#312E81",
    950: "#1E1B4B",
  } satisfies Scale,

  sky: {
    50: "#F0F9FF",
    100: "#E0F2FE",
    200: "#BAE6FD",
    300: "#7DD3FC",
    400: "#38BDF8",
    500: "#0EA5E9",
    600: "#0284C7",
    700: "#0369A1",
    800: "#075985",
    900: "#0C4A6E",
    950: "#082F49",
  } satisfies Scale,

  green: {
    50: "#F0FDF4",
    100: "#DCFCE7",
    200: "#BBF7D0",
    300: "#86EFAC",
    400: "#4ADE80",
    500: "#22C55E",
    600: "#16A34A",
    700: "#15803D",
    800: "#166534",
    900: "#14532D",
    950: "#052E16",
  } satisfies Scale,

  red: {
    50: "#FEF2F2",
    100: "#FEE2E2",
    200: "#FECACA",
    300: "#FCA5A5",
    400: "#F87171",
    500: "#EF4444",
    600: "#DC2626",
    700: "#B91C1C",
    800: "#991B1B",
    900: "#7F1D1D",
    950: "#450A0A",
  } satisfies Scale,

  amber: {
    50: "#FFFBEB",
    100: "#FEF3C7",
    200: "#FDE68A",
    300: "#FCD34D",
    400: "#FBBF24",
    500: "#F59E0B",
    600: "#D97706",
    700: "#B45309",
    800: "#92400E",
    900: "#78350F",
    950: "#451A03",
  } satisfies Scale,

  slate: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
    950: "#020617",
  } satisfies Scale,

  dark: {
    50: "#E6EAF2",
    100: "#A0A8B8",
    200: "#6B7280",
    300: "#2A3142",
    400: "#1F2533",
    500: "#242B3A",
    600: "#1D2330",
    700: "#161A22",
    800: "#12151C",
    900: "#0F1115",
  } satisfies Scale,

  emerald: {
    50: "#ECFDF5",
    100: "#D1FAE5",
    200: "#A7F3D0",
    300: "#6EE7B7",
    400: "#34D399",
    500: "#10B981",
    600: "#059669",
    700: "#047857",
    800: "#065F46",
    900: "#064E3B",
    950: "#022C22",
  } satisfies Scale,

  white: "#FFFFFF",
  black: "#000000",

  alpha: {
    emeraldSoft: "rgba(52,  211, 153, 0.15)",
    skySoftDark: "rgba(56,  189, 248, 0.15)",
    skyLight: "rgba(14,  165, 233, 0.12)",
    emeraldLight: "rgba(16,  185, 129, 0.12)",
    emeraldDark: "rgba(16,  185, 129, 0.15)",
    redLight: "rgba(239,  68,  68, 0.12)",
    redDark: "rgba(239,  68,  68, 0.15)",
    amberLight: "rgba(245, 158,  11, 0.12)",
    amberDark: "rgba(245, 158,  11, 0.15)",
  },
} as const;

export const colorTokens = {
  light: {
    palette,
    primary: {
      main: palette.emerald[600],
      hover: palette.emerald[700],
      soft: palette.emerald[100],
      contrastText: palette.white,
    },
    secondary: {
      main: palette.indigo[500],
      contrastText: palette.white,
      soft: palette.indigo[100],
    },
    escrow: {
      main: palette.sky[500],
      surface: palette.alpha.skyLight,
      contrastText: palette.white,
    },
    background: {
      screen: palette.slate[50],
      surface: palette.white,
      surfaceAlt: palette.slate[100],
      elevated: palette.slate[200],
    },
    text: {
      primary: palette.slate[900],
      secondary: palette.slate[600],
      muted: palette.slate[400],
      disabled: palette.slate[400],
      inverse: palette.white,
    },
    border: {
      default: palette.slate[200],
      subtle: palette.slate[300],
    },
    status: {
      success: {
        main: palette.emerald[500],
        surface: palette.alpha.emeraldLight,
        contrastText: palette.white,
      },
      error: {
        main: palette.red[500],
        surface: palette.alpha.redLight,
        contrastText: palette.white,
      },
      warning: {
        main: palette.amber[500],
        surface: palette.alpha.amberLight,
        contrastText: palette.white,
      },
    },
  },

  dark: {
    palette,
    primary: {
      main: palette.emerald[400],
      hover: palette.emerald[500],
      soft: palette.alpha.emeraldSoft,
      contrastText: palette.dark[900],
    },
    secondary: {
      main: palette.indigo[400],
      contrastText: palette.dark[900],
      soft: "rgba(129, 140, 248, 0.15)",
    },
    escrow: {
      main: palette.sky[400],
      surface: palette.alpha.skySoftDark,
      contrastText: palette.dark[900],
    },
    background: {
      screen: palette.dark[900],
      surface: palette.dark[700],
      surfaceAlt: palette.dark[600],
      elevated: palette.dark[500],
    },
    text: {
      primary: palette.dark[50],
      secondary: palette.dark[100],
      muted: palette.dark[200],
      disabled: palette.dark[200],
      inverse: palette.dark[900],
    },
    border: {
      default: palette.dark[300],
      subtle: palette.dark[400],
    },
    status: {
      success: {
        main: palette.emerald[500],
        surface: palette.alpha.emeraldDark,
        contrastText: palette.dark[900],
      },
      error: {
        main: palette.red[500],
        surface: palette.alpha.redDark,
        contrastText: palette.dark[900],
      },
      warning: {
        main: palette.amber[500],
        surface: palette.alpha.amberDark,
        contrastText: palette.dark[900],
      },
    },
  },
} as const;

export const lightTheme = { colors: colorTokens.light, isDark: false } as const;
export const darkTheme = { colors: colorTokens.dark, isDark: true } as const;
