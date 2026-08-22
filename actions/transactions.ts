import { useToast } from "@/components/toasts";
import { authClient } from "@/lib/auth-client";
import { axiosInstance } from "@/lib/axios";
import type {
  AnyTransaction,
  CreateBatchTransactionBody,
  CreateTransactionBody,
  IncomeSummary,
  TransactionFilters,
  TransactionListResponse,
  UpdateTransactionBody,
} from "@/types/index";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { dashboardKeys, transactionKeys, userKeys } from "./key";

// ─── Build query string ───────────────────────────────────────────────────

function buildParams(filters: TransactionFilters): string {
  const p = new URLSearchParams();
  if (filters.type) p.set("type", filters.type);
  if (filters.from) p.set("from", filters.from);
  if (filters.to) p.set("to", filters.to);
  if (filters.categoryIds) p.set("categoryIds", filters.categoryIds);
  if (filters.amountMin) p.set("amountMin", String(filters.amountMin));
  if (filters.amountMax) p.set("amountMax", String(filters.amountMax));
  if (filters.income_id) p.set("income_id", filters.income_id);
  if (filters.budget_id) p.set("budget_id", filters.budget_id);
  if (filters.q) p.set("q", filters.q);
  if (filters.page) p.set("page", String(filters.page));
  if (filters.pageSize) p.set("pageSize", String(filters.pageSize));
  return p.toString();
}

// ─── List transactions ────────────────────────────────────────────────────

export function useTransactions(
  filters: TransactionFilters = {},
  options?: Omit<
    UseQueryOptions<TransactionListResponse>,
    "queryKey" | "queryFn"
  >,
) {
  const hasToken = !!authClient.getCookie();
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: async () => {
      const res = await axiosInstance.get<TransactionListResponse>(
        `/api/transactions?${buildParams(filters)}`,
      );
      return res.data;
    },
    staleTime: 1000 * 30,
    ...options,
    enabled: hasToken && (options?.enabled ?? true),
  });
}

// ─── Infinite list transactions ─────────────────────────────────────────────

export function useInfiniteTransactions(
  filters: Omit<TransactionFilters, "page"> = {},
  pageSize = 20,
) {
  const hasToken = !!authClient.getCookie();
  return useInfiniteQuery({
    queryKey: [...transactionKeys.lists(), "infinite", filters, pageSize],
    queryFn: async ({ pageParam = 1 }) => {
      const params = { ...filters, page: pageParam, pageSize };
      const res = await axiosInstance.get<TransactionListResponse>(
        `/api/transactions?${buildParams(params)}`,
      );
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, pageCount } = lastPage.meta;
      return page < pageCount ? page + 1 : undefined;
    },
    staleTime: 1000 * 30,
    enabled: hasToken,
  });
}

// ─── Income transactions only ─────────────────────────────────────────────

export function useIncomeTransactions(
  filters: Omit<TransactionFilters, "type"> = {},
  options?: Omit<
    UseQueryOptions<TransactionListResponse>,
    "queryKey" | "queryFn"
  >,
) {
  return useTransactions({ ...filters, type: "INCOME" }, options);
}

// ─── Expense transactions only ────────────────────────────────────────────

export function useExpenseTransactions(
  filters: Omit<TransactionFilters, "type"> = {},
) {
  return useTransactions({ ...filters, type: "EXPENSE" });
}

// ─── Expenses linked to a specific income ─────────────────────────────────

export function useExpensesByIncome(
  incomeId: string,
  filters: Omit<TransactionFilters, "type" | "income_id"> = {},
) {
  return useTransactions(
    { ...filters, type: "EXPENSE", income_id: incomeId },
    { enabled: !!incomeId },
  );
}

// ─── Single transaction ───────────────────────────────────────────────────

export function useTransaction(id: string) {
  const hasToken = !!authClient.getCookie();
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: async () => {
      const res = await axiosInstance.get<{ data: AnyTransaction }>(
        `/api/transactions/${id}`,
      );
      return res.data.data;
    },
    enabled: hasToken && !!id,
    staleTime: 1000 * 30,
  });
}

// ─── Income summary (with expenses + spent/remaining) ────────────────────

