import { makeStyles, useTheme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

type ReceiptUploadFieldProps = {
  label?: string;
  value?: string | null;
  onChange: (url: string | null) => void;
};

async function uploadToCloudinary(uri: string): Promise<string> {
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary env vars are missing");
  }

  const form = new FormData();
  form.append("file", {
    uri,
    type: "image/jpeg",
    name: `receipt-${Date.now()}.jpg`,
  } as unknown as Blob);
  form.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: form,
    },
  );

  const data = await res.json();
  if (!res.ok || !data?.secure_url) {
    throw new Error(data?.error?.message || "Cloudinary upload failed");
  }
  return data.secure_url as string;
}

export default function ReceiptUploadField({
  label = "UPLOAD RECEIPT",
  value,
  onChange,
}: ReceiptUploadFieldProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(value ?? null);

  useEffect(() => {
    setPreviewUri(value ?? null);
  }, [value]);

  const pickReceipt = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;

    const localUri = result.assets[0].uri;
    setPreviewUri(localUri);
    setIsUploading(true);
    try {
      const cloudUrl = await uploadToCloudinary(localUri);
      onChange(cloudUrl);
      setPreviewUri(cloudUrl);
    } catch {
      onChange(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: colors.text.primary }]}>
        {label}
      </Text>
      <Pressable
        onPress={pickReceipt}
        style={[
          styles.uploadArea,
          {
            borderColor: colors.primary.main,
            backgroundColor: colors.background.surfaceAlt,
          },
          previewUri && styles.uploadAreaWithImage,
        ]}
      >
        {previewUri ? (
          <>
            <Image
              source={{ uri: previewUri }}
              style={styles.receiptImage}
              resizeMode="cover"
            />
            <Pressable
              style={[
                styles.removeReceipt,
                { backgroundColor: colors.status.error.main },
              ]}
              onPress={(e) => {
                e.stopPropagation();
                setPreviewUri(null);
                onChange(null);
              }}
            >
              <MaterialIcons
                name="close"
                size={18}
                color={colors.primary.contrastText}
              />
            </Pressable>
          </>
        ) : (
          <>
            {isUploading ? (
              <ActivityIndicator size="small" color={colors.primary.main} />
            ) : (
              <MaterialIcons
                name="cloud-upload"
                size={40}
                color={colors.primary.main}
              />
            )}
            <Text style={[styles.uploadText, { color: colors.text.primary }]}>
              {isUploading ? "Uploading..." : "Tap to upload"}
            </Text>
            <Text style={[styles.uploadHint, { color: colors.text.secondary }]}>
              PNG, JPG up to 10MB
            </Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(({ colors, spacing, radius, typography }) => ({
  field: {
    marginBottom: spacing[4.5],
    marginTop: spacing[9.5],
  },
  fieldLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.Manrope.SemiBold,
    marginBottom: spacing[2],
  },
  uploadArea: {
    minHeight: 140,
    borderRadius: radius.md,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing[6],
    overflow: "hidden",
  },
  uploadAreaWithImage: {
    height: 160,
    padding: 0,
  },
  receiptImage: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  removeReceipt: {
    position: "absolute",
    top: spacing[2],
    right: spacing[2],
    width: 28,
    height: 28,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.Manrope.Medium,
    marginTop: spacing[2],
  },
  uploadHint: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.Manrope.Medium,
    marginTop: spacing[1],
  },
}));
