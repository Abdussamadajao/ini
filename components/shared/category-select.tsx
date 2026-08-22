import { useCategories } from "@/actions";
import { Select } from "@/components/form/select";
import { makeStyles, useTheme } from "@/theme";
import { CategoryType } from "@/types/categories";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useField } from "formik";
import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { InlineError } from "./error";

type FormikCategorySelectProps = {
  name: string;
  categoryType: CategoryType;
  label?: string;
  placeholder?: string;
  modalTitle?: string;
  required?: boolean;
  showFormikError?: boolean;
  onCategoryChange?: (category: { id: string; name: string } | null) => void;
  onAddCustomCategory?: () => void;
};

function isValidMaterialIcon(
  name: string,
): name is keyof typeof MaterialIcons.glyphMap {
  return name in MaterialIcons.glyphMap;
}

export function FormikCategorySelect({
  name,
  categoryType,
  label = "CATEGORY",
  placeholder = "Select category",
  modalTitle = "Select Category",
  required = false,
  showFormikError = true,
  onCategoryChange,
  onAddCustomCategory,
}: FormikCategorySelectProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const {
    data: categoriesData,
    isLoading,
    isError: isCategoriesError,
    error: categoriesQueryError,
    refetch: refetchCategories,
  } = useCategories();
  const [field, meta, helpers] = useField<string>({
    name,
    validate: (val) => {
      const empty = !val || val.trim() === "";
      if (!required && empty) return undefined;
      if (required && empty) return "Required";
      return undefined;
    },
  });

  const filtered = useMemo(
    () =>
      (categoriesData ?? []).filter(
        (category) => category.type === categoryType,
      ),
    [categoriesData, categoryType],
  );

  const error =
    showFormikError && meta.touched
      ? (meta.error as string | undefined)
      : undefined;
  const selectedCategory =
    filtered.find((category) => category.id === (field.value || "")) ?? null;

  // Determine if select should be disabled
  const isDisabled = isLoading || (isCategoriesError && !categoriesData);

  // Determine placeholder text
  const getPlaceholder = () => {
    if (isLoading) return "Loading categories...";
    if (isCategoriesError && !categoriesData) return "Error loading categories";
    if (filtered.length === 0) return "No categories available";
    return placeholder;
  };

  return (
    <Select
      value={field.value || null}
      onChange={(value) => {
        const nextValue = value ?? "";
        helpers.setValue(nextValue);
        helpers.setTouched(true);
        const selected =
          filtered.find((category) => category.id === nextValue) ?? null;
        onCategoryChange?.(
          selected ? { id: selected.id, name: selected.name } : null,
        );
      }}
      label={label}
      placeholder={getPlaceholder()}
      modalTitle={modalTitle}
      modalHeaderRight={(closeModal) => (
        <Pressable
          style={[
            styles.addCustomBtn,
            {
              borderColor: colors.primary.main,
              backgroundColor: `${colors.primary.main}14`,
            },
          ]}
          onPress={() => {
            closeModal();
            if (onAddCustomCategory) {
              onAddCustomCategory();
              return;
            }
            router.push("/new-category");
          }}
        >
          <Text
            style={[styles.addCustomBtnText, { color: colors.primary.main }]}
          >
            Add custom category
          </Text>
        </Pressable>
      )}
      listDisabled={isDisabled}
      disabled={isDisabled}
      error={error}
      leftIcon={
        selectedCategory ? (
          <View
            style={[
              styles.selectedIconWrap,
              { backgroundColor: selectedCategory.color + "30" },
            ]}
          >
            <MaterialIcons
              name={
                isValidMaterialIcon(selectedCategory.icon)
                  ? selectedCategory.icon
                  : "receipt-long"
              }
              size={14}
              color={selectedCategory.color || colors.primary.main}
            />
          </View>
        ) : undefined
      }
      options={filtered.map((category) => ({
        value: category.id,
        label: category.name,
        children: (
          <View style={styles.optionRow}>
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: category.color + "30" },
              ]}
            >
              <MaterialIcons
                name={
                  isValidMaterialIcon(category.icon)
                    ? category.icon
                    : "receipt-long"
                }
                size={18}
                color={category.color || colors.primary.main}
              />
            </View>
            <Text style={[styles.optionLabel, { color: colors.text.primary }]}>
              {category.name}
            </Text>
          </View>
        ),
      }))}
      renderListHeader={() => (
        <>
          {isLoading ? (
            <Text style={[styles.infoText, { color: colors.text.secondary }]}>
              Loading categories...
            </Text>
          ) : null}
          {isCategoriesError && categoriesData === undefined ? (
            <InlineError
              error={categoriesQueryError}
              onRetry={refetchCategories}
              retryLabel="Retry"
            />
          ) : null}
          {!isLoading && !isCategoriesError && filtered.length === 0 ? (
            <Text style={[styles.infoText, { color: colors.text.secondary }]}>
              No {categoryType.toLowerCase()} categories available
            </Text>
          ) : null}
        </>
      )}
    />
  );
}

export default FormikCategorySelect;

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
    optionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[3],
      minHeight: 40,
    },
    iconWrap: {
      width: 30,
      height: 30,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
    },
    optionLabel: {
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.Medium,
    },
    infoText: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Medium,
      marginBottom: 10,
    },
    addCustomBtn: {
      paddingHorizontal: spacing[3],
      height: 32,
      borderRadius: radius.full,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    addCustomBtnText: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },
    selectedIconWrap: {
      width: 24,
      height: 24,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
    },
  }),
);
