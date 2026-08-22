// screens/notifications.tsx
import {
  ActionModal,
  Button,
  ErrorState,
  Header,
  SafeArea,
  Skeleton,
} from "@/components/shared";
import { useColors } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState, useRef } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  Animated,
  PanResponder,
} from "react-native";
import { useRouter } from "expo-router";
import { useNotificationStyles } from "./styles";
import { useNotificationMutations, useNotifications } from "@/actions";
import { NotificationResponse, NotificationType } from "@/types";
import { format } from "date-fns";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useToast } from "@/components/toasts";

const TYPE_ICON: Record<NotificationType, keyof typeof MaterialIcons.glyphMap> =
  {
    LOW_BALANCE: "account-balance-wallet",
    BUDGET_EXCEEDED: "warning",
    BUDGET_WARNING: "warning-amber",
    BILL_DUE: "event",
    GOAL_ACHIEVED: "flag",
    SYSTEM: "info-outline",
  };

const TYPE_COLORS: Record<NotificationType, { bg: string; icon: string }> = {
  LOW_BALANCE: { bg: "error", icon: "error" },
  BUDGET_EXCEEDED: { bg: "error", icon: "error" },
  BUDGET_WARNING: { bg: "warning", icon: "warning" },
  BILL_DUE: { bg: "warning", icon: "warning" },
  GOAL_ACHIEVED: { bg: "success", icon: "success" },
  SYSTEM: { bg: "surface", icon: "primary" },
};

