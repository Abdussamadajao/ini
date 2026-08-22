// screens/styles/notifications.ts
import { makeStyles } from "@/theme";

export const useNotificationStyles = makeStyles(
  ({ spacing, radius, typography, textMetrics }) => ({
    container: {
      flex: 1,
      paddingHorizontal: spacing[4],
    },
    contentContainer: {
      paddingBottom: spacing[8],
      gap: spacing[5],
    },

    // Summary line (matches design's "3 UNREAD NOTIFICATIONS" caption)
    summaryRow: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
      paddingBottom: spacing[3],
    },
    summaryText: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      letterSpacing: 0.5,
      textTransform: "capitalize",
    },

    // Group
    group: {
      gap: spacing[2],
    },
    groupTitle: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      letterSpacing: 0.5,
      textTransform: "capitalize",
      paddingBottom: spacing[1],
      borderBottomWidth: 1,
    },
    groupList: {
      borderRadius: radius.lg,
      borderWidth: 1,
      overflow: "hidden",
    },

    // Notification row — icon left, text middle, time+dot stacked right
    notificationWrapper: {
      position: "relative",
      overflow: "hidden",
    },
    itemDivider: {
      height: 1,
      marginLeft: spacing[3] + 40 + spacing[3],
    },
    notificationContent: {
      position: "relative",
      zIndex: 2,
    },
    notificationTouchable: {
      flexDirection: "row",
      alignItems: "flex-start",
      padding: spacing[3],
      gap: spacing[3],
    },
    notificationIconWrap: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    notificationBody: {
      flex: 1,
      minWidth: 0,
      justifyContent: "center",
      minHeight: 40,
      gap: 2,
    },
    notificationTitle: {
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.Medium,
    },
    notificationTitleUnread: {
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },
    notificationMessage: {
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.Regular,
    },
    notificationMeta: {
      alignItems: "flex-end",
      justifyContent: "space-between",
      minHeight: 40,
      flexShrink: 0,
    },
    notificationTime: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      letterSpacing: 0.3,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: radius.full,
    },

    // Swipe Actions
    swipeActions: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      flexDirection: "row",
      alignItems: "center",
      width: 140,
    },
    swipeActionBtn: {
      flex: 1,
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing[0.5],
    },
    swipeDeleteBtn: {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
    swipeActionText: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      letterSpacing: 0.2,
    },

    // Empty State
    emptyContainer: {
      paddingHorizontal: spacing[8],
      alignItems: "center",
      marginTop: spacing[16],
    },
    emptyIconWrap: {
      width: 80,
      height: 80,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing[5],
    },
    emptyTitle: {
      ...textMetrics("lg", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      marginBottom: spacing[2],
    },
    emptySubtitle: {
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.Regular,
      textAlign: "center",
    },
  }),
);
