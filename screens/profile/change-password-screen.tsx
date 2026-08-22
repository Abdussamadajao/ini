import { FormikTextfield } from "@/components/form";
import { Button } from "@/components/shared";
import { useToast } from "@/components/toasts";
import { authClient } from "@/lib/auth-client";
import { makeStyles, typography, useTheme, textMetrics } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Formik, useFormikContext } from "formik";
import React, { useCallback, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

type ChangePasswordValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const symbolRegex = /[^a-zA-Z0-9]/;

const schema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(8, "At least 8 characters")
    .matches(/\d/, "Include a number")
    .matches(symbolRegex, "Include a symbol")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("newPassword")], "New passwords must match"),
});

const initialValues: ChangePasswordValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function passwordStrength(password: string) {
  if (!password) return { score: 0, label: "" as string };
  let score = 0;
  if (password.length >= 8) score += 30;
  if (password.length >= 12) score += 15;
  if (/\d/.test(password)) score += 20;
  if (symbolRegex.test(password)) score += 20;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 15;
  score = Math.min(100, score);
  const label =
    score === 0 ? "" : score < 40 ? "Weak" : score < 70 ? "Fair" : "Strong";
  return { score, label };
}

function strengthAccentColor(colors: any, score: number) {
  if (score < 40) return colors.status.error.main;
  if (score < 70) return colors.status.warning.main;
  return colors.status.success.main;
}

function NewPasswordStrength() {
  const { values } = useFormikContext<ChangePasswordValues>();
  const { colors } = useTheme();
  const styles = useStyles();
  const { score, label } = useMemo(
    () => passwordStrength(values.newPassword),
    [values.newPassword],
  );
  const accent = strengthAccentColor(colors, score);

  if (!values.newPassword.trim()) return null;

  return (
    <View style={styles.strengthBlock}>
      <View style={styles.strengthRow}>
        <Text style={[styles.strengthText, { color: accent }]}>{label}</Text>
        <Text style={[styles.strengthText, { color: accent }]}>{score}%</Text>
      </View>
      <View
        style={[
          styles.strengthTrack,
          { backgroundColor: colors.background.surfaceAlt },
        ]}
      >
        <View
          style={[
            styles.strengthFill,
            {
              width: `${score}%`,
              backgroundColor: accent,
            },
          ]}
        />
      </View>
    </View>
  );
}