const NotificationsScreen = () => {
  const colors = useColors();
  const styles = useNotificationStyles();
  const router = useRouter();
  const { toast } = useToast();

  const [selectedNotificationId, setSelectedNotificationId] = useState<
    string | null
  >(null);
  const deleteModalRef = useRef<BottomSheetModal>(null);
  const markAllModalRef = useRef<BottomSheetModal>(null);

  const {
    data,
    isPending,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotifications();
  const {
    markAsReadMutation,
    markAllAsReadMutation,
    deleteNotificationMutation,
  } = useNotificationMutations();

  const notifications = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data],
  );
  const unreadCount = data?.pages[0]?.meta.unread_count ?? 0;

  const swipeAnimations = useRef<Record<string, Animated.Value>>({});

  const getAnimation = (id: string) => {
    if (!swipeAnimations.current[id]) {
      swipeAnimations.current[id] = new Animated.Value(0);
    }
    return swipeAnimations.current[id];
  };

  const handleSwipe = (id: string, dx: number) => {
    const anim = getAnimation(id);
    if (dx < -30) {
      Animated.spring(anim, {
        toValue: -140,
        useNativeDriver: true,
        damping: 15,
        mass: 0.8,
        stiffness: 200,
      }).start();
    } else {
      Animated.spring(anim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 15,
        mass: 0.8,
        stiffness: 200,
      }).start();
    }
  };

  const handlePress = useCallback(
    async (notification: NotificationResponse) => {
      if (!notification.read) {
        try {
          await markAsReadMutation.mutateAsync(notification.id);
        } catch (error) {
          return;
        }
      }

      switch (notification.type) {
        case "LOW_BALANCE":
          // router.push('/accounts');
          break;
        case "BUDGET_EXCEEDED":
        case "BUDGET_WARNING":
          router.push("/budgets");
          break;
        case "BILL_DUE":
          if (notification.data?.billId) {
            // router.push(`/bills/${notification.data.billId}`);
          } else {
            // router.push('/bills');
          }
          break;
        case "GOAL_ACHIEVED":
          // router.push('/goals');
          break;
        case "SYSTEM":
        default:
          break;
      }
    },
    [markAsReadMutation, router],
  );

  const handleMarkRead = useCallback(
    async (id: string) => {
      try {
        await markAsReadMutation.mutateAsync(id);
        const anim = swipeAnimations.current[id];
        if (anim) {
          Animated.spring(anim, {
            toValue: 0,
            useNativeDriver: true,
            damping: 15,
            mass: 0.8,
            stiffness: 200,
          }).start();
        }
      } catch (error) {
        // Error is handled by the mutation's onError
      }
    },
    [markAsReadMutation],
  );
  const handleDeletePress = useCallback((id: string) => {
    setSelectedNotificationId(id);
    deleteModalRef.current?.present();
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedNotificationId) return;
    try {
      await deleteNotificationMutation.mutateAsync(selectedNotificationId);
      const anim = swipeAnimations.current[selectedNotificationId];
      if (anim) {
        Animated.spring(anim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 15,
          mass: 0.8,
          stiffness: 200,
        }).start();
      }
      deleteModalRef.current?.dismiss();
      setSelectedNotificationId(null);
    } catch (error) {
      // Error is handled by the mutation's onError
    }
  }, [selectedNotificationId, deleteNotificationMutation]);

  const handleCancelDelete = useCallback(() => {
    deleteModalRef.current?.dismiss();
    setSelectedNotificationId(null);
  }, []);

  const handleMarkAllPress = useCallback(() => {
    if (unreadCount === 0) {
      toast.info("No unread notifications");
      return;
    }
    markAllModalRef.current?.present();
  }, [unreadCount, toast]);

  const handleConfirmMarkAll = useCallback(async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
      markAllModalRef.current?.dismiss();
    } catch (error) {
      // Error is handled by the mutation's onError
    }
  }, [markAllAsReadMutation]);

  const handleCancelMarkAll = useCallback(() => {
    markAllModalRef.current?.dismiss();
  }, []);

  const groupNotifications = useCallback(() => {
    const groups: { title: string; data: NotificationResponse[] }[] = [];
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayItems = notifications.filter((n) => {
      const date = new Date(n.created_at);
      return date.toDateString() === today.toDateString();
    });

    const yesterdayItems = notifications.filter((n) => {
      const date = new Date(n.created_at);
      return date.toDateString() === yesterday.toDateString();
    });

    const olderItems = notifications.filter((n) => {
      const date = new Date(n.created_at);
      return date < yesterday;
    });

    if (todayItems.length > 0) {
      groups.push({ title: "TODAY", data: todayItems });
    }
    if (yesterdayItems.length > 0) {
      groups.push({ title: "YESTERDAY", data: yesterdayItems });
    }
    if (olderItems.length > 0) {
      groups.push({ title: "OLDER", data: olderItems });
    }

    return groups;
  }, [notifications]);

  const getIconColor = (type: NotificationType) => {
    const colorMap = TYPE_COLORS[type];
    switch (colorMap?.icon) {
      case "error":
        return colors.status.error.main;
      case "success":
        return colors.status.success.main;
      case "warning":
        return colors.status.warning.main;
      default:
        return colors.primary.main;
    }
  };

  const getIconBackground = (type: NotificationType) => {
    const colorMap = TYPE_COLORS[type];
    switch (colorMap?.bg) {
      case "error":
        return colors.status.error.surface;
      case "success":
        return colors.status.success.surface;
      case "warning":
        return colors.status.warning.surface;
      case "surface":
        return colors.background.surfaceAlt;
      default:
        return colors.primary.soft;
    }
  };

  const formatNotificationTime = (date: Date, groupTitle: string) => {
    if (groupTitle === "OLDER") return format(date, "MMM d");
    return format(date, "h:mm a");
  };

  const renderSwipeableItem = ({
    item,
    groupTitle,
  }: {
    item: NotificationResponse;
    groupTitle: string;
  }) => {
    const iconName = TYPE_ICON[item.type] ?? "notifications";
    const translateX = getAnimation(item.id);
    const isRead = item.read;

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 5,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx < 0) {
          translateX.setValue(Math.max(gesture.dx, -140));
        }
      },
      onPanResponderRelease: (_, gesture) => {
        handleSwipe(item.id, gesture.dx);
      },
    });

    const iconColor = getIconColor(item.type);
    const iconBg = getIconBackground(item.type);

    return (
      <View style={styles.notificationWrapper}>
        {/* Swipe Actions */}
        <View
          style={[
            styles.swipeActions,
            { backgroundColor: colors.background.surfaceAlt },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.swipeActionBtn,
              {
                backgroundColor: item.read
                  ? colors.background.screen
                  : colors.secondary.soft,
              },
            ]}
            onPress={() => handleMarkRead(item.id)}
            disabled={item.read || markAsReadMutation.isPending}
          >
            <MaterialIcons
              name="mark-email-read"
              size={19}
              color={
                item.read || markAsReadMutation.isPending
                  ? colors.text.muted
                  : colors.secondary.main
              }
            />
            <Text
              style={[
                styles.swipeActionText,
                {
                  color:
                    item.read || markAsReadMutation.isPending
                      ? colors.text.muted
                      : colors.secondary.main,
                },
              ]}
            >
              {markAsReadMutation.isPending ? "..." : "Read"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.swipeActionBtn,
              styles.swipeDeleteBtn,
              { backgroundColor: colors.status.error.surface },
            ]}
            onPress={() => handleDeletePress(item.id)}
            disabled={deleteNotificationMutation.isPending}
          >
            <MaterialIcons
              name="delete"
              size={19}
              color={
                deleteNotificationMutation.isPending
                  ? colors.text.muted
                  : colors.status.error.main
              }
            />
            <Text
              style={[
                styles.swipeActionText,
                {
                  color: deleteNotificationMutation.isPending
                    ? colors.text.muted
                    : colors.status.error.main,
                },
              ]}
            >
              {deleteNotificationMutation.isPending ? "..." : "Delete"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Foreground Content */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.notificationContent,
            {
              backgroundColor: isRead
                ? colors.background.surface
                : colors.background.surfaceAlt,
              transform: [{ translateX }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.notificationTouchable}
            onPress={() => handlePress(item)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.notificationIconWrap,
                { backgroundColor: iconBg, opacity: isRead ? 0.6 : 1 },
              ]}
            >
              <MaterialIcons name={iconName} size={20} color={iconColor} />
            </View>

            <View style={[styles.notificationBody, isRead && { opacity: 0.8 }]}>
              <Text
                style={[
                  styles.notificationTitle,
                  { color: colors.text.primary },
                  !isRead && styles.notificationTitleUnread,
                ]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text
                style={[
                  styles.notificationMessage,
                  { color: colors.text.secondary },
                ]}
                numberOfLines={1}
              >
                {item.body}
              </Text>
            </View>

            <View style={styles.notificationMeta}>
              <Text
                style={[
                  styles.notificationTime,
                  { color: colors.text.secondary },
                  isRead && { opacity: 0.8 },
                ]}
              >
                {formatNotificationTime(new Date(item.created_at), groupTitle)}
              </Text>
              {!isRead && (
                <View
                  style={[
                    styles.unreadDot,
                    { backgroundColor: colors.primary.main },
                  ]}
                />
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const renderGroup = ({
    item,
  }: {
    item: { title: string; data: NotificationResponse[] };
  }) => (
    <View style={styles.group}>
      <Text
        style={[
          styles.groupTitle,
          {
            color: colors.text.muted,
            borderBottomColor: colors.border.default,
          },
        ]}
      >
        {item.title}
      </Text>
      <View
        style={[
          styles.groupList,
          {
            borderColor: colors.border.default,
            backgroundColor: colors.background.surface,
          },
        ]}
      >
        {item.data.map((notification, index) => (
          <View key={notification.id}>
            {renderSwipeableItem({
              item: notification,
              groupTitle: item.title,
            })}
            {index < item.data.length - 1 && (
              <View
                style={[
                  styles.itemDivider,
                  { backgroundColor: colors.border.default },
                ]}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );

  // Loading State
  if (isPending) {
    return (
      <SafeArea>
        <Header title="Notifications" desc="Stay on top of your finances" />
        <View style={styles.container}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={{ marginBottom: 12 }}>
              <Skeleton width="100%" height={72} borderRadius={12} />
            </View>
          ))}
        </View>
      </SafeArea>
    );
  }

  // Error State
  if (error) {
    return (
      <SafeArea>
        <Header title="Notifications" desc="Stay on top of your finances" />
        <ErrorState
          error={error}
          title="Could not load notifications"
          message="Please check your connection and try again."
          onRetry={refetch}
        />
      </SafeArea>
    );
  }

  const groups = groupNotifications();

  return (
    <SafeArea>
      <Header
        title="Notifications"
        rightContent={
          unreadCount > 0 && (
            <TouchableOpacity
              onPress={handleMarkAllPress}
              disabled={markAllAsReadMutation.isPending}
            >
              <MaterialIcons
                name="more-vert"
                size={22}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          )
        }
      />

      <View style={styles.summaryRow}>
        <Text style={[styles.summaryText, { color: colors.text.secondary }]}>
          {unreadCount > 0
            ? `${unreadCount} UNREAD NOTIFICATION${unreadCount === 1 ? "" : "S"}`
            : "YOU'RE ALL CAUGHT UP"}
        </Text>
      </View>

      <FlatList
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        data={groups}
        keyExtractor={(item) => item.title}
        renderItem={renderGroup}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={{ paddingVertical: 16 }}>
              <Skeleton width="100%" height={72} borderRadius={12} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View
              style={[
                styles.emptyIconWrap,
                { backgroundColor: colors.background.surface },
              ]}
            >
              <MaterialIcons
                name="notifications-none"
                size={40}
                color={colors.text.secondary}
              />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
              No notifications yet
            </Text>
            <Text
              style={[styles.emptySubtitle, { color: colors.text.secondary }]}
            >
              We'll let you know when there's something worth your attention.
            </Text>
          </View>
        }
      />

      <ActionModal
        modalRef={deleteModalRef}
        title="Delete notification?"
        message="This notification will be permanently removed. This action can't be undone."
        icon="delete"
        iconColor={colors.status.error.main}
        iconBackgroundColor={colors.status.error.surface}
        snapPoint="40%"
      >
        <Button
          title="Delete"
          variant="danger"
          appearance="solid"
          loading={deleteNotificationMutation.isPending}
          disabled={deleteNotificationMutation.isPending}
          onPress={handleConfirmDelete}
        />
        <Button
          title="Cancel"
          variant="tertiary"
          appearance="outline"
          disabled={deleteNotificationMutation.isPending}
          onPress={handleCancelDelete}
        />
      </ActionModal>

      <ActionModal
        modalRef={markAllModalRef}
        title="Mark all as read?"
        message={`This will mark all ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"} as read.`}
        icon="done-all"
        iconColor={colors.primary.main}
        iconBackgroundColor={colors.primary.soft}
        snapPoint="40%"
      >
        <Button
          title="Mark all as read"
          variant="primary"
          appearance="solid"
          loading={markAllAsReadMutation.isPending}
          disabled={markAllAsReadMutation.isPending}
          onPress={handleConfirmMarkAll}
        />
        <Button
          title="Cancel"
          variant="tertiary"
          appearance="outline"
          disabled={markAllAsReadMutation.isPending}
          onPress={handleCancelMarkAll}
        />
      </ActionModal>
    </SafeArea>
  );
};

export default NotificationsScreen;
