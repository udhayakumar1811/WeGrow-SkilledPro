import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import BottomNavbar from "../../components/common/BottomNavbar";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { getUserProfileAPI, logoutAPI } from "../../services/auth";

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getUserProfileAPI();
      const userData = res?.data || res?.user || res;
      setProfile(userData);
    } catch (error) {
      console.log("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logoutAPI();
          } catch (e) {
            console.log("Logout API error:", e);
          } finally {
            router.replace("/login");
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: 40 }}
          />
        ) : profile ? (
          <View>
            {/* User Card */}
            <View style={styles.profileCard}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={32} color={COLORS.primary} />
              </View>
              <Text style={styles.userName}>
                {profile.firstName} {profile.lastName || ""}
              </Text>
              <Text style={styles.userEmail}>{profile.email}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{profile.role || "STUDENT"}</Text>
              </View>
            </View>

            {/* Navigation Options */}
            <Text style={styles.sectionLabel}>ACCOUNT & BOOKINGS</Text>

            {/* My Bookings */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/my-bookings")}
            >
              <View style={styles.menuIconBox}>
                <Ionicons
                  name="ticket-outline"
                  size={20}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.menuText}>My Workshop Bookings</Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>

            {/* NEW: Rewards & Referrals */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/rewards")}
            >
              <View style={styles.menuIconBox}>
                <Ionicons
                  name="gift-outline"
                  size={20}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.menuText}>Rewards & Referrals</Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>

            {/* NEW: Community Members */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/members")}
            >
              <View style={styles.menuIconBox}>
                <Ionicons
                  name="people-outline"
                  size={20}
                  color={COLORS.primary}
                />
              </View>

              <Text style={styles.menuText}>WeGrow Community Members</Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/account-info")}
            >
              <View style={styles.menuIconBox}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.menuText}>Account Information</Text>
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
              <View style={styles.menuIconBox}>
                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.menuText}>Help & Support</Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.guestBox}>
            <Ionicons
              name="person-circle-outline"
              size={60}
              color={COLORS.placeholder}
            />
            <Text style={styles.guestTitle}>Guest Mode</Text>
            <Text style={styles.guestSub}>
              Log in to access your dashboard and bookings.
            </Text>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.loginBtnText}>Login / Register</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontFamily: FONTS.bold,
  },
  profileCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.secondaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  userName: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  userEmail: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontFamily: FONTS.regular,
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: COLORS.primary,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  roleText: {
    color: COLORS.textWhite,
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardBg,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  menuIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.secondaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 13,
    fontFamily: FONTS.medium,
    marginLeft: 12,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEE2E2",
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  logoutText: {
    color: "#EF4444",
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  guestBox: {
    alignItems: "center",
    paddingVertical: 40,
  },
  guestTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginTop: 10,
  },
  guestSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.regular,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 20,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  loginBtnText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
});
