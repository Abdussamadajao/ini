import { makeStyles } from "@/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastType = "success" | "error" | "info" | "warning";
type ToastPosition = "top" | "bottom" | "center";

interface ToastProps {
  message: string;
  type?: ToastType;
  actionText?: string;
  onActionPress?: () => void;
  duration?: number;
  position?: ToastPosition;
  maxLines?: number;
}

// ─── Type Config ──────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  ToastType,
  { icon: string; iconBg: string; iconColor: string }
> = {
  success: {
    icon: "check",
    iconBg: "rgba(34,  197,  94, 0.18)",
    iconColor: "#22C55E",
  },
  warning: {
    icon: "warning-amber",
    iconBg: "rgba(245, 158,  11, 0.20)",
    iconColor: "#F59E0B",
  },
  error: {
    icon: "priority-high",
    iconBg: "rgba(239,  68,  68, 0.20)",
    iconColor: "#EF4444",
  },
  info: {
    icon: "info-outline",
    iconBg: "rgba(148, 163, 184, 0.20)",
    iconColor: "#94A3B8",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export const ToastContainer: React.FC<ToastProps> = ({
  message,
  onActionPress,
  type = "info",
  duration = 3000,
  position = "top",
  maxLines = 2,
}) => {
  const s = useToastStyles();
  const [visible, setVisible] = useState(true);
  const progress = useState(new Animated.Value(0))[0];
  const config = TYPE_CONFIG[type];

  // fade / slide in-out
  useEffect(() => {
    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [visible]);

  // auto-dismiss
  useEffect(() => {
    if (!visible || duration <= 0) return;
    const t = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(t);
  }, [visible, duration]);

  // call onActionPress after exit animation
  useEffect(() => {
    if (visible) return;
    const t = setTimeout(() => onActionPress?.(), 260);
    return () => clearTimeout(t);
  }, [visible, onActionPress]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [position === "top" ? -20 : 20, 0],
  });
  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1],
  });

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[
        s.container,
        position === "top" && s.top,
        position === "bottom" && s.bottom,
        position === "center" && s.center,
        { opacity: progress, transform: [{ translateY }, { scale }] },
      ]}
    >
      <View style={s.content}>
        <View style={[s.iconWrap, { backgroundColor: config.iconBg }]}>
          <MaterialIcons
            name={config.icon as never}
            size={19}
            color={config.iconColor}
          />
        </View>
        <Text style={s.message} numberOfLines={maxLines} ellipsizeMode="tail">
          {message}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => setVisible(false)}
        style={s.closeBtn}
        hitSlop={8}
      >
        <MaterialIcons name="close" size={20} color="#A3ADBF" />
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const useToastStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
    container: {
      borderRadius: radius.xl, // 24 — slightly rounder than before
      paddingVertical: spacing[3] + 2, // 14
      paddingHorizontal: spacing[3] + 2, // 14
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      backgroundColor: colors.background.elevated,
      borderWidth: 1,
      borderColor: colors.border.subtle,
      shadowColor: colors.text.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.32,
      shadowRadius: 14,
      elevation: 7,
      zIndex: 1000,
    },
    top: {
      marginTop: Platform.select({ ios: 6, android: 0 }),
    },
    bottom: {
      marginBottom: spacing[2] + 2, // 10
    },
    center: {
      alignSelf: "center",
    },
    content: {
      flex: 1,
      marginRight: spacing[2] + 2, // 10
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[3], // 12
    },
    iconWrap: {
      width: 34,
      height: 34,
      borderRadius: 17,
      justifyContent: "center",
      alignItems: "center",
    },
    message: {
      ...textMetrics(
        Platform.select({ ios: "md", android: "sm" }) as "md" | "sm",
        "snug",
      ),
      color: colors.text.primary,
      flexShrink: 1,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },
    closeBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.03)",
      borderWidth: 1,
      borderColor: colors.border.default,
    },
  }),
);
