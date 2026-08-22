import { useAuthStore } from "@/stores";
import {
  type Href,
  router,
  useRootNavigationState,
  useSegments,
} from "expo-router";
import { useEffect } from "react";

const POST_AUTH_HREF = "/(tabs)" as Href;

export function useAuthGuard({ appReady }: { appReady: boolean }) {
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const user = useAuthStore((s) => s.user);
  const hasSession = useAuthStore((s) => s.hasSession);

  const navReady = appReady && !!navigationState?.key;

  useEffect(() => {
    if (!navReady) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!hasSession) {
      if (!inAuthGroup) router.replace("/(auth)/login" as Href);
      return;
    }

    if (user && !user.emailVerified) {
      const leaf = segments[segments.length - 1] ?? "";
      if (leaf !== "verify-email") {
        router.replace({
          pathname: "/(auth)/verify-email",
          params: { email: user.email },
        } as Href);
      }
      return;
    }

    if (inAuthGroup) router.replace(POST_AUTH_HREF);
  }, [navReady, user, hasSession, segments]);

  // RootLayout uses this to decide when it's safe to hide the splash
  return navReady;
}
