import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNavbar from "../../components/common/BottomNavbar";
import { FONTS } from "../../constants/fonts";
import { useTheme } from "../../constants/ThemeContext"; // 👈 Fixed Path
import { getUserProfileAPI, logoutAPI } from "../../services/auth";
import { getNotificationsAPI } from "../../services/notification";

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 28 : 44;

export default function ProfileScreen() {
  const router = useRouter();
  const { isDarkMode, themeColors, toggleTheme } = useTheme();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Hardware Back Button Safe Handling
  useFocusEffect(
    useCallback(() => {
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

  const fetchProfileData = async () => {
    try {
      const [profileRes, notifRes] = await Promise.all([
        getUserProfileAPI().catch(() => null),
        getNotificationsAPI().catch(() => null),
      ]);

      const userData = profileRes?.data || profileRes?.user || profileRes;
      setProfile(userData);

      const notifications =
        notifRes?.data?.notifications || notifRes?.notifications || [];
      const unread = notifications.filter((n) => !n.isRead && !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.log("Error loading profile data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfileData();
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out of your account?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logoutAPI();
          } catch (e) {
            console.log("Logout API error:", e);
          }
          await AsyncStorage.clear();
          router.replace("/login");
        },
      },
    ]);
  };

  const isBusiness = profile?.role === "BUSINESS";

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
          <Text
            style={[styles.headerTitle, { color: themeColors.textPrimary }]}
          >
            My Profile &amp; Settings
          </Text>
          <TouchableOpacity
            style={[
              styles.iconBtn,
              {
                backgroundColor: themeColors.cardBg,
                borderColor: themeColors.border,
              },
            ]}
            onPress={() => router.push("/notification")}
          >
            <Ionicons
              name="notifications-outline"
              size={18}
              color={themeColors.textPrimary}
            />
            {unreadCount > 0 && <View style={styles.redDot} />}
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={themeColors.primary}
            style={{ marginVertical: 40 }}
          />
        ) : profile ? (
          <>
            {/* User Info Card */}
            <View
              style={[
                styles.profileCard,
                {
                  backgroundColor: themeColors.cardBg,
                  borderColor: themeColors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.avatarWrapper,
                  { backgroundColor: themeColors.secondaryLight },
                ]}
              >
                <FontAwesome5
                  name={isBusiness ? "briefcase" : "user-graduate"}
                  size={28}
                  color={themeColors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.profileName,
                    { color: themeColors.textPrimary },
                  ]}
                >
                  {profile.firstName} {profile.lastName || ""}
                </Text>
                <Text
                  style={[
                    styles.profileEmail,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  {profile.email || "No email provided"}
                </Text>
                <View style={styles.badgeRow}>
                  <View
                    style={[
                      styles.roleTag,
                      { backgroundColor: themeColors.secondaryLight },
                    ]}
                  >
                    <Text
                      style={[
                        styles.roleTagText,
                        { color: themeColors.primary },
                      ]}
                    >
                      {profile.role || "STUDENT"}
                    </Text>
                  </View>
                  <View style={styles.verifiedBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={12}
                      color="#22C55E"
                    />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Quick Actions / Menu Options */}
            <View
              style={[
                styles.menuGroup,
                {
                  backgroundColor: themeColors.cardBg,
                  borderColor: themeColors.border,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  { borderBottomColor: themeColors.border },
                ]}
                onPress={() => router.push("/account-info")}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={themeColors.primary}
                />
                <Text
                  style={[styles.menuText, { color: themeColors.textPrimary }]}
                >
                  Account Information
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={themeColors.textSecondary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.menuItem,
                  { borderBottomColor: themeColors.border },
                ]}
                onPress={() => router.push("/my-bookings")}
              >
                <Ionicons
                  name="ticket-outline"
                  size={20}
                  color={themeColors.primary}
                />
                <Text
                  style={[styles.menuText, { color: themeColors.textPrimary }]}
                >
                  My Workshop Bookings
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={themeColors.textSecondary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.menuItem,
                  { borderBottomColor: themeColors.border },
                ]}
                onPress={() => router.push("/pass")}
              >
                <Ionicons
                  name="ribbon-outline"
                  size={20}
                  color={themeColors.primary}
                />
                <Text
                  style={[styles.menuText, { color: themeColors.textPrimary }]}
                >
                  Monthly Offline Pass
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={themeColors.textSecondary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.menuItem,
                  { borderBottomColor: themeColors.border },
                ]}
                onPress={() => router.push("/rewards")}
              >
                <Ionicons
                  name="gift-outline"
                  size={20}
                  color={themeColors.primary}
                />
                <Text
                  style={[styles.menuText, { color: themeColors.textPrimary }]}
                >
                  Rewards &amp; Referrals
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={themeColors.textSecondary}
                />
              </TouchableOpacity>

              {/* Theme Toggle Option */}
              <View
                style={[
                  styles.menuItem,
                  { borderBottomColor: themeColors.border },
                ]}
              >
                <Ionicons
                  name={isDarkMode ? "moon" : "sunny"}
                  size={20}
                  color={themeColors.primary}
                />
                <Text
                  style={[styles.menuText, { color: themeColors.textPrimary }]}
                >
                  Dark Mode ({isDarkMode ? "On" : "Off"})
                </Text>
                <TouchableOpacity
                  style={[
                    styles.themeToggleBtn,
                    {
                      backgroundColor: isDarkMode
                        ? themeColors.primary
                        : themeColors.border,
                    },
                  ]}
                  onPress={toggleTheme}
                >
                  <Text style={styles.themeToggleText}>
                    {isDarkMode ? "Dark" : "Light"}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.menuItem,
                  { borderBottomColor: themeColors.border },
                ]}
                onPress={() => router.push("/help-support")}
              >
                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color={themeColors.primary}
                />
                <Text
                  style={[styles.menuText, { color: themeColors.textPrimary }]}
                >
                  Help &amp; Support
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={themeColors.textSecondary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItemLast}
                onPress={() => router.push("/privacy-policy")}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color={themeColors.primary}
                />
                <Text
                  style={[styles.menuText, { color: themeColors.textPrimary }]}
                >
                  Privacy Policy &amp; Terms
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={themeColors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color="#EF4444" />
              <Text style={styles.logoutText}>Logout Account</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View
            style={[
              styles.guestCard,
              {
                backgroundColor: themeColors.cardBg,
                borderColor: themeColors.border,
              },
            ]}
          >
            <Ionicons
              name="person-circle-outline"
              size={56}
              color={themeColors.placeholder}
            />
            <Text
              style={[styles.guestTitle, { color: themeColors.textPrimary }]}
            >
              You are not logged in
            </Text>
            <Text
              style={[styles.guestSub, { color: themeColors.textSecondary }]}
            >
              Login to access your workshop bookings, rewards, and offline pass.
            </Text>
            <TouchableOpacity
              style={[
                styles.loginNowBtn,
                { backgroundColor: themeColors.primary },
              ]}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.loginNowText}>Login Now</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Bottom Navigation Bar */}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  redDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
    gap: 14,
  },
  avatarWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  profileEmail: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  roleTag: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  roleTagText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#DCFCE7",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  verifiedText: {
    color: "#22C55E",
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  menuGroup: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  menuItemLast: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  themeToggleBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  themeToggleText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontFamily: FONTS.bold,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    paddingVertical: 14,
    borderRadius: 12,
  },
  logoutText: {
    color: "#EF4444",
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  guestCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    marginTop: 40,
  },
  guestTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginTop: 12,
  },
  guestSub: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  loginNowBtn: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  loginNowText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
});
