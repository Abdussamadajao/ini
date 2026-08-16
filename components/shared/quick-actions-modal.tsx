import { makeStyles, useColors } from "@/theme";
import { palette } from "@/theme/colors";
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
    }
  | {
      key: string;
      label: string;
      onPress: () => void;
      iconSet: "materialCommunity";
      iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
    }
  | {
      key: string;
      label: string;
      onPress: () => void;
      iconSet: "ionicons";
      iconName: React.ComponentProps<typeof Ionicons>["name"];
    }
  | {
      key: string;
      label: string;
      onPress: () => void;
      iconSet: "fontAwesome";
      iconName: React.ComponentProps<typeof FontAwesome>["name"];
    }
  | {
      key: string;
      label: string;
      onPress: () => void;
      iconSet: "feather";
      iconName: React.ComponentProps<typeof Feather>["name"];
    }
  | {
      key: string;
      label: string;
      onPress: () => void;
      iconSet: "antDesign";
      iconName: React.ComponentProps<typeof AntDesign>["name"];
    };

type QuickActionsModalProps = {
  open: boolean;
  close: () => void;
  actions: QuickActionItem[];
  bottomOffset?: number;
};

export function QuickActionsModal({
  open,
  close,
  actions,
  bottomOffset = 86,
}: QuickActionsModalProps) {
  const styles = useStyles();
  const colors = useColors();
  const [mounted, setMounted] = React.useState(open);
  const overlayOpacity = React.useRef(new Animated.Value(open ? 1 : 0)).current;
  const layerTranslateY = React.useRef(
    new Animated.Value(open ? 0 : 18),
  ).current;
  const layerScale = React.useRef(new Animated.Value(open ? 1 : 0.96)).current;
  const itemAnimationsRef = React.useRef<Animated.Value[]>([]);

  if (itemAnimationsRef.current.length !== actions.length) {
    itemAnimationsRef.current = actions.map(
      (_, index) =>
        itemAnimationsRef.current[index] ?? new Animated.Value(open ? 1 : 0),
    );
  }

  React.useEffect(() => {
    const itemAnimations = itemAnimationsRef.current;

    if (open) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(layerTranslateY, {
          toValue: 0,
          stiffness: 220,
          damping: 22,
          mass: 0.9,
          useNativeDriver: true,
        }),
        Animated.spring(layerScale, {
          toValue: 1,
          stiffness: 220,
          damping: 20,
          mass: 0.8,
          useNativeDriver: true,
        }),
        Animated.stagger(
          45,
          itemAnimations.map((item) =>
            Animated.spring(item, {
              toValue: 1,
              stiffness: 260,
              damping: 20,
              mass: 0.8,
              useNativeDriver: true,
            }),
          ),
        ),
      ]).start();
      return;
    }

    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(layerTranslateY, {
        toValue: 18,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(layerScale, {
        toValue: 0.96,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.stagger(
        30,
        [...itemAnimations].reverse().map((item) =>
          Animated.timing(item, {
            toValue: 0,
            duration: 120,
            useNativeDriver: true,
          }),
        ),
      ),
    ]).start(({ finished }) => {
      if (finished) setMounted(false);
    });
  }, [actions, layerScale, layerTranslateY, open, overlayOpacity]);

  if (!mounted) return null;

  const renderIcon = (action: QuickActionItem) => {
    const size = 20;
    const color = "#fff";
    switch (action.iconSet) {
      case "material":
        return (
          <MaterialIcons name={action.iconName} size={size} color={color} />
        );
      case "materialCommunity":
        return (
          <MaterialCommunityIcons
            name={action.iconName}
            size={size}
            color={color}
          />
        );
      case "ionicons":
        return <Ionicons name={action.iconName} size={size} color={color} />;
      case "fontAwesome":
        return <FontAwesome name={action.iconName} size={size} color={color} />;
      case "feather":
        return <Feather name={action.iconName} size={size} color={color} />;
      case "antDesign":
        return <AntDesign name={action.iconName} size={size} color={color} />;
    }
  };

  return (
    <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
      <Pressable style={styles.backdrop} onPress={close} />
      <Animated.View
        style={[
          styles.layer,
          {
            bottom: bottomOffset,
            transform: [{ translateY: layerTranslateY }, { scale: layerScale }],
          },
        ]}
      >
        <View style={styles.row}>
          {actions.map((action, index) => (
            <Animated.View
              key={action.key}
              style={[
                styles.actionItem,
                {
                  opacity: itemAnimationsRef.current[index],
                  transform: [
                    {
                      translateY: itemAnimationsRef.current[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [12, -20],
                      }),
                    },
                    {
                      scale: itemAnimationsRef.current[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.92, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Pressable style={styles.actionWrap} onPress={action.onPress}>
                <View style={styles.actionCircle}>{renderIcon(action)}</View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const useStyles = makeStyles(({ colors, radius, shadow, spacing }) => ({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 60,
    elevation: 60,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: palette.slate[900],
    opacity: 0.45,
  },
  layer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[10],
  },
  actionItem: {
    zIndex: 30,
    elevation: 30,
  },
  actionWrap: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    zIndex: 35,
    elevation: 35,
  },
  actionCircle: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.primary.main,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.glow,
  },
  actionLabel: {
    color: colors.text.primary,
    fontSize: 11,
    fontFamily: "Manrope-SemiBold",
  },
}));
