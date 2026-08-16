import { AuthBgDecor } from "@/components/shared";
import { makeStyles, useTheme } from "@/theme";
import { Stack } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function AuthLayout() {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <AuthBgDecor />
      <View
        style={[styles.decor, { backgroundColor: `${colors.primary.main}20` }]}
      />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(({ radius }) => ({
  container: { flex: 1 },
  decor: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 140,
    height: 140,
    borderRadius: radius.full,
    zIndex: 0,
    pointerEvents: "none",
  },
}));
