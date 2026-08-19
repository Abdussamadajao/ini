import { FormikDatePicker, FormikTextfield } from "@/components/form";
import {
  CategoryIcon,
  FormikCategorySelect,
  ReceiptUploadField,
  SegmentedTabs,
} from "@/components/shared";
import { formatPrice } from "@/lib/custom";
import { useTheme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAddExpensesStyles } from "./add-expenses-styles";
import { SourceItem, useExpenseSources } from "./hooks";
import { IncomeSourcesModal } from "./income-sources-modal";
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
  sourceId,
  categoryId,
  receiptUrl,
  sourceError,
  sourceTouched,
  setFieldValue,
}: ExpenseEntryFieldsProps) {
  const { colors } = useTheme();
  const styles = useAddExpensesStyles();
  const { incomeSources, budgetSources } = useExpenseSources();
  const sourceModalRef = useRef<BottomSheetModal>(null);

  const field = (name: string) => (namePrefix ? `${namePrefix}.${name}` : name);

  const activeSources: SourceItem[] =
    trackMode === "income" ? incomeSources : budgetSources;
  const selectedSource = activeSources.find((s) => s.id === sourceId);

  return (
    <>
      {/* Track Against */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>TRACK AGAINST</Text>
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

      {/* Source Selection */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>
          {trackMode === "income" ? "INCOME SOURCE" : "BUDGET"}
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
                  (trackMode === "income"
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
        {sourceTouched && sourceError && (
          <Text style={styles.errorText}>{sourceError}</Text>
        )}
      </View>

      {/* Category — Income only */}
      {trackMode === "income" && (
        <FormikCategorySelect
          name={field("categoryId")}
          categoryType="EXPENSE"
          required
        />
      )}

      {/* Note */}
      <View style={styles.fieldGroup}>
        <FormikTextfield
          labelStyle={styles.fieldLabel}
          name={field("notes")}
          label="NOTE (OPTIONAL)"
          placeholder="What was this for?"
          multiline
          numberOfLines={3}
          containerStyle={styles.noteField}
        />
      </View>

      {/* Date & Time */}
      <View style={styles.fieldGroup}>
        <FormikDatePicker label="Date & Time" name={field("date")} />
      </View>

      {/* Receipt */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>RECEIPT</Text>
        <ReceiptUploadField
          value={receiptUrl}
          onChange={(url) => setFieldValue(field("receiptUrl"), url || "")}
        />
      </View>

      <IncomeSourcesModal
        title={
          trackMode === "income" ? "Select Income Source" : "Select Budget"
        }
        modalRef={sourceModalRef}
        sources={activeSources}
        selectedIncomeId={sourceId}
        onSelectIncome={(id) => setFieldValue(field("sourceId"), id)}
        onConfirm={() => sourceModalRef.current?.dismiss()}
      />
    </>
  );
}
