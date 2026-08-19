import { makeStyles } from "@/theme";

export const useBudgetStyles = makeStyles(
  ({ colors, spacing, typography }) => ({
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
      fontSize: typography.fontSize.md,
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.Regular,
    },
    totalText: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily.Manrope.Medium,
    },
    activeSection: {
      marginBottom: spacing[5],
    },
    sectionTitle: {
      fontSize: typography.fontSize.xs,
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
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },
    budgetAmountContainer: {
      alignItems: "flex-end",
    },
    budgetSpent: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },
    budgetSpentOverBudget: {
      color: colors.status.error.main,
    },
    budgetTotal: {
      fontSize: typography.fontSize.sm,
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
      fontSize: typography.fontSize.md,
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
      fontSize: typography.fontSize.xs,
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
      fontSize: typography.fontSize.xs,
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
      fontSize: typography.fontSize.md,
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
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.secondary,
      marginTop: spacing[0.5],
      fontFamily: typography.fontFamily.Manrope.Bold,
    },
    navLabelActive: {
      color: colors.primary.main,
    },
  }),
);

export const useBudgetFormStyles = makeStyles(
  ({ colors, spacing, radius, typography }) => ({
    container: {
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[3],
      paddingBottom: spacing[6],
    },

    // Subtitle
    subtitleContainer: {
      alignItems: "center",
      marginBottom: spacing[4],
    },
    subtitle: {
      fontSize: typography.fontSize.md,
      color: colors.text.secondary,
      fontFamily: typography.fontFamily.Manrope.Regular,
    },

    // Sections
    section: {
      marginBottom: spacing[5],
    },
    sectionLabel: {
      fontSize: typography.fontSize.xs,
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
      fontSize: typography.fontSize.lg,
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
      fontSize: typography.fontSize["4xl"],
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.Bold,
      marginRight: spacing[1],
    },
    amountInput: {
      fontSize: typography.fontSize["4xl"],
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.Bold,
      minWidth: 150,
      padding: 0,
    },
    amountLabel: {
      fontSize: typography.fontSize.xs,
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
      fontSize: typography.fontSize.md,
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
      fontSize: typography.fontSize.md,
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
      fontSize: typography.fontSize.md,
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
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.medium,
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.Medium,
    },
    previewAmountContainer: {
      alignItems: "flex-end",
    },
    previewAmount: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },
    previewPeriod: {
      fontSize: typography.fontSize.md,
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
      fontSize: typography.fontSize.xs,
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
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semibold,
      color: colors.primary.contrastText,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },
  }),
);
