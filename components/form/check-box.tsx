import { makeStyles, useColors } from "@/theme";
import { Checkbox as ExpoCheckbox } from "expo-checkbox";
import { useField } from "formik";
import React from "react";
import { Text, View } from "react-native";

type CheckboxProps = {
  name: string;
  label?: string;
  validate?: (value: boolean) => string | undefined;
  disabled?: boolean;
  color?: string;
};

const Checkbox = ({
  name,
  label,
  validate,
  disabled,
  color: colorProp,
}: CheckboxProps) => {
  const colors = useColors();
  const styles = useStyles();
  const color = colorProp ?? colors.primary.main;

  const [field, meta, helpers] = useField({
    name,
    validate,
  });

  const value = Boolean(field.value);
  const error = meta.touched ? meta.error : undefined;

  return (
    <View style={styles.container}>
      <ExpoCheckbox
        value={value}
        onValueChange={helpers.setValue}
        color={color}
        disabled={disabled}
        onBlur={() => helpers.setTouched(true)}
        style={[
          value && { backgroundColor: "transparent" },
          { borderColor: color },
        ]}
      />
      {label && (
        <Text style={[styles.label, { color: colors.text.primary }]}>
          {label}
        </Text>
      )}
      {error && (
        <Text style={[styles.error, { color: colors.status.error.main }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(({ colors, spacing, textMetrics }) => ({
  container: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    ...textMetrics("md", "snug"),
    color: colors.text.primary,
  },
  error: {
    ...textMetrics("xs", "snug"),
    color: colors.status.error.main,
  },
}));

export default Checkbox;
