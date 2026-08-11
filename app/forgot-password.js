import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FONTS } from "../constants/fonts";
import { useTheme } from "../constants/ThemeContext";
import { forgotPasswordAPI } from "../services/auth";

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 28 : 44;

export default function ForgotPassword() {
  const router = useRouter();
  const { isDarkMode, themeColors } = useTheme();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendLink = async () => {
    if (!email.trim()) {
      Alert.alert("Required", "Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPasswordAPI(email.trim());
      Alert.alert(
        "Success",
        res.message || "Password reset link has been sent to your email.",
        [{ text: "OK", onPress: () => router.back() }],
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Failed to send reset link. Please check your email.",
      );
    } finally {
      setLoading(false);
    }
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
      <View
        style={{
          height: STATUSBAR_HEIGHT,
          backgroundColor: themeColors.background,
        }}
      />

      <View
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        <TouchableOpacity
          style={[
            styles.backButton,
            {
              backgroundColor: themeColors.cardBg,
              borderColor: themeColors.border,
            },
          ]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color={themeColors.primary} />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>
            Forgot Password?
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            Enter your registered email address and we'll send you a password
            reset link.
          </Text>

          <Text style={[styles.label, { color: themeColors.textSecondary }]}>
            Email Address
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: themeColors.inputBg,
                borderColor: themeColors.border,
                color: themeColors.textPrimary,
              },
            ]}
            placeholder="example@domain.com"
            placeholderTextColor={themeColors.placeholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: themeColors.primary }]}
            onPress={handleSendLink}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  content: {
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    marginBottom: 24,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: FONTS.regular,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
});
