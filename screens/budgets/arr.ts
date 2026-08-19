export const activeBudgets: Budget[] = [
  {
    id: "1",
    name: "Food",
    icon: "restaurant",
    spent: 31500,
    total: 45000,
  },
  {
    id: "2",
    name: "Transport",
    icon: "directions-car",
    spent: 18000,
    total: 40000,
  },
  {
    id: "3",
    name: "Entertainment",
    icon: "movie",
    spent: 41500,
    total: 40000,
    isOverBudget: true,
  },
];

export interface Budget {
  id: string;
  name: string;
  icon: string;
  spent: number;
  total: number;
  isOverBudget?: boolean;
}
