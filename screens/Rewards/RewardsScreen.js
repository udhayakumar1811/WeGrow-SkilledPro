import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  BackHandler,
  Platform,
  ScrollView,
  Share,
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

export default function RewardsScreen() {
  const router = useRouter();
  const { isDarkMode, themeColors } = useTheme();

  const [referralCode] = useState("WEGROW2026");

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

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join WeGrow Skill Campus using my referral code *${referralCode}* and get exciting perks on your first offline workshop booking! Download the app now.`,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

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
          <Text
            style={[styles.headerTitle, { color: themeColors.textPrimary }]}
          >
            Rewards &amp; Referrals
          </Text>
        </View>

        {/* Hero Rewards Card */}
        <View style={styles.heroCard}>
          <Ionicons name="gift-outline" size={40} color="#FFFFFF" />
          <Text style={styles.heroTitle}>Invite Friends &amp; Earn</Text>
          <Text style={styles.heroSub}>
            Share your referral code with friends. When they book their first
            workshop, you both earn exciting rewards!
          </Text>

          <View
            style={[styles.codeBox, { backgroundColor: themeColors.cardBg }]}
          >
            <Text style={[styles.codeText, { color: themeColors.textPrimary }]}>
              {referralCode}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.shareBtn,
              { backgroundColor: themeColors.secondary },
            ]}
            onPress={handleShare}
          >
            <Ionicons name="share-social-outline" size={18} color="#FFFFFF" />
            <Text style={styles.shareBtnText}>Share Referral Code</Text>
          </TouchableOpacity>
        </View>

        {/* Perks Section */}
        <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
          Milestone Perks
        </Text>
        <View
          style={[
            styles.perksCard,
            {
              backgroundColor: themeColors.cardBg,
              borderColor: themeColors.border,
            },
          ]}
        >
          {[
            {
              title: "1 Successful Referral",
              reward: "₹100 Instant Cashback",
              done: true,
            },
            {
              title: "5 Successful Referrals",
              reward: "Free Workshop Pass",
              done: false,
            },
            {
              title: "10 Successful Referrals",
              reward: "Special VIP Badge & Merch",
              done: false,
            },
          ].map((perk, index) => (
            <View
              key={index}
              style={[
                styles.perkRow,
                index !== 2 && {
                  borderBottomWidth: 1,
                  borderBottomColor: themeColors.border,
                },
              ]}
            >
              <View style={styles.perkLeft}>
                <Ionicons
                  name={perk.done ? "checkmark-circle" : "ellipse-outline"}
                  size={20}
                  color={perk.done ? "#22C55E" : themeColors.textSecondary}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text
                    style={[
                      styles.perkTitle,
                      { color: themeColors.textPrimary },
                    ]}
                  >
                    {perk.title}
                  </Text>
                  <Text
                    style={[
                      styles.perkReward,
                      { color: themeColors.textSecondary },
                    ]}
                  >
                    {perk.reward}
                  </Text>
                </View>
              </View>
            </View>
          ))}
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
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
  },
  heroCard: {
    backgroundColor: "#0F2C59",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: FONTS.bold,
    marginTop: 10,
  },
  heroSub: {
    color: "#CBD5E1",
    fontSize: 12,
    fontFamily: FONTS.regular,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
    marginBottom: 16,
  },
  codeBox: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 14,
  },
  codeText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    letterSpacing: 2,
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    width: "100%",
  },
  shareBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    marginBottom: 12,
  },
  perksCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  perkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  perkLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  perkTitle: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  perkReward: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    marginTop: 2,
  },
});