export function useIncomeSummary(incomeId: string, enabled = true) {
  const hasToken = !!authClient.getCookie();
  return useQuery({
    queryKey: transactionKeys.summary(incomeId),
    queryFn: async () => {
      const res = await axiosInstance.get<{ data: IncomeSummary }>(
        `/api/transactions/income/${incomeId}/summary`,
      );
      return res.data.data;
    },
    enabled: hasToken && !!incomeId && enabled,
    staleTime: 1000 * 30,
  });
}

export function useTransactionMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createTransaction = useMutation({
    mutationFn: async (body: CreateTransactionBody) => {
      const res = await axiosInstance.post<{ data: AnyTransaction }>(
        "/api/transactions",
        body,
      );
      return res.data.data;
    },
    onSuccess: (data) => {
      // invalidate all lists
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
      // if expense tied to income — invalidate that income's summary + detail
      if (data.type === "EXPENSE" && data.income_id) {
        queryClient.invalidateQueries({
          queryKey: transactionKeys.summary(data.income_id),
        });
        queryClient.invalidateQueries({
          queryKey: transactionKeys.detail(data.income_id),
        });
        toast.success("Expense created successfully");
      } else {
        toast.success("Transaction created successfully");
      }
    },
    onError: (error) => {
      const errorMessage = error.message || "Failed to create transaction";
      toast.error(errorMessage);
    },
  });
  const updateTransaction = useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: string;
      body: UpdateTransactionBody;
    }) => {
      if (!authClient.getCookie())
        throw new Error("Please sign in to continue");
      const res = await axiosInstance.patch<{ data: AnyTransaction }>(
        `/api/transactions/${id}`,
        body,
      );
      return res.data.data;
    },
    onSuccess: (data, variables) => {
      const { id } = variables;

      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
      // re-fetch summary if income amount or expenses changed
      if (data.type === "INCOME") {
        queryClient.invalidateQueries({
          queryKey: transactionKeys.summary(id),
        });
      }

      // if expense — re-fetch linked income summary
      if (data.type === "EXPENSE" && data.income_id) {
        queryClient.invalidateQueries({
          queryKey: transactionKeys.summary(data.income_id),
        });
        queryClient.invalidateQueries({
          queryKey: transactionKeys.detail(data.income_id),
        });
      }

      toast.success("Transaction updated successfully");
    },
    onError: (error) => {
      const errorMessage = error.message || "Failed to update transaction";
      toast.error(errorMessage);
    },
  });
  const deleteTransaction = useMutation({
    mutationFn: async ({
      id,
      incomeId,
    }: {
      id: string;
      incomeId?: string; // pass income_id if deleting an expense
    }) => {
      if (!authClient.getCookie())
        throw new Error("Please sign in to continue");
      await axiosInstance.delete(`/api/transactions/${id}`);
      return { id, incomeId };
    },

    onSuccess: ({ id, incomeId }) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.removeQueries({ queryKey: transactionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });

      // if expense — update linked income summary
      if (incomeId) {
        queryClient.invalidateQueries({
          queryKey: transactionKeys.summary(incomeId),
        });
        queryClient.invalidateQueries({
          queryKey: transactionKeys.detail(incomeId),
        });
      }
      toast.success("Transaction deleted successfully");
    },
    onError: (error) => {
      const errorMessage = error.message || "Failed to delete transaction";
      toast.error(errorMessage);
    },
  });

  const createBatchTransaction = useMutation({
    mutationFn: async (body: CreateBatchTransactionBody) => {
      const res = await axiosInstance.post<TransactionListResponse>(
        "/api/transactions/batch",
        body,
      );
      return res.data.data;
    },
    onSuccess: (data) => {
      // invalidate all lists + dashboard summary
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
      // invalidate any income summaries/details linked to expenses in this batch
      const linkedIncomeIds = data
        .filter((t) => t.type === "EXPENSE" && t.income_id)
        .map((t) => t.income_id as string);

      new Set(linkedIncomeIds).forEach((incomeId) => {
        queryClient.invalidateQueries({
          queryKey: transactionKeys.summary(incomeId),
        });
        queryClient.invalidateQueries({
          queryKey: transactionKeys.detail(incomeId),
        });
      });

      toast.success(
        data.length > 1
          ? `${data.length} transactions created successfully`
          : "Transaction created successfully",
      );
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Failed to create transactions";
      toast.error(errorMessage);
    },
  });

  return {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    createBatchTransaction,
  };
}
