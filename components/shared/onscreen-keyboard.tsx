import { useTheme, makeStyles } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";

type KeypadProps = {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
};

const KEYPAD_DATA = [
  { key: "1" },
  { key: "2" },
  { key: "3" },
  { key: "4" },
  { key: "5" },
  { key: "6" },
  { key: "7" },
  { key: "8" },
  { key: "9" },
  { key: "" },
  { key: "0" },
  { key: "del" },
];

const NUM_COLUMNS = 3;

export function OnscreenKeypad({ onKeyPress, onBackspace }: KeypadProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  const renderItem = ({ item }: { item: { key: string } }) => {
    if (item.key === "") {
      return <View style={styles.keypadCell} />;
    }

    if (item.key === "del") {
      return (
        <Pressable
          style={({ pressed }) => [
            styles.keypadKey,
            pressed && styles.keypadKeyPressed,
          ]}
          onPress={onBackspace}
        >
          <MaterialIcons
            name="backspace"
            size={24}
            color={colors.text.secondary}
          />
        </Pressable>
      );
    }

    return (
      <Pressable
        style={({ pressed }) => [
          styles.keypadKey,
          pressed && styles.keypadKeyPressed,
        ]}
        onPress={() => onKeyPress(item.key)}
      >
        <Text style={[styles.keypadKeyText, { color: colors.text.primary }]}>
          {item.key}
        </Text>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={KEYPAD_DATA}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.key}-${index}`}
      numColumns={NUM_COLUMNS}
      contentContainerStyle={styles.keypadContent}
      columnWrapperStyle={styles.keypadRow}
      scrollEnabled={false}
    />
  );
}

const useStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
    keypadContent: {
      paddingHorizontal: spacing[2],
    },
    keypadRow: {
      justifyContent: "space-between",
      marginBottom: spacing[4],
      gap: spacing[4],
    },
    keypadCell: {
      flex: 1,
      minHeight: 56,
    },
    keypadKey: {
      flex: 1,
      minHeight: 56,
      borderRadius: radius.md,
      alignItems: "center",
      justifyContent: "center",
    },
    keypadKeyPressed: {
      backgroundColor: colors.background.surfaceAlt,
    },
    keypadKeyText: {
      ...textMetrics("2xl", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },
  }),
);
