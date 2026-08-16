import { FormikTextfield } from "@/components/form/text-field";
import Button from "@/components/shared/button";
import Logo from "@/components/shared/logo";
import { ThemedKeyboardAvoidingView } from "@/components/shared/themed-keyboard-avoiding-view";
import { authClient } from "@/lib/auth-client";
import { makeStyles, useTheme } from "@/theme";

import { AuthBgDecor } from "@/components/shared";
import { useToast } from "@/components/toasts";
import { useAuthStore } from "@/stores";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import * as Yup from "yup";

type Values = { email: string };

const initialValues: Values = { email: "" };

const schema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function ForgotPassword() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useStyles();
  const { toast } = useToast();
  const setResetPasswordEmail = useAuthStore((s) => s.setResetPasswordEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: Values) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await authClient.emailOtp.requestPasswordReset({
        email: values.email,
      });

      if (error) {
        toast.error(error.message ?? "Failed to initiate password reset");
        return;
      }

      if (data) {
        const otpResult = await authClient.emailOtp.sendVerificationOtp({
          email: values.email,
          type: "forget-password" as const,
        });

        if (otpResult.error) {
          toast.error(
            otpResult.error.message ?? "Failed to send verification code",
          );
          return;
        }

        setResetPasswordEmail(values.email);
        toast.success("Verification code sent to your email");
        router.push("/(auth)/reset-password");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedKeyboardAvoidingView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.decor} />
          <View style={styles.header}>
            <Logo />
            <Text style={[styles.title, { color: colors.text.primary }]}>
              Forgot password
            </Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              Enter your email and we&apos;ll send you a code to reset your
              password.
            </Text>
          </View>

          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={(values) => {
              onSubmit(values);
            }}
          >
            {({ handleSubmit }) => (
              <>
                <FormikTextfield
                  name="email"
                  label="Email Address"
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  leftIcon={
                    <MaterialIcons
                      name="mail"
                      size={22}
                      color={colors.text.muted}
                    />
                  }
                  containerStyle={styles.inputRow}
                />
                <Button
                  style={styles.submitBtn}
                  onPress={() => handleSubmit()}
                  loading={isSubmitting}
                >
                  <Text
                    style={[
                      styles.submitText,
                      { color: colors.primary.contrastText },
                    ]}
                  >
                    Send verification code
                  </Text>
                </Button>
              </>
            )}
          </Formik>

          <View style={styles.footer}>
            <Button
              style={styles.linkBtn}
              onPress={() => router.replace("/(auth)/login")}
            >
              <MaterialIcons
                name="keyboard-arrow-left"
                size={24}
                color={colors.primary.main}
              />
              <Text style={[styles.footerLink, { color: colors.primary.main }]}>
                Back to sign in
              </Text>
            </Button>
          </View>
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
    marginBottom: spacing[6],
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
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing[2],
  },
  linkBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "transparent",
    height: undefined,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  footerLink: {
    fontSize: typography.fontSize.sm,
    fontWeight: "700",
    fontFamily: typography.fontFamily.Manrope.Bold,
  },
}));
