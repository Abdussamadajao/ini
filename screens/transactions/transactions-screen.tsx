import { useTheme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SegmentedTabs } from "@/components/shared";
import { useTransactionsUIStore } from "@/stores";
import TransactionsFilterModal, {
  defaultTransactionFilter,
} from "./transactions-filter-modal";

import { TransactionsList } from "./transactions-list";
import { useTransactionsStyles } from "./styles";
import { TABS } from "./types";

export function TransactionsScreen() {
  const { colors } = useTheme();
  const styles = useTransactionsStyles();

  const activeTab = useTransactionsUIStore((s) => s.activeTab);
  const setActiveTab = useTransactionsUIStore((s) => s.setActiveTab);
  const filterOpen = useTransactionsUIStore((s) => s.filterOpen);
  const setFilterOpen = useTransactionsUIStore((s) => s.setFilterOpen);
  const appliedFilter = useTransactionsUIStore((s) => s.appliedFilter);
  const setAppliedFilter = useTransactionsUIStore((s) => s.setAppliedFilter);
  const filterCategories = useTransactionsUIStore((s) => s.filterCategories);
  const search = useTransactionsUIStore((s) => s.search);
  const setSearch = useTransactionsUIStore((s) => s.setSearch);

  const [isSearchActive, setIsSearchActive] = useState(false);

  const filterActive = useMemo(() => {
    const d = defaultTransactionFilter;
    if (appliedFilter.dateRange !== d.dateRange) return true;
    if (appliedFilter.categoryIds.length > 0) return true;
    if (
      appliedFilter.amountMin !== d.amountMin ||
      appliedFilter.amountMax !== d.amountMax
    ) {
      return true;
    }
    if (appliedFilter.customRange != null) return true;
    return false;
  }, [appliedFilter]);

  const exitSearch = () => {
    setIsSearchActive(false);
    setSearch("");
  };

  if (isSearchActive) {
    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        {/* Search Header */}
        <View style={styles.searchHeader}>
          <View
            style={[
              styles.searchBar,
              { backgroundColor: colors.background.surfaceAlt },
            ]}
          >
            <Pressable
              onPress={exitSearch}
              style={styles.searchIconBtn}
              hitSlop={8}
            >
              <MaterialIcons
                name="arrow-back"
                size={24}
                color={colors.text.secondary}
              />
            </Pressable>
            <TextInput
              style={[styles.searchInput, { color: colors.text.primary }]}
              placeholder="Search transactions"
              placeholderTextColor={colors.text.muted}
              value={search}
              onChangeText={setSearch}
              autoFocus
              returnKeyType="search"
            />
            {search.length > 0 && (
              <Pressable
                onPress={() => setSearch("")}
                style={styles.searchIconBtn}
                hitSlop={8}
              >
                <MaterialIcons
                  name="close"
                  size={20}
                  color={colors.text.secondary}
                />
              </Pressable>
            )}
          </View>
        </View>

        {/* Transaction List */}
        <TransactionsList />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>History</Text>
        <View style={styles.headerActions}>
          <Pressable
            style={styles.iconBtn}
            onPress={() => setIsSearchActive(true)}
          >
            <MaterialIcons
              name="search"
              size={24}
              color={colors.primary.main}
            />
          </Pressable>
          <Pressable style={styles.iconBtn} onPress={() => setFilterOpen(true)}>
            <MaterialIcons
              name="filter-list"
              size={24}
              color={colors.primary.main}
            />
            {filterActive && <View style={styles.filterDot} />}
          </Pressable>
        </View>
      </View>

      {/* Tabs */}
      <SegmentedTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Transaction List */}
      <TransactionsList />

      <TransactionsFilterModal
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={setAppliedFilter}
        initial={appliedFilter}
        categories={filterCategories}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </SafeAreaView>
  );
}
