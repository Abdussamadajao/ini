import type { TransactionType } from "./transactions";

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

export interface DashboardData {
  net_worth: NetWorth;
  period: DashboardPeriod;
  recent: DashboardTransaction[];
  chart: DashboardChartPoint[];
}

export interface DashboardResponse {
  data: DashboardData;
}
