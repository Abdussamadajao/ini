export type NotificationType =
  | "LOW_BALANCE"
  | "BUDGET_EXCEEDED"
  | "BUDGET_WARNING"
  | "BILL_DUE"
  | "GOAL_ACHIEVED"
  | "SYSTEM";

export type NotificationResponse = {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, any>;
  read: boolean;
  created_at: string;
};

export type NotificationsResponse = {
  data: NotificationResponse[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
    unread_count: number;
  };
};

export type NotificationFilters = {
  page?: number;
  pageSize?: number;
  unread_only?: boolean;
};
