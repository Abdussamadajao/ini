import { InlineError, Skeleton } from "@/components/shared";
import { formatPrice } from "@/lib/custom";
import { useColors } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { useHomeScreenStyles } from "./styles";
import { useUserStats } from "@/actions/user";
import { UserStats } from "@/types";

export function NetWorthCard() {
  const colors = useColors();
  const styles = useHomeScreenStyles();
  const { data, isPending, error, refetch } = useUserStats();

  const {
    total_income = 0,
    net_worth = 0,
    total_expenses = 0,
    trend = { direction: "flat", percentage: 0 },
  } = (data as UserStats["data"]) ?? {};
  const { direction, percentage } = trend;

  const isPositiveTrend = direction === "up";
  const isFlatTrend = direction === "flat";
  const trendColor = isFlatTrend
    ? colors.text.secondary
    : isPositiveTrend
      ? colors.status.success.main
      : colors.status.error.main;
  const trendLabel = `${isPositiveTrend ? "+" : isFlatTrend ? "" : "-"}${Math.abs(
    percentage,
  )}%`;

  if (isPending) {
    return (
      <View style={styles.netWorthSection}>
        <Text style={styles.netWorthLabel}>NET WORTH</Text>

        <View style={{ marginTop: 6, marginBottom: 8 }}>
          <Skeleton width={180} height={36} borderRadius={8} />
        </View>

        <View style={{ marginBottom: 14 }}>
          <Skeleton width={130} height={22} borderRadius={11} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Skeleton width={50} height={12} borderRadius={6} />
            <View style={{ marginTop: 6 }}>
              <Skeleton width={80} height={16} borderRadius={8} />
            </View>
          </View>

          <View style={styles.statsDivider} />

          <View style={styles.statItem}>
            <Skeleton width={60} height={12} borderRadius={6} />
            <View style={{ marginTop: 6 }}>
              <Skeleton width={80} height={16} borderRadius={8} />
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (error) {
    return <InlineError error={error} onRetry={refetch} />;
  }
  return (
    <View style={styles.netWorthSection}>
      <Text style={styles.netWorthLabel}>NET WORTH</Text>

      <Text
        style={styles.netWorthAmount}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.5}
      >
        {formatPrice(net_worth)}
      </Text>

      {!isFlatTrend && (
        <View
          style={[styles.trendChip, { backgroundColor: `${trendColor}18` }]}
        >
          <MaterialIcons
            name={isPositiveTrend ? "trending-up" : "trending-down"}
            size={14}
            color={trendColor}
          />
          <Text
            style={[styles.trendChipText, { color: trendColor }]}
            numberOfLines={1}
          >
            {trendLabel}
          </Text>
        </View>
      )}

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Income</Text>
          <Text style={styles.statValue}>{formatPrice(total_income)}</Text>
        </View>

        <View style={styles.statsDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Expenses</Text>
          <Text style={styles.statValue}>{formatPrice(total_expenses)}</Text>
        </View>
      </View>
    </View>
  );
}
