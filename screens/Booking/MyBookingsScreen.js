import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import BottomNavbar from "../../components/common/BottomNavbar";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { cancelBookingAPI, getMyBookingsAPI } from "../../services/booking";

export default function MyBookingsScreen() {
  const router = useRouter();
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
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Workshop Seats</Text>
          <TouchableOpacity onPress={onRefresh}>
            <Ionicons name="refresh" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: 40 }}
          />
        ) : bookings.length === 0 ? (
          <View style={styles.noDataBox}>
            <Ionicons
              name="ticket-outline"
              size={48}
              color={COLORS.placeholder}
            />
            <Text style={styles.noDataTitle}>No Active Bookings</Text>
            <Text style={styles.noDataSub}>
              You haven't reserved seats for any workshop yet.
            </Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => router.push("/workshops")}
            >
              <Text style={styles.exploreBtnText}>Explore Workshops</Text>
            </TouchableOpacity>
          </View>
        ) : (
          bookings.map((item) => {
            const event = item.event || {};
            return (
              <View key={item._id || item.id} style={styles.bookingCard}>
                <View style={styles.statusRow}>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>
                      {item.status || "CONFIRMED"}
                    </Text>
                  </View>
                  <Text style={styles.bookingDate}>
                    Booked on:{" "}
                    {new Date(item.createdAt || Date.now()).toLocaleDateString(
                      "en-IN",
                    )}
                  </Text>
                </View>

                <Text style={styles.workshopTitle}>
                  {event.title || "Offline Workshop"}
                </Text>
                <Text style={styles.locationText}>
                  📍 {event.location || "Madurai Campus"}
                </Text>

                <View style={styles.divider} />

                <View style={styles.cardFooter}>
                  <Text style={styles.priceVal}>
                    Paid: ₹{event.price || 499}
                  </Text>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => handleCancelBooking(item._id || item.id)}
                  >
                    <Text style={styles.cancelBtnText}>Cancel Seat</Text>
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  bookingCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statusBadge: {
    backgroundColor: "#DCFCE7",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusText: {
    color: "#16A34A",
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  bookingDate: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  workshopTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  locationText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
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
    color: COLORS.primary,
  },
  cancelBtn: {
    backgroundColor: "#FEE2E2",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  cancelBtnText: {
    color: "#EF4444",
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
    color: COLORS.textPrimary,
    marginTop: 12,
  },
  noDataSub: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  exploreBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  exploreBtnText: {
    color: COLORS.textWhite,
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
});
