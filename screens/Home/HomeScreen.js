import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  BackHandler,
  Dimensions,
  FlatList,
  ImageBackground,
  Modal,
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
import { useTheme } from "../../constants/ThemeContext";
import { API } from "../../services/api";
import { getUserProfileAPI } from "../../services/auth";
import { getNotificationsAPI } from "../../services/notification";
import { getAllEventsAPI } from "../../services/workshop";

const { width } = Dimensions.get("window");
const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 30;

const BASE_BANNERS = [
  {
    id: "1",
    type: "PASS",
    title: "Monthly Offline Pass",
    subtitle: "Unlimited Access to All Offline Workshops in Madurai & Sivakasi",
    btnText: "View Pass Details",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800",
  },
  {
    id: "2",
    type: "BENEFITS",
    title: "Why Attend Workshops?",
    subtitle: "100% Practical Training • Real-time Projects • Industry Mentors",
    btnText: "Explore Workshops",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800",
  },
  {
    id: "3",
    type: "DEMO",
    title: "Book a FREE Demo Session",
    subtitle:
      "Have questions? Talk to our experts or attend a free offline demo class!",
    btnText: "Enquire / Book Demo",
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800",
  },
  {
    id: "4",
    type: "PLACEMENT",
    title: "Placement Support",
    subtitle: "98% Placement Rate • Resume Prep • Mock HR Interviews",
    btnText: "Check Placements",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800",
  },
  {
    id: "5",
    type: "BUSINESS",
    title: "Business & GST Growth",
    subtitle: "Exclusive Strategy & Scaleup Sessions for Entrepreneurs",
    btnText: "Business Pass",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800",
  },
];

const INFINITE_BANNERS = [...BASE_BANNERS, ...BASE_BANNERS, ...BASE_BANNERS];

