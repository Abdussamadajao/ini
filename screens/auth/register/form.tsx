import { FormikTextfield } from "@/components/form/text-field";
import Button from "@/components/shared/button";
import { useToast } from "@/components/toasts";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/stores";
import { useTheme } from "@/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Formik, FormikHelpers } from "formik";
import React, { useState } from "react";
import { Text, View } from "react-native";
import * as Yup from "yup";
import { useStyles } from "./styles";

// --- Types ---
type RegisterValues = {
  username: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

// --- Initial Values ---
const initialValues: RegisterValues = {
  username: "",
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

// --- Validation Schema ---
const registerSchema = Yup.object({
  username: Yup.string()
    .trim()
    .min(2, "Username is too short")
    .required("Username is required"),
  fullName: Yup.string()
    .trim()
    .min(2, "Name is too short")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

export function RegisterForm() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useStyles();
  const { toast } = useToast();
  const { setUnverifiedEmail } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  // --- Handlers ---
  async function handleSubmit(
    values: RegisterValues,
    { setFieldError }: FormikHelpers<RegisterValues>,
  ) {
    setIsLoading(true);

    const data = {
      username: values.username,
      name: values.fullName,
      email: values.email,
      password: values.password,
    };

    await authClient.signUp.email(data, {
      onSuccess: (_context) => {
        setUnverifiedEmail(values.email);
        router.replace("/(auth)/verify-email");
        toast.success("Registration successful");
        setIsLoading(false);
      },
      onError: (context) => {
        if (context.error.field === "email") {
          setFieldError("email", context.error.message);
        } else if (context.error.field === "username") {
          setFieldError("username", context.error.message);
        } else if (context.error.field === "name") {
          setFieldError("fullName", context.error.message);
        } else if (context.error.field === "password") {
          setFieldError("password", context.error.message);
        } else {
          toast.error(context.error.message ?? "Registration failed");
        }
        setIsLoading(false);
      },
    });
  }

  // --- Render ---
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={registerSchema}
      validateOnMount={false}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, isSubmitting, isValid, dirty }) => (
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
            name="username"
            label="Username"
            placeholder="jane_doe"
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
              <MaterialIcons name="mail" size={22} color={colors.text.muted} />
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

          <Button
            style={styles.signUpBtn}
            onPress={() => handleSubmit()}
            loading={isLoading || isSubmitting}
            disabled={!isValid || !dirty || isSubmitting || isLoading}
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
          {/*
          <View style={styles.divider}>
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
            disabled={isSubmitting || isLoading}
          >
            <Image source={images.google} style={styles.googleIconWrap} />
            <Text style={[styles.googleText, { color: colors.text.primary }]}>
              Continue with Google
            </Text>
          </Button>*/}

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.text.secondary }]}>
              Already have an account?{" "}
            </Text>
            <Button
              style={styles.linkBtn}
              onPress={() => router.replace("/(auth)/login")}
              disabled={isSubmitting || isLoading}
            >
              <Text style={[styles.footerLink, { color: colors.primary.main }]}>
                Sign in
              </Text>
            </Button>
          </View>
        </>
      )}
    </Formik>
  );
}
