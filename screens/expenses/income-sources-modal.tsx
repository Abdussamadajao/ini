import { CategoryIcon } from "@/components/shared";
import BlurBackdrop, {
  BlurBackdropProps,
} from "@/components/shared/blur-backdrop";
import { formatPrice } from "@/lib/custom";
import { useTheme } from "@/theme";
import { SourceItem } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import { useAddExpensesStyles } from "./add-expenses-styles";

type Props = {
  modalRef: React.RefObject<BottomSheetModal | null>;
  sources: SourceItem[];
  selectedIncomeId: string;
  onSelectIncome: (id: string) => void;
  onConfirm: () => void;
  onDismiss?: () => void;
  title?: string;
  showProgress?: boolean;
  onCreateNew?: () => void;
};

function isMaterialIconName(
  icon: string,
): icon is keyof typeof MaterialIcons.glyphMap {
  return icon in MaterialIcons.glyphMap;
}

export function IncomeSourcesModal({
  modalRef,
  sources,
  selectedIncomeId,
  onSelectIncome,
  onConfirm,
  onDismiss,
  title,
  showProgress = false,
  onCreateNew,
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

  const handleDismiss = useCallback(() => {
    onDismiss?.();
  }, [onDismiss]);

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={[showProgress ? "50%" : "55%"]}
      enablePanDownToClose
      enableHandlePanningGesture
      enableContentPanningGesture={false}
      enableDynamicSizing={false}
      onDismiss={handleDismiss}
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
      <View style={{ flex: 1 }}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          {showProgress && onCreateNew && (
            <Pressable
              onPress={onCreateNew}
              style={[
                styles.budgetCreateNewBtn,
                { borderColor: colors.border.default },
              ]}
            >
              <MaterialIcons name="add" size={18} color={colors.primary.main} />
              <Text
                style={[
                  styles.budgetCreateNewText,
                  { color: colors.primary.main },
                ]}
              >
                Create New
              </Text>
            </Pressable>
          )}
        </View>

        <BottomSheetScrollView
          contentContainerStyle={styles.incomeModalScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {sources.map((source) => {
            const selected = selectedIncomeId === source.id;

            if (showProgress) {
              const spent = source.spent ?? 0;
              const percentage =
                source.total > 0
                  ? Math.min(100, Math.round((spent / source.total) * 100))
                  : 0;

              return (
                <Pressable
                  key={source.id}
                  onPress={() => onSelectIncome(source.id)}
                  style={[
                    styles.budgetSheetRow,
                    selected && styles.budgetSheetRowSelected,
                  ]}
                >
                  <View style={styles.budgetSheetIconWrap}>
                    <CategoryIcon
                      color={source.color ?? ""}
                      icon={source.icon}
                    />
                  </View>

                  <View style={styles.budgetSheetBody}>
                    <View style={styles.budgetSheetTopRow}>
                      <Text style={styles.budgetSheetLabel} numberOfLines={1}>
                        {source.label}
                      </Text>
                      <Text
                        style={[
                          styles.budgetSheetAmount,
                          selected && { color: colors.primary.main },
                        ]}
                      >
                        {formatPrice(source.remaining)}
                      </Text>
                    </View>

                    <View style={styles.budgetSheetMetaRow}>
                      <Text style={styles.budgetSheetMetaText}>remaining</Text>
                      <Text style={styles.budgetSheetMetaText}>
                        {percentage}% used
                      </Text>
                    </View>

                    <View style={styles.budgetSheetProgressTrack}>
                      <View
                        style={[
                          styles.budgetSheetProgressFill,
                          {
                            width: `${percentage}%`,
                            backgroundColor: selected
                              ? colors.primary.main
                              : colors.text.secondary,
                          },
                        ]}
                      />
                    </View>
                  </View>

                  <View style={styles.budgetSheetCheckWrap}>
                    {selected && (
                      <View style={styles.budgetSheetCheckCircle}>
                        <MaterialIcons
                          name="check"
                          size={16}
                          color={colors.primary.contrastText}
                        />
                      </View>
                    )}
                  </View>
                </Pressable>
              );
            }

            // Income mode - select without auto-confirm
            return (
              <Pressable
                key={source.id}
                onPress={() => onSelectIncome(source.id)}
                style={[
                  styles.incomeSourceCard,
                  {
                    backgroundColor: selected
                      ? `${colors.primary.main}12`
                      : colors.background.surface,
                    borderColor: selected
                      ? colors.primary.main
                      : colors.border.default,
                  },
                ]}
              >
                <View
                  style={[
                    styles.incomeSourceIconWrap,
                    {
                      backgroundColor: selected
                        ? `${colors.primary.main}25`
                        : colors.background.surfaceAlt,
                    },
                  ]}
                >
                  {isMaterialIconName(source.icon) ? (
                    <MaterialIcons
                      name={source.icon}
                      size={24}
                      color={
                        selected ? colors.primary.main : colors.text.secondary
                      }
                    />
                  ) : (
                    <Text style={{ fontSize: 20 }}>{source.icon}</Text>
                  )}
                </View>
                <View style={styles.incomeSourceBody}>
                  <Text
                    style={[
                      styles.incomeSourceLabel,
                      selected && { color: colors.primary.main },
                    ]}
                  >
                    {source.label}
                  </Text>
                  <Text
                    style={[
                      styles.incomeSourceRemaining,
                      {
                        color: selected
                          ? colors.primary.main
                          : colors.text.secondary,
                      },
                    ]}
                  >
                    {formatPrice(source.remaining)}
                  </Text>
                </View>
                <View style={styles.incomeSourceRight}>
                  <View
                    style={[
                      styles.incomeSourceRadio,
                      {
                        borderColor: selected
                          ? colors.primary.main
                          : colors.border.default,
                        backgroundColor: selected
                          ? `${colors.primary.main}40`
                          : "transparent",
                      },
                    ]}
                  >
                    {selected && (
                      <View
                        style={[
                          styles.incomeSourceRadioInner,
                          { backgroundColor: colors.primary.main },
                        ]}
                      />
                    )}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </BottomSheetScrollView>

        {/* Footer with confirm button for both modes */}
        <View style={styles.incomeSourceConfirmBtnWrap}>
          <Pressable
            onPress={onConfirm}
            style={[
              styles.incomeSourceConfirmBtn,
              { backgroundColor: colors.primary.main },
            ]}
          >
            <Text style={styles.incomeSourceConfirmBtnText}>
              Confirm Selection
            </Text>
            <MaterialIcons
              name="arrow-forward"
              size={20}
              color={colors.primary.contrastText}
            />
          </Pressable>
        </View>
      </View>
    </BottomSheetModal>
  );
}
