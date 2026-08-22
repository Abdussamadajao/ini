import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance as axios } from "@/lib";
import {
  BudgetApiItem,
  BudgetDetailResponse,
  BudgetFilters,
  BudgetResponse,
  BudgetsRequest,
  BudgetsResponse,
  UpdateBudgetRequest,
} from "@/types";
import { useToast } from "@/components/toasts";
import { budgetKeys, dashboardKeys, userKeys } from "./key";

export const budgetApi = {
  // Create multiple budgets
  createBudgets: async (data: BudgetsRequest) => {
    const response = await axios.post<{
      success: boolean;
      budgets: BudgetsResponse[];
    }>("/api/budgets", data);
    return response.data;
  },

  // Get all budgets
  getBudgets: async (params: BudgetFilters) => {
    const response = await axios.get<BudgetsResponse>("/api/budgets", {
      params,
    });
    return response.data;
  },

  // Get single budget
  getBudget: async (id: string) => {
    const response = await axios.get<BudgetDetailResponse>(
      `/api/budgets/${id}`,
    );
    return response.data;
  },

  // Update budget
  updateBudget: async ({ id, ...data }: UpdateBudgetRequest) => {
    const response = await axios.patch<BudgetResponse>(
      `/api/budgets/${id}`,
      data,
    );
    return response.data;
  },

  // Delete budget
  deleteBudget: async (id: string) => {
    const response = await axios.delete(`/api/budgets/${id}`);
    return response.data;
  },
  archiveBudget: async (id: string) => {
    const response = await axios.post(`/api/budgets/${id}/archive`);
    return response.data;
  },
  restoreBudget: async (id: string) => {
    const response = await axios.post(`/api/budgets/${id}/restore`);
    return response.data;
  },
};

export function useBudgets(filters?: BudgetFilters | undefined) {
  return useQuery({
    queryKey: budgetKeys.list(filters),
    queryFn: () => budgetApi.getBudgets(filters || {}),
    select: (data) => data,
  });
}

export function useBudget(id: string) {
  return useQuery({
    queryKey: budgetKeys.detail(id),
    queryFn: () => budgetApi.getBudget(id),
    enabled: !!id,
    select: (data) => data,
  });
}

export const useBudgetMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createBudgetsMutation = useMutation({
    mutationFn: async (data: BudgetsRequest) => budgetApi.createBudgets(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      queryClient.invalidateQueries({ queryKey: budgetKeys.statistics() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
      const count = data.budgets?.length ?? 0;
      toast.success(
        count > 1
          ? `${count} budgets created successfully`
          : "Budget created successfully",
      );
    },
    onError: (error) => {
      const errorMessage = error.message || "Failed to create bude";
      toast.error(errorMessage);
    },
  });

  const updateBudgetsMutation = useMutation({
    mutationFn: (data: UpdateBudgetRequest) => budgetApi.updateBudget(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      queryClient.invalidateQueries({
        queryKey: budgetKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.statistics() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
      toast.success("Budgets updated successfully");
    },
    onError: (error) => {
      const errorMessage = error.message || "Failed to update budget";
      toast.error(errorMessage);
    },
  });

  const deleteBudgetsMutation = useMutation({
    mutationFn: (id: string) => budgetApi.deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      queryClient.invalidateQueries({ queryKey: budgetKeys.statistics() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
      toast.success("Budget deleted successfully");
    },
    onError: (error) => {
      const errorMessage = error.message || "Failed to delete budget";
      toast.error(errorMessage);
    },
  });

  const archiveBudgetMutation = useMutation({
    mutationFn: (id: string) => budgetApi.archiveBudget(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.statistics() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.active() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.archived() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });

      toast.success("Budget archived successfully");
    },
    onError: (error) => {
      const errorMessage = error.message || "Failed to archive budget";
      toast.error(errorMessage);
    },
  });
  const restoreBudgetMutation = useMutation({
    mutationFn: (id: string) => budgetApi.restoreBudget(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.statistics() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.active() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.archived() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });

      toast.success("Budget restore successfully");
    },
    onError: (error) => {
      const errorMessage = error.message || "Failed to restore budget";
      toast.error(errorMessage);
    },
  });
  return {
    createBudgetsMutation,
    archiveBudgetMutation,
    restoreBudgetMutation,
    updateBudgetsMutation,
    deleteBudgetsMutation,
  };
};
