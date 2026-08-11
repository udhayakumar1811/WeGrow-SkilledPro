import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
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
import { useTheme } from "../../constants/ThemeContext"; // 👈 Fixed Path
import { getAllEventsAPI } from "../../services/workshop";

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 28 : 44;

export default function WorkshopScreen() {
  const router = useRouter();
  const { isDarkMode, themeColors } = useTheme();

  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkUserAuthAndRole();
    fetchWorkshops();
  }, []);

  const checkUserAuthAndRole = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const role = await AsyncStorage.getItem("userRole");

      if (token) {
        setIsLoggedIn(true);
        setUserRole(role);

        if (role === "STUDENT") {
          setSelectedFilter("STUDENT");
        } else if (role === "BUSINESS") {
          setSelectedFilter("BUSINESS");
        }
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
        setSelectedFilter("ALL");
      }
    } catch (error) {
      console.log("Error reading auth state:", error);
    }
  };

  const fetchWorkshops = async () => {
    try {
      const res = await getAllEventsAPI(1, 20);
      const eventsData =
        res?.data?.events || res?.events || res?.data || res || [];

      if (Array.isArray(eventsData)) {
        setWorkshops(eventsData);
      } else {
        setWorkshops([]);
      }
    } catch (error) {
      console.log("Error fetching workshops API:", error);
      setWorkshops([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    checkUserAuthAndRole();
    fetchWorkshops();
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/home");
    }
  };

  const handleOpenDetails = (item) => {
    const eventId = item._id || item.id;
    if (eventId) {
      router.push(`/workshop-details?id=${eventId}`);
    } else {
      Alert.alert("Error", "Workshop details not available.");
    }
  };

  const filteredWorkshops = workshops.filter((item) => {
    let matchesFilter = true;
    if (userRole === "STUDENT") {
      matchesFilter = item.type?.toUpperCase() === "STUDENT";
    } else if (userRole === "BUSINESS") {
      matchesFilter = item.type?.toUpperCase() === "BUSINESS";
    } else {
      matchesFilter =
        selectedFilter === "ALL" || item.type?.toUpperCase() === selectedFilter;
    }

    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <View
      style={[styles.mainWrapper, { backgroundColor: themeColors.background }]}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent={true}
      />
      {/* Dynamic Status Bar Safe Area Spacer */}
      <View
        style={{
          height: STATUSBAR_HEIGHT,
          backgroundColor: themeColors.background,
        }}
      />

      <ScrollView
        style={[styles.container, { backgroundColor: themeColors.background }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[themeColors.primary]}
          />
        }
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
            onPress={handleBackPress}
          >
            <Ionicons name="arrow-back" size={20} color={themeColors.primary} />
          </TouchableOpacity>
          <Text
            style={[styles.headerTitle, { color: themeColors.textPrimary }]}
          >
            {userRole === "STUDENT"
              ? "Student Workshops"
              : userRole === "BUSINESS"
                ? "Business Workshops"
                : "Offline Workshops"}
          </Text>
          <TouchableOpacity onPress={onRefresh}>
            <Ionicons name="refresh" size={20} color={themeColors.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: themeColors.cardBg,
              borderColor: themeColors.border,
            },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={18}
            color={themeColors.placeholder}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: themeColors.textPrimary }]}
            placeholder="Search workshops in Madurai, AI, Python..."
            placeholderTextColor={themeColors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={themeColors.placeholder}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter Tabs */}
        {!userRole && (
          <View style={styles.filterRow}>
            {[
              { label: "All Sessions", value: "ALL" },
              { label: "Student", value: "STUDENT" },
              { label: "Business Pro", value: "BUSINESS" },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.value}
                style={[
                  styles.filterBtn,
                  {
                    backgroundColor: themeColors.cardBg,
                    borderColor: themeColors.border,
                  },
                  selectedFilter === tab.value && [
                    styles.activeFilterBtn,
                    {
                      backgroundColor: themeColors.primary,
                      borderColor: themeColors.primary,
                    },
                  ],
                ]}
                onPress={() => setSelectedFilter(tab.value)}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: themeColors.textSecondary },
                    selectedFilter === tab.value && styles.activeFilterText,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Active Role Indicator Banner */}
        {userRole && (
          <View
            style={[
              styles.roleBanner,
              { backgroundColor: themeColors.secondaryLight },
            ]}
          >
            <Ionicons
              name="person-circle-outline"
              size={16}
              color={themeColors.primary}
            />
            <Text
              style={[styles.roleBannerText, { color: themeColors.primary }]}
            >
              Showing exclusive workshops for{" "}
              <Text style={{ fontFamily: FONTS.bold }}>{userRole}</Text> members
            </Text>
          </View>
        )}

        {/* Workshops List */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={themeColors.primary}
            style={{ marginTop: 40 }}
          />
        ) : filteredWorkshops.length === 0 ? (
          <View style={styles.noDataBox}>
            <Ionicons
              name="search-outline"
              size={48}
              color={themeColors.placeholder}
            />
            <Text
              style={[styles.noDataTitle, { color: themeColors.textPrimary }]}
            >
              No workshops found
            </Text>
            <Text
              style={[styles.noDataSub, { color: themeColors.textSecondary }]}
            >
              {searchQuery
                ? `No results matching "${searchQuery}"`
                : userRole
                  ? `No active ${userRole} workshops available right now.`
                  : "No workshops found for this category."}
            </Text>
          </View>
        ) : (
          filteredWorkshops.map((item) => (
            <TouchableOpacity
              key={item._id || item.id}
              style={[
                styles.card,
                {
                  backgroundColor: themeColors.cardBg,
                  borderColor: themeColors.border,
                },
              ]}
              activeOpacity={0.9}
              onPress={() => handleOpenDetails(item)}
            >
              <Image
                source={{
                  uri:
                    item.image && item.image.startsWith("http")
                      ? item.image
                      : "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800",
                }}
                style={styles.cardImage}
                contentFit="cover"
              />

              <View style={styles.typeBadge}>
                <Text
                  style={[styles.typeBadgeText, { color: themeColors.primary }]}
                >
                  {item.type || "OFFLINE"}
                </Text>
              </View>

              <View style={styles.cardBody}>
                <Text
                  style={[styles.cardTitle, { color: themeColors.textPrimary }]}
                >
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.cardDesc,
                    { color: themeColors.textSecondary },
                  ]}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>

                <View
                  style={[
                    styles.infoGrid,
                    { borderBottomColor: themeColors.border },
                  ]}
                >
                  <View style={styles.infoItem}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color={themeColors.secondary}
                    />
                    <Text
                      style={[
                        styles.infoText,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      {item.location || "Madurai"}
                    </Text>
                  </View>

                  <View style={styles.infoItem}>
                    <Ionicons
                      name="calendar-outline"
                      size={14}
                      color={themeColors.secondary}
                    />
                    <Text
                      style={[
                        styles.infoText,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      {item.date
                        ? new Date(item.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Upcoming"}
                    </Text>
                  </View>
                </View>

                <View style={styles.actionRow}>
                  <View>
                    <Text
                      style={[
                        styles.priceLabel,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      Seat Fee
                    </Text>
                    <Text
                      style={[
                        styles.priceValue,
                        { color: themeColors.primary },
                      ]}
                    >
                      ₹{item.price || 499}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.bookBtn,
                      { backgroundColor: themeColors.primary },
                    ]}
                    onPress={() => handleOpenDetails(item)}
                  >
                    <Text style={styles.bookBtnText}>Book Seat Now</Text>
                    <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingTop: 12,
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTS.regular,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  activeFilterBtn: {
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  activeFilterText: {
    color: "#FFFFFF",
    fontFamily: FONTS.bold,
  },
  roleBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  roleBannerText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    marginBottom: 18,
  },
  cardImage: {
    width: "100%",
    height: 160,
  },
  typeBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  cardBody: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginBottom: 12,
    lineHeight: 18,
  },
  infoGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 10,
    fontFamily: FONTS.medium,
  },
  priceValue: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  bookBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  bookBtnText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: "#FFFFFF",
  },
  noDataBox: {
    paddingVertical: 50,
    alignItems: "center",
  },
  noDataTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginTop: 12,
  },
  noDataSub: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginTop: 4,
    textAlign: "center",
  },
});
