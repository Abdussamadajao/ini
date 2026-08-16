import { formatPrice } from "@/lib/custom";
import { makeStyles, useTheme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React, { ComponentProps } from "react";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";

const INCOME_STREAMS: {
  id: string;
  tag: string;
  title: string;
  amount: number;
  remaining: number;
  percent: number;
  barColor: "income" | "expense";
  icon: ComponentProps<typeof MaterialIcons>["name"];
}[] = [
  {
    id: "salary",
    tag: "Monthly",
    title: "Salary",
    amount: 500000,
    remaining: 320000,
    percent: 64,
    barColor: "income",
    icon: "payments",
  },
  {
    id: "portfolio",
    tag: "Dividends",
    title: "Tech Portfolio",
    amount: 125500,
    remaining: 12000,
    percent: 10,
    barColor: "expense",
    icon: "trending-up",
  },
  {
    id: "side-hustle",
    tag: "Active",
    title: "Side Hustle",
    amount: 85000,
    remaining: 85000,
    percent: 100,
    barColor: "income",
    icon: "storefront",
  },
];

export type IncomeStreamId = (typeof INCOME_STREAMS)[number]["id"];

export const IncomeSelect = ({
  selectedIncomeId,
  onSelectIncome,
}: {
  selectedIncomeId?: IncomeStreamId | null;
  onSelectIncome: (incomeId: IncomeStreamId | null) => void;
}) => {
  const { colors } = useTheme();
  const styles = useStyles();
  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.incomeStreamsScrollContent}
        style={styles.incomeStreamsScroll}
      >
        {INCOME_STREAMS.map((stream) => {
          const barTint =
            stream.barColor === "income"
              ? colors.status.success.main
              : colors.status.error.main;
          return (
            <Card
              key={stream.title}
              stream={stream}
              barTint={barTint}
              isSelected={selectedIncomeId === stream.id}
              onPress={() =>
                onSelectIncome(
                  selectedIncomeId === stream.id ? null : stream.id,
                )
              }
            />
          );
        })}
      </ScrollView>
    </>
  );
};

const Card = ({
  stream,
  barTint,
  isSelected,
  onPress,
}: {
  stream: (typeof INCOME_STREAMS)[0];
  barTint: string;
  isSelected: boolean;
  onPress: () => void;
}) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const { width: screenW } = Dimensions.get("window");
  const incomeCardW = Math.min(268, Math.round(screenW * 0.72));
  return (
    <Pressable
      onPress={onPress}
      key={stream.title}
      style={[
        styles.incomeStreamCard,
        {
          width: incomeCardW,
          backgroundColor: colors.background.surfaceAlt,
          borderColor: isSelected ? colors.primary.main : colors.border.default,
          borderWidth: isSelected ? 2 : 1,
        },
      ]}
    >
      <View style={styles.incomeStreamTop}>
        <Text
          style={[styles.incomeStreamLabel, { color: colors.text.secondary }]}
        >
          {stream.title}
        </Text>
        <Text style={[styles.incomeStreamTag, { color: colors.text.muted }]}>
          {stream.tag}
        </Text>
      </View>
      <Text style={[styles.incomeStreamAmount, { color: colors.text.primary }]}>
        {formatPrice(stream.amount)}
      </Text>
      <View style={styles.incomeStreamMeta}>
        <Text
          style={[styles.incomeStreamMetaText, { color: colors.text.muted }]}
        >
          {formatPrice(stream.remaining)} remaining
        </Text>
        <Text
          style={[styles.incomeStreamMetaText, { color: colors.text.muted }]}
        >
          {stream.percent}%
        </Text>
      </View>
      <View
        style={[
          styles.incomeStreamTrack,
          { backgroundColor: `${colors.border.default}44` },
        ]}
      >
        <View
          style={[
            styles.incomeStreamFill,
            {
              width: `${stream.percent}%`,
              backgroundColor: barTint,
            },
          ]}
        />
      </View>
    </Pressable>
  );
};

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(({ colors, spacing, radius, typography }) => ({
  incomeStreamsTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.Manrope.Bold,
    marginBottom: spacing[3],
  },
  incomeStreamsScroll: {
    marginHorizontal: -16,
  },
  incomeStreamsScrollContent: {
    paddingHorizontal: spacing[4],
    gap: spacing[3],
    paddingBottom: spacing[1],
  },
  incomeStreamCard: {
    borderRadius: radius.xl,
    padding: spacing[4],
    gap: spacing[2],
  },
  incomeStreamTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  incomeStreamIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  incomeStreamTag: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.Manrope.SemiBold,
  },
  incomeStreamLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.Manrope.Medium,
  },
  incomeStreamAmount: {
    fontSize: typography.fontSize["2xl"],
    fontFamily: typography.fontFamily.Manrope.ExtraBold,
    letterSpacing: -0.3,
    marginTop: spacing[0.5],
  },
  incomeStreamMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing[2],
  },
  incomeStreamMetaText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.Manrope.Medium,
  },
  incomeStreamTrack: {
    height: 4,
    borderRadius: radius.sm,
    overflow: "hidden",
    marginTop: spacing[3],
  },
  incomeStreamFill: {
    height: "100%",
    borderRadius: radius.sm,
  },
}));
