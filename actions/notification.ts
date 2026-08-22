// actions/notifications.ts
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance as api } from "@/lib";
import { NotificationFilters, NotificationsResponse } from "@/types";
import { useToast } from "@/components/toasts";

const NOTIFICATIONS_KEY = ["notifications"];

export function useNotifications(filters: NotificationFilters = {}) {
  return useInfiniteQuery({
    queryKey: [...NOTIFICATIONS_KEY, filters],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<NotificationsResponse>(
        "/api/notifications",
        {
          params: {
            ...filters,
            page: pageParam,
            pageSize: filters.pageSize ?? 20,
          },
        },
      );
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.pageCount
        ? lastPage.meta.page + 1
        : undefined,
  });
}

export function useNotificationMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/api/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
      toast.success("Notification marked as read");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to mark notification as read";
      toast.error(message);
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => api.patch("/api/notifications"),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
      const count = response?.data?.data?.count || 0;
      toast.success(`All ${count} notifications marked as read`);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        "Failed to mark all notifications as read";
      toast.error(message);
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
      toast.success("Notification deleted");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to delete notification";
      toast.error(message);
    },
  });

  return {
    markAsReadMutation,
    markAllAsReadMutation,
    deleteNotificationMutation,
  };
}
