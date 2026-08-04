import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";

export default function SignupChoiceScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Text style={styles.title}>Choose Your Profile</Text>
        <Text style={styles.subtitle}>
          Select your role to get personalized offline workshop recommendations
          and pricing.
        </Text>
      </View>

      {/* Role Option 1: Student */}
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => router.push("/student-register")}
      >
        <View style={[styles.iconWrapper, { backgroundColor: "#E0F2FE" }]}>
          <FontAwesome5 name="user-graduate" size={28} color={COLORS.primary} />
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>Student / Learner</Text>
          <Text style={styles.cardSub}>
            Book college skill workshops at special discounted student rates.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
      </TouchableOpacity>

      {/* Role Option 2: Business Professional */}
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => router.push("/business-register")}
      >
        <View style={[styles.iconWrapper, { backgroundColor: "#FFEDD5" }]}>
          <FontAwesome5 name="briefcase" size={26} color={COLORS.secondary} />
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>Business Professional</Text>
          <Text style={styles.cardSub}>
            Attain high-level strategy & growth workshops for entrepreneurs.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
      </TouchableOpacity>

      {/* Bottom Login Link */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.loginText}>Sign In</Text>
        </TouchableOpacity>
      </View>
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
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  headerContainer: {
    marginBottom: 30,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontFamily: FONTS.bold,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontFamily: FONTS.regular,
    marginTop: 8,
    lineHeight: 20,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  cardSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginTop: 4,
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: 30,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  loginText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
});
