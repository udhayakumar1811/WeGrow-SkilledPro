import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { getEventByIdAPI } from "../../services/workshop";

export default function WorkshopDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const res = await getEventByIdAPI(id);
      const data = res?.data || res?.event || res;
      setEventData(data);
    } catch (error) {
      console.log("Error loading event details:", error);
      Alert.alert("Error", "Unable to load workshop details.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/workshops");
    }
  };

  const handleProceedToPayment = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      Alert.alert(
        "Login Required 🔐",
        "Please login to book a seat for this workshop.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login Now", onPress: () => router.push("/login") },
        ],
      );
      return;
    }

    router.push(
      `/payment?id=${eventData._id || eventData.id}&amount=${eventData.price || 499}&title=${encodeURIComponent(
        eventData.title,
      )}`,
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!eventData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Workshop details not found.</Text>
        <TouchableOpacity
          style={styles.backBtnFallback}
          onPress={handleBackPress}
        >
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner Image */}
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri:
                eventData.image && eventData.image.startsWith("http")
                  ? eventData.image
                  : "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800",
            }}
            style={styles.bannerImg}
            contentFit="cover"
          />
          <TouchableOpacity
            style={styles.floatingBackBtn}
            onPress={handleBackPress}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>
              {eventData.type || "OFFLINE"}
            </Text>
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.body}>
          <Text style={styles.title}>{eventData.title}</Text>

          {/* Quick Meta Info */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons
                name="location-outline"
                size={16}
                color={COLORS.secondary}
              />
              <Text style={styles.metaText}>
                {eventData.location || "Madurai"}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={COLORS.secondary}
              />
              <Text style={styles.metaText}>
                {eventData.date
                  ? new Date(eventData.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Upcoming"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Description Section */}
          <Text style={styles.sectionHeader}>About This Workshop</Text>
          <Text style={styles.description}>
            {eventData.description ||
              "Join this intensive offline workshop to gain hands-on practical skills, real-time project experience, and guidance from industry experts."}
          </Text>

          {/* Key Highlights */}
          <Text style={[styles.sectionHeader, { marginTop: 20 }]}>
            Key Highlights
          </Text>
          <View style={styles.bulletList}>
            {[
              "100% Practical & Hands-on Coding Session",
              "Certificate of Completion issued by WeGrow",
              "Direct Q&A Session with Senior Industry Mentors",
              "Placement Assistance & Career Guidance",
            ].map((point, index) => (
              <View key={index} style={styles.bulletItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={COLORS.primary}
                />
                <Text style={styles.bulletText}>{point}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Bottom Checkout Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Seat Fee</Text>
          <Text style={styles.priceValue}>₹{eventData.price || 499}</Text>
        </View>

        <TouchableOpacity
          style={styles.proceedBtn}
          onPress={handleProceedToPayment}
        >
          <Text style={styles.proceedBtnText}>Proceed to Book Seat</Text>
          <Ionicons name="arrow-forward" size={16} color={COLORS.textWhite} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  backBtnFallback: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  backBtnText: {
    color: COLORS.textWhite,
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: 240,
  },
  bannerImg: {
    width: "100%",
    height: "100%",
  },
  floatingBackBtn: {
    position: "absolute",
    top: 45,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  typeBadge: {
    position: "absolute",
    bottom: 12,
    left: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  typeBadgeText: {
    color: COLORS.textWhite,
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  body: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 18,
  },
  sectionHeader: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  bulletList: {
    gap: 10,
    marginTop: 8,
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bulletText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    flex: 1,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.cardBg,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  priceValue: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  proceedBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  proceedBtnText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
});
