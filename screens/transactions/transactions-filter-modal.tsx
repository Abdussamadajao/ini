import DateRangePicker, {
  type RangeValue,
} from "@/components/form/date-range-picker";
import { Button } from "@/components/shared";
import BlurBackdrop, {
  BlurBackdropProps,
} from "@/components/shared/blur-backdrop";
import SegmentedTabs from "@/components/shared/segmented-tabs";
import { formatPrice } from "@/lib/custom";
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
import {
  LayoutChangeEvent,
  PanResponder,
  Pressable,
  Text,
  View,
} from "react-native";
import { TABS, TabType } from "./types";

export type DateRangePreset = "today" | "this_week" | "this_month" | "custom";

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
const THUMB = 22;
const TRACK_PAD = THUMB / 2;

const DATE_OPTIONS: {
  id: DateRangePreset;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}[] = [
  { id: "today", label: "Today", icon: "today" },
  { id: "this_week", label: "This Week", icon: "view-week" },
  { id: "this_month", label: "This Month", icon: "calendar-month" },
  { id: "custom", label: "Custom", icon: "tune" },
];

const DEFAULT_CATEGORIES: {
  id: TransactionCategoryId;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}[] = [
  { id: "food", label: "Food", icon: "restaurant" },
  { id: "transport", label: "Transport", icon: "directions-bus" },
  { id: "shopping", label: "Shopping", icon: "shopping-bag" },
  { id: "bills", label: "Bills", icon: "receipt-long" },
  { id: "entertainment", label: "Entertainment", icon: "theater-comedy" },
  { id: "health", label: "Health", icon: "favorite" },
  { id: "investment", label: "Investment", icon: "trending-up" },
];

function defaultCustomRange(): RangeValue {
  const end = startOfDay(new Date());
  const start = subDays(end, 7);
  return { start, end };
}

