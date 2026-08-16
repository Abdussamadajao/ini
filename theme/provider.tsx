import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import { useThemeStore } from "./store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const systemIsDark = systemScheme === "dark";
  const _syncSystem = useThemeStore((s) => s._syncSystem);

  useEffect(() => {
    _syncSystem(systemIsDark);
  }, [systemIsDark, _syncSystem]);

  return <>{children}</>;
}
