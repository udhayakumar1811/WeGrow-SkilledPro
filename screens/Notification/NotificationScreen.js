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
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";

const NOTIFICATIONS = [
  {
    id: "1",
    title: "Seat Confirmed! 🎉",
    message:
      'Your offline seat for "AI & MERN Bootcamp" in Madurai is confirmed for Aug 15.',
    time: "2 hours ago",
    unread: true,
  },
  {
    id: "2",
    title: "Monthly Pass Renewal",
    message:
      "Your Student Pass expires in 3 days. Renew now for unlimited workshop access.",
    time: "1 day ago",
    unread: false,
  },
  {
    id: "3",
    title: "New Business Workshop Added",
    message:
      "GST & Scaleup strategy workshop for entrepreneurs is live for booking.",
    time: "2 days ago",
    unread: false,
  },
];

export default function NotificationScreen() {
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.replace("/home");
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
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.replace("/home")}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {NOTIFICATIONS.map((item) => (
          <View
            key={item.id}
            style={[styles.card, item.unread && styles.unreadCard]}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="notifications" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        ))}
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
  card: {
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    marginBottom: 12,
  },
  unreadCard: {
    borderColor: COLORS.primary,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  message: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginTop: 4,
    lineHeight: 18,
  },
  time: {
    color: COLORS.placeholder,
    fontSize: 10,
    fontFamily: FONTS.regular,
    marginTop: 6,
  },
});
