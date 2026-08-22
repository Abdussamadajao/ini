import { FormikDatePicker, FormikTextfield } from "@/components/form";
import {
  FormikCategorySelect,
  FormikIncomeSourceSelect,
  ReceiptUploadField,
  SegmentedTabs,
} from "@/components/shared";
import { useTheme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { useAddExpensesStyles } from "./add-expenses-styles";
import { useExpenseSources } from "./hooks";
import { TrackMode } from "./type";

type ExpenseEntryFieldsProps = {
  namePrefix: string; // e.g. "" for single form, "expenses[0]" for batch
  trackMode: TrackMode;
  sourceId: string;
  categoryId: string;
  receiptUrl: string;
  sourceError?: string;
  sourceTouched?: boolean;
  setFieldValue: (field: string, value: any) => void;
};

export function ExpenseEntryFields({
  namePrefix,
  trackMode,
  categoryId,
  receiptUrl,
  setFieldValue,
}: ExpenseEntryFieldsProps) {
  const { colors } = useTheme();
  const styles = useAddExpensesStyles();
  const { incomeSources, budgetSources, isBudgetLoading, isIncomeLoading } =
    useExpenseSources();

  const field = (name: string) => (namePrefix ? `${namePrefix}.${name}` : name);

  let sourceLabel = trackMode === "income" ? "INCOME SOURCE" : "BUDGET";
  let sourcePlaceholder =
    trackMode === "income" ? "Select income source" : "Select budget";
  let sourceTitle =
    trackMode === "income" ? "Select Income Source" : "Select Budget";
  let source = trackMode === "income" ? incomeSources : budgetSources;
  return (
    <>
      {/* Track Against */}
      <View style={styles.fieldGroup}>
        <SegmentedTabs
          tabs={["income", "budget"] as const}
          activeTab={trackMode}
          onTabChange={(tab) => {
            setFieldValue(field("trackMode"), tab);
            setFieldValue(field("sourceId"), "");
            setFieldValue(field("categoryId"), "");
          }}
          style={{ paddingHorizontal: 1 }}
        />
      </View>

      <View style={styles.divider} />

      <FormikIncomeSourceSelect
        name={field("sourceId")}
        label={sourceLabel}
        placeholder={sourcePlaceholder}
        modalTitle={sourceTitle}
        sources={source}
        required
        showProgress={trackMode === "budget"}
        onIncomeChange={() => {
          // clear the dependent category whenever the source changes
          setFieldValue(field("categoryId"), "");
        }}
      />

      {/* Category — Income only */}
      {trackMode === "income" && (
        <>
          <View style={styles.divider} />
          <View style={styles.fieldGroup}>
            <FormikCategorySelect
              name={field("categoryId")}
              categoryType="EXPENSE"
              required
            />
          </View>
        </>
      )}

      <View style={styles.divider} />

      {/* Note */}
      <View style={styles.fieldGroup}>
        <FormikTextfield
          label="NOTE (OPTIONAL)"
          name={field("notes")}
          placeholder="What was this for?"
          multiline
          numberOfLines={3}
          containerStyle={styles.noteField}
        />
      </View>

      {/* Date & Time */}
      <View style={styles.fieldGroup}>
        <FormikDatePicker label="  DATE & TIME" name={field("date")} />
      </View>

      {/* Receipt */}
      <View style={styles.fieldGroup}>
        <ReceiptUploadField
          value={receiptUrl}
          onChange={(url) => setFieldValue(field("receiptUrl"), url || "")}
        />
      </View>
    </>
  );
}
