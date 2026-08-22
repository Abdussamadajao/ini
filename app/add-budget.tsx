// app/budgets/create.tsx
import React from "react";

import { useRouter } from "expo-router";
import { BudgetForm } from "@/screens/budgets/budget-form";
import { useToast } from "@/components/toasts";
import { useBudgetMutation } from "@/actions/budgets";
import { BudgetsRequest } from "@/types";

export default function CreateBudgetScreen() {
  const router = useRouter();
  const toast = useToast().toast;
  const { createBudgetsMutation } = useBudgetMutation();
  const { mutateAsync: createBudget, isPending } = createBudgetsMutation;
  const handleSubmit = async (data: BudgetsRequest) => {
    const payload: BudgetsRequest = {
      budgets: data.budgets.map((budget) => ({
        ...budget,
        amount: Number(budget.amount),
      })),
    };

    await createBudget(payload);

    router.push("/budgets");
  };

  return (
    <BudgetForm
      mode="create"
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
      isLoading={isPending}
      title="Create New Budget"
      submitButtonText="Create Budget"
    />
  );
}
