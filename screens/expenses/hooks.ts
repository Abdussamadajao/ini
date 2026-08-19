import { useIncomeTransactions } from "@/actions";
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

// Dummy placeholder data for the Budget tab. Swap this out once budgets are
// wired to a real endpoint (e.g. useBudgets()) — shape matches SourceItem
// so the rest of this screen doesn't need to change.
export const DUMMY_BUDGETS: SourceItem[] = [
  {
    id: "budget-groceries",
    label: "Groceries Budget",
    icon: "shopping-cart",
    categoryId: "cat-groceries",
    remaining: 42000,
    total: 80000,
  },
  {
    id: "budget-transport",
    label: "Transport Budget",
    icon: "directions-car",
    categoryId: "cat-transport",
    remaining: 15000,
    total: 30000,
  },
  {
    id: "budget-entertainment",
    label: "Entertainment Budget",
    icon: "movie",
    categoryId: "cat-entertainment",
    remaining: 8000,
    total: 20000,
  },
];

export function useExpenseSources() {
  const { data: incomeTxResponse } = useIncomeTransactions();

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

  return { incomeSources, budgetSources: DUMMY_BUDGETS };
}
