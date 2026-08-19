import { FormikTextfield } from "@/components/form/text-field";
import Button from "@/components/shared/button";
import { useToast } from "@/components/toasts";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/stores";
import { useTheme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import { Text, View } from "react-native";
import * as Yup from "yup";
import { useStyles } from "./styles";

// --- Types ---
type ForgotPasswordValues = {
  email: string;
};

// --- Initial Values ---
const initialValues: ForgotPasswordValues = {
  email: "",
};

// --- Validation Schema ---
const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export function ForgotPasswordForm() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useStyles();
  const { toast } = useToast();
  const setResetPasswordEmail = useAuthStore((s) => s.setResetPasswordEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Handlers ---
  async function handleSubmit(values: ForgotPasswordValues) {
    setIsSubmitting(true);
    try {
      const { data, error } = await authClient.emailOtp.requestPasswordReset({
        email: values.email,
      });

      if (error) {
        toast.error(error.message ?? "Failed to initiate password reset");
        setIsSubmitting(false);
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
          setIsSubmitting(false);
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
  }

  // --- Render ---
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={forgotPasswordSchema}
      validateOnMount={false}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, isSubmitting: isFormSubmitting, isValid, dirty }) => (
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
            containerStyle={styles.inputRow}
          />

          <View style={styles.bottomShell}>
            <Button
              style={styles.submitBtn}
              onPress={() => handleSubmit()}
              loading={isSubmitting || isFormSubmitting}
              disabled={!isValid || !dirty || isSubmitting || isFormSubmitting}
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
          </View>
        </>
      )}
    </Formik>
  );
}
