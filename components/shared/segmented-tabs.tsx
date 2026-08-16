import { makeStyles } from "@/theme";
import React from "react";
import { Pressable, StyleProp, Text, View, ViewStyle } from "react-native";

type SegmentedTabsProps<T extends string> = {
  tabs: readonly T[];
  activeTab: T;
  style?: StyleProp<ViewStyle>;
  onChange: (tab: T) => void;
};

export default function SegmentedTabs<T extends string>({
  tabs,
  activeTab,
  style,
  onChange,
}: SegmentedTabsProps<T>) {
  const styles = useStyles();

  return (
    <View style={[styles.row, style]}>
      {tabs.map((tab) => {
        const selected = activeTab === tab;
        return (
          <Pressable
            key={tab}
            onPress={() => onChange(tab)}
            style={[
              styles.tab,
              selected ? styles.activeTab : styles.inactiveTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                selected ? styles.activeTabText : styles.inactiveTabText,
              ]}
            >
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────

const useStyles = makeStyles(({ colors, spacing, radius, typography }) => ({
  row: {
    flexDirection: "row",
    gap: spacing[2.5],
    paddingHorizontal: spacing[6],
    marginBottom: spacing[6],
  },
  tab: {
    paddingVertical: spacing[2.5],
    paddingHorizontal: spacing[4],
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  tabText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.Manrope.SemiBold,
  },
  activeTab: {
    backgroundColor: colors.primary.main,
  },
  inactiveTab: {
    backgroundColor: colors.background.surfaceAlt,
  },
  activeTabText: {
    color: colors.primary.contrastText,
  },
  inactiveTabText: {
    color: colors.text.primary,
  },
}));
