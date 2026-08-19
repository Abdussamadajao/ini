import { useDeleteCategory } from "@/actions/categories";
import { CategoryIcon, InlineError } from "@/components/shared";
import BlurBackdrop, {
  BlurBackdropProps,
} from "@/components/shared/blur-backdrop";
import { SkeletonListItem } from "@/components/shared/skeleton";
import { useToast } from "@/components/toasts";
import { useTheme } from "@/theme";
import { Category, CategoryType } from "@/types/categories";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { useCategoriesStyles } from "./categories-styles";

type CategoriesContentProps = {
  isRefetching: boolean;
  refetch: () => void;
  showError: boolean;
  queryError?: unknown;
  isLoading: boolean;
  categories?: Category[];
  filteredCategories: Category[];
  activeTab: CategoryType;
};

const GRID_COLUMNS = 3;
// const MAX_CUSTOM_CATEGORIES = 10;

type Section = {
  key: string;
  title: string;
  countLabel: string;
  data: Category[];
};

// --- Skeleton Loading Component ---
function CategoriesSkeleton() {
  const styles = useCategoriesStyles();

  // Create skeleton data for 6 items (2 rows of 3)
  const skeletonData = Array.from({ length: 6 }, (_, index) => ({
    id: `skeleton-${index}`,
  }));

  return (
    <FlatList
      data={skeletonData}
      keyExtractor={(item) => item.id}
      renderItem={() => (
        <View style={[styles.tile, styles.tileSurface]}>
          <View style={styles.tileIconWrap}>
            <SkeletonListItem />
          </View>
          <Text style={styles.tileTitle}> </Text>
          <View style={styles.colorDot} />
        </View>
      )}
      numColumns={GRID_COLUMNS}
      columnWrapperStyle={styles.gridRow}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    />
  );
}

