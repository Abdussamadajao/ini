import { TransactionFilter, defaultTransactionFilter } from "@/screens/transactions/transactions-filter-modal";
import { FilterCategory, TabType } from "@/screens/transactions/types";
import { create } from "zustand";

interface TransactionsUIState {
  search: string;
  activeTab: TabType;
  filterOpen: boolean;
  appliedFilter: TransactionFilter;
  filterCategories: FilterCategory[];
}

interface TransactionsUIActions {
  setSearch: (search: string) => void;
  setActiveTab: (tab: TabType) => void;
  setFilterOpen: (open: boolean) => void;
  setAppliedFilter: (filter: TransactionFilter) => void;
  setFilterCategories: (categories: FilterCategory[]) => void;
  reset: () => void;
}

const initialState: TransactionsUIState = {
  search: "",
  activeTab: "All",
  filterOpen: false,
  appliedFilter: defaultTransactionFilter,
  filterCategories: [],
};

export const useTransactionsUIStore = create<
  TransactionsUIState & TransactionsUIActions
>()((set) => ({
  ...initialState,

  setSearch: (search) => set({ search }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setFilterOpen: (filterOpen) => set({ filterOpen }),
  setAppliedFilter: (appliedFilter) => set({ appliedFilter }),
  setFilterCategories: (filterCategories) => set({ filterCategories }),
  reset: () => set(initialState),
}));

export const useTransactionsSearch = () =>
  useTransactionsUIStore((s) => s.search);
export const useTransactionsActiveTab = () =>
  useTransactionsUIStore((s) => s.activeTab);
export const useTransactionsFilterOpen = () =>
  useTransactionsUIStore((s) => s.filterOpen);
export const useTransactionsAppliedFilter = () =>
  useTransactionsUIStore((s) => s.appliedFilter);
export const useTransactionsFilterCategories = () =>
  useTransactionsUIStore((s) => s.filterCategories);
