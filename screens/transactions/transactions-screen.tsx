import { Header } from "@/components/shared/header";
import SearchBar from "@/components/shared/search-bar";
import { useTransactionsUIStore } from "@/stores";
import { useTheme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { defaultTransactionFilter } from "./transactions-filter-modal";
import TransactionsFilterModal from "./transactions-filter-modal";
import { TransactionsList } from "./transactions-list";
import { useTransactionsStyles } from "./styles";

export function TransactionsScreen() {
  const { colors } = useTheme();
  const styles = useTransactionsStyles();

  const search = useTransactionsUIStore((s) => s.search);
  const setSearch = useTransactionsUIStore((s) => s.setSearch);
  const activeTab = useTransactionsUIStore((s) => s.activeTab);
  const setActiveTab = useTransactionsUIStore((s) => s.setActiveTab);
  const filterOpen = useTransactionsUIStore((s) => s.filterOpen);
  const setFilterOpen = useTransactionsUIStore((s) => s.setFilterOpen);
  const appliedFilter = useTransactionsUIStore((s) => s.appliedFilter);
  const setAppliedFilter = useTransactionsUIStore((s) => s.setAppliedFilter);
  const filterCategories = useTransactionsUIStore((s) => s.filterCategories);

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

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <Header title="Transactions" />

      <View style={styles.searchRow}>
        <SearchBar search={search} setSearch={setSearch} />
        <View style={styles.filterBtnWrap}>
          <Pressable
            onPress={() => setFilterOpen(true)}
            style={styles.filterBtn}
            hitSlop={8}
          >
            <MaterialIcons
              name="tune"
              size={22}
              color={colors.primary.contrastText}
            />
          </Pressable>
          {filterActive ? <View style={styles.filterActiveDot} /> : null}
        </View>
      </View>

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
