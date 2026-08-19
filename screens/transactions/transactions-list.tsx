import { useInfiniteTransactions, useTransactionMutation } from "@/actions";
import { ErrorState } from "@/components/shared";
import BlurBackdrop, {
  BlurBackdropProps,
} from "@/components/shared/blur-backdrop";
import { Skeleton, SkeletonList } from "@/components/shared/skeleton";
import { useToast } from "@/components/toasts";
import {
  formatAmount,
  getSectionLabel,
  getToday,
  isValidMaterialIcon,
} from "@/lib";
import { useTransactionsUIStore } from "@/stores";
import { useSpacing, useTheme } from "@/theme";
import type { Transaction } from "@/types/index";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { endOfDay, isWithinInterval, startOfDay, subDays } from "date-fns";
import { router } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Pressable,
  SectionList,
  Text,
  View,
} from "react-native";
import { useTransactionsStyles } from "./styles";
import { TransactionSection, UiTransaction } from "./types";

export function TransactionsList() {
  const { colors } = useTheme();
  const styles = useTransactionsStyles();
  const spacing = useSpacing();
  const { toast } = useToast();
  const search = useTransactionsUIStore((s) => s.search);
  const activeTab = useTransactionsUIStore((s) => s.activeTab);
  const appliedFilter = useTransactionsUIStore((s) => s.appliedFilter);
  const setFilterCategories = useTransactionsUIStore(
    (s) => s.setFilterCategories,
  );

  const [selectedTransaction, setSelectedTransaction] =
    useState<UiTransaction | null>(null);
  const modalRef = useRef<BottomSheetModal>(null);
  const { deleteTransaction: deleteTransactionMutation } =
    useTransactionMutation();
  const { mutateAsync: deleteTransaction, isPending: isDeleting } =
    deleteTransactionMutation;
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteTransactions();

  const allTransactions = useMemo<UiTransaction[]>(() => {
    const transactions = data?.pages.flatMap((page) => page.data) ?? [];
    return transactions.map((tx: Transaction) => {
      const amount = Number.parseFloat(tx.amount);
      const recordedAt = new Date(tx.recorded_at);
      const createdAt = new Date(tx.created_at);
      return {
        id: tx.id,
        title: tx.source_name?.trim() || tx.category.name,
        subtitle: tx.category.name,
        amount: Number.isNaN(amount) ? 0 : amount,
        isIncome: tx.type === "INCOME",
        categoryId: tx.category.id,
        recordedAt,
        createdAt,
        icon: isValidMaterialIcon(tx.category.icon)
          ? tx.category.icon
          : "receipt-long",
        iconBg: tx.category.color || colors.primary.main,
        time: recordedAt.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });
  }, [data, colors.primary.main]);

  useEffect(() => {
    const map = new Map<string, { id: string; label: string; icon: any }>();
    allTransactions.forEach((tx) => {
      if (!map.has(tx.categoryId)) {
        map.set(tx.categoryId, {
          id: tx.categoryId,
          label: tx.subtitle,
          icon: tx.icon,
        });
      }
    });
    const categories = Array.from(map.values()).sort((a, b) =>
      a.label.localeCompare(b.label),
    );
    setFilterCategories(categories);
  }, [allTransactions, setFilterCategories]);

  const filteredSections = useMemo<TransactionSection[]>(() => {
    let list = [...allTransactions];
    if (activeTab === "Income") list = list.filter((t) => t.isIncome);
    if (activeTab === "Expense") list = list.filter((t) => !t.isIncome);

    const { dateRange, categoryIds, amountMin, amountMax, customRange } =
      appliedFilter;
    const today = getToday();
    if (dateRange === "today") {
      list = list.filter(
        (t) => startOfDay(t.recordedAt).getTime() === today.getTime(),
      );
    } else if (dateRange === "this_week") {
      const weekStart = startOfDay(subDays(today, 6));
      list = list.filter((t) =>
        isWithinInterval(t.recordedAt, {
          start: weekStart,
          end: endOfDay(today),
        }),
      );
    } else if (dateRange === "custom" && customRange) {
      const s = startOfDay(customRange.start);
      const e = endOfDay(customRange.end);
      list = list.filter((t) =>
        isWithinInterval(t.recordedAt, { start: s, end: e }),
      );
    }

    if (categoryIds.length > 0) {
      list = list.filter((t) => categoryIds.includes(t.categoryId));
    }

    list = list.filter((t) => {
      const a = Math.abs(t.amount);
      return a >= amountMin && a <= amountMax;
    });

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.subtitle.toLowerCase().includes(q),
      );
    }

    list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const byDay = new Map<number, UiTransaction[]>();
    for (const tx of list) {
      const dayKey = startOfDay(tx.createdAt).getTime();
      const bucket = byDay.get(dayKey) ?? [];
      bucket.push(tx);
      byDay.set(dayKey, bucket);
    }

    const dayKeys = Array.from(byDay.keys()).sort((a, b) => b - a);
    return dayKeys.map((key) => ({
      label: getSectionLabel(new Date(key)),
      data: byDay.get(key)!,
    }));
  }, [allTransactions, activeTab, search, appliedFilter]);

  const hasResults = filteredSections.some((s) => s.data.length > 0);
  const isSearching = search.trim().length > 0;
  // const hasTransactions = allTransactions.length > 0;

  const handleLongPress = useCallback((transaction: UiTransaction) => {
    setSelectedTransaction(transaction);
    modalRef.current?.present();
  }, []);

  const handleEdit = useCallback(() => {
    if (selectedTransaction) {
      modalRef.current?.dismiss();
      const route = selectedTransaction.isIncome
        ? "/edit-income"
        : "/edit-expense";
      router.push({
        pathname: route,
        params: { id: selectedTransaction.id },
      });
    }
  }, [selectedTransaction]);

  const handleDelete = useCallback(async () => {
    if (!selectedTransaction) return;
    try {
      await deleteTransaction({ id: selectedTransaction.id });
      toast.success("Transaction deleted successfully");
      modalRef.current?.dismiss();
    } catch {
      toast.error("Failed to delete transaction");
    }
  }, [selectedTransaction, deleteTransaction, toast]);

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

  if (isLoading) {
    return (
      <View style={[styles.scrollContent, { paddingTop: spacing[4] }]}>
        <View style={styles.section}>
          <Skeleton width={72} height={11} style={{ marginBottom: 12 }} />
          <SkeletonList
            count={4}
            gap={0}
            renderItem={() => (
              <View style={styles.transactionRow}>
                <Skeleton width={40} height={40} borderRadius={20} />
                <View style={{ flex: 1, marginLeft: spacing[4], gap: 4 }}>
                  <Skeleton width="60%" height={14} />
                  <Skeleton width="40%" height={12} />
                </View>
                <Skeleton width={70} height={18} />
              </View>
            )}
          />
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <ErrorState
        error={error}
        title="Could not load transactions"
        message="Pull to refresh or try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <>
      <SectionList
        sections={filteredSections}
        keyExtractor={(item) => item.id}
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          !hasResults && styles.scrollContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator size="small" color={colors.primary.main} />
            </View>
          ) : null
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{section.label}</Text>
          </View>
        )}
        renderItem={({ item, index, section }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/transactions/[id]",
                params: {
                  id: item.id,
                },
              })
            }
            onLongPress={() => handleLongPress(item)}
            delayLongPress={300}
            style={({ pressed }) => [
              styles.transactionRow,
              pressed && { opacity: 0.7 },
            ]}
          >
            <View style={styles.transactionLeft}>
              <View
                style={[
                  styles.txIconWrap,
                  { backgroundColor: item.iconBg + "20" },
                ]}
              >
                <MaterialIcons name={item.icon} size={20} color={item.iconBg} />
              </View>

              <View style={styles.txInfo}>
                <Text style={styles.txTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.txSubtitle} numberOfLines={1}>
                  {item.subtitle} • {item.time}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.txAmount,
                {
                  color: item.isIncome
                    ? colors.primary.main
                    : colors.text.primary,
                },
              ]}
            >
              {formatAmount(item.amount, item.isIncome)}
            </Text>

            {index < section.data.length - 1 && (
              <View
                style={[
                  styles.divider,
                  {
                    position: "absolute",
                    bottom: 0,
                    left: 40 + spacing[4],
                    right: 0,
                  },
                ]}
              />
            )}
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <MaterialIcons
                name={isSearching ? "search-off" : "receipt-long"}
                size={40}
                color={colors.text.secondary}
              />
            </View>
            <Text style={styles.emptyTitle}>
              {isSearching ? "No transactions found" : "No transactions yet"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {isSearching
                ? `We couldn't find anything matching "${search}".`
                : "Your income and expenses will appear here once you start tracking them."}
            </Text>
            {isSearching ? (
              <Pressable
                style={({ pressed }) => [
                  styles.emptyBtn,
                  {
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: colors.primary.main,
                  },
                  pressed && { opacity: 0.7 },
                ]}
                // onPress={() => {
                //   setSearch("");
                // }}
              >
                <Text
                  style={[styles.emptyBtnText, { color: colors.primary.main }]}
                >
                  Clear search
                </Text>
              </Pressable>
            ) : (
              <Pressable
                style={({ pressed }) => [
                  styles.emptyBtn,
                  pressed && { opacity: 0.9 },
                ]}
                onPress={() => router.push("/add-income")}
              >
                <MaterialIcons
                  name="add"
                  size={18}
                  color={colors.primary.contrastText}
                />
                <Text style={styles.emptyBtnText}>Add transaction</Text>
              </Pressable>
            )}
          </View>
        }
      />

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
            {selectedTransaction?.title}
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
              Edit Transaction
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
              Delete Transaction
            </Text>
          </Pressable>
        </View>
      </BottomSheetModal>
    </>
  );
}
