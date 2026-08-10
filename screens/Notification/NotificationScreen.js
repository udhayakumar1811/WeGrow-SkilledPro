import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  getNotificationsAPI,
  markNotificationAsReadAPI,
} from "../../services/notification";

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await getNotificationsAPI(1, 20);
      // Assuming res.data or res contains array of notifications
      const list = Array.isArray(res)
        ? res
        : res.data || res.notifications || [];
      setNotifications(list);
    } catch (error) {
      console.log("Error fetching notifications:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationPress = async (item) => {
    // If unread, mark as read
    if (!item.isRead && !item.read) {
      try {
        await markNotificationAsReadAPI(item._id || item.id);
        // Update local state instantly so badge decreases
        setNotifications((prev) =>
          prev.map((notif) =>
            (notif._id || notif.id) === (item._id || item.id)
              ? { ...notif, isRead: true, read: true }
              : notif,
          ),
        );
      } catch (err) {
        console.log("Error marking as read:", err);
      }
    }
  };

  const renderItem = ({ item }) => {
    const isRead = item.isRead || item.read;

    return (
      <TouchableOpacity
        style={[styles.card, !isRead && styles.unreadCard]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name={isRead ? "notifications-outline" : "notifications"}
            size={24}
            color={isRead ? "#64748B" : "#0A3D91"}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, !isRead && styles.unreadTitle]}>
            {item.title || "Notification"}
          </Text>
          <Text style={styles.message}>{item.message || item.description}</Text>
          {item.createdAt && (
            <Text style={styles.time}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          )}
        </View>

        {!isRead && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 40 }}
          size="large"
          color="#0A3D91"
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item, index) =>
            item._id || item.id || index.toString()
          }
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchNotifications();
              }}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No notifications found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
    elevation: 1,
  },
  unreadCard: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  iconContainer: { marginRight: 12 },
  textContainer: { flex: 1 },
  title: { fontSize: 15, color: "#334155", fontWeight: "500" },
  unreadTitle: { fontWeight: "bold", color: "#0A3D91" },
  message: { fontSize: 13, color: "#64748B", marginTop: 2 },
  time: { fontSize: 11, color: "#94A3B8", marginTop: 4 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0A3D91",
    marginLeft: 8,
  },
  emptyContainer: { marginTop: 100, alignItems: "center" },
  emptyText: { color: "#94A3B8", fontSize: 16 },
});
