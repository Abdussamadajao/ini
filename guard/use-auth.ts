import { useAuthStore } from "@/stores";
import { type Href, router, useSegments } from "expo-router";
import { useEffect } from "react";

// Adjust if your post-auth landing route is named differently
const POST_AUTH_HREF = "/(tabs)" as Href;

export function useAuthGuard() {
  const segments = useSegments();
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const user = useAuthStore((s) => s.user);
  const hasSession = useAuthStore((s) => s.hasSession);

  useEffect(() => {
    if (!isHydrated) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!hasSession) {
      if (!inAuthGroup) {
        router.replace("/(auth)/login" as Href);
      }
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

    // Authenticated and verified - don't let them sit on an auth screen
    if (inAuthGroup) {
      router.replace(POST_AUTH_HREF);
    }
  }, [isHydrated, user, hasSession, segments]);
}
