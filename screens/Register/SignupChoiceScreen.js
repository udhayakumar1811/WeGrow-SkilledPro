import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FONTS } from "../../constants/fonts";
import { useTheme } from "../../constants/ThemeContext"; // 👈 Fixed Path

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 28 : 44;

export default function SignupChoiceScreen() {
  const router = useRouter();
  const { isDarkMode, themeColors } = useTheme();

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
          <Ionicons name="arrow-back" size={24} color={themeColors.primary} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: themeColors.textPrimary }]}>
          Join WeGrow Campus 🚀
        </Text>
        <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
          Choose your account type to get started with offline training
          workshops.
        </Text>

        {/* Student Choice Card */}
        <TouchableOpacity
          style={[
            styles.choiceCard,
            {
              backgroundColor: themeColors.cardBg,
              borderColor: themeColors.border,
            },
          ]}
          onPress={() => router.push("/student-register")}
        >
          <View
            style={[
              styles.iconBox,
              { backgroundColor: themeColors.secondaryLight },
            ]}
          >
            <FontAwesome5
              name="user-graduate"
              size={24}
              color={themeColors.primary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[styles.cardTitle, { color: themeColors.textPrimary }]}
            >
              Student / Job Seeker
            </Text>
            <Text
              style={[styles.cardSub, { color: themeColors.textSecondary }]}
            >
              For college students and grads looking for practical coding, AI,
              and skill workshops.
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={themeColors.textSecondary}
          />
        </TouchableOpacity>

        {/* Business Choice Card */}
        <TouchableOpacity
          style={[
            styles.choiceCard,
            {
              backgroundColor: themeColors.cardBg,
              borderColor: themeColors.border,
            },
          ]}
          onPress={() => router.push("/business-register")}
        >
          <View
            style={[
              styles.iconBox,
              { backgroundColor: themeColors.secondaryLight },
            ]}
          >
            <FontAwesome5
              name="briefcase"
              size={24}
              color={themeColors.primary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[styles.cardTitle, { color: themeColors.textPrimary }]}
            >
              Business &amp; Entrepreneur
            </Text>
            <Text
              style={[styles.cardSub, { color: themeColors.textSecondary }]}
            >
              For startup founders, business owners, and professionals needing
              growth and strategy sessions.
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={themeColors.textSecondary}
          />
        </TouchableOpacity>

        {/* Login redirect */}
        <View style={styles.loginRow}>
          <Text style={[styles.loginSub, { color: themeColors.textSecondary }]}>
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={[styles.loginLink, { color: themeColors.primary }]}>
              Login
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    marginTop: 4,
    marginBottom: 24,
    lineHeight: 18,
  },
  choiceCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    gap: 16,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    lineHeight: 16,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginSub: {
    fontSize: 13,
    fontFamily: FONTS.regular,
  },
  loginLink: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
});
