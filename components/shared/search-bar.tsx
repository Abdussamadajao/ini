import { makeStyles, useTheme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { TextInput, View } from "react-native";

export type SearchBarProps = {
  search: string;
  setSearch: (search: string) => void;
};

export default function SearchBar({ search, setSearch }: SearchBarProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <View style={styles.searchWrap}>
      <MaterialIcons name="search" size={22} color={colors.text.secondary} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search transactions"
        placeholderTextColor={colors.text.secondary}
        value={search}
        onChangeText={setSearch}
        returnKeyType="search"
      />
    </View>
  );
}

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────

const useStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
    searchWrap: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[2.5],
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[3],
      borderRadius: radius.lg,
      borderWidth: 1,
      backgroundColor: colors.background.surface,
      borderColor: colors.border.default,
    },
    searchInput: {
      flex: 1,
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.Medium,
      paddingVertical: 0,
      color: colors.text.primary,
    },
  }),
);
