import { Header, SafeArea } from "@/components/shared";
import { formatPrice } from "@/lib";
import { useColors, useTheme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { activeBudgets, Budget } from "./arr";
import { useBudgetStyles } from "./styles";
const { width } = Dimensions.get("window");

const Budgets = () => {
  const colors = useColors();
  const theme = useTheme();
  const styles = useBudgetStyles();
  const [selectedPeriod, setSelectedPeriod] = useState("This month");

  const totalBudget = activeBudgets.reduce((sum, b) => sum + b.total, 0);

  const getProgress = (spent: number, total: number) => {
    return Math.min((spent / total) * 100, 100);
  };

  const renderBudgetCard = (budget: Budget) => {
    const progress = getProgress(budget.spent, budget.total);
    const isOverBudget = budget.spent > budget.total;
    const remaining = Math.abs(budget.total - budget.spent);
    const cardStyle = isOverBudget
      ? styles.budgetCardOverBudget
      : styles.budgetCard;

    return (
      <TouchableOpacity key={budget.id} style={cardStyle} activeOpacity={0.7}>
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
                name={budget.icon as any}
                size={20}
                color={
                  isOverBudget ? colors.status.error.main : colors.primary.main
                }
              />
            </View>
            <Text style={styles.budgetName}>{budget.name}</Text>
          </View>
          <View style={styles.budgetAmountContainer}>
            <Text
              style={[
                styles.budgetSpent,
                isOverBudget && styles.budgetSpentOverBudget,
              ]}
            >
              {formatPrice(budget.spent)}
            </Text>
            <Text style={styles.budgetTotal}>
              of {formatPrice(budget.total)}
            </Text>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: isOverBudget
                  ? colors.status.error.main
                  : colors.primary.main,
              },
            ]}
          />
        </View>

        <View style={styles.budgetFooter}>
          <Text
            style={[
              styles.budgetRemaining,
              isOverBudget && styles.budgetRemainingOverBudget,
            ]}
          >
            {isOverBudget ? (
              <View style={styles.warningContainer}>
                <MaterialIcons
                  name="warning"
                  size={16}
                  color={colors.status.error.main}
                />
                <Text style={styles.budgetRemainingOverBudget}>
                  {formatPrice(remaining)} over budget
                </Text>
              </View>
            ) : (
              `${formatPrice(remaining)} remaining`
            )}
          </Text>
          <TouchableOpacity style={styles.detailsContainer} activeOpacity={0.7}>
            <Text
              style={[
                styles.detailsText,
                isOverBudget
                  ? styles.detailsTextOverBudget
                  : styles.detailsTextNormal,
              ]}
            >
              DETAILS
            </Text>
            <MaterialIcons
              name="chevron-right"
              size={16}
              color={
                isOverBudget ? colors.status.error.main : colors.primary.main
              }
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeArea>
      <Header title="Budgets" desc="Manage your spending limits" />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <TouchableOpacity style={styles.periodButton} activeOpacity={0.7}>
            <Text style={styles.periodButtonText}>{selectedPeriod}</Text>
            <MaterialIcons
              name="expand-more"
              size={18}
              color={colors.text.primary}
            />
          </TouchableOpacity>
          <Text style={styles.totalText}>
            Total: {formatPrice(totalBudget)}
          </Text>
        </View>

        {/* Active Budgets */}
        <View style={styles.activeSection}>
          <Text style={styles.sectionTitle}>Active Budgets</Text>
          <View style={styles.budgetsGrid}>
            {activeBudgets.map(renderBudgetCard)}
          </View>
        </View>

        {/* Archived Section */}
        <TouchableOpacity style={styles.archivedSection} activeOpacity={0.7}>
          <Text style={styles.archivedTitle}>Archived</Text>
          <View style={styles.archivedContent}>
            <Text style={styles.archivedCount}>3 budgets</Text>
            <MaterialIcons
              name="chevron-right"
              size={20}
              color={colors.text.secondary}
            />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { icon: "home", label: "Home" },
          { icon: "history", label: "History" },
          { icon: "add-circle", label: "Add" },
          { icon: "analytics", label: "Reports", active: true },
          { icon: "person", label: "Profile" },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.navItem, item.active && styles.navItemActive]}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={item.icon as any}
              size={24}
              color={item.active ? colors.primary.main : colors.text.secondary}
            />
            <Text
              style={[styles.navLabel, item.active && styles.navLabelActive]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeArea>
  );
};

export default Budgets;
