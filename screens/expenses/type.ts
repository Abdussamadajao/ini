import { MaterialIcons } from "@expo/vector-icons";
import { FormikHelpers } from "formik";
import * as Yup from "yup";
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
  loading?: boolean;
  isEdit?: boolean;
  error?: unknown;
  onRefresh?: (() => void) | null;
  refreshing?: boolean;
};

export const expenseFormSchema = Yup.object({
  amount: Yup.string()
    .required("Amount is required")
    .test("positive", "Amount is required", (v) => {
      const n = parseFloat((v ?? "").replace(/,/g, ""));
      return !Number.isNaN(n) && n > 0;
    }),
  trackMode: Yup.mixed<"income" | "budget">()
    .oneOf(["income", "budget"])
    .required(),
  sourceId: Yup.string().when("trackMode", {
    is: "income",
    then: (schema) => schema.required("Income source is required"),
    otherwise: (schema) => schema.required("Budget is required"),
  }),
  categoryId: Yup.string().when("trackMode", {
    is: "income",
    then: (schema) => schema.required("Category is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  notes: Yup.string(),
  date: Yup.date().required(),
  receiptUrl: Yup.string().notRequired(),
});
