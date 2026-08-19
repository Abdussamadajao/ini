import Logo from "@/components/shared/logo";
import { ThemedKeyboardAvoidingView } from "@/components/shared/themed-keyboard-avoiding-view";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useStyles } from "./styles";
import { RegisterForm } from "./form";
import { SafeArea } from "@/components/shared";

export default function Register() {
  const styles = useStyles();

  return (
    <SafeArea>
      <View style={styles.blobTop} pointerEvents="none" />
      <View style={styles.blobBottom} pointerEvents="none" />
      <ThemedKeyboardAvoidingView>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          automaticallyAdjustKeyboardInsets
          nestedScrollEnabled
        >
          <View style={styles.header}>
            <Logo />
            <Text style={[styles.title]}>Create account</Text>
            <Text style={[styles.subtitle]}>
              Start tracking your finances & taxes
            </Text>
          </View>

          <RegisterForm />
        </ScrollView>
      </ThemedKeyboardAvoidingView>
    </SafeArea>
  );
}
