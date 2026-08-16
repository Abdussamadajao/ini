import { Button } from "@/components/shared";
import { images, onboarding } from "@/constants";
import { makeStyles, useTheme } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

export default function Onboarding() {
  const router = useRouter();
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { colors } = useTheme();
  const styles = useStyles();
  const isLastSlide = activeIndex === onboarding.length - 1;

  const gotoNext = () => {
    if (!isLastSlide) {
      swiperRef.current?.scrollBy(1);
    } else {
      router.replace("/(auth)/login");
    }
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background.screen }]}
    >
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={<View style={styles.dotHidden} />}
        activeDot={<View style={styles.dotHidden} />}
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map(({ content, image, title }, idx) => (
          <View key={`${title}-${idx}`}>
            <View style={styles.headerContainer}>
              <View />
              <View style={styles.header}>
                <Image source={images.logo} style={styles.headerIconImage} />
                <Text
                  style={[styles.headerTitle, { color: colors.text.primary }]}
                >
                  Ini
                </Text>
              </View>
              <Button
                onPress={() => router.replace("/(auth)/login")}
                style={styles.skipBtn}
              >
                <Text
                  style={[styles.skipBtnText, { color: colors.primary.main }]}
                >
                  Skip
                </Text>
              </Button>
            </View>

            <View style={styles.container}>
              <View style={styles.imageOuterWrapper}>
                <View style={styles.imageWrapper}>
                  <Image source={image} style={styles.imageContainer} />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.2)"]}
                    style={styles.imageGradient}
                  />
                </View>
                <View
                  style={[
                    styles.imageBlob,
                    { backgroundColor: `${colors.primary.main}15` },
                  ]}
                />
              </View>
              <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text.primary }]}>
                  {title}
                </Text>
                <Text
                  style={[styles.description, { color: colors.text.secondary }]}
                >
                  {content}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </Swiper>
      <View style={styles.footer}>
        <View style={styles.footerDots}>
          {onboarding.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                { backgroundColor: colors.border.default },
                idx === activeIndex && [
                  styles.dotActive,
                  { backgroundColor: colors.primary.main },
                ],
              ]}
            />
          ))}
        </View>
        <Button onPress={gotoNext} style={styles.nextBtn}>
          <Text
            style={[styles.nextBtnText, { color: colors.primary.contrastText }]}
          >
            {isLastSlide ? "Get Started" : "Next"}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(({ colors, spacing, radius, typography }) => ({
  safe: { flex: 1 },
  dotHidden: { width: 0, height: 0 },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing[6],
    paddingTop: spacing[2],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  headerIconImage: {
    width: 32,
    height: 32,
  },
  headerTitle: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: "700",
    fontFamily: typography.fontFamily.Manrope.Bold,
  },
  skipBtn: {
    backgroundColor: "transparent",
    height: undefined,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
  },
  skipBtnText: {
    fontSize: typography.fontSize.sm,
    fontWeight: "600",
    fontFamily: typography.fontFamily.Manrope.SemiBold,
  },
  container: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[7.25],
  },
  imageOuterWrapper: {
    alignItems: "center",
    marginBottom: spacing[8],
  },
  imageWrapper: {
    width: 380,
    height: 370,
    borderRadius: radius.full,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageBlob: {
    position: "absolute",
    width: 379,
    height: 370,
    borderRadius: radius.full,
    top: 0,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    gap: 1,
  },
  title: {
    fontSize: typography.fontSize["4xl"],
    fontWeight: "700",
    marginBottom: spacing[3],
    fontFamily: typography.fontFamily.Manrope.Bold,
    textAlign: "center",
  },
  description: {
    fontSize: typography.fontSize.lg,
    lineHeight: 24,
    fontFamily: typography.fontFamily.Manrope.Regular,
    textAlign: "center",
    maxWidth: 300,
  },
  footer: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[8],
    gap: spacing[6],
  },
  footerDots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing[2],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
  },
  nextBtn: {
    height: 54,
    borderRadius: radius.full,
  },
  nextBtnText: {
    fontSize: typography.fontSize.md,
    fontWeight: "700",
    fontFamily: typography.fontFamily.Manrope.Bold,
  },
}));
