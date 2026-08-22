// Budget period types
export type BudgetPeriod = "WEEKLY" | "MONTHLY" | "YEARLY";

// Single budget item in the request
export interface BudgetRequestItem {
  category_id: string;
  income_id: string;
  amount: number;
  period: BudgetPeriod;
  start_date: string; // ISO 8601 date string
}

// Complete budgets request payload
export interface BudgetsRequest {
  budgets: BudgetRequestItem[];
}

export interface CreateBudgetRequest {
  category_id: string;
  income_id: string;
  amount: number;
  period: BudgetPeriod;
  start_date: string;
}

// Update budget request
export interface UpdateBudgetRequest extends Partial<CreateBudgetRequest> {
  id: string;
}

// Delete budget request
export interface DeleteBudgetRequest {
  id: string;
}

// Full category record as returned by Prisma (not the trimmed shape)
export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string | null;
  type: "INCOME" | "EXPENSE";
  is_system: boolean;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

// The linked income transaction — a full Transaction record, no nested category
export interface BudgetIncome {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  category_id: string;
  user_id: string;
  income_id: string | null;
  budget_id: string | null;
  source_name: string | null;
  notes: string | null;
  receipt_url: string | null;
  tag: string | null;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

export interface BudgetResponse {
  id: string;
  user_id: string;
  category_id: string;
  category: BudgetCategory;
  income_id: string;
  income: BudgetIncome;
  amount: number;
  period: BudgetPeriod;
  start_date: string;
  is_archived: boolean;
  is_over_budget: boolean;
  archived_at: string | null;
  spent: number;
  remaining: number;
  percent_used: number;
  period_start: string;
  period_end: string;
  created_at: string;
  updated_at: string;
}

// Aggregate roll-up returned alongside the budget list
export interface BudgetsSummary {
  total_budget: number;
  total_spent: number;
  total_remaining: number;
  overall_percentage: number;
  is_overall_over_budget: boolean;
}

export interface BudgetsResponse {
  data: BudgetResponse[];
  summary: BudgetsSummary;
}

export interface BudgetApiItem {
  data: BudgetResponse;
}

export interface BudgetFilters {
  period?: BudgetPeriod;
  income_id?: string;
  category_id?: string;
  archived?: string;
}

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

// A single transaction as returned within a budget's transaction list
export interface BudgetTransaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  source_name: string | null;
  notes: string | null;
  tag: string | null;
  recorded_at: string;
  created_at: string;
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
    type: "INCOME" | "EXPENSE";
  };
}

// Extends BudgetResponse (from budget-types.ts) with the transaction list
// and BudgetDetailSummary that the single-budget GET route now returns
export interface BudgetDetailResponse {
  data: {
    id: string;
    user_id: string;
    category_id: string;
    category: {
      id: string;
      name: string;
      icon: string;
      color: string;
      description: string | null;
      type: "INCOME" | "EXPENSE";
      is_system: boolean;
      user_id: string | null;
      created_at: string;
      updated_at: string;
    };
    income_id: string;
    income: {
      id: string;
      type: "INCOME" | "EXPENSE";
      amount: number;
      category_id: string;
      user_id: string;
      income_id: string | null;
      budget_id: string | null;
      source_name: string | null;
      notes: string | null;
      receipt_url: string | null;
      tag: string | null;
      recorded_at: string;
      created_at: string;
      updated_at: string;
    };
    amount: number;
    period: "WEEKLY" | "MONTHLY" | "YEARLY";
    start_date: string;
    is_archived: boolean;
    is_over_budget: boolean;
    archived_at: string | null;
    transactions: BudgetTransaction[];
    spent: number;
    remaining: number;
    percent_used: number;
    period_start: string;
    period_end: string;
    summary: BudgetDetailSummary;
    created_at: string;
    updated_at: string;
  };
}
