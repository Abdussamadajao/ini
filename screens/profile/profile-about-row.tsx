import { makeStyles, useTheme, textMetrics } from "@/theme";
import React from "react";
import { Text, View } from "react-native";

export function ProfileAboutRow({
  appName,
  version,
}: {
  appName: string;
  version: string;
}) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <View style={styles.row}>
      <View
        style={[styles.logo, { backgroundColor: `${colors.primary.main}35` }]}
      >
        <Text style={[styles.logoLetter, { color: colors.primary.main }]}>
          K
        </Text>
      </View>
      <Text style={[styles.name, { color: colors.text.primary }]}>
        {appName}
      </Text>
      <Text style={[styles.version, { color: colors.text.secondary }]}>
        {version}
      </Text>
    </View>
  );
}

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
    row: {
      alignItems: "center",
      flexDirection: "row",
      gap: spacing[3],
      minHeight: 56,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    logo: {
      alignItems: "center",
      borderRadius: radius.full,
      height: 40,
      justifyContent: "center",
      width: 40,
    },
    logoLetter: {
      ...textMetrics("lg", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
    },
    name: {
      ...textMetrics("md", "snug"),
      flex: 1,
      fontFamily: typography.fontFamily.Inter.SemiBold,
    },
    version: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Inter.Regular,
    },
  }),
);
