import { PeriodTab, TransactionFilters } from "@/types";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  summary: (period?: PeriodTab) =>
    period
      ? ([...dashboardKeys.all, "summary", period] as const)
      : ([...dashboardKeys.all, "summary"] as const),
  insights: () => [...dashboardKeys.all, "insights"] as const,
};

export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: (f: TransactionFilters) => [...transactionKeys.lists(), f] as const,
  details: () => [...transactionKeys.all, "detail"] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
  summaries: () => [...transactionKeys.all, "summary"] as const,
  summary: (id: string) => [...transactionKeys.summaries(), id] as const,
};
