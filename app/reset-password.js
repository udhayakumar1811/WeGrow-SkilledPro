import { useLocalSearchParams, useRouter } from "expo-router";
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
import { resetPasswordAPI } from "../services/auth";

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 28 : 44;

export default function ResetPassword() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const token = params.token || "";
  const { isDarkMode, themeColors } = useTheme();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (!token) {
      Alert.alert("Error", "Reset token is missing or invalid.");
      return;
    }

    try {
      setLoading(true);
      const res = await resetPasswordAPI({
        token,
        newPassword,
        confirmPassword,
      });

      Alert.alert(
        "Success",
        res.message || "Password updated successfully. Please login.",
        [{ text: "OK", onPress: () => router.replace("/login") }],
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Failed to reset password. Token may have expired.",
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
      {/* Safe Area Spacer for Status Bar */}
      <View
        style={{
          height: STATUSBAR_HEIGHT,
          backgroundColor: themeColors.background,
        }}
      />

      <View
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>
            Reset Password
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            Enter your new password below.
          </Text>

          <Text style={[styles.label, { color: themeColors.textSecondary }]}>
            New Password
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
            placeholder="New Password"
            placeholderTextColor={themeColors.placeholder}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <Text style={[styles.label, { color: themeColors.textSecondary }]}>
            Confirm Password
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
            placeholder="Confirm New Password"
            placeholderTextColor={themeColors.placeholder}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: themeColors.primary }]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Reset Password</Text>
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
  content: {
    marginTop: 20,
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
    marginBottom: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
});
