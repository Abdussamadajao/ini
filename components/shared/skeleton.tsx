import { makeStyles, useTheme } from "@/theme";
import React, { useEffect, useRef } from "react";
import { Animated, View, ViewStyle } from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  /** Defaults to radius.md (8) */
  borderRadius?: number;
  /** Override the base colour (defaults to background.surfaceAlt) */
  baseColor?: string;
  /** Override the shimmer highlight (defaults to background.elevated) */
  highlightColor?: string;
  /** Pulse speed in ms — default 1100 */
  speed?: number;
  style?: ViewStyle;
}

// ─── Primitive ────────────────────────────────────────────────────────────────

export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = 16,
  borderRadius,
  baseColor,
  highlightColor,
  speed = 1100,
  style,
}) => {
  const { colors } = useTheme();
  const styles = useStyles();

  const base = baseColor ?? colors.background.surfaceAlt;
  const highlight = highlightColor ?? colors.background.elevated;
  const radius = borderRadius ?? styles.skeletonDefault.borderRadius;

  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: speed,
          useNativeDriver: false,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: speed,
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]);

  const bgColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [base, highlight],
  });

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: radius, backgroundColor: bgColor },
        style,
      ]}
    />
  );
};

// ─── Preset: List Item ────────────────────────────────────────────────────────

export const SkeletonListItem: React.FC<{ style?: ViewStyle }> = ({
  style,
}) => {
  const styles = useStyles();
  return (
    <View style={[styles.row, style]}>
      <Skeleton
        width={46}
        height={46}
        borderRadius={styles.skeletonFull.borderRadius}
      />
      <View style={styles.listText}>
        <Skeleton width="55%" height={14} />
        <Skeleton width="38%" height={11} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
};

// ─── Preset: Card ─────────────────────────────────────────────────────────────

export const SkeletonCard: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  const styles = useStyles();
  return (
    <View style={style}>
      <Skeleton
        width="100%"
        height={156}
        borderRadius={styles.skeletonLg.borderRadius}
      />
      <View style={styles.cardBody}>
        <Skeleton width="70%" height={15} />
        <Skeleton width="100%" height={12} style={{ marginTop: 10 }} />
        <Skeleton width="85%" height={12} style={{ marginTop: 6 }} />
      </View>
    </View>
  );
};

// ─── Preset: Profile Header ───────────────────────────────────────────────────

export const SkeletonProfile: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  const styles = useStyles();
  return (
    <View style={[styles.row, style]}>
      <Skeleton
        width={46}
        height={46}
        borderRadius={styles.skeletonFull.borderRadius}
      />
      <View style={styles.profileText}>
        <Skeleton width={130} height={15} />
        <Skeleton
          width={80}
          height={11}
          borderRadius={styles.skeletonFull.borderRadius}
          style={{ marginTop: 8 }}
        />
      </View>
    </View>
  );
};

// ─── Preset: Stat Tile ────────────────────────────────────────────────────────

export const SkeletonStat: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  const styles = useStyles();
  return (
    <View style={[styles.statTile, style]}>
      <Skeleton
        width={44}
        height={44}
        borderRadius={styles.skeletonFull.borderRadius}
      />
      <Skeleton width={64} height={13} style={{ marginTop: 10 }} />
      <Skeleton width={44} height={10} style={{ marginTop: 6 }} />
    </View>
  );
};

// ─── Preset: Transaction Row ──────────────────────────────────────────────────

export const SkeletonTransaction: React.FC<{ style?: ViewStyle }> = ({
  style,
}) => {
  const styles = useStyles();
  return (
    <View style={[styles.row, style]}>
      <Skeleton
        width={40}
        height={40}
        borderRadius={styles.skeletonLg.borderRadius}
      />
      <View style={styles.listText}>
        <Skeleton width="45%" height={13} />
        <Skeleton width="28%" height={10} style={{ marginTop: 7 }} />
      </View>
      <View style={styles.trailingAmount}>
        <Skeleton width={60} height={14} />
      </View>
    </View>
  );
};

// ─── Utility: Repeat ─────────────────────────────────────────────────────────

export const SkeletonList: React.FC<{
  count?: number;
  gap?: number;
  renderItem: (index: number) => React.ReactNode;
  style?: ViewStyle;
}> = ({ count = 4, gap = 16, renderItem, style }) => (
  <View style={style}>
    {Array.from({ length: count }).map((_, i) => (
      <View key={i} style={i > 0 ? { marginTop: gap } : undefined}>
        {renderItem(i)}
      </View>
    ))}
  </View>
);

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(({ colors, spacing, radius }) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  listText: {
    flex: 1,
    marginLeft: spacing[3],
  },
  cardBody: {
    paddingTop: spacing[3],
  },
  profileText: {
    marginLeft: spacing[3],
  },
  statTile: {
    alignItems: "center",
  },
  trailingAmount: {
    marginLeft: "auto",
    alignItems: "flex-end",
  },
  skeletonDefault: {
    borderRadius: radius.md,
  },
  skeletonLg: {
    borderRadius: radius.lg,
  },
  skeletonFull: {
    borderRadius: radius.full,
  },
}));

export default Skeleton;
