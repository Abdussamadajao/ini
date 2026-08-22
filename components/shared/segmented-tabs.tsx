import { makeStyles } from "@/theme";
import React from "react";
import { Pressable, Text, View, ViewStyle } from "react-native";

type SegmentedTabsProps<T extends string> = {
  tabs: readonly T[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  style?: ViewStyle;
};

export function SegmentedTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  style,
}: SegmentedTabsProps<T>) {
  const styles = useStyles();

  return (
    <View style={[styles.tabsWrapper, style]}>
      <View style={styles.tabsRow}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Pressable
              key={tab}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => onTabChange(tab)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default SegmentedTabs;

const useStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
    tabsWrapper: {
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[4],
      width: "100%",
    },
    tabsRow: {
      flexDirection: "row",
      backgroundColor: colors.background.surfaceAlt,
      borderRadius: radius.sm,
      padding: spacing[2],
      borderWidth: 1,
      borderColor: `${colors.border.default}33`,
    },
    tab: {
      flex: 1,
      paddingVertical: spacing[3],
      alignItems: "center",
      justifyContent: "center",
      borderRadius: radius.sm,
      backgroundColor: "transparent",
    },
    tabActive: {
      backgroundColor: colors.primary.main,
      shadowColor: colors.palette.black,
      shadowOpacity: 0.05,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
      borderWidth: 1,
      borderColor: `${colors.border.default}33`,
    },
    tabText: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      letterSpacing: 0.5,
      textTransform: "capitalize",
      color: colors.text.secondary,
      fontWeight: "bold",
    },
    tabTextActive: {
      color: colors.text.inverse,
    },
  }),
);
