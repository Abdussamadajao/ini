import { makeStyles } from "@/theme";

export const useBudgetStyles = makeStyles(
  ({ colors, spacing, typography, textMetrics }) => ({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background.screen,
    },
    container: {
      flex: 1,
      paddingHorizontal: spacing[4],
      marginTop: spacing[4],
    },

    periodSelector: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing[5],
    },
    periodButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[1],
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    periodButtonText: {
      ...textMetrics("md", "snug"),
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.Regular,
    },
    totalText: {
      ...textMetrics("sm", "snug"),
      color: colors.text.secondary,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily.Manrope.Medium,
    },
    activeSection: {
      marginBottom: spacing[5],
    },
    sectionTitle: {
      ...textMetrics("xs", "snug"),
      fontWeight: typography.fontWeight.bold,
      color: colors.text.secondary,
      textTransform: "uppercase" as const,
      letterSpacing: 0.6,
      marginBottom: spacing[3],
      marginLeft: spacing[1],
      fontFamily: typography.fontFamily.Manrope.Bold,
    },
    budgetsGrid: {
      gap: spacing[3],
    },
    budgetCard: {
      backgroundColor: colors.background.surface,
      borderRadius: 16,
      padding: spacing[4],
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    budgetCardOverBudget: {
      backgroundColor: colors.background.surface,
      borderRadius: 16,
      padding: spacing[4],
      borderWidth: 1,
      borderColor: colors.status.error.main,
    },
    budgetHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: spacing[3],
    },
    budgetTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[2],
    },
    budgetIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 999,
      justifyContent: "center",
      alignItems: "center",
    },
    budgetIconNormal: {
      backgroundColor: colors.secondary.contrastText,
    },
    budgetIconOverBudget: {
      backgroundColor: colors.status.error.surface,
    },
    budgetName: {
      ...textMetrics("xl", "snug"),
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },
    budgetAmountContainer: {
      alignItems: "flex-end",
    },
    budgetSpent: {
      ...textMetrics("lg", "snug"),
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },
    budgetSpentOverBudget: {
      color: colors.status.error.main,
    },
    budgetTotal: {
      ...textMetrics("sm", "snug"),
      color: colors.text.secondary,
      fontFamily: typography.fontFamily.Manrope.Regular,
    },
    progressBarContainer: {
      height: 6,
      width: "100%",
      backgroundColor: colors.background.elevated,
      borderRadius: 999,
      overflow: "hidden",
      marginBottom: spacing[2],
    },
    progressBar: {
      height: "100%",
      borderRadius: 999,
    },
    budgetFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    budgetRemaining: {
      ...textMetrics("md", "snug"),
      color: colors.text.secondary,
      fontFamily: typography.fontFamily.Manrope.Regular,
    },
    budgetRemainingOverBudget: {
      color: colors.status.error.main,
    },
    warningContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[1],
    },
    detailsContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[0.5],
    },
    detailsText: {
      ...textMetrics("xs", "snug"),
      fontWeight: typography.fontWeight.bold,
      textTransform: "uppercase" as const,
      letterSpacing: 0.5,
      fontFamily: typography.fontFamily.Manrope.Bold,
    },
    detailsTextNormal: {
      color: colors.primary.main,
    },
    detailsTextOverBudget: {
      color: colors.status.error.main,
    },
    archivedSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: spacing[4],
      borderWidth: 1,
      borderColor: colors.border.default,
      borderRadius: 16,
      backgroundColor: colors.background.surface,
      marginBottom: spacing[5],
    },
    archivedTitle: {
      ...textMetrics("xs", "snug"),
      fontWeight: typography.fontWeight.bold,
      color: colors.text.secondary,
      textTransform: "uppercase" as const,
      letterSpacing: 0.5,
      fontFamily: typography.fontFamily.Manrope.Bold,
    },
    archivedContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[1],
    },
    archivedCount: {
      ...textMetrics("md", "snug"),
      color: colors.text.secondary,
      fontFamily: typography.fontFamily.Manrope.Regular,
    },
    bottomNav: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
      backgroundColor: colors.background.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border.default,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingBottom: spacing[3],
    },
    navItem: {
      alignItems: "center",
      paddingVertical: spacing[1],
      paddingHorizontal: spacing[2],
    },
    navItemActive: {
      backgroundColor: colors.secondary.contrastText,
      borderRadius: 999,
      paddingHorizontal: spacing[4],
    },
    navLabel: {
      ...textMetrics("xs", "snug"),
      fontWeight: typography.fontWeight.bold,
      color: colors.text.secondary,
      marginTop: spacing[0.5],
      fontFamily: typography.fontFamily.Manrope.Bold,
    },
    navLabelActive: {
      color: colors.primary.main,
    },
    budgetCardArchived: {
      opacity: 0.7,
    },
    budgetNameArchived: {
      color: colors.text.muted,
    },
    budgetIconArchived: {
      backgroundColor: colors.background.surfaceAlt,
    },
    budgetSpentArchived: {
      color: colors.text.muted,
    },
    budgetTotalArchived: {
      color: colors.text.muted,
    },
    budgetArchivedText: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      color: colors.text.muted,
    },
    detailsTextArchived: {
      color: colors.text.muted,
    },
  }),
);

