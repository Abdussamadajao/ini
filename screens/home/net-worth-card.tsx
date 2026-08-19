import { formatPrice } from "@/lib/custom";
import { useColors } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { useHomeScreenStyles } from "./styles";

type NetWorthCardProps = {
  amount?: number;
  totalIncome?: number;
  totalExpenses?: number;
  trendLabel?: string;
};

export function NetWorthCard({
  amount = 0,
  totalIncome = 0,
  totalExpenses = 0,
  trendLabel = "No data yet",
}: NetWorthCardProps) {
  const colors = useColors();
  const styles = useHomeScreenStyles();

  const isPositiveTrend = !trendLabel || !/-|down/i.test(trendLabel);
  const trendColor = isPositiveTrend
    ? colors.status.success.main
    : colors.status.error.main;

  return (
    <View style={styles.netWorthSection}>
      <Text style={styles.netWorthLabel}>NET WORTH</Text>

      <Text
        style={styles.netWorthAmount}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.5}
      >
        {formatPrice(amount)}
      </Text>

      <View style={[styles.trendChip, { backgroundColor: `${trendColor}18` }]}>
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

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Income</Text>
          <Text style={styles.statValue}>{formatPrice(totalIncome)}</Text>
        </View>

        <View style={styles.statsDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Expenses</Text>
          <Text style={styles.statValue}>{formatPrice(totalExpenses)}</Text>
        </View>
      </View>
    </View>
  );
}
