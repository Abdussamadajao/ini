import { useDashboard } from "@/actions";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeChart from "./chart";
import { HomeHeader } from "./home-header";
import Income from "./income";
import { NetWorthCard } from "./net-worth-card";
import { RecentTransactions } from "./recent-transaction";
import { useHomeScreenStyles } from "./styles";

const HomeScreen = () => {
  const styles = useHomeScreenStyles();
  const tabBarHeight = useBottomTabBarHeight();
  const { data: dashboard, isPending } = useDashboard();

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: tabBarHeight + 56 },
        ]}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        <HomeHeader />

        <View style={styles.sectionBlock}>
          <NetWorthCard
            amount={dashboard?.net_worth.total}
            trendLabel={
              dashboard?.period
                ? `${dashboard.period.savings_rate}% savings rate`
                : undefined
            }
          />
        </View>

        <View style={styles.sectionBlock}>
          <Income />
        </View>

        <View style={styles.sectionBlock}>
          <HomeChart chart={dashboard?.chart} period={dashboard?.period} />
        </View>

        <View style={styles.sectionBlock}>
          <RecentTransactions
            transactions={dashboard?.recent}
            isPending={isPending}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
