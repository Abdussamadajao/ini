import React from "react";

import { useRouter, useLocalSearchParams } from "expo-router";

import { useBudget, useBudgetMutation } from "@/actions/budgets";
import { BudgetForm } from "@/screens/budgets/budget-form";
import { BudgetRequestItem, BudgetsRequest } from "@/types";

export default function EditBudgetScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: budget,
    isPending: isBudgetLoading,
    isError,
    error: budgetError,
    refetch,
  } = useBudget(id);
  const { updateBudgetsMutation } = useBudgetMutation();
  const { mutateAsync: updateBudget, isPending } = updateBudgetsMutation;

  const handleSubmit = async (data: BudgetsRequest) => {
    const updated = data.budgets[0];
    if (!updated) return;

    await updateBudget({
      id,
      category_id: updated.category_id,
      income_id: updated.income_id,
      amount: Number(updated.amount),
      period: updated.period,
      start_date: updated.start_date,
    });
    router.back();
  };

  const initialData: BudgetRequestItem[] = budget
    ? [
        {
          category_id: budget.data.category_id,
          income_id: budget.data.income_id,
          amount: budget.data.amount,
          period: budget.data.period,
          start_date: budget.data.start_date,
        },
      ]
    : [];

  return (
    <BudgetForm
      mode="edit"
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
      isLoading={isPending}
      title="Edit Budget"
      submitButtonText="Update Budget"
      isFetching={isBudgetLoading}
      error={isError ? budgetError : undefined}
      onRetry={() => refetch()}
    />
  );
}
