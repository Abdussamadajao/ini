import { makeStyles, useColors } from "@/theme";
import { useField } from "formik";
import React from "react";
import { Text, View } from "react-native";
import { OtpInput, OtpInputProps, OtpInputRef } from "react-native-otp-entry";
type FormikOtpEntryProps = Omit<
  OtpInputProps,
  "onTextChange" | "textInputProps"
> & {
  name: string;
  label?: string;
  showFormikError?: boolean;
  required?: boolean;
  validate?: (value: string) => string | undefined;
  /** When true, digits are entered via a custom keypad instead of the OS keyboard. */
  suppressSoftwareKeyboard?: boolean;
  textInputProps?: OtpInputProps["textInputProps"];
};

export const FormikOtpEntry = ({
  name,
  label,
  showFormikError = true,
  required = false,
  validate,
  numberOfDigits = 6,
  suppressSoftwareKeyboard = false,
  textInputProps: userTextInputProps,
  ...rest
}: FormikOtpEntryProps) => {
  const styles = useStyles();
  const colors = useColors();
  const otpRef = React.useRef<OtpInputRef>(null);
  const [field, meta, helpers] = useField({
    name,
    validate: (val: string) => {
      if (!required && !val) return undefined;
      return validate ? validate(val) : undefined;
    },
  });

  const v = field.value ?? "";
  React.useEffect(() => {
    otpRef.current?.setValue(v);
  }, [v]);

  const error = showFormikError && meta.touched ? meta.error : undefined;

  const { value: _omitControlledValue, ...restUserTextInputProps } =
    userTextInputProps ?? {};

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <OtpInput
        ref={otpRef}
        numberOfDigits={numberOfDigits}
        onTextChange={helpers.setValue}
        onBlur={() => helpers.setTouched(true)}
        focusColor={colors.primary.main}
        type="numeric"
        textInputProps={{
          ...restUserTextInputProps,
          showSoftInputOnFocus: suppressSoftwareKeyboard
            ? false
            : (userTextInputProps?.showSoftInputOnFocus ?? true),
        }}
        theme={{
          containerStyle: styles.containerStyle,
          pinCodeContainerStyle: styles.pinCodeContainerStyle,
          filledPinCodeContainerStyle: styles.filledPinCodeContainerStyle,
          focusedPinCodeContainerStyle: styles.focusedPinCodeContainerStyle,
          pinCodeTextStyle: styles.pinCodeTextStyle,
          placeholderTextStyle: styles.placeholderTextStyle,
        }}
        {...rest}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const useStyles = makeStyles(({ colors, radius, spacing, typography }) => ({
  wrapper: {
    marginBottom: spacing[2],
  },
  label: {
    marginBottom: spacing[2],
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.Manrope.Medium,
    letterSpacing: 0.8,
  },
  containerStyle: {
    width: "100%",
  },
  pinCodeContainerStyle: {
    width: 44,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.sm,
    backgroundColor: colors.background.surface,
  },
  filledPinCodeContainerStyle: {
    borderColor: colors.border.default,
  },
  focusedPinCodeContainerStyle: {
    borderColor: colors.primary.main,
  },
  pinCodeTextStyle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.Manrope.Bold,
  },
  placeholderTextStyle: {
    color: colors.text.secondary,
  },
  errorText: {
    color: colors.status.error.main,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.Manrope.Medium,
    marginTop: spacing[2],
  },
}));
