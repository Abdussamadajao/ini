import { makeStyles, useColors } from "@/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useField } from "formik";
import React, { useCallback } from "react";
import {
  Alert,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

const DEFAULT_PICKER_OPTS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.85,
};

export type ImagePickerFieldProps = {
  value: string;
  onChange: (uri: string) => void;
  onBlur?: () => void;
  label?: string;
  hint?: string;
  error?: string;
  labelStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  dropAccessibilityLabel?: string;
  takePhotoLabel?: string;
  uploadLabel?: string;
  dropSize?: number;
  pickerOptions?: ImagePicker.ImagePickerOptions;
};

export function ImagePickerField({
  value,
  onChange,
  onBlur,
  label,
  hint,
  error,
  labelStyle,
  style,
  dropAccessibilityLabel = "Image",
  takePhotoLabel = "Take photo",
  uploadLabel = "Upload",
  dropSize = 128,
  pickerOptions = DEFAULT_PICKER_OPTS,
}: ImagePickerFieldProps) {
  const styles = useStyles();
  const colors = useColors();
  const dropRadius = dropSize / 2;
  const dropStyle = {
    width: dropSize,
    height: dropSize,
    borderRadius: dropRadius,
  };

  const pickCamera = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Camera access", "Allow camera access to take a photo.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync(pickerOptions);
    if (!result.canceled && result.assets[0]?.uri) {
      onChange(result.assets[0].uri);
      onBlur?.();
    }
  }, [onChange, onBlur, pickerOptions]);

  const pickLibrary = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Photos access",
        "Allow photo library access to upload an image.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync(pickerOptions);
    if (!result.canceled && result.assets[0]?.uri) {
      onChange(result.assets[0].uri);
      onBlur?.();
    }
  }, [onChange, onBlur, pickerOptions]);

  const openChooser = useCallback(() => {
    Alert.alert("Image", "Choose an option", [
      { text: "Cancel", style: "cancel" },
      { text: takePhotoLabel, onPress: pickCamera },
      { text: uploadLabel, onPress: pickLibrary },
    ]);
  }, [pickCamera, pickLibrary, takePhotoLabel, uploadLabel]);

  return (
    <View style={[styles.root, style]}>
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}

      <View style={styles.block}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={dropAccessibilityLabel}
          style={[styles.drop, dropStyle]}
          onPress={openChooser}
        >
          {value ? (
            <Image
              source={{ uri: value }}
              style={dropStyle}
              contentFit="cover"
            />
          ) : (
            <MaterialCommunityIcons
              name="camera-outline"
              size={40}
              color={colors.primary.main}
            />
          )}
        </Pressable>

        <View style={styles.actions}>
          <Pressable style={styles.outlineBtn} onPress={pickCamera}>
            <MaterialCommunityIcons
              name="camera-outline"
              size={18}
              color={colors.primary.main}
            />
            <Text style={styles.outlineBtnText}>{takePhotoLabel}</Text>
          </Pressable>
          <Pressable style={styles.outlineBtn} onPress={pickLibrary}>
            <MaterialCommunityIcons
              name="upload-outline"
              size={18}
              color={colors.primary.main}
            />
            <Text style={styles.outlineBtnText}>{uploadLabel}</Text>
          </Pressable>
        </View>

        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

type FormikImagePickerProps = Omit<
  ImagePickerFieldProps,
  "value" | "onChange" | "onBlur" | "error"
> & {
  name: string;
  validate?: (value: string) => string | undefined;
  showFormikError?: boolean;
  required?: boolean;
  error?: string;
};

export function FormikImagePicker({
  name,
  validate,
  showFormikError = true,
  required = false,
  error: errorOverride,
  ...rest
}: FormikImagePickerProps) {
  const [field, meta, helpers] = useField<string>({
    name,
    validate: (val: string) => {
      if (!required && !val?.trim()) return undefined;
      if (required && !val?.trim()) return "Required";
      return validate ? validate(val) : undefined;
    },
  });

  const error =
    errorOverride ?? (showFormikError && meta.touched ? meta.error : undefined);

  return (
    <ImagePickerField
      value={field.value ?? ""}
      onChange={(uri) => {
        helpers.setValue(uri, true);
        helpers.setTouched(true);
      }}
      onBlur={() => helpers.setTouched(true, true)}
      error={error}
      {...rest}
    />
  );
}

const useStyles = makeStyles(
  ({ colors, spacing, typography, radius, textMetrics }) => ({
    root: { gap: spacing[2] },
    label: {
      ...textMetrics("xs", "snug"),
      marginBottom: spacing[1],
      marginLeft: spacing[1],
      color: colors.text.secondary,
      letterSpacing: 0.8,
      textTransform: "capitalize",
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },
    block: {
      alignItems: "center",
      gap: spacing[4],
    },
    drop: {
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: colors.primary.main,
      backgroundColor: colors.background.surface,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    actions: {
      flexDirection: "row",
      gap: spacing[3],
      flexWrap: "wrap",
      justifyContent: "center",
    },
    outlineBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[2],
      paddingVertical: spacing[2],
      paddingHorizontal: spacing[4],
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.primary.main,
    },
    outlineBtnText: {
      ...textMetrics("xs", "snug"),
      letterSpacing: 0.6,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      textTransform: "capitalize",
      color: colors.primary.main,
    },
    hint: {
      ...textMetrics("xs", "snug"),
      letterSpacing: 0.6,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      textTransform: "capitalize",
      color: colors.text.muted,
      textAlign: "center",
    },
    errorText: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Medium,
      color: colors.status.error.main,
      marginTop: spacing[1],
      marginLeft: spacing[1],
    },
  }),
);
