import { useDashboard } from "@/actions/dashboard";
import { PeriodTab } from "@/types";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Budgets } from "./budgets";
import HomeChart from "./chart";
import { HomeHeader } from "./home-header";
import { NetWorthCard } from "./net-worth-card";
import { RecentTransactions } from "./recent-transactions";
import { useHomeScreenStyles } from "./styles";

export default function HomeScreen() {
  const styles = useHomeScreenStyles();
  const tabBarHeight = useBottomTabBarHeight();
  const [activePeriod, setActivePeriod] = useState<PeriodTab>("Month");
  const { data: dashboard, isPending } = useDashboard(activePeriod);

  const netWorth = dashboard?.net_worth;
  const trendLabel = dashboard?.period
    ? `${dashboard.period.savings_rate}% savings rate`
    : undefined;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: tabBarHeight + 16 },
        ]}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        <HomeHeader />
        <View style={styles.sectionBlock}>
          <NetWorthCard
            amount={netWorth?.total ?? 0}
            totalIncome={netWorth?.total_income ?? 0}
            totalExpenses={netWorth?.total_expenses ?? 0}
            trendLabel={trendLabel}
          />
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Spending overview</Text>
            </View>
            <HomeChart
              chart={dashboard?.chart}
              period={dashboard?.period}
              activePeriod={activePeriod}
              onPeriodChange={setActivePeriod}
            />
          </View>
          <View style={styles.section}>
            <Budgets />
          </View>
          <View style={styles.section}>
            <RecentTransactions
              transactions={dashboard?.recent}
              isPending={isPending}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
