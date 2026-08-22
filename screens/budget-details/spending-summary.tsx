import { useColors } from "@/theme";
import { formatPrice } from "@/lib";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { FlatList, Text, View } from "react-native";
import { useBudgetTrendChartStyles } from "./styles";

export type SpendingSummaryTransaction = {
  amount: number;
  recorded_at: string;
};

type SpendingSummaryProps = {
  transactions: SpendingSummaryTransaction[];
};

type StatCard = {
  key: string;
  label: string;
  render: () => React.ReactNode;
};

const NUM_COLUMNS = 2;

export function SpendingSummary({ transactions }: SpendingSummaryProps) {
  const colors = useColors();
  const styles = useBudgetTrendChartStyles();

  const stats = useMemo(() => {
    if (transactions.length === 0) {
      return {
        total: 0,
        average: 0,
        highest: 0,
        count: 0,
        trendUp: null as boolean | null,
      };
    }

    const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const average = total / transactions.length;
    const highest = Math.max(...transactions.map((tx) => tx.amount));
    const count = transactions.length;

    // Compare first half vs second half (chronological) to infer direction
    const sorted = [...transactions].sort(
      (a, b) =>
        new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime(),
    );
    let trendUp: boolean | null = null;
    if (sorted.length >= 2) {
      const mid = Math.floor(sorted.length / 2);
      const firstHalfAvg =
        sorted.slice(0, mid).reduce((s, tx) => s + tx.amount, 0) /
        Math.max(mid, 1);
      const secondHalfAvg =
        sorted.slice(mid).reduce((s, tx) => s + tx.amount, 0) /
        Math.max(sorted.length - mid, 1);
      trendUp = secondHalfAvg > firstHalfAvg;
    }

    return { total, average, highest, count, trendUp };
  }, [transactions]);

  const statCards: StatCard[] = useMemo(
    () => [
      {
        key: "total",
        label: "TOTAL SPENT",
        render: () => (
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: colors.text.primary,
              marginTop: 4,
            }}
          >
            {formatPrice(stats.total)}
          </Text>
        ),
      },
      {
        key: "average",
        label: "AVG PER TRANSACTION",
        render: () => (
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: colors.text.primary,
              marginTop: 4,
            }}
          >
            {formatPrice(stats.average)}
          </Text>
        ),
      },
      {
        key: "highest",
        label: "HIGHEST",
        render: () => (
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: colors.text.primary,
              marginTop: 4,
            }}
          >
            {formatPrice(stats.highest)}
          </Text>
        ),
      },
      {
        key: "trend",
        label: "TREND",
        render: () => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              marginTop: 4,
            }}
          >
            {stats.trendUp === null ? (
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: colors.text.secondary,
                }}
              >
                —
              </Text>
            ) : (
              <>
                <MaterialIcons
                  name={stats.trendUp ? "trending-up" : "trending-down"}
                  size={18}
                  color={
                    stats.trendUp
                      ? colors.status.error.main
                      : colors.status.success.main
                  }
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: stats.trendUp
                      ? colors.status.error.main
                      : colors.status.success.main,
                  }}
                >
                  {stats.trendUp ? "Rising" : "Falling"}
                </Text>
              </>
            )}
          </View>
        ),
      },
    ],
    [stats, colors],
  );

  const renderStatCard = ({ item }: { item: StatCard }) => (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background.surfaceAlt,
        borderRadius: 12,
        padding: 12,
      }}
    >
      <Text style={{ fontSize: 11, color: colors.text.secondary }}>
        {item.label}
      </Text>
      {item.render()}
    </View>
  );

  return (
    <View style={styles.trendSection}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionAccent} />
        <Text style={styles.sectionTitle}>SPENDING SUMMARY</Text>
      </View>

      <FlatList
        data={statCards}
        keyExtractor={(item) => item.key}
        renderItem={renderStatCard}
        numColumns={NUM_COLUMNS}
        scrollEnabled={false}
        columnWrapperStyle={{ gap: 12, marginBottom: 12 }}
        contentContainerStyle={{ marginTop: 4 }}
      />
    </View>
  );
}
