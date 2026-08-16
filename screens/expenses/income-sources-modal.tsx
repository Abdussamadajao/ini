import BlurBackdrop, {
  BlurBackdropProps,
} from "@/components/shared/blur-backdrop";
import { formatPrice } from "@/lib/custom";
import { useTheme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import { useAddExpensesStyles } from "./add-expenses-styles";

export type IncomeSourceItem = {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  total: number;
  remaining: number;
};

type Props = {
  modalRef: React.RefObject<BottomSheetModal | null>;
  sources: IncomeSourceItem[];
  selectedIncomeId: string;
  onSelectIncome: (id: string) => void;
  onConfirm: () => void;
};

export function IncomeSourcesModal({
  modalRef,
  sources,
  selectedIncomeId,
  onSelectIncome,
  onConfirm,
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

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={["60%"]}
      enablePanDownToClose
      enableHandlePanningGesture
      enableContentPanningGesture={false}
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
      <Text style={styles.incomeModalTitle}>Select Income Source</Text>
      <BottomSheetScrollView
        contentContainerStyle={styles.incomeModalScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {sources.map((source) => {
          const selected = selectedIncomeId === source.id;
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
                <MaterialIcons
                  name={source.icon}
                  size={24}
                  color={selected ? colors.primary.main : colors.text.secondary}
                />
              </View>
              <View style={styles.incomeSourceBody}>
                <Text style={styles.incomeSourceLabel}>{source.label}</Text>
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
    </BottomSheetModal>
  );
}
