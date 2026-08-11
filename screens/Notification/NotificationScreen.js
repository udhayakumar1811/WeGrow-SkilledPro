import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNavbar from "../../components/common/BottomNavbar";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import {
  getNotificationsAPI,
  markNotificationAsReadAPI,
} from "../../services/notification";

export default function NotificationScreen() {
  const router = useRouter();
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
      // GET /api/v1/notifications?page=1&limit=20
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

  // Handle Press -> Open Modal & Mark as Read API
  const handleNotificationPress = async (item) => {
    // 1. Set Selected Item and Open Modal
    setSelectedNotif(item);
    setModalVisible(true);

    // 2. Mark as Read if unread
    const targetId = item._id || item.id;
    const isAlreadyRead = item.isRead || item.read;

    if (!isAlreadyRead && targetId) {
      try {
        await markNotificationAsReadAPI(targetId);

        // Update local state instantly
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
        style={[styles.card, !isRead && styles.unreadCard]}
        activeOpacity={0.8}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name={isRead ? "notifications-outline" : "notifications"}
            size={22}
            color={isRead ? COLORS.textSecondary : COLORS.primary}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, !isRead && styles.unreadTitle]}>
            {item.title || "Notification"}
          </Text>
          <Text style={styles.message} numberOfLines={2}>
            {item.message || item.description || ""}
          </Text>
          {item.createdAt && (
            <Text style={styles.time}>
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

        {!isRead && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/home");
              }
            }}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity onPress={fetchNotifications}>
            <Ionicons name="refresh" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            style={{ marginTop: 40 }}
            size="large"
            color={COLORS.primary}
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
                colors={[COLORS.primary]}
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
                  color={COLORS.placeholder}
                />
                <Text style={styles.emptyText}>No notifications found.</Text>
              </View>
            }
          />
        )}
      </View>

      {/* Notification Details Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <View style={styles.modalIconCircle}>
                  <Ionicons
                    name="notifications"
                    size={20}
                    color={COLORS.primary}
                  />
                </View>
                <Text style={styles.modalTitle} numberOfLines={1}>
                  {selectedNotif?.title || "Notification Details"}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              {selectedNotif?.createdAt && (
                <Text style={styles.modalTime}>
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

              <Text style={styles.modalMessage}>
                {selectedNotif?.message ||
                  selectedNotif?.description ||
                  "No message content available."}
              </Text>
            </ScrollView>

            {/* Modal Close Button */}
            <TouchableOpacity
              style={styles.closeBtn}
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
    marginBottom: 16,
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
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.cardBg,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
    alignItems: "center",
  },
  unreadCard: {
    backgroundColor: COLORS.secondaryLight,
    borderColor: COLORS.border,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
  },
  unreadTitle: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  message: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    marginTop: 2,
    lineHeight: 18,
  },
  time: {
    fontSize: 10,
    color: COLORS.placeholder,
    fontFamily: FONTS.regular,
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: 8,
  },
  emptyContainer: {
    marginTop: 80,
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.textSecondary,
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
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
    backgroundColor: COLORS.secondaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  modalBody: {
    marginVertical: 4,
  },
  modalTime: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  closeBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
  closeBtnText: {
    color: COLORS.textWhite,
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
});
