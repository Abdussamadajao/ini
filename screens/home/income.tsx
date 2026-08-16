import { useIncomeTransactions } from "@/actions";
import { InlineError } from "@/components/shared/error";
import Skeleton from "@/components/shared/skeleton";
import { formatPrice } from "@/lib/custom";
import { makeStyles, useTheme } from "@/theme";
import type { IncomeTransaction } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";

const Income = ({
  label = "Income Streams",
  isLabel = true,
}: {
  label?: string;
  isLabel?: boolean;
}) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const {
    data: incomeTransactions,
    isPending,
    error,
    refetch,
  } = useIncomeTransactions();

  const incomeOnlyTransactions: IncomeTransaction[] = (
    incomeTransactions?.data ?? []
  ).filter((tx): tx is IncomeTransaction => tx.type === "INCOME");

  const isEmpty = !isPending && incomeOnlyTransactions.length === 0;

  if (error) {
    return (
      <View style={styles.sectionWrapper}>
        {isLabel ? (
          <Text
            style={[styles.incomeStreamsTitle, { color: colors.text.primary }]}
          >
            {label}
          </Text>
        ) : null}
        <InlineError error={error} onRetry={refetch} />
      </View>
    );
  }

  return (
    <View style={styles.sectionWrapper}>
      {isLabel ? (
        <Text
          style={[styles.incomeStreamsTitle, { color: colors.text.primary }]}
        >
          {label}
        </Text>
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.incomeStreamsScrollContent}
        style={styles.incomeStreamsScroll}
      >
        {isPending
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={`income-skeleton-${i}`} width={220} height={130} />
            ))
          : isEmpty
            ? null
            : incomeOnlyTransactions.map((incomeTransaction) => {
                const barTint =
                  incomeTransaction.type === "INCOME"
                    ? colors.status.success.main
                    : colors.status.error.main;
                return (
                  <Card
                    key={incomeTransaction.id}
                    incomeTransaction={incomeTransaction}
                    barTint={barTint}
                  />
                );
              })}
      </ScrollView>

      {isEmpty ? (
        <View style={styles.emptyWrap}>
          <View
            style={[
              styles.emptyIconWrap,
              { backgroundColor: `${colors.primary.main}15` },
            ]}
          >
            <MaterialIcons
              name="payments"
              size={28}
              color={colors.primary.main}
            />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
            No income streams yet
          </Text>
          <Text
            style={[styles.emptySubtitle, { color: colors.text.secondary }]}
          >
            Add your first income source to track it here.
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default Income;

const Card = ({
  incomeTransaction,
  barTint,
}: {
  incomeTransaction: IncomeTransaction;
  barTint: string;
}) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const { width: screenW } = Dimensions.get("window");
  const incomeCardW = Math.min(268, Math.round(screenW * 0.72));
  return (
    <View
      key={incomeTransaction.id}
      style={[
        styles.incomeStreamCard,
        {
          width: incomeCardW,
          backgroundColor: colors.background.surfaceAlt,
        },
      ]}
    >
      <View style={styles.incomeStreamTop}>
        <Text
          style={[styles.incomeStreamLabel, { color: colors.text.secondary }]}
        >
          {incomeTransaction.source_name}
        </Text>
        <Text style={[styles.incomeStreamTag, { color: colors.text.muted }]}>
          {incomeTransaction.tag}
        </Text>
      </View>
      <Text style={[styles.incomeStreamAmount, { color: colors.text.primary }]}>
        {formatPrice(Number(incomeTransaction.amount))}
      </Text>
      <View style={styles.incomeStreamMeta}>
        <Text
          style={[styles.incomeStreamMetaText, { color: colors.text.muted }]}
        >
          {formatPrice(incomeTransaction.summary.remaining)} remaining
        </Text>
        <Text
          style={[styles.incomeStreamMetaText, { color: colors.text.muted }]}
        >
          {incomeTransaction.summary.percentage}%
        </Text>
      </View>
      <View
        style={[
          styles.incomeStreamTrack,
          { backgroundColor: `${colors.border.default}44` },
        ]}
      >
        <View
          style={[
            styles.incomeStreamFill,
            {
              width: `${incomeTransaction.summary.percentage}%`,
              backgroundColor: barTint,
            },
          ]}
        />
      </View>
    </View>
  );
};

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(({ colors, spacing, radius, typography }) => ({
  sectionWrapper: {
    gap: spacing[1],
  },
  incomeStreamsTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.Manrope.Bold,
    marginBottom: spacing[3],
  },
  incomeStreamsScroll: {
    marginHorizontal: -16,
  },
  incomeStreamsScrollContent: {
    paddingHorizontal: spacing[4],
    gap: spacing[3],
    paddingBottom: spacing[1],
  },
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing[8],
    gap: spacing[1],
  },
  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing[2],
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
  incomeStreamCard: {
    borderRadius: radius.xl,
    padding: spacing[4],
    gap: spacing[2],
  },
  incomeStreamTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  incomeStreamIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  incomeStreamTag: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.Manrope.SemiBold,
  },
  incomeStreamLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.Manrope.Medium,
  },
  incomeStreamAmount: {
    fontSize: typography.fontSize["2xl"],
    fontFamily: typography.fontFamily.Manrope.ExtraBold,
    letterSpacing: -0.3,
    marginTop: spacing[0.5],
  },
  incomeStreamMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing[2],
  },
  incomeStreamMetaText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.Manrope.Medium,
  },
  incomeStreamTrack: {
    height: 4,
    borderRadius: radius.sm,
    overflow: "hidden",
    marginTop: spacing[3],
  },
  incomeStreamFill: {
    height: "100%",
    borderRadius: radius.sm,
  },
}));
