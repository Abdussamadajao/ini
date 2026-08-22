import { useDashboard } from "@/actions/dashboard";
import { CategoryIcon, Skeleton } from "@/components/shared";
import { formatPrice } from "@/lib/custom";
import { useColors } from "@/theme";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useBudgetsStyles, useHomeScreenStyles } from "./styles";
import { router } from "expo-router";
import type { BudgetItem } from "@/types"; // adjust import path/type name to match your actual budget item type

export function Budgets() {
  const colors = useColors();
  const styles = useBudgetsStyles();
  const homeStyles = useHomeScreenStyles();
  const { data: dashboard, isPending } = useDashboard();
  const budgets = dashboard?.budgets?.items ?? [];

  const renderBudget = ({ item: budget }: { item: BudgetItem }) => {
    const isOverBudget = budget.is_over_budget;
    const fillColor = isOverBudget
      ? colors.status.error.main
      : colors.primary.main;
    const statusColor = isOverBudget
      ? colors.status.error.main
      : colors.text.secondary;
    const statusText = isOverBudget ? "Over budget" : "Healthy";

    return (
      <View style={styles.budgetItem}>
        <View style={styles.budgetRow}>
          <View style={styles.budgetLeft}>
            <CategoryIcon
              icon={budget.category.icon}
              color={budget.category.color}
              size={22}
              withBackground
            />
            <Text style={styles.budgetName}>{budget.category.name}</Text>
          </View>

          <View style={styles.budgetRight}>
            <Text style={styles.budgetAmount}>
              {formatPrice(budget.spent)} / {formatPrice(budget.amount)}
            </Text>
            <Text style={styles.budgetPercent}>{budget.percentage}%</Text>
          </View>
        </View>

        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              {
                width: `${Math.min(budget.percentage, 100)}%`,
                backgroundColor: fillColor,
              },
            ]}
          />
        </View>

        <Text style={[styles.statusLabel, { color: statusColor }]}>
          {statusText}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={homeStyles.sectionHeader}>
        <Text style={homeStyles.sectionTitle}>Budgets</Text>
        <Pressable onPress={() => router.push("/budgets")}>
          <Text style={homeStyles.viewAll}>View all</Text>
        </Pressable>
      </View>

      {isPending ? (
        <View style={{ gap: 16 }}>
          {Array.from({ length: 2 }).map((_, i) => (
            <View key={i} style={styles.budgetItem}>
              <View style={styles.budgetRow}>
                <View style={styles.budgetLeft}>
                  <Skeleton width={30} height={30} borderRadius={15} />
                  <Skeleton width={80} height={14} />
                </View>
                <View style={styles.budgetRight}>
                  <Skeleton width={120} height={14} />
                </View>
              </View>
              <Skeleton width="100%" height={4} borderRadius={2} />
              <Skeleton width={60} height={12} />
            </View>
          ))}
        </View>
      ) : budgets.length === 0 ? (
        <View style={homeStyles.emptyWrap}>
          <Text style={homeStyles.emptyTitle}>No budgets yet</Text>
          <Text style={homeStyles.emptySubtitle}>
            Set up budgets to track your spending limits.
          </Text>
        </View>
      ) : (
        <FlatList
          data={budgets.slice(0, 2)}
          keyExtractor={(budget) => budget.id}
          renderItem={renderBudget}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
      )}
    </View>
  );
}
