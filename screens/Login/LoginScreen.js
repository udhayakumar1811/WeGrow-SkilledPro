import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FONTS } from "../../constants/fonts";
import { useTheme } from "../../constants/ThemeContext";
import { loginAPI } from "../../services/auth";

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 28 : 44;

export default function LoginScreen() {
  const router = useRouter();
  const { isDarkMode, themeColors } = useTheme();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  // Safe Back Handler Fix
  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/home");
    }
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Required Fields", "Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      };

      const res = await loginAPI(payload);

      if (res?.success) {
        const token = res.data?.accessToken;
        const user = res.data?.user;

        if (token) {
          await AsyncStorage.setItem("userToken", token);
        }
        if (user?.role) {
          await AsyncStorage.setItem("userRole", user.role);
        }

        Alert.alert("Welcome Back! 🎉", res.message || "Login Successful", [
          { text: "Continue", onPress: () => router.replace("/home") },
        ]);
      } else {
        Alert.alert("Login Failed", res?.message || "Invalid credentials");
      }
    } catch (error) {
      console.log("Login Error:", error);
      Alert.alert(
        "Login Failed",
        error?.message || "Invalid email or password.",
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

      <ScrollView
        style={[styles.container, { backgroundColor: themeColors.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Safe Back Button */}
        <TouchableOpacity
          style={[
            styles.backBtn,
            {
              backgroundColor: themeColors.cardBg,
              borderColor: themeColors.border,
            },
          ]}
          onPress={handleBackPress}
        >
          <Ionicons name="arrow-back" size={24} color={themeColors.primary} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: themeColors.textPrimary }]}>
          Welcome Back 👋
        </Text>
        <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
          Sign in to your WeGrow account to continue.
        </Text>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: themeColors.textSecondary }]}>
            Email Address *
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
            placeholder="e.g. raj@gmail.com"
            placeholderTextColor={themeColors.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(v) => handleChange("email", v)}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: themeColors.textSecondary }]}>
            Password *
          </Text>
          <View
            style={[
              styles.passwordWrapper,
              {
                backgroundColor: themeColors.inputBg,
                borderColor: themeColors.border,
              },
            ]}
          >
            <TextInput
              style={[styles.passwordInput, { color: themeColors.textPrimary }]}
              placeholder="Enter password"
              placeholderTextColor={themeColors.placeholder}
              secureTextEntry={!showPassword}
              value={form.password}
              onChangeText={(v) => handleChange("password", v)}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={themeColors.placeholder}
              />
            </TouchableOpacity>
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => router.push("/forgot-password")}
          >
            <Text style={[styles.forgotText, { color: themeColors.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: themeColors.primary }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={themeColors.textWhite} />
          ) : (
            <Text style={styles.submitBtnText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Register Links */}
        <View style={styles.registerRow}>
          <Text
            style={[styles.registerText, { color: themeColors.textSecondary }]}
          >
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/signup-choice")}>
            <Text style={[styles.registerLink, { color: themeColors.primary }]}>
              Register
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    marginTop: 4,
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  eyeBtn: {
    padding: 6,
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  forgotText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  submitBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  registerText: {
    fontSize: 13,
    fontFamily: FONTS.regular,
  },
  registerLink: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
});
