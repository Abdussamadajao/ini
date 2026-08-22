export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  emailVerified: boolean;

  avatarUrl: string | null;
  bio: string | null;
  displayUsername: string | null;
  image: string | null;
  phone: string | null;

  createdAt: Date;
  updatedAt: Date;
}
export type TrendDirection = "up" | "down" | "flat";

export interface FinancialMetrics {
  net_worth: number;
  total_income: number;
  total_expenses: number;
  total_transactions: number;
  custom_categories: number;
  trend: {
    direction: TrendDirection;
    percentage: number;
  };
}

export interface UserStats {
  data: FinancialMetrics;
}

enum ActivityType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: ActivityType;
}

interface UserActivity {
  id: string;
  type: ActivityType;
  amount: number;
  source_name: string;
  category: Category;
  recorded_at: string;
}

export interface UserActivityResponse {
  data: UserActivity[];
}
