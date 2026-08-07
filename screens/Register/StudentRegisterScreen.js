import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { registerStudentAPI } from "../../services/auth";

export default function StudentRegisterScreen() {
  const router = useRouter();
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
      // Skills split into Array
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
      </TouchableOpacity>

      <Text style={styles.title}>Student Registration</Text>
      <Text style={styles.subtitle}>
        Enter your details & upload ID to join offline workshops at student
        prices.
      </Text>

      {/* First Name & Last Name */}
      <View style={styles.rowGroup}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 6 }]}>
          <Text style={styles.label}>First Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor={COLORS.placeholder}
            value={form.firstName}
            onChangeText={(v) => handleChange("firstName", v)}
          />
        </View>

        <View style={[styles.inputGroup, { flex: 1, marginLeft: 6 }]}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor={COLORS.placeholder}
            value={form.lastName}
            onChangeText={(v) => handleChange("lastName", v)}
          />
        </View>
      </View>

      {/* Email Address */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. raj@gmail.com"
          placeholderTextColor={COLORS.placeholder}
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(v) => handleChange("email", v)}
        />
      </View>

      {/* Password */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password *</Text>
        <TextInput
          style={styles.input}
          placeholder="Create Password"
          placeholderTextColor={COLORS.placeholder}
          secureTextEntry
          value={form.password}
          onChangeText={(v) => handleChange("password", v)}
        />
      </View>

      {/* Phone Number */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="10 Digit Mobile Number"
          placeholderTextColor={COLORS.placeholder}
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(v) => handleChange("phone", v)}
        />
      </View>

      {/* College Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>College / Institution *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Anna University"
          placeholderTextColor={COLORS.placeholder}
          value={form.college}
          onChangeText={(v) => handleChange("college", v)}
        />
      </View>

      {/* Course & Department */}
      <View style={styles.rowGroup}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 6 }]}>
          <Text style={styles.label}>Course / Degree</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. B.E CSE"
            placeholderTextColor={COLORS.placeholder}
            value={form.course}
            onChangeText={(v) => handleChange("course", v)}
          />
        </View>

        <View style={[styles.inputGroup, { flex: 1, marginLeft: 6 }]}>
          <Text style={styles.label}>Department</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. CSE"
            placeholderTextColor={COLORS.placeholder}
            value={form.department}
            onChangeText={(v) => handleChange("department", v)}
          />
        </View>
      </View>

      {/* Year & Skills */}
      <View style={styles.rowGroup}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 6 }]}>
          <Text style={styles.label}>Academic Year</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 3rd Year"
            placeholderTextColor={COLORS.placeholder}
            value={form.year}
            onChangeText={(v) => handleChange("year", v)}
          />
        </View>

        <View style={[styles.inputGroup, { flex: 1, marginLeft: 6 }]}>
          <Text style={styles.label}>Skills (Comma Separated)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. React, Node"
            placeholderTextColor={COLORS.placeholder}
            value={form.skills}
            onChangeText={(v) => handleChange("skills", v)}
          />
        </View>
      </View>

      {/* College ID Card Photo Upload */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>College ID Card / Hall Ticket Photo *</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
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
                color={COLORS.primary}
              />
              <Text style={styles.uploadText}>
                Tap to Upload College ID Photo
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* City & State */}
      <View style={styles.rowGroup}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 6 }]}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="Madurai"
            placeholderTextColor={COLORS.placeholder}
            value={form.city}
            onChangeText={(v) => handleChange("city", v)}
          />
        </View>

        <View style={[styles.inputGroup, { flex: 1, marginLeft: 6 }]}>
          <Text style={styles.label}>State</Text>
          <TextInput
            style={styles.input}
            placeholder="Tamil Nadu"
            placeholderTextColor={COLORS.placeholder}
            value={form.state}
            onChangeText={(v) => handleChange("state", v)}
          />
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitBtn}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.textWhite} />
        ) : (
          <Text style={styles.submitBtnText}>
            Register & Submit for Verification
          </Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 60 }} />
    </ScrollView>
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
    marginBottom: 16,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontFamily: FONTS.bold,
  },
  subtitle: {
    color: COLORS.textSecondary,
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
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.textPrimary,
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  uploadBox: {
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.primary,
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
    color: COLORS.primary,
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  submitBtnText: {
    color: COLORS.textWhite,
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
});
