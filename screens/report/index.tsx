import { useInsights } from "@/actions";
import { InlineError } from "@/components/shared/error";
import { Header } from "@/components/shared/header";
import Skeleton from "@/components/shared/skeleton";
import { formatPrice } from "@/lib/custom";
import { makeStyles, useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, G } from "react-native-svg";

const PURPLE_ACCENT = "#8B5CF6";
const DONUT_TRANSPORT = "#5DADE2";
const DONUT_SHOPPING = "#95A5A6";
const DONUT_BILLS = "#566573";
const OBS_FOOD_BG = "#A0522D";
const OBS_TIP_BG = "#F1C40F";

type DonutSeg = { pct: number; color: string };

function SpendingDonut({
  size,
  strokeWidth,
  segments,
}: {
  size: number;
  strokeWidth: number;
  segments: DonutSeg[];
}) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  let dashOffset = 0;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <Svg width={size} height={size}>
      <G transform={`rotate(-90 ${cx} ${cy})`}>
        {segments.map((seg, i) => {
          const dash = seg.pct * c;
          const gap = c - dash;
          const el = (
            <Circle
              key={i}
              cx={cx}
              cy={cy}
              fill="none"
              r={r}
              stroke={seg.color}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-dashOffset}
              strokeLinecap="butt"
              strokeWidth={strokeWidth}
            />
          );
          dashOffset += dash;
          return el;
        })}
      </G>
    </Svg>
  );
}

