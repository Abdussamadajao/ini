import { makeStyles } from "@/theme";

export const useHomeScreenStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background.screen,
    },
    container: {
      flex: 1,
    },
    contentContainer: {
      flexGrow: 1,
    },
    sectionBlock: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[4],
      paddingBottom: 1,
    },

    // ─── Net Worth Section ───────────────────────────────────
    netWorthSection: {
      alignItems: "center",
      paddingVertical: spacing[6],
      paddingHorizontal: spacing[4],
      gap: spacing[2],
      backgroundColor: colors.background.surface,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.border.default,
      shadowColor: colors.text.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    netWorthLabel: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      textTransform: "capitalize",
      letterSpacing: 1.5,
      color: colors.text.secondary,
    },
    netWorthAmount: {
      ...textMetrics("5xl", "tight"),
      fontFamily: typography.fontFamily.Manrope.ExtraBold,
      letterSpacing: -0.8,
      color: colors.text.primary,
    },
    trendChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[1],
      borderRadius: radius.full,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1.5],
      marginTop: spacing[1],
    },
    trendChipText: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },
    statsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[5],
      marginTop: spacing[3],
    },
    statsDivider: {
      width: 1,
      height: 16,
      backgroundColor: colors.border.subtle,
    },
    statItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[1.5],
    },
    statLabel: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Manrope.Regular,
      color: colors.text.secondary,
    },
    statValue: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      color: colors.text.primary,
    },

    // ─── Section ─────────────────────────────────────────────
    section: {
      paddingVertical: spacing[4],
      gap: spacing[3],
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    sectionTitle: {
      ...textMetrics("xl", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.text.primary,
    },
    viewAll: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.primary.main,
      textTransform: "capitalize",
      letterSpacing: 0.5,
    },
    emptyWrap: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing[6],
      gap: spacing[2],
    },
    emptyTitle: {
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      color: colors.text.primary,
    },
    emptySubtitle: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Inter.Regular,
      textAlign: "center",
      color: colors.text.secondary,
      maxWidth: 240,
    },
  }),
);

export const useHomeHeaderStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
    headerOuter: {
      backgroundColor: colors.background.screen,
      paddingHorizontal: spacing[4],
      borderBottomColor: colors.border.default,
      borderBottomWidth: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: spacing[3],
    },
    title: {
      ...textMetrics("xl", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.text.primary,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[4],
    },
    searchBtn: {
      padding: spacing[1],
    },
    avatarWrap: {
      width: 32,
      height: 32,
      borderRadius: radius.full,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    skeletonRadius: {
      borderRadius: radius.full,
    },
  }),
);

// ─── Chart Styles ────────────────────────────────────────────────────────

export const useChartStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
    wrapper: {
      gap: spacing[4],
      backgroundColor: colors.background.surface,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.border.default,
      padding: spacing[4],
      shadowColor: colors.palette.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    periodTrack: {
      flexDirection: "row",
      borderRadius: radius.lg,
      padding: 2,
      backgroundColor: colors.background.surfaceAlt,
      borderWidth: 1,
      borderColor: `${colors.border.default}80`,
      alignSelf: "flex-start",
    },
    periodBtn: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1.5],
      borderRadius: radius.md,
      width: 60,
    },
    periodBtnActive: {
      backgroundColor: colors.background.screen,
      shadowColor: colors.palette.black,
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 1 },
      elevation: 2,
    },
    periodBtnText: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      textTransform: "capitalize",
      letterSpacing: 0.5,
      color: colors.text.secondary,
      textAlign: "center",
    },
    periodBtnTextActive: {
      color: colors.primary.main,
    },
    chartArea: {
      height: 192,
      position: "relative",
    },
    chartLabels: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: spacing[2],
    },
    chartLabel: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.text.secondary,
      opacity: 0.5,
    },
    legend: {
      flexDirection: "row",
      gap: spacing[5],
      marginTop: spacing[2],
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[1.5],
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    legendLabel: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Medium,
      color: colors.text.secondary,
    },
  }),
);

// ─── Budgets Styles ──────────────────────────────────────────────────────

export const useBudgetsStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
    wrapper: {
      gap: spacing[4],
    },
    budgetItem: {
      gap: spacing[1.5],
    },
    budgetRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    budgetLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[2],
    },
    budgetIcon: {
      color: colors.text.secondary,
    },
    budgetName: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Manrope.Regular,
      color: colors.text.primary,
    },
    budgetRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    budgetAmount: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      color: colors.text.primary,
    },
    budgetPercent: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      textTransform: "capitalize",
      letterSpacing: 0.5,
      color: colors.text.secondary,
      marginLeft: spacing[2],
    },
    track: {
      width: "100%",
      height: 4,
      borderRadius: radius.full,
      overflow: "hidden",
      backgroundColor: colors.background.surfaceAlt,
    },
    fill: {
      height: "100%",
      borderRadius: radius.full,
    },
    statusLabel: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      textTransform: "capitalize",
      letterSpacing: 0.5,
    },
  }),
);

// ─── Recent Transactions Styles ──────────────────────────────────────────

export const useRecentTransactionsStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
    wrapper: {
      gap: spacing[3.5],
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    sectionTitle: {
      ...textMetrics("xl", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.text.primary,
    },
    viewAll: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.primary.main,
      textTransform: "capitalize",
      letterSpacing: 0.5,
    },
    viewAllPressed: {
      opacity: 0.7,
    },
    list: {
      gap: 0,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing[3],
    },
    rowLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[2],
    },
    txIconWrap: {
      width: 36,
      height: 36,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
    },
    txInfo: {
      gap: 2,
    },
    rowTitle: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Manrope.Regular,
      color: colors.text.primary,
    },
    rowMeta: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      textTransform: "capitalize",
      letterSpacing: 0.5,
      color: colors.text.secondary,
    },
    amount: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },
    emptyWrap: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing[5],
      paddingHorizontal: spacing[4],
      gap: spacing[1],
      borderRadius: radius.xl,
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: `${colors.border.default}55`,
    },
    emptyIconWrap: {
      width: 60,
      height: 60,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing[3],
      backgroundColor: `${colors.primary.main}14`,
    },
    emptyTitle: {
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      color: colors.text.primary,
    },
    emptySubtitle: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Inter.Regular,
      textAlign: "center",
      maxWidth: 240,
      color: colors.text.secondary,
    },
  }),
);
