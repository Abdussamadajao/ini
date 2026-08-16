import { makeStyles, useTheme } from "@/theme";
import { useField } from "formik";
import React from "react";
import { Text, TextInput, View } from "react-native";

export type AmountFieldProps = {
  value: string;
  onChangeText: (raw: string) => void;
  onBlur?: () => void;
  currencySymbol?: string;
  maxLength?: number;
  /** Overrides theme primary for currency + amount (e.g. danger when over limit). */
  accentColor?: string;
};

const AMOUNT_FONT_SIZE = 44;
const MAX_AMOUNT = 100_000_000_000;

function sanitizeRaw(text: string, maxRawLen: number): string {
  let t = text.replace(/,/g, "").replace(/[^\d.]/g, "");
  const dot = t.indexOf(".");
  if (dot !== -1) {
    t =
      t.slice(0, dot + 1) +
      t
        .slice(dot + 1)
        .replace(/\./g, "")
        .slice(0, 2);
  }
  if (t.startsWith(".")) t = `0${t}`;
  const clamped = t.slice(0, maxRawLen);
  const numeric = parseFloat(clamped);
  if (!Number.isNaN(numeric) && numeric >= MAX_AMOUNT) {
    return MAX_AMOUNT.toString();
  }
  return clamped;
}

function formatDisplay(raw: string): string {
  if (!raw) return "";
  const trailingDot = raw.endsWith(".") && raw.split(".").length === 2;
  const body = trailingDot ? raw.slice(0, -1) : raw;
  const [intPart = "", decPart] = body.split(".");
  const intDigits = intPart.replace(/\D/g, "");
  const decDigits =
    decPart !== undefined ? decPart.replace(/\D/g, "").slice(0, 2) : undefined;

  let intFormatted = "";
  if (intDigits !== "") {
    const trimmed = intDigits.replace(/^0+/, "") || "0";
    const n = parseInt(trimmed, 10);
    intFormatted = Number.isNaN(n) ? intDigits : n.toLocaleString("en-NG");
  }

  if (trailingDot) {
    return intFormatted === "" ? "." : `${intFormatted}.`;
  }
  if (decPart !== undefined) {
    const whole = intFormatted === "" ? "0" : intFormatted;
    return `${whole}.${decDigits ?? ""}`;
  }
  return intFormatted;
}

export function AmountField({
  value,
  onChangeText,
  onBlur,
  currencySymbol = "₦",
  maxLength = 15,
  accentColor,
}: AmountFieldProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const displayValue = formatDisplay(value);
  const tint = accentColor ?? colors.primary.main;

  const handleAmountChange = (text: string) => {
    const sanitized = sanitizeRaw(text, maxLength);
    onChangeText(sanitized);
  };

  return (
    <View style={styles.amountSection}>
      <View style={styles.amountRow}>
        <Text
          style={[
            styles.currencySymbol,
            {
              fontSize: AMOUNT_FONT_SIZE,
              color: tint,
              lineHeight: AMOUNT_FONT_SIZE * 0.95,
            },
          ]}
        >
          {currencySymbol}
        </Text>
        <TextInput
          style={[
            styles.amountDisplay,
            { fontSize: AMOUNT_FONT_SIZE, color: tint },
          ]}
          value={displayValue}
          onChangeText={handleAmountChange}
          onBlur={onBlur}
          keyboardType="decimal-pad"
          selectionColor={tint}
          cursorColor={tint}
          placeholder="0.00"
          placeholderTextColor={tint + "55"}
        />
      </View>
      <Text style={[styles.amountHint, { color: colors.text.secondary }]}>
        ENTER AMOUNT
      </Text>
    </View>
  );
}

export type FormikAmountFieldProps = Omit<
  AmountFieldProps,
  "value" | "onChangeText" | "onBlur"
> & {
  name: string;
  validate?: (value: string) => string | undefined;
  showFormikError?: boolean;
  required?: boolean;
  error?: string;
};

export function FormikAmountField({
  name,
  validate,
  showFormikError = true,
  required = false,
  error: errorOverride,
  currencySymbol,
  maxLength,
  accentColor,
}: FormikAmountFieldProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  const [field, meta, helpers] = useField<string>({
    name,
    validate: (val: string) => {
      if (!required && !val) return undefined;
      return validate ? validate(val) : undefined;
    },
  });

  const error =
    errorOverride ?? (showFormikError && meta.touched ? meta.error : undefined);

  return (
    <View style={styles.formikWrap}>
      <AmountField
        value={field.value ?? ""}
        onChangeText={helpers.setValue}
        onBlur={() => helpers.setTouched(true, true)}
        currencySymbol={currencySymbol}
        maxLength={maxLength}
        accentColor={accentColor}
      />
      {error ? (
        <Text style={[styles.errorText, { color: colors.status.error.main }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

export default AmountField;

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(({ colors, spacing, radius, typography }) => ({
  amountSection: {
    alignItems: "center",
    alignSelf: "stretch",
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
    paddingHorizontal: spacing[1],
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  currencySymbol: {
    fontFamily: typography.fontFamily.Manrope.Bold,
    marginBottom: 2,
  },
  amountDisplay: {
    fontFamily: typography.fontFamily.Manrope.Bold,
    letterSpacing: -1,
    minWidth: 20,
    padding: 0,
    includeFontPadding: false,
  },
  amountHint: {
    fontFamily: typography.fontFamily.Manrope.SemiBold,
    fontSize: 11,
    letterSpacing: 2.5,
    marginTop: spacing[2.5],
    textAlign: "center",
  },
  formikWrap: {
    alignSelf: "stretch",
  },
  errorText: {
    fontSize: 12,
    marginTop: spacing[1.5],
    marginLeft: spacing[1],
    fontFamily: typography.fontFamily.Manrope.Medium,
  },
}));
