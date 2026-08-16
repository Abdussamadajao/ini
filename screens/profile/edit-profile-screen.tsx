import { FormikTextArea } from "@/components/form/text-area";
import { FormikTextfield } from "@/components/form/text-field";
import { Button } from "@/components/shared";
import { Avatar } from "@/components/shared/avatar";
import { useToast } from "@/components/toasts";
import { authClient } from "@/lib/auth-client";
import { makeStyles, typography, useTheme } from "@/theme";
import { User } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

type EditProfileValues = {
  fullName: string;
  email: string;
  phone: string;
  username: string;
  bio: string;
};

const schema = Yup.object({
  fullName: Yup.string().trim().required("Required"),
  email: Yup.string().trim().email("Invalid email").required("Required"),
  phone: Yup.string().trim(),
  username: Yup.string().trim().required("Required"),
  bio: Yup.string().trim(),
});

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
    name: `avatar-${Date.now()}.jpg`,
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

function getInitialValues(user?: User): EditProfileValues {
  return {
    fullName: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    username: user?.username ?? "",
    bio: user?.bio ?? "",
  };
}

function FormCard({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const { colors } = useTheme();
  const styles = useStyles();
  return (
    <View style={[styles.card, { backgroundColor: colors.background.surface }]}>
      {title ? (
        <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

export function EditProfileScreen() {
  const { colors } = useTheme();
  const styles = useStyles();
  const { toast } = useToast();
  const { data } = authClient.useSession();
  const user = data?.user as unknown as User;
  const avatarFromSession = user?.avatarUrl ?? user?.image ?? "";

  const [avatarUri, setAvatarUri] = useState(() => avatarFromSession);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    setAvatarUri(avatarFromSession);
  }, [avatarFromSession]);

  const initialValues = useMemo(() => getInitialValues(user), [user]);

  const fieldLabelStyle = useMemo(
    () => ({
      color: colors.status.success.main,
      fontFamily: typography.fontFamily.Inter.SemiBold,
      fontSize: typography.fontSize.sm,
      marginBottom: 8,
      marginLeft: 0,
    }),
    [colors.status.success.main],
  );

  const fieldContainerStyle = useMemo(
    () => ({
      backgroundColor: colors.background.surfaceAlt,
      borderColor: colors.border.default + "40",
      borderRadius: 8,
    }),
    [colors.background.surfaceAlt, colors.border.default],
  );

  const fieldInputStyle = useMemo(
    () => ({
      color: colors.text.primary,
      fontFamily: typography.fontFamily.Inter.Medium,
      fontSize: typography.fontSize.md,
    }),
    [colors.text.primary],
  );

  const pickPhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;

    const localUri = result.assets[0].uri;
    setAvatarUri(localUri);
    setIsUploadingAvatar(true);
    try {
      const cloudUrl = await uploadToCloudinary(localUri);
      setAvatarUri(cloudUrl);
    } finally {
      setIsUploadingAvatar(false);
    }
  }, []);

  const handleSave = useCallback(
    async (values: EditProfileValues) => {
      try {
        await authClient.updateUser({
          name: values.fullName,
          avatarUrl: avatarUri || undefined,
          bio: values.bio,
          phone: values.phone,
          username: values.username,
        });
        toast.success("Profile updated successfully");
        router.back();
      } catch (error) {
        console.error(error);
        toast.error("Failed to update profile");
      }
    },
    [avatarUri],
  );

  return (
    <Formik<EditProfileValues>
      initialValues={initialValues}
      validationSchema={schema}
      enableReinitialize
      onSubmit={handleSave}
    >
      {({ handleSubmit: submitForm }) => (
        <SafeAreaView
          edges={["top"]}
          style={[styles.safe, { backgroundColor: colors.background.screen }]}
        >
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              style={styles.headerSide}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <MaterialIcons
                name="arrow-back"
                size={24}
                color={colors.text.primary}
              />
            </Pressable>
            <View style={styles.headerCenter}>
              <Text
                style={[styles.headerTitle, { color: colors.primary.main }]}
              >
                Edit Profile
              </Text>
            </View>
            <View style={{ width: 44 }} />
          </View>

          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={0}
          >
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.avatarBlock}>
                <Avatar
                  uri={avatarUri}
                  name={user?.name}
                  size={118}
                  variant="circle"
                  borderColor={colors.primary.main}
                  onPress={pickPhoto}
                  style={[
                    styles.avatarRing,
                    { shadowColor: colors.primary.main },
                  ]}
                />
                {isUploadingAvatar ? (
                  <View style={styles.uploadingRow}>
                    <ActivityIndicator
                      size="small"
                      color={colors.primary.main}
                    />
                    <Text
                      style={[
                        styles.changePhoto,
                        { color: colors.primary.main },
                      ]}
                    >
                      Uploading...
                    </Text>
                  </View>
                ) : (
                  <Pressable onPress={pickPhoto} hitSlop={8}>
                    <Text
                      style={[
                        styles.changePhoto,
                        { color: colors.primary.main },
                      ]}
                    >
                      Change photo
                    </Text>
                  </Pressable>
                )}
              </View>

              <FormCard>
                <FormikTextfield
                  name="fullName"
                  label="Full name"
                  labelStyle={fieldLabelStyle}
                  containerStyle={fieldContainerStyle}
                  style={fieldInputStyle}
                  autoCapitalize="words"
                />
                <FormikTextfield
                  name="email"
                  label="Email address"
                  labelStyle={fieldLabelStyle}
                  containerStyle={fieldContainerStyle}
                  style={fieldInputStyle}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={false}
                />
                <FormikTextfield
                  name="phone"
                  label="Phone number"
                  labelStyle={fieldLabelStyle}
                  containerStyle={fieldContainerStyle}
                  style={fieldInputStyle}
                  keyboardType="phone-pad"
                  placeholder="081234567890"
                />
              </FormCard>

              <FormCard title="Account Identity">
                <FormikTextfield
                  name="username"
                  label="Username"
                  labelStyle={fieldLabelStyle}
                  containerStyle={fieldContainerStyle}
                  style={fieldInputStyle}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <FormikTextArea
                  name="bio"
                  label="Bio (optional)"
                  placeholder="Wealth Architect"
                  required={false}
                  labelStyle={fieldLabelStyle}
                  style={[
                    fieldInputStyle,
                    {
                      backgroundColor: colors.background.surfaceAlt,
                      borderColor: colors.border.default + "40",
                      borderRadius: 8,
                      borderWidth: 1,
                      minHeight: 96,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                    },
                  ]}
                />
              </FormCard>
            </ScrollView>

            <View
              style={[
                styles.footer,
                { backgroundColor: colors.background.screen },
              ]}
            >
              <Button style={styles.saveBtn} onPress={() => submitForm()}>
                <Text
                  style={[
                    styles.saveBtnText,
                    { color: colors.primary.contrastText },
                  ]}
                >
                  Save
                </Text>
                <MaterialIcons
                  name="arrow-forward"
                  size={22}
                  color={colors.primary.contrastText}
                />
              </Button>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      )}
    </Formik>
  );
}

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(({ colors, spacing, radius, typography }) => ({
  safe: { flex: 1 },
  flex: { flex: 1 },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 48,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[2],
  },
  headerSide: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 44,
    paddingVertical: spacing[2],
  },
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: typography.fontFamily.Manrope.Bold,
    fontSize: typography.fontSize.lg,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[8],
  },
  saveBtnText: {
    fontFamily: typography.fontFamily.Inter.SemiBold,
    fontSize: typography.fontSize.md,
  },
  scroll: { flexGrow: 1 },
  scrollContent: {
    paddingBottom: spacing[12],
    paddingHorizontal: spacing[4],
  },
  avatarBlock: {
    alignItems: "center",
    marginBottom: spacing[8],
    marginTop: spacing[2],
  },
  avatarRing: {
    borderRadius: radius.full,
    borderWidth: 3,
    elevation: 6,
    marginBottom: spacing[4],
    padding: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
  },
  uploadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  changePhoto: {
    fontFamily: typography.fontFamily.Inter.SemiBold,
    fontSize: typography.fontSize.xs,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  card: {
    borderRadius: radius.lg,
    marginBottom: spacing[5],
    padding: spacing[4],
  },
  cardTitle: {
    fontFamily: typography.fontFamily.Manrope.Bold,
    fontSize: typography.fontSize.md,
    marginBottom: spacing[4],
  },
}));