export function CategoriesContent({
  isRefetching,
  refetch,
  showError,
  queryError,
  isLoading,
  categories,
  filteredCategories,
  activeTab,
}: CategoriesContentProps) {
  const { colors } = useTheme();
  const styles = useCategoriesStyles();
  const { toast } = useToast();

  const systemCategories = filteredCategories.filter((item) => item.is_system);
  const customCategories = filteredCategories.filter((item) => !item.is_system);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const modalRef = useRef<BottomSheetModal>(null);
  const { mutateAsync: deleteCategory, isPending: isDeleting } =
    useDeleteCategory(selectedCategory?.id ?? "");

  const handleLongPress = useCallback((category: Category) => {
    setSelectedCategory(category);
    modalRef.current?.present();
  }, []);

  const handleEdit = useCallback(() => {
    if (selectedCategory) {
      modalRef.current?.dismiss();
      router.push({
        pathname: "/edit-category",
        params: {
          id: selectedCategory.id,
          name: selectedCategory.name,
          icon: selectedCategory.icon,
          color: selectedCategory.color,
        },
      });
    }
  }, [selectedCategory]);

  const handleDelete = useCallback(async () => {
    if (!selectedCategory) return;
    try {
      await deleteCategory();
      toast.success("Category deleted successfully");
      modalRef.current?.dismiss();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete category";
      toast.error(errorMessage);
    }
  }, [selectedCategory, deleteCategory, toast]);

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

  const sections = useMemo<Section[]>(() => {
    const list: Section[] = [];
    if (systemCategories.length > 0) {
      list.push({
        key: "system",
        title: "System Categories",
        countLabel: `${systemCategories.length}`,
        data: systemCategories,
      });
    }
    if (customCategories.length > 0) {
      list.push({
        key: "custom",
        title: "Your Categories",
        countLabel: `${customCategories.length}`,
        data: customCategories,
      });
    }
    return list;
  }, [systemCategories, customCategories]);

  const renderCategoryTile = useCallback(
    ({ item: category }: { item: Category }) => (
      <Pressable
        onLongPress={() => handleLongPress(category)}
        delayLongPress={300}
        style={[styles.tile, styles.tileSurface]}
      >
        {category.is_system ? (
          <View style={styles.tileLockBadge}>
            <MaterialIcons name="lock" size={11} style={styles.lockIcon} />
          </View>
        ) : null}
        <View
          style={[
            styles.tileIconWrap,
            { backgroundColor: category.color + "22" },
          ]}
        >
          <CategoryIcon
            icon={category.icon}
            color={category.color}
            size={22}
            withBackground
          />
        </View>
        <Text style={styles.tileTitle} numberOfLines={1}>
          {category.name}
        </Text>
        <View style={[styles.colorDot, { backgroundColor: category.color }]} />
      </Pressable>
    ),
    [handleLongPress, styles],
  );

  const renderSection = useCallback(
    ({ item }: { item: Section }) => (
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{item.title}</Text>
          <Text style={styles.sectionCount}>{item.countLabel}</Text>
        </View>
        <FlatList
          key={`grid-${GRID_COLUMNS}`}
          data={item.data}
          keyExtractor={(cat) => cat.id}
          renderItem={renderCategoryTile}
          numColumns={GRID_COLUMNS}
          columnWrapperStyle={styles.gridRow}
          scrollEnabled={false}
        />
      </View>
    ),
    [renderCategoryTile, styles],
  );

  // --- Show Error State ---
  if (showError) {
    return (
      <InlineError
        error={queryError}
        title="Could not load categories"
        message="Pull to refresh or retry."
        onRetry={() => refetch()}
        style={styles.content}
      />
    );
  }

  // --- Show Loading State ---
  if (isLoading && !categories) {
    return (
      <FlatList
        data={
          sections.length > 0
            ? sections
            : [{ key: "loading", title: "", countLabel: "", data: [] }]
        }
        keyExtractor={(section) => section.key}
        renderItem={() => <CategoriesSkeleton />}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[colors.primary.main]}
          />
        }
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  // --- Show Content ---
  return (
    <>
      <FlatList
        data={sections}
        keyExtractor={(section) => section.key}
        renderItem={renderSection}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[colors.primary.main]}
          />
        }
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackTitle}>
              No {activeTab.toLowerCase()} categories
            </Text>
            <Text style={styles.feedbackSubtitle}>
              Add one to start organizing your transactions.
            </Text>
          </View>
        }
      />

      <Pressable
        style={styles.fab}
        onPress={() => router.push("/new-category")}
        accessibilityRole="button"
      >
        <MaterialIcons name="add" size={28} style={styles.fabIcon} />
      </Pressable>

      <BottomSheetModal
        ref={modalRef}
        snapPoints={["30%"]}
        enablePanDownToClose
        enableDismissOnClose
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        enableDynamicSizing={false}
        backgroundStyle={{
          backgroundColor: colors.background.surface,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.text.muted,
          width: 40,
          height: 4,
          marginTop: 10,
        }}
        backdropComponent={renderBackdrop}
      >
        <View style={{ padding: 24 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Manrope-Bold",
              color: colors.text.primary,
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            {selectedCategory?.name}
          </Text>

          <Pressable
            onPress={handleEdit}
            style={({ pressed }) => [
              {
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 16,
                paddingHorizontal: 20,
                borderRadius: 12,
                backgroundColor: pressed
                  ? colors.background.surfaceAlt
                  : colors.background.surface,
                marginBottom: 12,
              },
            ]}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.primary.main + "14",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 16,
              }}
            >
              <MaterialIcons
                name="edit"
                size={20}
                color={colors.primary.main}
              />
            </View>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Manrope-SemiBold",
                color: colors.text.primary,
              }}
            >
              Edit Category
            </Text>
          </Pressable>

          <Pressable
            onPress={handleDelete}
            disabled={isDeleting}
            style={({ pressed }) => [
              {
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 16,
                paddingHorizontal: 20,
                borderRadius: 12,
                backgroundColor: pressed
                  ? colors.background.surfaceAlt
                  : colors.background.surface,
                opacity: isDeleting ? 0.5 : 1,
              },
            ]}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.status.error.main + "14",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 16,
              }}
            >
              <MaterialIcons
                name="delete"
                size={20}
                color={colors.status.error.main}
              />
            </View>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Manrope-SemiBold",
                color: colors.status.error.main,
              }}
            >
              Delete Category
            </Text>
          </Pressable>
        </View>
      </BottomSheetModal>
    </>
  );
}
