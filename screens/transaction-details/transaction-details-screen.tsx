import {
  useDeleteTransaction,
  useIncomeSummary,
  useTransaction,
} from "@/actions/transactions";
import { ErrorState } from "@/components/shared/error";
import { Skeleton } from "@/components/shared/skeleton";
import { useToast } from "@/components/toasts";
import { isValidMaterialIcon } from "@/lib";
import { formatPrice } from "@/lib/custom";
import { useRadius, useSpacing, useTheme } from "@/theme";
import type { AnyTransaction } from "@/types/index";
import { isExpense } from "@/types/transactions";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useRef } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TransactionDeleteModal } from "./transaction-delete-modal";
import { useTransactionDetailsStyles } from "./transaction-details-styles";
import { Button } from "@/components/shared";

function parseAmount(tx: AnyTransaction): number {
  const n = Number.parseFloat(tx.amount);
  return Number.isNaN(n) ? 0 : n;
}

function parseMoney(amount: string): number {
  const n = Number.parseFloat(amount);
  return Number.isNaN(n) ? 0 : n;
}

function formatDetailDate(d: Date): string {
  return d.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDetailTime(d: Date): string {
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function TransactionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const spacing = useSpacing();
  const radius = useRadius();
  const { toast } = useToast();
  const styles = useTransactionDetailsStyles();
  const {
    data: tx,
    isLoading,
    isError,
    error,
    refetch,
  } = useTransaction(id ?? "");

  const incomeId =
    tx && isExpense(tx) && tx.income_id ? tx.income_id : undefined;
  const { data: incomeSummary, isLoading: summaryLoading } = useIncomeSummary(
    incomeId ?? "",
    !!incomeId,
  );

  const deleteMutation = useDeleteTransaction();
  const deleteModalRef = useRef<BottomSheetModal>(null);

  const amountNum = tx ? parseAmount(tx) : 0;
  const isIncomeTx = tx?.type === "INCOME";
  const recordedAt = tx ? new Date(tx.recorded_at) : new Date();

  const beforeAfter = useMemo(() => {
    if (!tx || !isExpense(tx) || !incomeId || !incomeSummary?.summary) {
      return null;
    }
    const remaining = incomeSummary.summary.remaining;
    const expenseAmt = parseAmount(tx);
    const list = incomeSummary.expenses ?? [];
    const sorted = [...list].sort((a, b) => {
      const ta = new Date(a.recorded_at).getTime();
      const tb = new Date(b.recorded_at).getTime();
      if (ta !== tb) return ta - tb;
      return a.id.localeCompare(b.id);
    });
    const idx = sorted.findIndex((e) => e.id === tx.id);
    if (idx === -1) {
      const after = remaining;
      const before = after + expenseAmt;
      return { before, after };
    }
    const sumExpensesAfter = sorted
      .slice(idx + 1)
      .reduce((s, e) => s + parseMoney(e.amount), 0);
    const after = remaining + sumExpensesAfter;
    const before = after + expenseAmt;
    return { before, after };
  }, [tx, incomeId, incomeSummary]);

  const openEdit = useCallback(() => {
    if (!tx) return;
    const dateIso = tx.recorded_at;
    if (tx.type === "EXPENSE") {
      router.push({
        pathname: "/edit-expense",
        params: {
          id: tx.id,
          amount: String(parseAmount(tx)),
          category: tx.category_id,
          date: dateIso,
          notes: tx.notes ?? "",
          receiptUri: tx.receipt_url ?? "",
        },
      });
    } else {
      router.push({
        pathname: "/edit-income",
        params: {
          id: tx.id,
          amount: String(parseAmount(tx)),
          incomeSource: tx.source_name ?? "",
          date: dateIso,
          notes: tx.notes ?? "",
          tag: tx.tag ?? "",
        },
      });
    }
  }, [tx]);

  const openDeleteModal = useCallback(() => {
    deleteModalRef.current?.present();
  }, []);

  const confirmDelete = useCallback(() => {
    if (!tx) return;
    const incomeIdForInvalidation =
      tx.type === "EXPENSE" ? (tx.income_id ?? undefined) : undefined;
    deleteMutation.mutate(
      { id: tx.id, incomeId: incomeIdForInvalidation },
      {
        onSuccess: () => {
          toast.success("Transaction deleted successfully");
          router.back();
        },
        onError: () => {
          toast.error("Failed to delete transaction");
        },
      },
    );
  }, [tx, deleteMutation, toast]);

  const iconName = useMemo(() => {
    if (!tx) return "receipt-long" as const;
    return isValidMaterialIcon(tx.category.icon)
      ? tx.category.icon
      : "receipt-long";
  }, [tx]);

  const hasNotes = tx?.notes?.trim();
  const hasTags = tx?.tag;
  const hasReceipt = tx?.receipt_url;

  // Determine which detail row is actually last so we can drop its
  // bottom border — the set of visible rows varies by transaction type
  // and which optional fields (tag/notes/tags) are present.
  const lastDetailRow = useMemo(() => {
    if (!tx) return null;
    const rows: string[] = [];
    if (isIncomeTx && tx.source_name) rows.push("source");
    rows.push("category");
    rows.push("date");
    rows.push("time");
    if (isIncomeTx && tx.tag) rows.push("type");
    if (hasNotes) rows.push("notes");
    if (hasTags && !isIncomeTx) rows.push("tags");
    return rows[rows.length - 1] ?? null;
  }, [tx, isIncomeTx, hasNotes, hasTags]);

  const showIncomePoolImpact =
    tx && isExpense(tx) && incomeId && beforeAfter && !summaryLoading;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.headerBtn}
            hitSlop={12}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={colors.text.secondary}
            />
          </Pressable>
          <Text style={styles.headerTitle}>Transaction details</Text>
          <View style={styles.headerBtn} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Amount Focus Skeleton */}
          <View style={styles.hero}>
            <Skeleton width={80} height={16} />
            <Skeleton width={200} height={44} style={{ marginTop: 8 }} />
          </View>

          {/* Details Card Skeleton */}
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Skeleton width={64} height={16} />
              <Skeleton width={128} height={16} />
            </View>
            <View style={styles.detailRow}>
              <Skeleton width={80} height={16} />
              <Skeleton width={96} height={16} />
            </View>
            <View style={styles.detailRow}>
              <Skeleton width={48} height={16} />
              <Skeleton width={160} height={16} />
            </View>
            <View style={styles.detailRow}>
              <Skeleton width={96} height={16} />
              <Skeleton width={112} height={16} />
            </View>
          </View>

          {/* Income Pool Impact Skeleton */}
          <View style={styles.impactCard}>
            <Skeleton width={128} height={24} style={{ marginBottom: 16 }} />
            <View style={styles.impactRow}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing[3],
                }}
              >
                <Skeleton width={40} height={40} borderRadius={20} />
                <View style={{ gap: 4 }}>
                  <Skeleton width={120} height={16} />
                  <Skeleton width={80} height={12} style={{ marginTop: 4 }} />
                </View>
              </View>
              <Skeleton width={64} height={24} />
            </View>
          </View>

          {/* Receipt Skeleton */}
          <View style={styles.receiptSection}>
            <Skeleton width={96} height={24} style={{ marginBottom: 12 }} />
            <Skeleton width="100%" height={128} borderRadius={radius.xl} />
          </View>

          {/* Footer Buttons Skeleton */}
          <View style={{ gap: spacing[3], marginTop: spacing[8] }}>
            <Skeleton width="100%" height={48} borderRadius={radius.lg} />
            <Skeleton width="100%" height={48} borderRadius={radius.lg} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
  if (!id) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.centerBlock}>
          <Text style={styles.metaLine}>Missing transaction.</Text>
          <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Text style={styles.sourceAccent}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !tx) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.headerBtn}
            hitSlop={12}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={colors.text.secondary}
            />
          </Pressable>
          <Text style={styles.headerTitle}>Transaction details</Text>
          <View style={styles.headerBtn} />
        </View>
        <ErrorState
          error={error}
          title="Could not load transaction"
          message="Try again or go back."
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }

  const amountColor = isIncomeTx
    ? colors.primary.main
    : colors.status.error.main;
  const signedAmount = isIncomeTx
    ? `+${formatPrice(amountNum)}`
    : `-${formatPrice(amountNum)}`;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.headerBtn}
          hitSlop={12}
        >
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={colors.text.secondary}
          />
        </Pressable>
        <Text style={styles.headerTitle}>Transaction details</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Amount Focus */}
        <View style={styles.hero}>
          <Text style={styles.typeLabel}>
            {isIncomeTx ? "Income" : "Expense"}
          </Text>
          <Text style={[styles.amount, { color: amountColor }]}>
            {signedAmount}
          </Text>
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          {/* Source (Income only) */}
          {isIncomeTx && tx.source_name && (
            <View
              style={[
                styles.detailRow,
                lastDetailRow === "source" && styles.detailRowNoBorder,
              ]}
            >
              <Text style={styles.detailLabel}>Source</Text>
              <Text style={styles.detailValue}>{tx.source_name}</Text>
            </View>
          )}

          {/* Category */}
          <View
            style={[
              styles.detailRow,
              lastDetailRow === "category" && styles.detailRowNoBorder,
            ]}
          >
            <Text style={styles.detailLabel}>Category</Text>
            <View style={styles.detailValueRow}>
              {isIncomeTx ? null : (
                <MaterialIcons
                  name={iconName}
                  size={18}
                  color={colors.text.secondary}
                />
              )}
              <Text style={styles.detailValue}>{tx.category.name}</Text>
            </View>
          </View>

          {/* Date */}
          <View
            style={[
              styles.detailRow,
              lastDetailRow === "date" && styles.detailRowNoBorder,
            ]}
          >
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>
              {formatDetailDate(recordedAt)}
            </Text>
          </View>

          {/* Time */}
          <View
            style={[
              styles.detailRow,
              lastDetailRow === "time" && styles.detailRowNoBorder,
            ]}
          >
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>
              {formatDetailTime(recordedAt)}
            </Text>
          </View>

          {/* Type (Income only) */}
          {isIncomeTx && tx.tag && (
            <View
              style={[
                styles.detailRow,
                lastDetailRow === "type" && styles.detailRowNoBorder,
              ]}
            >
              <Text style={styles.detailLabel}>Type</Text>
              <Text style={styles.detailValue}>{tx.tag}</Text>
            </View>
          )}

          {/* Notes */}
          {hasNotes && (
            <View
              style={[
                styles.detailRow,
                styles.detailRowColumn,
                lastDetailRow === "notes" && styles.detailRowNoBorder,
              ]}
            >
              <Text style={styles.detailLabel}>Notes</Text>
              <Text style={styles.notesText}>{tx.notes!.trim()}</Text>
            </View>
          )}

          {/* Tags */}
          {hasTags && !isIncomeTx && (
            <View
              style={[
                styles.detailRow,
                styles.detailRowColumn,
                lastDetailRow === "tags" && styles.detailRowNoBorder,
              ]}
            >
              <Text style={styles.detailLabel}>Tags</Text>
              <View style={styles.tagsContainer}>
                <View style={styles.tagPill}>
                  <Text style={styles.tagPillText}>#{tx.tag}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Income Pool Impact */}
        {showIncomePoolImpact && beforeAfter && (
          <View style={styles.impactCard}>
            <Text style={styles.impactTitle}>Income pool impact</Text>
            <View style={styles.impactFlow}>
              {/* Before */}
              <View style={styles.impactRow}>
                <Text style={styles.impactLabel}>Before</Text>
                <Text style={styles.impactValue}>
                  {formatPrice(beforeAfter.before)}
                </Text>
              </View>

              {/* Arrow */}
              <MaterialIcons
                name="arrow-downward"
                size={20}
                color={colors.text.secondary}
                style={styles.impactArrow}
              />

              {/* Expense */}
              <View style={styles.impactRow}>
                <Text style={[styles.impactLabel, { color: amountColor }]}>
                  Expense
                </Text>
                <Text style={[styles.impactValue, { color: amountColor }]}>
                  -{formatPrice(amountNum)}
                </Text>
              </View>

              {/* Arrow */}
              <MaterialIcons
                name="arrow-downward"
                size={20}
                color={colors.text.secondary}
                style={styles.impactArrow}
              />

              {/* After */}
              <View style={[styles.impactRow, styles.impactRowLast]}>
                <Text style={[styles.impactLabel, styles.impactLabelBold]}>
                  After
                </Text>
                <Text style={[styles.impactValue, styles.impactValueBold]}>
                  {formatPrice(beforeAfter.after)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Receipt */}
        {hasReceipt && (
          <View style={styles.receiptSection}>
            <Text style={styles.receiptTitle}>Receipt</Text>
            <View style={styles.receiptContainer}>
              <Image
                source={{ uri: tx.receipt_url! }}
                style={styles.receiptImage}
                resizeMode="cover"
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <Button
          width="small"
          onPress={openDeleteModal}
          disabled={deleteMutation.isPending}
          variant="danger"
          appearance="outline"
        >
          <Text style={styles.deleteBtnText}>Delete</Text>
        </Button>
        <Button flex onPress={openEdit} disabled={deleteMutation.isPending}>
          <Text style={styles.editBtnText}>Edit</Text>
        </Button>
      </View>

      <TransactionDeleteModal
        modalRef={deleteModalRef}
        isDeleting={deleteMutation.isPending}
        isExpense={tx.type === "EXPENSE"}
        onConfirmDelete={confirmDelete}
        onCancel={() => deleteModalRef.current?.dismiss()}
      />
    </SafeAreaView>
  );
}
