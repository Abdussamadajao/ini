import { useTransactionMutation } from "@/actions";
import { FormikAmountField } from "@/components/form";
import { Button, FormHeader } from "@/components/shared";
import { formatPrice } from "@/lib/custom";
import { useTheme } from "@/theme";
import { CreateTransactionBody } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FieldArray, Formik } from "formik";
import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAddExpensesStyles } from "./add-expenses-styles";
import { ExpenseEntryFields } from "./expense-entry-fields";
import { useExpenseSources } from "./hooks";
import { TrackMode } from "./type";

type BatchExpenseEntry = {
  localId: string;
  amount: string;
  categoryId: string;
  date: string;
  notes: string;
  sourceId: string;
  receiptUrl: string;
  trackMode: TrackMode;
};

type BatchExpenseValues = {
  expenses: BatchExpenseEntry[];
};

let localIdCounter = 0;
const nextLocalId = () => `entry-${Date.now()}-${localIdCounter++}`;

const makeEmptyEntry = (): BatchExpenseEntry => ({
  localId: nextLocalId(),
  amount: "",
  categoryId: "",
  date: new Date().toISOString(),
  notes: "",
  sourceId: "",
  receiptUrl: "",
  trackMode: "income",
});

export function BatchExpenseScreen() {
  const { colors } = useTheme();
  const styles = useAddExpensesStyles();
  const { incomeSources, budgetSources } = useExpenseSources();

  const { createBatchTransaction } = useTransactionMutation();

  const initialValues: BatchExpenseValues = {
    expenses: [makeEmptyEntry()],
  };

  const handleSaveAll = async (
    values: BatchExpenseValues,
    resetForm: () => void,
  ) => {
    const transactions: CreateTransactionBody[] = values.expenses.map(
      (entry) => {
        const isIncome = entry.trackMode === "income";
        const selectedSource = budgetSources.find(
          (s) => s.id === entry.sourceId,
        );

        return {
          type: "EXPENSE",
          amount: parseFloat(entry.amount) || 0,
          category_id: entry.categoryId,
          ...(isIncome && { income_id: entry.sourceId }),
          ...(!isIncome && { budget_id: entry.sourceId || undefined }),
          source_name: selectedSource?.label,
          notes: entry.notes || undefined,
          receipt_url: entry.receiptUrl || undefined,
          tag: "Monthly",
          recorded_at: entry.date,
        };
      },
    );

    await createBatchTransaction.mutateAsync({ transactions });
    resetForm();
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <Formik
        initialValues={initialValues}
        onSubmit={() => {}}
        validate={(values) => {
          const errors: any = { expenses: [] };
          let hasError = false;
          values.expenses.forEach((entry, i) => {
            const entryErrors: any = {};
            if (!entry.amount || parseFloat(entry.amount) <= 0) {
              entryErrors.amount = "Amount is required";
              hasError = true;
            }
            if (entry.trackMode === "income" && !entry.categoryId) {
              entryErrors.categoryId = "Category is required";
              hasError = true;
            }
            if (!entry.sourceId) {
              entryErrors.sourceId =
                entry.trackMode === "income"
                  ? "Income source is required"
                  : "Budget is required";
              hasError = true;
            }
            errors.expenses[i] = entryErrors;
          });
          return hasError ? errors : {};
        }}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          validateForm,
          resetForm,
          setTouched,
        }) => {
          const total = values.expenses.reduce(
            (sum, e) => sum + (parseFloat(e.amount) || 0),
            0,
          );
          const allFilled = values.expenses.every(
            (e) => e.amount && parseFloat(e.amount) > 0 && e.sourceId,
          );

          const handleSavePress = async () => {
            const formErrors = await validateForm();
            if (Object.keys(formErrors).length > 0) {
              const touchedExpenses = values.expenses.map(() => ({
                amount: true,
                categoryId: true,
                sourceId: true,
              }));
              setTouched({ expenses: touchedExpenses } as any);
              return;
            }
            await handleSaveAll(values, resetForm);
          };

          return (
            <>
              <FormHeader
                title="Batch expense"
                rightContent={
                  <View style={styles.headerCountBadge}>
                    <Text style={styles.headerCountText}>
                      {values.expenses.length} EXPENSE
                      {values.expenses.length !== 1 ? "S" : ""}
                    </Text>
                  </View>
                }
              />

              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <FieldArray name="expenses">
                  {({ remove, push }) => (
                    <>
                      {values.expenses.map((entry, index) => (
                        <View key={entry.localId}>
                          <View style={styles.batchSection}>
                            <View style={styles.batchSectionHeader}>
                              <View style={styles.rowLabel}>
                                <View style={styles.batchIndexBadge}>
                                  <Text style={styles.batchIndexText}>
                                    {index + 1}
                                  </Text>
                                </View>
                                <Text style={styles.fieldLabel}>EXPENSE</Text>
                              </View>
                              {values.expenses.length > 1 && (
                                <TouchableOpacity
                                  style={styles.removeButton}
                                  onPress={() => remove(index)}
                                  hitSlop={8}
                                >
                                  <MaterialIcons
                                    name="delete-outline"
                                    size={16}
                                    color={colors.status.error.main}
                                  />
                                  <Text style={styles.removeButtonText}>
                                    Remove
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>

                            <View style={styles.amountSection}>
                              <View style={styles.amountRow}>
                                <FormikAmountField
                                  name={`expenses[${index}].amount`}
                                />
                              </View>
                            </View>

                            <ExpenseEntryFields
                              namePrefix={`expenses[${index}]`}
                              trackMode={entry.trackMode}
                              sourceId={entry.sourceId}
                              categoryId={entry.categoryId}
                              receiptUrl={entry.receiptUrl}
                              sourceError={
                                (errors.expenses as any)?.[index]?.sourceId
                              }
                              sourceTouched={
                                (touched.expenses as any)?.[index]?.sourceId
                              }
                              setFieldValue={setFieldValue}
                            />
                          </View>

                          {index < values.expenses.length - 1 && (
                            <View style={styles.batchDivider} />
                          )}
                        </View>
                      ))}

                      <TouchableOpacity
                        style={styles.addAnotherButton}
                        onPress={() => push(makeEmptyEntry())}
                        activeOpacity={0.7}
                      >
                        <MaterialIcons
                          name="add"
                          size={20}
                          color={colors.primary.main}
                        />
                        <Text style={styles.addAnotherText}>
                          Add another expense
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </FieldArray>
              </ScrollView>

              {/* Bottom Action Bar */}
              <View style={styles.footer}>
                <View
                  style={[
                    styles.batchSummaryRow,
                    allFilled
                      ? styles.batchSummaryRowReady
                      : styles.batchSummaryRowPending,
                  ]}
                >
                  <View>
                    <Text style={styles.fieldLabel}>BATCH SUMMARY</Text>
                    <Text style={styles.budgetMeta}>
                      {values.expenses.length} expense
                      {values.expenses.length !== 1 ? "s" : ""}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.fieldLabel}>TOTAL</Text>
                    <Text style={styles.batchTotalText}>
                      {formatPrice(total)}
                    </Text>
                  </View>
                </View>
                <Button
                  title="Save all expenses"
                  onPress={handleSavePress}
                  loading={createBatchTransaction.isPending}
                  textStyle={styles.saveButtonText}
                />
              </View>
            </>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
}
