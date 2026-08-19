import { authClient } from "@/lib/auth-client";
import { makeStyles, useColors, useRadius, useTheme } from "@/theme";
import { User } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Avatar } from "./avatar";
import Skeleton from "./skeleton";

type HeaderProp = {
  title: string;
  desc?: string;
  avatar?: boolean;
  rightContent?: React.ReactNode;
  rightContainerStyle?: ViewStyle;
  showAddButton?: boolean;
  onAddPress?: () => void;
};

const Header = ({
  title,
  desc,
  avatar,
  rightContent,
  rightContainerStyle,
  showAddButton = true,
  onAddPress,
}: HeaderProp) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const radius = useRadius();
  const { data, isPending } = authClient.useSession();
  const user = data?.user as unknown as User;
  const userName = user?.name ?? "";
  const avatarUrl = user?.avatarUrl ?? user?.image ?? "";

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
          <Text style={styles.headerTitle}>{title}</Text>
          {desc && <Text style={styles.headerSubtitle}>{desc}</Text>}
        </View>
      </View>

      {/* Right Container - Full container on the right */}
      <View style={[styles.rightContainer, rightContainerStyle]}>
        {rightContent ? (
          rightContent
        ) : (
          <>
            {showAddButton && (
              <TouchableOpacity
                style={styles.addButton}
                activeOpacity={0.8}
                onPress={onAddPress}
              >
                <MaterialIcons
                  name="add"
                  size={24}
                  color={colors.primary.contrastText}
                />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export const FormHeader = ({ title }: { title: string }) => {
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
      <View style={styles.headerBtn} />
    </View>
  );
};
export { Header };

// ─── Theme‑aware styles ────────────────────────────

const useStyles = makeStyles(({ colors, spacing, radius, typography }) => ({
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
    paddingTop: spacing[4],
    paddingBottom: spacing[3],
    backgroundColor: colors.background.screen,
    borderBottomColor: colors.border.default,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    fontFamily: typography.fontFamily.Manrope.Bold,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.md,
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
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.Manrope.Bold,
    color: colors.text.primary,
  },
  // headerFormRight: {
  //   width: 40,
  // },
}));
