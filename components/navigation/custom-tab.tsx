import { makeStyles, useTheme } from "@/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useRef } from "react";
import { Animated, TouchableOpacity, View } from "react-native";

const iconMap: Record<string, (c: string, s: number) => React.ReactNode> = {
  dashboard: (c: string, s: number) => (
    <MaterialIcons name="dashboard" size={s} color={c} />
  ),
  transactions: (c: string, s: number) => (
    <MaterialIcons name="wallet" size={s} color={c} />
  ),
  budgets: (c: string, s: number) => (
    <MaterialIcons name="analytics" size={s} color={c} />
  ),
  report: (c: string, s: number) => (
    <MaterialIcons name="auto-graph" size={s} color={c} />
  ),
  profile: (c: string, s: number) => (
    <MaterialIcons name="person" size={s} color={c} />
  ),
};

const labelMap: Record<string, string> = {
  dashboard: "Home",
  transactions: "History",
  budgets: "budgets",
  report: "Reports",
  profile: "Profile",
};

// ─── TabItem ──────────────────────────────────────────────────────────────────

interface TabItemProps {
  name: string;
  color: string;
  focused: boolean;
  size?: number;
}

export function TabItem({ name, color, focused, size = 24 }: TabItemProps) {
  const styles = useStyles();

  const iconScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (focused) {
      Animated.sequence([
        Animated.timing(iconScale, {
          toValue: 0.95,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.spring(iconScale, {
          toValue: 1,
          useNativeDriver: true,
          damping: 10,
          stiffness: 320,
        }),
      ]).start();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused]);

  const Icon = iconMap[name] ?? iconMap.dashboard;
  const label = labelMap[name] ?? name;

  return (
    <Animated.View
      style={[styles.wrapper, { transform: [{ scale: iconScale }] }]}
    >
      {Icon(color, size)}
      <Animated.Text
        style={[styles.label, { color, transform: [{ scale: iconScale }] }]}
      >
        {label}
      </Animated.Text>
    </Animated.View>
  );
}

// ─── FABTab ──────────────────────────────────────────────────────────────────

interface FABTabProps {
  onPress?: () => void;
  isOpen?: boolean;
}

export function FABTab({ onPress, isOpen = false }: FABTabProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const rotation = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const rotateInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  return (
    <View style={styles.fabOuter}>
      <Animated.View style={{ transform: [{ rotate: rotateInterpolation }] }}>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={1}
          style={[
            styles.fab,
            {
              backgroundColor: colors.primary.main,
              shadowColor: colors.primary.main,
            },
          ]}
        >
          <MaterialIcons
            name={isOpen ? "close" : "add"}
            size={24}
            color={colors.primary.contrastText}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const useStyles = makeStyles(({ colors, radius, spacing, typography }) => ({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 56,
    gap: spacing[0.5],
  },
  label: {
    fontSize: 12,
    fontFamily: typography.fontFamily.Manrope.Bold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  fabOuter: {
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1000,
  },
}));