export default function HomeScreen() {
  const router = useRouter();
  const { isDarkMode, themeColors } = useTheme();

  const [selectedTab, setSelectedTab] = useState("All");
  const [userRole, setUserRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(BASE_BANNERS.length);
  const flatListRef = useRef(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [modalVisible, setModalVisible] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkUserStatus();
    fetchEvents();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUnreadNotificationCount();
    }, []),
  );

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: BASE_BANNERS.length,
        animated: false,
      });
    }, 100);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = currentIndex + 1;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setCurrentIndex(nextIndex);

      if (nextIndex >= BASE_BANNERS.length * 2) {
        setTimeout(() => {
          let resetIndex = BASE_BANNERS.length;
          flatListRef.current?.scrollToIndex({
            index: resetIndex,
            animated: false,
          });
          setCurrentIndex(resetIndex);
        }, 500);
      }
    }, 3500);

    return () => clearInterval(timer);
  }, [currentIndex]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Exit App",
          "Are you sure you want to exit WeGrow Skill Campus?",
          [
            { text: "Cancel", onPress: () => null, style: "cancel" },
            { text: "Exit", onPress: () => BackHandler.exitApp() },
          ],
        );
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => subscription.remove();
    }, []),
  );

  const checkUserStatus = async () => {
    const role = await AsyncStorage.getItem("userRole");
    setUserRole(role);

    try {
      const res = await getUserProfileAPI();
      const userData = res?.data || res?.user || res;
      if (userData?.firstName) {
        setUserProfile(userData);
      } else {
        setUserProfile(null);
      }
    } catch (err) {
      setUserProfile(null);
    }
  };

  const fetchUnreadNotificationCount = async () => {
    try {
      const res = await getNotificationsAPI(1, 50);
      const list =
        res?.data?.notifications ||
        res?.notifications ||
        res?.data ||
        (Array.isArray(res) ? res : []);

      const unreadList = list.filter((item) => !item.isRead && !item.read);
      setUnreadCount(unreadList.length);
    } catch (error) {
      console.log("Error fetching notification count:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await getAllEventsAPI(1, 20);
      const data = res?.data?.events || res?.events || res?.data || res || [];
      if (Array.isArray(data)) {
        setWorkshops(data);
      } else {
        setWorkshops([]);
      }
    } catch (error) {
      console.log("Error loading events:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    checkUserStatus();
    fetchEvents();
    fetchUnreadNotificationCount();
  };

  const handleBannerAction = (banner) => {
    if (banner.type === "DEMO") {
      setModalVisible(true);
    } else if (banner.type === "PASS") {
      router.push("/pass");
    } else {
      router.push("/workshops");
    }
  };

  const handleEnquirySubmit = async () => {
    if (!enquiryForm.name || !enquiryForm.phone) {
      Alert.alert(
        "Required Fields",
        "Please enter your Name and Phone Number.",
      );
      return;
    }

    setSubmitting(true);
    try {
      const response = await API.post("/contact", {
        fullName: enquiryForm.name,
        email: enquiryForm.email,
        mobileNumber: enquiryForm.phone,
        queryAbout: ["COURSE"],
        query: enquiryForm.message || "Demo session enquiry",
      });

      setModalVisible(false);
      setEnquiryForm({ name: "", phone: "", email: "", message: "" });
      Alert.alert(
        "Enquiry Sent! 🎉",
        response?.data?.message ||
          "Thank you for reaching out. Our team will contact you shortly.",
      );
    } catch (error) {
      console.log("Error submitting enquiry:", error);
      Alert.alert(
        "Submission Failed",
        error?.response?.data?.message ||
          "Failed to send your enquiry. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getWorkshopsToDisplay = () => {
    if (!Array.isArray(workshops)) return [];
    if (userRole === "STUDENT") {
      return workshops.filter((w) => w.type === "STUDENT");
    }
    if (userRole === "BUSINESS") {
      return workshops.filter((w) => w.type === "BUSINESS");
    }
    if (selectedTab === "All") return workshops;
    return workshops.filter((w) => w.type === selectedTab.toUpperCase());
  };

  const displayedWorkshops = getWorkshopsToDisplay();
  const featuredWorkshop = workshops.length > 0 ? workshops[0] : null;
  const activeDotIndex = currentIndex % BASE_BANNERS.length;

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent={true}
      />
      {/* Explicit Top Spacer for Status Bar */}
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
          <View style={styles.logoHeaderWrapper}>
            <Image
              source={require("../../assets/logo/logo_header.png")}
              style={styles.headerLogo}
              contentFit="contain"
            />
          </View>

          <View style={styles.headerRightSection}>
            <TouchableOpacity
              style={[
                styles.iconBtn,
                {
                  backgroundColor: themeColors.cardBg,
                  borderColor: themeColors.border,
                },
              ]}
              onPress={() => router.push("/notification")}
            >
              <Ionicons
                name="notifications-outline"
                size={18}
                color={themeColors.primary}
              />
              {unreadCount > 0 && (
                <View
                  style={[styles.badge, { borderColor: themeColors.cardBg }]}
                >
                  <Text style={styles.badgeText}>
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {userProfile ? (
              <TouchableOpacity
                style={[
                  styles.userProfileBtn,
                  {
                    backgroundColor: themeColors.cardBg,
                    borderColor: themeColors.border,
                  },
                ]}
                onPress={() => router.push("/profile")}
              >
                <Text
                  style={[
                    styles.headerUserName,
                    { color: themeColors.textPrimary },
                  ]}
                >
                  Hi, {userProfile.firstName} 👋
                </Text>
                <View
                  style={[
                    styles.avatarCircle,
                    { backgroundColor: themeColors.secondaryLight },
                  ]}
                >
                  <Ionicons
                    name="person"
                    size={16}
                    color={themeColors.primary}
                  />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.headerLoginBtn,
                  { backgroundColor: themeColors.primary },
                ]}
                onPress={() => router.push("/login")}
              >
                <Ionicons
                  name="log-in-outline"
                  size={16}
                  color={themeColors.textWhite}
                />
                <Text style={styles.headerLoginText}>Login</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Carousel Banner */}
        <View style={styles.carouselWrapper}>
          <FlatList
            ref={flatListRef}
            data={INFINITE_BANNERS}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            getItemLayout={(_, index) => ({
              length: width - 32,
              offset: (width - 32) * index,
              index,
            })}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(
                e.nativeEvent.contentOffset.x / (width - 32),
              );
              setCurrentIndex(idx);
            }}
            renderItem={({ item }) => (
              <ImageBackground
                source={{ uri: item.image }}
                style={styles.carouselCard}
                imageStyle={{ borderRadius: 16 }}
              >
                <View style={styles.carouselOverlay} />
                <View style={styles.carouselTextContainer}>
                  <Text style={styles.carouselTag}>WEGROW HIGHLIGHT</Text>
                  <Text style={styles.carouselTitle}>{item.title}</Text>
                  <Text style={styles.carouselSub}>{item.subtitle}</Text>
                  <TouchableOpacity
                    style={[
                      styles.carouselBtn,
                      { backgroundColor: themeColors.secondary },
                    ]}
                    onPress={() => handleBannerAction(item)}
                  >
                    <Text style={styles.carouselBtnText}>{item.btnText}</Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            )}
          />

          <View style={styles.paginationDots}>
            {BASE_BANNERS.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  { backgroundColor: themeColors.border },
                  activeDotIndex === idx && [
                    styles.activeDot,
                    { backgroundColor: themeColors.primary },
                  ],
                ]}
              />
            ))}
          </View>
        </View>

        {/* Horizontal Workshops Header Section */}
        <View style={styles.sectionHeader}>
          <Text
            style={[styles.sectionTitle, { color: themeColors.textPrimary }]}
          >
            {userRole === "STUDENT"
              ? "STUDENT Offline Workshops"
              : userRole === "BUSINESS"
                ? "BUSINESS Offline Workshops"
                : "Offline Workshops"}
          </Text>
          <TouchableOpacity onPress={() => router.push("/workshops")}>
            <Text style={[styles.seeAllText, { color: themeColors.primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="small"
            color={themeColors.primary}
            style={{ marginVertical: 20 }}
          />
        ) : displayedWorkshops.length === 0 ? (
          <View
            style={[
              styles.noDataBox,
              {
                backgroundColor: themeColors.cardBg,
                borderColor: themeColors.border,
              },
            ]}
          >
            <Ionicons
              name="calendar-outline"
              size={40}
              color={themeColors.placeholder}
            />
            <Text
              style={[styles.noDataText, { color: themeColors.textSecondary }]}
            >
              No workshops found for this category.
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
          >
            {displayedWorkshops.map((item) => (
              <TouchableOpacity
                key={item._id || item.id}
                style={[
                  styles.horizCard,
                  {
                    backgroundColor: themeColors.cardBg,
                    borderColor: themeColors.border,
                  },
                ]}
                activeOpacity={0.9}
                onPress={() =>
                  router.push(`/workshop-details?id=${item._id || item.id}`)
                }
              >
                <Image
                  source={{
                    uri:
                      item.image && item.image.startsWith("http")
                        ? item.image
                        : "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800",
                  }}
                  style={styles.horizCardImg}
                  contentFit="cover"
                />
                <View style={styles.horizBadgeTag}>
                  <Text
                    style={[
                      styles.horizBadgeText,
                      { color: themeColors.primary },
                    ]}
                  >
                    {item.type || "STUDENT"}
                  </Text>
                </View>

                <View style={styles.horizCardContent}>
                  <Text
                    style={[
                      styles.horizTitle,
                      { color: themeColors.textPrimary },
                    ]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.horizDesc,
                      { color: themeColors.textSecondary },
                    ]}
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>

                  <View style={styles.horizInfoRow}>
                    <View style={styles.infoMeta}>
                      <Ionicons
                        name="location-outline"
                        size={12}
                        color={themeColors.secondary}
                      />
                      <Text
                        style={[
                          styles.infoMetaText,
                          { color: themeColors.textSecondary },
                        ]}
                      >
                        {item.location || "Madurai"}
                      </Text>
                    </View>
                    <View style={styles.infoMeta}>
                      <Ionicons
                        name="calendar-outline"
                        size={12}
                        color={themeColors.secondary}
                      />
                      <Text
                        style={[
                          styles.infoMetaText,
                          { color: themeColors.textSecondary },
                        ]}
                      >
                        {item.date
                          ? new Date(item.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })
                          : "15 Sep"}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.horizPriceRow,
                      { borderTopColor: themeColors.border },
                    ]}
                  >
                    <View>
                      <Text
                        style={[
                          styles.seatFeeText,
                          { color: themeColors.textSecondary },
                        ]}
                      >
                        Seat Fee
                      </Text>
                      <Text
                        style={[
                          styles.priceValText,
                          { color: themeColors.primary },
                        ]}
                      >
                        ₹{item.price || "999"}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.horizBookBtn,
                        { backgroundColor: themeColors.primary },
                      ]}
                      onPress={() =>
                        router.push(
                          `/workshop-details?id=${item._id || item.id}`,
                        )
                      }
                    >
                      <Text style={styles.horizBookBtnText}>
                        Book Seat Now →
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* FEATURED UPCOMING SECTION */}
        {featuredWorkshop && (
          <View style={{ marginTop: 28 }}>
            <View style={styles.sectionHeader}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: themeColors.textPrimary },
                ]}
              >
                🔥 Next Big Upcoming Workshop
              </Text>
            </View>

            <Animated.View
              style={[
                styles.featuredCardWrapper,
                {
                  shadowColor: themeColors.primary,
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                style={[
                  styles.featuredCard,
                  {
                    backgroundColor: themeColors.cardBg,
                    borderColor: themeColors.primary,
                  },
                ]}
                onPress={() =>
                  router.push(
                    `/workshop-details?id=${
                      featuredWorkshop._id || featuredWorkshop.id
                    }`,
                  )
                }
              >
                <Image
                  source={{
                    uri:
                      featuredWorkshop.image &&
                      featuredWorkshop.image.startsWith("http")
                        ? featuredWorkshop.image
                        : "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800",
                  }}
                  style={styles.featuredImg}
                  contentFit="cover"
                />

                <View
                  style={[
                    styles.pulseLiveBadge,
                    { backgroundColor: themeColors.primary },
                  ]}
                >
                  <View style={styles.pulseDot} />
                  <Text style={styles.pulseLiveText}>UPCOMING EXCLUSIVE</Text>
                </View>

                <View style={styles.featuredCardBody}>
                  <Text
                    style={[
                      styles.featuredTitle,
                      { color: themeColors.textPrimary },
                    ]}
                  >
                    {featuredWorkshop.title}
                  </Text>
                  <Text
                    style={[
                      styles.featuredDesc,
                      { color: themeColors.textSecondary },
                    ]}
                    numberOfLines={2}
                  >
                    {featuredWorkshop.description}
                  </Text>

                  <View style={styles.featuredMetaRow}>
                    <View style={styles.infoMeta}>
                      <Ionicons
                        name="location-outline"
                        size={13}
                        color={themeColors.secondary}
                      />
                      <Text
                        style={[
                          styles.featuredMetaText,
                          { color: themeColors.textSecondary },
                        ]}
                      >
                        {featuredWorkshop.location || "Madurai"}
                      </Text>
                    </View>
                    <View style={styles.infoMeta}>
                      <Ionicons
                        name="calendar-outline"
                        size={13}
                        color={themeColors.secondary}
                      />
                      <Text
                        style={[
                          styles.featuredMetaText,
                          { color: themeColors.textSecondary },
                        ]}
                      >
                        {featuredWorkshop.date
                          ? new Date(featuredWorkshop.date).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "Coming Soon"}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.featuredActionRow,
                      { borderTopColor: themeColors.border },
                    ]}
                  >
                    <Text
                      style={[
                        styles.featuredPrice,
                        { color: themeColors.primary },
                      ]}
                    >
                      ₹{featuredWorkshop.price || "999"}
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.featuredBookBtn,
                        { backgroundColor: themeColors.primary },
                      ]}
                      onPress={() =>
                        router.push(
                          `/workshop-details?id=${
                            featuredWorkshop._id || featuredWorkshop.id
                          }`,
                        )
                      }
                    >
                      <Text style={styles.featuredBookText}>
                        Reserve Seat Now 🔥
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}

        {/* Popular Categories */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: themeColors.textPrimary,
              marginTop: 24,
              marginBottom: 14,
            },
          ]}
        >
          Popular Categories
        </Text>
        <View style={styles.categoryGrid}>
          {[
            {
              title: "Full Stack",
              sub: "Development",
              icon: "laptop-code",
              color: isDarkMode ? "#1E3A8A" : "#DBEAFE",
            },
            {
              title: "Python",
              sub: "Programming",
              icon: "python",
              color: isDarkMode ? "#78350F" : "#FEF3C7",
            },
            {
              title: "UI/UX",
              sub: "Design",
              icon: "palette",
              color: isDarkMode ? "#581C87" : "#F3E8FF",
            },
            {
              title: "AI & ML",
              sub: "Artificial Intelligence",
              icon: "brain",
              color: isDarkMode ? "#064E3B" : "#DCFCE7",
            },
            {
              title: "Data Analytics",
              sub: "& Science",
              icon: "chart-bar",
              color: isDarkMode ? "#7C2D12" : "#FFEDD5",
            },
            {
              title: "Cloud",
              sub: "Computing",
              icon: "cloud",
              color: isDarkMode ? "#075985" : "#E0F2FE",
            },
          ].map((cat, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.categoryCardThreeCol,
                {
                  backgroundColor: themeColors.cardBg,
                  borderColor: themeColors.border,
                },
              ]}
              onPress={() => router.push("/workshops")}
            >
              <View
                style={[styles.catIconCircle, { backgroundColor: cat.color }]}
              >
                <FontAwesome5
                  name={cat.icon}
                  size={16}
                  color={themeColors.primary}
                />
              </View>
              <Text
                style={[
                  styles.catTitleText,
                  { color: themeColors.textPrimary },
                ]}
                numberOfLines={1}
              >
                {cat.title}
              </Text>
              <Text
                style={[
                  styles.catSubText,
                  { color: themeColors.textSecondary },
                ]}
                numberOfLines={1}
              >
                {cat.sub}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming Workshops List */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text
            style={[styles.sectionTitle, { color: themeColors.textPrimary }]}
          >
            Upcoming Workshops
          </Text>
          <TouchableOpacity onPress={() => router.push("/workshops")}>
            <Text style={[styles.seeAllText, { color: themeColors.primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.upcomingContainer,
            {
              backgroundColor: themeColors.cardBg,
              borderColor: themeColors.border,
            },
          ]}
        >
          {workshops.slice(0, 3).map((item, index) => (
            <View
              key={item._id || item.id || index}
              style={[
                styles.upcomingRow,
                { borderBottomColor: themeColors.border },
              ]}
            >
              <View
                style={[
                  styles.upcomingLogoBox,
                  { backgroundColor: themeColors.secondaryLight },
                ]}
              >
                <Ionicons
                  name="code-slash"
                  size={18}
                  color={themeColors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.upcomingTitleText,
                    { color: themeColors.textPrimary },
                  ]}
                >
                  {item.title}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    marginTop: 2,
                  }}
                >
                  <Ionicons
                    name="location-outline"
                    size={11}
                    color={themeColors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.upcomingSubText,
                      { color: themeColors.textSecondary },
                    ]}
                  >
                    {item.location || "Madurai"}
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: "flex-end", gap: 6 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={11}
                    color={themeColors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.upcomingDateText,
                      { color: themeColors.textSecondary },
                    ]}
                  >
                    {item.date
                      ? new Date(item.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })
                      : "10 Sep"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.registerOutlineBtn,
                    { borderColor: themeColors.primary },
                  ]}
                  onPress={() =>
                    router.push(`/workshop-details?id=${item._id || item.id}`)
                  }
                >
                  <Text
                    style={[
                      styles.registerOutlineBtnText,
                      { color: themeColors.primary },
                    ]}
                  >
                    Register
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Why Choose WeGrow */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: themeColors.textPrimary,
              marginTop: 24,
              marginBottom: 14,
            },
          ]}
        >
          Why Choose WeGrow?
        </Text>
        <View style={styles.whyGrid}>
          {[
            {
              title: "100% Practical",
              sub: "Training",
              icon: "shield-checkmark-outline",
            },
            { title: "Industry", sub: "Experts", icon: "people-outline" },
            {
              title: "Certificate",
              sub: "After Completion",
              icon: "ribbon-outline",
            },
            {
              title: "Placement",
              sub: "Support",
              icon: "briefcase-outline",
            },
          ].map((feature, i) => (
            <View
              key={i}
              style={[
                styles.whyCard,
                {
                  backgroundColor: themeColors.cardBg,
                  borderColor: themeColors.border,
                },
              ]}
            >
              <Ionicons
                name={feature.icon}
                size={24}
                color={themeColors.primary}
              />
              <Text
                style={[
                  styles.whyTitleText,
                  { color: themeColors.textPrimary },
                ]}
              >
                {feature.title}
              </Text>
              <Text
                style={[
                  styles.whySubText,
                  { color: themeColors.textSecondary },
                ]}
              >
                {feature.sub}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Demo Enquiry Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
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
            <View style={styles.modalHeader}>
              <Text
                style={[styles.modalTitle, { color: themeColors.textPrimary }]}
              >
                Book a Demo / Send Enquiry
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons
                  name="close"
                  size={24}
                  color={themeColors.textPrimary}
                />
              </TouchableOpacity>
            </View>

            <Text
              style={[styles.modalSub, { color: themeColors.textSecondary }]}
            >
              Fill out this form and our expert team will contact you shortly
              for a free offline demo session!
            </Text>

            <View style={styles.inputGroup}>
              <Text
                style={[styles.label, { color: themeColors.textSecondary }]}
              >
                Full Name *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: themeColors.inputBg,
                    borderColor: themeColors.border,
                    color: themeColors.textPrimary,
                  },
                ]}
                placeholder="Enter your name"
                placeholderTextColor={themeColors.placeholder}
                value={enquiryForm.name}
                onChangeText={(v) =>
                  setEnquiryForm({ ...enquiryForm, name: v })
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text
                style={[styles.label, { color: themeColors.textSecondary }]}
              >
                Phone Number *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: themeColors.inputBg,
                    borderColor: themeColors.border,
                    color: themeColors.textPrimary,
                  },
                ]}
                placeholder="Enter your mobile number"
                placeholderTextColor={themeColors.placeholder}
                keyboardType="phone-pad"
                value={enquiryForm.phone}
                onChangeText={(v) =>
                  setEnquiryForm({ ...enquiryForm, phone: v })
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text
                style={[styles.label, { color: themeColors.textSecondary }]}
              >
                Email Address
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: themeColors.inputBg,
                    borderColor: themeColors.border,
                    color: themeColors.textPrimary,
                  },
                ]}
                placeholder="you@example.com"
                placeholderTextColor={themeColors.placeholder}
                keyboardType="email-address"
                value={enquiryForm.email}
                onChangeText={(v) =>
                  setEnquiryForm({ ...enquiryForm, email: v })
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text
                style={[styles.label, { color: themeColors.textSecondary }]}
              >
                Your Message / Query
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: themeColors.inputBg,
                    borderColor: themeColors.border,
                    color: themeColors.textPrimary,
                    height: 75,
                    textAlignVertical: "top",
                  },
                ]}
                placeholder="Tell us about your goals or questions..."
                placeholderTextColor={themeColors.placeholder}
                multiline
                value={enquiryForm.message}
                onChangeText={(v) =>
                  setEnquiryForm({ ...enquiryForm, message: v })
                }
              />
            </View>

            <TouchableOpacity
              style={[
                styles.submitEnquiryBtn,
                { backgroundColor: themeColors.primary },
              ]}
              onPress={handleEnquirySubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color={themeColors.textWhite} />
              ) : (
                <Text style={styles.submitEnquiryText}>Submit Enquiry</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingTop: 8,
  },
  logoHeaderWrapper: {
    flex: 1,
    alignItems: "flex-start",
  },
  headerLogo: {
    width: 150,
    height: 44,
  },
  headerRightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    position: "relative",
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontFamily: FONTS.bold,
  },
  headerLoginBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  headerLoginText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  userProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  headerUserName: {
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  carouselWrapper: {
    marginBottom: 20,
  },
  carouselCard: {
    width: width - 32,
    height: 200,
    borderRadius: 16,
    padding: 20,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  carouselOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 61, 145, 0.75)",
    borderRadius: 16,
  },
  carouselTextContainer: {
    zIndex: 10,
  },
  carouselTag: {
    color: "#FF7A00",
    fontSize: 10,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
  },
  carouselTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginTop: 4,
  },
  carouselSub: {
    color: "#E2E8F0",
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginTop: 4,
  },
  carouselBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: "flex-start",
  },
  carouselBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  paginationDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
  seeAllText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  noDataBox: {
    padding: 30,
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
  },
  noDataText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginTop: 8,
  },
  horizontalScrollContainer: {
    gap: 14,
    paddingRight: 16,
  },
  horizCard: {
    width: width * 0.7,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  horizCardImg: {
    width: "100%",
    height: 120,
  },
  horizBadgeTag: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  horizBadgeText: {
    fontSize: 9,
    fontFamily: FONTS.bold,
  },
  horizCardContent: {
    padding: 12,
  },
  horizTitle: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    marginBottom: 4,
  },
  horizDesc: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    marginBottom: 10,
  },
  horizInfoRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  infoMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoMetaText: {
    fontSize: 10,
    fontFamily: FONTS.medium,
  },
  horizPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    paddingTop: 8,
  },
  seatFeeText: {
    fontSize: 9,
    fontFamily: FONTS.medium,
  },
  priceValText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  horizBookBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  horizBookBtnText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  featuredCardWrapper: {
    borderRadius: 18,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  featuredCard: {
    borderRadius: 18,
    borderWidth: 2,
    overflow: "hidden",
  },
  featuredImg: {
    width: "100%",
    height: 160,
  },
  pulseLiveBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#22C55E",
  },
  pulseLiveText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  featuredCardBody: {
    padding: 16,
  },
  featuredTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginBottom: 4,
  },
  featuredDesc: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginBottom: 12,
    lineHeight: 18,
  },
  featuredMetaRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 14,
  },
  featuredMetaText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
  },
  featuredActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    paddingTop: 12,
  },
  featuredPrice: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  featuredBookBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  featuredBookText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  categoryCardThreeCol: {
    width: (width - 48) / 3,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: "center",
    borderWidth: 1,
    marginBottom: 8,
  },
  catIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  catTitleText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    textAlign: "center",
  },
  catSubText: {
    fontSize: 8,
    fontFamily: FONTS.regular,
    textAlign: "center",
    marginTop: 1,
  },
  upcomingContainer: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  upcomingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  upcomingLogoBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  upcomingTitleText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  upcomingSubText: {
    fontSize: 10,
    fontFamily: FONTS.regular,
  },
  upcomingDateText: {
    fontSize: 10,
    fontFamily: FONTS.medium,
  },
  registerOutlineBtn: {
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  registerOutlineBtnText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  whyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  whyCard: {
    width: (width - 42) / 2,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
  },
  whyTitleText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    marginTop: 6,
    textAlign: "center",
  },
  whySubText: {
    fontSize: 10,
    fontFamily: FONTS.regular,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    width: "100%",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  modalSub: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginBottom: 16,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: FONTS.regular,
  },
  submitEnquiryBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  submitEnquiryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
});
