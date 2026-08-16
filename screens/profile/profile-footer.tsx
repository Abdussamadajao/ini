import { makeStyles, useTheme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

export function ProfileFooter({ onLogout }: { onLogout?: () => void }) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onLogout}
        style={({ pressed }) => [
          styles.logout,
          {
            backgroundColor: `${colors.status.error.main}12`,
            borderColor: `${colors.status.error.main}33`,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Log out"
      >
        <MaterialIcons name="logout" size={18} color={colors.status.error.main} />
        <Text style={[styles.logoutText, { color: colors.status.error.main }]}>
          Log Out
        </Text>
      </Pressable>
    </View>
  );
}

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(({ colors, spacing, radius, typography }) => ({
  wrap: {
    marginTop: spacing[2],
    paddingBottom: spacing[8],
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[2],
    borderRadius: radius.full,
    borderWidth: 1.5,
    paddingVertical: spacing[4],
  },
  logoutText: {
    fontFamily: typography.fontFamily.Inter.SemiBold,
    fontSize: typography.fontSize.md,
  },
}));
