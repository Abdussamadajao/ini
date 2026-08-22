// components/shared/action-modal.tsx
import BlurBackdrop, { BlurBackdropProps } from "./blur-backdrop";
import { useColors, makeStyles } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback } from "react";
import { Text, View } from "react-native";

export type ActionModalProps = {
  modalRef: React.RefObject<BottomSheetModal | null>;
  title: string;
  message: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  iconBackgroundColor?: string;
  hideIcon?: boolean;
  snapPoint?: string;
  children: React.ReactNode;
};

export function ActionModal({
  modalRef,
  title,
  message,
  icon = "info-outline",
  iconColor,
  iconBackgroundColor,
  hideIcon = false,
  snapPoint = "45%",
  children,
}: ActionModalProps) {
  const colors = useColors();
  const styles = useActionModalStyles();

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

  const finalIconColor = iconColor || colors.status.warning.main;
  const finalIconBg = iconBackgroundColor || colors.status.warning.surface;

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={[snapPoint]}
      enablePanDownToClose
      enableDismissOnClose
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      backgroundStyle={[
        styles.sheet,
        { backgroundColor: colors.background.surface },
      ]}
      handleIndicatorStyle={[
        styles.handle,
        { backgroundColor: colors.text.muted },
      ]}
    >
      <BottomSheetView style={styles.content}>
        <View style={styles.topSection}>
          {!hideIcon && (
            <View style={[styles.iconWrap, { backgroundColor: finalIconBg }]}>
              <MaterialIcons name={icon} size={28} color={finalIconColor} />
            </View>
          )}

          <Text style={[styles.title, { color: colors.text.primary }]}>
            {title}
          </Text>

          <Text style={[styles.message, { color: colors.text.secondary }]}>
            {message}
          </Text>
        </View>

        <View style={styles.childrenContainer}>{children}</View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const useActionModalStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
    sheet: {
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      borderTopWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: colors.border.default,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: -10 },
      shadowRadius: 30,
      elevation: 8,
    },
    handle: {
      width: 32,
      height: 4,
      borderRadius: radius.full,
      marginTop: spacing[2],
      alignSelf: "center",
    },

    content: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-between",
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
      paddingBottom: spacing[6],
    },

    topSection: {
      alignItems: "center",
    },

    iconWrap: {
      width: 56,
      height: 56,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing[3],
      borderWidth: 1,
      borderColor: colors.border.default,
    },

    title: {
      ...textMetrics("xl", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      marginBottom: spacing[1.5],
      textAlign: "center",
    },

    message: {
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.Medium,
      textAlign: "center",
      marginBottom: spacing[5],
      paddingHorizontal: spacing[2],
    },

    childrenContainer: {
      marginTop: spacing[3],
      flexDirection: "column",
      gap: spacing[2.5],
      width: "100%",
    },
  }),
);
