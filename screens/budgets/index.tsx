import {
  ActionModal,
  Button,
  ErrorState,
  Header,
  SafeArea,
  Skeleton,
} from "@/components/shared";
import { formatPrice } from "@/lib";
import { useColors, useTheme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useRef, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useBudgetStyles } from "./styles";
import { useBudgetMutation, useBudgets } from "@/actions/budgets";
import { BudgetFilters, BudgetResponse } from "@/types";
import BudgetsFilterModal, { defaultBudgetFilter } from "./filter-modal";
import { router } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

const PERIOD_LABELS: Record<string, string> = {
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

const Budgets = () => {
  const colors = useColors();
  const modalRef = useRef<BottomSheetModal>(null);
  const styles = useBudgetStyles();
  const [filters, setFilters] = useState<BudgetFilters>(defaultBudgetFilter);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<BudgetResponse | null>(
    null,
  );
  const {
    archiveBudgetMutation,
    deleteBudgetsMutation,
    restoreBudgetMutation,
  } = useBudgetMutation();
  const { data, isPending, error, refetch } = useBudgets(filters);
  const allBudgets = data?.data ?? [];

  const budgets = filters.archived
    ? allBudgets
    : allBudgets.filter((b) => !b.is_archived);

  const periodLabel = filters.period
    ? PERIOD_LABELS[filters.period]
    : "All periods";
  const hasActiveFilters = Boolean(
    filters.period ||
    filters.category_id ||
    filters.income_id ||
    filters.archived,
  );

  const handleLongPress = useCallback((budget: BudgetResponse) => {
    setSelectedBudget(budget);
    modalRef.current?.present();
  }, []);

  const handleArchive = async () => {
    if (!selectedBudget) return;

    await archiveBudgetMutation.mutateAsync(selectedBudget.id);
    modalRef.current?.dismiss();
    refetch();
  };

  const handleRestore = useCallback(async () => {
    if (!selectedBudget) return;

    await restoreBudgetMutation.mutateAsync(selectedBudget.id);
    modalRef.current?.dismiss();
    refetch();
  }, [selectedBudget, restoreBudgetMutation, refetch]);

  const handleDelete = useCallback(async () => {
    if (!selectedBudget) return;

    await deleteBudgetsMutation.mutateAsync(selectedBudget.id);
    modalRef.current?.dismiss();
    refetch();
  }, [selectedBudget, deleteBudgetsMutation, refetch]);

  // Calculate total
  const totalBudget = budgets.reduce((sum, b) => {
    const amount = Number(b.amount) || 0;
    return sum + amount;
  }, 0);

  const renderBudgetCard = ({ item: budget }: { item: BudgetResponse }) => {
    const spent = budget.spent || 0;
    const total = budget.amount || 0;

    const isOverBudget = budget.is_over_budget;

    const cardStyle = isOverBudget
      ? styles.budgetCardOverBudget
      : styles.budgetCard;
    const isArchived = budget.is_archived;

    return (
      <TouchableOpacity
        style={cardStyle}
        activeOpacity={0.7}
        onPress={() =>
          router.push({
            pathname: "/budget/[id]",
            params: { id: budget?.id },
          })
        }
        onLongPress={() => handleLongPress(budget)}
        delayLongPress={300}
      >
        <View style={styles.budgetHeader}>
          <View style={styles.budgetTitleContainer}>
            <View
              style={[
                styles.budgetIconContainer,
                isOverBudget
                  ? styles.budgetIconOverBudget
                  : styles.budgetIconNormal,
              ]}
            >
              <MaterialIcons
                name={budget.category.icon as any}
                size={20}
                color={
                  isOverBudget
                    ? colors.status.error.main
                    : isArchived
                      ? colors.text.muted
                      : colors.primary.main
                }
              />
            </View>
            <Text style={[styles.budgetName]}>
              {budget.category.name}
              {isArchived && " (Archived)"}
            </Text>
          </View>
          <View style={styles.budgetAmountContainer}>
            <Text
              style={[
                styles.budgetSpent,
                isOverBudget && styles.budgetSpentOverBudget,
              ]}
            >
              {formatPrice(spent)}
            </Text>
            <Text style={[styles.budgetTotal]}>of {formatPrice(total)}</Text>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.min(budget.percent_used, 100)}%`,
                backgroundColor: isOverBudget
                  ? colors.status.error.main
                  : isArchived
                    ? colors.text.muted
                    : colors.primary.main,
              },
            ]}
          />
        </View>

        <View style={styles.budgetFooter}>
          {isArchived ? (
            <Text style={styles.budgetArchivedText}>Archived</Text>
          ) : isOverBudget ? (
            <View style={styles.warningContainer}>
              <MaterialIcons
                name="warning"
                size={16}
                color={colors.status.error.main}
              />
              <Text style={styles.budgetRemainingOverBudget}>
                {formatPrice(budget.remaining)} over budget
              </Text>
            </View>
          ) : (
            <Text style={styles.budgetRemaining}>
              {formatPrice(budget.remaining)} remaining
            </Text>
          )}
          {/* <TouchableOpacity
            style={styles.detailsContainer}
            activeOpacity={0.7}
            onPress={() =>}
          >
            <Text
              style={[
                styles.detailsText,
                isOverBudget
                  ? styles.detailsTextOverBudget
                  : isArchived
                    ? styles.detailsTextArchived
                    : styles.detailsTextNormal,
              ]}
            >
              DETAILS
            </Text>
            <MaterialIcons
              name="chevron-right"
              size={16}
              color={
                isOverBudget
                  ? colors.status.error.main
                  : isArchived
                    ? colors.text.muted
                    : colors.primary.main
              }
            />
          </TouchableOpacity> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Loading State
  if (isPending) {
    return (
      <SafeArea>
        <Header
          title="Budgets"
          desc="Manage your spending limits"
          titleSize="large"
        />
        <View style={styles.container}>
          <View style={styles.periodSelector}>
            <Skeleton width={120} height={36} borderRadius={18} />
            <Skeleton width={150} height={20} borderRadius={10} />
          </View>

          <View style={styles.activeSection}>
            <Skeleton width={140} height={20} borderRadius={10} />
            <View style={{ gap: 16, marginTop: 16 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <View key={i}>
                  <Skeleton width="100%" height={120} borderRadius={12} />
                </View>
              ))}
            </View>
          </View>
        </View>
      </SafeArea>
    );
  }

  // Error State
  if (error) {
    return (
      <SafeArea>
        <Header title="Budgets" desc="Manage your spending limits" />
        <ErrorState
          error={error}
          title="Could not load budgets"
          message="Please check your connection and try again."
        />
      </SafeArea>
    );
  }

  const isArchived = selectedBudget?.is_archived;

  return (
    <SafeArea>
      <Header title="Budgets" desc="Manage your spending limits" />
      <FlatList
        style={styles.container}
        data={budgets}
        keyExtractor={(item) => item.id}
        renderItem={renderBudgetCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListHeaderComponent={
          <>
            <View style={styles.periodSelector}>
              <TouchableOpacity
                style={styles.periodButton}
                activeOpacity={0.7}
                onPress={() => setFilterVisible(true)}
              >
                <Text style={styles.periodButtonText}>{periodLabel}</Text>
                <MaterialIcons
                  name="expand-more"
                  size={18}
                  color={colors.text.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setFilterVisible(true)}
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <MaterialIcons
                  name="filter-list"
                  size={20}
                  color={
                    hasActiveFilters
                      ? colors.primary.main
                      : colors.text.secondary
                  }
                />
                <Text style={styles.totalText}>
                  Total: {formatPrice(totalBudget)}
                </Text>
              </TouchableOpacity>
            </View>

            {budgets.length > 0 && (
              <Text style={styles.sectionTitle}>Active Budgets</Text>
            )}
          </>
        }
        ListEmptyComponent={
          <View
            style={{
              paddingHorizontal: 40,
              alignItems: "center",
              marginTop: 60,
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: colors.background.surface,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <MaterialIcons
                name="account-balance-wallet"
                size={40}
                color={colors.text.secondary}
              />
            </View>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Manrope-Bold",
                color: colors.text.primary,
                marginBottom: 8,
              }}
            >
              No budgets found
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Manrope-Regular",
                color: colors.text.secondary,
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              {hasActiveFilters
                ? "Try adjusting your filters to see more budgets."
                : "Create your first budget to start tracking your spending limits and stay on top of your finances."}
            </Text>
          </View>
        }
      />
      <BudgetsFilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setFilters}
        initial={filters}
      />

      <ActionModal
        modalRef={modalRef}
        title="Select an action"
        snapPoint="36"
        message={
          isArchived
            ? "This budget is archived. Choose an action below."
            : "This budget is active. Choose an action below."
        }
        hideIcon={true}
      >
        {isArchived ? (
          <Button
            title="Restore"
            onPress={handleRestore}
            variant="primary"
            loading={restoreBudgetMutation.isPending}
            disabled={restoreBudgetMutation.isPending}
            flex
          />
        ) : (
          <Button
            title="Archive"
            onPress={handleArchive}
            variant="warning"
            appearance="outline"
            loading={archiveBudgetMutation.isPending}
            disabled={archiveBudgetMutation.isPending}
          />
        )}

        <Button
          title="Delete"
          onPress={handleDelete}
          variant="danger"
          loading={deleteBudgetsMutation.isPending}
          disabled={deleteBudgetsMutation.isPending}
        />

        <Button
          title="Cancel"
          onPress={() => modalRef.current?.dismiss()}
          variant="tertiary"
          appearance="outline"
          disabled={deleteBudgetsMutation.isPending}
        />
      </ActionModal>
    </SafeArea>
  );
};

export default Budgets;
