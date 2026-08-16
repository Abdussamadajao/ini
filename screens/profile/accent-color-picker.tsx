import { makeStyles, useTheme } from "@/theme";
import React from "react";
import { Pressable, View } from "react-native";

export type AccentId = "teal" | "blue" | "purple";

const ACCENTS: { id: AccentId; hex: string }[] = [
  { id: "teal", hex: "#4ADE80" },
  { id: "blue", hex: "#3B82F6" },
  { id: "purple", hex: "#A78BFA" },
];

export function AccentColorPicker({
  selected,
  onSelect,
}: {
  selected: AccentId;
  onSelect: (id: AccentId) => void;
}) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <>
      {ACCENTS.map(({ id, hex }) => {
        const active = selected === id;
        return (
          <Pressable
            key={id}
            onPress={() => onSelect(id)}
            style={[
              styles.outer,
              {
                borderColor: active ? colors.primary.main : "transparent",
                borderWidth: active ? 2 : 0,
              },
            ]}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
          >
            <View style={[styles.inner, { backgroundColor: hex }]} />
          </Pressable>
        );
      })}
    </>
  );
}

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(({ colors, spacing, radius }) => ({
  outer: {
    alignItems: "center",
    borderRadius: radius.full,
    height: 32,
    justifyContent: "center",
    padding: spacing[0.5],
    width: 32,
  },
  inner: {
    borderRadius: radius.full,
    height: 22,
    width: 22,
  },
}));
