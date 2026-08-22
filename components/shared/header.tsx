import { authClient } from "@/lib/auth-client";
import {
  makeStyles,
  useColors,
  useRadius,
  useTheme,
  useTypography,
} from "@/theme";
import { User } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View, ViewStyle } from "react-native";
import { Avatar } from "./avatar";
import { Skeleton } from "./skeleton";

type HeaderTitleSize = "small" | "medium" | "large";

type HeaderProp = {
  title: string;
  desc?: string;
  avatar?: boolean;
  titleSize?: HeaderTitleSize;
  rightContent?: React.ReactNode;
  rightContainerStyle?: ViewStyle;
  showAddButton?: boolean;
  onAddPress?: () => void;
};

const TITLE_SIZE_MAP: Record<HeaderTitleSize, "lg" | "2xl" | "3xl"> = {
  small: "lg",
  medium: "2xl",
  large: "3xl",
};

const Header = ({
  title,
  desc,
  avatar,
  rightContent,
  rightContainerStyle,
  showAddButton = true,
  onAddPress,
  titleSize = "medium",
}: HeaderProp) => {
  const colors = useColors();
  const typography = useTypography();
  const styles = useStyles();
  const radius = useRadius();
  const { data, isPending } = authClient.useSession();
  const user = data?.user as unknown as User;
  const userName = user?.name ?? "";
  const avatarUrl = user?.avatarUrl ?? user?.image ?? "";

  const titleSizeKey = TITLE_SIZE_MAP[titleSize];

  return (
    <View style={styles.mobileHeader}>
      <View style={styles.headerRight}>
        {avatar && (
          <>
            {isPending ? (
              <Skeleton width={46} height={46} borderRadius={radius.full} />
            ) : (
              <Avatar
                name={userName}
                size="sm"
                variant="circle"
                uri={avatarUrl}
              />
            )}
          </>
        )}
        <View>
          <Text
            style={[
              titleSizeKey === "lg"
                ? styles.headerTitleLg
                : titleSizeKey === "2xl"
                  ? styles.headerTitle2xl
                  : styles.headerTitle3xl,
              { color: colors.text.primary },
            ]}
          >
            {title}
          </Text>
          {desc && <Text style={styles.headerSubtitle}>{desc}</Text>}
        </View>
      </View>

      {/* Right Container - Full container on the right */}
      <View style={[styles.rightContainer, rightContainerStyle]}>
        {rightContent}
      </View>
    </View>
  );
};

export const FormHeader = ({
  title,
  rightContent,
  rightContainerStyle,
}: {
  title: string;
  rightContent?: React.ReactNode;
  rightContainerStyle?: ViewStyle;
}) => {
  const styles = useStyles();
  const colors = useColors();
  return (
    <View style={styles.header}>
      <Pressable
        onPress={() => router.back()}
        style={styles.headerBtn}
        hitSlop={8}
      >
        <MaterialIcons
          name="arrow-back"
          size={24}
          color={colors.text.secondary}
        />
      </Pressable>
      <Text style={styles.headerFormTitle}>{title}</Text>

      {rightContent ? (
        <View style={[styles.rightContainer, rightContainerStyle]}>
          {rightContent}
        </View>
      ) : (
        <View style={{ width: 50 }} />
      )}
    </View>
  );
};
export { Header };

// ─── Theme‑aware styles ────────────────────────────

const useStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[3],
      flex: 1,
    },
    iconBtn: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background.surfaceAlt,
    },

    mobileHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
      paddingBottom: spacing[3],
      backgroundColor: colors.background.screen,
      borderBottomColor: colors.border.default,
      borderBottomWidth: 1,
    },
    headerTitleLg: {
      ...textMetrics("lg", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
    },
    headerTitle2xl: {
      ...textMetrics("2xl", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
    },
    headerTitle3xl: {
      ...textMetrics("3xl", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
    },
    headerSubtitle: {
      ...textMetrics("md", "snug"),
      color: colors.text.secondary,
      fontFamily: typography.fontFamily.Manrope.Regular,
    },
    rightContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[2],
    },
    addButton: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      backgroundColor: colors.primary.main,
      justifyContent: "center",
      alignItems: "center",
    },

    // ── Header ───────────────────────────────────────────────────────────
    headerBtn: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[3],
      minHeight: 48,
      backgroundColor: colors.background.screen,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.default,
    },
    backBtn: {
      padding: spacing[2],
    },
    headerFormTitle: {
      ...textMetrics("lg", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.text.primary,
    },
  }),
);
