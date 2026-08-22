import {
  BudgetFilters,
  BudgetPeriod,
  PeriodTab,
  TransactionFilters,
} from "@/types";

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

export const budgetKeys = {
  all: ["budgets"] as const,
  lists: () => [...budgetKeys.all, "list"] as const,
  list: (filters?: BudgetFilters) => [...budgetKeys.lists(), filters] as const,
  details: () => [...budgetKeys.all, "detail"] as const,
  detail: (id: string) => [...budgetKeys.details(), id] as const,
  statistics: () => [...budgetKeys.all, "statistics"] as const,
  archived: () => [...budgetKeys.all, "archived"] as const,
  active: () => [...budgetKeys.all, "active"] as const,
  byCategory: (categoryId: string) =>
    [...budgetKeys.all, "category", categoryId] as const,
  byPeriod: (period: BudgetPeriod) =>
    [...budgetKeys.all, "period", period] as const,
};

export const userKeys = {
  all: ["user"] as const,
  stats: () => [...userKeys.all, "stats"] as const,
};
