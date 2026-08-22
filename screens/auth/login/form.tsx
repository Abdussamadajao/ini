import { FormikTextfield } from "@/components/form/text-field";
import { Button } from "@/components/shared";
import { useToast } from "@/components/toasts";

import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/stores";
import { useTheme } from "@/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Formik, FormikHelpers } from "formik";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";
import { useStyles } from "./styles";
import { Session } from "better-auth";

// --- Types ---
type LoginValues = {
  email: string;
  password: string;
};

// --- Initial Values ---
const initialValues: LoginValues = {
  email: "",
  password: "",
};

// --- Validation Schema ---
const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const { colors } = useTheme();
  const styles = useStyles();
  const { setUser, hydrate } = useAuthStore();
  const { setUnverifiedEmail: setUnverifiedEmailStore } = useAuthStore();

  async function handleResendVerification() {
    if (!unverifiedEmail) return;
    setIsResending(true);

    await authClient.emailOtp.sendVerificationOtp(
      {
        email: unverifiedEmail,
        type: "email-verification" as const,
      },
      {
        onSuccess: () => {
          router.replace("/(auth)/verify-email");
          toast.success("Verification email sent successfully");
          setIsResending(false);
        },
        onError: (error) => {
          toast.error("Failed to send verification email");
          setIsResending(false);
        },
      },
    );
  }

  async function onSubmit({ email, password }: LoginValues) {
    setIsLoading(true);
    setUnverifiedEmail(null);
    setUnverifiedEmailStore(null);

    await authClient.signIn.email(
      { email, password },
      {
        onSuccess: (context) => {
          const { user, token } = context.data;

          setUser({
            user: context.data.user,
            session: { token, userId: user.id } as Session,
          });
          hydrate();

          setIsLoading(false);
        },
        onError: (context) => {
          if (context.error.status === 403) {
            setUnverifiedEmail(email);
            setUnverifiedEmailStore(email);
            toast.error(
              "Please verify your email address to be able to login.",
            );
            setIsLoading(false);
            return;
          }
          toast.error(context.error.message);
          setIsLoading(false);
        },
      },
    );
    setIsLoading(false);
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={loginSchema}
      validateOnMount={false}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={(values) => {
        onSubmit(values);
      }}
    >
      {({ handleSubmit, isValid, dirty }) => (
        <>
          <FormikTextfield
            name="email"
            label="Email Address"
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            leftIcon={
              <MaterialIcons name="mail" size={22} color={colors.text.muted} />
            }
          />
          <FormikTextfield
            name="password"
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            autoComplete="password"
            leftIcon={
              <MaterialIcons name="lock" size={22} color={colors.text.muted} />
            }
          />

          <TouchableOpacity
            style={[styles.forgotWrap, styles.linkBtn]}
            onPress={() => router.push("/(auth)/forgot-password")}
          >
            <Text style={[styles.forgot, { color: colors.primary.main }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {unverifiedEmail && (
            <View style={styles.unverifiedEmailContainer}>
              <Text
                style={[
                  styles.unverifiedEmailText,
                  { color: colors.status.warning.main },
                ]}
              >
                Please verify your email address to be able to login.
              </Text>
              <Button
                title="Resend verification email"
                variant="secondary"
                appearance="outline"
                style={[
                  styles.unverifiedEmailButton,
                  { borderColor: colors.primary.main },
                ]}
                onPress={handleResendVerification}
                loading={isResending}
                textStyle={[
                  styles.unverifiedEmailButtonText,
                  { color: colors.primary.main },
                ]}
              />
            </View>
          )}

          <Button
            title="Sign In"
            onPress={() => handleSubmit()}
            loading={isLoading}
            disabled={!isValid || !dirty || isLoading}
            textStyle={[
              styles.signInText,
              { color: colors.primary.contrastText },
            ]}
          />

          {/*<View style={styles.divider}>
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: colors.border.default },
              ]}
            />
            <Text style={[styles.dividerText, { color: colors.text.muted }]}>
              Or
            </Text>
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: colors.border.default },
              ]}
            />
          </View>*/}

          {/*<Button
            style={[
              styles.googleBtn,
              {
                borderColor: colors.border.default,
                backgroundColor: colors.background.surface,
              },
            ]}
            onPress={() => {}}
            disabled={isSubmitting || isLoading}
          >
            <Image source={images.google} style={styles.googleIconWrap} />
            <Text style={[styles.googleText, { color: colors.text.primary }]}>
              Continue with Google
            </Text>
          </Button>*/}

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.text.secondary }]}>
              Don&apos;t have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/register")}
              disabled={isLoading}
              style={styles.linkBtn}
            >
              <Text style={[styles.footerLink, { color: colors.primary.main }]}>
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </Formik>
  );
}