export const defaultTransactionFilter: TransactionFilter = {
  dateRange: "this_month",
  categoryIds: [],
  amountMin: AMOUNT_MIN,
  amountMax: AMOUNT_MAX,
  customRange: null,
};

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function AmountRangeSlider({
  low,
  high,
  onChange,
  accent,
  trackBg,
  labelColor,
}: {
  low: number;
  high: number;
  onChange: (next: [number, number]) => void;
  accent: string;
  trackBg: string;
  labelColor: string;
}) {
  const styles = useStyles();
  const [trackW, setTrackW] = useState(0);
  const dragging = useRef<"low" | "high" | null>(null);

  const valueFromX = useCallback(
    (x: number) => {
      const w = trackW;
      if (w <= 0) return AMOUNT_MIN;
      const inner = w - THUMB;
      const t = clamp((x - TRACK_PAD) / inner, 0, 1);
      return Math.round(AMOUNT_MIN + t * (AMOUNT_MAX - AMOUNT_MIN));
    },
    [trackW],
  );

  const xFromValue = useCallback(
    (v: number) => {
      const w = trackW;
      if (w <= 0) return 0;
      const inner = w - THUMB;
      const t = (v - AMOUNT_MIN) / (AMOUNT_MAX - AMOUNT_MIN);
      return TRACK_PAD + t * inner;
    },
    [trackW],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e) => {
          const x = e.nativeEvent.locationX;
          const xl = xFromValue(low);
          const xh = xFromValue(high);
          dragging.current =
            Math.abs(x - xl) <= Math.abs(x - xh) ? "low" : "high";
        },
        onPanResponderMove: (e) => {
          const x = e.nativeEvent.locationX;
          const v = valueFromX(x);
          const step = 1000;
          const rounded = Math.round(v / step) * step;
          if (dragging.current === "low") {
            const next = clamp(rounded, AMOUNT_MIN, high - step);
            onChange([next, high]);
          } else {
            const next = clamp(rounded, low + step, AMOUNT_MAX);
            onChange([low, next]);
          }
        },
        onPanResponderRelease: () => {
          dragging.current = null;
        },
      }),
    [high, low, onChange, valueFromX, xFromValue],
  );

  const onTrackLayout = (e: LayoutChangeEvent) => {
    setTrackW(e.nativeEvent.layout.width);
  };

  const lowX = xFromValue(low);
  const highX = xFromValue(high);
  const fillLeft = Math.min(lowX, highX);
  const fillW = Math.abs(highX - lowX);

  return (
    <View>
      <View
        style={[styles.sliderTrack, { backgroundColor: trackBg }]}
        onLayout={onTrackLayout}
        {...panResponder.panHandlers}
      >
        <View
          pointerEvents="none"
          style={[
            styles.sliderFill,
            {
              left: fillLeft,
              width: fillW,
              backgroundColor: accent,
            },
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.sliderThumb,
            { left: lowX - THUMB / 2, borderColor: accent },
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.sliderThumb,
            { left: highX - THUMB / 2, borderColor: accent },
          ]}
        />
      </View>
      <View style={styles.sliderEnds}>
        <Text style={[styles.sliderEndText, { color: labelColor }]}>
          {formatPrice(AMOUNT_MIN)}
        </Text>
        <Text style={[styles.sliderEndText, { color: labelColor }]}>
          {formatPrice(AMOUNT_MAX)}+
        </Text>
      </View>
    </View>
  );
}

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
  const [amountMin, setAmountMin] = useState(initial.amountMin);
  const [amountMax, setAmountMax] = useState(initial.amountMax);
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
    setAmountMin(initial.amountMin);
    setAmountMax(initial.amountMax);
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
    setAmountMin(defaultTransactionFilter.amountMin);
    setAmountMax(defaultTransactionFilter.amountMax);
    setCustomRange(null);
  };

  const apply = () => {
    const range =
      dateRange === "custom" ? (customRange ?? defaultCustomRange()) : null;
    onApply({
      dateRange,
      categoryIds,
      amountMin,
      amountMax,
      customRange: range,
    });
    modalRef.current?.dismiss();
  };

  const chipInactiveBg = colors.background.surfaceAlt;
  const chipActiveBg = colors.primary.main;
  const chipInactiveText = colors.text.primary;
  const chipActiveText = colors.primary.contrastText;

  // Active-filter count, surfaced on the Apply button and in the header
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (dateRange !== defaultTransactionFilter.dateRange) count += 1;
    count += categoryIds.length;
    if (
      amountMin !== defaultTransactionFilter.amountMin ||
      amountMax !== defaultTransactionFilter.amountMax
    )
      count += 1;
    return count;
  }, [dateRange, categoryIds, amountMin, amountMax]);

  const amountIsDefault = amountMin === AMOUNT_MIN && amountMax === AMOUNT_MAX;

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
        backgroundColor: colors.text.muted,
        marginTop: 8,
      }}
      backdropComponent={renderBackdrop}
    >
      {/* Header: title + inline reset (only shown once something differs from default) */}
      <View style={styles.header}>
        <View style={{ width: 56 }} />
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Filters
        </Text>
        <Pressable
          onPress={reset}
          hitSlop={8}
          disabled={activeFilterCount === 0}
          style={styles.headerReset}
        >
          <Text
            style={[
              styles.headerResetText,
              {
                color:
                  activeFilterCount === 0
                    ? colors.text.muted
                    : colors.primary.main,
              },
            ]}
          >
            Reset
          </Text>
        </Pressable>
      </View>

      <BottomSheetScrollView
        style={{ flexGrow: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tabsWrapper}>
          <SegmentedTabs
            style={{ paddingHorizontal: 3 }}
            tabs={TABS}
            activeTab={activeTab}
            onChange={onTabChange}
          />
        </View>

        <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>
          DATE RANGE
        </Text>
        <View style={styles.chipRow}>
          {DATE_OPTIONS.map((opt) => {
            const sel = dateRange === opt.id;
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
                  styles.chip,
                  {
                    backgroundColor: sel ? chipActiveBg : chipInactiveBg,
                    borderColor: sel ? chipActiveBg : colors.border.default,
                  },
                ]}
              >
                <MaterialIcons
                  name={opt.icon}
                  size={15}
                  color={sel ? chipActiveText : colors.text.secondary}
                  style={{ marginRight: 5 }}
                />
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: sel ? chipActiveText : chipInactiveText,
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

        {hasCategories && (
          <>
            <View style={styles.sectionLabelRow}>
              <Text
                style={[styles.sectionLabel, { color: colors.text.secondary }]}
              >
                CATEGORIES
              </Text>
              {categoryIds.length > 0 && (
                <Text
                  style={[styles.sectionCount, { color: colors.primary.main }]}
                >
                  {categoryIds.length} selected
                </Text>
              )}
            </View>
            <View style={styles.catGrid}>
              {categories.map((cat) => {
                const sel = categoryIds.includes(cat.id);
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => toggleCategory(cat.id)}
                    style={[
                      styles.catTile,
                      {
                        backgroundColor: sel
                          ? colors.primary.main + "14"
                          : colors.background.surfaceAlt,
                        borderColor: sel
                          ? colors.primary.main
                          : colors.border.default,
                      },
                    ]}
                  >
                    {sel && (
                      <View
                        style={[
                          styles.catCheck,
                          { backgroundColor: colors.primary.main },
                        ]}
                      >
                        <MaterialIcons
                          name="check"
                          size={10}
                          color={colors.primary.contrastText}
                        />
                      </View>
                    )}
                    <MaterialIcons
                      name={cat.icon}
                      size={22}
                      color={sel ? colors.primary.main : colors.text.secondary}
                    />
                    <Text
                      style={[
                        styles.catLabel,
                        {
                          color: sel
                            ? colors.primary.main
                            : colors.text.primary,
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

        <View style={styles.sectionLabelRow}>
          <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>
            AMOUNT RANGE
          </Text>
          {!amountIsDefault && (
            <Text style={[styles.sectionCount, { color: colors.primary.main }]}>
              {formatPrice(amountMin)} – {formatPrice(amountMax)}
            </Text>
          )}
        </View>
        <View
          style={[
            styles.amountCard,
            {
              backgroundColor: colors.background.surfaceAlt,
              borderColor: colors.border.default,
            },
          ]}
        >
          <AmountRangeSlider
            low={amountMin}
            high={amountMax}
            onChange={([a, b]) => {
              setAmountMin(a);
              setAmountMax(b);
            }}
            accent={colors.primary.main}
            trackBg={colors.background.surface}
            labelColor={colors.text.secondary}
          />
        </View>
      </BottomSheetScrollView>

      {/* Sticky footer, visually separated from the scroll content */}
      <View
        style={[
          styles.footer,
          {
            borderTopColor: colors.border.default,
            backgroundColor: colors.background.surface,
          },
        ]}
      >
        <View style={styles.buttonRow}>
          <Button onPress={onClose} variant="ghost" style={{ flex: 1 }}>
            <Text style={[styles.cancelText, { color: colors.text.secondary }]}>
              Cancel
            </Text>
          </Button>
          <Button variant="primary" onPress={apply} style={{ flex: 1.4 }}>
            <Text
              style={[
                styles.applyBtnText,
                { color: colors.primary.contrastText },
              ]}
            >
              {activeFilterCount > 0
                ? `Apply Filters (${activeFilterCount})`
                : "Apply Filters"}
            </Text>
          </Button>
        </View>
      </View>
    </BottomSheetModal>
  );
}

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(({ colors, spacing, radius, typography }) => ({
  sheetBg: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing[5],
    paddingTop: spacing[3],
    paddingBottom: spacing[2],
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.Manrope.Bold,
    textAlign: "center",
    flex: 1,
  },
  headerReset: {
    width: 56,
    alignItems: "flex-end",
  },
  headerResetText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.Manrope.SemiBold,
  },
  scrollContent: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[2],
    paddingBottom: spacing[6],
  },
  tabsWrapper: {
    marginBottom: spacing[5],
  },
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing[2.5],
    marginTop: spacing[1],
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: typography.fontFamily.Manrope.SemiBold,
    letterSpacing: 0.6,
    marginBottom: spacing[2.5],
    marginTop: spacing[1],
  },
  sectionCount: {
    fontSize: 11,
    fontFamily: typography.fontFamily.Manrope.SemiBold,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  customRangeBlock: {
    marginBottom: spacing[5],
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing[2.5],
    paddingHorizontal: spacing[3.5],
    borderRadius: radius.full,
    borderWidth: 1,
  },
  chipText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.Manrope.SemiBold,
  },
  catGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2.5],
    marginBottom: spacing[6],
  },
  catTile: {
    width: "31%",
    minWidth: "30%",
    aspectRatio: 1,
    maxHeight: 96,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[1.5],
    padding: spacing[2],
    position: "relative",
  },
  catCheck: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  catLabel: {
    fontSize: 11,
    fontFamily: typography.fontFamily.Manrope.SemiBold,
    textAlign: "center",
  },
  amountCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing[4],
  },
  sliderTrack: {
    height: THUMB,
    borderRadius: THUMB / 2,
    justifyContent: "center",
    marginBottom: spacing[2],
    position: "relative",
  },
  sliderFill: {
    position: "absolute",
    height: 6,
    top: (THUMB - 6) / 2,
    borderRadius: 3,
  },
  sliderThumb: {
    position: "absolute",
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: colors.background.surface,
    borderWidth: 3,
    top: 0,
  },
  sliderEnds: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sliderEndText: {
    fontSize: 10,
    fontFamily: typography.fontFamily.Manrope.Medium,
  },
  footer: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[8],
    borderTopWidth: 1,
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing[3],
  },
  cancelText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.Manrope.SemiBold,
  },
  applyBtnText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.Manrope.Bold,
  },
}));
