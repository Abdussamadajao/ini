import { formatPrice } from "@/lib/custom";
import { makeStyles, useTheme } from "@/theme";
import type { DashboardChartPoint, DashboardPeriod } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";

export type WealthVelocityTab = "INCOME" | "EXPENSES";

function buildPath(
  points: { x: number; y: number }[],
  svgHeight: number,
): { line: string; area: string } {
  if (points.length < 2) return { line: "", area: "" };

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

  const line = d.join(" ");
  const last = points[points.length - 1];
  const first = points[0];
  const area = `${line} L ${last.x} ${svgHeight} L ${first.x} ${svgHeight} Z`;

  return { line, area };
}

const DEMO_INCOME: number[] = [
  0.82, 0.75, 0.68, 0.6, 0.55, 0.52, 0.48, 0.42, 0.38, 0.4, 0.45, 0.5, 0.48,
  0.44, 0.38, 0.3, 0.22, 0.18, 0.2, 0.25, 0.3, 0.25, 0.2, 0.15, 0.1, 0.08, 0.12,
  0.18, 0.28, 0.38, 0.48, 0.55, 0.6, 0.55, 0.5, 0.55, 0.62, 0.7, 0.78, 0.85,
  0.9, 0.88, 0.85, 0.8, 0.7, 0.62, 0.55, 0.5, 0.45, 0.4, 0.3, 0.2, 0.12, 0.06,
];

const DEMO_EXPENSES: number[] = DEMO_INCOME.map((v) =>
  Math.min(1, Math.max(0, v * 0.88 + 0.06)),
);

type WealthVelocityChartProps = {
  cardWidth: number;
  activeTab?: WealthVelocityTab;
  onTabChange?: (tab: WealthVelocityTab) => void;
  incomeData?: number[];
  expensesData?: number[];
  /** Latest raw value shown under the title for the active tab. */
  incomeValue?: number;
  expensesValue?: number;
  chartHeight?: number;
};

