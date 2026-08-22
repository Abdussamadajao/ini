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

type Step = "otp" | "password";

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
      {Array.from({ length: OTP_DIGITS }).map((_, index) => {
        const digit = otp[index];
        const isFilled = digit !== undefined;
        return (
          <View
            key={index}
            style={[
              styles.otpBox,
              {
                borderColor: isFilled
                  ? colors.primary.main
                  : colors.border.default,
              },
            ]}
          >
            <Text style={[styles.otpBoxText, { color: colors.text.primary }]}>
              {digit ?? ""}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// --- Step 1: OTP entry ---
function OtpStep({
  onContinue,
  onResend,
  isResending,
  secondsLeft,
}: {
  onContinue: () => void;
  onResend: () => void;
  isResending: boolean;
  secondsLeft: number;
}) {
  const styles = useStyles();
  const { colors } = useTheme();
  const { values, setFieldValue } = useFormikContext<ResetPasswordValues>();
  const otp = values.otp ?? "";

  const handleKeyPress = (key: string) => {
    setFieldValue("otp", (otp + key).slice(0, OTP_DIGITS));
  };

  const handleBackspace = () => {
    setFieldValue("otp", otp.slice(0, -1));
  };

  const canContinue = /^\d{6}$/.test(otp);

  return (
    <>
      <OtpDisplay />

      <View style={styles.resendBlock}>
        {secondsLeft > 0 ? (
          <Text style={[styles.resendLabel, { color: colors.text.secondary }]}>
            Resend code in{" "}
            <Text style={[styles.resendTime, { color: colors.primary.main }]}>
              {formatMMSS(secondsLeft)}
            </Text>
          </Text>
        ) : (
          <Pressable onPress={onResend} disabled={isResending}>
            <Text style={[styles.resendLink, { color: colors.primary.main }]}>
              Resend code
            </Text>
          </Pressable>
        )}
      </View>

      <OnscreenKeypad
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
      />

      <View style={styles.bottomShell}>
        <Button title="Continue" onPress={onContinue} disabled={!canContinue} />
      </View>
    </>
  );
}

// --- Step 2: New password ---
function PasswordStep({
  onBack,
  isSubmitting,
}: {
  onBack: () => void;
  isSubmitting: boolean;
}) {
  const styles = useStyles();
  const { colors } = useTheme();
  const { values, handleSubmit } = useFormikContext<ResetPasswordValues>();

  const canSubmit =
    values.password.length >= 8 && values.password === values.confirmPassword;

  return (
    <>
      <FormikTextfield
        name="password"
        label="New password"
        placeholder="••••••••"
        secureTextEntry
        autoComplete="password-new"
        leftIcon={
          <MaterialIcons name="lock" size={22} color={colors.text.muted} />
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
          title="Update password"
          onPress={() => handleSubmit()}
          disabled={!canSubmit || isSubmitting}
          loading={isSubmitting}
        />
        <Pressable onPress={onBack} style={styles.backLink} hitSlop={12}>
          <Text style={[styles.resendLink, { color: colors.text.secondary }]}>
            Back
          </Text>
        </Pressable>
      </View>
    </>
  );
}

export function ResetPasswordForm() {
  const router = useRouter();
  const { toast } = useToast();
  const resetPasswordEmail = useAuthStore((s) => s.resetPasswordEmail);
  const setResetPasswordEmail = useAuthStore((s) => s.setResetPasswordEmail);
  const [isResending, setIsResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(OTP_RESEND_SECONDS);
  const [step, setStep] = useState<Step>("otp");
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
      toast.error("Failed to resend verification code");
    } finally {
      setIsResending(false);
    }
  }

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
      {({ isSubmitting }) => (
        <>
          {step === "otp" ? (
            <OtpStep
              onContinue={() => setStep("password")}
              onResend={handleResend}
              isResending={isResending}
              secondsLeft={secondsLeft}
            />
          ) : (
            <PasswordStep
              onBack={() => setStep("otp")}
              isSubmitting={isSubmitting}
            />
          )}
        </>
      )}
    </Formik>
  );
}
