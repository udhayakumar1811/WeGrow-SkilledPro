import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNavbar from "../components/common/BottomNavbar";
import { FONTS } from "../constants/fonts";
import { useTheme } from "../constants/ThemeContext";
import { cancelBookingAPI, getMyBookingsAPI } from "../services/booking";

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 28 : 44;

export default function MyBookingsScreen() {
  const router = useRouter();
  const { isDarkMode, themeColors } = useTheme();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const res = await getMyBookingsAPI(1, 10);
      const data =
        res?.data?.bookings || res?.bookings || res?.data || res || [];
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error fetching my bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMyBookings();
  };

  const handleCancelBooking = (bookingId) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this workshop seat booking?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelBookingAPI(bookingId);
              Alert.alert(
                "Cancelled",
                "Your booking has been cancelled successfully.",
              );
              fetchMyBookings();
            } catch (error) {
              Alert.alert(
                "Error",
                error?.message || "Failed to cancel booking.",
              );
            }
          },
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
      {/* Safe Area Status Bar Spacer */}
      <View
        style={{
          height: STATUSBAR_HEIGHT,
          backgroundColor: themeColors.background,
        }}
      />

      <ScrollView
        style={[styles.container, { backgroundColor: themeColors.background }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[themeColors.primary]}
          />
        }
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
            <Ionicons name="arrow-back" size={20} color={themeColors.primary} />
          </TouchableOpacity>
          <Text
            style={[styles.headerTitle, { color: themeColors.textPrimary }]}
          >
            My Workshop Seats
          </Text>
          <TouchableOpacity onPress={onRefresh}>
            <Ionicons name="refresh" size={20} color={themeColors.primary} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={themeColors.primary}
            style={{ marginTop: 40 }}
          />
        ) : bookings.length === 0 ? (
          <View style={styles.noDataBox}>
            <Ionicons
              name="ticket-outline"
              size={48}
              color={themeColors.placeholder}
            />
            <Text
              style={[styles.noDataTitle, { color: themeColors.textPrimary }]}
            >
              No Active Bookings
            </Text>
            <Text
              style={[styles.noDataSub, { color: themeColors.textSecondary }]}
            >
              You haven't reserved seats for any workshop yet.
            </Text>
            <TouchableOpacity
              style={[
                styles.exploreBtn,
                { backgroundColor: themeColors.primary },
              ]}
              onPress={() => router.push("/workshops")}
            >
              <Text style={styles.exploreBtnText}>Explore Workshops</Text>
            </TouchableOpacity>
          </View>
        ) : (
          bookings.map((item) => {
            const event = item.event || {};
            return (
              <View
                key={item._id || item.id}
                style={[
                  styles.bookingCard,
                  {
                    backgroundColor: themeColors.cardBg,
                    borderColor: themeColors.border,
                  },
                ]}
              >
                <View style={styles.statusRow}>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: isDarkMode ? "#064E3B" : "#DCFCE7",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: isDarkMode ? "#34D399" : "#16A34A" },
                      ]}
                    >
                      {item.status || "CONFIRMED"}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.bookingDate,
                      { color: themeColors.textSecondary },
                    ]}
                  >
                    Booked on:{" "}
                    {new Date(item.createdAt || Date.now()).toLocaleDateString(
                      "en-IN",
                    )}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.workshopTitle,
                    { color: themeColors.textPrimary },
                  ]}
                >
                  {event.title || "Offline Workshop"}
                </Text>
                <Text
                  style={[
                    styles.locationText,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  📍 {event.location || "Madurai Campus"}
                </Text>

                <View
                  style={[
                    styles.divider,
                    { backgroundColor: themeColors.border },
                  ]}
                />

                <View style={styles.cardFooter}>
                  <Text
                    style={[styles.priceVal, { color: themeColors.primary }]}
                  >
                    Paid: ₹{event.price || 499}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.cancelBtn,
                      {
                        backgroundColor: isDarkMode ? "#7F1D1D" : "#FEE2E2",
                      },
                    ]}
                    onPress={() => handleCancelBooking(item._id || item.id)}
                  >
                    <Text
                      style={[
                        styles.cancelBtnText,
                        { color: isDarkMode ? "#F87171" : "#EF4444" },
                      ]}
                    >
                      Cancel Seat
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}

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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingTop: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  bookingCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  bookingDate: {
    fontSize: 10,
    fontFamily: FONTS.medium,
  },
  workshopTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  locationText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginTop: 4,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceVal: {
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  cancelBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  cancelBtnText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
  },
  noDataBox: {
    paddingVertical: 50,
    alignItems: "center",
  },
  noDataTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginTop: 12,
  },
  noDataSub: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginTop: 4,
  },
  exploreBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  exploreBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
});
