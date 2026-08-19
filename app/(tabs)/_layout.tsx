import { FABTab, TabItem } from "@/components/navigation";
import {
  QuickActionItem,
  QuickActionsModal,
} from "@/components/shared/quick-actions-modal";
import { makeStyles, useColors, useSpacing } from "@/theme";
import { router, Tabs } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";

const FAB_SIZE = 48;
const FAB_BOTTOM_OFFSET = 120;

export default function TabLayout() {
  const colors = useColors();
  const spacing = useSpacing();
  const styles = useStyles();
  const [open, setOpen] = useState(false);

  // Single source of truth for the FAB's right offset — read once here and
  // passed to both the FAB's own style and QuickActionsModal, so the two
  // can never drift out of alignment again.
  const fabRightOffset = spacing[5];

  const quickActions: QuickActionItem[] = [
    {
      key: "income",
      label: "Add Income",
      iconSet: "material",
      iconName: "arrow-upward",
      onPress: () => {
        setOpen(false);
        router.push("/add-income");
      },
    },
    {
      key: "expense",
      label: "Add Expense",
      iconSet: "material",
      iconName: "arrow-downward",
      iconColor: "error",
      onPress: () => {
        setOpen(false);
        router.push("/add-expenses");
      },
    },
    {
      key: "batch",
      label: "Batch Transactions",
      iconSet: "material",
      iconName: "receipt-long",
      onPress: () => {
        setOpen(false);
        router.push("/batch-expense");
      },
    },
    {
      key: "budget",
      label: "Add Budget",
      iconSet: "material",
      iconName: "pie-chart",
      onPress: () => {
        setOpen(false);
        router.push("/add-budget");
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
            title: "History",
            tabBarIcon: ({ color, focused }) => (
              <TabItem name="transactions" color={color} focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name="budgets"
          options={{
            title: "Reports",
            tabBarIcon: ({ color, focused }) => (
              <TabItem name="budgets" color={color} focused={focused} />
            ),
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

      {/* Floating FAB — detached from the tab bar row entirely */}
      <View style={styles.fabFloating} pointerEvents="box-none">
        <FABTab onPress={() => setOpen((prev) => !prev)} isOpen={open} />
      </View>

      <QuickActionsModal
        open={open}
        close={() => setOpen(false)}
        actions={quickActions}
        rightOffset={fabRightOffset}
        bottomOffset={FAB_BOTTOM_OFFSET}
        fabSize={FAB_SIZE}
      />
    </>
  );
}

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(({ colors, spacing, radius }) => ({
  tabBar: {
    backgroundColor: colors.background.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    height: 90,
    paddingBottom: spacing[6],
    paddingTop: spacing[1],
    position: "absolute",
    bottom: spacing[0],
    left: 0,
    right: 0,
    shadowColor: colors.palette.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 4,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  fabFloating: {
    position: "absolute",
    right: spacing[5],
    bottom: FAB_BOTTOM_OFFSET,
    zIndex: 10000,
    elevation: 10,
  },
}));
