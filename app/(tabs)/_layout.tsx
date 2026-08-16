import { FABTab, TabItem } from "@/components/navigation";
import {
  QuickActionItem,
  QuickActionsModal,
} from "@/components/shared/quick-actions-modal";
import { makeStyles, useTheme } from "@/theme";
import { router, Tabs } from "expo-router";
import React, { useState } from "react";

export default function TabLayout() {
  const { colors } = useTheme();
  const styles = useStyles();
  const [open, setOpen] = useState(false);

  const quickActions: QuickActionItem[] = [
    {
      key: "income",
      label: "Income",
      iconSet: "material",
      iconName: "trending-up",
      onPress: () => {
        setOpen(false);
        router.push("/add-income");
      },
    },
    {
      key: "expense",
      label: "Expense",
      iconSet: "material",
      iconName: "trending-down",
      onPress: () => {
        setOpen(false);
        router.push("/add-expenses");
      },
    },
  ];

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: colors.primary.main,
          tabBarInactiveTintColor: colors.text.secondary,
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color, focused }) => (
              <TabItem name="dashboard" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: "Wallet",
            tabBarIcon: ({ color, focused }) => (
              <TabItem name="transactions" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: "",
            tabBarIcon: () => <FABTab onPress={() => setOpen(true)} />,
          }}
          listeners={{
            tabPress: (e) => {
              // Prevent default navigation to the "add" route — the FAB
              // should only toggle the quick actions menu, not push a screen.
              e.preventDefault();
              setOpen(true);
            },
          }}
        />
        <Tabs.Screen
          name="report"
          options={{
            title: "Reports",
            tabBarIcon: ({ color, focused }) => (
              <TabItem name="report" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <TabItem name="profile" color={color} focused={focused} />
            ),
          }}
        />
      </Tabs>

      <QuickActionsModal
        open={open}
        close={() => setOpen(false)}
        actions={quickActions}
        bottomOffset={130}
      />
    </>
  );
}

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(({ colors, spacing, radius }) => ({
  tabBar: {
    backgroundColor: colors.background.surface,
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: colors.background.surface,
    height: 80,
    paddingBottom: spacing[10],
    paddingTop: spacing[2.5],
    position: "absolute",
    borderRadius: radius.full,
    bottom: spacing[7.5],
    left: spacing[4],
    right: spacing[4],
    shadowColor: colors.status.success.main,
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 11,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginHorizontal: spacing[4],
  },
  buttonContainer: {
    position: "absolute",
    right: spacing[4],
    bottom: 130,
    zIndex: 1000,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: radius.full,
    backgroundColor: colors.primary.main,
  },
}));
