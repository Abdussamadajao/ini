import { useTransaction, useTransactionMutation } from "@/actions";
import { ErrorState } from "@/components/shared";
import { Skeleton } from "@/components/shared/skeleton";
import { useToast } from "@/components/toasts";
import { useTheme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAddIncomeStyles } from "./add-income-styles";
import { IncomeFormView } from "./income-form-view";
import { TAG_TABS, type IncomeFormValues } from "./income-form";

function normalizeTag(t: string | null | undefined): IncomeFormValues["tag"] {
  if (t && (TAG_TABS as readonly string[]).includes(t)) {
    return t as IncomeFormValues["tag"];
  }
  return "Monthly";
}

function parseTxAmount(amount: string): number {
  const n = Number.parseFloat(amount);
  return Number.isNaN(n) ? 0 : n;
}

export function EditIncomeScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { colors } = useTheme();
  const styles = useAddIncomeStyles();
  const { toast } = useToast();

  const {
    data: tx,
    isLoading: isTxLoading,
    isError: isTxError,
    error: txError,
    refetch: refetchTx,
  } = useTransaction(id ?? "");

  const { updateTransaction: updateTransactionMutation } =
    useTransactionMutation();
  const { mutateAsync: updateTransaction, isPending: isUpdating } =
    updateTransactionMutation;

  const initialValues = useMemo<IncomeFormValues | null>(() => {
    if (!tx || tx.type !== "INCOME") return null;
    const raw = parseTxAmount(tx.amount);
    return {
      amount: raw === 0 ? "" : String(raw),
      sourceName: tx.source_name ?? "",
      categoryId: tx.category_id,
      tag: normalizeTag(tx.tag),
      date: new Date(tx.recorded_at),
      notes: tx.notes ?? "",
    };
  }, [tx]);

  const handleSubmit = useCallback(
    async (values: IncomeFormValues) => {
      if (!id) return;

      await updateTransaction({
        id: id ?? "",
        body: {
          amount: parseFloat(values.amount.replace(/,/g, "")),
          source_name: values.sourceName.trim() || undefined,
          category_id: values.categoryId,
          recorded_at: values.date.toISOString(),
          notes: values.notes?.trim() ? values.notes : undefined,
          tag: values.tag,
        },
      });

      router.back();
    },
    [id, updateTransaction, toast],
  );

  if (!id) {
    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
            hitSlop={12}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={colors.text.primary}
            />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            Edit Income
          </Text>
        </View>
        <ErrorState
          error={txError}
          title="Missing income"
          message="Open this screen from a transaction."
          retryLabel="Go back"
          onRetry={() => refetchTx()}
        />
      </SafeAreaView>
    );
  }

  if (isTxLoading) {
    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
            hitSlop={12}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={colors.text.primary}
            />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            Edit Income
          </Text>
        </View>
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          <Skeleton width="100%" height={56} borderRadius={12} />
          <Skeleton
            width="100%"
            height={200}
            borderRadius={16}
            style={{ marginTop: 24 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (isTxError || !tx || tx.type !== "INCOME") {
    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
            hitSlop={12}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={colors.text.primary}
            />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            Edit Income
          </Text>
        </View>
        <ErrorState
          error={txError}
          title="Could not load income"
          message="Try again or go back."
          retryLabel="Try again"
          onRetry={() => refetchTx()}
        />
      </SafeAreaView>
    );
  }

  if (!initialValues) return null;

  return (
    <IncomeFormView
      headerTitle="Edit Income"
      summaryLabel="YOU'RE UPDATING"
      submitLabel="Update Income"
      initialValues={initialValues}
      isSubmitting={isUpdating}
      onSubmit={handleSubmit}
    />
  );
}
