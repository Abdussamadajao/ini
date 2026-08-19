// types/dashboard.ts
import type { TransactionType } from "./transactions";

export type PeriodTab = "Week" | "Month" | "3M" | "Year";
export interface DashboardCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface DashboardTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  source_name: string;
  recorded_at: string;
  category: DashboardCategory;
  isIncome: boolean;
}

export interface DashboardChartPoint {
  date: string;
  income: number;
  expense: number;
}

export interface NetWorth {
  total: number;
  total_income: number;
  total_expenses: number;
}

export interface DashboardPeriod {
  label: string;
  from: string;
  to: string;
  income: number;
  expenses: number;
  savings: number;
  savings_rate: number;
}

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface BudgetItem {
  id: string;
  category: BudgetCategory;
  amount: number;
  spent: number;
  remaining: number;
  percentage: number;
  period: "WEEKLY" | "MONTHLY" | "YEARLY";
  start_date: string;
  is_over_budget: boolean;
}

export interface BudgetSummary {
  total_budget: number;
  total_spent: number;
  total_remaining: number;
  overall_percentage: number;
  is_overall_over_budget: boolean;
}

export interface Budgets {
  items: BudgetItem[];
  summary: BudgetSummary;
}

export interface DashboardData {
  net_worth: NetWorth;
  period: DashboardPeriod;
  recent: DashboardTransaction[];
  chart: DashboardChartPoint[];
  budgets: Budgets;
}

export interface DashboardResponse {
  data: DashboardData;
}
