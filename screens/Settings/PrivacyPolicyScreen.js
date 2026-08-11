import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React from "react";
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
import { useTheme } from "../../constants/ThemeContext";

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 28 : 44;

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const { isDarkMode, themeColors } = useTheme();

  useFocusEffect(
    React.useCallback(() => {
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

      <View
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
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
            Privacy Policy
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: themeColors.cardBg,
                borderColor: themeColors.border,
              },
            ]}
          >
            <Text style={[styles.title, { color: themeColors.primary }]}>
              WeGrow Skill Campus Terms &amp; Privacy
            </Text>
            <Text style={[styles.sub, { color: themeColors.textSecondary }]}>
              Last Updated: August 2026
            </Text>

            <Text
              style={[
                styles.sectionHeading,
                { color: themeColors.textPrimary },
              ]}
            >
              1. Information Collection
            </Text>
            <Text
              style={[styles.bodyText, { color: themeColors.textSecondary }]}
            >
              We collect personal information such as Name, Email, Phone Number,
              and Academic/Business details only to register you for offline
              skill training workshops and issue completion certificates.
            </Text>

            <Text
              style={[
                styles.sectionHeading,
                { color: themeColors.textPrimary },
              ]}
            >
              2. Workshop Booking &amp; Payments
            </Text>
            <Text
              style={[styles.bodyText, { color: themeColors.textSecondary }]}
            >
              All workshop seat bookings and monthly pass subscriptions are
              processed securely. Your payment details are handled according to
              banking security standards.
            </Text>

            <Text
              style={[
                styles.sectionHeading,
                { color: themeColors.textPrimary },
              ]}
            >
              3. Data Security
            </Text>
            <Text
              style={[styles.bodyText, { color: themeColors.textSecondary }]}
            >
              We do not sell, rent, or share your personal information with
              third parties. Your data is strictly used for learning support,
              offline venue updates, and placement assistance.
            </Text>
          </View>
          <View style={{ height: 120 }} />
        </ScrollView>
      </View>

      {/* Bottom Navigation Bar */}
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
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  sub: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    marginTop: 2,
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    marginTop: 12,
    marginBottom: 6,
  },
  bodyText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    lineHeight: 20,
  },
});
