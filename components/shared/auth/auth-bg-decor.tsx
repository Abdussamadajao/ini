import { makeStyles } from "@/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

export function AuthBgDecor() {
  const styles = useStyles();
  return (
    <View style={styles.bgDecor}>
      <View style={[styles.bgBlur, styles.bgBlur1]} />
      <View style={[styles.bgBlur, styles.bgBlur2]} />
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  bgDecor: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    pointerEvents: "none",
  },
  bgBlur: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.5,
  },
  bgBlur1: {
    top: "-10%",
    left: "-10%",
    width: "40%",
    height: "40%",
    backgroundColor: colors.primary.main,
  },
  bgBlur2: {
    top: "20%",
    right: "-10%",
    width: "30%",
    height: "30%",
    backgroundColor: colors.palette.slate[200],
  },
}));
