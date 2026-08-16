import { images } from "@/constants";
import { makeStyles, useTheme } from "@/theme";
import React from "react";
import { Image, View } from "react-native";

const Logo = () => {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <View style={styles.headerContainer}>
      <View />
      <View style={styles.header}>
        <Image source={images.logo} style={styles.headerIconImage} />
        {/* <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
          Ini
        </Text> */}
      </View>
    </View>
  );
};

export default Logo;

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────

const useStyles = makeStyles(({ colors, spacing, typography }) => ({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing[4],
    paddingTop: spacing[7.5],
    paddingBottom: spacing[6],
    gap: spacing[1.25],
  },
  headerIconImage: {
    width: 30,
    height: 30,
  },
  headerTitle: {
    fontSize: typography.fontSize["2xl"],
    fontFamily: typography.fontFamily.Manrope.Bold,
  },
}));
