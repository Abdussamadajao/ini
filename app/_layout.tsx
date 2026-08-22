import { ToastRoot } from "@/components/toasts";
import { useAuthGuard } from "@/guard/use-auth";
import { useAuthHydration } from "@/guard/use-auth-hydration";
import { queryClient } from "@/lib/query-client";
import { useAuthStore } from "@/stores";
import { ThemeProvider, useColors, useIsDark } from "@/theme";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Manrope-Regular": require("@/assets/fonts/Manrope-Regular.ttf"),
    "Manrope-Medium": require("@/assets/fonts/Manrope-Medium.ttf"),
    "Manrope-SemiBold": require("@/assets/fonts/Manrope-SemiBold.ttf"),
    "Manrope-Bold": require("@/assets/fonts/Manrope-Bold.ttf"),
    "Manrope-ExtraBold": require("@/assets/fonts/Manrope-ExtraBold.ttf"),
    "Manrope-Light": require("@/assets/fonts/Manrope-Light.ttf"),
    "Manrope-ExtraLight": require("@/assets/fonts/Manrope-ExtraLight.ttf"),
  });
  const { isHydrated } = useAuthHydration();
  const appReady = fontsLoaded && isHydrated;

  useEffect(() => {
    useAuthStore.getState().hydrate();
  }, []);

  // No more `if (!isReady) return null` — always mount the navigator
  // so useRootNavigationState() can become available. The splash
  // screen stays up (native, not JS) until we explicitly hide it.
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BottomSheetModalProvider>
            <RootNavigator appReady={appReady} />
            <ToastRoot />
            <ThemedStatusBar />
          </BottomSheetModalProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator({ appReady }: { appReady: boolean }) {
  const colors = useColors();
  const navReady = useAuthGuard({ appReady });

  useEffect(() => {
    if (navReady) SplashScreen.hideAsync();
  }, [navReady]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.screen },
        animationTypeForReplace: "push",
        animation: "default",
      }}
    />
  );
}

function ThemedStatusBar() {
  const isDark = useIsDark();
  return <StatusBar style={isDark ? "light" : "dark"} />;
}
