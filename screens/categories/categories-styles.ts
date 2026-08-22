import { makeStyles } from "@/theme";

export const useCategoriesStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
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
      ...textMetrics("lg", "snug"),
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.Bold,
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
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
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
      ...textMetrics("xs", "snug"),
      color: colors.text.secondary,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      letterSpacing: 0.2,
    },
    sectionCount: {
      ...textMetrics("xs", "snug"),
      color: colors.text.secondary,
      fontFamily: typography.fontFamily.Manrope.Bold,
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
      ...textMetrics("xs", "snug"),
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
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
      ...textMetrics("lg", "snug"),
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.Bold,
      textAlign: "center",
    },
    feedbackSubtitle: {
      ...textMetrics("sm", "snug"),
      color: colors.text.secondary,
      fontFamily: typography.fontFamily.Manrope.Medium,
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
      ...textMetrics("sm", "snug"),
      color: colors.primary.contrastText,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
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
    // ── Skeleton ──────────────────────────────────────────
    skeletonTile: {
      width: "31%",
      alignItems: "center",
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: `${colors.border.default}66`,
      backgroundColor: colors.background.surfaceAlt,
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[1.5],
      position: "relative",
    },
    skeletonIconWrap: {
      alignItems: "center",
      borderRadius: radius.full,
      height: 44,
      width: 44,
      justifyContent: "center",
      marginBottom: spacing[2],
      backgroundColor: colors.background.surfaceAlt,
    },
    skeletonText: {
      height: 12,
      width: "60%",
      borderRadius: radius.sm,
      backgroundColor: colors.background.surfaceAlt,
      marginBottom: spacing[1.5],
    },
    skeletonDot: {
      height: 6,
      width: 6,
      borderRadius: radius.full,
      backgroundColor: colors.background.surfaceAlt,
    },
  }),
);