function FormCard({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  const styles = useStyles();
  return (
    <View style={[styles.card, { backgroundColor: colors.background.surface }]}>
      {children}
    </View>
  );
}

export function ChangePasswordScreen() {
  const { colors } = useTheme();
  const { toast } = useToast();
  const styles = useStyles();
  const [isPasswordChangeLoading, setIsPasswordChangeLoading] = useState(false);

  const fieldLabelStyle = useMemo(
    () => ({
      color: colors.text.secondary,
      fontFamily: typography.fontFamily.Inter.SemiBold,
      fontSize: typography.fontSize.xs,
      letterSpacing: 0.6,
      marginBottom: 8,
      marginLeft: 0,
      textTransform: "uppercase" as const,
    }),
    [colors.text.secondary],
  );

  const fieldContainerStyle = useMemo(
    () => ({
      backgroundColor: colors.background.surface,
      borderColor: colors.border.default + "40",
      borderRadius: 8,
      borderWidth: 1,
    }),
    [colors.background.surface, colors.border.default],
  );

  const fieldInputStyle = useMemo(
    () => ({
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Inter.Medium,
      fontSize: typography.fontSize.md,
    }),
    [colors.text.primary],
  );

  const onSubmit = useCallback(async (data: ChangePasswordValues) => {
    setIsPasswordChangeLoading(true);
    const payload = {
      newPassword: data.newPassword,
      currentPassword: data.currentPassword,
      revokeOtherSessions: true,
    };

    await authClient.changePassword(payload, {
      onSuccess: () => {
        toast.success("Password updated.");
        setIsPasswordChangeLoading(false);
      },
      onError: (context) => {
        const message =
          context.error.message ??
          "Failed to update password. Please try again.";
        toast.error(message);
        setIsPasswordChangeLoading(false);
      },
    });
  }, []);

  return (
    <Formik<ChangePasswordValues>
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={onSubmit}
    >
      {({ handleSubmit }) => (
        <SafeAreaView edges={["top"]} style={styles.safe}>
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              style={styles.headerSide}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <MaterialIcons
                name="arrow-back"
                size={24}
                color={colors.text.primary}
              />
            </Pressable>
            <View style={styles.headerCenter}>
              <Text
                style={[styles.headerTitle, { color: colors.text.primary }]}
              >
                Change Password
              </Text>
            </View>
            <View style={styles.headerSide} />
          </View>

          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={0}
          >
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                Update your password to keep your account secure
              </Text>

              <FormCard>
                <FormikTextfield
                  name="currentPassword"
                  label="Current password"
                  secureTextEntry
                  labelStyle={fieldLabelStyle}
                  containerStyle={fieldContainerStyle}
                  style={fieldInputStyle}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  placeholder="Enter your current password"
                />
                <FormikTextfield
                  name="newPassword"
                  label="New password"
                  secureTextEntry
                  labelStyle={fieldLabelStyle}
                  containerStyle={fieldContainerStyle}
                  style={fieldInputStyle}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="newPassword"
                  placeholder="Enter your new password"
                  helperText="Must be at least 8 characters, include a number and a symbol."
                  helperTextStyle={{
                    color: colors.text.secondary,
                    fontFamily: typography.fontFamily.Inter.Regular,
                    fontSize: typography.fontSize.xs,
                  }}
                />
                <NewPasswordStrength />
                <FormikTextfield
                  name="confirmPassword"
                  label="Confirm new password"
                  secureTextEntry
                  labelStyle={fieldLabelStyle}
                  containerStyle={fieldContainerStyle}
                  style={fieldInputStyle}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="newPassword"
                  placeholder="Confirm your new password"
                />
                <Pressable
                  onPress={() => router.push("/(auth)/forgot-password")}
                  style={styles.forgotRow}
                  hitSlop={8}
                >
                  <Text
                    style={[
                      styles.forgotLink,
                      { color: colors.status.success.main },
                    ]}
                  >
                    Forgot password?
                  </Text>
                </Pressable>
              </FormCard>
            </ScrollView>

            <View
              style={[
                styles.footer,
                { backgroundColor: colors.background.screen },
              ]}
            >
              <Button
                title="Update Password"
                style={styles.saveBtn}
                loading={isPasswordChangeLoading}
                onPress={() => handleSubmit()}
                textStyle={[
                  styles.saveBtnText,
                  { color: colors.primary.contrastText },
                ]}
              />
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      )}
    </Formik>
  );
}

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
    safe: { flex: 1, backgroundColor: colors.background.screen },
    flex: { flex: 1 },
    header: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      minHeight: 48,
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[2],
    },
    headerSide: {
      alignItems: "center",
      justifyContent: "center",
      minWidth: 44,
      paddingVertical: spacing[2],
    },
    headerCenter: {
      flex: 1,
      alignItems: "center",
    },
    headerTitle: {
      ...textMetrics("lg", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
    },
    subtitle: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Inter.Regular,
      marginBottom: spacing[6],
    },
    scroll: { flexGrow: 1 },
    scrollContent: {
      paddingBottom: spacing[12],
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
    },
    card: {
      borderRadius: radius.lg,
      marginBottom: spacing[5],
      padding: spacing[4],
    },
    forgotRow: {
      alignSelf: "flex-start",
      marginTop: spacing[2],
    },
    forgotLink: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Inter.SemiBold,
    },
    footer: {
      paddingBottom: spacing[8],
      paddingHorizontal: spacing[4],
      paddingTop: spacing[4],
    },
    saveBtn: {
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
      justifyContent: "center",
    },
    saveBtnText: {
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Inter.SemiBold,
    },
    strengthBlock: {
      marginBottom: spacing[3],
      marginTop: -spacing[1],
    },
    strengthRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: spacing[2],
    },
    strengthText: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Inter.SemiBold,
    },
    strengthTrack: {
      borderRadius: radius.full,
      height: 4,
      overflow: "hidden",
      width: "100%",
    },
    strengthFill: {
      borderRadius: radius.full,
      height: "100%",
    },
  }),
);
