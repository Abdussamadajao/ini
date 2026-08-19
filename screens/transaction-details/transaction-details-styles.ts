import { makeStyles } from "@/theme";

export const useTransactionDetailsStyles = makeStyles(
  ({ colors, spacing, radius, typography }) => ({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background.surface,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[3],
      minHeight: 48,
      backgroundColor: colors.background.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.default,
    },
    headerBtn: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      flex: 1,
      textAlign: "center",
      fontSize: typography.fontSize.xl,
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.primary.main,
    },
    scroll: { flex: 1 },
    scrollContent: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[6],
      paddingBottom: spacing[8],
    },

    // Hero section - Amount focus
    hero: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing[6],
    },
    typeLabel: {
      fontSize: 12,
      fontFamily: typography.fontFamily.Manrope.Bold,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      color: colors.text.secondary,
      marginBottom: spacing[2],
    },
    amount: {
      fontSize: typography.fontSize["6xl"],
      fontFamily: typography.fontFamily.Manrope.Bold,
      letterSpacing: -0.8,
    },

    // Details card
    detailsCard: {
      borderRadius: radius.xl,
      backgroundColor: colors.background.screen,
      borderWidth: 1,
      borderColor: colors.border.default,
      padding: spacing[5],
      marginBottom: spacing[6],
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      paddingVertical: spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: colors.border.default,
    },

    detailRowNoBorder: {
      borderBottomWidth: 0,
    },
    detailRowColumn: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
    detailLabel: {
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.Manrope.Regular,
      color: colors.text.secondary,
    },
    detailValue: {
      fontSize: typography.fontSize.md,
      fontFamily: typography.fontFamily.Manrope.Medium,
      color: colors.text.primary,
    },
    detailValueRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[2],
    },

    // Notes and Tags
    notesText: {
      fontSize: typography.fontSize.md,
      fontFamily: typography.fontFamily.Manrope.Regular,
      color: colors.text.primary,
      marginTop: spacing[1.5],
      lineHeight: 22,
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing[2],
      marginTop: spacing[2],
    },
    tagPill: {
      paddingHorizontal: spacing[2.5],
      paddingVertical: spacing[1.5],
      borderRadius: radius.full,
      backgroundColor: colors.background.surfaceAlt,
    },
    tagPillText: {
      fontSize: 12,
      fontFamily: typography.fontFamily.Manrope.Bold,
      letterSpacing: 0.5,
      color: colors.text.secondary,
    },

    // Income pool impact
    impactCard: {
      borderRadius: radius.xl,
      backgroundColor: colors.background.screen,
      borderWidth: 1,
      borderColor: colors.border.default,
      padding: spacing[5],
      marginBottom: spacing[6],
    },
    impactTitle: {
      fontSize: typography.fontSize.xl,
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.text.primary,
      marginBottom: spacing[4],
    },
    impactFlow: {
      alignItems: "center",
    },
    impactRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
    impactRowLast: {
      borderTopWidth: 1,
      borderTopColor: colors.border.default,
      paddingTop: spacing[2],
      marginTop: spacing[1],
    },
    impactLabel: {
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.Manrope.Regular,
      color: colors.text.secondary,
    },
    impactLabelBold: {
      fontFamily: typography.fontFamily.Manrope.Medium,
      color: colors.text.primary,
    },
    impactValue: {
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.Manrope.Medium,
      color: colors.text.primary,
    },
    impactValueBold: {
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },
    impactArrow: {
      marginVertical: spacing[1],
    },

    // Receipt section
    receiptSection: {
      marginBottom: spacing[6],
    },
    receiptTitle: {
      fontSize: typography.fontSize.xl,
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.text.primary,
      marginBottom: spacing[3],
      paddingHorizontal: spacing[2],
    },
    receiptContainer: {
      borderRadius: radius.xl,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border.default,
      aspectRatio: 4 / 3,
      backgroundColor: colors.background.surfaceAlt,
    },
    receiptImage: {
      width: "100%",
      height: "100%",
    },

    // Footer
    footer: {
      flexDirection: "row",
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[5],
      backgroundColor: colors.background.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border.default,
      gap: spacing[3],
    },
    footerBtn: {
      flex: 1,
    },
    deleteBtn: {
      backgroundColor: "transparent",
    },
    editBtn: {
      backgroundColor: colors.primary.main,
      shadowColor: colors.primary.main,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 14,
      elevation: 4,
    },
    deleteBtnText: {
      fontSize: typography.fontSize.lg,
      fontFamily: typography.fontFamily.Manrope.Medium,
      color: colors.status.error.main,
    },
    editBtnText: {
      fontSize: typography.fontSize.lg,
      fontFamily: typography.fontFamily.Manrope.Medium,
      color: colors.primary.contrastText,
    },

    // Loading/Error states
    centerBlock: {
      flex: 1,
      padding: spacing[6],
      alignItems: "center",
      justifyContent: "center",
    },
    metaLine: {
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.Inter.Medium,
      color: colors.text.secondary,
    },
    sourceAccent: {
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      color: colors.primary.main,
    },
  }),
);
