import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React from "react";
import {
  BackHandler,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNavbar from "../components/common/BottomNavbar";
import { FONTS } from "../constants/fonts";
import { useTheme } from "../constants/ThemeContext";

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 28 : 44;

export default function CommunityMembersRoute() {
  const router = useRouter();
  const { isDarkMode, themeColors } = useTheme();

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
            <Ionicons name="arrow-back" size={20} color={themeColors.primary} />
          </TouchableOpacity>
          <Text
            style={[styles.headerTitle, { color: themeColors.textPrimary }]}
          >
            WeGrow Community Members
          </Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {members.map((item) => (
            <View
              key={item.id}
              style={[
                styles.memberCard,
                {
                  backgroundColor: themeColors.cardBg,
                  borderColor: themeColors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.avatarCircle,
                  { backgroundColor: themeColors.secondaryLight },
                ]}
              >
                <Ionicons name="person" size={20} color={themeColors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.memberName,
                    { color: themeColors.textPrimary },
                  ]}
                >
                  {item.name}
                </Text>
                <Text
                  style={[styles.memberRole, { color: themeColors.secondary }]}
                >
                  {item.role}
                </Text>
                <Text
                  style={[
                    styles.memberCity,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  📍 {item.city}
                </Text>
              </View>
            </View>
          ))}
          <View style={{ height: 120 }} />
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
    paddingHorizontal: 16,
    paddingTop: 10,
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
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  memberName: {
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  memberRole: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  memberCity: {
    fontSize: 10,
    fontFamily: FONTS.regular,
    marginTop: 2,
  },
});
