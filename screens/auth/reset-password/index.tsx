import { SafeArea } from "@/components/shared";
import { ThemedKeyboardAvoidingView } from "@/components/shared/themed-keyboard-avoiding-view";
import { useAuthStore } from "@/stores";
import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles } from "./styles";
import { ResetPasswordForm } from "./form";

export default function ResetPassword() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const resetPasswordEmail = useAuthStore((s) => s.resetPasswordEmail);

  useEffect(() => {
    if (!resetPasswordEmail) {
      router.replace("/(auth)/forgot-password");
    }
  }, [resetPasswordEmail, router]);

  if (!resetPasswordEmail) {
    return null;
  }

  return (
    <SafeArea edges={["top", "left", "right"]}>
      {/*<View style={styles.blobTop} pointerEvents="none" />
      <View style={styles.blobBottom} pointerEvents="none" />*/}

      <View style={[styles.header, {}]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          style={styles.headerBack}
          onPress={() => router.back()}
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
                <Ionicons
                  name="lock-closed"
                  size={39}
                  color={colors.primary.main}
                />
              </View>
              <Text style={[styles.heroTitle, {}]}>Set new password</Text>
              <Text style={[styles.subtitle, {}]}>
                Enter the code sent to{" "}
                <Text style={{ fontWeight: "600" }}>{resetPasswordEmail}</Text>
                {"\n"}and choose a new password.
              </Text>
            </View>

            <ResetPasswordForm />
          </View>
        </ScrollView>
      </ThemedKeyboardAvoidingView>
    </SafeArea>
  );
}
