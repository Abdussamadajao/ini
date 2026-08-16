import { Button } from "@/components/shared";
import BlurBackdrop, {
  BlurBackdropProps,
} from "@/components/shared/blur-backdrop";
import { useTheme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useCallback } from "react";
import { Text, View } from "react-native";
import { useTransactionDetailsStyles } from "./transaction-details-styles";

type Props = {
  modalRef: React.RefObject<BottomSheetModal | null>;
  isDeleting: boolean;
  isExpense: boolean;
  onConfirmDelete: () => void;
  onCancel: () => void;
};

export function TransactionDeleteModal({
  modalRef,
  isDeleting,
  isExpense,
  onConfirmDelete,
  onCancel,
}: Props) {
  const { colors } = useTheme();
  const styles = useTransactionDetailsStyles();

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
      snapPoints={["50%"]}
      enablePanDownToClose
      enableDismissOnClose
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.deleteSheet}
      handleIndicatorStyle={styles.deleteHandle}
    >
      <BottomSheetScrollView
        style={{
          paddingHorizontal: 20,
          paddingVertical: 16,
          flexGrow: 1,
        }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View style={styles.deleteIconWrap}>
          <MaterialIcons
            name="delete-forever"
            size={22}
            color={colors.status.error.main}
          />
        </View>
        <Text style={styles.deleteTitle}>Delete Transaction?</Text>
        <Text style={styles.deleteMessage}>
          {isExpense
            ? "This action is permanent and cannot be undone. It will restore the balance to your Salary wallet."
            : "This action is permanent and cannot be undone."}
        </Text>
      </BottomSheetScrollView>
      <View style={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <Button
          onPress={onConfirmDelete}
          style={styles.deletePrimaryBtn}
          loading={isDeleting}
          disabled={isDeleting}
        >
          <Text style={styles.deletePrimaryBtnText}>Delete Transaction</Text>
        </Button>
        <Button
          onPress={onCancel}
          variant="secondary"
          style={styles.deleteCancelBtn}
          disabled={isDeleting}
        >
          <Text style={styles.deleteCancelBtnText}>Cancel</Text>
        </Button>
      </View>
    </BottomSheetModal>
  );
}
