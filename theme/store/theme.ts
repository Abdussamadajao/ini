import { zustandStorage } from "@/lib/store-manager";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { darkTheme, lightTheme } from "../colors";
import { Theme, ThemeColors } from "../types";

export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "app-theme-mode";

function resolve(mode: ThemeMode, systemIsDark: boolean): Theme {
  if (mode === "light") return lightTheme;
  if (mode === "dark") return darkTheme;
  return systemIsDark ? darkTheme : lightTheme;
}

interface ThemeState {
  mode: ThemeMode;
  systemIsDark: boolean;
  resolvedTheme: Theme;
  isLoading: boolean;

  _syncSystem: (systemIsDark: boolean) => void;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "system",
      systemIsDark: false,
      resolvedTheme: lightTheme,
      isLoading: true,

      _syncSystem: (systemIsDark) => {
        const { mode } = get();
        set({ systemIsDark, resolvedTheme: resolve(mode, systemIsDark) });
      },

      setMode: (mode) => {
        const { systemIsDark } = get();
        set({ mode, resolvedTheme: resolve(mode, systemIsDark) });
      },

      toggleTheme: () => {
        const { resolvedTheme, setMode } = get();
        setMode(resolvedTheme.isDark ? "light" : "dark");
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ mode: state.mode }),
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) {
          useThemeStore.setState({ isLoading: false });
          return;
        }

        const { systemIsDark } = useThemeStore.getState();

        useThemeStore.setState({
          resolvedTheme: resolve(state.mode, systemIsDark),
          isLoading: false,
        });
      },
    },
  ),
);

export function useTheme(): Theme {
  return useThemeStore((s) => s.resolvedTheme);
}

export function useColors(): ThemeColors {
  return useThemeStore((s) => s.resolvedTheme.colors);
}

export function useIsDark(): boolean {
  return useThemeStore((s) => s.resolvedTheme.isDark);
}

export function useThemeMode(): ThemeMode {
  return useThemeStore((s) => s.mode);
}

export function useToggleTheme(): () => void {
  return useThemeStore((s) => s.toggleTheme);
}

export function useSetThemeMode(): (mode: ThemeMode) => void {
  return useThemeStore((s) => s.setMode);
}
