import { useTheme } from "@/theme";
import type { DashboardChartPoint, DashboardPeriod, PeriodTab } from "@/types";
import React, { useMemo } from "react";
import {
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import { useChartStyles } from "./styles";

function buildPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  const d: string[] = [];
  d.push(`M ${points[0].x} ${points[0].y}`);
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
  }
  return d.join(" ");
}

export const PERIOD_TABS: PeriodTab[] = ["Week", "Month", "3M", "Year"];

const DEMO_INCOME: number[] = [
  0.82, 0.75, 0.68, 0.6, 0.55, 0.52, 0.48, 0.42, 0.38, 0.4, 0.45, 0.5, 0.48,
  0.44, 0.38, 0.3, 0.22, 0.18, 0.2, 0.25, 0.3, 0.25, 0.2, 0.15, 0.1, 0.08, 0.12,
  0.18, 0.28, 0.38, 0.48, 0.55, 0.6, 0.55, 0.5, 0.55, 0.62, 0.7, 0.78, 0.85,
  0.9, 0.88, 0.85, 0.8, 0.7, 0.62, 0.55, 0.5, 0.45, 0.4, 0.3, 0.2, 0.12, 0.06,
];

const DEMO_EXPENSES: number[] = DEMO_INCOME.map((v) =>
  Math.min(1, Math.max(0, v * 0.88 + 0.06)),
);

const DEMO_LABELS = ["W1", "W2", "W3", "W4"];

type HomeChartProps = {
  chart?: DashboardChartPoint[];
  period?: DashboardPeriod;
  activePeriod: PeriodTab;
  onPeriodChange: (period: PeriodTab) => void;
};

const HomeChart = ({
  chart,
  period,
  activePeriod,
  onPeriodChange,
}: HomeChartProps) => {
  const { colors } = useTheme();
  const styles = useChartStyles();
  const { width: screenW } = useWindowDimensions();

  const incomeData = chart
    ? chart.map((p) => p.income)
    : DEMO_INCOME.map((v) => v * 500000);
  const expenseData = chart
    ? chart.map((p) => p.expense)
    : DEMO_EXPENSES.map((v) => v * 180000);

  const chartW = screenW - 40;
  const chartH = 192;
  const PADDING = { top: 16, bottom: 24, left: 0, right: 0 };
  const innerW = chartW - PADDING.left - PADDING.right;
  const innerH = chartH - PADDING.top - PADDING.bottom;

  const { incomePath, expensePath, incomeArea } = useMemo(() => {
    if (incomeData.length < 2)
      return { incomePath: "", expensePath: "", incomeArea: "" };
    const allValues = [...incomeData, ...expenseData];
    const maxVal = Math.max(...allValues, 1);

    const incomePts = incomeData.map((v, i) => ({
      x: PADDING.left + (i / (incomeData.length - 1)) * innerW,
      y: PADDING.top + (1 - v / maxVal) * innerH,
    }));
    const expensePts = expenseData.map((v, i) => ({
      x: PADDING.left + (i / (expenseData.length - 1)) * innerW,
      y: PADDING.top + (1 - v / maxVal) * innerH,
    }));

    const iPath = buildPath(incomePts);
    const ePath = buildPath(expensePts);
    const last = incomePts[incomePts.length - 1];
    const first = incomePts[0];
    const area = `${iPath} L ${last.x} ${chartH} L ${first.x} ${chartH} Z`;

    return { incomePath: iPath, expensePath: ePath, incomeArea: area };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomeData, expenseData, innerW, innerH, chartW, chartH]);

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

  const gradId = useMemo(
    () => `homeChart_${Math.random().toString(36).slice(2, 9)}`,
    [],
  );

  return (
    <View style={styles.wrapper}>
      {/* Period Selector */}
      <View style={styles.periodTrack}>
        {PERIOD_TABS.map((tab) => {
          const active = activePeriod === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => onPeriodChange(tab)}
              activeOpacity={0.7}
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
      <View style={[styles.chartArea, { width: chartW }]}>
        <Svg width={chartW} height={chartH}>
          <Defs>
            <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <Stop
                offset="0%"
                stopColor={colors.primary.main}
                stopOpacity={0.15}
              />
              <Stop
                offset="100%"
                stopColor={colors.primary.main}
                stopOpacity={0}
              />
            </LinearGradient>
          </Defs>

          {/* Income area fill */}
          {incomeArea ? <Path d={incomeArea} fill={`url(#${gradId})`} /> : null}

          {/* Income line (solid) */}
          {incomePath ? (
            <Path
              d={incomePath}
              fill="none"
              stroke={colors.primary.main}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}

          {/* Expense line (dashed) */}
          {expensePath ? (
            <Path
              d={expensePath}
              fill="none"
              stroke={colors.status.error.main}
              strokeWidth={2}
              strokeDasharray="6 4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
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
