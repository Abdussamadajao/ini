import { useIncomeTransactions } from "@/actions";
import { useBudgets } from "@/actions/budgets";
import type { IncomeTransaction } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useMemo } from "react";

export type SourceItem = {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  categoryId: string;
  remaining: number;
  total: number;
};

export function useExpenseSources() {
  const { data: incomeTxResponse, isPending: isIncomeLoading } =
    useIncomeTransactions();
  const { data: budgetTxResponse, isPending: isBudgetLoading } = useBudgets();

  const budgetSources: SourceItem[] = useMemo(() => {
    if (!budgetTxResponse?.data) return [];
    return budgetTxResponse.data.map((budget) => ({
      id: budget.id,
      label: budget.category.name,
      icon: budget.category.icon as keyof typeof MaterialIcons.glyphMap,
      categoryId: budget.category.id,
      remaining: budget.remaining,
      total: budget.amount,
      spent: budget.spent,
      color: budget.category.color,
    }));
  }, [budgetTxResponse]);
  const incomeSources: SourceItem[] = useMemo(() => {
    if (!incomeTxResponse?.data) return [];
    return incomeTxResponse.data
      .filter((tx) => tx.type === "INCOME")
      .map((tx: IncomeTransaction) => ({
        id: tx.id,
        label: tx.source_name || tx.category.name,
        icon: tx.category.icon as keyof typeof MaterialIcons.glyphMap,
        categoryId: tx.category.id,
        remaining: Number(tx.summary.remaining),
        total: Number(tx.amount),
      }));
  }, [incomeTxResponse]);

  return { incomeSources, budgetSources, isBudgetLoading, isIncomeLoading };
}
