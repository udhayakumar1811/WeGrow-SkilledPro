import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNavbar from "../../components/common/BottomNavbar";
import { FONTS } from "../../constants/fonts";
import { useTheme } from "../../constants/ThemeContext"; // 👈 Fixed Path
import {
  getNotificationsAPI,
  markNotificationAsReadAPI,
} from "../../services/notification";

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 28 : 44;

export default function NotificationScreen() {
  const router = useRouter();
  const { isDarkMode, themeColors } = useTheme();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal State
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Hardware Back Button Handler
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (modalVisible) {
          setModalVisible(false);
          return true;
        }
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace("/home");
        }
        return true;
      };
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => subscription.remove();
    }, [modalVisible]),
  );

  const fetchNotifications = async () => {
    try {
      const res = await getNotificationsAPI(1, 20);

      const list =
        res?.data?.notifications ||
        res?.notifications ||
        res?.data ||
        (Array.isArray(res) ? res : []);

      setNotifications(list);
    } catch (error) {
      console.log("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationPress = async (item) => {
    setSelectedNotif(item);
    setModalVisible(true);

    const targetId = item._id || item.id;
    const isAlreadyRead = item.isRead || item.read;

    if (!isAlreadyRead && targetId) {
      try {
        await markNotificationAsReadAPI(targetId);

        setNotifications((prev) =>
          prev.map((notif) =>
            (notif._id || notif.id) === targetId
              ? { ...notif, isRead: true, read: true }
              : notif,
          ),
        );
      } catch (err) {
        console.log("Error marking notification as read:", err);
      }
    }
  };

  const renderItem = ({ item }) => {
    const isRead = item.isRead || item.read;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: isRead
              ? themeColors.cardBg
              : themeColors.secondaryLight,
            borderColor: themeColors.border,
          },
        ]}
        activeOpacity={0.8}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name={isRead ? "notifications-outline" : "notifications"}
            size={22}
            color={isRead ? themeColors.textSecondary : themeColors.primary}
          />
        </View>

        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              {
                color: isRead ? themeColors.textPrimary : themeColors.primary,
                fontFamily: isRead ? FONTS.medium : FONTS.bold,
              },
            ]}
          >
            {item.title || "Notification"}
          </Text>
          <Text
            style={[styles.message, { color: themeColors.textSecondary }]}
            numberOfLines={2}
          >
            {item.message || item.description || ""}
          </Text>
          {item.createdAt && (
            <Text style={[styles.time, { color: themeColors.placeholder }]}>
              {new Date(item.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          )}
        </View>

        {!isRead && (
          <View
            style={[styles.unreadDot, { backgroundColor: themeColors.primary }]}
          />
        )}
      </TouchableOpacity>
    );
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
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/home");
              }
            }}
          >
            <Ionicons name="arrow-back" size={20} color={themeColors.primary} />
          </TouchableOpacity>
          <Text
            style={[styles.headerTitle, { color: themeColors.textPrimary }]}
          >
            Notifications
          </Text>
          <TouchableOpacity onPress={fetchNotifications}>
            <Ionicons name="refresh" size={20} color={themeColors.primary} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            style={{ marginTop: 40 }}
            size="large"
            color={themeColors.primary}
          />
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item, index) =>
              item._id || item.id || index.toString()
            }
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 110 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                colors={[themeColors.primary]}
                onRefresh={() => {
                  setRefreshing(true);
                  fetchNotifications();
                }}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="notifications-off-outline"
                  size={48}
                  color={themeColors.placeholder}
                />
                <Text
                  style={[
                    styles.emptyText,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  No notifications found.
                </Text>
              </View>
            }
          />
        )}
      </View>

      {/* Notification Details Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: themeColors.cardBg,
                borderColor: themeColors.border,
              },
            ]}
          >
            {/* Modal Header */}
            <View
              style={[
                styles.modalHeader,
                { borderBottomColor: themeColors.border },
              ]}
            >
              <View style={styles.modalHeaderTitleRow}>
                <View
                  style={[
                    styles.modalIconCircle,
                    { backgroundColor: themeColors.secondaryLight },
                  ]}
                >
                  <Ionicons
                    name="notifications"
                    size={20}
                    color={themeColors.primary}
                  />
                </View>
                <Text
                  style={[
                    styles.modalTitle,
                    { color: themeColors.textPrimary },
                  ]}
                  numberOfLines={1}
                >
                  {selectedNotif?.title || "Notification Details"}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons
                  name="close"
                  size={22}
                  color={themeColors.textPrimary}
                />
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              {selectedNotif?.createdAt && (
                <Text
                  style={[
                    styles.modalTime,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  📅 Received on:{" "}
                  {new Date(selectedNotif.createdAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </Text>
              )}

              <Text
                style={[
                  styles.modalMessage,
                  { color: themeColors.textPrimary },
                ]}
              >
                {selectedNotif?.message ||
                  selectedNotif?.description ||
                  "No message content available."}
              </Text>
            </ScrollView>

            {/* Modal Close Button */}
            <TouchableOpacity
              style={[
                styles.closeBtn,
                { backgroundColor: themeColors.primary },
              ]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeBtnText}>Close Notification</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    marginBottom: 16,
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
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  card: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
  },
  message: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginTop: 2,
    lineHeight: 18,
  },
  time: {
    fontSize: 10,
    fontFamily: FONTS.regular,
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  emptyContainer: {
    marginTop: 80,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    marginTop: 10,
  },
  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    width: "100%",
    maxHeight: "80%",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingBottom: 12,
    marginBottom: 12,
  },
  modalHeaderTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    marginRight: 10,
  },
  modalIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  modalBody: {
    marginVertical: 4,
  },
  modalTime: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    lineHeight: 20,
  },
  closeBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
  closeBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
});