const ReportScreen = () => {
  const { colors } = useTheme();
  const styles = useStyles();
  const { data: insights, isPending, error, refetch } = useInsights();
  console.log(insights);
  const donutSegments: DonutSeg[] = insights?.spending_by_category.map(
    (cat) => ({
      pct: cat.percentage / 100,
      color: cat.color,
    }),
  ) ?? [
    { pct: 0.45, color: colors.status.success.main },
    { pct: 0.25, color: DONUT_TRANSPORT },
    { pct: 0.2, color: DONUT_SHOPPING },
    { pct: 0.1, color: DONUT_BILLS },
  ];

  const legend = insights?.spending_by_category.map((cat) => ({
    label: cat.name,
    pct: `${cat.percentage}%`,
    color: cat.color,
  })) ?? [
    { label: "Food", pct: "45%", color: colors.status.success.main },
    { label: "Transport", pct: "25%", color: DONUT_TRANSPORT },
    { label: "Shopping", pct: "20%", color: DONUT_SHOPPING },
    { label: "Bills", pct: "10%", color: DONUT_BILLS },
  ];

  const strokeW = 36;
  const DONUT_CHART_SIZE = 200;

  const savingsChange = insights?.comparison.savings_change ?? 0;
  const savingsChangeAbs = Math.abs(savingsChange);
  const isSavingsPositive = savingsChange >= 0;

  const currentIncome = insights?.summary.income ?? 0;
  const prevIncome = insights?.comparison.prev_income ?? 0;
  const incomeChange = insights?.comparison.income_change ?? 0;
  const isIncomePositive = incomeChange >= 0;

  const totalSpent = insights?.summary.expenses ?? 0;

  const observations = insights?.observations ?? [];

  if (error) {
    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <Header title="Insights" />
        <View style={styles.errorContainer}>
          <InlineError error={error} onRetry={refetch} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <Header title="Insights" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <Text style={[styles.pageEyebrow, { color: colors.text.secondary }]}>
          Smart analysis of your finances
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.background.surfaceAlt },
          ]}
        >
          <View style={styles.cardTopRow}>
            <View
              style={[
                styles.bulbIconWrap,
                { backgroundColor: colors.status.success.main },
              ]}
            >
              <Ionicons
                color={colors.primary.contrastText}
                name="bulb"
                size={18}
              />
            </View>
            <View
              style={[
                styles.pill,
                { backgroundColor: colors.background.surface },
              ]}
            >
              <Text
                style={[styles.pillText, { color: colors.status.success.main }]}
              >
                SMART INSIGHT
              </Text>
            </View>
          </View>
          {isPending ? (
            <>
              <Skeleton width="80%" height={24} />
              <Skeleton width="100%" height={16} style={{ marginTop: 8 }} />
            </>
          ) : (
            <>
              <Text style={[styles.heroTitle, { color: colors.text.primary }]}>
                You saved{" "}
                <Text
                  style={[
                    styles.heroAmount,
                    { color: colors.status.success.main },
                  ]}
                >
                  {formatPrice(savingsChangeAbs)}
                </Text>{" "}
                {isSavingsPositive ? "more" : "less"} than last month.
              </Text>
              <Text style={[styles.heroSub, { color: colors.text.secondary }]}>
                {isSavingsPositive
                  ? "Great job! Your intentional spending habits are showing significant results in your wealth accumulation path."
                  : "Consider reviewing your expenses to improve your savings rate."}
              </Text>
            </>
          )}
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.background.surfaceAlt },
          ]}
        >
          <Text style={[styles.labelCaps, { color: colors.text.secondary }]}>
            PERFORMANCE TREND THIS MONTH
          </Text>
          {isPending ? (
            <>
              <Skeleton width="60%" height={32} style={{ marginTop: 8 }} />
              <Skeleton width="40%" height={14} style={{ marginTop: 16 }} />
              <Skeleton width="50%" height={24} style={{ marginTop: 8 }} />
            </>
          ) : (
            <>
              <Text style={[styles.amountLg, { color: colors.text.primary }]}>
                {formatPrice(currentIncome)}
              </Text>
              <Text
                style={[
                  styles.labelCaps,
                  styles.labelGap,
                  { color: colors.text.secondary },
                ]}
              >
                LAST MONTH
              </Text>
              <View style={styles.trendRow}>
                <Text style={[styles.amountMd, { color: colors.text.primary }]}>
                  {formatPrice(prevIncome)}
                </Text>
                <View
                  style={[
                    styles.trendPill,
                    {
                      backgroundColor: isIncomePositive
                        ? `${colors.status.success.main}22`
                        : `${colors.status.error.main}22`,
                    },
                  ]}
                >
                  <Ionicons
                    color={
                      isIncomePositive
                        ? colors.status.success.main
                        : colors.status.error.main
                    }
                    name={isIncomePositive ? "arrow-up" : "arrow-down"}
                    size={14}
                    style={styles.trendArrow}
                  />
                  <Text
                    style={[
                      styles.trendPillText,
                      {
                        color: isIncomePositive
                          ? colors.status.success.main
                          : colors.status.error.main,
                      },
                    ]}
                  >
                    {Math.abs(incomeChange)}%
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Recent Observations
          </Text>
          <Pressable hitSlop={8}>
            <Text style={[styles.link, { color: colors.status.success.main }]}>
              View All
            </Text>
          </Pressable>
        </View>

        {isPending ? (
          <>
            <Skeleton width="100%" height={60} />
            <Skeleton
              width="100%"
              height={60}
              style={{ marginTop: 12, marginBottom: 12 }}
            />
            <Skeleton width="100%" height={60} />
          </>
        ) : observations.length === 0 ? (
          <View
            style={[
              styles.obsCard,
              { backgroundColor: colors.background.surfaceAlt },
            ]}
          >
            <View
              style={[
                styles.obsIcon,
                { backgroundColor: colors.status.success.main },
              ]}
            >
              <Ionicons color="#fff" name="checkmark-circle" size={18} />
            </View>
            <Text style={[styles.obsText, { color: colors.text.primary }]}>
              No observations yet. Keep tracking your expenses!
            </Text>
          </View>
        ) : (
          observations.slice(0, 3).map((observation, index) => (
            <View
              key={index}
              style={[
                styles.obsCard,
                { backgroundColor: colors.background.surfaceAlt },
              ]}
            >
              <View
                style={[
                  styles.obsIcon,
                  {
                    backgroundColor:
                      index === 0
                        ? OBS_FOOD_BG
                        : index === 1
                          ? OBS_TIP_BG
                          : colors.status.success.main,
                  },
                ]}
              >
                <Ionicons
                  color={index === 1 ? "#1a1a1a" : "#fff"}
                  name={
                    index === 0 ? "trending-up" : index === 1 ? "bulb" : "car"
                  }
                  size={18}
                />
              </View>
              <Text style={[styles.obsText, { color: colors.text.primary }]}>
                {observation}
              </Text>
            </View>
          ))
        )}

        <Text
          style={[
            styles.sectionTitle,
            styles.sectionTitleSpaced,
            { color: colors.text.primary },
          ]}
        >
          Spending Breakdown
        </Text>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.background.surfaceAlt },
          ]}
        >
          {isPending ? (
            <>
              <Skeleton width={DONUT_CHART_SIZE} height={DONUT_CHART_SIZE} />
              <Skeleton width="100%" height={120} style={{ marginTop: 16 }} />
            </>
          ) : (
            <>
              <View style={styles.donutWrap}>
                <SpendingDonut
                  segments={donutSegments}
                  size={DONUT_CHART_SIZE}
                  strokeWidth={strokeW}
                />
                <View pointerEvents="none" style={styles.donutCenter}>
                  <Text
                    style={[
                      styles.donutLabel,
                      { color: colors.text.secondary },
                    ]}
                  >
                    TOTAL SPENT
                  </Text>
                  <Text
                    style={[styles.donutValue, { color: colors.text.primary }]}
                  >
                    {formatPrice(totalSpent)}
                  </Text>
                </View>
              </View>
              <View style={styles.legend}>
                {legend.map((row) => (
                  <View key={row.label} style={styles.legendRow}>
                    <View
                      style={[styles.legendDot, { backgroundColor: row.color }]}
                    />
                    <Text
                      style={[
                        styles.legendLabel,
                        { color: colors.text.primary },
                      ]}
                    >
                      {row.label}
                    </Text>
                    <Text
                      style={[
                        styles.legendPct,
                        { color: colors.text.secondary },
                      ]}
                    >
                      {row.pct}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>

        <Text
          style={[
            styles.sectionTitle,
            styles.sectionTitleSpaced,
            { color: colors.text.primary },
          ]}
        >
          Spending Habits
        </Text>
        <View
          style={[
            styles.habitCard,
            { backgroundColor: colors.background.surfaceAlt },
          ]}
        >
          <View
            style={[
              styles.habitIconCircle,
              { backgroundColor: `${colors.status.success.main}18` },
            ]}
          >
            <Ionicons
              color={colors.status.success.main}
              name="calendar"
              size={22}
            />
          </View>
          <Text style={[styles.habitText, { color: colors.text.primary }]}>
            You spend most on{" "}
            <Text style={[styles.habitBold, { color: colors.text.primary }]}>
              weekends
            </Text>
            .
          </Text>
        </View>
        <View
          style={[
            styles.habitCard,
            { backgroundColor: colors.background.surfaceAlt },
          ]}
        >
          <View
            style={[
              styles.habitIconCircle,
              { backgroundColor: `${colors.status.success.main}18` },
            ]}
          >
            <Ionicons
              color={colors.status.success.main}
              name="restaurant"
              size={22}
            />
          </View>
          <Text style={[styles.habitText, { color: colors.text.primary }]}>
            Your highest expense category is{" "}
            <Text style={[styles.habitBold, { color: colors.text.primary }]}>
              {insights?.spending_by_category[0]?.name ?? "Food"}
            </Text>
            .
          </Text>
        </View>
        <View
          style={[
            styles.habitCard,
            { backgroundColor: colors.background.surfaceAlt },
          ]}
        >
          <View
            style={[
              styles.habitIconCircle,
              { backgroundColor: `${colors.status.success.main}18` },
            ]}
          >
            <Ionicons
              color={colors.status.success.main}
              name="business"
              size={22}
            />
          </View>
          <Text style={[styles.habitText, { color: colors.text.primary }]}>
            You tend to spend more after receiving income.
          </Text>
        </View>

        <View
          style={[
            styles.card,
            styles.ctaCard,
            { backgroundColor: colors.background.surfaceAlt },
          ]}
        >
          <Text style={[styles.ctaTitle, { color: colors.text.primary }]}>
            Build a stronger future
          </Text>
          <Text style={[styles.ctaSub, { color: colors.text.secondary }]}>
            Set a budget to improve your savings by up to 15%.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.ctaBtn,
              { backgroundColor: colors.primary.main },
              pressed && styles.ctaBtnPressed,
            ]}
          >
            <Text
              style={[
                styles.ctaBtnText,
                { color: colors.primary.contrastText },
              ]}
            >
              Create Budget
            </Text>
          </Pressable>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(({ colors, spacing, radius, typography }) => ({
  safeArea: {
    backgroundColor: colors.background.screen,
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing[4],
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingBottom: spacing[24],
    paddingHorizontal: spacing[4],
    paddingLeft: spacing[4] + 4,
    paddingTop: spacing[3],
  },
  bottomSpacer: { height: 100 },
  pageEyebrow: {
    fontFamily: typography.fontFamily.Inter.Regular,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing[4],
  },
  card: {
    borderRadius: radius.lg,
    marginBottom: spacing[4],
    padding: spacing[5],
  },
  cardTopRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing[4],
  },
  bulbIconWrap: {
    alignItems: "center",
    borderRadius: radius.md,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  pill: {
    borderRadius: radius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  pillText: {
    fontFamily: typography.fontFamily.Inter.SemiBold,
    fontSize: typography.fontSize.xs,
    letterSpacing: 0.6,
  },
  heroTitle: {
    fontFamily: typography.fontFamily.Manrope.SemiBold,
    fontSize: typography.fontSize.xl,
    lineHeight: 28,
    marginBottom: spacing[3],
  },
  heroAmount: {
    fontFamily: typography.fontFamily.Manrope.Bold,
  },
  heroSub: {
    fontFamily: typography.fontFamily.Inter.Regular,
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  labelCaps: {
    fontFamily: typography.fontFamily.Inter.Medium,
    fontSize: typography.fontSize.xs,
    letterSpacing: 0.8,
  },
  labelGap: { marginTop: spacing[4] },
  amountLg: {
    fontFamily: typography.fontFamily.Manrope.Bold,
    fontSize: typography.fontSize["3xl"],
    marginTop: spacing[2],
  },
  amountMd: {
    fontFamily: typography.fontFamily.Manrope.SemiBold,
    fontSize: typography.fontSize.xl,
  },
  trendRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: spacing[2],
  },
  trendPill: {
    alignItems: "center",
    borderRadius: radius.full,
    flexDirection: "row",
    marginLeft: spacing[3],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  trendArrow: { marginRight: 4, marginTop: 1 },
  trendPillText: {
    fontFamily: typography.fontFamily.Inter.SemiBold,
    fontSize: typography.fontSize.sm,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing[3],
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.Manrope.Bold,
    fontSize: typography.fontSize.lg,
  },
  sectionTitleSpaced: { marginBottom: spacing[3], marginTop: spacing[2] },
  link: {
    fontFamily: typography.fontFamily.Inter.SemiBold,
    fontSize: typography.fontSize.sm,
  },
  obsCard: {
    alignItems: "center",
    borderRadius: radius.lg,
    flexDirection: "row",
    marginBottom: spacing[3],
    padding: spacing[4],
  },
  obsIcon: {
    alignItems: "center",
    borderRadius: radius.full,
    height: 44,
    justifyContent: "center",
    marginRight: spacing[3],
    width: 44,
  },
  obsText: {
    flex: 1,
    fontFamily: typography.fontFamily.Inter.Regular,
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  obsEmphasis: {
    fontFamily: typography.fontFamily.Inter.SemiBold,
  },
  obsPositive: {
    fontFamily: typography.fontFamily.Inter.SemiBold,
  },
  donutWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing[2],
  },
  donutCenter: {
    alignItems: "center",
    height: 200,
    justifyContent: "center",
    position: "absolute",
    width: 200,
  },
  donutLabel: {
    fontFamily: typography.fontFamily.Inter.Medium,
    fontSize: typography.fontSize.xs,
    letterSpacing: 0.6,
  },
  donutValue: {
    fontFamily: typography.fontFamily.Manrope.Bold,
    fontSize: typography.fontSize["2xl"],
    marginTop: 2,
  },
  legend: { marginTop: spacing[4] },
  legendRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: spacing[3],
  },
  legendDot: {
    borderRadius: 6,
    height: 10,
    marginRight: spacing[3],
    width: 10,
  },
  legendLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.Inter.Medium,
    fontSize: typography.fontSize.sm,
  },
  legendPct: {
    fontFamily: typography.fontFamily.Inter.SemiBold,
    fontSize: typography.fontSize.sm,
  },
  habitCard: {
    alignItems: "center",
    borderRadius: radius.lg,
    marginBottom: spacing[3],
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[6],
  },
  habitIconCircle: {
    alignItems: "center",
    borderRadius: radius.full,
    height: 48,
    justifyContent: "center",
    marginBottom: spacing[3],
    width: 48,
  },
  habitText: {
    fontFamily: typography.fontFamily.Inter.Regular,
    fontSize: typography.fontSize.sm,
    lineHeight: 22,
    textAlign: "center",
  },
  habitBold: {
    fontFamily: typography.fontFamily.Inter.SemiBold,
  },
  ctaCard: { marginTop: spacing[2] },
  ctaTitle: {
    fontFamily: typography.fontFamily.Manrope.Bold,
    fontSize: typography.fontSize.xl,
    marginBottom: spacing[2],
  },
  ctaSub: {
    fontFamily: typography.fontFamily.Inter.Regular,
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
    marginBottom: spacing[5],
  },
  ctaBtn: {
    alignItems: "center",
    borderRadius: radius.full,
    paddingVertical: spacing[4],
  },
  ctaBtnPressed: { opacity: 0.88 },
  ctaBtnText: {
    fontFamily: typography.fontFamily.Manrope.SemiBold,
    fontSize: typography.fontSize.md,
  },
}));

export default ReportScreen;
