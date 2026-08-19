import { images } from "@/constants";
import { makeStyles } from "@/theme";
import React from "react";
import { Image, View } from "react-native";

const Logo = () => {
  const styles = useStyles();

  return (
    <View style={styles.headerContainer}>
      <Image source={images.logo} style={styles.headerIconImage} />
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
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: typography.fontSize["2xl"],
    fontFamily: typography.fontFamily.Manrope.Bold,
  },
}));
