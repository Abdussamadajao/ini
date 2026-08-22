import { useTransactions } from "@/actions";
import { InlineError, Skeleton } from "@/components/shared";
import { formatAmount, isValidMaterialIcon } from "@/lib";
import { useColors } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useRecentTransactionsStyles } from "./styles";

type RecentTx = {
  id: string;
  title: string;
  date: string;
  amount: number;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBg: string;
  isIncome: boolean;
};

export function RecentTransactions() {
  const colors = useColors();
  const router = useRouter();
  const styles = useRecentTransactionsStyles();

  const { data: transactions, isPending, error, refetch } = useTransactions();

  const recentTransactions = (transactions?.data ?? [])
    .slice()
    .sort(
      (a, b) =>
        new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime(),
    )
    .slice(0, 5)
    .map((tx) => ({
      id: tx.id,
      title: tx.source_name?.trim() || tx.category.name,
      date: formatDate(tx.recorded_at),
      amount: Number(tx.amount) || 0,
      icon: isValidMaterialIcon(tx.category.icon)
        ? tx.category.icon
        : "receipt-long",
      iconBg: tx.category.color,
      isIncome: tx.type === "INCOME",
    }));

  const isEmpty = !isPending && recentTransactions.length === 0;

  const renderTransaction = ({ item: tx }: { item: RecentTx }) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/transactions/[id]",
          params: { id: tx.id },
        })
      }
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
    >
      <View style={styles.rowLeft}>
        <View
          style={[styles.txIconWrap, { backgroundColor: `${tx.iconBg}18` }]}
        >
          <MaterialIcons name={tx.icon} size={18} color={tx.iconBg} />
        </View>

        <View style={styles.txInfo}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {tx.title}
          </Text>
          <Text style={styles.rowMeta} numberOfLines={1}>
            {tx.date}
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.amount,
          {
            color: tx.isIncome ? colors.primary.main : colors.status.error.main,
          },
        ]}
        numberOfLines={1}
      >
        {formatAmount(tx.amount, tx.isIncome)}
      </Text>
    </Pressable>
  );

  if (error) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Recent transactions</Text>
        </View>
        <InlineError error={error} onRetry={refetch} />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Recent transactions</Text>
        {!isEmpty && (
          <Pressable
            onPress={() => router.push("/(tabs)/transactions")}
            hitSlop={12}
            style={({ pressed }) => pressed && styles.viewAllPressed}
          >
            <Text style={styles.viewAll}>See all</Text>
          </Pressable>
        )}
      </View>

      {isEmpty ? (
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIconWrap}>
            <MaterialIcons
              name="receipt-long"
              size={26}
              color={colors.primary.main}
            />
          </View>
          <Text style={styles.emptyTitle}>No transactions yet</Text>
          <Text style={styles.emptySubtitle}>
            Your income and expenses will show up here once you add one.
          </Text>
        </View>
      ) : isPending ? (
        <View style={styles.list}>
          {Array.from({ length: 3 }).map((_, i) => (
            <View key={`recent-skeleton-${i}`} style={styles.row}>
              <Skeleton width={36} height={36} borderRadius={18} />
              <View style={styles.txInfo}>
                <Skeleton width="60%" height={14} />
                <Skeleton width="40%" height={12} style={{ marginTop: 4 }} />
              </View>
              <Skeleton width={70} height={14} />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={recentTransactions}
          keyExtractor={(tx) => tx.id}
          renderItem={renderTransaction}
          scrollEnabled={false}
        />
      )}
    </View>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
