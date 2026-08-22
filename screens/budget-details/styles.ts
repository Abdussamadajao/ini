import { makeStyles } from "@/theme";

export const useBudgetDetailsStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background.screen,
    },

    // Top App Bar
    topAppBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing[4],
      height: 56,
      backgroundColor: colors.background.screen,
    },
    backButton: {
      padding: spacing[2],
    },
    appBarTitle: {
      ...textMetrics("md", "snug"),
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.secondary,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      textTransform: "uppercase" as const,
      letterSpacing: 0.5,
    },
    moreButton: {
      padding: spacing[2],
    },

    container: {
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
    },

    // Summary — statement card, not a centered hero
    summarySection: {
      backgroundColor: colors.background.surfaceAlt,
      borderRadius: radius.xl,
      padding: spacing[5],
      marginBottom: spacing[6],
      shadowColor: colors.text.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 2,
    },
    cardHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing[5],
    },
    cardHeaderLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[3],
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: radius.lg,
      backgroundColor: colors.background.elevated,
      alignItems: "center",
      justifyContent: "center",
    },
    budgetName: {
      ...textMetrics("lg", "snug"),
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },
    statusPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[1],
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1],
      borderRadius: radius.full,
      backgroundColor: colors.background.elevated,
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: radius.full,
    },
    statusText: {
      ...textMetrics("xs", "snug"),
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.secondary,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },

    // Left-aligned hero amount — editorial, not centered
    budgetAmountContainer: {
      marginBottom: spacing[5],
    },
    budgetLabel: {
      ...textMetrics("xs", "snug"),
      fontWeight: typography.fontWeight.bold,
      color: colors.text.muted,
      textTransform: "uppercase" as const,
      letterSpacing: 0.8,
      marginBottom: spacing[1],
      fontFamily: typography.fontFamily.Manrope.Bold,
    },
    budgetAmount: {
      ...textMetrics("5xl", "tight"),
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.Bold,
      letterSpacing: -1,
    },

    // Gauge meter — thicker track with a glossy inner highlight
    progressContainer: {
      width: "100%",
    },
    progressLabels: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: spacing[2],
    },
    progressLabel: {
      ...textMetrics("sm", "snug"),
      color: colors.text.secondary,
      fontFamily: typography.fontFamily.Manrope.Medium,
    },
    progressBarTrack: {
      height: 12,
      width: "100%",
      backgroundColor: colors.background.elevated,
      borderRadius: radius.full,
      overflow: "hidden",
      marginBottom: spacing[3],
    },
    progressBarFill: {
      height: "100%",
      borderRadius: radius.full,
    },
    progressBarHighlight: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      height: "50%",
      backgroundColor: colors.background.screen,
      opacity: 0.15,
    },
    statusRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    statusIndicator: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[1],
    },
    remainingText: {
      ...textMetrics("sm", "snug"),
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },

    // Section header — a short accent dash instead of a full-width rule.
    // This repeats above every section (trend, transactions) as the one signature device.
    sectionHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[2],
      marginBottom: spacing[4],
    },
    sectionAccent: {
      width: 14,
      height: 3,
      borderRadius: radius.full,
      backgroundColor: colors.primary.main,
    },
    sectionTitle: {
      ...textMetrics("xs", "snug"),
      fontWeight: typography.fontWeight.bold,
      color: colors.text.secondary,
      textTransform: "uppercase" as const,
      letterSpacing: 0.8,
      fontFamily: typography.fontFamily.Manrope.Bold,
    },

    // Transactions
    transactionsSection: {
      marginBottom: spacing[6],
    },
    transactionItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: colors.border.default,
    },
    transactionItemLast: {
      borderBottomWidth: 0,
    },
    transactionLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[3],
    },
    transactionIcon: {
      width: 40,
      height: 40,
      borderRadius: radius.lg,
      backgroundColor: colors.background.surfaceAlt,
      alignItems: "center",
      justifyContent: "center",
    },
    transactionName: {
      ...textMetrics("md", "snug"),
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.Medium,
    },
    transactionDate: {
      ...textMetrics("sm", "snug"),
      color: colors.text.muted,
      fontFamily: typography.fontFamily.Manrope.Regular,
      marginTop: 2,
    },
    transactionAmount: {
      ...textMetrics("md", "snug"),
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },

    bottomSpacer: {
      height: spacing[8],
    },

    // Footer — Edit is the one loud action; Archive/Delete quiet down below it
    footer: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[3],
      paddingBottom: spacing[4],
      backgroundColor: colors.background.screen,
      borderTopWidth: 1,
      borderTopColor: colors.border.default,
      gap: spacing[3],
    },
    footerSecondaryRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: spacing[5],
    },

    editButtonText: {
      ...textMetrics("sm", "snug"),
      fontWeight: typography.fontWeight.bold,
      color: colors.primary.contrastText,
      fontFamily: typography.fontFamily.Manrope.Bold,
    },
    archiveButtonText: {
      ...textMetrics("xs", "snug"),
      fontWeight: typography.fontWeight.semibold,
      color: colors.status.warning.main,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },
    deleteButtonText: {
      ...textMetrics("xs", "snug"),
      fontWeight: typography.fontWeight.semibold,
      color: colors.status.error.main,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },

    emptyTransactions: {
      alignItems: "center",
      paddingVertical: spacing[6],
    },
    emptyTransactionsTitle: {
      ...textMetrics("md", "snug"),
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.primary,
      marginTop: spacing[2],
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },
    emptyTransactionsMessage: {
      ...textMetrics("sm", "snug"),
      color: colors.text.secondary,
      textAlign: "center",
      marginTop: spacing[1],
      fontFamily: typography.fontFamily.Manrope.Regular,
    },
  }),
);

export const useBudgetTrendChartStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
    trendSection: {
      marginBottom: spacing[6],
    },
    sectionHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[2],
      marginBottom: spacing[4],
    },
    sectionAccent: {
      width: 14,
      height: 3,
      borderRadius: radius.full,
      backgroundColor: colors.primary.main,
    },
    sectionTitle: {
      ...textMetrics("xs", "snug"),
      fontWeight: typography.fontWeight.bold,
      color: colors.text.secondary,
      textTransform: "uppercase" as const,
      letterSpacing: 0.8,
      fontFamily: typography.fontFamily.Manrope.Bold,
    },
    trendChart: {
      height: 120,
      position: "relative" as const,
    },
    trendAxis: {
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      right: 0,
      height: 1,
      backgroundColor: colors.border.default,
    },
    trendLabels: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: spacing[2],
    },
    trendLabelText: {
      ...textMetrics("xs", "snug"),
      color: colors.text.muted,
      fontFamily: typography.fontFamily.Manrope.Medium,
    },
  }),
);
