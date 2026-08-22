import { Button } from "@/components/shared";
import { makeStyles, useTheme } from "@/theme";
import { CategoryType } from "@/types/categories";
import { MaterialIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Yup from "yup";

export type CategoryFormValues = {
  name: string;
  iconIndex: number;
  colorIndex: number;
  type: CategoryType;
};

export const CATEGORY_ICONS: (keyof typeof MaterialIcons.glyphMap)[] = [
  "folder",
  "directions-car",
  "restaurant",
  "shopping-bag",
  "description",
  "sports-esports",
  "favorite",
  "card-giftcard",
  "local-cafe",
  "home",
  "flight",
  "music-note",
  "fitness-center",
  "school",
  "local-gas-station",
  "theater-comedy",
  "work",
  "business",
  "construction",
  "factory",
  "hotel",
  "house",
  "apartment",
  "house-siding",
  "local-grocery-store",
  "local-hospital",
  "local-pharmacy",
  "local-atm",
  "local-parking",
  "local-taxi",
  "local-shipping",
  "local-dining",
  "local-bar",
  "local-movies",
  "local-play",
  "local-activity",
  "pets",
  "child-care",
  "elderly",
  "accessible",
] as const;

export const COLOR_SWATCHES = [
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#6B7280",
  "#a855f7",
  "#14b8a6",
  "#0ea5e9",
  "#6366f1",
  "#f43f5e",
  "#16a34a",
  "#f59e0b",
];

const schema = Yup.object({
  name: Yup.string().trim().required("Category name is required"),
});

type CategoryFormProps = {
  initialValues: CategoryFormValues;
  onSubmit: (values: CategoryFormValues) => void | Promise<void>;
  isLoading: boolean;
  submitButtonText: string;
  title: string;
};

export function CategoryForm({
  initialValues,
  onSubmit,
  isLoading,
  submitButtonText,
  title,
}: CategoryFormProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const [showAllIcons, setShowAllIcons] = useState(false);
  const visibleIcons = useMemo(
    () => (showAllIcons ? CATEGORY_ICONS : CATEGORY_ICONS.slice(0, 10)),
    [showAllIcons],
  );

  return (
    <Formik<CategoryFormValues>
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={async (values) => {
        await onSubmit(values);
      }}
      enableReinitialize
    >
      {({
        values,
        setFieldValue,
        handleChange,
        handleBlur,
        handleSubmit,
        errors,
        touched,
      }) => {
        const swatchColor = COLOR_SWATCHES[values.colorIndex];
        const nameError = touched.name && errors.name;

        return (
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={0}
          >
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.section}>
                <Text style={styles.fieldLabel}>Category Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    nameError ? styles.inputError : styles.inputDefault,
                  ]}
                  placeholder="e.g Fine Dining"
                  placeholderTextColor={colors.text.secondary}
                  value={values.name}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  autoCapitalize="words"
                />
                {nameError ? (
                  <Text
                    style={[
                      styles.errorText,
                      { color: colors.status.error.main },
                    ]}
                  >
                    {errors.name}
                  </Text>
                ) : null}
              </View>

              <View style={styles.section}>
                <Text style={styles.fieldLabel}>Type</Text>
                <View style={styles.typeSwitchRow}>
                  {(["INCOME", "EXPENSE"] as const).map((type) => {
                    const selected = values.type === type;
                    return (
                      <Pressable
                        key={type}
                        onPress={() => setFieldValue("type", type)}
                        style={[
                          styles.typeSwitchBtn,
                          selected
                            ? styles.typeSwitchBtnActive
                            : styles.typeSwitchBtnInactive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.typeSwitchText,
                            selected
                              ? styles.typeSwitchTextActive
                              : styles.typeSwitchTextInactive,
                          ]}
                        >
                          {type === "INCOME" ? "Income" : "Expense"}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.fieldLabel}>Select Icon</Text>
                  <Pressable onPress={() => setShowAllIcons((prev) => !prev)}>
                    <Text
                      style={[
                        styles.sectionHint,
                        { color: colors.primary.main },
                      ]}
                    >
                      {showAllIcons ? "Show Less" : "Browse All"}
                    </Text>
                  </Pressable>
                </View>
                <FlatList
                  data={visibleIcons}
                  numColumns={5}
                  keyExtractor={(item) => item}
                  scrollEnabled={false}
                  columnWrapperStyle={styles.iconGridRow}
                  style={styles.iconGrid}
                  renderItem={({ item: icon, index }) => {
                    const selected = values.iconIndex === index;
                    return (
                      <Pressable
                        style={[
                          styles.iconCell,
                          selected && {
                            backgroundColor: swatchColor,
                          },
                        ]}
                        onPress={() => setFieldValue("iconIndex", index)}
                      >
                        <MaterialIcons
                          name={icon}
                          size={24}
                          color={
                            selected
                              ? colors.primary.contrastText
                              : colors.text.primary
                          }
                        />
                      </Pressable>
                    );
                  }}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.fieldLabel}>Vault Color</Text>
                <FlatList
                  data={COLOR_SWATCHES}
                  numColumns={5}
                  keyExtractor={(item, index) => `${item}-${index}`}
                  scrollEnabled={false}
                  style={styles.colorGrid}
                  columnWrapperStyle={styles.colorGridRow}
                  renderItem={({ item: hex, index }) => {
                    const selected = values.colorIndex === index;
                    return (
                      <Pressable
                        style={[
                          styles.colorSwatch,
                          { backgroundColor: hex },
                          selected && styles.colorSwatchSelected,
                        ]}
                        onPress={() => setFieldValue("colorIndex", index)}
                      >
                        {selected && (
                          <MaterialIcons
                            name="check"
                            size={18}
                            color={colors.primary.contrastText}
                          />
                        )}
                      </Pressable>
                    );
                  }}
                />
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Button
                title={submitButtonText}
                onPress={() => handleSubmit()}
                style={styles.saveBtn}
                disabled={!values.name.trim()}
                loading={isLoading}
                textStyle={styles.saveBtnText}
              />
            </View>
          </KeyboardAvoidingView>
        );
      }}
    </Formik>
  );
}

