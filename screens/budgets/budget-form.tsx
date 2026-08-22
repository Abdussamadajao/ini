import { useIncomeTransactions } from "@/actions";
import { FormikAmountField, FormikDatePicker } from "@/components/form";
import {
  Button,
  ErrorState,
  FormHeader,
  FormikCategorySelect,
  SafeArea,
  SegmentedTabs,
} from "@/components/shared";
import { Skeleton } from "@/components/shared/skeleton";
import { FormikIncomeSourceSelect } from "@/components/shared/income-select";
import {
  BudgetRequestItem,
  BudgetsRequest,
  IncomeTransaction,
  SourceItem,
} from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { Formik, FormikProps } from "formik";
import React, { useMemo } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import * as Yup from "yup";
import { useBudgetFormStyles } from "./styles";

interface BudgetFormProps {
  initialData?: BudgetRequestItem[];
  onSubmit: (data: BudgetsRequest) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  isFetching?: boolean;
  error?: unknown;
  onRetry?: () => void;
  submitButtonText?: string;
  title?: string;
  mode?: "create" | "edit";
}

// Yup Validation Schema for array of budgets
const BudgetValidationSchema = Yup.array().of(
  Yup.object().shape({
    category_id: Yup.string().required("Category is required"),
    income_id: Yup.string().required("Income source is required"),
    amount: Yup.number()
      .required("Budget amount is required")
      .positive("Amount must be greater than 0"),
    period: Yup.string()
      .oneOf(
        ["MONTHLY", "WEEKLY", "YEARLY", "CUSTOM"] as const,
        "Invalid period",
      )
      .required("Period is required"),
    start_date: Yup.string().required("Start date is required"),
  }),
);

const createEmptyBudget = (): BudgetRequestItem => ({
  category_id: "",
  income_id: "",
  amount: 0,
  period: "MONTHLY",
  start_date: new Date().toISOString(),
});

const initialValues: BudgetRequestItem[] = [createEmptyBudget()];

export function BudgetForm({
  initialData,
  onSubmit,
  isLoading = false,
  isFetching = false,
  error,
  onRetry,
  submitButtonText,
  title,
  mode = "create",
}: BudgetFormProps) {
  const styles = useBudgetFormStyles();
  const { data: incomeTxResponse } = useIncomeTransactions();

  const isCreateMode = mode === "create";

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

  // Error State — data (e.g. the budget being edited) failed to load
  if (error) {
    return (
      <SafeArea>
        <FormHeader title={getTitle()} />
        <ErrorState
          error={error}
          title="Could not load budget"
          message="Please check your connection and try again."
          onRetry={onRetry}
        />
      </SafeArea>
    );
  }

  if (isFetching) {
    return (
      <SafeArea>
        <FormHeader title={getTitle()} />
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.budgetCard}>
            <View style={styles.section}>
              <Skeleton width={140} height={40} borderRadius={8} />
            </View>

            <View style={styles.section}>
              <Skeleton width={90} height={11} />
              <Skeleton
                width="100%"
                height={56}
                borderRadius={12}
                style={{ marginTop: 8 }}
              />
            </View>

            <View style={styles.section}>
              <Skeleton width={110} height={11} />
              <Skeleton
                width="100%"
                height={56}
                borderRadius={12}
                style={{ marginTop: 8 }}
              />
            </View>

            <View style={styles.section}>
              <Skeleton width={60} height={11} />
              <Skeleton
                width="100%"
                height={44}
                borderRadius={12}
                style={{ marginTop: 8 }}
              />
            </View>

            <View style={styles.section}>
              <Skeleton width={80} height={11} />
              <Skeleton
                width="100%"
                height={44}
                borderRadius={12}
                style={{ marginTop: 8 }}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Skeleton width="100%" height={48} borderRadius={12} />
        </View>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <Formik
        enableReinitialize
        initialValues={
          isCreateMode
            ? initialData || initialValues
            : (initialData?.slice(0, 1) ?? initialValues)
        }
        validationSchema={BudgetValidationSchema}
        onSubmit={(values) => {
          onSubmit({ budgets: values });
        }}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({
          handleSubmit,
          setFieldValue,
          setValues,
          values,
          errors,
          touched,
          isValid,
          dirty,
        }: FormikProps<BudgetRequestItem[]>) => (
          <>
            <FormHeader title={getTitle()} />
            <ScrollView
              style={styles.container}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.contentContainer}
            >
              {values.map((budget, index) => (
                <View key={index} style={styles.budgetCard}>
                  {isCreateMode && (
                    <View style={styles.budgetHeader}>
                      <Text style={styles.budgetTitle}>Budget {index + 1}</Text>
                      {index > 0 && (
                        <TouchableOpacity
                          onPress={() => {
                            const newValues = [...values];
                            newValues.splice(index, 1);
                            setValues(newValues);
                          }}
                          style={styles.removeButton}
                        >
                          <MaterialIcons
                            name="delete"
                            size={24}
                            color="#ef4444"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

                  <View style={styles.section}>
                    <FormikAmountField name={`${index}.amount`} />
                    {touched[index]?.amount && (
                      <Text style={styles.errorText}>
                        {errors[index]?.amount}
                      </Text>
                    )}
                  </View>

                  <View style={styles.section}>
                    <FormikCategorySelect
                      name={`${index}.category_id`}
                      categoryType="EXPENSE"
                      placeholder="Select a category"
                      required={true}
                    />
                  </View>

                  <View style={styles.section}>
                    <FormikIncomeSourceSelect
                      name={`${index}.income_id`}
                      label="Income Source"
                      placeholder="Select income source"
                      modalTitle="Choose Income Source"
                      required={true}
                      sources={incomeSources}
                      showProgress={true}
                    />
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Period</Text>
                    <SegmentedTabs
                      tabs={["MONTHLY", "WEEKLY", "YEARLY"] as const}
                      activeTab={budget.period}
                      onTabChange={(tab) => {
                        setFieldValue(`${index}.period`, tab);
                      }}
                      style={{
                        paddingHorizontal: 1,
                      }}
                    />
                    {touched[index]?.period && (
                      <Text style={styles.errorText}>
                        {errors[index]?.period}
                      </Text>
                    )}
                  </View>

                  <View style={styles.section}>
                    <FormikDatePicker
                      name={`${index}.start_date`}
                      label="Start Date"
                    />
                    {touched[index]?.start_date && (
                      <Text style={styles.errorText}>
                        {errors[index]?.start_date}
                      </Text>
                    )}
                  </View>
                </View>
              ))}

              {isCreateMode && (
                <TouchableOpacity
                  style={styles.addBudgetButton}
                  onPress={() => {
                    const newValues = [...values, createEmptyBudget()];
                    setValues(newValues);
                  }}
                >
                  <MaterialIcons name="add-circle" size={24} color="#3b82f6" />
                  <Text style={styles.addBudgetText}>Add Another Budget</Text>
                </TouchableOpacity>
              )}
            </ScrollView>

            <View style={styles.footer}>
              <Button
                title={getSubmitButtonText()}
                onPress={handleSubmit as any}
                disabled={isLoading || !isValid || !dirty}
                loading={isLoading}
              />
            </View>
          </>
        )}
      </Formik>
    </SafeArea>
  );
}
