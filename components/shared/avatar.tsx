// ─── Imports ──────────────────────────────────────────────────────────────
import { makeStyles, useTheme } from "@/theme";
import React, { useState } from "react";
import {
  Image,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

// ─── Types ──────────────────────────────────────────────────────────────

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | number;
type AvatarVariant = "circle" | "rounded" | "square";
type AvatarStatus = "online" | "offline" | "away" | "busy";

export interface AvatarProps {
  uri?: string;
  name?: string;
  initials?: string;
  size?: AvatarSize;
  variant?: AvatarVariant;
  status?: AvatarStatus;
  borderColor?: string;
  color?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export interface AvatarGroupProps {
  avatars: Pick<AvatarProps, "uri" | "name" | "initials" | "color">[];
  size?: AvatarSize;
  variant?: AvatarVariant;
  borderColor?: string;
  max?: number;
  overlap?: number;
  style?: StyleProp<ViewStyle>;
}

// ─── Constants & Helpers ─────────────────────────────────────────────────

const SIZE_MAP: Record<string, number> = {
  xs: 28,
  sm: 36,
  md: 46,
  lg: 56,
  xl: 68,
  "2xl": 84,
};

const INNER_INSET = 6;

const INITIALS_PALETTE = [
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#F43F5E",
  "#14B8A6",
  "#0EA5E9",
  "#F97316",
  "#84CC16",
];

function resolveSize(size: AvatarSize): number {
  return typeof size === "number" ? size : (SIZE_MAP[size] ?? SIZE_MAP.md);
}

function getInitials(name?: string, initials?: string): string {
  if (initials) return initials.slice(0, 2).toUpperCase();
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function pickColor(name?: string): string {
  if (!name) return INITIALS_PALETTE[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return INITIALS_PALETTE[Math.abs(hash) % INITIALS_PALETTE.length];
}

function radiusFor(variant: AvatarVariant, size: number): number {
  if (variant === "circle") return size / 2;
  if (variant === "rounded") return size * 0.22;
  return 4;
}

// ─── Avatar Component ────────────────────────────────────────────────────

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  initials,
  size = "md",
  variant = "circle",
  status,
  borderColor,
  color,
  onPress,
  style,
  textStyle,
}) => {
  const [imgError, setImgError] = useState(false);
  const { colors } = useTheme();
  const styles = useStyles(); // ✅ defined at the bottom

  const wrapSize = resolveSize(size);
  const imgSize = wrapSize - INNER_INSET;
  const wrapRadius = radiusFor(variant, wrapSize);
  const imgRadius = radiusFor(variant, imgSize);
  const bgColor = color ?? pickColor(name);
  const showImage = !!uri && !imgError;

  const badgeSize = Math.max(Math.round(wrapSize * 0.27), 8);
  const badgeOffset = Math.round(wrapSize * 0.03);

  const statusColor =
    status === "online"
      ? colors.status.success.main
      : status === "offline"
        ? colors.text.muted
        : status === "away"
          ? colors.status.warning.main
          : status === "busy"
            ? colors.status.error.main
            : undefined;

  const defaultBorder = colors.border.default;

  const inner = (
    <View
      style={[
        styles.wrap,
        {
          width: wrapSize,
          height: wrapSize,
          borderRadius: wrapRadius,
          borderColor: borderColor ?? defaultBorder,
        },
        style,
      ]}
    >
      {showImage ? (
        <Image
          source={{ uri }}
          style={{ width: imgSize, height: imgSize, borderRadius: imgRadius }}
          resizeMode="cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <View
          style={[
            styles.initialsWrap,
            {
              width: imgSize,
              height: imgSize,
              borderRadius: imgRadius,
              backgroundColor: bgColor,
            },
          ]}
        >
          <Text
            style={[
              styles.initialsText,
              { fontSize: imgSize * 0.36 },
              textStyle,
            ]}
          >
            {getInitials(name, initials)}
          </Text>
        </View>
      )}

      {status && statusColor && (
        <View
          style={[
            styles.badge,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              backgroundColor: statusColor,
              bottom: badgeOffset,
              right: badgeOffset,
            },
          ]}
        />
      )}
    </View>
  );

  return onPress ? (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
      {inner}
    </TouchableOpacity>
  ) : (
    inner
  );
};

// ─── Avatar Group ────────────────────────────────────────────────────────

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  size = "md",
  variant = "circle",
  borderColor,
  max = 4,
  overlap,
  style,
}) => {
  const { colors } = useTheme();
  const px = resolveSize(size);
  const gap = overlap ?? Math.round(px * 0.3);
  const visible = avatars.slice(0, max);
  const extra = avatars.length - max;
  const border = borderColor ?? colors.background.surface;

  return (
    <View style={[{ flexDirection: "row", alignItems: "center" }, style]}>
      {visible.map((a, i) => (
        <View
          key={i}
          style={{ marginLeft: i === 0 ? 0 : -gap, zIndex: visible.length - i }}
        >
          <Avatar {...a} size={size} variant={variant} borderColor={border} />
        </View>
      ))}
      {extra > 0 && (
        <View style={{ marginLeft: -gap, zIndex: 0 }}>
          <Avatar
            initials={`+${extra}`}
            size={size}
            variant={variant}
            borderColor={border}
            color={colors.text.muted}
          />
        </View>
      )}
    </View>
  );
};

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────

const useStyles = makeStyles(({ colors, typography, textMetrics }) => ({
  wrap: {
    borderWidth: 2,
    borderStyle: "solid",
    overflow: "visible",
    justifyContent: "center",
    alignItems: "center",
  },
  initialsWrap: {
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    ...textMetrics("sm", "snug"),
    color: colors.text.inverse,
    fontFamily: typography.fontFamily.Manrope.SemiBold,
    letterSpacing: 0.5,
    includeFontPadding: false,
    textTransform: "capitalize",
  },
  badge: {
    position: "absolute",
    borderWidth: 2,
    borderColor: colors.background.surface,
  },
}));
