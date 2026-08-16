import { makeStyles, useTheme } from "@/theme";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from "react-native";

interface ButtonProps extends PressableProps {
  variant?: "primary" | "secondary" | "tertiary" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Button = ({
  variant = "primary",
  loading = false,
  disabled = false,
  children,
  style,
  ...props
}: ButtonProps) => {
  const { colors } = useTheme();
  const styles = useStyles();

  const backgroundColor =
    variant === "primary"
      ? colors.primary.main
      : variant === "secondary"
        ? colors.secondary.main
        : variant === "tertiary"
          ? colors.background.surfaceAlt
          : "transparent";

  const borderColor =
    variant === "ghost"
      ? colors.border.default
      : variant === "secondary"
        ? colors.border.default
        : "transparent";

  const indicatorColor =
    variant === "primary" ? colors.primary.contrastText : colors.primary.main;

  return (
    <Pressable
      style={[
        styles.base,
        {
          backgroundColor,
          borderColor,
          borderWidth: borderColor === "transparent" ? 0 : 1,
        },
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={indicatorColor} />
      ) : (
        children
      )}
    </Pressable>
  );
};

export default Button;

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────

const useStyles = makeStyles(({ colors, spacing, radius }) => ({
  base: {
    padding: spacing[3],
    height: 48,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  disabled: {
    opacity: 0.5,
  },
}));
