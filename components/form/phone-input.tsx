import { countries } from "@/constants/countries";
import { makeStyles, useColors } from "@/theme";
import { Country } from "@/types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useField, useFormikContext } from "formik";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type PhoneNumberInputProps = {
  value?: string;
  dialCode?: string;
  countryCode?: string;
  onChangePhone?: (dialCode: string, number: string) => void;
  onChangeCountryCode?: (countryCode: string) => void;
  onBlur?: () => void;
  label?: string;
  placeholder?: string;
  error?: string;
};

type FormikPhoneNumberInputProps = Omit<
  PhoneNumberInputProps,
  | "value"
  | "dialCode"
  | "countryCode"
  | "onChangePhone"
  | "onChangeCountryCode"
  | "error"
  | "onBlur"
> & {
  name: string;
  dialCodeName?: string;
  countryCodeName?: string;
  validate?: (value: string) => string | undefined;
  showFormikError?: boolean;
  required?: boolean;
  error?: string;
};

const sanitizeDialCode = (dialCode: string) => {
  const cleaned = dialCode.replace(/[^\d+]/g, "");
  if (!cleaned) return "";
  return cleaned.startsWith("+") ? cleaned : `+${cleaned.replace(/\+/g, "")}`;
};

const sanitizeLocalNumber = (number: string) => number.replace(/\D/g, "");

const buildStoredPhoneValue = (dialCode: string, number: string) =>
  `${sanitizeDialCode(dialCode)}${sanitizeLocalNumber(number)}`;

const extractLocalNumber = (storedValue: string, dialCode?: string) => {
  if (!storedValue) return "";
  const trimmed = storedValue.trim();
  const digits = sanitizeLocalNumber(trimmed);
  if (!trimmed.startsWith("+")) return digits;

  const normalizedDialCode = dialCode ? sanitizeDialCode(dialCode) : "";
  const dialDigits = sanitizeLocalNumber(normalizedDialCode);
  if (dialDigits && digits.startsWith(dialDigits)) {
    return digits.slice(dialDigits.length);
  }

  const knownDialDigits = countries
    .map((country) => sanitizeLocalNumber(country.dial_code))
    .sort((a, b) => b.length - a.length);
  const matchedDial = knownDialDigits.find((candidate) =>
    digits.startsWith(candidate),
  );

  return matchedDial ? digits.slice(matchedDial.length) : digits;
};

