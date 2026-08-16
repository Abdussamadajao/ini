import { useCategory, useUpdateCategory } from "@/actions/categories";
import { InlineError } from "@/components/shared";
import Skeleton from "@/components/shared/skeleton";
import { makeStyles, useTheme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CATEGORY_ICONS,
  CategoryForm,
  CategoryFormValues,
  COLOR_SWATCHES,
} from "./category-form";

export default function EditCategory() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const styles = useStyles();

  const { data: category, isLoading, isError, error } = useCategory(id ?? "");

  const { mutateAsync: updateCategory, isPending } = useUpdateCategory(
    id ?? "",
  );

  const initialValues = useMemo<CategoryFormValues | null>(() => {
    if (!category) return null;

    const iconIndex = CATEGORY_ICONS.findIndex(
      (icon) => icon === category.icon,
    );
    const colorIndex = COLOR_SWATCHES.findIndex(
      (color) => color === category.color,
    );

    return {
      name: category.name,
      iconIndex: iconIndex >= 0 ? iconIndex : 0,
      colorIndex: colorIndex >= 0 ? colorIndex : 0,
      type: category.type,
    };
  }, [category]);

  const handleSubmit = async (values: CategoryFormValues) => {
    try {
      await updateCategory({
        name: values.name,
        icon: CATEGORY_ICONS[values.iconIndex],
        color: COLOR_SWATCHES[values.colorIndex],
      });
      router.back();
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  if (!id) {
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
          <Text style={styles.headerTitle}>Edit Category</Text>
          <View style={styles.headerRight} />
        </View>
        <InlineError
          title="Missing category"
          message="Open this screen from a category."
        />
      </SafeAreaView>
    );
  }

  if (isLoading) {
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
          <Text style={styles.headerTitle}>Edit Category</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          <Skeleton width="100%" height={56} borderRadius={12} />
          <Skeleton
            width="100%"
            height={120}
            borderRadius={16}
            style={{ marginTop: 24 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !category) {
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
          <Text style={styles.headerTitle}>Edit Category</Text>
          <View style={styles.headerRight} />
        </View>
        <InlineError
          error={error}
          title="Could not load category"
          message="Try again or go back."
        />
      </SafeAreaView>
    );
  }

  if (!initialValues) return null;

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
        <Text style={styles.headerTitle}>Edit Category</Text>
        <View style={styles.headerRight} />
      </View>

      <CategoryForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isLoading={isPending}
        submitButtonText="Update Category"
        title="Edit Category"
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
