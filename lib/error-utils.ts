import { ErrorVariant, VariantMeta } from "@/types";

export const VARIANT_META: Record<ErrorVariant, VariantMeta> = {
  generic: {
    emoji: "⚠️",
    title: "Something went wrong",
    message: "An unexpected error occurred. Please try again.",
    bg: "#FEE2E2",
  },
  network: {
    emoji: "📡",
    title: "No connection",
    message: "Check your internet connection and try again.",
    bg: "#FEF3C7",
  },
  unauthorized: {
    emoji: "🔒",
    title: "Session expired",
    message: "Please sign in again to continue.",
    bg: "#EEF2FF",
  },
  forbidden: {
    emoji: "🚫",
    title: "Access denied",
    message: "You don't have permission to view this content.",
    bg: "#FEE2E2",
  },
  "not-found": {
    emoji: "🔍",
    title: "Not found",
    message: "The resource you requested doesn't exist or has been removed.",
    bg: "#F1F5F9",
  },
  server: {
    emoji: "🛠️",
    title: "Server error",
    message: "Our servers are having trouble. We're working on it.",
    bg: "#FEE2E2",
  },
};

// ─── Variant resolver ─────────────────────────────────────────────────────────

export function variantFromError(error: unknown): ErrorVariant {
  if (!error) return "generic";

  if (typeof error === "object" && error !== null && "response" in error) {
    const status = (error as any).response?.status;
    if (!status) return "network";
    if (status === 401) return "unauthorized";
    if (status === 403) return "forbidden";
    if (status === 404) return "not-found";
    if (status >= 500) return "server";
  }

  if (
    error instanceof TypeError &&
    error.message === "Network request failed"
  ) {
    return "network";
  }

  return "generic";
}
