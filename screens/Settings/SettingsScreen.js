import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    BackHandler,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.replace("/profile");
        return true;
      };
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => subscription.remove();
    }, []),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Toggle Option */}
        <View style={styles.settingItem}>
          <Ionicons
            name="notifications-outline"
            size={22}
            color={COLORS.primary}
          />
          <Text style={styles.settingText}>Push Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={COLORS.cardBg}
          />
        </View>

        {/* 1. Account Information */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => router.push("/account-info")}
        >
          <Ionicons name="person-outline" size={22} color={COLORS.primary} />
          <Text style={styles.settingText}>Account Information</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>

        {/* 2. Help & Support */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => router.push("/help-support")}
        >
          <Ionicons
            name="help-circle-outline"
            size={22}
            color={COLORS.primary}
          />
          <Text style={styles.settingText}>Help & Support</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>

        {/* 3. Privacy Policy */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => router.push("/privacy-policy")}
        >
          <Ionicons
            name="document-text-outline"
            size={22}
            color={COLORS.primary}
          />
          <Text style={styles.settingText}>Privacy Policy</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>
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
  settingItem: {
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  settingText: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    fontFamily: FONTS.medium,
    marginLeft: 14,
  },
});
