import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
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
import { useTheme } from "../../constants/ThemeContext"; // 👈 Fixed Path
import { registerStudentAPI } from "../../services/auth";

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 28 : 44;

export default function StudentRegisterScreen() {
  const router = useRouter();
  const { isDarkMode, themeColors } = useTheme();

  const [loading, setLoading] = useState(false);
  const [idCardImage, setIdCardImage] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    college: "",
    course: "",
    department: "",
    year: "",
    skills: "React, Node",
    city: "",
    state: "",
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
      setIdCardImage(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    if (
      !form.firstName ||
      !form.email ||
      !form.password ||
      !form.phone ||
      !form.college
    ) {
      Alert.alert(
        "Required Fields",
        "Please fill in all mandatory fields (*).",
      );
      return;
    }

    if (!idCardImage) {
      Alert.alert(
        "ID Verification Required",
        "Please upload your College ID Card Photo.",
      );
      return;
    }

    setLoading(true);
    try {
      const skillsArray = form.skills
        ? form.skills.split(",").map((s) => s.trim())
        : ["React", "Node"];

      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.phone,
        college: form.college,
        course: form.course || "B.E CSE",
        department: form.department || "CSE",
        year: form.year || "3rd Year",
        skills: skillsArray,
        idCardUrl: idCardImage,
        city: form.city || "Madurai",
        state: form.state || "Tamil Nadu",
      };

      const res = await registerStudentAPI(payload);

      if (res?.success) {
        const token = res.data?.accessToken;
        const user = res.data?.user;

        if (token) {
          await AsyncStorage.setItem("userToken", token);
        }
        if (user?.role) {
          await AsyncStorage.setItem("userRole", user.role);
        }

        Alert.alert("Success 🎉", res.message || "Registration Successful!", [
          { text: "Go to Home", onPress: () => router.replace("/home") },
        ]);
      } else {
        Alert.alert("Registration Failed", res?.message || "Error occurred.");
      }
    } catch (error) {
      console.log("Student Register Error:", error);
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
          Student Registration
        </Text>
        <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
          Enter your details &amp; upload ID to join offline workshops at
          student prices.
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
              placeholder="First Name"
              placeholderTextColor={themeColors.placeholder}
              value={form.firstName}
              onChangeText={(v) => handleChange("firstName", v)}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 6 }]}>
            <Text style={[styles.label, { color: themeColors.textSecondary }]}>
              Last Name
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
              placeholder="Last Name"
              placeholderTextColor={themeColors.placeholder}
              value={form.lastName}
              onChangeText={(v) => handleChange("lastName", v)}
            />
          </View>
        </View>

        {/* Email Address */}
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
            placeholder="10 Digit Mobile Number"
            placeholderTextColor={themeColors.placeholder}
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(v) => handleChange("phone", v)}
          />
        </View>

        {/* College Name */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: themeColors.textSecondary }]}>
            College / Institution *
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
            placeholder="e.g. Anna University"
            placeholderTextColor={themeColors.placeholder}
            value={form.college}
            onChangeText={(v) => handleChange("college", v)}
          />
        </View>

        {/* Course & Department */}
        <View style={styles.rowGroup}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 6 }]}>
            <Text style={[styles.label, { color: themeColors.textSecondary }]}>
              Course / Degree
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
              placeholder="e.g. B.E CSE"
              placeholderTextColor={themeColors.placeholder}
              value={form.course}
              onChangeText={(v) => handleChange("course", v)}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 6 }]}>
            <Text style={[styles.label, { color: themeColors.textSecondary }]}>
              Department
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
              placeholder="e.g. CSE"
              placeholderTextColor={themeColors.placeholder}
              value={form.department}
              onChangeText={(v) => handleChange("department", v)}
            />
          </View>
        </View>

        {/* Year & Skills */}
        <View style={styles.rowGroup}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 6 }]}>
            <Text style={[styles.label, { color: themeColors.textSecondary }]}>
              Academic Year
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
              placeholder="e.g. 3rd Year"
              placeholderTextColor={themeColors.placeholder}
              value={form.year}
              onChangeText={(v) => handleChange("year", v)}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 6 }]}>
            <Text style={[styles.label, { color: themeColors.textSecondary }]}>
              Skills (Comma Separated)
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
              placeholder="e.g. React, Node"
              placeholderTextColor={themeColors.placeholder}
              value={form.skills}
              onChangeText={(v) => handleChange("skills", v)}
            />
          </View>
        </View>

        {/* College ID Card Photo Upload */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: themeColors.textSecondary }]}>
            College ID Card / Hall Ticket Photo *
          </Text>
          <TouchableOpacity
            style={[
              styles.uploadBox,
              {
                backgroundColor: themeColors.inputBg,
                borderColor: themeColors.primary,
              },
            ]}
            onPress={pickImage}
          >
            {idCardImage ? (
              <Image
                source={{ uri: idCardImage }}
                style={styles.uploadedImage}
                contentFit="cover"
              />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Ionicons
                  name="cloud-upload-outline"
                  size={28}
                  color={themeColors.primary}
                />
                <Text
                  style={[styles.uploadText, { color: themeColors.primary }]}
                >
                  Tap to Upload College ID Photo
                </Text>
              </View>
            )}
          </TouchableOpacity>
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
              placeholder="Madurai"
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
            <Text style={styles.submitBtnText}>
              Register &amp; Submit for Verification
            </Text>
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
  uploadBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 12,
    height: 130,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  uploadPlaceholder: {
    alignItems: "center",
    gap: 6,
  },
  uploadText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
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
