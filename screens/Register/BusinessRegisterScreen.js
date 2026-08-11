import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
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
import { registerBusinessAPI } from "../../services/auth";

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 28 : 44;

export default function BusinessRegisterScreen() {
  const router = useRouter();
  const { isDarkMode, themeColors } = useTheme();

  const [loading, setLoading] = useState(false);
  const [visitingCardImage, setVisitingCardImage] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    companyName: "",
    businessType: "",
    designation: "",
    experience: "5",
    website: "",
    city: "Chennai",
    state: "Tamil Nadu",
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setVisitingCardImage(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    if (
      !form.firstName ||
      !form.email ||
      !form.password ||
      !form.phone ||
      !form.companyName ||
      !form.businessType
    ) {
      Alert.alert(
        "Required Fields",
        "Please fill in all mandatory business fields (*).",
      );
      return;
    }

    setLoading(true);
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.phone,
        city: form.city,
        state: form.state,
        companyName: form.companyName,
        businessType: form.businessType,
        designation: form.designation || "Founder",
        experience: Number(form.experience) || 5,
        website: form.website || "https://techsolutions.com",
      };

      const res = await registerBusinessAPI(payload);

      if (res?.success) {
        const token = res.data?.accessToken;
        const user = res.data?.user;

        if (token) {
          await AsyncStorage.setItem("userToken", token);
        }
        if (user?.role) {
          await AsyncStorage.setItem("userRole", user.role);
        }

        Alert.alert(
          "Success 🎉",
          res.message || "Business Registration Successful!",
          [{ text: "Go to Home", onPress: () => router.replace("/home") }],
        );
      } else {
        Alert.alert("Registration Failed", res?.message || "Error occurred.");
      }
    } catch (error) {
      console.log("Business Register Error:", error);
      Alert.alert(
        "Registration Failed",
        error?.message || "Server Error. Please try again.",
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
          Business Professional Registration
        </Text>
        <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
          Register your business to access growth & strategy offline workshops.
        </Text>

        {/* First Name & Last Name */}
        <View style={styles.rowGroup}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 6 }]}>
            <Text style={[styles.label, { color: themeColors.textSecondary }]}>
              First Name *
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
              placeholder="Arun"
              placeholderTextColor={themeColors.placeholder}
              value={form.firstName}
              onChangeText={(v) => handleChange("firstName", v)}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 6 }]}>
            <Text style={[styles.label, { color: themeColors.textSecondary }]}>
              Last Name *
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
              placeholder="Kumar"
              placeholderTextColor={themeColors.placeholder}
              value={form.lastName}
              onChangeText={(v) => handleChange("lastName", v)}
            />
          </View>
        </View>

        {/* Email Address */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: themeColors.textSecondary }]}>
            Business Email *
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
            placeholder="arun@gmail.com"
            placeholderTextColor={themeColors.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(v) => handleChange("email", v)}
          />
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: themeColors.textSecondary }]}>
            Password *
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
            placeholder="Create Password"
            placeholderTextColor={themeColors.placeholder}
            secureTextEntry
            value={form.password}
            onChangeText={(v) => handleChange("password", v)}
          />
        </View>

        {/* Phone Number */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: themeColors.textSecondary }]}>
            Phone Number *
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
            placeholder="9876543211"
            placeholderTextColor={themeColors.placeholder}
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(v) => handleChange("phone", v)}
          />
        </View>

        {/* Company Name */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: themeColors.textSecondary }]}>
            Company Name *
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
            placeholder="Tech Solutions"
            placeholderTextColor={themeColors.placeholder}
            value={form.companyName}
            onChangeText={(v) => handleChange("companyName", v)}
          />
        </View>

        {/* Business Type & Designation */}
        <View style={styles.rowGroup}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 6 }]}>
            <Text style={[styles.label, { color: themeColors.textSecondary }]}>
              Business Type *
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
              placeholder="Software Development"
              placeholderTextColor={themeColors.placeholder}
              value={form.businessType}
              onChangeText={(v) => handleChange("businessType", v)}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 6 }]}>
            <Text style={[styles.label, { color: themeColors.textSecondary }]}>
              Designation
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
              placeholder="Founder"
              placeholderTextColor={themeColors.placeholder}
              value={form.designation}
              onChangeText={(v) => handleChange("designation", v)}
            />
          </View>
        </View>

        {/* Experience & Website */}
        <View style={styles.rowGroup}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 6 }]}>
            <Text style={[styles.label, { color: themeColors.textSecondary }]}>
              Experience (Years)
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
              placeholder="5"
              placeholderTextColor={themeColors.placeholder}
              keyboardType="numeric"
              value={form.experience}
              onChangeText={(v) => handleChange("experience", v)}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 6 }]}>
            <Text style={[styles.label, { color: themeColors.textSecondary }]}>
              Website URL
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
              placeholder="https://..."
              placeholderTextColor={themeColors.placeholder}
              autoCapitalize="none"
              value={form.website}
              onChangeText={(v) => handleChange("website", v)}
            />
          </View>
        </View>

        {/* City & State */}
        <View style={styles.rowGroup}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 6 }]}>
            <Text style={[styles.label, { color: themeColors.textSecondary }]}>
              City
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
              placeholder="Chennai"
              placeholderTextColor={themeColors.placeholder}
              value={form.city}
              onChangeText={(v) => handleChange("city", v)}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 6 }]}>
            <Text style={[styles.label, { color: themeColors.textSecondary }]}>
              State
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
              placeholder="Tamil Nadu"
              placeholderTextColor={themeColors.placeholder}
              value={form.state}
              onChangeText={(v) => handleChange("state", v)}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: themeColors.primary }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={themeColors.textWhite} />
          ) : (
            <Text style={styles.submitBtnText}>Register as Business Pro</Text>
          )}
        </TouchableOpacity>

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
    fontSize: 22,
    fontFamily: FONTS.bold,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    marginTop: 4,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  rowGroup: {
    flexDirection: "row",
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
});
