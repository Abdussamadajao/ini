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
import { Formik, type FormikHelpers } from "formik";
import React, { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import * as Yup from "yup";

type RegisterValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const initialValues: RegisterValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const registerSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .min(2, "Name is too short")
    .required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "At least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

export default function Register() {
  const router = useRouter();
  const { colors } = useTheme();
  const { toast } = useToast();
  const styles = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const { setUnverifiedEmail } = useAuthStore();
  const handleSubmit = async (
    values: RegisterValues,
    setFieldError: FormikHelpers<RegisterValues>["setFieldError"],
  ) => {
    setIsLoading(true);
    const data = {
      name: values.fullName,
      email: values.email,
      password: values.password,
    };

    await authClient.signUp
      .email(data, {
        onSuccess: (_context) => {
          setUnverifiedEmail(values.email);
          router.replace("/(auth)/verify-email");
          toast.success("Registration successful");
        },
        onError: (context) => {
          toast.error(context.error.message ?? "Registration failed");
        },
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <ThemedKeyboardAvoidingView>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        automaticallyAdjustKeyboardInsets
        nestedScrollEnabled
      >
        <View style={styles.card}>
          <View style={styles.decor} />
          <View style={styles.header}>
            <Logo />
            <Text style={[styles.title, { color: colors.text.primary }]}>
              Create account
            </Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              Start tracking your finances & taxes
            </Text>
          </View>

          <Formik
            initialValues={initialValues}
            validationSchema={registerSchema}
            onSubmit={(values, { setFieldError }) => {
              handleSubmit(values, setFieldError);
            }}
          >
            {({ handleSubmit }) => (
              <>
                <FormikTextfield
                  name="fullName"
                  label="Full name"
                  placeholder="Jane Doe"
                  autoCapitalize="words"
                  autoComplete="name"
                  leftIcon={
                    <MaterialIcons
                      name="person"
                      size={22}
                      color={colors.text.muted}
                    />
                  }
                  containerStyle={styles.inputRow}
                />
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
                <FormikTextfield
                  name="password"
                  label="Password"
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
                  style={styles.signUpBtn}
                  onPress={() => handleSubmit()}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  <Text
                    style={[
                      styles.signUpText,
                      { color: colors.primary.contrastText },
                    ]}
                  >
                    Create account
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
              Already have an account?{" "}
            </Text>
            <Button
              style={styles.linkBtn}
              onPress={() => router.replace("/(auth)/login")}
            >
              <Text style={[styles.footerLink, { color: colors.primary.main }]}>
                Sign in
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
    overflow: "hidden",
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[6],
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
    marginBottom: spacing[0.25],
  },
  signUpBtn: {
    height: 54,
    marginBottom: spacing[4],
    borderRadius: radius.full,
  },
  signUpText: {
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
  linkBtn: {
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
