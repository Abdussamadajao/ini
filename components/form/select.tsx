import { makeStyles, useColors, useIsDark } from "@/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  BottomSheetModal,
  useBottomSheetScrollableCreator,
} from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { useField } from "formik";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Pressable,
  StyleProp,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import BlurBackdrop, { BlurBackdropProps } from "../shared/blur-backdrop";

export type SelectOption =
  | string
  | { value: string; label?: string; children?: React.ReactNode };

function normalizeOptions(
  opts: SelectOption[],
): { value: string; label: string; children?: React.ReactNode }[] {
  return opts.map((o) =>
    typeof o === "string"
      ? { value: o, label: o }
      : { value: o.value, label: o.label ?? o.value, children: o.children },
  );
}

function letterKey(label: string): string {
  const t = label.trim();
  if (!t) return "#";
  const ch = t.charAt(0).toUpperCase();
  return /[A-Z]/.test(ch) ? ch : "#";
}

type HeaderItem = { type: "header"; title: string };
type RowItem = {
  type: "row";
  value: string;
  label: string;
  children?: React.ReactNode;
};
type ListItem = HeaderItem | RowItem;

function buildFlatList(
  items: { value: string; label: string; children?: React.ReactNode }[],
  grouped: boolean,
): ListItem[] {
  if (!grouped) {
    return items.map((item) => ({ type: "row", ...item }));
  }
  const map = new Map<string, typeof items>();
  for (const item of items) {
    const key = letterKey(item.label);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  const titles = Array.from(map.keys()).sort((a, b) => {
    if (a === "#") return 1;
    if (b === "#") return -1;
    return a.localeCompare(b);
  });
  const flat: ListItem[] = [];
  for (const title of titles) {
    flat.push({ type: "header", title });
    for (const item of map
      .get(title)!
      .sort((x, y) => x.label.localeCompare(y.label))) {
      flat.push({ type: "row", ...item });
    }
  }
  return flat;
}

export type SelectSize = "sm" | "md" | "lg";

type SizeConfig = {
  minHeight: number;
  paddingVertical: number;
  paddingHorizontal: number;
  fontSize: number;
  iconBadge: number;
};

const SIZE_CONFIG: Record<SelectSize, SizeConfig> = {
  sm: {
    minHeight: 40,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 14,
    iconBadge: 24,
  },
  md: {
    minHeight: 46,
    paddingVertical: 9,
    paddingHorizontal: 12,
    fontSize: 15,
    iconBadge: 26,
  },
  lg: {
    minHeight: 56,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 16,
    iconBadge: 30,
  },
};

type BaseSelectProps = {
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  modalTitle?: string;
  modalHeaderRight?: (closeModal: () => void) => React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  renderListHeader?: (closeModal: () => void) => React.ReactNode;
  listDisabled?: boolean;
  snapPoints?: (string | number)[];
  error?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  groupAlphabetically?: boolean;
  /** Copy shown when `options` itself is empty (not a search dead-end). */
  emptyStateTitle?: string;
  emptyStateMessage?: string;
  emptyStateIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  /** Preset trigger height/padding/font. Defaults to "md" (46px). */
  size?: SelectSize;
  /** Escape hatch for full manual control over the trigger's height/padding, overriding `size`. */
  triggerStyle?: StyleProp<ViewStyle>;
};

export type SelectProps = BaseSelectProps & {
  value: string | null;
  onChange: (value: string | null) => void;
};

export type FormikSelectProps = BaseSelectProps & {
  name: string;
  validate?: (value: string | null) => string | undefined;
  showFormikError?: boolean;
  required?: boolean;
};

const SelectUI: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  label = "",
  placeholder = "Select...",
  modalTitle = "Select",
  modalHeaderRight,
  leftIcon,
  rightIcon,
  style,
  renderListHeader,
  listDisabled = false,
  snapPoints: snapPointsProp,
  error,
  searchable = true,
  searchPlaceholder = "Search...",
  groupAlphabetically,
  emptyStateTitle = "Nothing here yet",
  emptyStateMessage = "There's nothing to choose from right now.",
  emptyStateIcon = "tray-remove",
  size = "md",
  triggerStyle,
}) => {
  const colors = useColors();
  const isDark = useIsDark();
  const styles = useSelectStyles();
  const modalRef = useRef<BottomSheetModal>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const BottomSheetScrollable = useBottomSheetScrollableCreator();

  const sizeConfig = SIZE_CONFIG[size];

  const items = useMemo(() => normalizeOptions(options), [options]);
  const shouldGroup = groupAlphabetically === true;
  const hasAnyOptions = items.length > 0;

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.value.toLowerCase().includes(query),
    );
  }, [items, searchQuery]);

  const flatItems = useMemo(
    () => buildFlatList(filteredItems, shouldGroup),
    [filteredItems, shouldGroup],
  );

  const openModal = useCallback(() => {
    setSearchQuery("");
    modalRef.current?.present();
  }, []);
  const closeModal = useCallback(() => {
    setSearchQuery("");
    modalRef.current?.dismiss();
  }, []);
  const clearSearch = useCallback(() => setSearchQuery(""), []);

  const snapPoints = useMemo(() => snapPointsProp ?? ["54%"], [snapPointsProp]);
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

  const handleSelect = useCallback(
    (val: string) => {
      onChange(val);
      closeModal();
    },
    [onChange, closeModal],
  );

  const selectedLabel = value
    ? (items.find((i) => i.value === value)?.label ?? value)
    : null;
  const displayValue = selectedLabel ?? placeholder;

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === "header") {
        return (
          <View style={styles.sectionHeaderWrap}>
            <View style={styles.sectionHeaderPill}>
              <Text style={styles.sectionHeaderText}>{item.title}</Text>
            </View>
          </View>
        );
      }
      const isSelected = value === item.value;
      return (
        <Pressable
          style={({ pressed }) => [
            styles.optionItem,
            isSelected && styles.optionItemSelected,
            !isSelected && pressed && styles.optionItemPressed,
          ]}
          onPress={() => !listDisabled && handleSelect(item.value)}
          disabled={listDisabled}
        >
          {isSelected && <View style={styles.optionAccentBar} />}
          {item.children != null ? (
            <View style={styles.optionItemContent}>{item.children}</View>
          ) : (
            <Text
              style={[
                styles.optionItemText,
                isSelected && styles.optionItemTextSelected,
                listDisabled && styles.optionItemTextDisabled,
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          )}
          {isSelected && (
            <View style={styles.checkBadge}>
              <MaterialCommunityIcons
                name="check"
                size={13}
                color={colors.primary.contrastText}
              />
            </View>
          )}
        </Pressable>
      );
    },
    [value, listDisabled, handleSelect, styles, colors.primary.contrastText],
  );

  const keyExtractor = useCallback(
    (item: ListItem) =>
      item.type === "header" ? `header-${item.title}` : item.value,
    [],
  );

  const getItemType = useCallback((item: ListItem) => item.type, []);

  const isSearchDeadEnd = hasAnyOptions && searchQuery.trim().length > 0;

  const ListEmpty = useCallback(() => {
    if (isSearchDeadEnd) {
      return (
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIconBadge}>
            <MaterialCommunityIcons
              name="magnify-close"
              size={26}
              color={colors.text.secondary}
            />
          </View>
          <Text style={styles.emptyTitle}>No matches</Text>
          <Text style={styles.emptyMessage}>
            Nothing found for "{searchQuery.trim()}".
          </Text>
          <Pressable onPress={clearSearch} style={styles.emptyClearBtn}>
            <Text style={styles.emptyClearBtnText}>Clear search</Text>
          </Pressable>
        </View>
      );
    }
    return (
      <View style={styles.emptyWrap}>
        <View style={styles.emptyIconBadge}>
          <MaterialCommunityIcons
            name={emptyStateIcon}
            size={26}
            color={colors.text.secondary}
          />
        </View>
        <Text style={styles.emptyTitle}>{emptyStateTitle}</Text>
        <Text style={styles.emptyMessage}>{emptyStateMessage}</Text>
      </View>
    );
  }, [
    isSearchDeadEnd,
    searchQuery,
    clearSearch,
    emptyStateIcon,
    emptyStateTitle,
    emptyStateMessage,
    styles,
    colors.text.secondary,
  ]);

  return (
    <>
      <View style={[styles.wrapper, style]}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <Pressable
          style={[
            styles.select,
            {
              minHeight: sizeConfig.minHeight,
              paddingVertical: sizeConfig.paddingVertical,
              paddingHorizontal: sizeConfig.paddingHorizontal,
              backgroundColor: isDark
                ? colors.background.surface
                : colors.background.surfaceAlt,
            },
            error && styles.selectError,
            triggerStyle,
          ]}
          onPress={openModal}
        >
          {leftIcon ? (
            <View
              style={[
                styles.leftIconBadge,
                { width: sizeConfig.iconBadge, height: sizeConfig.iconBadge },
              ]}
            >
              {leftIcon}
            </View>
          ) : null}
          <Text
            style={[
              styles.value,
              { fontSize: sizeConfig.fontSize },
              !value && styles.valuePlaceholder,
            ]}
            numberOfLines={1}
          >
            {displayValue}
          </Text>
          <View
            style={[
              styles.rightIconBadge,
              { width: sizeConfig.iconBadge, height: sizeConfig.iconBadge },
            ]}
          >
            {rightIcon ?? (
              <MaterialCommunityIcons
                name="chevron-down"
                size={18}
                color={colors.text.secondary}
              />
            )}
          </View>
        </Pressable>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <BottomSheetModal
        ref={modalRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDismissOnClose
        enableContentPanningGesture
        enableHandlePanningGesture
        enableDynamicSizing={false}
        backgroundStyle={styles.modalBackground}
        handleIndicatorStyle={styles.handleIndicator}
        backdropComponent={renderBackdrop}
        android_keyboardInputMode="adjustResize"
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
      >
        <View style={styles.sheetRoot}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} numberOfLines={1}>
              {modalTitle}
            </Text>
            {modalHeaderRight?.(closeModal) ?? (
              <Pressable
                onPress={closeModal}
                style={styles.closeButton}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <MaterialCommunityIcons
                  name="close"
                  size={18}
                  color={colors.text.primary}
                />
              </Pressable>
            )}
          </View>

          {searchable && hasAnyOptions ? (
            <View style={styles.searchSticky}>
              <View style={styles.searchWrap}>
                <MaterialCommunityIcons
                  name="magnify"
                  size={20}
                  color={colors.text.muted}
                />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder={searchPlaceholder}
                  placeholderTextColor={colors.text.muted}
                  style={styles.searchInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {searchQuery.length > 0 && (
                  <Pressable
                    onPress={clearSearch}
                    hitSlop={8}
                    style={styles.searchClearBtn}
                  >
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={16}
                      color={colors.text.muted}
                    />
                  </Pressable>
                )}
              </View>
            </View>
          ) : null}

          {renderListHeader?.(closeModal)}

          <View style={styles.listWrap}>
            <FlashList
              data={flatItems}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              getItemType={getItemType}
              ListEmptyComponent={ListEmpty}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={[
                styles.listContent,
                flatItems.length === 0 && styles.listContentEmpty,
              ]}
              renderScrollComponent={BottomSheetScrollable}
            />
          </View>
        </View>
      </BottomSheetModal>
    </>
  );
};

