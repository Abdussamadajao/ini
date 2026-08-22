import { FormSwitch } from "@/components/shared/switch";
import { makeStyles, useTheme, textMetrics } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type IconName = keyof typeof MaterialIcons.glyphMap;

function RowDivider() {
  const styles = useStyles();
  return <View style={styles.divider} />;
}

function IconBadge({ icon, tint }: { icon: IconName; tint: string }) {
  const styles = useStyles();
  return (
    <View style={[styles.iconBadge, { backgroundColor: `${tint}14` }]}>
      <MaterialIcons name={icon} size={18} color={tint} />
    </View>
  );
}

export function SettingsChevronRow({
  icon,
  label,
  onPress,
  showDivider = true,
}: {
  icon: IconName;
  label: string;
  onPress?: () => void;
  showDivider?: boolean;
}) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
        accessibilityRole="button"
      >
        <IconBadge icon={icon} tint={colors.primary.main} />
        <Text style={[styles.rowLabel, { color: colors.text.primary }]}>
          {label}
        </Text>
        <MaterialIcons
          name="chevron-right"
          size={20}
          color={colors.text.muted}
        />
      </Pressable>
      {showDivider ? <RowDivider /> : null}
    </>
  );
}

export function SettingsValueRow({
  label,
  value,
  valueAccent,
  showDivider = true,
}: {
  label: string;
  value: string;
  valueAccent?: boolean;
  showDivider?: boolean;
}) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <>
      <View style={styles.row}>
        <Text style={[styles.rowLabel, { color: colors.text.primary }]}>
          {label}
        </Text>
        <Text
          style={[
            styles.valueText,
            {
              color: valueAccent ? colors.primary.main : colors.text.primary,
            },
          ]}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
      {showDivider ? <RowDivider /> : null}
    </>
  );
}

export function SettingsToggleRow({
  icon,
  label,
  value,
  onValueChange,
  showDivider = true,
}: {
  icon?: IconName;
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  showDivider?: boolean;
}) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <>
      <View style={styles.row}>
        {icon ? <IconBadge icon={icon} tint={colors.primary.main} /> : null}
        <Text style={[styles.rowLabel, { color: colors.text.primary }]}>
          {label}
        </Text>
        <FormSwitch
          value={value}
          onChange={onValueChange}
          trackColors={{
            on: colors.primary.main,
            off: colors.background.screen,
          }}
        />
      </View>
      {showDivider ? <RowDivider /> : null}
    </>
  );
}

export function SettingsThemeRow({
  icon = "palette",
  label,
  children,
  showDivider = true,
}: {
  icon?: IconName;
  label: string;
  children: React.ReactNode;
  showDivider?: boolean;
}) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <>
      <View style={[styles.row, styles.themeRow]}>
        <IconBadge icon={icon} tint={colors.primary.main} />
        <Text style={[styles.rowLabel, { color: colors.text.primary }]}>
          {label}
        </Text>
        {children}
      </View>
      {showDivider ? <RowDivider /> : null}
    </>
  );
}

export function SettingsAccentRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <View style={[styles.row, styles.accentRow]}>
      <Text
        style={[
          styles.rowLabel,
          { color: colors.text.primary, marginRight: 12 },
        ]}
      >
        {label}
      </Text>
      <View style={styles.accentDots}>{children}</View>
    </View>
  );
}

export function SettingsActionRow({
  icon,
  label,
  danger,
  onPress,
  showDivider = true,
}: {
  icon: IconName;
  label: string;
  danger?: boolean;
  onPress?: () => void;
  showDivider?: boolean;
}) {
  const { colors } = useTheme();
  const styles = useStyles();
  const tint = danger ? colors.status.error.main : colors.text.primary;
  const iconTint = danger ? colors.status.error.main : colors.primary.main;

  return (
    <>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
        accessibilityRole="button"
      >
        <IconBadge icon={icon} tint={iconTint} />
        <Text style={[styles.rowLabel, { color: tint }]}>{label}</Text>
        {danger ? (
          <MaterialIcons
            name="chevron-right"
            size={20}
            color={colors.status.error.main + "80"}
          />
        ) : null}
      </Pressable>
      {showDivider ? <RowDivider /> : null}
    </>
  );
}

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(
  ({ colors, spacing, radius, typography, textMetrics }) => ({
    row: {
      alignItems: "center",
      flexDirection: "row",
      gap: spacing[3],
      minHeight: 58,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2.5],
    },
    rowPressed: {
      backgroundColor: colors.background.screen,
    },
    iconBadge: {
      alignItems: "center",
      justifyContent: "center",
      width: 34,
      height: 34,
      borderRadius: radius.full,
    },
    themeRow: {
      justifyContent: "space-between",
    },
    accentRow: {
      alignItems: "center",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    rowLabel: {
      flex: 1,
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Inter.Medium,
    },
    valueText: {
      flexShrink: 1,
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Inter.Medium,
      marginLeft: spacing[2],
      textAlign: "right",
    },
    accentDots: {
      flexDirection: "row",
      gap: spacing[3],
    },
    divider: {
      height: 1,
      marginLeft: spacing[4] + 34 + spacing[3],
      backgroundColor: `${colors.border.default}33`,
    },
  }),
);
