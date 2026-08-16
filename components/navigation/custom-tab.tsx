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
  report: (c: string, s: number) => (
    <MaterialIcons name="auto-graph" size={s} color={c} />
  ),
  profile: (c: string, s: number) => (
    <MaterialIcons name="person" size={s} color={c} />
  ),
};

// ─── TabItem ──────────────────────────────────────────────────────────────────

interface TabItemProps {
  name: string;
  color: string;
  focused: boolean;
  size?: number;
}

export function TabItem({ name, color, focused, size = 24 }: TabItemProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  const pillWidth = useRef(new Animated.Value(focused ? 52 : 0)).current;
  const pillOpacity = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const iconScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(pillWidth, {
        toValue: focused ? 52 : 0,
        useNativeDriver: false,
        damping: 18,
        stiffness: 200,
      }),
      Animated.timing(pillOpacity, {
        toValue: focused ? 1 : 0,
        duration: 180,
        useNativeDriver: false,
      }),
    ]).start();
    if (focused) {
      Animated.sequence([
        Animated.timing(iconScale, {
          toValue: 0.8,
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
  }, [focused]);

  const Icon = iconMap[name] ?? iconMap.dashboard;
  const iconColor = focused ? colors.primary.contrastText : color;

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[styles.pill, { width: pillWidth, opacity: pillOpacity }]}
      >
        <View style={styles.pillSheen} />
      </Animated.View>
      <Animated.View
        style={[styles.iconWrap, { transform: [{ scale: iconScale }] }]}
      >
        {Icon(iconColor, size)}
      </Animated.View>
    </View>
  );
}

// ─── FABTab ──────────────────────────────────────────────────────────────────

interface FABTabProps {
  onPress?: () => void;
}

export function FABTab({ onPress }: FABTabProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.85,
        duration: 75,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        damping: 8,
        stiffness: 300,
      }),
    ]).start();
    onPress?.();
  };

  return (
    <View style={styles.fabOuter}>
      <View
        style={[
          styles.fabGlow,
          { backgroundColor: `${colors.primary.main}15` },
        ]}
      />
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          onPress={handlePress}
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
            name="add"
            size={24}
            color={colors.primary.contrastText}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(({ colors, radius }) => ({
  // TabItem
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 48,
  },
  pill: {
    position: "absolute",
    height: 46,
    borderRadius: radius.full,
    backgroundColor: colors.primary.main,
    overflow: "hidden",
  },
  pillSheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: radius.full,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
  },

  // FABTab
  fabOuter: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  fabGlow: {
    position: "absolute",
    width: 74, // FAB_SIZE + 16
    height: 74,
    borderRadius: radius.full,
  },
  fab: {
    width: 58,
    height: 58,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 14,
    zIndex: 1000,
  },
}));
