// screens/budget-detail.tsx
import React, { useMemo } from "react";
import { View, Text, ScrollView, FlatList, Pressable } from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { format } from "date-fns";
import { useTheme, useColors } from "@/theme";
import { formatPrice } from "@/lib";
import { useBudget, useBudgetMutation } from "@/actions/budgets";
import { SpendingSummary } from "./spending-summary";
import { useBudgetDetailsStyles } from "./styles";
import {
  Button,
  FormHeader,
  Header,
  SafeArea,
  Skeleton,
} from "@/components/shared";

interface Transaction {
  id: string;
  name: string;
  icon: string;
  amount: number;
  date: string;
}

export default function BudgetDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const theme = useTheme();
  const styles = useBudgetDetailsStyles();

  const { data: budgetResponse, isLoading } = useBudget(id);
  const { archiveBudgetMutation, deleteBudgetsMutation } = useBudgetMutation();
  const { mutateAsync: archiveBudget, isPending: isArchiving } =
    archiveBudgetMutation;
  const { mutateAsync: deleteBudget, isPending: isDeleting } =
    deleteBudgetsMutation;

  const budgetTransactions = useMemo(
    () =>
      (budgetResponse?.data.transactions ?? []).map((tx) => ({
        ...tx,
        amount: Number(tx.amount),
      })),
    [budgetResponse],
  );

  const sortedTransactions = useMemo(
    () =>
      [...budgetTransactions].sort(
        (a, b) =>
          new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime(),
      ),
    [budgetTransactions],
  );

  const transactions: Transaction[] = useMemo(
    () =>
      sortedTransactions.slice(0, 5).map((tx) => ({
        id: tx.id,
        name: tx.source_name ?? tx.category.name,
        icon: tx.category.icon,
        amount: Number(tx.amount),
        date: format(new Date(tx.recorded_at), "MMM d"),
      })),
    [sortedTransactions],
  );

  const handleEdit = () =>
    router.push({
      pathname: "/edit-budget",
      params: { id: budgetResponse?.data.id },
    });

  const handleArchive = async () => {
    if (!budgetResponse) return;

    await archiveBudget(budgetResponse.data.id);
    router.back();
  };

  const handleDelete = async () => {
    if (!budgetResponse) return;

    await deleteBudget(budgetResponse.data.id);
    router.back();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return colors.status.success.main;
      case "warning":
        return colors.status.warning.main;
      case "danger":
        return colors.status.error.main;
      default:
        return colors.primary.main;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "healthy":
        return "Healthy";
      case "warning":
        return "Warning";
      case "danger":
        return "Over Budget";
      default:
        return "Healthy";
    }
  };

  const renderTransaction = ({
    item: transaction,
    index,
  }: {
    item: Transaction;
    index: number;
  }) => (
    <View
      style={[
        styles.transactionItem,
        index === transactions.length - 1 && styles.transactionItemLast,
      ]}
    >
      <View style={styles.transactionLeft}>
        <View style={styles.transactionIcon}>
          <MaterialIcons
            name={transaction.icon as any}
            size={18}
            color={colors.text.secondary}
          />
        </View>
        <View>
          <Text style={styles.transactionName}>{transaction.name}</Text>
          <Text style={styles.transactionDate}>{transaction.date}</Text>
        </View>
      </View>
      <Text style={styles.transactionAmount}>
        {formatPrice(transaction.amount)}
      </Text>
    </View>
  );

  // ─── Loading State ──────────────────────────────────────────────────────────
  if (isLoading || !budgetResponse) {
    return (
      <SafeArea>
        <View style={styles.topAppBar}>
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton width={120} height={20} borderRadius={10} />
          <Skeleton width={40} height={40} borderRadius={20} />
        </View>

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Summary Card Skeleton */}
          <View style={styles.summarySection}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderLeft}>
                <Skeleton width={44} height={44} borderRadius={12} />
                <Skeleton width={100} height={20} borderRadius={10} />
              </View>
              <Skeleton width={72} height={24} borderRadius={12} />
            </View>

            <View style={styles.budgetAmountContainer}>
              <Skeleton width={100} height={12} borderRadius={6} />
              <Skeleton
                width={150}
                height={40}
                borderRadius={8}
                style={{ marginTop: 6 }}
              />
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressLabels}>
                <Skeleton width={80} height={14} borderRadius={7} />
                <Skeleton width={80} height={14} borderRadius={7} />
              </View>
              <Skeleton
                width="100%"
                height={12}
                borderRadius={6}
                style={{ marginVertical: 8 }}
              />
              <View style={styles.statusRow}>
                <Skeleton width={60} height={14} borderRadius={7} />
                <Skeleton width={100} height={14} borderRadius={7} />
              </View>
            </View>
          </View>

          {/* Spending Summary Skeleton */}
          <View style={styles.transactionsSection}>
            <Skeleton width={140} height={16} borderRadius={8} />
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 12,
              }}
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} width="47%" height={64} borderRadius={12} />
              ))}
            </View>
          </View>

          {/* Transactions Skeleton */}
          <View style={styles.transactionsSection}>
            <Skeleton width={120} height={16} borderRadius={8} />
            <View style={{ marginTop: 12 }}>
              {Array.from({ length: 3 }).map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.transactionItem,
                    index === 2 && styles.transactionItemLast,
                  ]}
                >
                  <View style={styles.transactionLeft}>
                    <Skeleton width={40} height={40} borderRadius={12} />
                    <View>
                      <Skeleton width={100} height={16} borderRadius={8} />
                      <Skeleton
                        width={60}
                        height={12}
                        borderRadius={6}
                        style={{ marginTop: 4 }}
                      />
                    </View>
                  </View>
                  <Skeleton width={80} height={16} borderRadius={8} />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Footer Skeleton */}
        <View style={styles.footer}>
          <Skeleton width="100%" height={48} borderRadius={12} />
          <View style={styles.footerSecondaryRow}>
            <Skeleton width={60} height={16} borderRadius={8} />
            <Skeleton width={60} height={16} borderRadius={8} />
          </View>
        </View>
      </SafeArea>
    );
  }

  const budget = budgetResponse.data;
  const status = budget.summary.status;

  return (
    <SafeArea>
      <FormHeader
        title="Budget"
        rightContent={
          <Pressable onPress={handleEdit} style={styles.moreButton}>
            <Feather name="edit" size={22} color={colors.text.primary} />
          </Pressable>
        }
      />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Summary Card */}
        <View style={styles.summarySection}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.iconContainer}>
                <MaterialIcons
                  name={budget.category.icon as any}
                  size={22}
                  color={colors.primary.main}
                />
              </View>
              <Text style={styles.budgetName} numberOfLines={1}>
                {budget.category.name}
              </Text>
            </View>
            <View style={styles.statusPill}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(status) },
                ]}
              />
              <Text style={styles.statusText}>{getStatusLabel(status)}</Text>
            </View>
          </View>

          <View style={styles.budgetAmountContainer}>
            <Text style={styles.budgetLabel}>MONTHLY BUDGET</Text>
            <Text style={styles.budgetAmount}>
              {formatPrice(budget.amount)}
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>
                {formatPrice(budget.spent)} spent
              </Text>
              <Text style={styles.progressLabel}>
                {formatPrice(budget.remaining)} left
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${budget.percent_used}%`,
                    backgroundColor: getStatusColor(status),
                  },
                ]}
              >
                <View style={styles.progressBarHighlight} />
              </View>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.progressLabel}>
                {budget.percent_used.toFixed(0)}% used
              </Text>
              <Text style={styles.remainingText}>
                {formatPrice(budget.remaining)} remaining
              </Text>
            </View>
          </View>
        </View>

        {/* Spending Summary Section — replaces the line chart */}
        {budgetTransactions.length > 0 && (
          <SpendingSummary transactions={budgetTransactions} />
        )}

        {/* Transactions Section */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>TRANSACTIONS</Text>
          </View>
          {transactions.length === 0 ? (
            <View style={styles.emptyTransactions}>
              <MaterialIcons
                name="receipt-long"
                size={40}
                color={colors.text.muted}
              />
              <Text style={styles.emptyTransactionsTitle}>
                No transactions yet
              </Text>
              <Text style={styles.emptyTransactionsMessage}>
                Transactions for this budget will appear here.
              </Text>
            </View>
          ) : (
            <FlatList
              data={transactions}
              keyExtractor={(transaction) => transaction.id}
              renderItem={renderTransaction}
              scrollEnabled={false}
            />
          )}
        </View>

        {/* Bottom Spacer for Footer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Footer Actions — Edit is the one loud action */}
      <View style={styles.footer}>
        <View style={styles.footerSecondaryRow}>
          <Button
            title="ARCHIVE"
            flex
            variant="warning"
            appearance="outline"
            onPress={handleArchive}
            loading={isArchiving}
          />

          <Button
            title="DELETE"
            flex
            variant="danger"
            appearance="outline"
            onPress={handleDelete}
            loading={isDeleting}
          />
        </View>
      </View>
    </SafeArea>
  );
}
