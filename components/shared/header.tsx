import { authClient } from "@/lib/auth-client";
import { makeStyles, useRadius, useTheme } from "@/theme";
import { User } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { Avatar } from "./avatar";
import Skeleton from "./skeleton";

const Header = ({ title }: { title: string }) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const radius = useRadius();
  const { data, isPending } = authClient.useSession();
  const user = data?.user as unknown as User;
  const userName = user?.name ?? "";
  const avatarUrl = user?.avatarUrl ?? user?.image ?? "";

  return (
    <View style={styles.header}>
      <View style={styles.headerRight}>
        {isPending ? (
          <Skeleton width={46} height={46} borderRadius={radius.full} />
        ) : (
          <Avatar name={userName} size="md" variant="circle" uri={avatarUrl} />
        )}

        <Text style={[styles.title, { color: colors.primary.main }]}>
          {title}
        </Text>
      </View>

      <Pressable style={styles.iconBtn} hitSlop={8}>
        <MaterialIcons
          name="notifications"
          size={24}
          color={colors.text.primary}
        />
      </Pressable>
    </View>
  );
};

export { Header };

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────

const useStyles = makeStyles(({ colors, spacing, radius, typography }) => ({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontFamily: typography.fontFamily.Manrope.Bold,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.surfaceAlt,
  },
}));
