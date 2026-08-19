import { VARIANT_META, variantFromError } from "@/lib/error-utils";
import { makeStyles, useColors, useTheme } from "@/theme";
import { ErrorVariant } from "@/types/index";
import React from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ErrorStateProps {
  error?: unknown;
  variant?: ErrorVariant;
  title?: string;
  message?: string;
  retryLabel?: string;
  onRetry?: (() => void) | null;
  onSecondaryAction?: () => void;
  secondaryLabel?: string;
  refreshing?: boolean;
  style?: ViewStyle;
}

export interface InlineErrorProps {
  error?: unknown;
  variant?: ErrorVariant;
  title?: string;
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
  height?: number;
  style?: ViewStyle;
}

// ─── Full-screen ErrorState ───────────────────────────────────────────────────

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  variant,
  title,
  message,
  retryLabel = "Try again",
  onRetry,
  onSecondaryAction,
  secondaryLabel,
  refreshing = false,
  style,
}) => {
  const styles = useStyles();
  const resolvedVariant = variant ?? variantFromError(error);
  const meta = VARIANT_META[resolvedVariant];

  const displayTitle = title ?? meta.title;
  const displayMessage = message ?? meta.message;
  const showRetry = onRetry !== null && onRetry !== undefined;
  const showSecondary = !!onSecondaryAction && !!secondaryLabel;
  const colors = useColors();
  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          showRetry ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRetry!} />
          ) : undefined
        }
      >
        <View style={styles.container}>
          <View style={[styles.iconBadge, { backgroundColor: meta.bg }]}>
            <Text style={styles.emoji}>{meta.emoji}</Text>
          </View>

          <Text style={[styles.title, { color: colors.text.primary }]}>
            {displayTitle}
          </Text>
          <Text style={[styles.message, { color: colors.text.secondary }]}>
            {displayMessage}
          </Text>

          {(showRetry || showSecondary) && (
            <View style={styles.actions}>
              {showRetry && (
                <Pressable
                  style={[
                    styles.retryBtn,
                    { backgroundColor: colors.primary.main },
                  ]}
                  onPress={onRetry!}
                >
                  <Text
                    style={[
                      styles.retryText,
                      { color: colors.primary.contrastText },
                    ]}
                  >
                    {retryLabel}
                  </Text>
                </Pressable>
              )}
              {showSecondary && (
                <Pressable
                  style={[
                    styles.secondaryBtn,
                    { borderColor: colors.border.default },
                  ]}
                  onPress={onSecondaryAction}
                >
                  <Text
                    style={[
                      styles.secondaryText,
                      { color: colors.text.secondary },
                    ]}
                  >
                    {secondaryLabel}
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Inline / small ErrorState ────────────────────────────────────────────────

export const InlineError: React.FC<InlineErrorProps> = ({
  error,
  variant,
  title,
  message,
  retryLabel = "Retry",
  onRetry,
  height = 160,
  style,
}) => {
  const styles = useInlineStyles();
  const resolvedVariant = variant ?? variantFromError(error);
  const meta = VARIANT_META[resolvedVariant];

  const displayTitle = title ?? meta.title;
  const displayMessage = message ?? meta.message;
  const colors = useTheme();
  return (
    <View style={[styles.container, { height }, style]}>
      <View style={[styles.iconBadge, { backgroundColor: meta.bg }]}>
        <Text style={styles.emoji}>{meta.emoji}</Text>
      </View>

      <View style={styles.textBlock}>
        <Text style={[styles.title, { color: colors.colors.text.primary }]}>
          {displayTitle}
        </Text>
        <Text style={[styles.message, { color: colors.colors.text.secondary }]}>
          {displayMessage}
        </Text>
      </View>

      {onRetry && (
        <Pressable
          style={[
            styles.retryBtn,
            { backgroundColor: colors.colors.primary.main },
          ]}
          onPress={onRetry}
        >
          <Text
            style={[
              styles.retryText,
              { color: colors.colors.primary.contrastText },
            ]}
          >
            {retryLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const useStyles = makeStyles(({ colors, spacing, radius, typography }) => ({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.screen,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing[6],
    gap: spacing[3],
  },
  iconBadge: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing[2],
  },
  emoji: {
    fontSize: 32,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.Manrope.SemiBold,
    textAlign: "center",
  },
  message: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.Manrope.Regular,
    textAlign: "center",
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
    maxWidth: 280,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3],
    justifyContent: "center",
    marginTop: spacing[2],
  },
  retryBtn: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    borderRadius: radius.md,
  },
  retryText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.Manrope.SemiBold,
  },
  secondaryBtn: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    borderRadius: radius.md,
    borderWidth: 1,
  },
  secondaryText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.Manrope.Medium,
  },
}));

const useInlineStyles = makeStyles(
  ({ colors, spacing, radius, typography }) => ({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing[3],
      backgroundColor: colors.background.surfaceAlt,
      borderRadius: radius.md,
      paddingHorizontal: spacing[4],
    },
    iconBadge: {
      width: 36,
      height: 36,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    emoji: {
      fontSize: 18,
    },
    textBlock: {
      flex: 1,
      gap: spacing[1],
    },
    title: {
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },
    message: {
      fontSize: typography.fontSize.xs,
      fontFamily: typography.fontFamily.Manrope.Regular,
      lineHeight: typography.fontSize.xs * typography.lineHeight.normal,
    },
    retryBtn: {
      paddingVertical: spacing[1.5],
      paddingHorizontal: spacing[3],
      borderRadius: radius.sm,
      flexShrink: 0,
    },
    retryText: {
      fontSize: typography.fontSize.xs,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },
  }),
);

export default ErrorState;
