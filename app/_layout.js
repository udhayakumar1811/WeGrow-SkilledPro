import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import "react-native-reanimated";

import { ThemeProvider, useTheme } from "../constants/ThemeContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    // உங்கள் ஃபாண்ட் ஃபைல்கள் இங்கே இணைக்கப்பட்டுள்ளன
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  const { isDarkMode, themeColors } = useTheme();

  return (
    <NavigationThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
      <View
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: themeColors.background },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="home" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup-choice" />
          <Stack.Screen name="student-register" />
          <Stack.Screen name="business-register" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="workshops" />
          <Stack.Screen name="workshop-details" />
          <Stack.Screen name="my-bookings" />
          <Stack.Screen name="rewards" />
          <Stack.Screen name="members" />
          <Stack.Screen name="account-info" />
          <Stack.Screen name="help-support" />
          <Stack.Screen name="privacy-policy" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="search" />
          <Stack.Screen name="forgot-password" />
          <Stack.Screen name="reset-password" />
        </Stack>
      </View>
    </NavigationThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
