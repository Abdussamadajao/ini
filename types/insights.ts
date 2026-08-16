export interface InsightsPeriod {
  label: string;
  from: string;
  to: string;
}

export interface InsightsSummary {
  income: number;
  expenses: number;
  savings: number;
  savings_rate: number;
}

export interface InsightsComparison {
  income_change: number;
  expense_change: number;
  savings_change: number;
  prev_income: number;
  prev_expenses: number;
  prev_savings: number;
}

export interface CategoryBreakdown {
  category_id: string;
  name: string;
  icon: string;
  color: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface IncomeSource {
  id: string;
  source_name: string;
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
    type: "INCOME";
  };
  amount: number;
  spent: number;
  remaining: number;
  percentage: number;
  recorded_at: string;
}

export interface InsightsData {
  period: InsightsPeriod;
  summary: InsightsSummary;
  comparison: InsightsComparison;
  spending_by_category: CategoryBreakdown[];
  income_by_category: CategoryBreakdown[];
  income_sources: IncomeSource[];
  observations: string[];
}

export interface InsightsResponse {
  data: InsightsData;
}
