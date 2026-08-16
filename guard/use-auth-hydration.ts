import { useAuthStore } from "@/stores";
import { useEffect, useRef } from "react";

export function useAuthHydration() {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const hydrate = useAuthStore((s) => s.hydrate);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    void hydrate();
  }, [hydrate]);

  return { isHydrated };
}
