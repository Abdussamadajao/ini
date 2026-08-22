import { Header } from "@/components/shared";
import { authClient } from "@/lib/auth-client";
import { useColors } from "@/theme";
import type { User } from "@/types/index";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable } from "react-native";
// Import the Header component
import { useHomeHeaderStyles } from "./styles";
import { router } from "expo-router";

export function HomeHeader() {
  const colors = useColors();
  const styles = useHomeHeaderStyles();
  const { data, isPending } = authClient.useSession();

  const user = data?.user as unknown as User;
  const userName = user?.name ?? "";
  const avatarUrl = user?.avatarUrl ?? user?.image ?? "";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const title = `${getGreeting()}, $`;

  // Custom right content with search button and avatar
  const rightContent = (
    <>
      <Pressable style={styles.searchBtn}>
        <MaterialIcons name="search" size={24} color={colors.text.secondary} />
      </Pressable>
      <Pressable
        onPress={() => router.push("/notifications")}
        style={styles.searchBtn}
      >
        <MaterialIcons
          name="notifications"
          size={24}
          color={colors.text.secondary}
        />
      </Pressable>
    </>
  );

  return (
    <Header
      title={isPending ? "..." : `Hello, ${userName}` || "Guest"}
      desc=""
      avatar // We're handling avatar in rightContent
      showAddButton={false} // Hide the default add button
      rightContent={rightContent}
      rightContainerStyle={styles.headerRight}
    />
  );
}
