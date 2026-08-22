// components/TransactionDeleteModal.tsx
import { Button } from "@/components/shared";
import BlurBackdrop, {
  BlurBackdropProps,
} from "@/components/shared/blur-backdrop";
import { useColors, makeStyles } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useCallback } from "react";
import { Text, View } from "react-native";

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
  const colors = useColors();
  const styles = useTransactionDeleteModalStyles();

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
      snapPoints={["40%"]}
      enablePanDownToClose
      enableDismissOnClose
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      backgroundStyle={[
        styles.deleteSheet,
        { backgroundColor: colors.background.surface },
      ]}
      handleIndicatorStyle={[styles.deleteHandle]}
    >
      <BottomSheetScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {/* Delete Icon */}
          <View style={styles.deleteIconWrap}>
            <MaterialIcons
              name="delete-outline"
              size={28}
              color={colors.status.error.main}
            />
          </View>

          {/* Title */}
          <Text style={styles.deleteTitle}>Delete transaction?</Text>

          {/* Message */}
          <Text style={styles.deleteMessage}>
            {isExpense
              ? "This transaction will be permanently removed. It will restore the balance to your account."
              : "This transaction will be permanently removed."}
          </Text>
        </View>
        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Delete"
            onPress={onConfirmDelete}
            variant="danger"
            loading={isDeleting}
            disabled={isDeleting}
          />

          <Button
            title="Cancel"
            onPress={onCancel}
            variant="tertiary"
            appearance="outline"
            disabled={isDeleting}
          />
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const useTransactionDeleteModalStyles = makeStyles(
  ({ colors, spacing, radius, typography }) => ({
    // Bottom Sheet
    deleteSheet: {
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      borderTopWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: colors.background.screen,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: -10 },
      shadowRadius: 30,
      elevation: 8,
    },
    deleteHandle: {
      width: 32,
      height: 4,
      borderRadius: radius.full,
      marginTop: spacing[2],
      backgroundColor: colors.text.secondary,
    },

    // Scroll View
    scrollView: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
      flexGrow: 1,
    },
    scrollContent: {
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: spacing[6],
      height: "100%",
    },

    // Delete Icon
    deleteIconWrap: {
      width: 56,
      height: 56,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing[3],
      borderWidth: 1,
      backgroundColor: colors.status.error.contrastText,
      borderColor: colors.border.subtle,
      marginHorizontal: "auto",
    },

    // Title
    deleteTitle: {
      fontSize: typography.fontSize.xl,
      fontFamily: typography.fontFamily.Manrope.Bold,
      marginBottom: spacing[1.5],
      textAlign: "center",
      color: colors.text.primary,
    },

    // Message
    deleteMessage: {
      fontSize: typography.fontSize.md,
      fontFamily: typography.fontFamily.Manrope.Medium,
      textAlign: "center",
      marginBottom: spacing[5],
      paddingHorizontal: spacing[2],
      lineHeight: 24,
      color: colors.text.secondary,
    },

    // Button Container
    buttonContainer: {
      flexDirection: "column",
      gap: spacing[2.5],
      width: "100%",
      paddingHorizontal: spacing[1],
    },

    // Delete Button
    deletePrimaryBtn: {
      width: "100%",
      paddingVertical: spacing[3.5],
      borderRadius: radius.lg,
      alignItems: "center",
      justifyContent: "center",
    },
    deletePrimaryBtnText: {
      fontSize: typography.fontSize.lg,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      color: colors.text.inverse,
    },

    // Cancel Button
    deleteCancelBtn: {
      width: "100%",
      paddingVertical: spacing[3.5],
      borderRadius: radius.lg,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      backgroundColor: "transparent",
    },
    deleteCancelBtnText: {
      fontSize: typography.fontSize.lg,
      fontFamily: typography.fontFamily.Manrope.Medium,
      color: colors.text.primary,
    },
  }),
);
