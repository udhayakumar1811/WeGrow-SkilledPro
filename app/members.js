import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React from "react";
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNavbar from "../components/common/BottomNavbar";
import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";

export default function CommunityMembersRoute() {
  const router = useRouter();

  // Hardware Back Button Handler
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

  const members = [
    {
      id: "1",
      name: "Udhaya Kumar",
      role: "Full Stack Developer",
      city: "Madurai",
    },
    {
      id: "2",
      name: "Aravind Swamy",
      role: "Python Developer",
      city: "Chennai",
    },
    {
      id: "3",
      name: "Priya Dharshini",
      role: "UI/UX Designer",
      city: "Coimbatore",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>WeGrow Community Members</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {members.map((item) => (
          <View key={item.id} style={styles.memberCard}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={20} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.memberName}>{item.name}</Text>
              <Text style={styles.memberRole}>{item.role}</Text>
              <Text style={styles.memberCity}>📍 {item.city}</Text>
            </View>
          </View>
        ))}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.cardBg,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.secondaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  memberName: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  memberRole: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.secondary,
  },
  memberCity: {
    fontSize: 10,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
