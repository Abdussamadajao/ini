import { makeStyles, useColors } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

export type InfoBannerVariant =
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "escrow";

type InfoBannerProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
  icon?: React.ComponentProps<typeof MaterialIcons>["name"];
  variant?: InfoBannerVariant;
};

const InfoBanner = ({
  title,
  description,
  actionLabel,
  onActionPress,
  icon = "mail-outline",
  variant = "primary",
}: InfoBannerProps) => {
  const styles = useStyles();
  const colors = useColors();

  let bg = colors.primary.soft;
  let iconColor = colors.primary.main;
  let borderColor = colors.border.default;

  if (variant === "escrow") {
    bg = colors.escrow.surface;
    iconColor = colors.escrow.main;
    borderColor = colors.escrow.surface;
  } else if (variant !== "primary") {
    bg = colors.status[variant].surface;
    iconColor = colors.status[variant].main;
    borderColor = colors.status[variant].surface;
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bg, borderColor: borderColor },
      ]}
    >
      <View style={styles.iconWrap}>
        <MaterialIcons
          name={icon}
          size={18}
          style={[styles.icon, { color: iconColor }]}
        />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        {actionLabel ? (
          <Pressable onPress={onActionPress} style={styles.actionWrap}>
            <Text style={[styles.action, { color: iconColor }]}>
              {actionLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

export default InfoBanner;

const useStyles = makeStyles(
  ({ colors, radius, spacing, typography, textMetrics }) => ({
    container: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing[2],
      borderWidth: 1,
      borderRadius: radius.lg,
      padding: spacing[3],
      paddingRight: spacing[6],
    },
    infoContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[1],
    },
    iconWrap: {
      width: 30,
      height: 30,
      borderRadius: radius.full,
      backgroundColor: colors.background.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    icon: {
      // color overridden via inline style
    },
    content: {
      flex: 1,
      gap: spacing[1],
    },
    title: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      color: colors.text.primary,
    },
    description: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Regular,
      color: colors.text.secondary,
      width: "89%",
    },
    actionWrap: {
      flexShrink: 0,
    },
    action: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      textAlign: "right",
    },
  }),
);
