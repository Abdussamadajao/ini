import { Avatar } from "@/components/shared/avatar";
import { Skeleton } from "@/components/shared/skeleton";
import { makeStyles, useTheme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export function ProfileUserCard({
  name,
  email,
  memberSinceLabel,
  imageUri,
  isPending = false,
}: {
  name: string;
  email: string;
  memberSinceLabel: string;
  imageUri: string;
  isPending?: boolean;
}) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.background.surfaceAlt,
          borderColor: `${colors.border.default}66`,
        },
      ]}
    >
      <View
        style={[styles.avatarRing, { borderColor: `${colors.primary.main}33` }]}
      >
        {isPending ? (
          <Skeleton width={92} height={92} borderRadius={46} />
        ) : (
          <Avatar name={name} size={92} variant="circle" uri={imageUri} />
        )}
      </View>

      {isPending ? (
        <Skeleton
          width={180}
          height={22}
          borderRadius={styles.skeletonLg.borderRadius}
          style={{ marginTop: 16 }}
        />
      ) : (
        <Text style={[styles.name, { color: colors.text.primary }]}>
          {name}
        </Text>
      )}

      {isPending ? (
        <Skeleton
          width={200}
          height={26}
          borderRadius={radiusFull}
          style={{ marginTop: 10 }}
        />
      ) : (
        <View
          style={[
            styles.emailPill,
            { backgroundColor: `${colors.primary.main}12` },
          ]}
        >
          <MaterialIcons
            name="mail-outline"
            size={12}
            color={colors.primary.main}
          />
          <Text
            style={[styles.email, { color: colors.primary.main }]}
            numberOfLines={1}
          >
            {email}
          </Text>
        </View>
      )}

      <View style={styles.divider} />

      {isPending ? (
        <Skeleton width={132} height={11} borderRadius={radiusFull} />
      ) : (
        <View style={styles.badgeRow}>
          <MaterialIcons
            name="verified"
            size={13}
            color={colors.text.secondary}
          />
          <Text style={[styles.badgeText, { color: colors.text.secondary }]}>
            {memberSinceLabel}
          </Text>
        </View>
      )}
    </View>
  );
}

const radiusFull = 999;

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
    card: {
      alignItems: "center",
      borderRadius: radius.xl,
      borderWidth: 1,
      marginBottom: spacing[6],
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[7],
    },
    avatarRing: {
      borderRadius: radius.full,
      borderWidth: 2,
      padding: 4,
    },
    name: {
      ...textMetrics("xl", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      marginTop: spacing[4],
    },
    emailPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[1.5],
      borderRadius: radius.full,
      marginTop: spacing[2],
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1.5],
      maxWidth: "100%",
    },
    email: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Inter.SemiBold,
      flexShrink: 1,
    },
    divider: {
      alignSelf: "stretch",
      height: 1,
      marginTop: spacing[5],
      marginBottom: spacing[4],
      backgroundColor: `${colors.border.default}40`,
    },
    badgeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[1.5],
    },
    badgeText: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Inter.SemiBold,
      letterSpacing: 0.8,
      textTransform: "capitalize",
    },
    skeletonLg: {
      borderRadius: radius.lg,
    },
  }),
);