export const useBudgetFormStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
    container: {
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[3],
      paddingBottom: spacing[30],
    },

    // Subtitle
    subtitleContainer: {
      alignItems: "center",
      marginBottom: spacing[4],
    },
    subtitle: {
      ...textMetrics("md", "snug"),
      color: colors.text.secondary,
      fontFamily: typography.fontFamily.Manrope.Regular,
    },

    // Sections
    section: {
      marginBottom: spacing[5],
    },
    sectionLabel: {
      ...textMetrics("xs", "snug"),
      fontWeight: typography.fontWeight.bold,
      color: colors.text.secondary,
      textTransform: "uppercase" as const,
      letterSpacing: 0.5,
      marginBottom: spacing[2],
      fontFamily: typography.fontFamily.Manrope.Bold,
    },

    // Select Items
    selectItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: colors.border.default,
      paddingHorizontal: spacing[1],
    },
    selectItemLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[2],
    },
    selectItemIcon: {
      fontSize: typography.fontSize.xl,
    },
    selectItemText: {
      ...textMetrics("lg", "snug"),
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.Regular,
    },
    selectItemPlaceholder: {
      color: colors.text.muted,
    },

    // Amount Section
    amountSection: {
      alignItems: "center",
      paddingVertical: spacing[4],
      marginBottom: spacing[4],
    },
    amountContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: spacing[2],
    },
    amountCurrency: {
      ...textMetrics("4xl", "tight"),
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.Bold,
      marginRight: spacing[1],
    },
    amountInput: {
      ...textMetrics("4xl", "tight"),
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.Bold,
      minWidth: 150,
      padding: 0,
    },
    amountLabel: {
      ...textMetrics("xs", "snug"),
      fontWeight: typography.fontWeight.bold,
      color: colors.primary.main,
      textTransform: "uppercase" as const,
      letterSpacing: 0.5,
      fontFamily: typography.fontFamily.Manrope.Bold,
    },

    // Period
    periodContainer: {
      flexDirection: "row",
      backgroundColor: colors.background.surfaceAlt,
      padding: spacing[1],
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    periodButton: {
      flex: 1,
      paddingVertical: spacing[2],
      alignItems: "center",
      borderRadius: radius.sm,
    },
    periodButtonActive: {
      backgroundColor: colors.background.surface,
      shadowColor: colors.text.primary,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    periodButtonText: {
      ...textMetrics("md", "snug"),
      color: colors.text.secondary,
      fontFamily: typography.fontFamily.Manrope.Regular,
    },
    periodButtonTextActive: {
      color: colors.primary.main,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily.Manrope.Medium,
    },

    // Threshold
    thresholdContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: colors.border.default,
    },
    thresholdLabel: {
      ...textMetrics("md", "snug"),
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.Regular,
    },
    thresholdButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[1],
      backgroundColor: colors.background.surfaceAlt,
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[1],
      borderRadius: radius.sm,
    },
    thresholdValue: {
      ...textMetrics("md", "snug"),
      color: colors.primary.main,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily.Manrope.Medium,
    },

    // Preview
    previewCard: {
      padding: spacing[4],
      borderWidth: 1,
      borderColor: colors.border.default,
      borderRadius: radius.md,
      backgroundColor: colors.background.surface,
      gap: spacing[3],
    },
    previewHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    previewCategory: {
      ...textMetrics("lg", "snug"),
      fontWeight: typography.fontWeight.medium,
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.Medium,
    },
    previewAmountContainer: {
      alignItems: "flex-end",
    },
    previewAmount: {
      ...textMetrics("lg", "snug"),
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },
    previewPeriod: {
      ...textMetrics("md", "snug"),
      color: colors.text.secondary,
      fontFamily: typography.fontFamily.Manrope.Regular,
    },
    previewProgressBar: {
      height: 4,
      width: "100%",
      backgroundColor: colors.background.elevated,
      borderRadius: radius.full,
      overflow: "hidden",
    },
    previewProgress: {
      height: "100%",
      backgroundColor: colors.primary.main,
      borderRadius: radius.full,
    },

    // Bottom Spacer
    bottomSpacer: {
      height: spacing[8],
    },
    errorText: {
      ...textMetrics("xs", "snug"),
      color: colors.status.error.main,
      marginTop: spacing[1],
      fontFamily: typography.fontFamily.Manrope.Regular,
    },
    // Footer
    footer: {
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[7],
      backgroundColor: colors.background.screen,
      borderTopWidth: 1,
      borderTopColor: colors.border.default,
    },
    submitButton: {
      backgroundColor: colors.primary.main,
      paddingVertical: spacing[3],
      borderRadius: radius.md,
      alignItems: "center",
    },
    submitButtonDisabled: {
      opacity: 0.6,
    },
    submitButtonText: {
      ...textMetrics("xl", "snug"),
      color: colors.primary.contrastText,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },

    // Budget Card
    budgetCard: {
      backgroundColor: colors.background.surface,
      borderRadius: radius.lg,
      padding: spacing[4],
      marginBottom: spacing[4],
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    budgetHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing[3],
    },
    budgetTitle: {
      ...textMetrics("lg", "snug"),
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },
    removeButton: {
      padding: spacing[1],
    },
    addBudgetButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing[2],
      paddingVertical: spacing[4],
      paddingHorizontal: spacing[4],
      borderRadius: radius.lg,
      borderWidth: 2,
      borderColor: colors.border.default,
      borderStyle: "dashed",
      marginBottom: spacing[4],
    },
    addBudgetText: {
      ...textMetrics("md", "snug"),
      color: colors.primary.main,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      fontWeight: typography.fontWeight.semibold,
    },
  }),
);
