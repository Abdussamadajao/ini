import { makeStyles, useIsDark, useTheme } from "@/theme";
import { SourceItem } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useField } from "formik";
import React, { useMemo, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { InlineError } from "./error";
import { IncomeSourcesModal } from "./income-sources-modal";

type FormikIncomeSourceSelectProps = {
  name: string;
  label?: string;
  placeholder?: string;
  modalTitle?: string;
  required?: boolean;
  showFormikError?: boolean;
  sources: SourceItem[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onAddCustom?: () => void;
  onIncomeChange?: (source: SourceItem | null) => void;
  showProgress?: boolean;
};

function isValidMaterialIcon(
  icon: string,
): icon is keyof typeof MaterialIcons.glyphMap {
  return icon in MaterialIcons.glyphMap;
}

export function FormikIncomeSourceSelect({
  name,
  label = "INCOME SOURCE",
  placeholder = "Select income source",
  modalTitle = "Select Income Source",
  required = false,
  showFormikError = true,
  sources,
  isLoading = false,
  isError = false,
  error = null,
  onRetry,
  onAddCustom,
  onIncomeChange,
  showProgress = false,
}: FormikIncomeSourceSelectProps) {
  const { colors } = useTheme();
  const isDark = useIsDark();
  const styles = useStyles();
  const modalRef = useRef<BottomSheetModal>(null);
  const [field, meta, helpers] = useField<string>({
    name,
    validate: (val) => {
      const empty = !val || val.trim() === "";
      if (!required && empty) return undefined;
      if (required && empty) return "Required";
      return undefined;
    },
  });

  // Track selected ID in modal state (separate from form state)
  const [selectedSourceId, setSelectedSourceId] = useState<string>(
    field.value || "",
  );

  // Track if modal is open to know when to sync state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const errorText =
    showFormikError && meta.touched
      ? (meta.error as string | undefined)
      : undefined;

  const selectedSource = useMemo(
    () => sources.find((source) => source.id === (field.value || "")) ?? null,
    [sources, field.value],
  );

  const handleOpenModal = () => {
    if (isLoading || isError || sources.length === 0) return;
    // Sync the selected ID with the form value when opening
    setSelectedSourceId(field.value || "");
    setIsModalOpen(true);
    modalRef.current?.present();
  };

  const handleSelectIncome = (id: string) => {
    setSelectedSourceId(id);
    // Don't close modal, just update selection
  };

  const handleConfirm = () => {
    const selected = sources.find((source) => source.id === selectedSourceId);
    if (selected) {
      helpers.setValue(selected.id);
      helpers.setTouched(true);
      onIncomeChange?.(selected);
    }
    setIsModalOpen(false);
    modalRef.current?.dismiss();
  };

  const handleDismiss = () => {
    setIsModalOpen(false);
    // Reset to the current form value if modal is dismissed without confirming
    setSelectedSourceId(field.value || "");
  };

  const handleAddCustom = () => {
    modalRef.current?.dismiss();
    setIsModalOpen(false);
    onAddCustom?.();
  };

  const getDisplayText = () => {
    if (isLoading) return "Loading sources...";
    if (sources.length === 0) return "No income sources available";
    if (!selectedSource) return placeholder;
    return selectedSource.label;
  };

  const renderIcon = (source: SourceItem) => {
    if (typeof source.icon === "string" && isValidMaterialIcon(source.icon)) {
      return (
        <MaterialIcons
          name={source.icon}
          size={16}
          color={colors.primary.main}
        />
      );
    }
    return <Text style={styles.selectedEmoji}>{source.icon}</Text>;
  };

  return (
    <>
      <View style={styles.container}>
        {label && (
          <Text style={[styles.label, { color: colors.text.secondary }]}>
            {label}
            {required && <Text style={styles.requiredStar}> *</Text>}
          </Text>
        )}

        <Pressable
          style={[
            styles.selectTrigger,
            {
              borderColor: errorText
                ? colors.status.error.main
                : colors.border.default,
              backgroundColor: isDark
                ? colors.background.surface
                : colors.background.surfaceAlt,
            },
            (isLoading || isError || sources.length === 0) &&
              styles.selectTriggerDisabled,
          ]}
          onPress={handleOpenModal}
          disabled={isLoading || isError || sources.length === 0}
        >
          <View style={styles.triggerContent}>
            {selectedSource ? (
              <View style={styles.triggerLeft}>
                <View
                  style={[
                    styles.selectedIconWrap,
                    { backgroundColor: `${colors.primary.main}20` },
                  ]}
                >
                  {renderIcon(selectedSource)}
                </View>
                <Text
                  style={[styles.triggerText, { color: colors.text.primary }]}
                  numberOfLines={1}
                >
                  {getDisplayText()}
                </Text>
                {selectedSource.remaining !== undefined && (
                  <Text
                    style={[
                      styles.remainingText,
                      { color: colors.text.secondary },
                    ]}
                  >
                    {formatPrice(selectedSource.remaining)} remaining
                  </Text>
                )}
              </View>
            ) : (
              <Text
                style={[
                  styles.triggerPlaceholder,
                  { color: colors.text.muted },
                ]}
              >
                {getDisplayText()}
              </Text>
            )}
            <MaterialIcons
              name={isLoading ? "more-horiz" : "expand-more"}
              size={24}
              color={colors.text.secondary}
            />
          </View>
        </Pressable>

        {errorText && (
          <Text style={[styles.errorText, { color: colors.status.error.main }]}>
            {errorText}
          </Text>
        )}

        {isError && !isLoading && (
          <InlineError error={error} onRetry={onRetry} retryLabel="Retry" />
        )}
      </View>

      {/* Income Sources Modal */}
      <IncomeSourcesModal
        modalRef={modalRef}
        sources={sources}
        selectedIncomeId={selectedSourceId}
        onSelectIncome={handleSelectIncome}
        onConfirm={handleConfirm}
        onDismiss={handleDismiss}
        title={modalTitle}
        showProgress={showProgress}
        onCreateNew={handleAddCustom}
        // isOpen={isModalOpen}
      />
    </>
  );
}

// Helper function to format price
const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// ─── Theme‑aware styles ────────────────────────────

const useStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
    container: {
      marginBottom: spacing[4],
    },
    label: {
      ...textMetrics("xs", "snug"),
      fontWeight: typography.fontWeight.bold,
      textTransform: "uppercase" as const,
      letterSpacing: 0.5,
      marginBottom: spacing[2],
      fontFamily: typography.fontFamily.Manrope.Bold,
    },
    requiredStar: {
      color: colors.status.error.main,
    },
    selectTrigger: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[3],
      borderRadius: radius.md,
      borderWidth: 1,
      height: 56,
    },
    selectTriggerDisabled: {
      opacity: 0.6,
    },
    triggerContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      flex: 1,
    },
    triggerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[2],
      flex: 1,
    },
    selectedIconWrap: {
      width: 28,
      height: 28,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
    },
    selectedEmoji: {
      fontSize: 16,
    },
    triggerText: {
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.Regular,
      flex: 1,
    },
    triggerPlaceholder: {
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.Regular,
    },
    remainingText: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Regular,
      marginLeft: spacing[1],
    },
    errorText: {
      ...textMetrics("sm", "snug"),
      marginTop: spacing[1],
      fontFamily: typography.fontFamily.Manrope.Regular,
    },
  }),
);
