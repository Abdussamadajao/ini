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
  variant?: "primary" | "secondary" | "tertiary" | "danger" | "ghost";
  appearance?: "solid" | "outline";
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  flex?: boolean;
  width?: "small" | "medium" | "large";
}

const Button = ({
  variant = "primary",
  appearance = "solid",
  loading = false,
  disabled = false,
  children,
  style,
  flex,
  width,
  ...props
}: ButtonProps) => {
  const { colors } = useTheme();
  const styles = useStyles();

  const isGhost = variant === "ghost";
  const isOutline = appearance === "outline" && !isGhost;
  const isSolid = appearance === "solid" && !isGhost;

  // Base color per variant (used for solid bg, outline border/text, and the spinner)
  const variantColor =
    variant === "primary"
      ? colors.primary.main
      : variant === "secondary"
        ? colors.secondary.main
        : variant === "danger"
          ? colors.status.error.main
          : variant === "tertiary"
            ? colors.text.primary
            : colors.text.secondary; // ghost

  const backgroundColor = isSolid
    ? variant === "tertiary"
      ? colors.background.surfaceAlt
      : variantColor
    : "transparent";

  const borderColor = isGhost
    ? colors.border.default
    : isOutline
      ? variantColor
      : "transparent";

  const indicatorColor = isSolid
    ? variant === "primary"
      ? colors.primary.contrastText
      : variant === "secondary"
        ? colors.secondary.contrastText
        : variant === "danger"
          ? colors.status.error.contrastText
          : colors.text.primary // tertiary
    : variantColor; // outline & ghost

  const buttonWidth =
    width === "small" ? 120 : width === "medium" ? 160 : "100%";
  return (
    <Pressable
      style={[
        styles.base,
        {
          width: buttonWidth,
          flex: flex ? 1 : undefined,
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
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  disabled: {
    opacity: 0.5,
  },
}));
