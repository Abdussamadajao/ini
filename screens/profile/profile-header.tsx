import { makeStyles, useTheme } from "@/theme";
import React from "react";
import { Text, View } from "react-native";

export function ProfileHeader() {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <View style={styles.row}>
      <View style={styles.titles}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
      </View>
    </View>
  );
}

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(({ colors, spacing, radius, typography }) => ({
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing[1],
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
    paddingBottom: spacing[1],
  },
  titles: {
    flex: 1,
    paddingRight: spacing[4],
  },
  title: {
    fontFamily: typography.fontFamily.Manrope.Bold,
    fontSize: typography.fontSize["3xl"],
    marginBottom: spacing[1],
    color: colors.text.primary,
  },
  subtitle: {
    fontFamily: typography.fontFamily.Inter.Regular,
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
    color: colors.text.secondary,
  },
  editBtn: {
    alignItems: "center",
    borderRadius: radius.full,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
}));
