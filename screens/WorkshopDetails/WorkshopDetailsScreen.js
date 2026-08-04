import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";

export default function WorkshopDetailsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600",
            }}
            style={styles.image}
            contentFit="cover"
          />
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.textWhite} />
          </TouchableOpacity>
        </View>

        {/* Content Container */}
        <View style={styles.content}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>OFFLINE WORKSHOP</Text>
          </View>

          <Text style={styles.title}>Offline AI & MERN Stack Bootcamp</Text>

          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Ionicons
                name="calendar-outline"
                size={18}
                color={COLORS.primary}
              />
              <Text style={styles.infoText}>August 15, 2026 (Saturday)</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={18} color={COLORS.primary} />
              <Text style={styles.infoText}>
                10:00 AM - 04:00 PM (Full Day)
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons
                name="location-outline"
                size={18}
                color={COLORS.primary}
              />
              <Text style={styles.infoText}>
                Tech Hub Hall, KK Nagar, Madurai
              </Text>
            </View>
          </View>

          {/* Pricing Box */}
          <Text style={styles.sectionTitle}>Ticket Pricing</Text>
          <View style={styles.pricingContainer}>
            <View style={styles.priceCard}>
              <FontAwesome5
                name="user-graduate"
                size={20}
                color={COLORS.primary}
              />
              <Text style={styles.roleText}>Student Pass</Text>
              <Text style={styles.priceText}>₹499</Text>
            </View>
            <View style={styles.priceCard}>
              <FontAwesome5
                name="briefcase"
                size={20}
                color={COLORS.secondary}
              />
              <Text style={styles.roleText}>Business Pass</Text>
              <Text style={styles.priceText}>₹999</Text>
            </View>
          </View>

          {/* What You Will Learn */}
          <Text style={styles.sectionTitle}>What You Will Learn</Text>
          <Text style={styles.description}>
            • Hands-on React Native & Expo Mobile App Development{"\n"}•
            Integrating AI APIs into Fullstack MERN Applications{"\n"}• Live
            Project Building & Offline Networking with Industry Experts{"\n"}•
            Certificate of Participation & Free Learning Materials
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Booking Action Bar */}
      <View style={styles.footerBar}>
        <View>
          <Text style={styles.footerPriceLabel}>Starting From</Text>
          <Text style={styles.footerPriceVal}>₹499</Text>
        </View>
        <TouchableOpacity
          style={styles.confirmBookBtn}
          onPress={() => router.push("/membership")}
        >
          <Text style={styles.confirmBookText}>Confirm Seat Booking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 250,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  backBtn: {
    position: "absolute",
    top: 45,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 20,
  },
  badge: {
    backgroundColor: COLORS.secondaryLight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  badgeText: {
    color: COLORS.secondary,
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontFamily: FONTS.bold,
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    gap: 12,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginTop: 10,
    marginBottom: 12,
  },
  pricingContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  priceCard: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  roleText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  priceText: {
    color: COLORS.primary,
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontFamily: FONTS.regular,
    lineHeight: 22,
    marginBottom: 80,
  },
  footerBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.cardBg,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerPriceLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontFamily: FONTS.regular,
  },
  footerPriceVal: {
    color: COLORS.primary,
    fontSize: 20,
    fontFamily: FONTS.bold,
  },
  confirmBookBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  confirmBookText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
});
