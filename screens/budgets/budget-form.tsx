import { useIncomeTransactions } from "@/actions";
import { FormikAmountField, FormikDatePicker } from "@/components/form";
import {
  Button,
  FormHeader,
  FormikCategorySelect,
  SafeArea,
  SegmentedTabs,
} from "@/components/shared";
import { FormikIncomeSourceSelect } from "@/components/shared/income-select";
import { IncomeTransaction, SourceItem } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import * as Yup from "yup";
import { useBudgetFormStyles } from "./styles";

export interface BudgetFormData {
  id?: string;
  category: string;
  categoryIcon: string;
  incomeSource: string;
  incomeSourceId?: string;
  amount: string;
  period: "Monthly" | "Weekly" | "Custom";
  startDate: Date;
  isEditing?: boolean;
}

interface BudgetFormProps {
  initialData?: Partial<BudgetFormData>;
  onSubmit: (data: BudgetFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitButtonText?: string;
  title?: string;
  mode?: "create" | "edit";
}

// Yup Validation Schema
const BudgetValidationSchema = Yup.object().shape({
  category: Yup.string().required("Category is required"),
  incomeSource: Yup.string().required("Income source is required"),
  incomeSourceId: Yup.string(),
  amount: Yup.string()
    .required("Budget amount is required")
    .test("is-valid-amount", "Please enter a valid amount", (value) => {
      if (!value) return false;
      const numericValue = parseFloat(value.replace(/,/g, ""));
      return numericValue > 0;
    }),
  period: Yup.string()
    .oneOf(["Monthly", "Weekly", "Custom"] as const, "Invalid period")
    .required("Period is required"),
  startDate: Yup.date().required("Start date is required"),
  isEditing: Yup.boolean(),
});

const initialValues: BudgetFormData = {
  category: "Food",
  categoryIcon: "🍔",
  incomeSource: "",
  incomeSourceId: "",
  amount: "0",
  period: "Monthly",
  startDate: new Date(),
  isEditing: false,
};

export function BudgetForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitButtonText,
  title,
  mode = "create",
}: BudgetFormProps) {
  const styles = useBudgetFormStyles();
  const { data: incomeTxResponse } = useIncomeTransactions();

  const getTitle = () => {
    if (title) return title;
    return mode === "edit" ? "Edit budget" : "Create budget";
  };

  const getSubmitButtonText = () => {
    if (submitButtonText) return submitButtonText;
    return mode === "edit" ? "Update budget" : "Create budget";
  };

  const incomeSources: SourceItem[] = useMemo(() => {
    if (!incomeTxResponse?.data) return [];
    return incomeTxResponse.data
      .filter((tx) => tx.type === "INCOME")
      .map((tx: IncomeTransaction) => {
        return {
          id: tx.id,
          label: tx.source_name || tx.category.name,
          icon: tx.category.icon as keyof typeof MaterialIcons.glyphMap,
          categoryId: tx.category.id,
          remaining: Number(tx.summary.remaining),
          total: Number(tx.amount),
          spent: tx.summary?.spent ? Number(tx.summary.spent) : undefined,
          color: tx.category.color,
        };
      });
  }, [incomeTxResponse]);

  return (
    <SafeArea>
      <Formik
        initialValues={{ ...initialValues, ...initialData }}
        validationSchema={BudgetValidationSchema}
        onSubmit={onSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
          isValid,
          dirty,
        }) => (
          <>
            <FormHeader title={getTitle()} />

            <ScrollView
              style={styles.container}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.contentContainer}
            >
              {/* Amount */}
              <View style={styles.section}>
                <FormikAmountField
                  name="amount"
                  //   label="Budget Amount"
                />
              </View>

              {/* Category */}
              <View style={styles.section}>
                <FormikCategorySelect
                  name="category"
                  categoryType="EXPENSE"
                  placeholder="Select a category"
                  required={true}
                />
              </View>

              {/* Income Source */}
              <View style={styles.section}>
                <FormikIncomeSourceSelect
                  name="incomeSourceId"
                  label="Income Source"
                  placeholder="Select income source"
                  modalTitle="Choose Income Source"
                  required={true}
                  sources={incomeSources}
                  showProgress={true}
                  onIncomeChange={(source) => {
                    if (source) {
                      setFieldValue("incomeSource", source.label);
                    }
                  }}
                  onAddCustom={() => {
                    // Navigate to add income source
                    console.log("Add new income source");
                  }}
                />
              </View>

              {/* Period */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Period</Text>
                <SegmentedTabs
                  tabs={["Monthly", "Weekly", "Custom"] as const}
                  activeTab={values.period}
                  onTabChange={(tab) => {
                    setFieldValue("period", tab);
                  }}
                  style={{
                    paddingHorizontal: 1,
                  }}
                />
                {errors.period && touched.period && (
                  <Text style={styles.errorText}>{errors.period}</Text>
                )}
              </View>

              {/* Start Date */}
              <View style={styles.section}>
                <FormikDatePicker name="startDate" label="Start Date" />
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <Button
                onPress={handleSubmit as any}
                disabled={isLoading || !isValid || !dirty}
                loading={isLoading}
              >
                <Text style={styles.submitButtonText}>
                  {getSubmitButtonText()}
                </Text>
              </Button>
            </View>
          </>
        )}
      </Formik>
    </SafeArea>
  );
}
