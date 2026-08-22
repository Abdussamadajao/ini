import { useIncomeTransactions } from "@/actions";
import { useBudgets } from "@/actions/budgets";
import {
  FormikAmountField,
  FormikDatePicker,
  FormikTextfield,
} from "@/components/form";
import {
  Button,
  CategoryIcon,
  ErrorState,
  FormHeader,
  FormikCategorySelect,
  ReceiptUploadField,
  SafeArea,
  SegmentedTabs,
} from "@/components/shared";
import { Skeleton } from "@/components/shared/skeleton";
import { FormikIncomeSourceSelect } from "@/components/shared/income-select";
import { useTheme } from "@/theme";
import { IncomeTransaction } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useAddExpensesStyles } from "./add-expenses-styles";
import { ExpenseFormProps, SourceItem, expenseFormSchema } from "./type";

const ExpensesForm = ({
  title,
  submitLabel,
  initialValues,
  onSubmit,
  loading,
  isEdit = false,
  error,
  refreshing,
  onRefresh,
}: ExpenseFormProps) => {
  const { colors } = useTheme();
  const styles = useAddExpensesStyles();
  const { data: incomeTxResponse, isPending: isIncomeLoading } =
    useIncomeTransactions();
  const { data: budgetTxResponse, isPending: isBudgetLoading } = useBudgets();

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

  // Budget sources from API
  const budgetSources: SourceItem[] = useMemo(() => {
    if (!budgetTxResponse?.data) return [];
    return budgetTxResponse.data.map((budget) => ({
      id: budget.id,
      label: budget.category.name,
      icon: budget.category.icon as keyof typeof MaterialIcons.glyphMap,
      categoryId: budget.category.id,
      remaining: budget.remaining,
      total: budget.amount,
      spent: budget.spent,
      color: budget.category.color,
    }));
  }, [budgetTxResponse]);

  if (isEdit) {
    return (
      <SafeArea>
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              style={styles.headerBtn}
              hitSlop={8}
            >
              <MaterialIcons
                name="arrow-back"
                size={24}
                color={colors.text.secondary}
              />
            </Pressable>
            <Text style={styles.headerTitle}>{title}</Text>
            <View style={styles.headerBtn} />
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.amountSection}>
              <Skeleton width={160} height={40} borderRadius={8} />
            </View>

            <View style={styles.formContent}>
              <View style={styles.fieldGroup}>
                <Skeleton width={100} height={11} />
                <Skeleton
                  width="100%"
                  height={44}
                  borderRadius={12}
                  style={{ marginTop: 8 }}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Skeleton width={90} height={11} />
                <Skeleton
                  width="100%"
                  height={56}
                  borderRadius={12}
                  style={{ marginTop: 8 }}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Skeleton width={80} height={11} />
                <Skeleton
                  width="100%"
                  height={56}
                  borderRadius={12}
                  style={{ marginTop: 8 }}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Skeleton width={70} height={11} />
                <Skeleton
                  width="100%"
                  height={80}
                  borderRadius={12}
                  style={{ marginTop: 8 }}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Skeleton width={100} height={11} />
                <Skeleton
                  width="100%"
                  height={48}
                  borderRadius={12}
                  style={{ marginTop: 8 }}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Skeleton width={70} height={11} />
                <Skeleton
                  width="100%"
                  height={120}
                  borderRadius={12}
                  style={{ marginTop: 8 }}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeArea>
    );
  }

  // Error State
  if (error) {
    return (
      <SafeArea>
        <FormHeader title={title} />
        <ErrorState
          error={error}
          title="Could not load Transaction"
          message="Please check your connection and try again."
          refreshing={refreshing}
          onRetry={onRefresh!}
        />
      </SafeArea>
    );
  }
  return (
    <SafeArea>
      <Formik
        initialValues={initialValues}
        validationSchema={expenseFormSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ handleSubmit, setFieldValue, values, errors, touched }) => {
          const activeSources =
            values.trackMode === "income" ? incomeSources : budgetSources;
          const selectedSource = activeSources.find(
            (s) => s.id === values.sourceId,
          );

          return (
            <View style={{ flex: 1 }}>
              <FormHeader title={title} />
              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.amountSection}>
                  <Text style={styles.amountLabel}>AMOUNT</Text>
                  <View style={styles.amountRow}>
                    <FormikAmountField name="amount" />
                  </View>
                </View>

                <View style={styles.formContent}>
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>TRACK AGAINST</Text>
                    <SegmentedTabs
                      tabs={["income", "budget"] as const}
                      activeTab={values.trackMode}
                      onTabChange={(tab) => {
                        setFieldValue("trackMode", tab);
                        setFieldValue("sourceId", "");
                        setFieldValue("categoryId", "");
                      }}
                      style={{
                        paddingHorizontal: 1,
                      }}
                    />
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>
                      {values.trackMode === "income"
                        ? "INCOME SOURCE"
                        : "BUDGET"}
                    </Text>

                    {values.trackMode === "income" ? (
                      <FormikIncomeSourceSelect
                        name="sourceId"
                        label=""
                        placeholder="Select income source"
                        modalTitle="Choose Income Source"
                        required={true}
                        sources={incomeSources}
                        showProgress={false}
                        isLoading={isIncomeLoading}
                      />
                    ) : (
                      <FormikIncomeSourceSelect
                        name="sourceId"
                        label=""
                        placeholder="Select budget"
                        modalTitle="Choose Budget"
                        required={true}
                        sources={budgetSources}
                        showProgress={true}
                        onIncomeChange={(source) => {
                          if (source) {
                            setFieldValue(
                              "categoryId",
                              source.categoryId || "",
                            );
                          }
                        }}
                        isLoading={isBudgetLoading}
                      />
                    )}

                    {touched.sourceId && errors.sourceId && (
                      <Text style={styles.errorText}>{errors.sourceId}</Text>
                    )}
                  </View>

                  {values.trackMode === "income" && (
                    <FormikCategorySelect
                      name="categoryId"
                      categoryType="EXPENSE"
                      required
                      placeholder="Select category"
                    />
                  )}

                  <View style={styles.fieldGroup}>
                    <FormikTextfield
                      labelStyle={styles.fieldLabel}
                      name="notes"
                      label="NOTE (OPTIONAL)"
                      placeholder="What was this for?"
                      multiline
                      numberOfLines={3}
                      containerStyle={styles.noteField}
                    />
                  </View>

                  <View style={styles.fieldGroup}>
                    <FormikDatePicker label="Date & Time" name="date" />
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>RECEIPT</Text>
                    <ReceiptUploadField
                      value={values.receiptUrl}
                      onChange={(url) => setFieldValue("receiptUrl", url || "")}
                    />
                  </View>
                </View>
              </ScrollView>

              <View style={styles.footer}>
                <Button
                  title={submitLabel}
                  loading={loading}
                  onPress={() => handleSubmit()}
                  textStyle={styles.saveButtonText}
                />
              </View>
            </View>
          );
        }}
      </Formik>
    </SafeArea>
  );
};

export default ExpensesForm;
