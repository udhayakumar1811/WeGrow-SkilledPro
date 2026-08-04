import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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

export default function MembershipScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedTab] = useState("Student");

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.replace("/home");
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => subscription.remove();
    }, []),
  );

  const plans = {
    Student: {
      title: "Student Unlimited Pass",
      price: "₹999",
      period: "/ month",
      badge: "Save 60%",
      features: [
        "Unlimited Access to All Student Offline Workshops",
        "Free Learning Materials & Code Bundles",
        "Direct Mentorship with Industry Experts",
        "Verified Certificate of Completion",
      ],
    },
    Business: {
      title: "Business Growth Pass",
      price: "₹2,499",
      period: "/ month",
      badge: "PRO Access",
      features: [
        "Access to Strategy, GST & Marketing Workshops",
        "1-on-1 Business Growth Consultation",
        "Exclusive VIP Networking Dinner Entry",
        "Custom Business Growth Kit & Certificate",
      ],
    },
  };

  const currentPlan = plans[selectedPlan];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.replace("/home")}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Monthly Pass</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.banner}>
            <MaterialCommunityIcons
              name="crown"
              size={48}
              color={COLORS.secondary}
            />
            <Text style={styles.bannerTitle}>Unlock Unlimited Learning</Text>
            <Text style={styles.bannerSub}>
              Subscribe monthly & attend all offline workshops for free in
              Madurai.
            </Text>
          </View>

          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                selectedPlan === "Student" && styles.activeToggleBtn,
              ]}
              onPress={() => setSelectedTab("Student")}
            >
              <FontAwesome5
                name="user-graduate"
                size={14}
                color={
                  selectedPlan === "Student"
                    ? COLORS.textWhite
                    : COLORS.textSecondary
                }
              />
              <Text
                style={[
                  styles.toggleText,
                  selectedPlan === "Student" && styles.activeToggleText,
                ]}
              >
                Student Pass
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleBtn,
                selectedPlan === "Business" && styles.activeToggleBtn,
              ]}
              onPress={() => setSelectedTab("Business")}
            >
              <FontAwesome5
                name="briefcase"
                size={14}
                color={
                  selectedPlan === "Business"
                    ? COLORS.textWhite
                    : COLORS.textSecondary
                }
              />
              <Text
                style={[
                  styles.toggleText,
                  selectedPlan === "Business" && styles.activeToggleText,
                ]}
              >
                Business Pass
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.planCard}>
            <View style={styles.badgeTag}>
              <Text style={styles.badgeText}>{currentPlan.badge}</Text>
            </View>

            <Text style={styles.planTitle}>{currentPlan.title}</Text>

            <View style={styles.priceRow}>
              <Text style={styles.price}>{currentPlan.price}</Text>
              <Text style={styles.period}>{currentPlan.period}</Text>
            </View>

            <View style={styles.divider} />

            {currentPlan.features.map((feature, idx) => (
              <View key={idx} style={styles.featureRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={COLORS.secondary}
                />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}

            <TouchableOpacity
              style={styles.subscribeBtn}
              onPress={() =>
                Alert.alert(
                  "Payment",
                  `Initiating Payment for ${currentPlan.title}`,
                )
              }
            >
              <Text style={styles.subscribeBtnText}>Subscribe Now</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>

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
  banner: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  bannerTitle: {
    color: COLORS.textWhite,
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginTop: 8,
  },
  bannerSub: {
    color: COLORS.border,
    fontSize: 12,
    fontFamily: FONTS.regular,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 4,
    marginBottom: 20,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  activeToggleBtn: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  activeToggleText: {
    color: COLORS.textWhite,
    fontFamily: FONTS.bold,
  },
  planCard: {
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    position: "relative",
    marginBottom: 20,
    elevation: 2,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  badgeTag: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: COLORS.secondaryLight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  badgeText: {
    color: COLORS.secondary,
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  planTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginTop: 10,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 8,
  },
  price: {
    color: COLORS.primary,
    fontSize: 32,
    fontFamily: FONTS.bold,
  },
  period: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: FONTS.regular,
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  featureText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontFamily: FONTS.medium,
    flex: 1,
  },
  subscribeBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  subscribeBtnText: {
    color: COLORS.textWhite,
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
});
