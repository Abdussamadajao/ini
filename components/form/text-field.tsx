import { makeStyles, useColors, useIsDark } from "@/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useField } from "formik";
import React, { useState } from "react";
import {
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type BaseProps = TextInputProps & {
  label: string;
  leftIcon?: React.ReactNode;
  leftIconRight?: boolean;
  secureTextEntry?: boolean;
  error?: string;
  border?: boolean;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  helperText?: string;
  helperTextStyle?: StyleProp<TextStyle>;
  placeholder?: string;
};

type TextfieldProps = BaseProps & {
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: NonNullable<TextInputProps["onBlur"]>;
};

type FormikTextfieldProps = BaseProps & {
  name: string;
  validate?: (value: string) => string | undefined;
  showFormikError?: boolean;
  required?: boolean;
};

const TextfieldUI = ({
  label,
  leftIcon,
  leftIconRight = false,
  secureTextEntry,
  error,
  border: borderVariant,
  style,
  value = "",
  onChangeText,
  onBlur,
  onFocus,
  containerStyle,
  labelStyle,
  helperText,
  helperTextStyle,
  placeholder = "",
  ...props
}: BaseProps & {
  value: string;
  onChangeText?: (t: string) => void;
  onBlur?: NonNullable<TextInputProps["onBlur"]>;
}) => {
  const colors = useColors();
  const styles = useTextfieldStyles();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isDark = useIsDark();
  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          isFocused && {
            borderColor: colors.primary.main,
            borderWidth: 2,
          },
          borderVariant && { borderColor: colors.primary.main, borderWidth: 1 },
          error && styles.inputRowError,
          containerStyle,
          {
            backgroundColor: isDark
              ? colors.background.surface
              : colors.background.surfaceAlt,
          },
        ]}
      >
        {leftIcon && !leftIconRight ? (
          <View style={styles.leftIconWrap}>{leftIcon}</View>
        ) : null}
        <TextInput
          style={[styles.input, style]}
          value={value}
          onChangeText={onChangeText}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          placeholderTextColor={colors.text.secondary}
          placeholder={secureTextEntry ? "•••••••••••" : placeholder}
          {...props}
        />
        {leftIcon && leftIconRight ? (
          <View style={styles.rightIconWrap}>{leftIcon}</View>
        ) : null}
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? (
              <MaterialCommunityIcons
                name="eye"
                size={24}
                color={colors.text.secondary}
              />
            ) : (
              <MaterialCommunityIcons
                name="eye-off"
                size={24}
                color={colors.text.secondary}
              />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText ? (
        <Text style={[styles.helperText, helperTextStyle]}>{helperText}</Text>
      ) : null}
    </View>
  );
};

export const Textfield = ({
  value,
  onChangeText,
  onBlur,
  error,
  ...rest
}: TextfieldProps) => (
  <TextfieldUI
    value={value ?? ""}
    onChangeText={onChangeText}
    onBlur={onBlur}
    error={error}
    {...rest}
  />
);

export const FormikTextfield = ({
  name,
  validate,
  showFormikError = true,
  required = false,
  error: errorOverride,
  ...rest
}: FormikTextfieldProps) => {
  const [field, meta, helpers] = useField({
    name,
    validate: (val: string) => {
      if (!required && !val) return undefined;
      return validate ? validate(val) : undefined;
    },
  });
  const error =
    errorOverride ?? (showFormikError && meta.touched ? meta.error : undefined);
  return (
    <TextfieldUI
      value={field.value ?? ""}
      onChangeText={helpers.setValue}
      onBlur={(e) => {
        helpers.setTouched(true);
        rest.onBlur?.(e);
      }}
      error={error}
      {...rest}
    />
  );
};

const useTextfieldStyles = makeStyles(
  ({ colors, radius, typography, spacing }) => ({
    wrapper: { marginBottom: 12, gap: 6 },
    label: {
      fontSize: 15,
      fontWeight: "600",
      marginBottom: 6,
      marginLeft: 4,
      fontFamily: typography.fontFamily.Manrope.Medium,
      color: colors.text.primary,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      height: 56,
      width: "100%",
      borderRadius: radius.sm,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: colors.border.subtle,
      fontFamily: typography.fontFamily.Manrope.Regular,
    },
    inputRowError: { borderColor: colors.status.error.main },
    leftIconWrap: { marginLeft: 1 },
    rightIconWrap: { marginRight: 1 },
    input: {
      flex: 1,
      lineHeight: 20,
      color: colors.text.primary,
      fontSize: typography.fontSize.md,
      fontFamily: typography.fontFamily.Manrope.Medium,
    },
    errorText: {
      color: colors.status.error.main,
      fontSize: 12,
      marginTop: 2,
      marginLeft: spacing[1],
      fontFamily: typography.fontFamily.Manrope.Medium,
    },
    helperText: {
      color: colors.text.secondary,
      fontSize: 12,
      lineHeight: 16,
      marginTop: 1,
      marginLeft: 4,
      fontFamily: typography.fontFamily.Manrope.Medium,
    },
  }),
);

export default Textfield;
