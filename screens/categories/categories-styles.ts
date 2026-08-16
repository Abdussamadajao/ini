import { makeStyles } from "@/theme";

export const useCategoriesStyles = makeStyles(
  ({ colors, spacing, radius, typography }) => ({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background.screen,
    },
    headerRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
      marginBottom: spacing[2],
    },
    iconBtn: {
      alignItems: "center",
      height: 36,
      justifyContent: "center",
      width: 36,
    },
    headerTitle: {
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.Bold,
      fontSize: typography.fontSize.lg,
    },
    headerIcon: {
      color: colors.text.primary,
    },
    addHeaderIcon: {
      color: colors.primary.main,
    },
    filterRow: {
      marginTop: spacing[1],
      marginBottom: spacing[2],
      paddingHorizontal: spacing[4],
    },
    tabsWrap: {
      backgroundColor: colors.background.surfaceAlt,
      borderColor: `${colors.border.default}66`,
      borderRadius: radius.xl,
      borderWidth: 1,
      flexDirection: "row",
      padding: spacing[1],
    },
    tab: {
      alignItems: "center",
      borderRadius: radius.lg,
      flex: 1,
      paddingVertical: spacing[2],
    },
    tabActive: {
      backgroundColor: colors.primary.main,
    },
    tabInactive: {
      backgroundColor: "transparent",
    },
    tabLabel: {
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      fontSize: typography.fontSize.sm,
    },
    tabLabelActive: {
      color: colors.primary.contrastText,
    },
    tabLabelInactive: {
      color: colors.text.secondary,
    },
    scroll: {
      flex: 1,
      marginTop: spacing[1],
    },
    content: {
      gap: spacing[5],
      paddingBottom: 120,
      paddingHorizontal: spacing[4],
    },
    sectionWrap: {
      gap: spacing[2.5],
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing[0.5],
    },
    sectionTitle: {
      color: colors.text.secondary,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      fontSize: typography.fontSize.xs,
      letterSpacing: 0.2,
    },
    sectionCount: {
      color: colors.text.secondary,
      fontFamily: typography.fontFamily.Manrope.Bold,
      fontSize: typography.fontSize.xs,
    },

    // ── Grid ──────────────────────────────────────────────
    gridRow: {
      justifyContent: "flex-start",
      gap: spacing[2.5],
      marginBottom: spacing[2.5],
    },
    tile: {
      width: "31%",
      alignItems: "center",
      borderRadius: radius.lg,
      borderWidth: 1,
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[1.5],
      position: "relative",
    },
    tileSurface: {
      backgroundColor: colors.background.surfaceAlt,
      borderColor: `${colors.border.default}66`,
    },
    tileIconWrap: {
      alignItems: "center",
      borderRadius: radius.full,
      height: 44,
      width: 44,
      justifyContent: "center",
      marginBottom: spacing[2],
    },
    tileTitle: {
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      fontSize: typography.fontSize.xs,
      textAlign: "center",
      marginBottom: spacing[1.5],
    },
    tileLockBadge: {
      position: "absolute",
      top: 8,
      right: 8,
    },
    colorDot: {
      borderRadius: radius.full,
      height: 6,
      width: 6,
    },
    lockIcon: {
      color: colors.text.secondary,
    },
    feedbackCard: {
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: `${colors.border.default}55`,
      backgroundColor: colors.background.surfaceAlt,
      minHeight: 180,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing[4],
    },
    feedbackTitle: {
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.Bold,
      fontSize: typography.fontSize.lg,
      textAlign: "center",
    },
    feedbackSubtitle: {
      color: colors.text.secondary,
      fontFamily: typography.fontFamily.Manrope.Medium,
      fontSize: typography.fontSize.sm,
      marginTop: spacing[1],
      textAlign: "center",
    },
    retryBtn: {
      marginTop: spacing[3],
      backgroundColor: colors.primary.main,
      borderRadius: radius.full,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
    },
    retryBtnText: {
      color: colors.primary.contrastText,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      fontSize: typography.fontSize.sm,
    },
    fab: {
      alignItems: "center",
      backgroundColor: colors.primary.main,
      borderRadius: radius.full,
      bottom: spacing[8],
      elevation: 5,
      height: 56,
      justifyContent: "center",
      position: "absolute",
      right: spacing[5],
      shadowColor: colors.primary.main,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      width: 56,
    },
    fabIcon: {
      color: colors.primary.contrastText,
    },
  }),
);
