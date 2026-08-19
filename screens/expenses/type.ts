import { MaterialIcons } from "@expo/vector-icons";
import { FormikHelpers } from "formik";

export type TrackMode = "income" | "budget";

export type ExpenseFormValues = {
  amount: string;
  categoryId: string;
  date: string;
  notes: string;
  sourceId: string;
  receiptUrl: string;
  trackMode: TrackMode;
};

export type SourceItem = {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  categoryId: string;
  remaining: number;
  total: number;
};

export type ExpenseFormProps = {
  title: string;
  submitLabel: string;
  initialValues: ExpenseFormValues;
  onSubmit: (
    values: ExpenseFormValues,
    helpers: FormikHelpers<ExpenseFormValues>,
  ) => void | Promise<void>;
};
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
