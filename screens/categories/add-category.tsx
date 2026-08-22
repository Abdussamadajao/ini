import { useCreateCategory } from "@/actions/categories";
import { makeStyles, useTheme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CATEGORY_ICONS,
  CategoryForm,
  CategoryFormValues,
  COLOR_SWATCHES,
} from "./category-form";

const initialValues: CategoryFormValues = {
  name: "",
  iconIndex: 0,
  colorIndex: 0,
  type: "EXPENSE",
};

export default function NewCategory() {
  const { colors } = useTheme();
  const styles = useStyles();
  const { mutateAsync: createCategory, isPending } = useCreateCategory();

  const handleSubmit = async (values: CategoryFormValues) => {
    await createCategory({
      name: values.name,
      icon: CATEGORY_ICONS[values.iconIndex],
      color: COLOR_SWATCHES[values.colorIndex],
      type: values.type,
    });
    router.back();
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={12}
        >
          <MaterialIcons
            name="arrow-back"
            size={20}
            style={styles.headerIcon}
          />
        </Pressable>
        <Text style={styles.headerTitle}>New Category</Text>
        <View style={styles.headerRight} />
      </View>

      <CategoryForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isLoading={isPending}
        submitButtonText="Create Category"
        title="New Category"
      />
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors, spacing, typography }) => ({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.screen,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing[2.5],
    paddingVertical: spacing[2],
    minHeight: 48,
    backgroundColor: colors.background.screen,
  },
  backBtn: {
    padding: spacing[2],
    width: 40,
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.Manrope.Bold,
  },
  headerIcon: {
    color: colors.text.primary,
  },
  headerRight: {
    width: 40,
  },
}));
