import { makeStyles, useTheme } from "@/theme";
import React, { useEffect } from "react";
import { Pressable, ViewStyle } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type SwitchProps = {
  value: SharedValue<boolean>;
  onPress: () => void;
  style?: ViewStyle;
  duration?: number;
  trackColors?: { on: string; off: string };
};

const Switch: React.FC<SwitchProps> = ({
  value,
  onPress,
  style,
  duration = 400,
  trackColors,
}) => {
  const { colors } = useTheme();
  const styles = useStyles();

  const height = useSharedValue(0);
  const width = useSharedValue(0);
  const progress = useSharedValue(value.value ? 1 : 0);

  // Use theme colors if not provided
  const trackOn = trackColors?.on ?? colors.status.success.main;
  const trackOff = trackColors?.off ?? colors.border.default;

  useAnimatedReaction(
    () => value.value,
    (v) => {
      progress.value = withTiming(v ? 1 : 0, { duration });
    },
    [duration],
  );

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(progress.value, [0, 1], [trackOff, trackOn]);
    return {
      backgroundColor: color,
      borderRadius: height.value / 2,
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const moveValue = interpolate(
      progress.value,
      [0, 1],
      [0, Math.max(0, width.value - height.value)],
    );
    return {
      transform: [{ translateX: moveValue }],
      borderRadius: height.value / 2,
    };
  });

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
          width.value = e.nativeEvent.layout.width;
        }}
        style={[styles.track, style, trackAnimatedStyle]}
      >
        <Animated.View style={[styles.thumb, thumbAnimatedStyle]} />
      </Animated.View>
    </Pressable>
  );
};

export const FormSwitch = ({
  value,
  onChange,
  trackColors,
}: {
  value: boolean | undefined;
  onChange: (value: boolean) => void;
  trackColors?: { on: string; off: string };
}) => {
  const switchValue = useSharedValue(!!value);
  useEffect(() => {
    switchValue.value = !!value;
  }, [value]);
  return (
    <Switch
      value={switchValue}
      onPress={() => {
        switchValue.value = !switchValue.value;
        onChange(!value);
      }}
      trackColors={trackColors}
    />
  );
};

export default Switch;

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(({ colors, spacing }) => ({
  track: {
    alignItems: "flex-start",
    width: 44,
    height: 24,
    paddingLeft: spacing[0.5],
    paddingRight: spacing[1],
    justifyContent: "center",
  },
  thumb: {
    height: 20,
    width: 20,
    borderRadius: 999,
    backgroundColor: colors.background.surface,
    shadowColor: colors.palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
}));
