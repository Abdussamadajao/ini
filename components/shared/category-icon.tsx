import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";
import Foundation from "@expo/vector-icons/Foundation";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Zocial from "@expo/vector-icons/Zocial";
import type { ComponentProps, ComponentType } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

// ── Icon family registry ────────────────────────────────────────────────
const ICON_FAMILIES = {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  Fontisto,
  Foundation,
  Octicons,
  SimpleLineIcons,
  Zocial,
} as const;

export type IconFamily = keyof typeof ICON_FAMILIES;

// Union of every valid icon name across every supported family, keyed by family.
type IconNameFor<F extends IconFamily> = ComponentProps<
  (typeof ICON_FAMILIES)[F]
>["name"];

function isValidIconName<F extends IconFamily>(
  family: F,
  name: string,
): name is IconNameFor<F> {
  const Component = ICON_FAMILIES[family] as unknown as {
    glyphMap?: Record<string, unknown>;
  };
  return !!Component.glyphMap && name in Component.glyphMap;
}

interface Props<F extends IconFamily = "MaterialIcons"> {
  icon: string;
  color: string;
  family?: F;
  size?: number;
  withBackground?: boolean;
  style?: ViewStyle;
  /** Fallback icon name (in the same family) used when `icon` isn't a valid glyph. */
  fallbackIcon?: IconNameFor<F>;
}

export function CategoryIcon<F extends IconFamily = "MaterialIcons">({
  icon,
  color,
  family = "MaterialIcons" as F,
  size = 24,
  withBackground = false,
  style,
  fallbackIcon,
}: Props<F>) {
  const IconComponent = ICON_FAMILIES[family] as ComponentType<{
    name: string;
    size: number;
    color: string;
  }>;

  const resolvedName = isValidIconName(family, icon)
    ? icon
    : ((fallbackIcon as string | undefined) ?? DEFAULT_FALLBACK[family]);

  const glyph = <IconComponent name={resolvedName} size={size} color={color} />;

  if (withBackground) {
    const bgSize = size + 16;
    return (
      <View
        style={[
          styles.bg,
          {
            backgroundColor: color + "20",
            width: bgSize,
            height: bgSize,
            borderRadius: bgSize / 2,
          },
          style,
        ]}
      >
        {glyph}
      </View>
    );
  }

  return glyph;
}

// Per-family fallback glyph shown when a category's stored icon name doesn't
// exist in the chosen family (bad data, typo, or family mismatch).
const DEFAULT_FALLBACK: Record<IconFamily, string> = {
  MaterialIcons: "category",
  MaterialCommunityIcons: "shape-outline",
  Ionicons: "pricetag-outline",
  FontAwesome: "tag",
  FontAwesome5: "tag",
  FontAwesome6: "tag",
  AntDesign: "tago",
  Entypo: "tag",
  EvilIcons: "tag",
  Feather: "tag",
  Fontisto: "shopping-bag-1",
  Foundation: "price-tag",
  Octicons: "tag",
  SimpleLineIcons: "tag",
  Zocial: "guest",
};

const styles = StyleSheet.create({
  bg: { alignItems: "center", justifyContent: "center" },
});
