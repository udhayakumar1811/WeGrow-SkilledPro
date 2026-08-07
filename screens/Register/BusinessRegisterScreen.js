import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { registerBusinessAPI } from "../../services/auth";

export default function BusinessRegisterScreen() {
  const router = useRouter();
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
      </TouchableOpacity>

      <Text style={styles.title}>Business Professional Registration</Text>
      <Text style={styles.subtitle}>
        Register your business to access growth & strategy offline workshops.
      </Text>

      {/* First Name & Last Name */}
      <View style={styles.rowGroup}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 6 }]}>
          <Text style={styles.label}>First Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Arun"
            placeholderTextColor={COLORS.placeholder}
            value={form.firstName}
            onChangeText={(v) => handleChange("firstName", v)}
          />
        </View>

        <View style={[styles.inputGroup, { flex: 1, marginLeft: 6 }]}>
          <Text style={styles.label}>Last Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Kumar"
            placeholderTextColor={COLORS.placeholder}
            value={form.lastName}
            onChangeText={(v) => handleChange("lastName", v)}
          />
        </View>
      </View>

      {/* Email Address */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Business Email *</Text>
        <TextInput
          style={styles.input}
          placeholder="arun@gmail.com"
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
          placeholder="9876543211"
          placeholderTextColor={COLORS.placeholder}
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(v) => handleChange("phone", v)}
        />
      </View>

      {/* Company Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Company Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Tech Solutions"
          placeholderTextColor={COLORS.placeholder}
          value={form.companyName}
          onChangeText={(v) => handleChange("companyName", v)}
        />
      </View>

      {/* Business Type & Designation */}
      <View style={styles.rowGroup}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 6 }]}>
          <Text style={styles.label}>Business Type *</Text>
          <TextInput
            style={styles.input}
            placeholder="Software Development"
            placeholderTextColor={COLORS.placeholder}
            value={form.businessType}
            onChangeText={(v) => handleChange("businessType", v)}
          />
        </View>

        <View style={[styles.inputGroup, { flex: 1, marginLeft: 6 }]}>
          <Text style={styles.label}>Designation</Text>
          <TextInput
            style={styles.input}
            placeholder="Founder"
            placeholderTextColor={COLORS.placeholder}
            value={form.designation}
            onChangeText={(v) => handleChange("designation", v)}
          />
        </View>
      </View>

      {/* Experience & Website */}
      <View style={styles.rowGroup}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 6 }]}>
          <Text style={styles.label}>Experience (Years)</Text>
          <TextInput
            style={styles.input}
            placeholder="5"
            placeholderTextColor={COLORS.placeholder}
            keyboardType="numeric"
            value={form.experience}
            onChangeText={(v) => handleChange("experience", v)}
          />
        </View>

        <View style={[styles.inputGroup, { flex: 1, marginLeft: 6 }]}>
          <Text style={styles.label}>Website URL</Text>
          <TextInput
            style={styles.input}
            placeholder="https://..."
            placeholderTextColor={COLORS.placeholder}
            autoCapitalize="none"
            value={form.website}
            onChangeText={(v) => handleChange("website", v)}
          />
        </View>
      </View>

      {/* City & State */}
      <View style={styles.rowGroup}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 6 }]}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="Chennai"
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
          <Text style={styles.submitBtnText}>Register as Business Pro</Text>
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
