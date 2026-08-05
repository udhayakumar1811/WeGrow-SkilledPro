import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  BackHandler,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";

export default function HelpSupportScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");

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

  const handleSubmit = () => {
    if (!query) {
      Alert.alert("Empty Message", "Please type your question or issue.");
      return;
    }
    Alert.alert(
      "Support Ticket Sent! 📩",
      "Our WeGrow team will get back to you within 24 hours.",
    );
    setQuery("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Direct Contact Cards */}
        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => openUrl("https://wa.me/919363337331")}
        >
          <FontAwesome5 name="whatsapp" size={24} color="#22C55E" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.contactTitle}>WhatsApp Support</Text>
            <Text style={styles.contactVal}>+91 93633 37331</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => openUrl("mailto:wegrowskillcampus@gmail.com")}
        >
          <Ionicons name="mail-outline" size={24} color={COLORS.primary} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.contactTitle}>Email Support</Text>
            <Text style={styles.contactVal}>wegrowskillcampus@gmail.com</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>

        {/* Social Media Links Section */}
        <Text style={styles.sectionTitle}>Connect With Us</Text>
        <View style={styles.socialRow}>
          <TouchableOpacity
            style={styles.socialBtn}
            onPress={() =>
              openUrl("https://www.instagram.com/wegrowskillcampus/")
            }
          >
            <FontAwesome5 name="instagram" size={22} color="#E1306C" />
            <Text style={styles.socialText}>Instagram</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialBtn}
            onPress={() =>
              openUrl("https://www.facebook.com/share/18xhrEHChh/")
            }
          >
            <FontAwesome5 name="facebook" size={22} color="#1877F2" />
            <Text style={styles.socialText}>Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialBtn}
            onPress={() =>
              openUrl("https://www.linkedin.com/company/wegrow-skill-campus/")
            }
          >
            <FontAwesome5 name="linkedin" size={22} color="#0A66C2" />
            <Text style={styles.socialText}>LinkedIn</Text>
          </TouchableOpacity>
        </View>

        {/* Support Ticket Form */}
        <Text style={styles.sectionTitle}>Send Us a Query</Text>
        <View style={styles.formBox}>
          <TextInput
            style={styles.textArea}
            placeholder="Type your question or issue here..."
            placeholderTextColor={COLORS.placeholder}
            multiline
            value={query}
            onChangeText={setQuery}
          />
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>Submit Support Request</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 50,
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
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  contactCard: {
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactTitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontFamily: FONTS.medium,
  },
  contactVal: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontFamily: FONTS.bold,
    marginTop: 2,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontFamily: FONTS.bold,
    marginTop: 16,
    marginBottom: 12,
  },
  socialRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  socialBtn: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    gap: 6,
  },
  socialText: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontFamily: FONTS.bold,
  },
  formBox: {
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 30,
  },
  textArea: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
    color: COLORS.textPrimary,
    fontSize: 13,
    fontFamily: FONTS.regular,
    marginBottom: 14,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  submitBtnText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
});
