import { useTransactions } from "@/actions";
import { InlineError } from "@/components/shared/error";
import Skeleton from "@/components/shared/skeleton";
import { formatAmount, isValidMaterialIcon } from "@/lib";
import { makeStyles, useTheme } from "@/theme";
import type { DashboardTransaction } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

export type RecentTransactionRow = {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBg: string;
  isIncome: boolean;
};

type RecentTransactionsProps = {
  transactions?: DashboardTransaction[];
  isPending?: boolean;
};

export function RecentTransactions({
  transactions: dashboardTransactions,
  isPending: isDashboardPending,
}: RecentTransactionsProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const styles = useStyles();

  const hasDashboardData = dashboardTransactions !== undefined;

  // Only hit the network when the caller hasn't already supplied dashboard data.
  const { data: transactions, isPending, error, refetch } = useTransactions();

  const isPendingState = hasDashboardData ? isDashboardPending : isPending;

  const recentTransactions: RecentTransactionRow[] = (
    hasDashboardData ? dashboardTransactions : (transactions?.data ?? [])
  )
    .slice()
    .sort(
      (a, b) =>
        new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime(),
    )
    .slice(0, 3)
    .map((tx) => ({
      id: tx.id,
      title: tx.source_name?.trim() || tx.category.name,
      subtitle: tx.category.name,
      amount: Number(tx.amount) || 0,
      icon: isValidMaterialIcon(tx.category.icon)
        ? tx.category.icon
        : "receipt-long",
      iconBg: tx.category.color,
      isIncome: tx.type === "INCOME",
    }));

  const isEmpty = !isPendingState && recentTransactions.length === 0;

  if (error) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Recent Activity
          </Text>
        </View>
        <InlineError error={error} onRetry={refetch} />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Recent Activity
        </Text>
        {!isEmpty && (
          <Pressable
            onPress={() => router.push("/transactions")}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="View all transactions"
            style={({ pressed }) => pressed && styles.viewAllPressed}
          >
            <View style={styles.viewAllRow}>
              <Text style={[styles.viewAll, { color: colors.primary.main }]}>
                View All
              </Text>
              <MaterialIcons
                name="chevron-right"
                size={16}
                color={colors.primary.main}
              />
            </View>
          </Pressable>
        )}
      </View>

      {isEmpty ? (
        <View
          style={[
            styles.emptyWrap,
            { borderColor: `${colors.border.default}55` },
          ]}
        >
          <View
            style={[
              styles.emptyIconWrap,
              { backgroundColor: `${colors.primary.main}14` },
            ]}
          >
            <MaterialIcons
              name="receipt-long"
              size={26}
              color={colors.primary.main}
            />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
            No transactions yet
          </Text>
          <Text
            style={[styles.emptySubtitle, { color: colors.text.secondary }]}
          >
            Your income and expenses will show up here once you add one.
          </Text>
        </View>
      ) : (
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.background.surfaceAlt,
              borderColor: `${colors.border.default}55`,
            },
          ]}
        >
          {isPendingState
            ? Array.from({ length: 3 }).map((_, i) => (
                <View key={`recent-skeleton-${i}`}>
                  <View style={styles.row}>
                    <Skeleton width={44} height={44} borderRadius={22} />
                    <View style={styles.middle}>
                      <Skeleton width="60%" height={14} />
                      <Skeleton
                        width="40%"
                        height={11}
                        style={{ marginTop: 8 }}
                      />
                    </View>
                    <View style={styles.right}>
                      <Skeleton width={70} height={14} />
                      <Skeleton
                        width={40}
                        height={10}
                        style={{ marginTop: 8 }}
                      />
                    </View>
                  </View>
                  {i < 2 ? (
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: `${colors.border.default}40` },
                      ]}
                    />
                  ) : null}
                </View>
              ))
            : recentTransactions.map((tx, index) => (
                <View key={tx.id}>
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: "/transactions/[id]",
                        params: { id: tx.id },
                      })
                    }
                    style={({ pressed }) => [
                      styles.row,
                      pressed && {
                        backgroundColor: colors.background.screen,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.txIconWrap,
                        { backgroundColor: `${tx.iconBg}18` },
                      ]}
                    >
                      <MaterialIcons
                        name={tx.icon}
                        size={19}
                        color={tx.iconBg}
                      />
                    </View>

                    <View style={styles.middle}>
                      <Text
                        style={[
                          styles.rowTitle,
                          { color: colors.text.primary },
                        ]}
                        numberOfLines={1}
                      >
                        {tx.title}
                      </Text>
                      <Text
                        style={[
                          styles.rowMeta,
                          { color: colors.text.secondary },
                        ]}
                        numberOfLines={1}
                      >
                        {tx.subtitle}
                      </Text>
                    </View>

                    <View style={styles.right}>
                      <Text
                        style={[
                          styles.amount,
                          {
                            color: tx.isIncome
                              ? colors.status.success.main
                              : colors.status.error.main,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {formatAmount(tx.amount, tx.isIncome)}
                      </Text>
                      <View
                        style={[
                          styles.typeChip,
                          {
                            backgroundColor: tx.isIncome
                              ? `${colors.status.success.main}14`
                              : `${colors.status.error.main}14`,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.typeLabel,
                            {
                              color: tx.isIncome
                                ? colors.status.success.main
                                : colors.status.error.main,
                            },
                          ]}
                        >
                          {tx.isIncome ? "Income" : "Expense"}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                  {index < recentTransactions.length - 1 ? (
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: `${colors.border.default}40` },
                      ]}
                    />
                  ) : null}
                </View>
              ))}
        </View>
      )}
    </View>
  );
}

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(({ colors, spacing, radius, typography }) => ({
  wrapper: {
    gap: spacing[3.5],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.Manrope.Bold,
  },
  viewAllRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  viewAllPressed: {
    opacity: 0.7,
  },
  viewAll: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.Manrope.SemiBold,
  },
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing[3.5],
    paddingVertical: spacing[3.5],
  },
  divider: {
    height: 1,
    marginLeft: spacing[3.5] + 40 + spacing[3],
  },
  txIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing[3],
  },
  middle: {
    flex: 1,
    minWidth: 0,
  },
  rowTitle: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.Manrope.SemiBold,
  },
  rowMeta: {
    marginTop: spacing[0.5],
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.Inter.Regular,
  },
  right: {
    alignItems: "flex-end",
    marginLeft: spacing[2],
    gap: spacing[1],
  },
  amount: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.Manrope.Bold,
  },
  typeChip: {
    borderRadius: radius.full,
    paddingHorizontal: spacing[1.5],
    paddingVertical: 2,
  },
  typeLabel: {
    fontSize: 9,
    fontFamily: typography.fontFamily.Inter.SemiBold,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing[10],
    paddingHorizontal: spacing[4],
    gap: spacing[1],
    borderRadius: radius.xl,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  emptyIconWrap: {
    width: 60,
    height: 60,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing[3],
  },
  emptyTitle: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.Manrope.SemiBold,
  },
  emptySubtitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.Inter.Regular,
    textAlign: "center",
    maxWidth: 240,
  },
}));
