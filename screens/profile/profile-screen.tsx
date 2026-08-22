import { useToast } from "@/components/toasts";
import { authClient, useAuthStore } from "@/stores";
import { ThemeMode, makeStyles, useThemeMode, useToggleTheme } from "@/theme";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileFooter } from "./profile-footer";

import { ProfileUserCard } from "./profile-user-card";
import {
  SettingsActionRow,
  SettingsChevronRow,
  SettingsThemeRow,
  SettingsToggleRow,
} from "./settings-rows";
import { SettingsSection } from "./settings-section";
import { ThemeSegmentControl } from "./theme-segment-control";
import { Header } from "@/components/shared";

export function ProfileScreen() {
  const mode = useThemeMode();
  const toggleTheme = useToggleTheme();
  const { toast } = useToast();
  const { logout, user, isHydrating } = useAuthStore();
  const styles = useStyles();
  // const [transactionAlerts, setTransactionAlerts] = useState(true);
  // const [budgetAlerts, setBudgetAlerts] = useState(false);

  const onThemeSelect = useCallback(
    (next: ThemeMode) => {
      if (next !== mode) toggleTheme();
    },
    [mode, toggleTheme],
  );

  const openEditProfile = useCallback(() => {
    router.push({
      pathname: "/edit-profile",
      params: {
        name: user?.name ?? "",
        email: user?.email ?? "",
        imageUri: user?.avatarUrl ?? user?.image ?? "",
      },
    });
  }, [user?.name, user?.email, user?.avatarUrl, user?.image]);

  const openChangePassword = useCallback(() => {
    router.push("/change-password");
  }, []);

  const openCategoryManagement = useCallback(() => {
    router.push("/categories");
  }, []);

  const onLogout = useCallback(async () => {
    await authClient.signOut();
    logout();
    toast.success("Logged out successfully");
  }, [logout, toast]);

  const profileName = user?.name ?? "";
  const profileEmail = user?.email ?? "";
  const memberSinceLabel = useMemo(() => {
    if (!user?.createdAt) return "MEMBER SINCE";
    const year = new Date(user.createdAt).getFullYear();
    return Number.isNaN(year) ? "MEMBER SINCE" : `MEMBER SINCE ${year}`;
  }, [user?.createdAt]);

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <Header
        title="Profile"
        desc="Manage your account and preferences"
        titleSize="large"
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfileUserCard
          name={profileName}
          email={profileEmail}
          memberSinceLabel={memberSinceLabel}
          imageUri={user?.avatarUrl ?? user?.image ?? ""}
          isPending={isHydrating}
        />

        <SettingsSection title="Account">
          <SettingsChevronRow
            icon="person-outline"
            label="Edit Profile"
            onPress={openEditProfile}
          />
          <SettingsChevronRow
            icon="lock-outline"
            label="Change Password"
            onPress={openChangePassword}
          />
          <SettingsChevronRow
            icon="category"
            label="Category Management"
            onPress={openCategoryManagement}
            showDivider={false}
          />
        </SettingsSection>

        <SettingsSection title="Appearance">
          <SettingsThemeRow label="Theme" showDivider={false}>
            <ThemeSegmentControl mode={mode} onSelect={onThemeSelect} />
          </SettingsThemeRow>
        </SettingsSection>
        {/* 
        <SettingsSection title="Notifications">
          <SettingsToggleRow
            icon="receipt-long"
            label="Transaction alerts"
            value={transactionAlerts}
            onValueChange={setTransactionAlerts}
          />
          <SettingsToggleRow
            icon="pie-chart-outline"
            label="Budget alerts"
            value={budgetAlerts}
            onValueChange={setBudgetAlerts}
            showDivider={false}
          />
        </SettingsSection> */}
        {/* 
        <SettingsSection title="Privacy">
          <SettingsActionRow icon="download" label="Export Data" />
          <SettingsActionRow
            icon="delete-outline"
            label="Delete Account"
            danger
            showDivider={false}
          />
        </SettingsSection> */}

        <ProfileFooter onLogout={onLogout} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(({ colors, spacing }) => ({
  safe: {
    backgroundColor: colors.background.screen,
    flex: 1,
  },
  scroll: { flex: 1 },
  content: {
    paddingBottom: spacing[24],
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
  },
}));
