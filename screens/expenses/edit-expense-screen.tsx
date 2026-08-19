import { useTransaction, useTransactionMutation } from "@/actions";
import { router, useLocalSearchParams } from "expo-router";
import { FormikHelpers } from "formik";
import React from "react";
import { ExpenseForm, ExpenseFormValues } from "./expenses-form";

export function EditExpenseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: transaction } = useTransaction(id);
  const { updateTransaction } = useTransactionMutation();

  if (!transaction) return null; // or a loading state

  const initialValues: ExpenseFormValues = {
    amount: String(transaction.amount),
    categoryId: transaction.category?.id ?? "",
    date: transaction.recorded_at,
    notes: transaction.notes ?? "",
    sourceId: transaction.income_id ?? "",
    receiptUrl: transaction.receipt_url ?? "",
    trackMode: transaction.income_id ? "income" : "budget",
  };

  const handleSubmit = async (
    values: ExpenseFormValues,
    { resetForm }: FormikHelpers<ExpenseFormValues>,
  ) => {
    try {
      const category_id =
        values.trackMode === "income" ? values.categoryId : "";
      const income_id =
        values.trackMode === "income" ? values.sourceId : undefined;
      await updateTransaction.mutateAsync({
        id: id ?? "",
        body: {
          amount: parseFloat(values.amount),
          category_id,
          income_id,
          recorded_at: values.date,
          notes: values.notes || undefined,
          receipt_url: values.receiptUrl || undefined,
        },
      });

      resetForm();
      router.back();
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  return (
    <ExpenseForm
      title="Edit Expense"
      submitLabel="Update Expense"
      initialValues={initialValues}
      onSubmit={handleSubmit}
    />
  );
}
