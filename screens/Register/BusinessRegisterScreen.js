import { Ionicons } from "@expo/vector-icons";
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
import { registerBusinessAPI } from "../../services/auth";

export default function BusinessRegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [visitingCardImage, setVisitingCardImage] = useState(null);

  const [form, setForm] = useState({
    firstName: "Arun",
    lastName: "Kumar",
    email: "arun@gmail.com",
    password: "Password@123",
    phone: "9876543211",
    companyName: "Tech Solutions",
    gstNumber: "",
    businessType: "Software Development",
    designation: "Founder",
    experience: 5,
    website: "https://techsolutions.com",
    city: "Chennai",
    state: "Tamil Nadu",
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
      !form.companyName ||
      !form.businessType
    ) {
      Alert.alert(
        "Required Fields",
        "Please fill in all mandatory business fields.",
      );
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        visitingCardUrl: visitingCardImage,
      };

      await registerBusinessAPI(payload);

      Alert.alert("Success 🎉", "Business Registration Successful!", [
        { text: "Go to Home", onPress: () => router.replace("/home") },
      ]);
    } catch (error) {
      console.log("Registration Error:", error);
      Alert.alert(
        "Registration Failed",
        error?.message || "Server error. Try again.",
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

      <View style={styles.inputGroup}>
        <Text style={styles.label}>First Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor={COLORS.placeholder}
          value={form.firstName}
          onChangeText={(v) => handleChange("firstName", v)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Last Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor={COLORS.placeholder}
          value={form.lastName}
          onChangeText={(v) => handleChange("lastName", v)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Business Email *</Text>
        <TextInput
          style={styles.input}
          placeholder="Business Email"
          placeholderTextColor={COLORS.placeholder}
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(v) => handleChange("email", v)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password *</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={COLORS.placeholder}
          secureTextEntry
          value={form.password}
          onChangeText={(v) => handleChange("password", v)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor={COLORS.placeholder}
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(v) => handleChange("phone", v)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Company / Business Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Company Name"
          placeholderTextColor={COLORS.placeholder}
          value={form.companyName}
          onChangeText={(v) => handleChange("companyName", v)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          GSTIN / Udyam MSME Registration (Optional)
        </Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 33AAAAA0000A1Z5"
          placeholderTextColor={COLORS.placeholder}
          autoCapitalize="characters"
          value={form.gstNumber}
          onChangeText={(v) => handleChange("gstNumber", v)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Business Type / Industry *</Text>
        <TextInput
          style={styles.input}
          placeholder="Business Type"
          placeholderTextColor={COLORS.placeholder}
          value={form.businessType}
          onChangeText={(v) => handleChange("businessType", v)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Designation</Text>
        <TextInput
          style={styles.input}
          placeholder="Designation"
          placeholderTextColor={COLORS.placeholder}
          value={form.designation}
          onChangeText={(v) => handleChange("designation", v)}
        />
      </View>

      {/* Business Visiting Card Upload */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Business Visiting Card / ID Photo (Optional)
        </Text>
        <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
          {visitingCardImage ? (
            <Image
              source={{ uri: visitingCardImage }}
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
              <Text style={styles.uploadText}>Tap to Upload Visiting Card</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Website URL</Text>
        <TextInput
          style={styles.input}
          placeholder="Website"
          placeholderTextColor={COLORS.placeholder}
          autoCapitalize="none"
          value={form.website}
          onChangeText={(v) => handleChange("website", v)}
        />
      </View>

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
    height: 120,
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
