import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React from "react";
import {
    BackHandler,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";

export default function PrivacyPolicyScreen() {
  const router = useRouter();

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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>WeGrow Skill Campus Terms & Privacy</Text>
          <Text style={styles.sub}>Last Updated: August 2026</Text>

          <Text style={styles.sectionHeading}>1. Information Collection</Text>
          <Text style={styles.bodyText}>
            We collect personal information such as Name, Email, Phone Number,
            and Academic/Business details only to register you for offline skill
            training workshops and issue completion certificates.
          </Text>

          <Text style={styles.sectionHeading}>
            2. Workshop Booking & Payments
          </Text>
          <Text style={styles.bodyText}>
            All workshop seat bookings and monthly pass subscriptions are
            processed securely. Your payment details are handled according to
            banking security standards.
          </Text>

          <Text style={styles.sectionHeading}>3. Data Security</Text>
          <Text style={styles.bodyText}>
            We do not sell, rent, or share your personal information with third
            parties. Your data is strictly used for learning support, offline
            venue updates, and placement assistance.
          </Text>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 50,
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
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
  },
  title: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  sub: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontFamily: FONTS.regular,
    marginTop: 2,
    marginBottom: 16,
  },
  sectionHeading: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontFamily: FONTS.bold,
    marginTop: 12,
    marginBottom: 6,
  },
  bodyText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.regular,
    lineHeight: 20,
  },
});
