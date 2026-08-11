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
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { getAllEventsAPI } from "../../services/workshop";

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 28 : 44;

export default function WorkshopScreen() {
  const router = useRouter();
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
    <View style={styles.mainWrapper}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      {/* Dynamic Status Bar Safe Area Spacer */}
      <View
        style={{ height: STATUSBAR_HEIGHT, backgroundColor: COLORS.background }}
      />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {userRole === "STUDENT"
              ? "Student Workshops"
              : userRole === "BUSINESS"
                ? "Business Workshops"
                : "Offline Workshops"}
          </Text>
          <TouchableOpacity onPress={onRefresh}>
            <Ionicons name="refresh" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={18}
            color={COLORS.placeholder}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search workshops in Madurai, AI, Python..."
            placeholderTextColor={COLORS.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={COLORS.placeholder}
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
                  selectedFilter === tab.value && styles.activeFilterBtn,
                ]}
                onPress={() => setSelectedFilter(tab.value)}
              >
                <Text
                  style={[
                    styles.filterText,
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
          <View style={styles.roleBanner}>
            <Ionicons
              name="person-circle-outline"
              size={16}
              color={COLORS.primary}
            />
            <Text style={styles.roleBannerText}>
              Showing exclusive workshops for{" "}
              <Text style={{ fontFamily: FONTS.bold }}>{userRole}</Text> members
            </Text>
          </View>
        )}

        {/* Workshops List */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: 40 }}
          />
        ) : filteredWorkshops.length === 0 ? (
          <View style={styles.noDataBox}>
            <Ionicons
              name="search-outline"
              size={48}
              color={COLORS.placeholder}
            />
            <Text style={styles.noDataTitle}>No workshops found</Text>
            <Text style={styles.noDataSub}>
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
              style={styles.card}
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
                <Text style={styles.typeBadgeText}>
                  {item.type || "OFFLINE"}
                </Text>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>
                  {item.description}
                </Text>

                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color={COLORS.secondary}
                    />
                    <Text style={styles.infoText}>
                      {item.location || "Madurai"}
                    </Text>
                  </View>

                  <View style={styles.infoItem}>
                    <Ionicons
                      name="calendar-outline"
                      size={14}
                      color={COLORS.secondary}
                    />
                    <Text style={styles.infoText}>
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
                    <Text style={styles.priceLabel}>Seat Fee</Text>
                    <Text style={styles.priceValue}>₹{item.price || 499}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.bookBtn}
                    onPress={() => handleOpenDetails(item)}
                  >
                    <Text style={styles.bookBtnText}>Book Seat Now</Text>
                    <Ionicons
                      name="arrow-forward"
                      size={14}
                      color={COLORS.textWhite}
                    />
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
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.textPrimary,
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
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  activeFilterBtn: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  activeFilterText: {
    color: COLORS.textWhite,
    fontFamily: FONTS.bold,
  },
  roleBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.secondaryLight,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  roleBannerText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.primary,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.primary,
  },
  cardBody: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  infoGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  priceValue: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  bookBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  bookBtnText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: COLORS.textWhite,
  },
  noDataBox: {
    paddingVertical: 50,
    alignItems: "center",
  },
  noDataTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginTop: 12,
  },
  noDataSub: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
});
