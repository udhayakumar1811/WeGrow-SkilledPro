import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { getUserProfileAPI, logoutAPI } from "../../services/auth";
import { getMyBookingsAPI } from "../../services/workshop";

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

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

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const resProfile = await getUserProfileAPI();
      const userData = resProfile?.data || resProfile?.user || resProfile;
      setProfile(userData);

      // Fetch Bookings History
      const resBookings = await getMyBookingsAPI(1, 10);
      const bookingData =
        resBookings?.data || resBookings?.bookings || resBookings;
      if (Array.isArray(bookingData)) {
        setBookings(bookingData);
      }
    } catch (error) {
      console.log("Guest or Session Expired:", error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout from WeGrow Skill Campus?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logoutAPI();
            setProfile(null);
            router.replace("/login");
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const isStudent = profile?.role === "STUDENT";
  const isBusiness = profile?.role === "BUSINESS";

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={styles.container}>
        {/* 1. Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.replace("/home")}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dashboard Profile</Text>
          <TouchableOpacity
            onPress={loadDashboardData}
            style={styles.refreshBtn}
          >
            <Ionicons name="refresh-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 2. Main Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarWrapper}>
              <FontAwesome5
                name={
                  isStudent
                    ? "user-graduate"
                    : isBusiness
                      ? "briefcase"
                      : "user"
                }
                size={28}
                color={COLORS.primary}
              />
            </View>

            <Text style={styles.name}>
              {profile?.firstName
                ? `${profile.firstName} ${profile.lastName || ""}`
                : "Guest User"}
            </Text>

            <View
              style={[
                styles.roleBadge,
                !profile && { backgroundColor: "#F1F5F9" },
              ]}
            >
              <Text
                style={[
                  styles.roleTag,
                  !profile && { color: COLORS.textSecondary },
                ]}
              >
                {profile?.role ? `${profile.role} DASHBOARD` : "NOT LOGGED IN"}
              </Text>
            </View>

            {/* Sub details */}
            {isStudent && (
              <Text style={styles.subText}>
                {profile?.college || "College N/A"} •{" "}
                {profile?.course || "Degree N/A"}
              </Text>
            )}
            {isBusiness && (
              <Text style={styles.subText}>
                {profile?.companyName || "Company N/A"} •{" "}
                {profile?.designation || "Founder"}
              </Text>
            )}

            {/* Edit Profile Action if Logged In */}
            {profile && (
              <TouchableOpacity
                style={styles.editProfileBtn}
                onPress={() => router.push("/account-info")}
              >
                <Ionicons
                  name="create-outline"
                  size={14}
                  color={COLORS.primary}
                />
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 3. Guest Login Banner (If Not Logged In) */}
          {!profile && (
            <View style={styles.guestBanner}>
              <View style={{ flex: 1 }}>
                <Text style={styles.guestTitle}>Unlock Full Access!</Text>
                <Text style={styles.guestSub}>
                  Sign in to view your workshop certificates, booked seats, and
                  reward points.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.guestLoginBtn}
                onPress={() => router.push("/login")}
              >
                <Text style={styles.guestLoginText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 4. Dashboard Stats */}
          <Text style={styles.sectionTitle}>Dashboard Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>
                {profile ? bookings.length : 0}
              </Text>
              <Text style={styles.statLabel}>Workshops</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{profile ? "100" : "0"}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={styles.statBox}>
              <Text
                style={[
                  styles.statNumber,
                  { color: profile ? COLORS.success : COLORS.textSecondary },
                ]}
              >
                {profile ? "Active" : "Inactive"}
              </Text>
              <Text style={styles.statLabel}>Pass Status</Text>
            </View>
          </View>

          {/* 5. Role Specific Info Box */}
          {isStudent && (
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>Academic Information</Text>
              <Text style={styles.infoBoxText}>
                Department: {profile?.department || "N/A"}
              </Text>
              <Text style={styles.infoBoxText}>
                Year: {profile?.year || "N/A"}
              </Text>
              <Text style={styles.infoBoxText}>
                City: {profile?.city || "Madurai"}
              </Text>
            </View>
          )}

          {isBusiness && (
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>Business Information</Text>
              <Text style={styles.infoBoxText}>
                Industry: {profile?.businessType || "N/A"}
              </Text>
              <Text style={styles.infoBoxText}>
                Experience: {profile?.experience || 0} Years
              </Text>
              <Text style={styles.infoBoxText}>
                Website: {profile?.website || "N/A"}
              </Text>
            </View>
          )}

          {/* 6. Previous Workshop Activities */}
          <Text style={styles.sectionTitle}>Previous Workshop Activities</Text>
          {!profile || bookings.length === 0 ? (
            <View style={styles.noBookingBox}>
              <MaterialCommunityIcons
                name="calendar-blank"
                size={32}
                color={COLORS.placeholder}
              />
              <Text style={styles.noBookingText}>
                No previous workshop bookings found.
              </Text>
            </View>
          ) : (
            bookings.map((item, index) => (
              <View key={item._id || index} style={styles.bookingItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={COLORS.success}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.bookingTitle}>
                    {item.event?.title || "Offline Workshop Seat"}
                  </Text>
                  <Text style={styles.bookingSub}>
                    Status: {item.status || "CONFIRMED"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.certBtn}
                  onPress={() =>
                    Alert.alert("Certificate", "Downloading Certificate PDF...")
                  }
                >
                  <Ionicons
                    name="download-outline"
                    size={12}
                    color={COLORS.primary}
                  />
                  <Text style={styles.certBtnText}>Certificate</Text>
                </TouchableOpacity>
              </View>
            ))
          )}

          {/* 7. Account Options List */}
          <Text style={styles.sectionTitle}>Account Options</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/membership")}
          >
            <Ionicons name="card-outline" size={20} color={COLORS.primary} />
            <Text style={styles.menuText}>My Monthly Membership Pass</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/rewards")}
          >
            <Ionicons name="gift-outline" size={20} color={COLORS.primary} />
            <Text style={styles.menuText}>My Rewards & Vouchers</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/settings")}
          >
            <Ionicons
              name="settings-outline"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.menuText}>Settings & Preferences</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/help-support")}
          >
            <Ionicons
              name="help-buoy-outline"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.menuText}>Help & Campus Support</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>

          {profile ? (
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
              <Text style={[styles.menuText, { color: COLORS.error }]}>
                Logout Account
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/login")}
            >
              <Ionicons
                name="log-in-outline"
                size={20}
                color={COLORS.primary}
              />
              <Text style={[styles.menuText, { color: COLORS.primary }]}>
                Login / Register
              </Text>
            </TouchableOpacity>
          )}

          {/* 8. Professional App Version Branding */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>
              WeGrow Skill Campus • Version 1.0.4
            </Text>
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
  refreshBtn: {
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
  profileCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.secondaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  roleBadge: {
    backgroundColor: COLORS.secondaryLight,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: 4,
  },
  roleTag: {
    color: COLORS.primary,
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  subText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginTop: 6,
  },
  editProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editProfileText: {
    color: COLORS.primary,
    fontSize: 11,
    fontFamily: FONTS.bold,
  },
  guestBanner: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  guestTitle: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  guestSub: {
    color: COLORS.border,
    fontSize: 11,
    fontFamily: FONTS.regular,
    marginTop: 2,
  },
  guestLoginBtn: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: 10,
  },
  guestLoginText: {
    color: COLORS.textWhite,
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  statNumber: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  infoBox: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoBoxTitle: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: FONTS.bold,
    marginBottom: 8,
  },
  infoBoxText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginBottom: 4,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontFamily: FONTS.bold,
    marginBottom: 12,
  },
  noBookingBox: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  noBookingText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginTop: 8,
  },
  bookingItem: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bookingTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  bookingSub: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontFamily: FONTS.regular,
    marginTop: 2,
  },
  certBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.secondaryLight,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  certBtnText: {
    color: COLORS.primary,
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  menuItem: {
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  menuText: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 13,
    fontFamily: FONTS.medium,
    marginLeft: 14,
  },
  versionContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  versionText: {
    color: COLORS.placeholder,
    fontSize: 11,
    fontFamily: FONTS.regular,
  },
});
