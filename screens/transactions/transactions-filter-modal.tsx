import { DateRangePicker, type RangeValue } from "@/components/form";
import BlurBackdrop, {
  BlurBackdropProps,
} from "@/components/shared/blur-backdrop";
import { makeStyles, useTheme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { startOfDay, subDays } from "date-fns";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { TABS, TabType } from "./types";

export type DateRangePreset =
  "all_time" | "today" | "this_week" | "this_month" | "custom";

export type TransactionCategoryId = string;

export type TransactionFilter = {
  dateRange: DateRangePreset;
  categoryIds: TransactionCategoryId[];
  amountMin: number;
  amountMax: number;
  customRange: RangeValue | null;
};

const AMOUNT_MIN = 0;
const AMOUNT_MAX = 1_000_000;

const DATE_OPTIONS: {
  id: DateRangePreset;
  label: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
}[] = [
  { id: "all_time", label: "All time" },
  { id: "today", label: "Today" },
  { id: "this_week", label: "This week" },
  { id: "this_month", label: "This month" },
  { id: "custom", label: "Custom range", icon: "calendar-month" },
];

const DEFAULT_CATEGORIES: {
  id: TransactionCategoryId;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}[] = [
  { id: "shopping", label: "Shopping", icon: "shopping-cart" },
  { id: "food", label: "Dining", icon: "restaurant" },
  { id: "transport", label: "Transport", icon: "directions-car" },
  { id: "bills", label: "Utilities", icon: "home" },
  { id: "travel", label: "Travel", icon: "flight" },
];

function defaultCustomRange(): RangeValue {
  const end = startOfDay(new Date());
  const start = subDays(end, 7);
  return { start, end };
}

export const defaultTransactionFilter: TransactionFilter = {
  dateRange: "all_time",
  categoryIds: [],
  amountMin: AMOUNT_MIN,
  amountMax: AMOUNT_MAX,
  customRange: null,
};

export interface TransactionsFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filter: TransactionFilter) => void;
  initial?: TransactionFilter;
  categories?: {
    id: TransactionCategoryId;
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
  }[];
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TransactionsFilterModal({
  visible,
  onClose,
  onApply,
  initial = defaultTransactionFilter,
  categories = DEFAULT_CATEGORIES,
  activeTab = "All",
  onTabChange,
}: TransactionsFilterModalProps) {
  const modalRef = useRef<BottomSheetModal>(null);
  const { colors } = useTheme();
  const styles = useStyles();
  const [mountKey, setMountKey] = useState(0);

  const [dateRange, setDateRange] = useState<DateRangePreset>(
    initial.dateRange,
  );
  const [categoryIds, setCategoryIds] = useState<TransactionCategoryId[]>(
    () => [...initial.categoryIds],
  );
  const [amountMin, setAmountMin] = useState(String(initial.amountMin));
  const [amountMax, setAmountMax] = useState(String(initial.amountMax));
  const [customRange, setCustomRange] = useState<RangeValue | null>(
    initial.customRange ?? null,
  );

  useEffect(() => {
    if (visible) {
      setMountKey((k) => k + 1);
    }
  }, [visible]);

  useEffect(() => {
    if (mountKey > 0) {
      const frame = requestAnimationFrame(() => {
        modalRef.current?.present();
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [mountKey]);

  useEffect(() => {
    if (!visible) return;
    setDateRange(initial.dateRange);
    setCategoryIds([...initial.categoryIds]);
    setAmountMin(String(initial.amountMin));
    setAmountMax(String(initial.amountMax));
    setCustomRange(initial.customRange ?? null);
  }, [visible, initial]);

  const hasCategories = categories.length > 0;
  const snapPoints = useMemo(
    () => [hasCategories ? "85%" : "62%"],
    [hasCategories],
  );

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

  const toggleCategory = (id: TransactionCategoryId) => {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const reset = () => {
    setDateRange(defaultTransactionFilter.dateRange);
    setCategoryIds([]);
    setAmountMin(String(defaultTransactionFilter.amountMin));
    setAmountMax(String(defaultTransactionFilter.amountMax));
    setCustomRange(null);
  };

  const apply = () => {
    const min = Number(amountMin) || AMOUNT_MIN;
    const max = Number(amountMax) || AMOUNT_MAX;
    const range =
      dateRange === "custom" ? (customRange ?? defaultCustomRange()) : null;
    onApply({
      dateRange,
      categoryIds,
      amountMin: min,
      amountMax: max,
      customRange: range,
    });
    modalRef.current?.dismiss();
  };

  return (
    <BottomSheetModal
      key={mountKey}
      ref={modalRef}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      enableHandlePanningGesture={true}
      enableContentPanningGesture={false}
      enableDynamicSizing={false}
      onDismiss={onClose}
      backgroundStyle={[
        styles.sheetBg,
        { backgroundColor: colors.background.surface },
      ]}
      handleIndicatorStyle={{
        backgroundColor: colors.border.default,
        marginTop: 8,
      }}
      backdropComponent={renderBackdrop}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Filter transactions
        </Text>
        <Pressable onPress={onClose} hitSlop={8} style={styles.closeBtn}>
          <MaterialIcons name="close" size={22} color={colors.text.secondary} />
        </Pressable>
      </View>

      <BottomSheetScrollView
        style={{ flexGrow: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Filter */}
        <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>
          DATE
        </Text>
        <View style={styles.dateGrid}>
          {DATE_OPTIONS.map((opt) => {
            const sel = dateRange === opt.id;
            const isCustom = opt.id === "custom";
            return (
              <Pressable
                key={opt.id}
                onPress={() => {
                  setDateRange(opt.id);
                  if (opt.id === "custom") {
                    setCustomRange((prev) => prev ?? defaultCustomRange());
                  }
                }}
                style={[
                  styles.dateChip,
                  {
                    borderColor: sel
                      ? colors.primary.main
                      : colors.border.default,
                    backgroundColor: sel
                      ? `${colors.primary.main}14`
                      : "transparent",
                  },
                  isCustom && styles.dateChipFull,
                ]}
              >
                {opt.icon && (
                  <MaterialIcons
                    name={opt.icon}
                    size={16}
                    color={sel ? colors.primary.main : colors.text.primary}
                    style={{ marginRight: 4 }}
                  />
                )}
                <Text
                  style={[
                    styles.dateChipText,
                    {
                      color: sel ? colors.primary.main : colors.text.primary,
                      fontWeight: sel ? "600" : "400",
                    },
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {dateRange === "custom" ? (
          <View style={styles.customRangeBlock}>
            <DateRangePicker
              label="Custom range"
              value={customRange ?? defaultCustomRange()}
              onChange={(start, end) => setCustomRange({ start, end })}
            />
          </View>
        ) : null}

        {/* Type Filter */}
        <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>
          TYPE
        </Text>
        <View
          style={[
            styles.typeSegment,
            {
              backgroundColor: colors.background.surfaceAlt,
              borderColor: colors.border.default,
            },
          ]}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => onTabChange(tab)}
                style={[
                  styles.typeSegmentItem,
                  isActive && [
                    styles.typeSegmentItemActive,
                    {
                      backgroundColor: colors.primary.main,
                      shadowColor: colors.palette.black,
                    },
                  ],
                ]}
              >
                <Text
                  style={[
                    styles.typeSegmentText,
                    {
                      color: isActive
                        ? colors.text.inverse
                        : colors.text.secondary,
                      fontWeight: isActive ? "600" : "400",
                    },
                  ]}
                >
                  {tab}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Category Filter */}
        {hasCategories && (
          <>
            <Text
              style={[styles.sectionLabel, { color: colors.text.secondary }]}
            >
              CATEGORY
            </Text>
            <View style={styles.categoryGrid}>
              {categories.map((cat) => {
                const sel = categoryIds.includes(cat.id);
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => toggleCategory(cat.id)}
                    style={[
                      styles.categoryChip,
                      {
                        borderColor: sel
                          ? colors.primary.main
                          : colors.border.default,
                        backgroundColor: sel
                          ? `${colors.primary.main}14`
                          : "transparent",
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={cat.icon}
                      size={16}
                      color={sel ? colors.primary.main : colors.text.primary}
                    />
                    <Text
                      style={[
                        styles.categoryChipText,
                        {
                          color: sel
                            ? colors.primary.main
                            : colors.text.primary,
                          fontWeight: sel ? "600" : "400",
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {cat.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        {/* Amount Filter */}
        <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>
          AMOUNT
        </Text>
        <View style={styles.amountGrid}>
          <View style={styles.amountField}>
            <Text
              style={[styles.amountLabel, { color: colors.text.secondary }]}
            >
              MIN
            </Text>
            <TextInput
              style={[
                styles.amountInput,
                {
                  borderColor: colors.border.default,
                  backgroundColor: colors.background.surface,
                  color: colors.text.primary,
                },
              ]}
              value={amountMin}
              onChangeText={setAmountMin}
              placeholder="$0"
              placeholderTextColor={colors.text.muted}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.amountField}>
            <Text
              style={[styles.amountLabel, { color: colors.text.secondary }]}
            >
              MAX
            </Text>
            <TextInput
              style={[
                styles.amountInput,
                {
                  borderColor: colors.border.default,
                  backgroundColor: colors.background.surface,
                  color: colors.text.primary,
                },
              ]}
              value={amountMax}
              onChangeText={setAmountMax}
              placeholder="$10,000"
              placeholderTextColor={colors.text.muted}
              keyboardType="numeric"
            />
          </View>
        </View>
      </BottomSheetScrollView>

      {/* Footer */}
      <View
        style={[
          styles.footer,
          {
            borderTopColor: colors.border.default,
            backgroundColor: colors.background.surface,
          },
        ]}
      >
        <Pressable
          onPress={reset}
          style={({ pressed }) => [
            styles.resetBtn,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text style={[styles.resetBtnText, { color: colors.primary.main }]}>
            Reset
          </Text>
        </Pressable>
        <Pressable
          onPress={apply}
          style={({ pressed }) => [
            styles.applyBtn,
            { backgroundColor: colors.primary.main },
            pressed && { opacity: 0.9 },
          ]}
        >
          <Text
            style={[
              styles.applyBtnText,
              { color: colors.primary.contrastText },
            ]}
          >
            Apply filters
          </Text>
        </Pressable>
      </View>
    </BottomSheetModal>
  );
}

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(({ colors, spacing, radius, typography }) => ({
  sheetBg: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.Manrope.Bold,
    color: colors.text.primary,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[6],
    gap: spacing[6],
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: typography.fontFamily.Manrope.Bold,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: spacing[3],
  },

  // Date chips
  dateGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
  },
  dateChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2.5],
    borderRadius: radius.lg,
    borderWidth: 1,
    width: "48%",
  },
  dateChipFull: {
    width: "100%",
  },
  dateChipText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.Manrope.Regular,
    textAlign: "center",
  },
  customRangeBlock: {
    marginTop: spacing[3],
  },

  // Type segment
  typeSegment: {
    flexDirection: "row",
    borderRadius: radius.lg,
    padding: 3,
    borderWidth: 1,
  },
  typeSegmentItem: {
    flex: 1,
    paddingVertical: spacing[2],
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
  },
  typeSegmentItemActive: {
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  typeSegmentText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.Manrope.Regular,
  },

  // Category chips
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2.5],
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing[1.5],
    width: "48%",
  },
  categoryChipText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.Manrope.Regular,
  },

  // Amount inputs
  amountGrid: {
    flexDirection: "row",
    gap: spacing[4],
  },
  amountField: {
    flex: 1,
    gap: spacing[1.5],
  },
  amountLabel: {
    fontSize: 12,
    fontFamily: typography.fontFamily.Manrope.Bold,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  amountInput: {
    width: "100%",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2.5],
    borderRadius: radius.lg,
    borderWidth: 1,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.Manrope.Regular,
  },

  // Footer
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[5],
    borderTopWidth: 1,
    gap: spacing[3],
  },
  resetBtn: {
    flex: 1,
    paddingVertical: spacing[4],
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
  },
  resetBtnText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.Manrope.Bold,
  },
  applyBtn: {
    flex: 2,
    paddingVertical: spacing[4],
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
  },
  applyBtnText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.Manrope.Bold,
  },
}));
