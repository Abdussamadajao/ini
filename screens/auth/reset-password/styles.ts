import { makeStyles } from "@/theme";

export const useStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
    flex: { flex: 1 },
    container: {
      flex: 1,
      backgroundColor: colors.background.screen,
    },
    backLink: {
      alignSelf: "center",
      marginTop: spacing[3],
      padding: spacing[2],
    },

    otpBox: {
      width: 44,
      height: 52,
      borderRadius: radius.md,
      borderWidth: 1.5,
      alignItems: "center",
      justifyContent: "center",
    },
    otpBoxText: {
      ...textMetrics("xl", "tight"),
      fontFamily: typography.fontFamily.Manrope.Bold,
    },
    blobTop: {
      position: "absolute",
      top: -128,
      right: -128,
      width: 256,
      height: 256,
      borderRadius: radius.full,
      backgroundColor: colors.primary.soft,
      opacity: 0.2,
      zIndex: 0,
    },
    blobBottom: {
      position: "absolute",
      bottom: -160,
      left: -160,
      width: 320,
      height: 320,
      borderRadius: radius.full,
      backgroundColor: colors.secondary.main,
      opacity: 0.08,
      zIndex: 0,
    },
    header: {
      zIndex: 2,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing[4],
      height: 56,
      borderBottomColor: colors.border.default,
    },
    headerBack: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
    },
    headerSpacer: {
      width: 40,
    },
    scroll: {
      flex: 1,
      zIndex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing[4],
      paddingTop: spacing[6],
    },
    maxWidth: {
      width: "100%",
      maxWidth: 448,
      alignSelf: "center",
    },
    hero: {
      alignItems: "center",
      marginBottom: spacing[8],
    },
    heroIconWrap: {
      width: 64,
      height: 64,
      borderRadius: radius.md,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing[4],
    },
    heroTitle: {
      ...textMetrics("3xl", "tight"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      textAlign: "center",
      marginBottom: spacing[2],
      color: colors.text.primary,
    },
    subtitle: {
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.Regular,
      textAlign: "center",
      maxWidth: 280,
      color: colors.text.secondary,
    },
    otpDisplay: {
      flexDirection: "row",
      justifyContent: "center",
      gap: spacing[3],
      marginBottom: spacing[6],
    },
    otpDot: {
      width: 14,
      height: 14,
      borderRadius: radius.full,
    },
    resendBlock: {
      marginBottom: spacing[8],
      alignItems: "center",
    },
    resendLabel: {
      ...textMetrics("xs", "snug"),
      letterSpacing: 0.6,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },
    resendTime: {
      fontFamily: typography.fontFamily.Manrope.Bold,
    },
    resendLink: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
    },
    inputRow: {
      marginBottom: spacing[4],
    },
    bottomShell: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
      paddingBottom: spacing[10],
    },
    submitText: {
      ...textMetrics("md", "snug"),
      fontWeight: "700",
      fontFamily: typography.fontFamily.Manrope.Bold,
    },
  }),
);
