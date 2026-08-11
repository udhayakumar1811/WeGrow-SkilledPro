import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import {
  BackHandler,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNavbar from "../../components/common/BottomNavbar";
import { FONTS } from "../../constants/fonts";
import { useTheme } from "../../constants/ThemeContext"; // 👈 Fixed Path

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 28 : 44;

export default function SettingsScreen() {
  const router = useRouter();
  const { isDarkMode, themeColors, toggleTheme } = useTheme();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.back();
        return true;
      };
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => subscription.remove();
    }, []),
  );

  return (
    <View
      style={[styles.mainWrapper, { backgroundColor: themeColors.background }]}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent={true}
      />
      {/* Safe Area Spacer for Status Bar */}
      <View
        style={{
          height: STATUSBAR_HEIGHT,
          backgroundColor: themeColors.background,
        }}
      />

      <ScrollView
        style={[styles.container, { backgroundColor: themeColors.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.backBtn,
              {
                backgroundColor: themeColors.cardBg,
                borderColor: themeColors.border,
              },
            ]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color={themeColors.primary} />
          </TouchableOpacity>
          <Text
            style={[styles.headerTitle, { color: themeColors.textPrimary }]}
          >
            Settings
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Menu Group */}
        <View
          style={[
            styles.menuGroup,
            {
              backgroundColor: themeColors.cardBg,
              borderColor: themeColors.border,
            },
          ]}
        >
          {/* Account Info */}
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: themeColors.border }]}
            onPress={() => router.push("/account-info")}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color={themeColors.primary}
            />
            <Text style={[styles.menuText, { color: themeColors.textPrimary }]}>
              Account Information
            </Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={themeColors.textSecondary}
            />
          </TouchableOpacity>

          {/* Theme Toggle */}
          <View
            style={[styles.menuItem, { borderBottomColor: themeColors.border }]}
          >
            <Ionicons
              name={isDarkMode ? "moon" : "sunny"}
              size={20}
              color={themeColors.primary}
            />
            <Text style={[styles.menuText, { color: themeColors.textPrimary }]}>
              Dark Mode ({isDarkMode ? "On" : "Off"})
            </Text>
            <TouchableOpacity
              style={[
                styles.themeToggleBtn,
                {
                  backgroundColor: isDarkMode
                    ? themeColors.primary
                    : themeColors.border,
                },
              ]}
              onPress={toggleTheme}
            >
              <Text style={styles.themeToggleText}>
                {isDarkMode ? "Dark" : "Light"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Help & Support */}
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: themeColors.border }]}
            onPress={() => router.push("/help-support")}
          >
            <Ionicons
              name="help-circle-outline"
              size={20}
              color={themeColors.primary}
            />
            <Text style={[styles.menuText, { color: themeColors.textPrimary }]}>
              Help &amp; Support
            </Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={themeColors.textSecondary}
            />
          </TouchableOpacity>

          {/* Privacy Policy */}
          <TouchableOpacity
            style={styles.menuItemLast}
            onPress={() => router.push("/privacy-policy")}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={themeColors.primary}
            />
            <Text style={[styles.menuText, { color: themeColors.textPrimary }]}>
              Privacy Policy &amp; Terms
            </Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={themeColors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  menuGroup: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  menuItemLast: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  themeToggleBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  themeToggleText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontFamily: FONTS.bold,
  },
});
