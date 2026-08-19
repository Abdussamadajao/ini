import Button from "@/components/shared/button";
import { useToast } from "@/components/toasts";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/stores";
import { useTheme } from "@/theme";
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
type VerifyEmailValues = {
  code: string;
};

// --- Initial Values ---
const initialValues: VerifyEmailValues = {
  code: "",
};

// --- Validation Schema ---
const verifyEmailSchema = Yup.object({
  code: Yup.string()
    .matches(/^\d{6}$/, "Enter the 6-digit code")
    .required("Enter the 6-digit code"),
});

function OtpDisplay() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { values } = useFormikContext<VerifyEmailValues>();
  const code = values.code ?? "";

  return (
    <View style={styles.otpDisplay}>
      {Array.from({ length: OTP_DIGITS }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.otpDot,
            {
              backgroundColor:
                code.length > index
                  ? colors.primary.main
                  : colors.border.default,
            },
          ]}
        />
      ))}
    </View>
  );
}

export function VerifyEmailForm() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useStyles();
  const { toast } = useToast();
  const { unverifiedEmail, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
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
  async function handleSubmit(values: VerifyEmailValues) {
    if (!unverifiedEmail) return;
    setIsLoading(true);
    try {
      await authClient.emailOtp.verifyEmail(
        {
          email: unverifiedEmail,
          otp: values.code,
        },
        {
          onSuccess: (context) => {
            setUser({
              user: context.data.user,
              session: context.data.session,
            });
            toast.success("Email verified successfully");
            setIsLoading(false);
            router.replace("/(auth)/login");
          },
          onError: (context) => {
            console.log(context.error);
            toast.error(context.error.message ?? "Failed to verify email");
            setIsLoading(false);
          },
        },
      );
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  }

  async function handleResend() {
    if (!unverifiedEmail || isResending || secondsLeft > 0) return;
    setIsResending(true);
    try {
      await authClient.emailOtp.sendVerificationOtp(
        {
          email: unverifiedEmail,
          type: "email-verification" as const,
        },
        {
          onSuccess: () => {
            setSecondsLeft(OTP_RESEND_SECONDS);
            toast.success("Resent verification code");
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
    code: string,
  ) => {
    setFieldValue("code", (code + key).slice(0, OTP_DIGITS));
  };

  const handleBackspace = (
    setFieldValue: (field: string, value: string) => void,
    code: string,
  ) => {
    setFieldValue("code", code.slice(0, -1));
  };

  // --- Render ---
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={verifyEmailSchema}
      validateOnMount={false}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, handleSubmit, isSubmitting }) => {
        const canVerify = /^\d{6}$/.test(values.code);

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
                handleKeyPress(key, setFieldValue, values.code)
              }
              onBackspace={() => handleBackspace(setFieldValue, values.code)}
            />

            <View style={styles.bottomShell}>
              <Button
                onPress={() => handleSubmit()}
                disabled={!canVerify || isSubmitting || isLoading}
                loading={isSubmitting || isLoading}
              >
                <Text
                  style={[
                    styles.submitText,
                    { color: colors.primary.contrastText },
                  ]}
                >
                  Verify
                </Text>
              </Button>
            </View>
          </>
        );
      }}
    </Formik>
  );
}