const WealthVelocityChart = ({
  cardWidth,
  activeTab: activeTabProp,
  onTabChange,
  incomeData = DEMO_INCOME,
  expensesData = DEMO_EXPENSES,
  incomeValue,
  expensesValue,
  chartHeight = 168,
}: WealthVelocityChartProps) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const [internalTab, setInternalTab] = useState<WealthVelocityTab>("INCOME");
  const tab = activeTabProp ?? internalTab;

  const setTab = (t: WealthVelocityTab) => {
    onTabChange?.(t);
    if (activeTabProp === undefined) setInternalTab(t);
  };

  const isIncome = tab === "INCOME";
  const data = isIncome ? incomeData : expensesData;
  const tint = isIncome ? colors.status.success.main : colors.status.error.main;
  const rawValue = isIncome ? incomeValue : expensesValue;

  const innerPad = 16; // spacing[4]
  const svgWidth = Math.max(1, cardWidth - innerPad * 2);
  const gradId = useMemo(
    () => `wealthVel_${Math.random().toString(36).slice(2, 9)}`,
    [],
  );

  const PADDING = { top: 16, bottom: 8, left: 0, right: 0 };
  const chartW = svgWidth - PADDING.left - PADDING.right;
  const chartInnerH = chartHeight - PADDING.top - PADDING.bottom;

  const { line, area, lastPoint } = useMemo(() => {
    if (data.length < 2) return { line: "", area: "", lastPoint: null };
    // invert: higher value should draw higher on screen (lower y)
    const pts = data.map((v, i) => ({
      x: PADDING.left + (i / (data.length - 1)) * chartW,
      y: PADDING.top + (1 - v) * chartInnerH,
    }));
    const { line, area } = buildPath(pts, chartHeight);
    return { line, area, lastPoint: pts[pts.length - 1] };
  }, [data, chartW, chartInnerH, chartHeight]);

  const tabs: WealthVelocityTab[] = ["INCOME", "EXPENSES"];

  return (
    <View
      style={[
        styles.rightCard,
        {
          width: cardWidth,
          borderColor: `${colors.border.default}55`,
        },
      ]}
    >
      <View style={styles.rightHeader}>
        <View style={styles.rightTitleCol}>
          <Text style={[styles.rightTitle, { color: colors.text.primary }]}>
            Cash Flow
          </Text>
          {rawValue !== undefined ? (
            <Text
              style={[styles.rightValue, { color: tint }]}
              numberOfLines={1}
            >
              {formatPrice(rawValue)}
            </Text>
          ) : null}
        </View>

        <View
          style={[
            styles.wealthTabTrack,
            { backgroundColor: colors.background.screen },
          ]}
        >
          {tabs.map((t) => {
            const active = tab === t;
            const chipTint =
              t === "INCOME"
                ? colors.status.success.main
                : colors.status.error.main;
            return (
              <TouchableOpacity
                key={t}
                onPress={() => setTab(t)}
                activeOpacity={0.7}
                style={[
                  styles.wealthTabBtn,
                  active && {
                    backgroundColor: `${chipTint}18`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.wealthTabDot,
                    { backgroundColor: active ? chipTint : colors.text.muted },
                  ]}
                />
                <Text
                  style={[
                    styles.wealthTabText,
                    { color: active ? chipTint : colors.text.secondary },
                  ]}
                >
                  {t === "INCOME" ? "Income" : "Expenses"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={{ width: svgWidth, height: chartHeight }}>
        {line ? (
          <Svg width={svgWidth} height={chartHeight}>
            <Defs>
              <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={tint} stopOpacity={0.32} />
                <Stop offset="60%" stopColor={tint} stopOpacity={0.08} />
                <Stop
                  offset="100%"
                  stopColor={colors.background.screen}
                  stopOpacity={0}
                />
              </LinearGradient>
            </Defs>
            <Path d={area} fill={`url(#${gradId})`} />
            <Path
              d={line}
              fill="none"
              stroke={tint}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {lastPoint ? (
              <>
                <Circle
                  cx={lastPoint.x}
                  cy={lastPoint.y}
                  r={5}
                  fill={colors.background.surfaceAlt}
                />
                <Circle cx={lastPoint.x} cy={lastPoint.y} r={3.5} fill={tint} />
              </>
            ) : null}
          </Svg>
        ) : (
          <View style={styles.emptyChart}>
            <Text
              style={[styles.emptyChartText, { color: colors.text.secondary }]}
            >
              Not enough data yet
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

type HomeChartProps = {
  chart?: DashboardChartPoint[];
  period?: DashboardPeriod;
};

const HomeChart = ({ chart, period }: HomeChartProps) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const { width: screenW } = useWindowDimensions();
  const leftCardW = Math.min(268, Math.round(screenW * 0.62));
  const rightCardW = Math.min(380, Math.round(screenW * 0.92));

  const normalizeData = (values: number[]): number[] => {
    if (values.length === 0) return DEMO_INCOME;
    const max = Math.max(...values, 1);
    return values.map((v) => v / max);
  };

  const incomeData = chart
    ? normalizeData(chart.map((p) => p.income))
    : DEMO_INCOME;
  const expensesData = chart
    ? normalizeData(chart.map((p) => p.expense))
    : DEMO_EXPENSES;

  const latestIncome = chart?.length
    ? chart[chart.length - 1].income
    : undefined;
  const latestExpense = chart?.length
    ? chart[chart.length - 1].expense
    : undefined;

  const savingsInsight = period
    ? {
        amount: period.savings,
        message:
          period.savings_rate >= 0
            ? `${period.savings_rate}% savings rate this period`
            : "No savings data yet",
        isPositive: period.savings >= 0,
      }
    : null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.chartScroll}
      contentContainerStyle={styles.chartScrollContent}
    >
      <View
        style={[
          styles.leftCard,
          { width: leftCardW, borderColor: `${colors.border.default}55` },
        ]}
      >
        <View
          style={[
            styles.leftIconWrap,
            {
              backgroundColor:
                savingsInsight?.isPositive === false
                  ? `${colors.status.error.main}18`
                  : `${colors.primary.main}1A`,
            },
          ]}
        >
          <MaterialIcons
            name={
              savingsInsight?.isPositive === false
                ? "trending-down"
                : "auto-awesome"
            }
            size={18}
            color={
              savingsInsight?.isPositive === false
                ? colors.status.error.main
                : colors.primary.main
            }
          />
        </View>

        <Text style={[styles.leftTitle, { color: colors.text.primary }]}>
          {savingsInsight
            ? `You saved ${formatPrice(savingsInsight.amount)} this period.`
            : "Start tracking your savings."}
        </Text>

        <Text style={[styles.leftSub, { color: colors.text.secondary }]}>
          {savingsInsight?.message ??
            "Add income and expenses to see insights."}
        </Text>
      </View>

      <WealthVelocityChart
        cardWidth={Math.max(rightCardW, leftCardW + 48)}
        incomeData={incomeData}
        expensesData={expensesData}
        incomeValue={latestIncome}
        expensesValue={latestExpense}
      />
    </ScrollView>
  );
};

export default HomeChart;

export { WealthVelocityChart };

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(({ colors, spacing, radius, typography }) => ({
  chartScroll: {
    marginHorizontal: -16,
  },
  chartScrollContent: {
    paddingHorizontal: spacing[4],
    gap: spacing[3],
    paddingBottom: spacing[1],
  },
  leftCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing[4],
    backgroundColor: colors.background.surfaceAlt,
    shadowColor: colors.palette.black,
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    minHeight: 170,
    justifyContent: "center",
  },
  leftIconWrap: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing[3],
  },
  leftTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.Manrope.Bold,
    lineHeight: 22,
    marginBottom: spacing[2],
  },
  leftSub: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.Manrope.Medium,
    lineHeight: 18,
  },

  rightCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing[4],
    backgroundColor: colors.background.surfaceAlt,
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    minHeight: 220,
  },
  rightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing[3],
  },
  rightTitleCol: {
    gap: spacing[0.5],
  },
  rightTitle: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.Manrope.Bold,
    letterSpacing: 0.2,
  },
  rightValue: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.Manrope.ExtraBold,
  },
  wealthTabTrack: {
    flexDirection: "row",
    borderRadius: radius.full,
    padding: 3,
    gap: 2,
  },
  wealthTabBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[1],
    borderRadius: radius.full,
    paddingHorizontal: spacing[2.5],
    paddingVertical: spacing[1.5],
  },
  wealthTabDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  wealthTabText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.Manrope.Bold,
  },
  emptyChart: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyChartText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.Manrope.Medium,
  },
}));
