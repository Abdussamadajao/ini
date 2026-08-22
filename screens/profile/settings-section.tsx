import { makeStyles, textMetrics } from "@/theme";
import React from "react";
import { Text, View } from "react-native";

export function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const styles = useStyles();

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
    wrap: {
      marginBottom: spacing[6],
    },
    title: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Inter.SemiBold,
      letterSpacing: 1.2,
      marginBottom: spacing[2.5],
      marginLeft: spacing[1],
      textTransform: "capitalize",
      color: colors.text.secondary,
    },
    card: {
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: `${colors.border.default}66`,
      overflow: "hidden",
      backgroundColor: colors.background.surfaceAlt,
    },
  }),
);
