import { makeStyles, typography } from "@/theme";

export const useHomeScreenStyles = makeStyles(({ colors, spacing }) => ({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.screen,
  },
  container: { flex: 1 },
  content: { paddingBottom: 140 },
  sectionBlock: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: 1,
  },
}));

export const useHomeHeaderStyles = makeStyles(
  ({ colors, spacing, radius }) => ({
    headerOuter: {
      backgroundColor: colors.background.screen,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: spacing[4],
      paddingBottom: spacing[2.5],
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[1.25],
    },
    headerLeftText: { gap: 2 },
    greeting: {
      fontSize: 13,
      fontFamily: typography.fontFamily.Manrope.Medium,
      color: colors.text.muted,
    },
    name: {
      fontSize: 18,
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.text.primary,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[3.5],
    },
    notifBtn: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: `${colors.primary.main}20`,
    },
    badge: {
      position: "absolute",
      top: 8,
      right: 10,
      width: 10,
      height: 10,
      borderRadius: 5,
      borderWidth: 2,
      backgroundColor: colors.status.error.main,
      borderColor: colors.background.screen,
    },
  }),
);

export const useNetWorthCardStyles = makeStyles(
  ({ colors, spacing, radius, typography }) => ({
    cardsRow: {
      gap: spacing[4],
      paddingRight: spacing[6],
      paddingTop: spacing[1.5],
      paddingBottom: spacing[1.5],
    },
    netWorthCard: {
      borderRadius: radius.xl,
      padding: spacing[10],
      overflow: "hidden",
      shadowOpacity: 0.18,
      shadowRadius: 28,
      shadowOffset: { width: 0, height: 10 },
      elevation: 6,
      backgroundColor: colors.background.surfaceAlt,
      shadowColor: colors.primary.main,
    },
    netWorthGlow: {
      position: "absolute",
      top: -96,
      right: -96,
      width: 256,
      height: 256,
      borderRadius: 128,
      backgroundColor: `${colors.primary.main}1A`,
    },
    netWorthInner: {
      position: "relative",
      zIndex: 1,
      gap: spacing[2],
    },
    netWorthLabel: {
      fontSize: 10,
      fontFamily: typography.fontFamily.Manrope.Bold,
      textTransform: "uppercase",
      letterSpacing: 2,
      color: colors.primary.main,
    },
    netWorthAmountBlock: {
      gap: spacing[2],
    },
    netWorthAmount: {
      fontSize: typography.fontSize["8xl"],
      fontFamily: typography.fontFamily.Manrope.ExtraBold,
      letterSpacing: -1.2,
      lineHeight: typography.fontSize["8xl"] * 1.05,
      color: colors.text.primary,
    },
    netWorthTrendRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[2],
      marginTop: spacing[1],
    },
    netWorthTrendText: {
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.primary.main,
    },
  }),
);
