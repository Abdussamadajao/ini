import Skeleton from "@/components/shared/skeleton";
import { formatPrice } from "@/lib/custom";
import { useRadius, useTheme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useAddExpensesStyles } from "./add-expenses-styles";

export type IncomeSummaryCardProps = {
  onPress: () => void;
  incomeLabel: string;
  totalAmount: number;
  remainingAmount: number;
  incomePercent: number;
  isLoading?: boolean;
};

export function IncomeSummaryCard({
  onPress,
  incomeLabel,
  totalAmount,
  remainingAmount,
  incomePercent,
  isLoading = false,
}: IncomeSummaryCardProps) {
  const { colors } = useTheme();
  const styles = useAddExpensesStyles();
  const radius = useRadius();
  const cardShell = [
    styles.incomeCard,
    {
      backgroundColor: colors.background.surfaceAlt,
      borderColor: colors.border.default,
    },
  ];

  if (isLoading) {
    return (
      <Pressable onPress={onPress} style={cardShell}>
        <View style={styles.incomeCardHeader}>
          <Skeleton width="42%" height={12} borderRadius={radius.sm} />
          <Skeleton width={20} height={20} borderRadius={radius.sm} />
        </View>
        <Skeleton
          width="58%"
          height={28}
          borderRadius={radius.sm}
          style={{ marginTop: 2 }}
        />
        <Skeleton
          width="100%"
          height={8}
          borderRadius={radius.sm}
          style={{ marginTop: 12, marginBottom: 10 }}
        />
        <View style={styles.incomeCardFooter}>
          <Skeleton width="48%" height={14} borderRadius={radius.sm} />
          <Skeleton width="22%" height={12} borderRadius={radius.sm} />
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={cardShell}>
      <View style={styles.incomeCardHeader}>
        <Text
          style={[styles.incomeCardLabel, { color: colors.text.secondary }]}
        >
          {incomeLabel.toUpperCase()}
        </Text>
        <MaterialIcons
          name="swap-vert"
          size={20}
          color={colors.text.secondary}
        />
      </View>
      <Text style={[styles.incomeCardTotal, { color: colors.text.primary }]}>
        {formatPrice(totalAmount)}
        <Text
          style={[
            styles.incomeCardTotalSuffix,
            { color: colors.text.secondary },
          ]}
        >
          {" "}
          total
        </Text>
      </Text>
      <View
        style={[
          styles.incomeCardBarWrap,
          { backgroundColor: colors.background.surface },
        ]}
      >
        <View
          style={[
            styles.incomeCardBarGreen,
            {
              width: `${incomePercent}%`,
              backgroundColor: colors.status.success.main,
            },
          ]}
        />
        <View
          style={[
            styles.incomeCardBarRed,
            { flex: 1, backgroundColor: colors.status.error.main },
          ]}
        />
      </View>
      <View style={styles.incomeCardFooter}>
        <Text
          style={[styles.incomeCardRemaining, { color: colors.primary.main }]}
        >
          {formatPrice(remainingAmount)} remaining
        </Text>
        <Text
          style={[styles.incomeCardPercent, { color: colors.text.secondary }]}
        >
          {incomePercent}% left
        </Text>
      </View>
    </Pressable>
  );
}
