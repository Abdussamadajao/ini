import BlurBackdrop, {
  BlurBackdropProps,
} from "@/components/shared/blur-backdrop";
import { useTheme } from "@/theme";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { useAddExpensesStyles } from "./add-expenses-styles";

export type ExpenseCategoryItem = {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

type Props = {
  modalRef: React.RefObject<BottomSheetModal | null>;
  categories: ExpenseCategoryItem[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
};

export function ExpenseCategoriesModal({
  modalRef,
  categories,
  selectedCategoryId,
  onSelectCategory,
}: Props) {
  const { colors } = useTheme();
  const styles = useAddExpensesStyles();

  const renderBackdrop = useCallback(
    (props: BlurBackdropProps) => (
      <BlurBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={1}
        pressBehavior="close"
      />
    ),
    [],
  );

  const ListEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyWrap}>
        <View style={styles.emptyIconBadge}>
          <MaterialCommunityIcons
            name="tray-remove"
            size={26}
            color={colors.text.secondary}
          />
        </View>
        <Text style={styles.emptyTitle}>No categories yet</Text>
        <Text style={styles.emptyMessage}>
          Create a category to get started.
        </Text>
      </View>
    ),
    [colors.text.secondary, styles],
  );

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={["50%"]}
      enablePanDownToClose
      enableDismissOnClose
      enableContentPanningGesture={false}
      enableHandlePanningGesture={false}
      enableDynamicSizing={false}
      backgroundStyle={[
        styles.modalBackground,
        { backgroundColor: colors.background.surface },
      ]}
      handleIndicatorStyle={{
        backgroundColor: colors.text.muted,
        width: 40,
        height: 4,
        marginTop: 10,
      }}
      backdropComponent={renderBackdrop}
    >
      <Text style={styles.modalTitle}>Select Category</Text>
      <BottomSheetFlatList
        data={categories}
        keyExtractor={(cat) => cat.id}
        renderItem={({ item: cat }) => {
          const selected = selectedCategoryId === cat.id;
          return (
            <Pressable
              style={({ pressed }) => [
                styles.categoryOptionRow,
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => onSelectCategory(cat.id)}
            >
              <View
                style={[
                  styles.categoryOptionIconWrap,
                  {
                    backgroundColor: selected
                      ? colors.primary.main
                      : colors.background.surfaceAlt,
                  },
                ]}
              >
                <MaterialIcons
                  name={cat.icon}
                  size={24}
                  color={
                    selected ? colors.primary.contrastText : colors.primary.main
                  }
                />
              </View>
              <Text style={styles.categoryOptionLabel}>{cat.label}</Text>
              {selected && (
                <MaterialIcons
                  name="check"
                  size={22}
                  color={colors.primary.main}
                />
              )}
            </Pressable>
          );
        }}
        contentContainerStyle={styles.modalListContent}
        ListEmptyComponent={ListEmptyComponent}
      />
    </BottomSheetModal>
  );
}