const useStyles = makeStyles(({ colors, spacing, radius, typography }) => ({
  flex: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[6],
    paddingTop: spacing[2],
  },
  section: {
    marginBottom: spacing[5.5],
  },
  typeSwitchRow: {
    flexDirection: "row",
    backgroundColor: colors.background.surfaceAlt,
    borderColor: colors.border.default,
    borderRadius: radius.full,
    borderWidth: 1,
    padding: spacing[1],
  },
  typeSwitchBtn: {
    flex: 1,
    borderRadius: radius.full,
    paddingVertical: spacing[2.25],
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  typeSwitchBtnActive: {
    backgroundColor: colors.primary.main,
  },
  typeSwitchBtnInactive: {
    backgroundColor: "transparent",
  },
  typeSwitchText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.Manrope.SemiBold,
  },
  typeSwitchTextActive: {
    color: colors.primary.contrastText,
  },
  typeSwitchTextInactive: {
    color: colors.text.primary,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing[2.5],
  },
  sectionHint: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.Manrope.SemiBold,
  },
  fieldLabel: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.Manrope.SemiBold,
    marginBottom: spacing[2],
  },
  input: {
    backgroundColor: colors.background.surface,
    color: colors.text.primary,
    paddingHorizontal: spacing[3.5],
    paddingVertical: spacing[3],
    borderRadius: radius.lg,
    borderWidth: 1,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.Manrope.Medium,
  },
  inputDefault: {
    borderColor: colors.border.default,
  },
  inputError: {
    borderColor: colors.status.error.main,
  },
  errorText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.Manrope.Medium,
    marginTop: spacing[1],
  },
  iconGrid: {},
  iconGridRow: {
    flexDirection: "row",
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  iconCell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.background.surface,
  },
  colorGrid: {
    marginTop: spacing[1],
  },
  colorGridRow: {
    flexDirection: "row",
    gap: spacing[2.5],
    marginBottom: spacing[2.5],
  },
  colorSwatch: {
    width: 63,
    height: 63,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  colorSwatchSelected: {
    borderWidth: 2,
    borderColor: colors.primary.contrastText,
  },
  footer: {
    backgroundColor: colors.background.screen,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[3],
    paddingBottom: spacing[12],
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[2],
    borderRadius: radius.full,
    minHeight: 52,
    backgroundColor: colors.primary.main,
  },
  saveBtnText: {
    color: colors.primary.contrastText,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.Manrope.Bold,
  },
}));
