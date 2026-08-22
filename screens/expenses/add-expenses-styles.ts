import { makeStyles } from "@/theme";

export const useAddExpensesStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background.screen,
    },
    flex: { flex: 1 },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[3],
      minHeight: 48,
      backgroundColor: colors.background.screen,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.default,
    },
    backBtn: {
      padding: spacing[2],
    },
    headerTitle: {
      ...textMetrics("lg", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.text.primary,
    },
    headerRight: {
      width: 40,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: spacing[6],
      paddingBottom: spacing[6],
      marginTop: spacing[3],
    },

    // ── Income Card ──────────────────────────────────────────────────────
    incomeCard: {
      borderRadius: radius.lg,
      borderWidth: 1,
      padding: spacing[4],
      marginBottom: spacing[6],
      shadowColor: colors.palette.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
      backgroundColor: colors.background.surfaceAlt,
      borderColor: colors.border.default,
    },
    incomeCardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing[1.5],
    },
    incomeCardLabel: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      letterSpacing: 0.5,
      textTransform: "capitalize",
      color: colors.text.secondary,
    },
    incomeCardTotal: {
      ...textMetrics("2xl", "tight"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.text.primary,
    },
    incomeCardTotalSuffix: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Manrope.Medium,
      color: colors.text.secondary,
    },
    incomeCardBarWrap: {
      height: 8,
      borderRadius: radius.sm,
      flexDirection: "row",
      overflow: "hidden",
      marginTop: spacing[3],
      marginBottom: spacing[2.5],
      backgroundColor: colors.background.surface,
    },
    incomeCardBarGreen: {
      height: "100%",
      borderRadius: radius.sm,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      backgroundColor: colors.status.success.main,
    },
    incomeCardBarRed: {
      height: "100%",
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      backgroundColor: colors.status.error.main,
    },
    incomeCardFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    incomeCardRemaining: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      color: colors.text.secondary,
    },
    incomeCardPercent: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Medium,
      color: colors.text.muted,
    },

    // ── Header ───────────────────────────────────────────────────────────
    headerBtn: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },

    // ── Amount Section ───────────────────────────────────────────────────
    amountSection: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing[3],
    },
    amountLabel: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.text.secondary,
      marginBottom: spacing[1],
      textTransform: "capitalize",
      letterSpacing: 0.5,
      textAlign: "center",
    },
    amountRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    amountCurrency: {
      ...textMetrics("2xl", "tight"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.text.primary,
      marginRight: spacing[1],
      marginBottom: spacing[1],
    },
    amountField: {
      marginBottom: 0,
      width: 180,
    },
    amountInput: {
      ...textMetrics("5xl", "tight"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      textAlign: "center",
      color: colors.text.primary,
      paddingVertical: 0,
    },

    // ── Form Content ─────────────────────────────────────────────────────
    formContent: {
      gap: spacing[6],
    },
    fieldGroup: {
      gap: spacing[2],
    },
    fieldLabel: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      letterSpacing: 0.6,
      textTransform: "capitalize",
      color: colors.text.secondary,
    },
    errorText: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Medium,
      color: colors.status.error.main,
      marginTop: spacing[1],
    },
    hintText: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Medium,
      color: colors.text.secondary,
      marginTop: spacing[1],
    },

    // ── Segmented Control ────────────────────────────────────────────────
    segmentedControl: {
      flexDirection: "row",
      backgroundColor: colors.background.surfaceAlt,
      borderRadius: radius.lg,
      padding: spacing[1],
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    segmentedButton: {
      flex: 1,
      paddingVertical: spacing[2],
      alignItems: "center",
      justifyContent: "center",
      borderRadius: radius.md,
    },
    segmentedButtonActive: {
      backgroundColor: colors.background.screen,
      shadowColor: colors.palette.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    segmentedButtonText: {
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.Regular,
      color: colors.text.secondary,
    },
    segmentedButtonTextActive: {
      color: colors.primary.main,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },

    // ── Budget Button ────────────────────────────────────────────────────
    budgetButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: spacing[4],
      backgroundColor: colors.background.screen,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    budgetButtonLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[4],
    },
    budgetIcon: {
      borderRadius: radius.sm,
    },
    budgetIconText: {
      fontSize: 20,
    },
    budgetInfo: {
      gap: spacing[0.5],
    },
    budgetName: {
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.text.primary,
    },
    budgetMeta: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Manrope.Regular,
      color: colors.text.secondary,
    },

    // ── Category Button ──────────────────────────────────────────────────
    categoryButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: spacing[4],
      backgroundColor: colors.background.surfaceAlt,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    categoryButtonLocked: {
      opacity: 0.8,
    },
    categoryLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[4],
    },
    categoryIcon: {
      width: 32,
      height: 32,
      borderRadius: radius.full,
      backgroundColor: colors.background.screen,
      alignItems: "center",
      justifyContent: "center",
    },
    categoryIconText: {
      fontSize: 16,
    },
    categoryName: {
      ...textMetrics("lg", "snug"),
      fontFamily: typography.fontFamily.Manrope.Regular,
      color: colors.text.primary,
    },

    // ── Note Field ───────────────────────────────────────────────────────
    noteField: {
      marginBottom: 0,
    },

    // ── Date Button ──────────────────────────────────────────────────────
    dateButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: spacing[4],
      backgroundColor: colors.background.screen,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    dateLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[4],
    },
    dateText: {
      ...textMetrics("lg", "snug"),
      fontFamily: typography.fontFamily.Manrope.Regular,
      color: colors.text.primary,
    },

    // ── Footer ───────────────────────────────────────────────────────────
    footer: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[5],
      paddingBottom: spacing[6],
      backgroundColor: colors.background.screen,
      borderTopWidth: 1,
      borderTopColor: colors.border.default,
    },
    saveButton: {
      backgroundColor: colors.primary.main,
      borderRadius: radius.lg,
      paddingVertical: spacing[4],
    },
    saveButtonText: {
      ...textMetrics("lg", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.primary.contrastText,
      textAlign: "center",
    },

    // ── Category grid ────────────────────────────────────────────────────
    categorySection: {
      marginBottom: spacing[6],
    },
    categoryHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing[3],
    },
    viewAll: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      color: colors.primary.main,
    },
    categoryGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing[2.5],
    },
    categoryItem: {
      width: "31%",
      borderRadius: radius.lg,
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[2],
      alignItems: "center",
      borderWidth: 1.5,
      position: "relative",
    },
    categoryIconWrap: {
      width: 44,
      height: 44,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing[2],
    },
    categoryLabel: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      textAlign: "center",
    },
    categoryCheck: {
      position: "absolute",
      top: 6,
      right: 6,
      width: 16,
      height: 16,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
    },

    // ── Ledger-style field rows ──────────────────────────────────────────
    field: {
      marginBottom: 0,
    },
    divider: {
      borderBottomWidth: 1.5,
      borderStyle: "dashed",
      borderBottomColor: colors.border.default,
      marginVertical: spacing[5],
    },
    rowLabel: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[2],
      marginBottom: spacing[2.5],
    },
    rowIconBadge: {
      width: 22,
      height: 22,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary.main + "14",
    },

    notesInput: {
      minHeight: 100,
      padding: spacing[3.5],
      borderRadius: radius.md,
      borderWidth: 1,
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.Medium,
      textAlignVertical: "top",
      backgroundColor: colors.background.surface,
      borderColor: colors.border.default,
      color: colors.text.primary,
    },
    notesFieldContainer: {
      backgroundColor: colors.background.surface,
      borderColor: colors.border.default,
      minHeight: 96,
      alignItems: "flex-start",
      paddingVertical: spacing[3],
      borderRadius: radius.lg,
    },
    notesFieldText: {
      color: colors.text.primary,
      minHeight: 72,
      textAlignVertical: "top",
    },

    // ── Footer — spending summary + Save ────────────────────────────────
    summaryStrip: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[2.5],
      marginBottom: spacing[4],
      paddingLeft: spacing[3],
      borderLeftWidth: 2,
      borderLeftColor: colors.status.error.main,
    },
    summaryTextCol: {
      flex: 1,
    },
    summaryMeta: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      letterSpacing: 0.5,
      marginBottom: 2,
      color: colors.text.secondary,
    },
    summaryLine: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Manrope.Medium,
      color: colors.text.primary,
    },
    saveBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing[2],
      backgroundColor: colors.primary.main,
      borderRadius: radius.full,
      paddingVertical: spacing[3.5],
      paddingHorizontal: spacing[4],
    },
    saveBtnText: {
      ...textMetrics("md", "snug"),
      color: colors.primary.contrastText,
      fontFamily: typography.fontFamily.Manrope.Bold,
    },

    // ── Modal Styles ─────────────────────────────────────────────────────
    modalBackground: {
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      backgroundColor: colors.background.surface,
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
      paddingBottom: spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: colors.border.default,
      backgroundColor: colors.background.surface,
    },
    modalTitle: {
      ...textMetrics("lg", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.text.primary,
      flex: 1,
    },
    modalListContent: {
      paddingHorizontal: spacing[6],
      paddingBottom: spacing[8.5],
    },
    categoryOptionRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing[3.5],
      borderBottomWidth: 1,
      borderBottomColor: colors.border.default,
    },
    categoryOptionIconWrap: {
      width: 44,
      height: 44,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
      marginRight: spacing[3.5],
    },
    categoryOptionLabel: {
      flex: 1,
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      color: colors.text.primary,
    },
    emptyWrap: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing[8],
      paddingVertical: spacing[10],
    },
    emptyIconBadge: {
      width: 56,
      height: 56,
      borderRadius: radius.full,
      backgroundColor: colors.background.surfaceAlt,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing[4],
    },
    emptyTitle: {
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.text.primary,
      marginBottom: spacing[1.5],
      textAlign: "center",
    },
    emptyMessage: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Manrope.Medium,
      color: colors.text.secondary,
      textAlign: "center",
    },

    // ── Income Modal Styles ──────────────────────────────────────────────
    incomeModalScrollContent: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      paddingBottom: spacing[4],
    },

    // Income Source Card (non-progress mode)
    incomeSourceCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: spacing[3.5],
      borderRadius: radius.lg,
      borderWidth: 2,
      marginBottom: spacing[3],
      backgroundColor: colors.background.surface,
      borderColor: colors.border.default,
    },
    incomeSourceIconWrap: {
      width: 48,
      height: 48,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
      marginRight: spacing[3.5],
    },
    incomeSourceBody: {
      flex: 1,
      minWidth: 0,
    },
    incomeSourceLabel: {
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.text.primary,
    },
    incomeSourceRemaining: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      marginTop: spacing[0.5],
      color: colors.text.secondary,
    },
    incomeSourceTotal: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Medium,
      marginTop: spacing[0.5],
      color: colors.text.muted,
    },
    incomeSourceBarWrap: {
      height: 6,
      borderRadius: radius.sm,
      overflow: "hidden",
      marginTop: spacing[2],
      backgroundColor: colors.background.surfaceAlt,
    },
    incomeSourceBarFill: {
      height: "100%",
      borderRadius: radius.sm,
    },
    incomeSourceRight: {
      alignItems: "flex-end",
      marginLeft: spacing[3],
    },
    incomeSourcePct: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Medium,
      marginBottom: spacing[1.5],
      color: colors.text.secondary,
    },
    incomeSourceRadio: {
      width: 22,
      height: 22,
      borderRadius: radius.full,
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
      borderColor: colors.border.default,
    },
    incomeSourceRadioInner: {
      width: 12,
      height: 12,
      borderRadius: radius.full,
      backgroundColor: colors.primary.main,
    },

    // Budget Sheet Row (progress mode)
    budgetSheetRow: {
      flexDirection: "row",
      alignItems: "center",
      padding: spacing[3],
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border.default,
      marginBottom: spacing[2],
      backgroundColor: colors.background.surface,
    },
    budgetSheetRowSelected: {
      borderColor: colors.primary.main,
      backgroundColor: `${colors.primary.main}08`,
    },
    budgetSheetIconWrap: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
      marginRight: spacing[3],
      backgroundColor: colors.background.surfaceAlt,
    },
    budgetSheetIconText: {
      fontSize: 20,
    },
    budgetSheetBody: {
      flex: 1,
      minWidth: 0,
    },
    budgetSheetTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing[1],
    },
    budgetSheetLabel: {
      flex: 1,
      marginRight: spacing[2],
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.text.primary,
    },
    budgetSheetAmount: {
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      color: colors.text.primary,
    },
    budgetSheetMetaRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: spacing[1.5],
    },
    budgetSheetMetaText: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Regular,
      color: colors.text.secondary,
    },
    budgetSheetProgressTrack: {
      width: "100%",
      height: 4,
      borderRadius: radius.sm,
      overflow: "hidden",
      backgroundColor: colors.background.surfaceAlt,
    },
    budgetSheetProgressFill: {
      height: "100%",
      borderRadius: radius.sm,
    },
    budgetSheetCheckWrap: {
      marginLeft: spacing[2],
      width: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    budgetSheetCheckCircle: {
      width: 24,
      height: 24,
      borderRadius: radius.full,
      backgroundColor: colors.primary.main,
      alignItems: "center",
      justifyContent: "center",
    },

    // Modal Footer Buttons
    incomeSourceConfirmBtnWrap: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      borderTopWidth: 1,
      borderTopColor: colors.border.default,
      backgroundColor: colors.background.surface,
    },
    incomeSourceConfirmBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing[2],
      paddingVertical: spacing[3.5],
      borderRadius: radius.lg,
      backgroundColor: colors.primary.main,
    },
    incomeSourceConfirmBtnText: {
      ...textMetrics("md", "snug"),
      color: colors.primary.contrastText,
      fontFamily: typography.fontFamily.Manrope.Bold,
    },
    incomeSourceCancelBtn: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing[2.5],
      borderRadius: radius.md,
      borderWidth: 1,
    },
    incomeSourceCancelBtnText: {
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.Medium,
    },
    budgetCreateNewBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing[2],
      paddingVertical: spacing[3],
      borderRadius: radius.md,
      borderWidth: 1,
      marginTop: spacing[2],
    },
    budgetCreateNewText: {
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },

    // ── Batch Entry ──────────────────────────────────────────────────────
    headerCountBadge: {
      backgroundColor: colors.background.surfaceAlt,
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: colors.border.default,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1],
    },
    headerCountText: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      letterSpacing: 0.6,
      textTransform: "capitalize",
      color: colors.text.primary,
    },
    headerSubtitle: {
      textAlign: "center",
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Manrope.Regular,
      color: colors.text.secondary,
      paddingBottom: spacing[2],
      paddingHorizontal: spacing[6],
      backgroundColor: colors.background.screen,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.default,
    },

    // Each entry is a ledger block separated by a dashed rule (matching the
    // `divider` pattern used inside individual expense fields), rather than
    // a boxed card — batch entries read as one continuous sheet of line
    // items instead of stacked widgets.
    batchSection: {
      marginBottom: spacing[5],
    },
    batchSectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing[4],
    },
    batchIndexBadge: {
      width: 22,
      height: 22,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary.main + "14",
    },
    batchIndexText: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.primary.main,
    },
    removeButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[1],
      paddingVertical: spacing[1],
      paddingHorizontal: spacing[2],
      borderRadius: radius.sm,
    },
    removeButtonText: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Manrope.Medium,
      color: colors.status.error.main,
    },
    batchDivider: {
      borderBottomWidth: 1.5,
      borderStyle: "dashed",
      borderBottomColor: colors.border.default,
      marginTop: spacing[5],
    },

    // Tinted pill, consistent with the categoryButton/segmentedControl
    // fill treatment used elsewhere, instead of a bare dashed outline.
    addAnotherButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing[2],
      paddingVertical: spacing[3],
      borderRadius: radius.lg,
      marginTop: spacing[2],
      marginBottom: spacing[6],
      backgroundColor: colors.primary.main + "0F",
      borderWidth: 1,
      borderColor: colors.primary.main + "33",
    },
    addAnotherText: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      color: colors.primary.main,
    },

    // Reuses the left-accent-border language from summaryStrip; the accent
    // color communicates whether the batch is ready to save.
    batchSummaryRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingLeft: spacing[3],
      borderLeftWidth: 2,
      marginBottom: spacing[4],
    },
    batchSummaryRowReady: {
      borderLeftColor: colors.status.success.main,
    },
    batchSummaryRowPending: {
      borderLeftColor: colors.border.default,
    },
    batchTotalText: {
      ...textMetrics("xl", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.text.primary,
      textAlign: "right",
    },

    // ── Review Expenses Sheet ────────────────────────────────────────────
    reviewHeader: {
      paddingHorizontal: spacing[6],
      paddingBottom: spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: colors.border.default,
      gap: spacing[1],
    },
    reviewHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    reviewTotalRow: {
      alignItems: "flex-end",
      gap: spacing[0.5],
    },
    reviewTotalText: {
      ...textMetrics("xl", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.primary.main,
    },
    reviewList: {
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[2],
    },
    reviewListItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: colors.background.surfaceAlt,
    },
    numeralLg: {
      ...textMetrics("lg", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      color: colors.text.primary,
    },
    reviewFooter: {
      paddingHorizontal: spacing[6],
      paddingTop: spacing[4],
      paddingBottom: spacing[8],
      backgroundColor: colors.background.screen,
      borderTopWidth: 1,
      borderTopColor: colors.border.default,
      gap: spacing[2],
    },
    editButton: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing[3],
      borderRadius: radius.lg,
    },
    editButtonText: {
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      color: colors.primary.main,
      textAlign: "center",
    },
  }),
);
