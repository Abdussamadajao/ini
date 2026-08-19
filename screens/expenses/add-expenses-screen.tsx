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
    try {
      const category_id =
        values.trackMode === "income" ? values.categoryId : "";
      const income_id =
        values.trackMode === "income" ? values.sourceId : undefined;

      await createTransaction.mutateAsync({
        type: "EXPENSE",
        amount: parseFloat(values.amount),
        category_id,
        income_id,
        recorded_at: values.date,
        notes: values.notes || undefined,
        receipt_url: values.receiptUrl || undefined,
      });

      resetForm();
      router.back();
    } catch (error) {
      console.error("Error creating expense:", error);
    }
  };

  return (
    <ExpenseForm
      title="Add Expense"
      submitLabel="Save Expense"
      initialValues={initialValues}
      onSubmit={handleSubmit}
    />
  );
}
