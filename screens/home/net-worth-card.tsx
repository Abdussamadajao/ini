import { formatPrice } from "@/lib/custom";
import { makeStyles, useTheme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type NetWorthCardProps = {
  amount?: number;
  totalIncome?: number;
  totalExpenses?: number;
  trendLabel?: string;
};

export function NetWorthCard({
  amount,
  totalIncome,
  totalExpenses,
  trendLabel,
}: NetWorthCardProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  const displayAmount = amount ?? 0;
  const displayTrend = trendLabel ?? "No data yet";
  const hasBreakdown = totalIncome !== undefined || totalExpenses !== undefined;
  const isPositiveTrend = !trendLabel || !/-|down/i.test(trendLabel);

  return (
    <View style={[styles.card, { shadowColor: colors.primary.main }]}>
      <View style={styles.glow} />
      <View style={styles.glowSecondary} />

      <View style={styles.inner}>
        <View style={styles.topRow}>
          <View style={styles.labelWrap}>
            <View style={styles.labelIconBadge}>
              <MaterialIcons
                name="account-balance-wallet"
                size={13}
                color={colors.primary.main}
              />
            </View>
            <Text style={styles.label}>Total Net Worth</Text>
          </View>

          <View
            style={[
              styles.trendChip,
              {
                backgroundColor: isPositiveTrend
                  ? `${colors.status.success.main}18`
                  : `${colors.status.error.main}18`,
              },
            ]}
          >
            <MaterialIcons
              name={isPositiveTrend ? "trending-up" : "trending-down"}
              size={13}
              color={
                isPositiveTrend
                  ? colors.status.success.main
                  : colors.status.error.main
              }
            />
            <Text
              style={[
                styles.trendChipText,
                {
                  color: isPositiveTrend
                    ? colors.status.success.main
                    : colors.status.error.main,
                },
              ]}
              numberOfLines={1}
            >
              {displayTrend}
            </Text>
          </View>
        </View>

        <Text
          style={styles.amount}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.5}
        >
          {formatPrice(displayAmount)}
        </Text>

        {hasBreakdown ? (
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <View
                style={[
                  styles.statDot,
                  { backgroundColor: colors.status.success.main },
                ]}
              />
              <Text style={styles.statLabel}>Income</Text>
              <Text style={styles.statValue} numberOfLines={1}>
                {formatPrice(totalIncome ?? 0)}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statChip}>
              <View
                style={[
                  styles.statDot,
                  { backgroundColor: colors.status.error.main },
                ]}
              />
              <Text style={styles.statLabel}>Expenses</Text>
              <Text style={styles.statValue} numberOfLines={1}>
                {formatPrice(totalExpenses ?? 0)}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(({ colors, spacing, radius, typography }) => ({
  card: {
    borderRadius: radius.xl,
    padding: spacing[5],
    overflow: "hidden",
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    backgroundColor: colors.background.surfaceAlt,
    borderWidth: 1,
    borderColor: `${colors.border.default}55`,
  },
  glow: {
    position: "absolute",
    top: -90,
    right: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: `${colors.primary.main}1A`,
  },
  glowSecondary: {
    position: "absolute",
    bottom: -80,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: `${colors.primary.main}0D`,
  },
  inner: {
    position: "relative",
    zIndex: 1,
    gap: spacing[3],
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  labelWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  labelIconBadge: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary.main + "16",
  },
  label: {
    fontSize: 11,
    fontFamily: typography.fontFamily.Manrope.Bold,
    textTransform: "uppercase",
    letterSpacing: 1.4,
    color: colors.text.secondary,
  },
  trendChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[1],
    borderRadius: radius.full,
    paddingHorizontal: spacing[2.5],
    paddingVertical: spacing[1],
    maxWidth: "45%",
  },
  trendChipText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.Manrope.Bold,
    flexShrink: 1,
  },
  amount: {
    fontSize: typography.fontSize["7xl"],
    fontFamily: typography.fontFamily.Manrope.ExtraBold,
    letterSpacing: -1,
    color: colors.text.primary,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.lg,
    backgroundColor: colors.background.surface,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3.5],
    marginTop: spacing[1],
  },
  statChip: {
    flex: 1,
    gap: spacing[0.5],
  },
  statDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: spacing[1],
  },
  statLabel: {
    fontSize: 10,
    fontFamily: typography.fontFamily.Manrope.SemiBold,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: colors.text.secondary,
  },
  statValue: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.Manrope.Bold,
    color: colors.text.primary,
  },
  statDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: `${colors.border.default}55`,
    marginHorizontal: spacing[3],
  },
}));
