import { useCategories, useTransactionMutation } from "@/actions";
import {
  FormikAmountField,
  FormikDatePicker,
  FormikTextfield,
} from "@/components/form";
import {
  Button,
  FormikCategorySelect,
  SegmentedTabs,
} from "@/components/shared";
import { useToast } from "@/components/toasts";
import { useTheme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
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
import { useAddIncomeStyles } from "./add-income-styles";
import {
  formatIncomeAmountPreview,
  incomeFormSchema,
  TAG_TABS,
  type IncomeFormValues,
} from "./income-form";

const HEADER_BAR_HEIGHT = 56;

export function AddIncomeScreen() {
  const { colors } = useTheme();
  const styles = useAddIncomeStyles();
  const { toast } = useToast();
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useCategories();
  const { createTransaction: createTransactionMutation } =
    useTransactionMutation();
  const { mutateAsync: createTransaction, isPending } =
    createTransactionMutation;
  const incomeCategories = useMemo(
    () => categories.filter((category) => category.type === "INCOME"),
    [categories],
  );
  const firstIncomeCategory = incomeCategories[0];

  const initialValues: IncomeFormValues = useMemo(
    () => ({
      amount: "",
      sourceName: "",
      categoryId: firstIncomeCategory?.id ?? "",
      tag: "Monthly",
      date: new Date(),
      notes: "",
    }),
    [firstIncomeCategory?.id],
  );

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

  const handleCreateIncome = useCallback(
    async (values: IncomeFormValues) => {
      try {
        await createTransaction({
          amount: parseFloat(values.amount.replace(/,/g, "")),
          source_name: values.sourceName,
          category_id: values.categoryId,
          recorded_at: values.date.toISOString(),
          notes: values.notes ?? undefined,
          tag: values.tag,
          type: "INCOME",
        });
        toast.success("Income added successfully");
        router.back();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        toast.error(message);
      }
    },
    [createTransaction, toast],
  );

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
          Add Income
        </Text>
      </View>

      <Formik<IncomeFormValues>
        initialValues={initialValues}
        enableReinitialize
        validationSchema={incomeFormSchema}
        onSubmit={async (values) => {
          await handleCreateIncome(values);
        }}
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
                        onTabChange={(tag) => setFieldValue("tag", tag)}
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
                      <Text style={styles.summaryMeta}>YOU'RE ADDING</Text>
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
                    disabled={isPending || !isFormValid}
                  >
                    <Text
                      style={[
                        styles.saveBtnText,
                        { color: colors.primary.contrastText },
                      ]}
                    >
                      Save Income
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
