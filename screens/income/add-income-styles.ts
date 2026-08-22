import { makeStyles } from "@/theme";

export const useAddIncomeStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background.screen,
    },
    flex: { flex: 1 },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[2],
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[3],
      minHeight: 48,
    },
    backBtn: {
      padding: spacing[2],
    },
    headerTitle: {
      ...textMetrics("2xl", "tight"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.text.primary,
    },
    headerRight: {
      width: 40,
    },
    scroll: {
      flexGrow: 1,
    },
    scrollContent: {
      paddingHorizontal: spacing[6],
      paddingBottom: spacing[10],
    },

    // ── Hero amount ──────────────────────────────
    amountSection: {
      marginTop: spacing[6],
      marginBottom: spacing[2],
      alignItems: "center",
      alignSelf: "stretch",
    },
    typeChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[1.5],
      alignSelf: "center",
      paddingVertical: spacing[1.5],
      paddingHorizontal: spacing[3],
      borderRadius: radius.full,
      backgroundColor: colors.primary.main + "16",
      marginBottom: spacing[3],
    },
    typeChipText: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      letterSpacing: 0.8,
      textTransform: "capitalize",
      color: colors.primary.main,
    },

    // ── Ledger (replaces the boxed formCard) ─────
    ledger: {
      marginTop: spacing[7],
    },
    ledgerRow: {
      paddingVertical: spacing[1],
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
    upperLabel: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      letterSpacing: 0.5,
      color: colors.text.secondary,
    },
    field: {
      marginBottom: 0,
    },

    // ── Footer / summary strip ────────────────────
    saveRow: {
      paddingHorizontal: spacing[6],
      paddingTop: spacing[4],
      paddingBottom: spacing[4],
      backgroundColor: colors.background.screen,
      borderTopWidth: 1,
      borderTopColor: colors.border.default,
    },
    summaryStrip: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[2.5],
      marginBottom: spacing[4],
      paddingLeft: spacing[3],
      borderLeftWidth: 2,
      borderLeftColor: colors.primary.main,
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
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing[2.5],
      height: 52,
      borderRadius: radius.full,
      padding: 0,
      paddingHorizontal: spacing[5.5],
      backgroundColor: colors.primary.main,
    },
    saveBtnText: {
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.primary.contrastText,
    },
  }),
);
