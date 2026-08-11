import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNavbar from "../../components/common/BottomNavbar";
import { FONTS } from "../../constants/fonts";
import { useTheme } from "../../constants/ThemeContext";
import { API } from "../../services/api";

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 28 : 44;

export default function HelpSupportScreen() {
  const router = useRouter();
  const { isDarkMode, themeColors } = useTheme();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    queryAbout: ["COURSE"],
    query: "",
  });

  const [submitting, setSubmitting] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.back();
        return true;
      };
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => subscription.remove();
    }, []),
  );

  const openUrl = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(url);
      }
    } catch (err) {
      console.log("Error opening link:", err);
    }
  };

  const toggleQueryAbout = (type) => {
    let updated = [...formData.queryAbout];
    if (updated.includes(type)) {
      if (updated.length > 1) {
        updated = updated.filter((item) => item !== type);
      }
    } else {
      updated.push(type);
    }
    setFormData({ ...formData, queryAbout: updated });
  };

  const handleFormSubmit = async () => {
    if (!formData.fullName || !formData.mobileNumber || !formData.query) {
      Alert.alert(
        "Required Fields",
        "Please fill in your Name, Mobile Number, and Query.",
      );
      return;
    }

    setSubmitting(true);
    try {
      const response = await API.post("/contact", {
        fullName: formData.fullName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        queryAbout: formData.queryAbout,
        query: formData.query,
      });

      Alert.alert(
        "Query Sent! 📩",
        response?.data?.message ||
          "Our WeGrow team will get back to you within 24 hours.",
      );
      handleReset();
    } catch (error) {
      console.log("Contact submission error:", error);
      Alert.alert(
        "Submission Failed",
        error?.response?.data?.message ||
          "Failed to send your query. Please try again later.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      email: "",
      mobileNumber: "",
      queryAbout: ["COURSE"],
      query: "",
    });
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
        {/* Header */}
        <View style={styles.header}>
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
            <Ionicons name="arrow-back" size={22} color={themeColors.primary} />
          </TouchableOpacity>
          <Text
            style={[styles.headerTitle, { color: themeColors.textPrimary }]}
          >
            Help & Support
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Send Us a Direct Message */}
          <View
            style={[
              styles.directMessageCard,
              {
                backgroundColor: themeColors.cardBg,
                borderColor: themeColors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.directMessageTitle,
                { color: themeColors.textPrimary },
              ]}
            >
              Send Us a Direct Message
            </Text>

            <View style={styles.inputRow}>
              <View style={styles.flexInputWrapper}>
                <Text
                  style={[styles.label, { color: themeColors.textSecondary }]}
                >
                  Your Full Name *
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
                  placeholder="Enter your name"
                  placeholderTextColor={themeColors.placeholder}
                  value={formData.fullName}
                  onChangeText={(text) =>
                    setFormData({ ...formData, fullName: text })
                  }
                />
              </View>
              <View style={styles.flexInputWrapper}>
                <Text
                  style={[styles.label, { color: themeColors.textSecondary }]}
                >
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
                  placeholder="Enter your email"
                  placeholderTextColor={themeColors.placeholder}
                  keyboardType="email-address"
                  value={formData.email}
                  onChangeText={(text) =>
                    setFormData({ ...formData, email: text })
                  }
                />
              </View>
            </View>

            <View style={styles.singleInputWrapper}>
              <Text
                style={[styles.label, { color: themeColors.textSecondary }]}
              >
                Your Mobile Number *
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
                placeholder="9876543210"
                placeholderTextColor={themeColors.placeholder}
                keyboardType="phone-pad"
                value={formData.mobileNumber}
                onChangeText={(text) =>
                  setFormData({ ...formData, mobileNumber: text })
                }
              />
            </View>

            <Text style={[styles.label, { color: themeColors.textSecondary }]}>
              Query About:
            </Text>
            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={styles.checkboxItem}
                onPress={() => toggleQueryAbout("BUSINESS")}
              >
                <Ionicons
                  name={
                    formData.queryAbout.includes("BUSINESS")
                      ? "checkbox"
                      : "square-outline"
                  }
                  size={20}
                  color={themeColors.primary}
                />
                <Text
                  style={[
                    styles.checkboxLabel,
                    { color: themeColors.textPrimary },
                  ]}
                >
                  Business
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxItem}
                onPress={() => toggleQueryAbout("COURSE")}
              >
                <Ionicons
                  name={
                    formData.queryAbout.includes("COURSE")
                      ? "checkbox"
                      : "square-outline"
                  }
                  size={20}
                  color={themeColors.primary}
                />
                <Text
                  style={[
                    styles.checkboxLabel,
                    { color: themeColors.textPrimary },
                  ]}
                >
                  Course
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.singleInputWrapper}>
              <Text
                style={[styles.label, { color: themeColors.textSecondary }]}
              >
                How can we help you? *
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: themeColors.inputBg,
                    borderColor: themeColors.border,
                    color: themeColors.textPrimary,
                  },
                ]}
                placeholder="Type your query regarding bootcamps, workshops, or career guidance..."
                placeholderTextColor={themeColors.placeholder}
                multiline
                value={formData.query}
                onChangeText={(text) =>
                  setFormData({ ...formData, query: text })
                }
              />
            </View>

            <TouchableOpacity
              style={[
                styles.submitQueryBtn,
                { backgroundColor: themeColors.primary },
              ]}
              onPress={handleFormSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitQueryText}>Submit Query →</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resetFormBtn}
              onPress={handleReset}
              disabled={submitting}
            >
              <Text style={styles.resetFormText}>Reset Form</Text>
            </TouchableOpacity>
          </View>

          {/* Contact Cards */}
          <TouchableOpacity
            style={[
              styles.contactCard,
              {
                backgroundColor: themeColors.cardBg,
                borderColor: themeColors.border,
              },
            ]}
            onPress={() => openUrl("https://wa.me/919363337331")}
          >
            <FontAwesome5 name="whatsapp" size={24} color="#22C55E" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                style={[
                  styles.contactTitle,
                  { color: themeColors.textSecondary },
                ]}
              >
                WhatsApp Support
              </Text>
              <Text
                style={[styles.contactVal, { color: themeColors.textPrimary }]}
              >
                +91 93633 37331
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={themeColors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.contactCard,
              {
                backgroundColor: themeColors.cardBg,
                borderColor: themeColors.border,
              },
            ]}
            onPress={() => openUrl("mailto:wegrowskillcampus@gmail.com")}
          >
            <Ionicons
              name="mail-outline"
              size={24}
              color={themeColors.primary}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                style={[
                  styles.contactTitle,
                  { color: themeColors.textSecondary },
                ]}
              >
                Email Support
              </Text>
              <Text
                style={[styles.contactVal, { color: themeColors.textPrimary }]}
              >
                wegrowskillcampus@gmail.com
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={themeColors.textSecondary}
            />
          </TouchableOpacity>

          {/* Social Links */}
          <Text
            style={[styles.sectionTitle, { color: themeColors.textPrimary }]}
          >
            Connect With Us
          </Text>
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={[
                styles.socialBtn,
                {
                  backgroundColor: themeColors.cardBg,
                  borderColor: themeColors.border,
                },
              ]}
              onPress={() =>
                openUrl("https://www.instagram.com/wegrowskillcampus/")
              }
            >
              <FontAwesome5 name="instagram" size={22} color="#E1306C" />
              <Text
                style={[styles.socialText, { color: themeColors.textPrimary }]}
              >
                Instagram
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.socialBtn,
                {
                  backgroundColor: themeColors.cardBg,
                  borderColor: themeColors.border,
                },
              ]}
              onPress={() =>
                openUrl("https://www.facebook.com/share/18xhrEHChh/")
              }
            >
              <FontAwesome5 name="facebook" size={22} color="#1877F2" />
              <Text
                style={[styles.socialText, { color: themeColors.textPrimary }]}
              >
                Facebook
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.socialBtn,
                {
                  backgroundColor: themeColors.cardBg,
                  borderColor: themeColors.border,
                },
              ]}
              onPress={() =>
                openUrl("https://www.linkedin.com/company/wegrow-skill-campus/")
              }
            >
              <FontAwesome5 name="linkedin" size={22} color="#0A66C2" />
              <Text
                style={[styles.socialText, { color: themeColors.textPrimary }]}
              >
                LinkedIn
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 110 }} />
        </ScrollView>
      </View>

      {/* Bottom Navigation Bar */}
      <BottomNavbar />
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  directMessageCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  directMessageTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginBottom: 14,
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  flexInputWrapper: {
    flex: 1,
  },
  singleInputWrapper: {
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    fontFamily: FONTS.regular,
  },
  checkboxRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: 4,
    marginBottom: 14,
  },
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  checkboxLabel: {
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    height: 90,
    textAlignVertical: "top",
    fontSize: 13,
    fontFamily: FONTS.regular,
  },
  submitQueryBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  submitQueryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  resetFormBtn: {
    borderWidth: 1,
    borderColor: "#EF4444",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  resetFormText: {
    color: "#EF4444",
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  contactCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 11,
    fontFamily: FONTS.medium,
  },
  contactVal: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    marginTop: 10,
    marginBottom: 12,
  },
  socialRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  socialBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    gap: 6,
  },
  socialText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
  },
});
