import { FormikTextfield } from "@/components/form/text-field";
import Button from "@/components/shared/button";
import { useToast } from "@/components/toasts";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/stores";
import { useTheme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Formik, useFormikContext } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import * as Yup from "yup";
import { useStyles } from "./styles";
import { OnscreenKeypad } from "@/components/shared";

const OTP_DIGITS = 6;
const OTP_RESEND_SECONDS = 10 * 60;

function formatMMSS(totalSeconds: number) {
  const mm = Math.floor(totalSeconds / 60);
  const ss = totalSeconds % 60;
  return `${mm}:${String(ss).padStart(2, "0")}`;
}

// --- Types ---
type ResetPasswordValues = {
  otp: string;
  password: string;
  confirmPassword: string;
};

// --- Initial Values ---
const initialValues: ResetPasswordValues = {
  otp: "",
  password: "",
  confirmPassword: "",
};

// --- Validation Schema ---
const resetPasswordSchema = Yup.object({
  otp: Yup.string()
    .matches(/^\d{6}$/, "Enter the 6-digit code")
    .required("Enter the 6-digit code"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

function OtpDisplay() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { values } = useFormikContext<ResetPasswordValues>();
  const otp = values.otp ?? "";

  return (
    <View style={styles.otpDisplay}>
      {Array.from({ length: OTP_DIGITS }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.otpDot,
            {
              backgroundColor:
                otp.length > index
                  ? colors.primary.main
                  : colors.border.default,
            },
          ]}
        />
      ))}
    </View>
  );
}

export function ResetPasswordForm() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useStyles();
  const { toast } = useToast();
  const resetPasswordEmail = useAuthStore((s) => s.resetPasswordEmail);
  const setResetPasswordEmail = useAuthStore((s) => s.setResetPasswordEmail);
  const [isResending, setIsResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(OTP_RESEND_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- Effects ---
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

  // --- Handlers ---
  async function handleSubmit(values: ResetPasswordValues) {
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
  }

  async function handleResend() {
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
  }

  // --- Keypad Handlers ---
  const handleKeyPress = (
    key: string,
    setFieldValue: (field: string, value: string) => void,
    otp: string,
  ) => {
    setFieldValue("otp", (otp + key).slice(0, OTP_DIGITS));
  };

  const handleBackspace = (
    setFieldValue: (field: string, value: string) => void,
    otp: string,
  ) => {
    setFieldValue("otp", otp.slice(0, -1));
  };

  // --- Render ---
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={resetPasswordSchema}
      validateOnMount={false}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, handleSubmit, isSubmitting }) => {
        const canSubmit =
          /^\d{6}$/.test(values.otp) &&
          values.password.length >= 8 &&
          values.password === values.confirmPassword;

        return (
          <>
            <OtpDisplay />

            <View style={styles.resendBlock}>
              {secondsLeft > 0 ? (
                <Text
                  style={[styles.resendLabel, { color: colors.text.secondary }]}
                >
                  Resend code in{" "}
                  <Text
                    style={[styles.resendTime, { color: colors.primary.main }]}
                  >
                    {formatMMSS(secondsLeft)}
                  </Text>
                </Text>
              ) : (
                <Pressable onPress={handleResend}>
                  <Text
                    style={[styles.resendLink, { color: colors.primary.main }]}
                  >
                    Resend code
                  </Text>
                </Pressable>
              )}
            </View>

            <OnscreenKeypad
              onKeyPress={(key) =>
                handleKeyPress(key, setFieldValue, values.otp)
              }
              onBackspace={() => handleBackspace(setFieldValue, values.otp)}
            />

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

            <View style={styles.bottomShell}>
              <Button
                onPress={() => handleSubmit()}
                disabled={!canSubmit || isSubmitting}
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
            </View>
          </>
        );
      }}
    </Formik>
  );
}
