import { CategoryIcon } from "@/components/shared";
import { formatPrice } from "@/lib/custom";
import { useTheme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAddExpensesStyles } from "./add-expenses-styles";

type ReviewItem = {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  amount: number;
};

type ReviewExpensesSheetProps = {
  modalRef: React.RefObject<BottomSheetModal | null>;
  items: ReviewItem[];
  total: number;
  isSaving: boolean;
  onSaveAll: () => void;
  onEdit: () => void;
};

export function ReviewExpensesSheet({
  modalRef,
  items,
  total,
  isSaving,
  onSaveAll,
  onEdit,
}: ReviewExpensesSheetProps) {
  const { colors } = useTheme();
  const styles = useAddExpensesStyles();

  return (
    <BottomSheetModal ref={modalRef} snapPoints={["70%"]} enablePanDownToClose>
      <View style={styles.reviewHeader}>
        <Text style={styles.headerTitle}>Review expenses</Text>
        <View style={styles.reviewHeaderRow}>
          <Text style={styles.budgetMeta}>
            {items.length} expense{items.length !== 1 ? "s" : ""}
          </Text>
          <View style={styles.reviewTotalRow}>
            <Text style={styles.fieldLabel}>TOTAL EXPENSES</Text>
            <Text style={styles.reviewTotalText}>{formatPrice(total)}</Text>
          </View>
        </View>
      </View>

      <BottomSheetScrollView contentContainerStyle={styles.reviewList}>
        {items.map((item) => (
          <View key={item.id} style={styles.reviewListItem}>
            <View style={styles.budgetButtonLeft}>
              <CategoryIcon
                withBackground
                size={20}
                icon={item.icon}
                color={colors.text.secondary}
              />
              <Text style={styles.budgetName}>{item.label}</Text>
            </View>
            <Text style={styles.numeralLg}>{formatPrice(item.amount)}</Text>
          </View>
        ))}
      </BottomSheetScrollView>

      <View style={styles.reviewFooter}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={onSaveAll}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? "Saving..." : "Save all"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editButton}
          onPress={onEdit}
          disabled={isSaving}
        >
          <Text style={styles.editButtonText}>Edit expenses</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
}
