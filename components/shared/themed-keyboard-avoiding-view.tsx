import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  type KeyboardAvoidingViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  keyboardVerticalOffset?: number;
  /**
   * Overrides default (`padding` on iOS, none on Android).
   * Pass `null` to omit `behavior` (use with ScrollView + Android `softwareKeyboardLayoutMode: resize`).
   */
  behavior?: KeyboardAvoidingViewProps["behavior"] | null;
} & Omit<
  KeyboardAvoidingViewProps,
  "behavior" | "keyboardVerticalOffset" | "style" | "children"
>;

export function ThemedKeyboardAvoidingView({
  children,
  style,
  keyboardVerticalOffset = Platform.OS === "ios" ? 64 : 0,
  behavior: behaviorProp,
  enabled: enabledProp,
  ...rest
}: Props) {
  const [isKeyboardVisible, setIsKeyboardVisible] = React.useState(false);

  React.useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, () =>
      setIsKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener(hideEvent, () =>
      setIsKeyboardVisible(false),
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const behavior: KeyboardAvoidingViewProps["behavior"] | undefined =
    behaviorProp === null
      ? undefined
      : behaviorProp !== undefined
        ? behaviorProp
        : Platform.OS === "ios"
          ? "padding"
          : undefined;

  return (
    <KeyboardAvoidingView
      style={[styles.flex, style]}
      behavior={behavior}
      keyboardVerticalOffset={keyboardVerticalOffset}
      enabled={enabledProp ?? isKeyboardVisible}
      {...rest}
    >
      {children}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "transparent" },
});
