import { makeStyles, useColors } from "@/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

export type QuickActionItem =
  | {
      key: string;
      label: string;
      onPress: () => void;
      iconSet: "material";
      iconName: React.ComponentProps<typeof MaterialIcons>["name"];
      iconColor?: "primary" | "error";
    }
  | {
      key: string;
      label: string;
      onPress: () => void;
      iconSet: "materialCommunity";
      iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
      iconColor?: "primary" | "error";
    }
  | {
      key: string;
      label: string;
      onPress: () => void;
      iconSet: "ionicons";
      iconName: React.ComponentProps<typeof Ionicons>["name"];
      iconColor?: "primary" | "error";
    }
  | {
      key: string;
      label: string;
      onPress: () => void;
      iconSet: "fontAwesome";
      iconName: React.ComponentProps<typeof FontAwesome>["name"];
      iconColor?: "primary" | "error";
    }
  | {
      key: string;
      label: string;
      onPress: () => void;
      iconSet: "feather";
      iconName: React.ComponentProps<typeof Feather>["name"];
      iconColor?: "primary" | "error";
    }
  | {
      key: string;
      label: string;
      onPress: () => void;
      iconSet: "antDesign";
      iconName: React.ComponentProps<typeof AntDesign>["name"];
      iconColor?: "primary" | "error";
    };

type QuickActionsModalProps = {
  open: boolean;
  close: () => void;
  actions: QuickActionItem[];
  /**
   * Distance (px) from the screen's right edge to the FAB's right edge.
   * Must match the `right` value used to position the FAB itself, so the
   * arc is centered exactly on the `+` button.
   */
  rightOffset: number;
  /**
   * Distance (px) from the screen's bottom edge to the FAB's bottom edge.
   * Must match the `bottom` value used to position the FAB itself.
   */
  bottomOffset: number;
  /** Diameter (px) of the FAB, used to find its center point. */
  fabSize?: number;
};

const ITEM_SIZE = 48;
// Gap between the FAB's edge and the first bubble, and between bubbles.
const GAP_FROM_FAB = 16;
const ITEM_GAP = 14;

