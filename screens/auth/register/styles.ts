import { makeStyles } from "@/theme";

export const useStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
    safe: { flex: 1 },
    scroll: {
      flexGrow: 1,
      padding: spacing[4],
      paddingBottom: spacing[12],
      justifyContent: "center",
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
      zIndex: -1,
    },
    header: {
      marginBottom: spacing[4],
      alignItems: "center",
    },
    title: {
      ...textMetrics("3xl", "tight"),
      fontWeight: "700",
      fontFamily: typography.fontFamily.Manrope.Bold,
      marginBottom: spacing[2],
      marginTop: spacing[2],
      color: colors.text.primary,
    },
    subtitle: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Manrope.Regular,
      color: colors.text.secondary,
    },
    inputRow: {
      marginBottom: spacing[0.25],
    },
    signUpBtn: {
      // height: 54,
      // marginVertical: spacing[4],
      // borderRadius: radius.full,
      zIndex: 20,
    },
    signUpText: {
      ...textMetrics("md", "snug"),
      fontWeight: "700",
      fontFamily: typography.fontFamily.Manrope.Bold,
    },
    divider: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: spacing[4],
      gap: spacing[3],
    },
    dividerLine: {
      flex: 1,
      height: 1,
    },
    dividerText: {
      ...textMetrics("xs", "snug"),
      fontWeight: "500",
      textTransform: "capitalize",
      letterSpacing: 1,
      fontFamily: typography.fontFamily.Manrope.Medium,
    },
    googleBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing[3],
      paddingVertical: spacing[3.5],
      paddingHorizontal: spacing[4],
      borderRadius: radius.full,
      borderWidth: 1,
    },
    googleIconWrap: {
      width: 24,
      height: 24,
      resizeMode: "cover",
    },
    googleText: {
      ...textMetrics("sm", "snug"),
      fontWeight: "500",
      fontFamily: typography.fontFamily.Manrope.Medium,
    },
    footer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      marginTop: spacing[6],
    },
    footerText: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Manrope.Regular,
    },
    linkBtn: {
      backgroundColor: "transparent",
      height: undefined,
      paddingVertical: 0,
      paddingHorizontal: 0,
    },
    footerLink: {
      ...textMetrics("sm", "snug"),
      fontWeight: "700",
      fontFamily: typography.fontFamily.Manrope.Bold,
    },
  }),
);
