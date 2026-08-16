import {
  useCategories,
  useCreateTransaction,
  useIncomeSummary,
  useIncomeTransactions,
} from "@/actions";

import {
  FormikAmountField,
  FormikDatePicker,
  FormikTextfield,
} from "@/components/form";
import { Button, InlineError, ReceiptUploadField } from "@/components/shared";
import Skeleton from "@/components/shared/skeleton";
import { useToast } from "@/components/toasts";
import { useTheme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { useAddExpensesStyles } from "./add-expenses-styles";
import {
  ExpenseCategoriesModal,
  type ExpenseCategoryItem,
} from "./expense-categories-modal";
import {
  IncomeSourcesModal,
  type IncomeSourceItem,
} from "./income-sources-modal";
import { IncomeSummaryCard } from "./income-summary-card";

type AddExpenseValues = {
  amount: string;
  categoryId: string;
  date: Date;
  notes: string;
  incomeId: string;
  receiptUrl: string | null;
};

const addExpenseSchema = Yup.object({
  amount: Yup.string()
    .required("Enter an amount")
    .test("positive", "Enter a valid amount", (v) => {
      const n = parseFloat((v ?? "").replace(/,/g, ""));
      return !Number.isNaN(n) && n > 0;
    }),
  categoryId: Yup.string().required("Select a category"),
  date: Yup.date().required(),
  incomeId: Yup.string().required("Select income source"),
  notes: Yup.string(),
});

function isValidMaterialIcon(
  name: string,
): name is keyof typeof MaterialIcons.glyphMap {
  return name in MaterialIcons.glyphMap;
}

export function AddExpensesScreen() {
  const { colors } = useTheme();
  const styles = useAddExpensesStyles();
  const { toast } = useToast();
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesQueryError,
    refetch: refetchCategories,
  } = useCategories();
  const categories = categoriesData ?? [];
  const categoriesLoaded = !isCategoriesLoading && !isCategoriesError;

  const { mutateAsync: createTransaction, isPending: isCreatingTransaction } =
    useCreateTransaction();

  const { data: incomeTxResponse } = useIncomeTransactions(
    {},
    { enabled: categoriesLoaded },
  );

  const [selectedIncomeId, setSelectedIncomeId] = useState("");

  const { data: incomeSummary, isPending: isIncomeSummaryPending } =
    useIncomeSummary(selectedIncomeId, !!selectedIncomeId);

  const categoryModalRef = useRef<BottomSheetModal>(null);
  const incomeSourceModalRef = useRef<BottomSheetModal>(null);

  const expenseCategories = useMemo<ExpenseCategoryItem[]>(
    () =>
      categories
        .filter((item) => item.type === "EXPENSE")
        .map((item) => ({
          id: item.id,
          label: item.name,
          icon: isValidMaterialIcon(item.icon) ? item.icon : "receipt-long",
        })),
    [categories],
  );

  const incomeSources = useMemo<IncomeSourceItem[]>(() => {
    const incomeTx = incomeTxResponse?.data ?? [];
    return incomeTx.map((tx) => {
      const value = Number.parseFloat(tx.amount);
      const total = Number.isNaN(value) ? 0 : value;
      return {
        id: tx.id,
        label: tx.source_name?.trim() || tx.category.name,
        icon: isValidMaterialIcon(tx.category.icon) ? tx.category.icon : "work",
        total,
        remaining: total,
      };
    });
  }, [incomeTxResponse?.data]);

  useEffect(() => {
    if (!selectedIncomeId && incomeSources.length > 0) {
      setSelectedIncomeId(incomeSources[0].id);
    }
  }, [selectedIncomeId, incomeSources]);

  const initialValues: AddExpenseValues = useMemo(
    () => ({
      amount: "",
      categoryId: "",
      date: new Date(),
      notes: "",
      incomeId: selectedIncomeId || incomeSources[0]?.id || "",
      receiptUrl: null,
    }),
    [incomeSources, selectedIncomeId],
  );

  const handleSubmit = async (values: AddExpenseValues) => {
    try {
      await createTransaction({
        type: "EXPENSE",
        amount: parseFloat(values.amount),
        category_id: values.categoryId,
        income_id: values.incomeId,
        recorded_at: values.date.toISOString(),
        notes: values.notes ?? undefined,
        receipt_url: values.receiptUrl ?? undefined,
      });
      toast.success("Expense added successfully");
      router.back();
    } catch (error) {
      toast.error("Failed to add expense");
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={12}
        >
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={colors.text.primary}
          />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
          Add Expense
        </Text>
        <View style={styles.headerRight} />
      </View>

      <Formik<AddExpenseValues>
        initialValues={initialValues}
        enableReinitialize
        validationSchema={addExpenseSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, handleSubmit }) => {
          const selectedIncome = incomeSources.find(
            (s) => s.id === values.incomeId,
          );
          const selectedCategory = expenseCategories.find(
            (c) => c.id === values.categoryId,
          );
          const summaryTotal = Number.parseFloat(
            incomeSummary?.summary?.total?.toString() ?? "0",
          );
          const summaryRemaining = Number.parseFloat(
            incomeSummary?.summary?.remaining?.toString() ?? "0",
          );
          const totalAmount = Number.isNaN(summaryTotal)
            ? (selectedIncome?.total ?? 0)
            : summaryTotal;
          const remainingAmount = Number.isNaN(summaryRemaining)
            ? (selectedIncome?.remaining ?? 0)
            : summaryRemaining;
          const incomePercent = Math.round(
            (remainingAmount / (totalAmount || 1)) * 100,
          );

          const amountNum = parseFloat((values.amount ?? "").replace(/,/g, ""));
          const amountExceedsRemaining =
            !Number.isNaN(amountNum) && amountNum > remainingAmount;
          const amountAccent = amountExceedsRemaining
            ? colors.status.error.main
            : colors.primary.main;

          const isFormValid =
            !!values.amount &&
            !!values.categoryId &&
            !!values.incomeId &&
            !!values.date;

          const formattedAmount = Number.isNaN(amountNum)
            ? "₦0"
            : `₦${amountNum.toLocaleString("en-NG")}`;

          return (
            <KeyboardAvoidingView
              style={styles.flex}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={0}
            >
              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {isCategoriesError && categoriesData === undefined ? (
                  <InlineError
                    error={categoriesQueryError}
                    onRetry={refetchCategories}
                    title="Could not load categories"
                    message="Try again or go back."
                    style={{ marginBottom: 16 }}
                  />
                ) : null}

                <View style={styles.amountSection}>
                  <View style={styles.typeChip}>
                    <MaterialIcons
                      name="arrow-downward"
                      size={13}
                      color={colors.status.error.main}
                    />
                    <Text style={styles.typeChipText}>Expense</Text>
                  </View>
                  <FormikAmountField
                    name="amount"
                    maxLength={16}
                    showFormikError
                    accentColor={
                      amountExceedsRemaining
                        ? colors.status.error.main
                        : undefined
                    }
                  />
                  {amountExceedsRemaining ? (
                    <View style={styles.amountExceedsRow}>
                      <MaterialIcons
                        name="warning"
                        size={18}
                        color={colors.status.warning.main}
                      />
                      <Text style={styles.amountExceedsText}>
                        This exceeds available balance
                      </Text>
                    </View>
                  ) : null}
                </View>

                <IncomeSummaryCard
                  onPress={() => incomeSourceModalRef.current?.present()}
                  incomeLabel={selectedIncome?.label ?? "Income"}
                  totalAmount={totalAmount}
                  remainingAmount={remainingAmount}
                  incomePercent={incomePercent}
                  isLoading={!!selectedIncomeId && isIncomeSummaryPending}
                />

                <View style={styles.categorySection}>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.fieldLabel}>CATEGORY</Text>
                    {expenseCategories.length > 5 ? (
                      <Pressable
                        hitSlop={8}
                        onPress={() => categoryModalRef.current?.present()}
                      >
                        <Text style={styles.viewAll}>View All</Text>
                      </Pressable>
                    ) : null}
                  </View>
                  <View style={styles.categoryGrid}>
                    {isCategoriesLoading
                      ? Array.from({ length: 6 }).map((_, idx) => (
                          <View
                            key={`cat-skeleton-${idx}`}
                            style={[
                              styles.categoryItem,
                              {
                                backgroundColor: colors.background.surfaceAlt,
                                borderColor: colors.border.default,
                              },
                            ]}
                          >
                            <View style={styles.categoryIconWrap}>
                              <Skeleton
                                width={44}
                                height={44}
                                borderRadius={22}
                              />
                            </View>
                            <Skeleton width={60} height={11} />
                          </View>
                        ))
                      : expenseCategories.slice(0, 6).map((cat) => {
                          const selected = values.categoryId === cat.id;
                          return (
                            <Pressable
                              key={cat.id}
                              onPress={() =>
                                setFieldValue("categoryId", cat.id)
                              }
                              style={[
                                styles.categoryItem,
                                {
                                  backgroundColor: selected
                                    ? colors.primary.main + "12"
                                    : colors.background.surfaceAlt,
                                  borderColor: selected
                                    ? colors.primary.main
                                    : colors.border.default,
                                },
                              ]}
                            >
                              {selected && (
                                <View
                                  style={[
                                    styles.categoryCheck,
                                    { backgroundColor: colors.primary.main },
                                  ]}
                                >
                                  <MaterialIcons
                                    name="check"
                                    size={10}
                                    color={colors.primary.contrastText}
                                  />
                                </View>
                              )}
                              <View
                                style={[
                                  styles.categoryIconWrap,
                                  {
                                    backgroundColor: selected
                                      ? colors.primary.main
                                      : colors.background.surface,
                                  },
                                ]}
                              >
                                <MaterialIcons
                                  name={cat.icon}
                                  size={22}
                                  color={
                                    selected
                                      ? colors.primary.contrastText
                                      : colors.primary.main
                                  }
                                />
                              </View>
                              <Text
                                style={[
                                  styles.categoryLabel,
                                  {
                                    color: selected
                                      ? colors.primary.main
                                      : colors.text.secondary,
                                  },
                                ]}
                                numberOfLines={1}
                              >
                                {cat.label}
                              </Text>
                            </Pressable>
                          );
                        })}
                  </View>
                </View>

                <View style={styles.field}>
                  <View style={styles.rowLabel}>
                    <View style={styles.rowIconBadge}>
                      <MaterialIcons
                        name="event"
                        size={12}
                        color={colors.primary.main}
                      />
                    </View>
                    <Text style={styles.fieldLabel}>DATE</Text>
                  </View>
                  <FormikDatePicker name="date" label="" showFormikError />
                </View>

                <View style={styles.divider} />

                <View style={styles.field}>
                  <FormikTextfield
                    name="notes"
                    label="NOTES"
                    placeholder="Add a description..."
                    multiline
                    numberOfLines={3}
                    containerStyle={styles.notesFieldContainer}
                    style={styles.notesFieldText}
                  />
                </View>

                <ReceiptUploadField
                  value={values.receiptUrl}
                  onChange={(url) => setFieldValue("receiptUrl", url)}
                />
              </ScrollView>

              <ExpenseCategoriesModal
                modalRef={categoryModalRef}
                categories={expenseCategories}
                selectedCategoryId={values.categoryId}
                onSelectCategory={(id) => {
                  categoryModalRef.current?.dismiss();
                  setFieldValue("categoryId", id);
                }}
              />

              <IncomeSourcesModal
                modalRef={incomeSourceModalRef}
                sources={incomeSources}
                selectedIncomeId={values.incomeId}
                onSelectIncome={(id) => {
                  setFieldValue("incomeId", id);
                  setSelectedIncomeId(id);
                }}
                onConfirm={() => incomeSourceModalRef.current?.dismiss()}
              />

              <View
                style={[
                  styles.footer,
                  { backgroundColor: colors.background.screen },
                ]}
              >
                {values.amount ? (
                  <View style={styles.summaryStrip}>
                    <View style={styles.summaryTextCol}>
                      <Text style={styles.summaryMeta}>YOU'RE SPENDING</Text>
                      <Text style={styles.summaryLine}>
                        <Text style={{ color: colors.status.error.main }}>
                          {formattedAmount}
                        </Text>
                        <Text style={{ color: colors.text.secondary }}>
                          {" "}
                          on{" "}
                        </Text>
                        <Text style={{ color: colors.text.primary }}>
                          {selectedCategory?.label ?? "an expense"}
                        </Text>
                      </Text>
                    </View>
                  </View>
                ) : null}
                <Button
                  onPress={() => handleSubmit()}
                  style={styles.saveBtn}
                  disabled={isCreatingTransaction || amountExceedsRemaining || !isFormValid}
                  loading={isCreatingTransaction}
                >
                  <MaterialIcons
                    name="check"
                    size={20}
                    color={colors.primary.contrastText}
                  />
                  <Text style={styles.saveBtnText}>Save Expense</Text>
                </Button>
              </View>
            </KeyboardAvoidingView>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
}