export const FormikSelect: React.FC<FormikSelectProps> = ({
  name,
  validate,
  showFormikError = true,
  required = false,
  error: errorOverride,
  ...rest
}) => {
  const [field, meta, helpers] = useField<string | null>({
    name,
    validate: (val) => {
      const empty = val == null || val === "";
      if (!required && empty) return undefined;
      if (required && empty) return "Required";
      return validate ? validate(val) : undefined;
    },
  });
  const value = field.value ?? null;
  const error =
    errorOverride ??
    (showFormikError && meta.touched
      ? (meta.error as string | undefined)
      : undefined);
  return (
    <SelectUI
      value={value}
      onChange={(v) => {
        helpers.setValue(v, true);
        helpers.setTouched(true, false);
      }}
      error={error}
      {...rest}
    />
  );
};

const useSelectStyles = makeStyles(
  ({ colors, radius, typography, spacing }) => ({
    wrapper: { marginBottom: spacing[4] },
    label: {
      fontSize: typography.fontSize.xs,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      color: colors.text.secondary,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      marginBottom: spacing[2],
      paddingHorizontal: spacing[1],
    },
    select: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: colors.border.subtle,
      height: 56,
    },
    selectError: { borderColor: colors.status.error.main },
    value: {
      flex: 1,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      color: colors.text.primary,
      marginRight: 10,
    },
    leftIconBadge: {
      borderRadius: radius.full,
      backgroundColor: colors.primary.main + "14",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 8,
    },
    rightIconBadge: {
      borderRadius: radius.full,
      backgroundColor: colors.background.screen,
      alignItems: "center",
      justifyContent: "center",
    },
    valuePlaceholder: {
      fontFamily: typography.fontFamily.Manrope.Medium,
      color: colors.text.secondary,
    },
    errorText: {
      color: colors.status.error.main,
      fontSize: typography.fontSize.xs,
      marginTop: spacing[1],
      fontFamily: typography.fontFamily.Manrope.Medium,
      paddingHorizontal: spacing[1],
    },
    modalBackground: {
      backgroundColor: colors.background.surface,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
    },
    handleIndicator: {
      backgroundColor: colors.border.subtle,
      width: 40,
      height: 6,
      borderRadius: 3,
    },
    sheetRoot: { flex: 1 },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing[6],
      paddingTop: spacing[2],
      paddingBottom: spacing[4],
      minHeight: 56,
      backgroundColor: colors.background.surface,
    },
    modalTitle: {
      flex: 1,
      marginRight: spacing[3],
      fontSize: typography.fontSize["2xl"],
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.text.primary,
    },
    closeButton: {
      width: 30,
      height: 30,
      borderRadius: radius.full,
      backgroundColor: colors.background.surfaceAlt,
      alignItems: "center",
      justifyContent: "center",
    },
    searchSticky: {
      paddingHorizontal: spacing[6],
      paddingBottom: spacing[4],
      backgroundColor: colors.background.surface,
    },
    searchWrap: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[2],
      backgroundColor: colors.background.screen,
      borderRadius: radius.xl,
      minHeight: 46,
      paddingHorizontal: spacing[4],
    },
    searchInput: {
      flex: 1,
      minHeight: 46,
      fontSize: typography.fontSize.md,
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Manrope.Medium,
    },
    searchClearBtn: {
      padding: 2,
    },
    listWrap: { flex: 1, minHeight: 0 },
    listContent: {
      paddingBottom: spacing[10],
    },
    listContentEmpty: {
      flexGrow: 1,
    },
    sectionHeaderWrap: {
      paddingHorizontal: spacing[6],
      paddingTop: spacing[4],
      paddingBottom: spacing[2],
      backgroundColor: colors.background.surface,
    },
    sectionHeaderPill: {
      alignSelf: "flex-start",
      paddingHorizontal: spacing[2.5],
      paddingVertical: 3,
      borderRadius: radius.full,
      backgroundColor: colors.primary.main + "14",
    },
    sectionHeaderText: {
      fontSize: 10,
      fontFamily: typography.fontFamily.Manrope.Bold,
      letterSpacing: 0.6,
      color: colors.primary.main,
    },
    optionItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[4],
      position: "relative",
    },
    optionItemSelected: {
      backgroundColor: colors.primary.soft,
    },
    optionItemPressed: {
      backgroundColor: colors.background.screen,
    },
    optionAccentBar: {
      position: "absolute",
      left: 0,
      top: spacing[2],
      bottom: spacing[2],
      width: 3,
      borderTopRightRadius: 3,
      borderBottomRightRadius: 3,
      backgroundColor: colors.primary.main,
    },
    optionItemContent: { flex: 1, minWidth: 0 },
    optionItemText: {
      flex: 1,
      fontSize: typography.fontSize.md,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      color: colors.text.primary,
    },
    optionItemTextSelected: {
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.primary.main,
    },
    optionItemTextDisabled: { color: colors.text.secondary },
    checkBadge: {
      width: 20,
      height: 20,
      borderRadius: radius.full,
      backgroundColor: colors.primary.main,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: spacing[2],
    },
    emptyWrap: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing[8],
      paddingVertical: spacing[10],
    },
    emptyIconBadge: {
      width: 56,
      height: 56,
      borderRadius: radius.full,
      backgroundColor: colors.background.surfaceAlt,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing[4],
    },
    emptyTitle: {
      fontSize: typography.fontSize.md,
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.text.primary,
      marginBottom: spacing[1.5],
      textAlign: "center",
    },
    emptyMessage: {
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.Manrope.Medium,
      color: colors.text.secondary,
      textAlign: "center",
      lineHeight: 20,
    },
    emptyClearBtn: {
      marginTop: spacing[4],
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2.5],
      borderRadius: radius.full,
      backgroundColor: colors.primary.main + "14",
    },
    emptyClearBtnText: {
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.primary.main,
    },
  }),
);

export { SelectUI as Select };
export default SelectUI;
