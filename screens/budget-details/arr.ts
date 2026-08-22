import type { BudgetApiItem } from "@/types";

export type BudgetDetailSummary = {
  id: string;
  name: string;
  icon: string;
  total: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: "healthy" | "warning" | "danger";
};

export function mapBudgetToDetailSummary(
  response: BudgetApiItem,
): BudgetDetailSummary {
  const budget = response.data;
  const percentage = Number(budget.percent_used);

  const status: BudgetDetailSummary["status"] =
    percentage > 100 ? "danger" : percentage >= 80 ? "warning" : "healthy";

  return {
    id: budget.id,
    name: budget.category.name,
    icon: budget.category.icon,
    total: Number(budget.amount),
    spent: Number(budget.spent),
    remaining: Number(budget.remaining),
    percentage,
    status,
  };
}
