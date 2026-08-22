import { useTransactionMutation } from "@/actions";
import { router } from "expo-router";
import { FormikHelpers } from "formik";
import React from "react";
import ExpenseForm from "./expenses-form";
import { ExpenseFormValues } from "./type";

export function AddExpensesScreen() {
  const { createTransaction } = useTransactionMutation();

  const initialValues: ExpenseFormValues = {
    amount: "",
    categoryId: "",
    date: new Date().toISOString(),
    notes: "",
    sourceId: "",
    receiptUrl: "",
    trackMode: "income",
  };

  const handleSubmit = async (
    values: ExpenseFormValues,
    { resetForm }: FormikHelpers<ExpenseFormValues>,
  ) => {
    await createTransaction.mutateAsync({
      type: "EXPENSE",
      amount: parseFloat(values.amount),
      category_id: values.categoryId,
      ...(values.trackMode === "income"
        ? { income_id: values.sourceId }
        : { budget_id: values.sourceId }),
      recorded_at: values.date,
      notes: values.notes || undefined,
      receipt_url: values.receiptUrl || undefined,
    });

    resetForm();
    router.back();
  };

  return (
    <ExpenseForm
      title="Add Expense"
      submitLabel="Save Expense"
      initialValues={initialValues}
      onSubmit={handleSubmit}
      loading={createTransaction.isPending}
    />
  );
}
