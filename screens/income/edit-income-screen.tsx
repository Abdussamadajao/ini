import { useTransaction, useUpdateTransaction } from "@/actions";
import { useAddIncomeStyles } from "./add-income-styles";
import {
  formatIncomeAmountPreview,
  incomeFormSchema,
  TAG_TABS,
  type IncomeFormValues,
} from "./income-form";

import {
  FormikDatePicker,
  FormikAmountField,
  FormikTextfield,
} from "@/components/form";
import {
  Button,
  ErrorState,
  FormikCategorySelect,
  SegmentedTabs,
} from "@/components/shared";
import { Skeleton } from "@/components/shared/skeleton";
import { useToast } from "@/components/toasts";
import { useTheme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

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

const HEADER_BAR_HEIGHT = 56;

export function EditIncomeScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { colors } = useTheme();
  const styles = useAddIncomeStyles();
  const { toast } = useToast();
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const {
    data: tx,
    isLoading: isTxLoading,
    isError: isTxError,
    error: txError,
    refetch: refetchTx,
  } = useTransaction(id ?? "");

  const { mutateAsync: updateTransaction, isPending: isUpdating } =
    useUpdateTransaction(id ?? "");

  useEffect(() => {
    const showEvt =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvt =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const subShow = Keyboard.addListener(showEvt, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const subHide = Keyboard.addListener(hideEvt, () => {
      setKeyboardHeight(0);
    });
    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, []);

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

  const handleUpdate = useCallback(
    async (values: IncomeFormValues) => {
      if (!id) return;
      try {
        await updateTransaction({
          amount: parseFloat(values.amount.replace(/,/g, "")),
          source_name: values.sourceName.trim() || undefined,
          category_id: values.categoryId,
          recorded_at: values.date.toISOString(),
          notes: values.notes?.trim() ? values.notes : undefined,
          tag: values.tag,
        });
        toast.success("Income updated successfully");
        router.back();
      } catch (error) {
        toast.error("Failed to update income");
      }
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

      <Formik<IncomeFormValues>
        initialValues={initialValues}
        enableReinitialize
        validationSchema={incomeFormSchema}
        onSubmit={handleUpdate}
      >
        {({ values, setFieldValue, handleSubmit }) => {
          const previewTitle = values.sourceName.trim() || "Income";
          const previewAmount = formatIncomeAmountPreview(values.amount);

          const keyboardPad =
            keyboardHeight > 0
              ? Math.round(keyboardHeight * (Platform.OS === "ios" ? 0.4 : 1))
              : 0;
          const scrollBottomPad = 24 + insets.bottom + keyboardPad;

          const amountNum = parseFloat((values.amount ?? "").replace(/,/g, ""));
          const isAmountValid = !Number.isNaN(amountNum) && amountNum > 0;
          const isFormValid =
            isAmountValid &&
            !!values.categoryId &&
            !!values.tag &&
            !!values.date;

          return (
            <KeyboardAvoidingView
              style={styles.flex}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={insets.top + HEADER_BAR_HEIGHT}
              enabled
            >
              <>
                <ScrollView
                  style={styles.scroll}
                  contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: scrollBottomPad },
                  ]}
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode={
                    Platform.OS === "ios" ? "interactive" : "on-drag"
                  }
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.amountSection}>
                    <View style={styles.typeChip}>
                      <MaterialIcons
                        name="arrow-upward"
                        size={13}
                        color={colors.primary.main}
                      />
                      <Text style={styles.typeChipText}>Income</Text>
                    </View>
                    <FormikAmountField
                      name="amount"
                      maxLength={16}
                      showFormikError
                    />
                  </View>

                  <View style={styles.ledger}>
                    <View style={styles.ledgerRow}>
                      <FormikTextfield
                        name="sourceName"
                        label="SOURCE NAME"
                        placeholder="e.g march salary"
                        labelStyle={styles.upperLabel}
                        showFormikError
                      />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.ledgerRow}>
                      <FormikCategorySelect
                        name="categoryId"
                        categoryType="INCOME"
                        required
                      />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.ledgerRow}>
                      <View style={styles.rowLabel}>
                        <View style={styles.rowIconBadge}>
                          <MaterialIcons
                            name="sell"
                            size={12}
                            color={colors.primary.main}
                          />
                        </View>
                        <Text style={styles.upperLabel}>TAG</Text>
                      </View>
                      <SegmentedTabs
                        tabs={TAG_TABS}
                        activeTab={values.tag}
                        onChange={(tag) => setFieldValue("tag", tag)}
                      />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.ledgerRow}>
                      <View style={styles.rowLabel}>
                        <View style={styles.rowIconBadge}>
                          <MaterialIcons
                            name="event"
                            size={12}
                            color={colors.primary.main}
                          />
                        </View>
                        <Text style={styles.upperLabel}>DATE</Text>
                      </View>
                      <FormikDatePicker
                        name="date"
                        label=""
                        calendarIconColor={colors.primary.main}
                        backgroundColor={colors.background.surface}
                        borderColor={colors.border.default}
                        showFormikError
                      />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.ledgerRow}>
                      <FormikTextfield
                        name="notes"
                        label="NOTE (OPT)"
                        placeholder="Add some..."
                        multiline
                        numberOfLines={3}
                        labelStyle={styles.upperLabel}
                        showFormikError
                      />
                    </View>
                  </View>
                </ScrollView>

                <View style={styles.saveRow}>
                  <View style={styles.summaryStrip}>
                    <View style={styles.summaryTextCol}>
                      <Text style={styles.summaryMeta}>YOU'RE UPDATING</Text>
                      <Text style={styles.summaryLine}>
                        <Text style={{ color: colors.primary.main }}>
                          {previewAmount}
                        </Text>
                        <Text style={{ color: colors.text.secondary }}>
                          {" "}
                          from{" "}
                        </Text>
                        <Text style={{ color: colors.text.primary }}>
                          {previewTitle}
                        </Text>
                      </Text>
                    </View>
                  </View>
                  <Button
                    onPress={() => handleSubmit()}
                    style={styles.saveBtn}
                    disabled={isUpdating || !isFormValid}
                  >
                    <Text
                      style={[
                        styles.saveBtnText,
                        { color: colors.primary.contrastText },
                      ]}
                    >
                      Update Income
                    </Text>
                    <MaterialIcons
                      name="arrow-forward"
                      size={22}
                      color={colors.primary.contrastText}
                    />
                  </Button>
                </View>
              </>
            </KeyboardAvoidingView>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
}
