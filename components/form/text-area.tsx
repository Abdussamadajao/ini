import { makeStyles, useColors } from "@/theme";
import { useField } from "formik";
import React, { useState } from "react";
import {
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

type BaseProps = Omit<TextInputProps, "multiline" | "onBlur" | "style"> & {
  label: string;
  error?: string;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  onBlur?: (e: any) => void;
  /** Minimum height in px. Grows automatically past this as content wraps. */
  minHeight?: number;
  /** Shows a live "n / max" counter under the field when set. */
  showCharCount?: boolean;
};

type TextAreaProps = BaseProps & {
  value?: string;
  onChangeText?: (text: string) => void;
};

type FormikTextAreaProps = BaseProps & {
  name: string;
  validate?: (value: string) => string | undefined;
  showFormikError?: boolean;
  required?: boolean;
};

const TextAreaUI = ({
  label,
  error,
  style,
  containerStyle,
  labelStyle,
  value = "",
  onChangeText,
  onBlur,
  onFocus,
  placeholder = "Add a description...",
  minHeight = 100,
  showCharCount = false,
  maxLength,
  ...props
}: BaseProps & {
  value: string;
  onChangeText?: (t: string) => void;
}) => {
  const colors = useColors();
  const styles = useTextAreaStyles();
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          { minHeight },
          focused && styles.inputFocused,
          error && styles.inputError,
          style,
        ]}
        value={value}
        onChangeText={onChangeText}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        placeholder={placeholder}
        placeholderTextColor={colors.text.secondary}
        multiline
        numberOfLines={3}
        maxLength={maxLength}
        {...props}
      />
      <View style={styles.footerRow}>
        <Text style={styles.errorText}>{error ?? ""}</Text>
        {showCharCount && maxLength ? (
          <Text style={styles.charCount}>
            {value.length}/{maxLength}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export const TextArea = ({
  value,
  onChangeText,
  onBlur,
  error,
  ...rest
}: TextAreaProps) => (
  <TextAreaUI
    value={value ?? ""}
    onChangeText={onChangeText}
    onBlur={onBlur}
    error={error}
    {...rest}
  />
);

export const FormikTextArea = ({
  name,
  validate,
  showFormikError = true,
  required = false,
  error: errorOverride,
  onBlur: onBlurProp,
  ...rest
}: FormikTextAreaProps) => {
  const [field, meta, helpers] = useField({
    name,
    validate: (val: string) => {
      if (!required && !val?.trim()) return undefined;
      if (required && !val?.trim()) return "Required";
      return validate ? validate(val) : undefined;
    },
  });
  const error =
    errorOverride ?? (showFormikError && meta.touched ? meta.error : undefined);

  return (
    <TextAreaUI
      value={field.value ?? ""}
      onChangeText={helpers.setValue}
      onBlur={(e) => {
        helpers.setTouched(true);
        onBlurProp?.(e);
      }}
      error={error}
      {...rest}
    />
  );
};

const useTextAreaStyles = makeStyles(({ colors, radius, typography }) => ({
  wrapper: { marginBottom: 18 },
  label: {
    fontSize: 14,
    fontFamily: typography.fontFamily.Manrope.Medium,
    color: colors.text.primary,
    marginBottom: 8,
  },
  input: {
    padding: 14,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    fontSize: 16,
    fontFamily: typography.fontFamily.Manrope.Medium,
    textAlignVertical: "top",
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    color: colors.text.primary,
  },
  inputFocused: {
    borderColor: colors.primary.main,
  },
  inputError: { borderColor: colors.status.error.main },
  footerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 4,
  },
  errorText: {
    flex: 1,
    color: colors.status.error.main,
    fontSize: 12,
    fontFamily: typography.fontFamily.Manrope.Medium,
  },
  charCount: {
    fontSize: 11,
    fontFamily: typography.fontFamily.Manrope.Medium,
    color: colors.text.secondary,
    marginLeft: 8,
  },
}));

export default TextArea;
