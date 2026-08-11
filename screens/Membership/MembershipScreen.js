import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Alert,
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

export default function MembershipScreen() {
  const router = useRouter();
  const { isDarkMode, themeColors } = useTheme();

  const handleBuyPass = (passTitle, price) => {
    Alert.alert(
      "Monthly Offline Pass",
      `Proceed to purchase ${passTitle} for ₹${price}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Proceed to Pay",
          onPress: () =>
            router.push(
              `/payment?id=PASS_MONTHLY&amount=${price}&title=${encodeURIComponent(
                passTitle,
              )}`,
            ),
        },
      ],
    );
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
            Monthly Offline Pass
          </Text>
        </View>

        {/* Highlight Card */}
        <View style={styles.heroPassCard}>
          <View style={styles.passBadge}>
            <Text style={styles.passBadgeText}>UNLIMITED ACCESS</Text>
          </View>
          <Text style={styles.passCardTitle}>WeGrow Offline Pass</Text>
          <Text style={styles.passCardSub}>
            Attend all Student & Business Workshops in Madurai &amp; Sivakasi
            without paying every session!
          </Text>
          <Text style={styles.passPrice}>₹1,999 / month</Text>
        </View>

        {/* Benefits Section */}
        <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
          Pass Benefits
        </Text>
        <View
          style={[
            styles.benefitsList,
            {
              backgroundColor: themeColors.cardBg,
              borderColor: themeColors.border,
            },
          ]}
        >
          {[
            "Free Seat Reservation in all Workshops",
            "Priority Front Row Seating",
            "1-on-1 Mentorship & Career Guidance",
            "Verified Physical Completion Certificate",
            "Exclusive WhatsApp VIP Group Access",
          ].map((benefit, idx) => (
            <View key={idx} style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
              <Text
                style={[styles.benefitText, { color: themeColors.textPrimary }]}
              >
                {benefit}
              </Text>
            </View>
          ))}
        </View>

        {/* Purchase Pass Action */}
        <TouchableOpacity
          style={[styles.buyPassBtn, { backgroundColor: themeColors.primary }]}
          onPress={() => handleBuyPass("Monthly Offline Pass", "1999")}
        >
          <Text style={styles.buyPassText}>Get Monthly Pass (₹1,999)</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={{ height: 100 }} />
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
  heroPassCard: {
    backgroundColor: "#0F2C59",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  passBadge: {
    backgroundColor: "#F97316",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  passBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontFamily: FONTS.bold,
  },
  passCardTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: FONTS.bold,
  },
  passCardSub: {
    color: "#CBD5E1",
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginTop: 4,
    lineHeight: 18,
  },
  passPrice: {
    color: "#F97316",
    fontSize: 22,
    fontFamily: FONTS.bold,
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    marginBottom: 12,
  },
  benefitsList: {
    gap: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  benefitText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    flex: 1,
  },
  buyPassBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  buyPassText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
});
