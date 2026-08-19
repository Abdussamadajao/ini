import { useIncomeTransactions } from "@/actions";
import {
  FormikAmountField,
  FormikDatePicker,
  FormikTextfield,
} from "@/components/form";
import {
  Button,
  CategoryIcon,
  FormikCategorySelect,
  ReceiptUploadField,
  SafeArea,
  SegmentedTabs,
} from "@/components/shared";
import { formatPrice } from "@/lib";
import { useTheme } from "@/theme";
import { IncomeTransaction } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useMemo, useRef } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAddExpensesStyles } from "./add-expenses-styles";
import { IncomeSourcesModal } from "./income-sources-modal";
import { DUMMY_BUDGETS, ExpenseFormProps, SourceItem } from "./type";

const ExpensesForm = ({
  title,
  submitLabel,
  initialValues,
  onSubmit,
}: ExpenseFormProps) => {
  const { colors } = useTheme();
  const styles = useAddExpensesStyles();
  const { data: incomeTxResponse } = useIncomeTransactions();

  const sourceModalRef = useRef<BottomSheetModal>(null);

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
        };
      });
  }, [incomeTxResponse]);
  return (
    <SafeArea>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={(values) => {
          const errors: any = {};
          if (!values.amount || parseFloat(values.amount) <= 0) {
            errors.amount = "Amount is required";
          }
          if (values.trackMode === "income" && !values.categoryId) {
            errors.categoryId = "Category is required";
          }
          if (!values.sourceId) {
            errors.sourceId =
              values.trackMode === "income"
                ? "Income source is required"
                : "Budget is required";
          }
          return errors;
        }}
      >
        {({ handleSubmit, setFieldValue, values, errors, touched }) => {
          const activeSources =
            values.trackMode === "income" ? incomeSources : DUMMY_BUDGETS;
          const selectedSource = activeSources.find(
            (s) => s.id === values.sourceId,
          );

          return (
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
                    <TouchableOpacity
                      style={styles.budgetButton}
                      onPress={() => sourceModalRef.current?.present()}
                    >
                      <View style={styles.budgetButtonLeft}>
                        <CategoryIcon
                          style={styles.budgetIcon}
                          withBackground
                          size={24}
                          icon={selectedSource?.icon || ""}
                          color={colors.primary.main}
                        />
                        <View style={styles.budgetInfo}>
                          <Text style={styles.budgetName}>
                            {selectedSource?.label ||
                              (values.trackMode === "income"
                                ? "Select income source"
                                : "Select budget")}
                          </Text>
                          {selectedSource && (
                            <Text style={styles.budgetMeta}>
                              {formatPrice(selectedSource.remaining)} remaining
                            </Text>
                          )}
                        </View>
                      </View>
                      <MaterialIcons
                        name="chevron-right"
                        size={24}
                        color={colors.text.secondary}
                      />
                    </TouchableOpacity>
                    {touched.sourceId && errors.sourceId && (
                      <Text style={styles.errorText}>{errors.sourceId}</Text>
                    )}
                  </View>

                  {/* Category — only shown for Income. Budget already implies its own category. */}
                  {values.trackMode === "income" && (
                    <FormikCategorySelect
                      name="categoryId"
                      categoryType="EXPENSE"
                      required
                    />
                  )}

                  {/* Note */}
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

                  {/* Date & Time */}
                  <View style={styles.fieldGroup}>
                    <FormikDatePicker label="Date & Time" name="date" />
                  </View>

                  {/* Receipt */}
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
                <Button onPress={() => handleSubmit()}>
                  <Text style={styles.saveButtonText}>{submitLabel}</Text>
                </Button>
              </View>
              <IncomeSourcesModal
                title={
                  values.trackMode === "income"
                    ? "Select Income Source"
                    : "Select Budget"
                }
                modalRef={sourceModalRef}
                sources={activeSources}
                selectedIncomeId={values.sourceId}
                onSelectIncome={(id) => {
                  setFieldValue("sourceId", id);
                }}
                onConfirm={() => sourceModalRef.current?.dismiss()}
              />
            </View>
          );
        }}
      </Formik>
    </SafeArea>
  );
};

export default ExpensesForm;
