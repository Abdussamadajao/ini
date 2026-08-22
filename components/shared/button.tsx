import { makeStyles, useTheme } from "@/theme";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface ButtonProps extends PressableProps {
  title: string;
  variant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "danger"
    | "warning"
    | "ghost";
  appearance?: "solid" | "outline";
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  width?: "small" | "medium" | "large";
  flex?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = ({
  title,
  variant = "primary",
  appearance = "solid",
  loading = false,
  disabled = false,
  style,
  textStyle,
  width,
  flex,
  leftIcon,
  rightIcon,
  ...props
}: ButtonProps) => {
  const { colors } = useTheme();
  const styles = useStyles();

  const isGhost = variant === "ghost";
  const isOutline = appearance === "outline" && !isGhost;
  const isSolid = appearance === "solid" && !isGhost;

  const variantColor =
    variant === "primary"
      ? colors.primary.main
      : variant === "secondary"
        ? colors.secondary.main
        : variant === "danger"
          ? colors.status.error.main
          : variant === "warning"
            ? colors.status.warning.main
            : variant === "tertiary"
              ? colors.text.primary
              : colors.text.secondary;

  const backgroundColor = isSolid
    ? variant === "tertiary"
      ? colors.background.surfaceAlt
      : variantColor
    : "transparent";

  const borderColor = isGhost ? "" : isOutline ? variantColor : "transparent";

  const contentColor = isSolid
    ? variant === "primary"
      ? colors.primary.contrastText
      : variant === "secondary"
        ? colors.secondary.contrastText
        : variant === "danger"
          ? colors.status.error.contrastText
          : variant === "warning"
            ? colors.status.warning.contrastText
            : colors.text.primary
    : variantColor;

  const buttonWidth =
    width === "small"
      ? 120
      : width === "medium"
        ? 160
        : flex
          ? undefined
          : "100%";

  return (
    <Pressable
      style={[
        styles.base,
        {
          width: buttonWidth,
          backgroundColor,
          borderColor,
          borderWidth: borderColor === "transparent" ? 0 : 1,
        },
        flex && styles.flex,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={contentColor} />
      ) : (
        <>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text
            style={[styles.text, { color: contentColor }, textStyle]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </>
      )}
    </Pressable>
  );
};

export default Button;

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────
const useStyles = makeStyles(
  ({ spacing, radius, typography, textMetrics }) => ({
    base: {
      padding: spacing[3],
      height: 48,
      borderRadius: radius.md,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      flexShrink: 1,
      minWidth: 0,
    },
    flex: {
      flex: 1,
      width: undefined,
    },
    text: {
      ...textMetrics("lg", "snug"),
      fontFamily: typography.fontFamily.Manrope.Medium,
      letterSpacing: 0.5,
    },
    iconLeft: {
      marginRight: spacing[2],
    },
    iconRight: {
      marginLeft: spacing[2],
    },
    disabled: {
      opacity: 0.5,
    },
  }),
);
