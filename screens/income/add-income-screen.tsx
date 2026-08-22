import { useCategories, useTransactionMutation } from "@/actions";
import { useToast } from "@/components/toasts";
import { router } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { IncomeFormView } from "./income-form-view";
import type { IncomeFormValues } from "./income-form";

export function AddIncomeScreen() {
  const { toast } = useToast();
  const { createTransaction: createTransactionMutation } =
    useTransactionMutation();
  const { mutateAsync: createTransaction, isPending } =
    createTransactionMutation;

  const initialValues: IncomeFormValues = {
    amount: "",
    sourceName: "",
    categoryId: "",
    tag: "Monthly",
    date: new Date(),
    notes: "",
  };

  const handleSubmit = useCallback(
    async (values: IncomeFormValues) => {
      await createTransaction({
        amount: parseFloat(values.amount.replace(/,/g, "")),
        source_name: values.sourceName,
        category_id: values.categoryId,
        recorded_at: values.date.toISOString(),
        notes: values.notes ?? undefined,
        tag: values.tag,
        type: "INCOME",
      });

      router.back();
    },
    [createTransaction, toast],
  );

  return (
    <IncomeFormView
      headerTitle="Add Income"
      summaryLabel="YOU'RE ADDING"
      submitLabel="Save Income"
      initialValues={initialValues}
      isSubmitting={isPending}
      onSubmit={handleSubmit}
    />
  );
}
