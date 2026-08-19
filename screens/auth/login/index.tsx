import { Logo, ThemedKeyboardAvoidingView } from "@/components/shared";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useStyles } from "./styles";
import LoginForm from "./form";
import SafeArea from "@/components/shared/safe-area-view";
function Login() {
  const styles = useStyles();
  return (
    <SafeArea>
      <View style={styles.blobTop} pointerEvents="none" />
      <View style={styles.blobBottom} pointerEvents="none" />
      <ThemedKeyboardAvoidingView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Logo />
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Sign in to track your finances & taxes
            </Text>
          </View>
          <LoginForm />
        </ScrollView>
      </ThemedKeyboardAvoidingView>
    </SafeArea>
  );
}

export default Login;
