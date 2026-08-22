import { InlineError, Skeleton } from "@/components/shared";
import { useTheme } from "@/theme";
import type { PeriodTab } from "@/types";
import { useDashboard } from "@/actions/dashboard";
import React, { useMemo, useState } from "react";
import {
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { useChartStyles } from "./styles";

export const PERIOD_TABS: PeriodTab[] = ["Week", "Month", "3M", "Year"];

const DEMO_INCOME: number[] = [
  0.82, 0.75, 0.68, 0.6, 0.55, 0.52, 0.48, 0.42, 0.38, 0.4, 0.45, 0.5,
];

const DEMO_EXPENSES: number[] = DEMO_INCOME.map((v) =>
  Math.min(1, Math.max(0, v * 0.6 + 0.05)),
);

const DEMO_LABELS = ["W1", "W2", "W3", "W4"];

// Layout constants for the bar chart
const BAR_GAP_RATIO = 0.35; // gap between grouped bar-pairs, relative to slot width
const BAR_INNER_GAP = 3; // px gap between the income bar and expense bar within a pair
const MIN_BAR_HEIGHT = 3; // px, so a zero/near-zero value still shows a sliver

const HomeChart = () => {
  const { colors } = useTheme();
  const styles = useChartStyles();
  const { width: screenW } = useWindowDimensions();
  const [activePeriod, setActivePeriod] = useState<PeriodTab>("Month");
  const {
    data: dashboard,
    isPending,
    error,
    refetch,
  } = useDashboard(activePeriod);

  const chart = dashboard?.chart;

  const incomeData = chart
    ? chart.map((p) => p.income)
    : DEMO_INCOME.map((v) => v * 500000);
  const expenseData = chart
    ? chart.map((p) => p.expense)
    : DEMO_EXPENSES.map((v) => v * 180000);

  const chartW = screenW - 65;
  const chartH = 192;
  const PADDING = { top: 16, bottom: 24, left: 4, right: 4 };
  const innerW = chartW - PADDING.left - PADDING.right;
  const innerH = chartH - PADDING.top - PADDING.bottom;

  const gradIncomeId = useMemo(
    () => `homeBarIncome_${Math.random().toString(36).slice(2, 9)}`,
    [],
  );
  const gradExpenseId = useMemo(
    () => `homeBarExpense_${Math.random().toString(36).slice(2, 9)}`,
    [],
  );

  const bars = useMemo(() => {
    const count = incomeData.length;
    if (count === 0) return [];

    const allValues = [...incomeData, ...expenseData];
    const maxVal = Math.max(...allValues, 1);

    const slotW = innerW / count;
    const groupW = slotW * (1 - BAR_GAP_RATIO);
    const barW = Math.max(2, (groupW - BAR_INNER_GAP) / 2);

    return incomeData.map((incomeVal, i) => {
      const expenseVal = expenseData[i] ?? 0;

      const incomeH = Math.max(MIN_BAR_HEIGHT, (incomeVal / maxVal) * innerH);
      const expenseH = Math.max(MIN_BAR_HEIGHT, (expenseVal / maxVal) * innerH);

      const slotStart = PADDING.left + i * slotW;
      const groupStart = slotStart + (slotW - groupW) / 2;

      const incomeX = groupStart;
      const expenseX = groupStart + barW + BAR_INNER_GAP;

      const incomeY = PADDING.top + innerH - incomeH;
      const expenseY = PADDING.top + innerH - expenseH;

      return {
        key: i,
        incomeX,
        incomeY,
        incomeH,
        expenseX,
        expenseY,
        expenseH,
        barW,
      };
    });
  }, [incomeData, expenseData, innerW, innerH]);

  // Derive x-axis labels from real chart dates instead of a hardcoded array.
  // Falls back to demo labels only when there's no real data (e.g. loading state).
  const labels = useMemo(() => {
    if (!chart || chart.length === 0) return DEMO_LABELS;

    const maxLabels = 4;
    const count = chart.length;
    const step = Math.max(1, Math.floor(count / maxLabels));

    const formatDate = (dateStr: string) => {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      if (activePeriod === "Week") {
        return d.toLocaleDateString(undefined, { weekday: "short" });
      }
      if (activePeriod === "Year") {
        return d.toLocaleDateString(undefined, { month: "short" });
      }
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    };

    const picked: string[] = [];
    for (let i = 0; i < count; i += step) {
      picked.push(formatDate(chart[i].date));
      if (picked.length >= maxLabels) break;
    }
    // Always make sure the last point is represented
    const lastFormatted = formatDate(chart[count - 1].date);
    if (picked[picked.length - 1] !== lastFormatted) {
      if (picked.length >= maxLabels) {
        picked[picked.length - 1] = lastFormatted;
      } else {
        picked.push(lastFormatted);
      }
    }

    return picked;
  }, [chart, activePeriod]);

  if (error) {
    return (
      <View style={styles.wrapper}>
        <InlineError error={error} onRetry={refetch} />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* Period Selector */}
      <View style={styles.periodTrack}>
        {PERIOD_TABS.map((tab) => {
          const active = activePeriod === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActivePeriod(tab)}
              activeOpacity={0.7}
              disabled={isPending}
              style={[styles.periodBtn, active && styles.periodBtnActive]}
            >
              <Text
                style={[
                  styles.periodBtnText,
                  active && styles.periodBtnTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Chart */}
      {isPending ? (
        <View style={[styles.chartArea, { width: chartW }]}>
          <Skeleton width={chartW} height={chartH} borderRadius={12} />
        </View>
      ) : (
        <View style={[styles.chartArea, { width: chartW }]}>
          <Svg width={chartW} height={chartH}>
            <Defs>
              <LinearGradient id={gradIncomeId} x1="0" y1="0" x2="0" y2="1">
                <Stop
                  offset="0%"
                  stopColor={colors.primary.main}
                  stopOpacity={1}
                />
                <Stop
                  offset="100%"
                  stopColor={colors.primary.main}
                  stopOpacity={0.5}
                />
              </LinearGradient>
              <LinearGradient id={gradExpenseId} x1="0" y1="0" x2="0" y2="1">
                <Stop
                  offset="0%"
                  stopColor={colors.status.error.main}
                  stopOpacity={1}
                />
                <Stop
                  offset="100%"
                  stopColor={colors.status.error.main}
                  stopOpacity={0.5}
                />
              </LinearGradient>
            </Defs>

            {bars.map((bar) => (
              <React.Fragment key={bar.key}>
                {/* Income bar */}
                <Rect
                  x={bar.incomeX}
                  y={bar.incomeY}
                  width={bar.barW}
                  height={bar.incomeH}
                  rx={Math.min(4, bar.barW / 2)}
                  fill={`url(#${gradIncomeId})`}
                />
                {/* Expense bar */}
                <Rect
                  x={bar.expenseX}
                  y={bar.expenseY}
                  width={bar.barW}
                  height={bar.expenseH}
                  rx={Math.min(4, bar.barW / 2)}
                  fill={`url(#${gradExpenseId})`}
                />
              </React.Fragment>
            ))}
          </Svg>

          {/* Date labels */}
          <View style={styles.chartLabels}>
            {labels.map((label, i) => (
              <Text key={`${label}-${i}`} style={styles.chartLabel}>
                {label}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: colors.primary.main }]}
          />
          <Text style={styles.legendLabel}>Income</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: colors.status.error.main },
            ]}
          />
          <Text style={styles.legendLabel}>Expenses</Text>
        </View>
      </View>
    </View>
  );
};

export default HomeChart;
