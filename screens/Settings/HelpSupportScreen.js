import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    BackHandler,
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
        {/* Contact Support Cards */}
        <View style={styles.contactCard}>
          <Ionicons name="call-outline" size={24} color={COLORS.primary} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.contactTitle}>Call Us Directly</Text>
            <Text style={styles.contactVal}>+91 93443 37331</Text>
          </View>
        </View>

        <View style={styles.contactCard}>
          <Ionicons name="mail-outline" size={24} color={COLORS.primary} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.contactTitle}>Email Support</Text>
            <Text style={styles.contactVal}>enquiry@wegrowcampus.in</Text>
          </View>
        </View>

        <View style={styles.contactCard}>
          <Ionicons name="location-outline" size={24} color={COLORS.primary} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.contactTitle}>Offline Campus Center</Text>
            <Text style={styles.contactVal}>
              Madurai & Sivakasi, Tamil Nadu
            </Text>
          </View>
        </View>

        {/* Send Support Ticket */}
        <Text style={styles.sectionTitle}>Send Us a Message</Text>
        <View style={styles.formBox}>
          <TextInput
            style={styles.textArea}
            placeholder="Type your question, workshop issue or feedback here..."
            placeholderTextColor={COLORS.placeholder}
            multiline
            value={query}
            onChangeText={setQuery}
          />
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>Submit Support Request</Text>
          </TouchableOpacity>
        </View>
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