export function QuickActionsModal({
  open,
  close,
  actions,
  rightOffset,
  bottomOffset,
  fabSize = 48,
}: QuickActionsModalProps) {
  const styles = useStyles();
  const colors = useColors();
  const [mounted, setMounted] = React.useState(open);
  const overlayOpacity = React.useRef(new Animated.Value(0)).current;
  const itemAnimationsRef = React.useRef<Animated.Value[]>([]);
  const animRunningRef = React.useRef(false);

  // Ensure we have the right number of animated values
  React.useMemo(() => {
    if (itemAnimationsRef.current.length !== actions.length) {
      itemAnimationsRef.current = actions.map(
        (_, index) => itemAnimationsRef.current[index] ?? new Animated.Value(0),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions.length]);

  React.useEffect(() => {
    const itemAnimations = itemAnimationsRef.current;

    // Stop any running animations to prevent frozen object errors
    overlayOpacity.stopAnimation();
    itemAnimations.forEach((anim) => anim.stopAnimation());

    if (open) {
      setMounted(true);
      // Reset to initial state before animating in
      overlayOpacity.setValue(0);
      itemAnimations.forEach((anim) => anim.setValue(0));

      animRunningRef.current = true;
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.stagger(
          45,
          itemAnimations.map((item) =>
            Animated.spring(item, {
              toValue: 1,
              stiffness: 280,
              damping: 22,
              mass: 0.7,
              useNativeDriver: true,
            }),
          ),
        ),
      ]).start(() => {
        animRunningRef.current = false;
      });
      return;
    }

    // Closing
    animRunningRef.current = true;
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 130,
        useNativeDriver: true,
      }),
      Animated.stagger(
        25,
        [...itemAnimations].reverse().map((item) =>
          Animated.timing(item, {
            toValue: 0,
            duration: 110,
            useNativeDriver: true,
          }),
        ),
      ),
    ]).start(({ finished }) => {
      animRunningRef.current = false;
      if (finished) setMounted(false);
    });
  }, [open, overlayOpacity]);

  if (!mounted) return null;

  const renderIcon = (action: QuickActionItem) => {
    const size = 20;
    const iconColor =
      action.iconColor === "error"
        ? colors.status.error.main
        : colors.primary.main;
    switch (action.iconSet) {
      case "material":
        return (
          <MaterialIcons name={action.iconName} size={size} color={iconColor} />
        );
      case "materialCommunity":
        return (
          <MaterialCommunityIcons
            name={action.iconName}
            size={size}
            color={iconColor}
          />
        );
      case "ionicons":
        return (
          <Ionicons name={action.iconName} size={size} color={iconColor} />
        );
      case "fontAwesome":
        return (
          <FontAwesome name={action.iconName} size={size} color={iconColor} />
        );
      case "feather":
        return <Feather name={action.iconName} size={size} color={iconColor} />;
      case "antDesign":
        return (
          <AntDesign name={action.iconName} size={size} color={iconColor} />
        );
    }
  };

  return (
    <Animated.View
      style={[styles.root, { opacity: overlayOpacity }]}
      pointerEvents={mounted ? "auto" : "none"}
    >
      {/* Faint scrim — just enough to read as "tap outside to close",
          never a heavy modal backdrop. Stops above the tab bar. */}
      <Animated.View
        style={[styles.backdrop]}
        pointerEvents={open ? "auto" : "none"}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
      </Animated.View>

      {/* Zero-size anchor at the FAB's center — every bubble is placed
          relative to this single point, so the column grows upward from
          the button exactly as it opens and closes. */}
      <View
        style={[
          styles.anchor,
          {
            right: rightOffset + fabSize / 2,
            bottom: bottomOffset + fabSize / 2,
          },
        ]}
        pointerEvents="box-none"
      >
        {actions.map((action, index) => {
          // Straight column opening upward from the FAB — each bubble
          // sits at the same horizontal center as the FAB, offset further
          // up the further it is in the list.
          const right = -ITEM_SIZE / 2;
          const bottom =
            GAP_FROM_FAB + ITEM_SIZE / 2 + index * (ITEM_SIZE + ITEM_GAP);

          const anim = itemAnimationsRef.current[index];

          return (
            <Animated.View
              key={action.key}
              pointerEvents={open ? "auto" : "none"}
              style={[
                styles.actionItem,
                {
                  right,
                  bottom,
                  opacity: anim,
                  transform: [
                    {
                      translateY: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [24, 0],
                      }),
                    },
                    {
                      scale: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.4, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Pressable
                style={({ pressed }) => [
                  styles.actionWrap,
                  pressed && styles.actionWrapPressed,
                ]}
                onPress={action.onPress}
                hitSlop={6}
              >
                <View style={styles.actionCircle}>{renderIcon(action)}</View>
                <View style={styles.labelPill}>
                  <Text style={styles.labelText} numberOfLines={1}>
                    {action.label}
                  </Text>
                </View>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </Animated.View>
  );
}

const useStyles = makeStyles(({ colors, radius, spacing }) => ({
  root: {
    // Must out-rank the FAB's own elevation/zIndex (10 / 1000) or Android
    // will draw the FAB on top of these bubbles regardless of JSX order.
    ...StyleSheet.absoluteFillObject,
    zIndex: 2000,
    elevation: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject, // Stop above the tab bar
    backgroundColor: colors.palette.slate[900],
    opacity: 0.45,
  },
  anchor: {
    position: "absolute",
    width: 0,
    height: 0,
    zIndex: 2000,
    elevation: 20,
  },
  actionItem: {
    position: "absolute",
    zIndex: 2000,
    elevation: 20,
  },
  actionWrap: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[1.5],
  },
  actionWrapPressed: {
    opacity: 0.8,
  },
  actionCircle: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: radius.full,
    backgroundColor: colors.background.surface,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.palette.black,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  labelPill: {
    backgroundColor: colors.background.surface,
    borderRadius: radius.full,
    paddingHorizontal: spacing[2.5],
    paddingVertical: spacing[1],
    shadowColor: colors.palette.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  labelText: {
    color: colors.text.primary,
    fontSize: 11,
    fontFamily: "Manrope-SemiBold",
  },
}));
