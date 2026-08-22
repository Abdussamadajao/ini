import React from "react";
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

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer]}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        <HomeHeader />
        <View style={styles.sectionBlock}>
          <NetWorthCard />
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Spending overview</Text>
            </View>
            <HomeChart />
          </View>
          <View style={styles.section}>
            <Budgets />
          </View>
          <View style={styles.section}>
            <RecentTransactions />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