export function PhoneNumberInput({
  value = "",
  dialCode,
  countryCode,
  onChangePhone,
  onChangeCountryCode,
  onBlur,
  label = "phone number",
  placeholder = "000 000 0000",
  error,
}: PhoneNumberInputProps) {
  const styles = useStyles();
  const colors = useColors();

  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countries.find(
      (c) =>
        c.code === countryCode || c.dial_code === dialCode || c.code === "NG",
    ) ?? countries[0],
  );
  const [phoneNumber, setPhoneNumber] = useState(value);
  const [search, setSearch] = useState("");

  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["60%", "85%"], []);

  const openSheet = useCallback(() => {
    setSearch("");
    sheetRef.current?.present();
  }, []);

  const closeSheet = useCallback(() => {
    sheetRef.current?.dismiss();
  }, []);

  const handleCountrySelect = useCallback(
    (country: Country) => {
      setSelectedCountry(country);
      closeSheet();
      onChangeCountryCode?.(country.code);
      onChangePhone?.(country.dial_code, phoneNumber);
    },
    [closeSheet, phoneNumber, onChangePhone, onChangeCountryCode],
  );

  const handlePhoneChange = useCallback(
    (text: string) => {
      setPhoneNumber(text);
      onChangePhone?.(selectedCountry.dial_code, text);
    },
    [selectedCountry, onChangePhone],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dial_code.includes(q),
    );
  }, [search]);

  React.useEffect(() => {
    setPhoneNumber(value);
  }, [value]);

  React.useEffect(() => {
    if (!countryCode) return;
    const matched = countries.find((country) => country.code === countryCode);
    if (matched) setSelectedCountry(matched);
  }, [countryCode]);

  React.useEffect(() => {
    if (!dialCode) return;
    const matched = countries.find((country) => country.dial_code === dialCode);
    if (matched) setSelectedCountry(matched);
  }, [dialCode]);

  const renderCountryItem = useCallback(
    ({ item }: { item: Country }) => {
      const isSelected = item.code === selectedCountry.code;
      return (
        <Pressable
          style={[styles.countryItem, isSelected && styles.countryItemActive]}
          onPress={() => handleCountrySelect(item)}
        >
          <Text style={styles.countryFlag}>{item.flag || "🏳️"}</Text>
          <View style={styles.countryInfo}>
            <Text
              style={[
                styles.countryName,
                isSelected && styles.countryNameActive,
              ]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text style={styles.countryDial}>{item.dial_code}</Text>
          </View>
          {isSelected && (
            <MaterialCommunityIcons
              name="check-circle"
              size={20}
              color={colors.primary.main}
            />
          )}
        </Pressable>
      );
    },
    [selectedCountry, handleCountrySelect, styles, colors],
  );

  return (
    <>
      {/* ── Input field ── */}
      <View style={styles.wrapper}>
        {label ? <Text style={styles.label}>{label}</Text> : null}

        <View style={[styles.inputRow, error ? styles.inputRowError : null]}>
          <Pressable style={styles.dialTrigger} onPress={openSheet}>
            <Text style={styles.flagText}>{selectedCountry.flag || "🏳️"}</Text>
            <Text style={styles.dialCode}>{selectedCountry.dial_code}</Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={16}
              color={colors.text.secondary}
            />
          </Pressable>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Phone number */}
          <TextInput
            style={styles.phoneInput}
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor={colors.text.muted}
            keyboardType="phone-pad"
            returnKeyType="done"
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDynamicSizing={false}
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.sheetHandle}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            opacity={0.35}
          />
        )}
        android_keyboardInputMode="adjustResize"
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
      >
        <View style={styles.sheetContainer}>
          <BottomSheetView style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Select country</Text>
          </BottomSheetView>

          <BottomSheetScrollView
            style={styles.sheetScroll}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.searchRow}>
              <MaterialCommunityIcons
                name="magnify"
                size={18}
                color={colors.text.secondary}
                style={styles.searchIcon}
              />
              <BottomSheetTextInput
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder="Search country or code…"
                placeholderTextColor={colors.text.muted}
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
            </View>
            {filtered.map((item) => (
              <React.Fragment key={item.code}>
                {renderCountryItem({ item })}
                <View style={styles.separator} />
              </React.Fragment>
            ))}
            {!filtered.length ? (
              <Text style={styles.emptyText}>No results found.</Text>
            ) : null}
          </BottomSheetScrollView>
        </View>
      </BottomSheetModal>
    </>
  );
}

export function FormikPhoneNumberInput({
  name,
  dialCodeName,
  countryCodeName,
  validate,
  showFormikError = true,
  required = false,
  error: errorOverride,
  ...rest
}: FormikPhoneNumberInputProps) {
  const [field, meta, helpers] = useField<string>({
    name,
    validate: (val: string) => {
      if (!required && !val) return undefined;
      if (required && !val) return "Required";
      return validate ? validate(val) : undefined;
    },
  });
  const { values, setFieldValue } = useFormikContext<Record<string, unknown>>();

  const dialCodeValue =
    dialCodeName && typeof values[dialCodeName] === "string"
      ? (values[dialCodeName] as string)
      : undefined;
  const countryCodeValue =
    countryCodeName && typeof values[countryCodeName] === "string"
      ? (values[countryCodeName] as string)
      : undefined;

  const error =
    errorOverride ?? (showFormikError && meta.touched ? meta.error : undefined);

  const resolvedDialCode = useMemo(() => {
    if (dialCodeValue) return sanitizeDialCode(dialCodeValue);
    if (countryCodeValue) {
      return (
        countries.find((country) => country.code === countryCodeValue)
          ?.dial_code ?? ""
      );
    }
    return "";
  }, [dialCodeValue, countryCodeValue]);

  const localNumberValue = useMemo(() => {
    return extractLocalNumber(field.value ?? "", resolvedDialCode);
  }, [field.value, resolvedDialCode]);

  return (
    <PhoneNumberInput
      value={localNumberValue}
      dialCode={dialCodeValue}
      countryCode={countryCodeValue}
      onChangePhone={(dialCode, number) => {
        helpers.setValue(buildStoredPhoneValue(dialCode, number), true);
        if (dialCodeName) {
          setFieldValue(dialCodeName, sanitizeDialCode(dialCode), true);
        }
      }}
      onChangeCountryCode={(countryCode) => {
        if (countryCodeName) {
          setFieldValue(countryCodeName, countryCode, true);
        }
      }}
      onBlur={() => {
        helpers.setTouched(true, true);
      }}
      error={error}
      {...rest}
    />
  );
}

