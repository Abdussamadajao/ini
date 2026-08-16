import { Avatar } from "@/components/shared/avatar";
import Skeleton from "@/components/shared/skeleton";
import { getGreeting } from "@/constants/greetings";
import { authClient } from "@/lib/auth-client";
import { makeStyles, useTheme } from "@/theme";
import type { User } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

export function HomeHeader() {
  const { colors } = useTheme();
  const styles = useStyles();
  const { data, isPending } = authClient.useSession();

  const user = data?.user as unknown as User;
  const userName = user?.name ?? "";
  const { message } = getGreeting({ name: userName });
  const avatarUrl = user?.avatarUrl ?? user?.image ?? "";

  return (
    <View style={styles.headerOuter}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {isPending ? (
            <Skeleton
              width={46}
              height={46}
              borderRadius={styles.skeletonRadius.borderRadius}
            />
          ) : (
            <Avatar
              name={userName}
              size="md"
              variant="circle"
              uri={avatarUrl}
            />
          )}
          <View style={styles.headerLeftText}>
            <Text style={[styles.greeting, { color: colors.text.secondary }]}>
              Welcome back,
            </Text>
            <Text style={[styles.name, { color: colors.text.primary }]}>
              {isPending ? <Skeleton width={200} height={20} /> : message}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Pressable
            style={[
              styles.notifBtn,
              { backgroundColor: `${colors.primary.main}20` },
            ]}
            accessibilityRole="button"
          >
            <MaterialIcons
              name="notifications"
              size={28}
              color={colors.primary.main}
            />
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: colors.status.error.main,
                  borderColor: colors.background.screen,
                },
              ]}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(({ colors, spacing, radius, typography }) => ({
  headerOuter: {
    backgroundColor: colors.background.screen,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing[4],
    paddingBottom: spacing[2.5],
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[1.25],
  },
  headerLeftText: {
    gap: 2,
  },
  greeting: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.Manrope.Medium,
  },
  name: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.Manrope.Bold,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3.5],
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
  skeletonRadius: {
    borderRadius: radius.full,
  },
}));
