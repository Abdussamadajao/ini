import BlurBackdrop, {
  BlurBackdropProps,
} from "@/components/shared/blur-backdrop";
import { makeStyles, useTheme } from "@/theme";
import { BudgetFilters, BudgetPeriod } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pressable, Text, View } from "react-native";

const PERIOD_OPTIONS: { id: BudgetPeriod | "ALL"; label: string }[] = [
  { id: "ALL", label: "All periods" },
  { id: "WEEKLY", label: "Weekly" },
  { id: "MONTHLY", label: "Monthly" },
  { id: "YEARLY", label: "Yearly" },
];

export const defaultBudgetFilter: BudgetFilters = {
  period: undefined,
  category_id: undefined,
  income_id: undefined,
  archived: undefined,
};

export interface BudgetsFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filter: BudgetFilters) => void;
  initial?: BudgetFilters;
  categories?: {
    id: string;
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
  }[];
  incomes?: { id: string; label: string }[];
}

export default function BudgetsFilterModal({
  visible,
  onClose,
  onApply,
  initial = defaultBudgetFilter,
  categories = [],
  incomes = [],
}: BudgetsFilterModalProps) {
  const modalRef = useRef<BottomSheetModal>(null);
  const { colors } = useTheme();
  const styles = useStyles();
  const [mountKey, setMountKey] = useState(0);

  const [period, setPeriod] = useState<BudgetPeriod | "ALL">(
    initial.period ?? "ALL",
  );
  const [categoryId, setCategoryId] = useState<string | null>(
    initial.category_id ?? null,
  );
  const [incomeId, setIncomeId] = useState<string | null>(
    initial.income_id ?? null,
  );
  const [archived, setArchived] = useState(initial.archived === "true");

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
    setPeriod(initial.period ?? "ALL");
    setCategoryId(initial.category_id ?? null);
    setIncomeId(initial.income_id ?? null);
    setArchived(initial.archived === "true");
  }, [visible, initial]);

  const hasCategories = categories.length > 0;
  const hasIncomes = incomes.length > 0;
  const snapPoints = useMemo(() => {
    if (hasCategories && hasIncomes) return ["78%"];
    if (hasCategories || hasIncomes) return ["65%"];
    return ["50%"];
  }, [hasCategories, hasIncomes]);

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

  const reset = () => {
    setPeriod("ALL");
    setCategoryId(null);
    setIncomeId(null);
    setArchived(false);
  };

  const apply = () => {
    onApply({
      period: period === "ALL" ? undefined : period,
      category_id: categoryId ?? undefined,
      income_id: incomeId ?? undefined,
      archived: archived ? "true" : undefined,
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
          Filter budgets
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
        {/* Period Filter */}
        <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>
          PERIOD
        </Text>
        <View style={styles.periodGrid}>
          {PERIOD_OPTIONS.map((opt) => {
            const sel = period === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => setPeriod(opt.id)}
                style={[
                  styles.periodChip,
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
                <Text
                  style={[
                    styles.periodChipText,
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

        {/* Status Filter */}
        <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>
          STATUS
        </Text>
        <View
          style={[
            styles.statusSegment,
            {
              backgroundColor: colors.background.surfaceAlt,
              borderColor: colors.border.default,
            },
          ]}
        >
          {(["Active", "Archived"] as const).map((label) => {
            const isActive = (label === "Archived") === archived ? true : false;
            const selected = label === "Archived" ? archived : !archived;
            return (
              <Pressable
                key={label}
                onPress={() => setArchived(label === "Archived")}
                style={[
                  styles.statusSegmentItem,
                  selected && [
                    styles.statusSegmentItemActive,
                    {
                      backgroundColor: colors.primary.main,
                      shadowColor: colors.palette.black,
                    },
                  ],
                ]}
              >
                <Text
                  style={[
                    styles.statusSegmentText,
                    {
                      color: selected
                        ? colors.text.inverse
                        : colors.text.secondary,
                      fontWeight: selected ? "600" : "400",
                    },
                  ]}
                >
                  {label}
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
                const sel = categoryId === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() =>
                      setCategoryId((prev) => (prev === cat.id ? null : cat.id))
                    }
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

        {/* Income Filter */}
        {hasIncomes && (
          <>
            <Text
              style={[styles.sectionLabel, { color: colors.text.secondary }]}
            >
              INCOME SOURCE
            </Text>
            <View style={styles.categoryGrid}>
              {incomes.map((inc) => {
                const sel = incomeId === inc.id;
                return (
                  <Pressable
                    key={inc.id}
                    onPress={() =>
                      setIncomeId((prev) => (prev === inc.id ? null : inc.id))
                    }
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
                      {inc.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}
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
    textTransform: "capitalize",
    marginBottom: spacing[3],
  },

  // Period chips
  periodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
  },
  periodChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2.5],
    borderRadius: radius.lg,
    borderWidth: 1,
    width: "48%",
  },
  periodChipText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.Manrope.Regular,
    textAlign: "center",
  },

  // Status segment
  statusSegment: {
    flexDirection: "row",
    borderRadius: radius.lg,
    padding: 3,
    borderWidth: 1,
  },
  statusSegmentItem: {
    flex: 1,
    paddingVertical: spacing[2],
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
  },
  statusSegmentItemActive: {
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statusSegmentText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.Manrope.Regular,
  },

  // Category / income chips
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
