import { SafeArea } from "@/components/shared";
import { ThemedKeyboardAvoidingView } from "@/components/shared/themed-keyboard-avoiding-view";
import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles } from "./styles";
import { ForgotPasswordForm } from "./form";

export default function ForgotPassword() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useStyles();
  const insets = useSafeAreaInsets();

  return (
    <SafeArea edges={["top", "left", "right"]}>
      <View style={styles.blobTop} pointerEvents="none" />
      <View style={styles.blobBottom} pointerEvents="none" />

      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          style={styles.headerBack}
          onPress={() => router.replace("/(auth)/login")}
        >
          <Ionicons name="arrow-back" size={22} color={colors.primary.main} />
        </Pressable>
        <View style={styles.headerSpacer} />
      </View>

      <ThemedKeyboardAvoidingView
        style={[styles.flex, { backgroundColor: "transparent" }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 56 : 0}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 120 + insets.bottom },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          automaticallyAdjustKeyboardInsets
          nestedScrollEnabled
          style={styles.scroll}
        >
          <View style={styles.maxWidth}>
            <View style={styles.hero}>
              <View style={[styles.heroIconWrap]}>
                <Ionicons name="key" size={39} color={colors.primary.main} />
              </View>
              <Text style={styles.heroTitle}>Forgot password</Text>
              <Text style={styles.subtitle}>
                Enter your email and we&apos;ll send you a code to reset your
                password.
              </Text>
            </View>

            <ForgotPasswordForm />
          </View>
        </ScrollView>
      </ThemedKeyboardAvoidingView>
    </SafeArea>
  );
}
