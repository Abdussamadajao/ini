import { makeStyles, useTheme, textMetrics } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

export type ThemeMode = "light" | "dark" | "system";

const MODES: {
  mode: ThemeMode;
  label: string;
  icon: "dark-mode" | "light-mode";
}[] = [
  { mode: "dark", label: "Dark", icon: "dark-mode" },
  { mode: "light", label: "Light", icon: "light-mode" },
];

export function ThemeSegmentControl({
  mode,
  onSelect,
}: {
  mode: ThemeMode;
  onSelect: (next: ThemeMode) => void;
}) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <View style={[styles.track, { backgroundColor: colors.background.screen }]}>
      {MODES.map(({ mode: m, label, icon }) => {
        const selected = mode === m;
        return (
          <Pressable
            key={m}
            onPress={() => onSelect(m)}
            style={[
              styles.pill,
              selected && {
                backgroundColor: colors.background.surfaceAlt,
                shadowColor: colors.palette.black,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 3,
                elevation: 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            <MaterialIcons
              name={icon}
              size={14}
              color={selected ? colors.primary.main : colors.text.muted}
            />
            <Text
              style={[
                styles.pillText,
                {
                  color: selected ? colors.primary.main : colors.text.secondary,
                },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
    track: {
      borderRadius: radius.full,
      flexDirection: "row",
      gap: spacing[1],
      padding: spacing[1],
    },
    pill: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[1.5],
      borderRadius: radius.full,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1.5],
    },
    pillText: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Inter.SemiBold,
    },
  }),
);
