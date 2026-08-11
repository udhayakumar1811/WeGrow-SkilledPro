import { FontAwesome5, Ionicons } from "@expo/vector-icons";
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
import BottomNavbar from "../../components/common/BottomNavbar";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";

export default function RewardsScreen() {
  const router = useRouter();

  // Phone Hardware Back Button -> Go to Profile Screen
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.replace("/profile");
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
        {/* Header Back Arrow -> router.back() Goes to Previous Page */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Rewards</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.pointsCard}>
          <FontAwesome5 name="coins" size={36} color={COLORS.secondary} />
          <Text style={styles.pointsVal}>450</Text>
          <Text style={styles.pointsLabel}>WeGrow Reward Points</Text>
          <Text style={styles.subText}>
            Earn 100 points for every offline workshop attended!
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Available Vouchers</Text>

        <View style={styles.voucherCard}>
          <View style={styles.voucherHeader}>
            <Text style={styles.voucherTitle}>₹200 OFF Next Workshop</Text>
            <Text style={styles.voucherCode}>CODE: WEGROW200</Text>
          </View>
          <Text style={styles.voucherSub}>
            Applicable for both Student & Business Passes
          </Text>
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavbar />
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
  pointsCard: {
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    elevation: 2,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  pointsVal: {
    color: COLORS.primary,
    fontSize: 36,
    fontFamily: FONTS.bold,
    marginTop: 8,
  },
  pointsLabel: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginTop: 4,
  },
  subText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginTop: 6,
    textAlign: "center",
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginBottom: 12,
  },
  voucherCard: {
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  voucherHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  voucherTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  voucherCode: {
    color: COLORS.secondary,
    fontSize: 11,
    fontFamily: FONTS.bold,
  },
  voucherSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginTop: 6,
  },
});
