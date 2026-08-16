import { ToastRoot } from "@/components/toasts";
import { useAuthGuard } from "@/guard/use-auth";
import { useAuthHydration } from "@/guard/use-auth-hydration";
import { queryClient } from "@/lib/query-client";
import { ThemeProvider, useColors, useIsDark } from "@/theme";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
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

// export const unstable_settings = {
//   anchor: "(tabs)",
// };

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
  const isReady = fontsLoaded && isHydrated;

  useEffect(() => {
    if (isReady) SplashScreen.hideAsync();
  }, [isReady]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BottomSheetModalProvider>
            <RootNavigator />
            <ToastRoot />
            <ThemedStatusBar />
          </BottomSheetModalProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  useAuthGuard();
  const colors = useColors();
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
