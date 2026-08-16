import { makeStyles } from "@/theme";
import React from "react";
import { View } from "react-native";
import { ToastContainer } from "./container";
import { useToast, useToastStore } from "./store";

// ─── Root Renderer ────────────────────────────────────────────────────────────
// Drop this once inside your root layout, above nothing (it renders absolutely).
// No provider needed — store is global.
//
// <Stack ... />
// <ToastRoot />   ← just add this

export function ToastRoot() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  const s = useToastStyles();

  if (!toasts.length) return null;

  return (
    <View pointerEvents="box-none" style={s.stack}>
      {toasts.map(
        ({
          id,
          message,
          type,
          actionText,
          duration,
          position,
          onActionPress,
        }) => (
          <ToastContainer
            key={id}
            type={type}
            message={message}
            duration={duration}
            actionText={actionText}
            position={position}
            onActionPress={() => {
              onActionPress?.();
              dismiss(id);
            }}
          />
        ),
      )}
    </View>
  );
}
export { useToast };
// ─── Styles ───────────────────────────────────────────────────────────────────

const useToastStyles = makeStyles(({ zIndex, spacing }) => ({
  stack: {
    position: "absolute",
    top: spacing[10], // 40
    left: spacing[4], // 16
    right: spacing[4], // 16
    gap: spacing[3], // 12
    zIndex: zIndex.toast, // 300
  },
}));
