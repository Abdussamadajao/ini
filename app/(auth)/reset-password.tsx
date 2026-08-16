import { FormikTextfield } from "@/components/form/text-field";
import {
  AuthBgDecor,
  Button,
  Logo,
  ThemedKeyboardAvoidingView,
} from "@/components/shared";
import { useToast } from "@/components/toasts";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/stores";
import { makeStyles, typography, useTheme } from "@/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { OtpInput, type OtpInputRef } from "react-native-otp-entry";
import * as Yup from "yup";

const OTP_DIGITS = 6;
const OTP_RESEND_SECONDS = 10 * 60;

function formatMMSS(totalSeconds: number) {
  const mm = Math.floor(totalSeconds / 60);
  const ss = totalSeconds % 60;
  return `${mm}:${String(ss).padStart(2, "0")}`;
}

type Values = { otp: string; password: string; confirmPassword: string };

const initialValues: Values = { otp: "", password: "", confirmPassword: "" };

const schema = Yup.object({
  otp: Yup.string()
    .matches(/^\d{6}$/, "Enter the 6-digit code")
    .required("Enter the 6-digit code"),
  password: Yup.string()
    .min(8, "At least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

export default function ResetPassword() {
  const router = useRouter();
  const { colors } = useTheme();
  const { toast } = useToast();
  const styles = useStyles();
  const resetPasswordEmail = useAuthStore((s) => s.resetPasswordEmail);
  const setResetPasswordEmail = useAuthStore((s) => s.setResetPasswordEmail);
  const [isResending, setIsResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(OTP_RESEND_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const otpRef = useRef<OtpInputRef | null>(null);

  useEffect(() => {
    if (!resetPasswordEmail) {
      router.replace("/(auth)/forgot-password");
    }
  }, [resetPasswordEmail, router]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [secondsLeft]);

  const onSubmit = async (values: Values) => {
    if (!resetPasswordEmail) return;
    try {
      await authClient.emailOtp.resetPassword(
        {
          email: resetPasswordEmail,
          otp: values.otp,
          password: values.password,
        },
        {
          onSuccess: () => {
            setResetPasswordEmail(null);
            toast.success("Password reset successfully");
            router.replace("/(auth)/login");
          },
          onError: (context) => {
            toast.error(context.error.message ?? "Failed to reset password");
          },
        },
      );
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const onResend = async () => {
    if (!resetPasswordEmail || isResending || secondsLeft > 0) return;
    setIsResending(true);
    try {
      await authClient.emailOtp.sendVerificationOtp(
        {
          email: resetPasswordEmail,
          type: "forget-password" as const,
        },
        {
          onSuccess: () => {
            setSecondsLeft(OTP_RESEND_SECONDS);
            toast.success("Verification code resent");
            otpRef.current?.clear();
            setTimeout(() => otpRef.current?.focus(), 0);
          },
          onError: (context) => {
            toast.error(
              context.error.message ?? "Failed to resend verification code",
            );
          },
        },
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to resend verification code");
    } finally {
      setIsResending(false);
    }
  };

  if (!resetPasswordEmail) {
    return null;
  }

  return (
    <ThemedKeyboardAvoidingView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <Button style={styles.backBtn} onPress={() => router.back()}>
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={colors.text.primary}
            />
          </Button>
        </View>

        <View style={styles.card}>
          <View style={styles.decor} />
          <View style={styles.header}>
            <Logo />
            <Text style={[styles.title, { color: colors.text.primary }]}>
              Set new password
            </Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              Enter the code sent to{" "}
              <Text style={{ fontWeight: "600" }}>{resetPasswordEmail}</Text>
              {"\n"}and choose a new password.
            </Text>
          </View>

          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={(values) => onSubmit(values)}
          >
            {({ values, setFieldValue, handleSubmit, isSubmitting }) => {
              const canSubmit =
                /^\d{6}$/.test(values.otp) &&
                values.password.length >= 8 &&
                values.password === values.confirmPassword;

              return (
                <>
                  <View style={styles.otpRow}>
                    <OtpInput
                      ref={(r) => {
                        otpRef.current = r;
                      }}
                      numberOfDigits={OTP_DIGITS}
                      type="numeric"
                      autoFocus
                      hideStick
                      focusColor={colors.primary.main}
                      onTextChange={(text) => setFieldValue("otp", text)}
                      onFilled={(text) => setFieldValue("otp", text)}
                      blurOnFilled={false}
                      theme={{
                        containerStyle: { width: "auto" },
                        pinCodeContainerStyle: {
                          width: 44,
                          height: 52,
                          borderRadius: 12,
                          backgroundColor: colors.background.surface,
                          borderWidth: 1,
                          borderColor: colors.border.default,
                          marginHorizontal: 3,
                          justifyContent: "center",
                          alignItems: "center",
                        },
                        pinCodeTextStyle: {
                          fontSize: typography.fontSize.lg,
                          fontWeight: "700",
                          color: colors.text.primary,
                          fontFamily: typography.fontFamily.Manrope.Bold,
                        },
                        placeholderTextStyle: {
                          fontSize: typography.fontSize.lg,
                          fontWeight: "700",
                          color: colors.text.secondary,
                          fontFamily: typography.fontFamily.Manrope.Bold,
                        },
                        focusedPinCodeContainerStyle: {
                          width: 44,
                          height: 52,
                          borderRadius: 12,
                          backgroundColor: colors.background.surface,
                          borderWidth: 1,
                          borderColor: colors.primary.main,
                          marginHorizontal: 3,
                          justifyContent: "center",
                          alignItems: "center",
                        },
                        filledPinCodeContainerStyle: {
                          width: 44,
                          height: 52,
                          borderRadius: 12,
                          backgroundColor: colors.background.surface,
                          borderWidth: 1,
                          borderColor: colors.primary.main,
                          marginHorizontal: 3,
                          justifyContent: "center",
                          alignItems: "center",
                        },
                        disabledPinCodeContainerStyle: {
                          width: 44,
                          height: 52,
                          borderRadius: 12,
                          backgroundColor: colors.background.surface,
                          borderWidth: 1,
                          borderColor: colors.border.default,
                          marginHorizontal: 3,
                          justifyContent: "center",
                          alignItems: "center",
                          opacity: 0.6,
                        },
                      }}
                    />
                  </View>

                  <Button
                    style={styles.resendBtn}
                    onPress={onResend}
                    disabled={secondsLeft > 0 || isResending}
                    loading={isResending}
                  >
                    <Text
                      style={[
                        styles.resendText,
                        { color: colors.primary.main },
                      ]}
                    >
                      {secondsLeft > 0
                        ? `Resend in ${formatMMSS(secondsLeft)}`
                        : "Resend code"}
                    </Text>
                  </Button>

                  <FormikTextfield
                    name="password"
                    label="New password"
                    placeholder="••••••••"
                    secureTextEntry
                    autoComplete="password-new"
                    leftIcon={
                      <MaterialIcons
                        name="lock"
                        size={22}
                        color={colors.text.muted}
                      />
                    }
                    containerStyle={styles.inputRow}
                  />
                  <FormikTextfield
                    name="confirmPassword"
                    label="Confirm password"
                    placeholder="••••••••"
                    secureTextEntry
                    autoComplete="password-new"
                    leftIcon={
                      <MaterialIcons
                        name="lock-outline"
                        size={22}
                        color={colors.text.muted}
                      />
                    }
                    containerStyle={styles.inputRow}
                  />
                  <Button
                    style={styles.submitBtn}
                    onPress={() => handleSubmit()}
                    disabled={!canSubmit}
                    loading={isSubmitting}
                  >
                    <Text
                      style={[
                        styles.submitText,
                        { color: colors.primary.contrastText },
                      ]}
                    >
                      Update password
                    </Text>
                  </Button>
                </>
              );
            }}
          </Formik>
        </View>
        <AuthBgDecor />
      </ScrollView>
    </ThemedKeyboardAvoidingView>
  );
}

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(({ colors, spacing, radius, typography }) => ({
  safe: { flex: 1 },
  scroll: {
    flexGrow: 1,
    padding: spacing[6],
    paddingBottom: spacing[12],
    justifyContent: "center",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing[4],
  },
  backBtn: {
    backgroundColor: "transparent",
    height: undefined,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[2],
    marginLeft: -8,
  },
  card: {
    backgroundColor: colors.background.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border.default,
    padding: spacing[6],
    overflow: "hidden",
  },
  decor: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: `${colors.primary.main}20`,
  },
  header: {
    marginBottom: spacing[5],
    alignItems: "center",
  },
  title: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: "700",
    marginBottom: spacing[2],
    fontFamily: typography.fontFamily.Manrope.Bold,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    textAlign: "center",
    fontFamily: typography.fontFamily.Manrope.Regular,
    lineHeight: 20,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing[2.5],
    marginBottom: spacing[3],
  },
  resendBtn: {
    backgroundColor: "transparent",
    height: undefined,
    paddingVertical: 0,
    paddingHorizontal: 0,
    alignSelf: "center",
    marginBottom: spacing[4],
  },
  resendText: {
    fontSize: typography.fontSize.sm,
    fontWeight: "700",
    fontFamily: typography.fontFamily.Manrope.Bold,
  },
  inputRow: {
    marginBottom: spacing[4],
  },
  submitBtn: {
    height: 54,
    marginBottom: spacing[4],
    borderRadius: radius.full,
  },
  submitText: {
    fontSize: typography.fontSize.md,
    fontWeight: "700",
    fontFamily: typography.fontFamily.Manrope.Bold,
  },
}));
