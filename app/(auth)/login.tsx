import { FormikTextfield } from "@/components/form/text-field";
import {
  AuthBgDecor,
  Button,
  Logo,
  ThemedKeyboardAvoidingView,
} from "@/components/shared";
import { useToast } from "@/components/toasts";
import { images } from "@/constants";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/stores";
import { makeStyles, useTheme } from "@/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import * as Yup from "yup";

type LoginValues = { email: string; password: string };

const initialValues: LoginValues = { email: "", password: "" };

const loginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function Login() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const { colors } = useTheme();
  const styles = useStyles();
  const { setUser } = useAuthStore();
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
          setUser({
            user: context.data.user,
            session: context.data.session,
          });

          setIsLoading(false);
          router.replace("/(tabs)");
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
  }

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
              Welcome back
            </Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              Sign in to track your finances & taxes
            </Text>
          </View>

          <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
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
                />
                <FormikTextfield
                  name="password"
                  label="Password"
                  placeholder="••••••••"
                  secureTextEntry
                  autoComplete="password"
                  leftIcon={
                    <MaterialIcons
                      name="lock"
                      size={22}
                      color={colors.text.muted}
                    />
                  }
                />

                <Button
                  style={[styles.forgotWrap, styles.linkBtn]}
                  onPress={() => router.push("/(auth)/forgot-password")}
                >
                  <Text style={[styles.forgot, { color: colors.primary.main }]}>
                    Forgot Password?
                  </Text>
                </Button>

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
                      style={[
                        styles.unverifiedEmailButton,
                        { borderColor: colors.primary.main },
                      ]}
                      onPress={handleResendVerification}
                      loading={isResending}
                      variant="secondary"
                    >
                      <Text
                        style={[
                          styles.unverifiedEmailButtonText,
                          { color: colors.primary.main },
                        ]}
                      >
                        Resend verification email
                      </Text>
                    </Button>
                  </View>
                )}

                <Button
                  style={styles.signInBtn}
                  onPress={() => handleSubmit()}
                  loading={isLoading}
                >
                  <Text
                    style={[
                      styles.signInText,
                      { color: colors.primary.contrastText },
                    ]}
                  >
                    Sign In
                  </Text>
                </Button>

                <View style={styles.divider}>
                  <View
                    style={[
                      styles.dividerLine,
                      { backgroundColor: colors.border.default },
                    ]}
                  />
                  <Text
                    style={[styles.dividerText, { color: colors.text.muted }]}
                  >
                    Or
                  </Text>
                  <View
                    style={[
                      styles.dividerLine,
                      { backgroundColor: colors.border.default },
                    ]}
                  />
                </View>

                <Button
                  style={[
                    styles.googleBtn,
                    {
                      borderColor: colors.border.default,
                      backgroundColor: colors.background.surface,
                    },
                  ]}
                  onPress={() => {}}
                >
                  <Image source={images.google} style={styles.googleIconWrap} />
                  <Text
                    style={[styles.googleText, { color: colors.text.primary }]}
                  >
                    Continue with Google
                  </Text>
                </Button>
              </>
            )}
          </Formik>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.text.secondary }]}>
              Don&apost have an account?{" "}
            </Text>
            <Button
              style={styles.linkBtn}
              onPress={() => router.push("/(auth)/register")}
            >
              <Text style={[styles.footerLink, { color: colors.primary.main }]}>
                Create account
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
    fontFamily: typography.fontFamily.Manrope.Regular,
  },
  inputRow: {
    marginBottom: spacing[4],
  },
  forgotWrap: {
    alignSelf: "flex-end",
    marginBottom: spacing[5],
  },
  linkBtn: {
    backgroundColor: "transparent",
    height: undefined,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  forgot: {
    fontSize: typography.fontSize.sm,
    fontWeight: "600",
    fontFamily: typography.fontFamily.Manrope.SemiBold,
  },
  signInBtn: {
    height: 54,
    marginBottom: spacing[4],
    borderRadius: radius.full,
  },
  signInText: {
    fontSize: typography.fontSize.md,
    fontWeight: "700",
    fontFamily: typography.fontFamily.Manrope.Bold,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing[4],
    gap: spacing[3],
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: typography.fontSize.xs,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: typography.fontFamily.Manrope.Medium,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[3],
    paddingVertical: spacing[3.5],
    paddingHorizontal: spacing[4],
    borderRadius: radius.full,
    borderWidth: 1,
  },
  googleIconWrap: {
    width: 24,
    height: 24,
    resizeMode: "cover",
  },
  googleText: {
    fontSize: typography.fontSize.sm,
    fontWeight: "500",
    fontFamily: typography.fontFamily.Manrope.Medium,
  },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing[6],
  },
  footerText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.Manrope.Regular,
  },
  footerLink: {
    fontSize: typography.fontSize.sm,
    fontWeight: "700",
    fontFamily: typography.fontFamily.Manrope.Bold,
  },
  unverifiedEmailContainer: {
    marginBottom: spacing[4],
  },
  unverifiedEmailText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.Manrope.Regular,
    marginBottom: spacing[2],
  },
  unverifiedEmailButton: {
    backgroundColor: "transparent",
    height: undefined,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: radius.full,
    paddingVertical: spacing[3.5],
    paddingHorizontal: spacing[4],
  },
  unverifiedEmailButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: "700",
    fontFamily: typography.fontFamily.Manrope.Bold,
  },
}));