const useStyles = makeStyles(
  ({ colors, spacing, radius, typography, shadow }) => ({
    // ── Field ──
    wrapper: {
      gap: spacing[2],
      marginBottom: 12,
    },
    label: {
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.Manrope.Medium,
      color: colors.text.primary,
      textTransform: "capitalize",
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background.surface,
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: colors.border.subtle,
      height: 56,
      overflow: "hidden",
    },
    inputRowError: {
      borderColor: colors.status.error.main,
    },

    // ── Dial trigger ──
    dialTrigger: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[1],
      paddingHorizontal: spacing[3],
      height: "100%",
    },
    flagText: {
      fontSize: 20,
    },
    dialCode: {
      fontSize: typography.fontSize.md,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      color: colors.text.primary,
      minWidth: 36,
    },
    divider: {
      width: 1,
      height: 28,
      backgroundColor: colors.border.default,
    },

    // ── Phone input ──
    phoneInput: {
      flex: 1,
      paddingHorizontal: spacing[3],
      fontSize: typography.fontSize.lg,
      fontFamily: typography.fontFamily.Manrope.Medium,
      color: colors.text.primary,
      height: "100%",
    },

    // ── Error ──
    errorText: {
      fontSize: typography.fontSize.xs,
      fontFamily: typography.fontFamily.Manrope.Medium,
      color: colors.status.error.main,
      marginTop: spacing[1],
    },

    // ── Bottom sheet ──
    sheetBg: {
      backgroundColor: colors.background.surface,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
    },
    sheetHandle: {
      backgroundColor: colors.border.default,
      width: 40,
    },
    sheetContainer: {
      flex: 1,
    },
    sheetHeader: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
      paddingBottom: spacing[2],
      borderBottomWidth: 1,
      borderBottomColor: colors.border.subtle,
      backgroundColor: colors.background.surface,
      zIndex: 1,
    },
    sheetScroll: { flex: 1 },
    sheetTitle: {
      fontSize: typography.fontSize["2xl"],
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.text.primary,
    },

    // ── Search ──
    searchRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background.surfaceAlt,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border.default,
      height: 44,
      paddingHorizontal: spacing[3],
      gap: spacing[2],
    },
    searchIcon: {
      flexShrink: 0,
    },
    searchInput: {
      flex: 1,
      fontSize: typography.fontSize.md,
      fontFamily: typography.fontFamily.Manrope.Regular,
      color: colors.text.primary,
      height: "100%",
    },

    // ── Country list ──
    listContent: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[12],
      paddingBottom: spacing[8],
    },
    countryItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[3],
      paddingVertical: spacing[3],
      height: 60,
      padding: spacing[2],
    },
    countryItemActive: {
      backgroundColor: colors.background.surfaceAlt,
      borderRadius: radius.lg,
      // selected state communicated via check icon + name color
    },
    countryFlag: {
      fontSize: 24,
      width: 32,
      textAlign: "center",
    },
    countryInfo: {
      flex: 1,
    },
    countryName: {
      fontSize: typography.fontSize.md,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      color: colors.text.primary,
    },
    countryNameActive: {
      color: colors.primary.main,
    },
    countryDial: {
      fontSize: typography.fontSize.xs,
      fontFamily: typography.fontFamily.Manrope.Regular,
      color: colors.text.secondary,
      marginTop: 1,
    },
    separator: {
      height: 1,
      backgroundColor: colors.border.subtle,
      opacity: 0.5,
    },
    emptyText: {
      textAlign: "center",
      color: colors.text.secondary,
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.Manrope.Medium,
      paddingVertical: spacing[4],
    },
  }),
);
