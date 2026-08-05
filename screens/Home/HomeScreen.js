import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  ImageBackground,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNavbar from "../../components/common/BottomNavbar";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { getUserProfileAPI } from "../../services/auth";
import { getAllEventsAPI } from "../../services/workshop";

const { width } = Dimensions.get("window");

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
  const [selectedTab, setSelectedTab] = useState("All");
  const [userRole, setUserRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(BASE_BANNERS.length);
  const flatListRef = useRef(null);

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
  }, []);

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
    React.useCallback(() => {
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

  const fetchEvents = async () => {
    try {
      const res = await getAllEventsAPI(1, 20);
      const data = res?.data || res?.events || res || [];
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
  };

  const handleBannerAction = (banner) => {
    if (banner.type === "DEMO") {
      setModalVisible(true);
    } else if (banner.type === "PASS") {
      router.push("/membership");
    } else {
      router.push("/workshops");
    }
  };

  const handleEnquirySubmit = () => {
    if (!enquiryForm.name || !enquiryForm.phone) {
      Alert.alert(
        "Required Fields",
        "Please enter your Name and Phone Number.",
      );
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setModalVisible(false);
      setEnquiryForm({ name: "", phone: "", email: "", message: "" });
      Alert.alert(
        "Enquiry Sent! 🎉",
        "Thank you for reaching out. Our team will contact you shortly.",
      );
    }, 1000);
  };

  const getHighlightWorkshops = () => {
    if (!Array.isArray(workshops) || workshops.length === 0) return [];

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const todayStr = today.toISOString().split("T")[0];
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const todaysWorkshops = workshops.filter((w) => {
      if (!w.date) return false;
      const wDate = new Date(w.date).toISOString().split("T")[0];
      return wDate === todayStr || wDate === tomorrowStr;
    });

    if (todaysWorkshops.length > 0) return todaysWorkshops;

    return workshops.slice(0, 2);
  };

  const highlightWorkshops = getHighlightWorkshops();

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
  const activeDotIndex = currentIndex % BASE_BANNERS.length;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
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
        {/* 1. Header with Logo & Login/Profile */}
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
              style={styles.iconBtn}
              onPress={() => router.push("/notification")}
            >
              <Ionicons
                name="notifications-outline"
                size={18}
                color={COLORS.primary}
              />
            </TouchableOpacity>

            {userProfile ? (
              <TouchableOpacity
                style={styles.userProfileBtn}
                onPress={() => router.push("/profile")}
              >
                <Text style={styles.headerUserName}>
                  Hi, {userProfile.firstName} 👋
                </Text>
                <View style={styles.avatarCircle}>
                  <Ionicons name="person" size={16} color={COLORS.primary} />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.headerLoginBtn}
                onPress={() => router.push("/login")}
              >
                <Ionicons
                  name="log-in-outline"
                  size={16}
                  color={COLORS.textWhite}
                />
                <Text style={styles.headerLoginText}>Login</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 2. Increased Height Carousel (Hero Banner Removed) */}
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
                    style={styles.carouselBtn}
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
                style={[styles.dot, activeDotIndex === idx && styles.activeDot]}
              />
            ))}
          </View>
        </View>

        {/* 3. Today / Tomorrow Workshops Highlight */}
        {highlightWorkshops.length > 0 && (
          <View style={styles.highlightSection}>
            <View style={styles.highlightHeader}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveBadgeText}>HAPPENING SOON</Text>
              </View>
              <Text style={styles.highlightTitle}>
                Today / Tomorrow Sessions
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
            >
              {highlightWorkshops.map((item) => (
                <TouchableOpacity
                  key={item._id || item.id}
                  style={styles.highlightCard}
                  activeOpacity={0.85}
                  onPress={() =>
                    router.push(`/workshop-details?id=${item._id || item.id}`)
                  }
                >
                  <View style={styles.highlightBadge}>
                    <Text style={styles.highlightBadgeText}>
                      {item.type || "SPECIAL"}
                    </Text>
                  </View>
                  <Text style={styles.highlightCardTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View style={styles.highlightInfoRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={13}
                      color={COLORS.secondary}
                    />
                    <Text style={styles.highlightInfoText}>
                      {item.date
                        ? new Date(item.date).toLocaleDateString()
                        : "Today"}
                    </Text>
                  </View>
                  <View style={styles.highlightInfoRow}>
                    <Ionicons
                      name="location-outline"
                      size={13}
                      color={COLORS.secondary}
                    />
                    <Text style={styles.highlightInfoText}>
                      {item.location || "Madurai"}
                    </Text>
                  </View>
                  <View style={styles.highlightPriceRow}>
                    <Text style={styles.highlightPriceText}>
                      ₹{item.price || "499"}
                    </Text>
                    <Text style={styles.highlightBookText}>Book Seat →</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* 4. Scrollable Category Filter Tabs (Fixes Overflow on Small Screens) */}
        {!userRole && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabContainer}
          >
            {["All", "Student", "Business"].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabBtn,
                  selectedTab === tab && styles.activeTabBtn,
                ]}
                onPress={() => setSelectedTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab === "All" ? "All Workshops" : `${tab} Special`}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* 5. Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {userRole
              ? `${userRole} Offline Workshops`
              : "Upcoming Offline Workshops"}
          </Text>
          <TouchableOpacity onPress={() => router.push("/workshops")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* 6. Workshops List */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginVertical: 30 }}
          />
        ) : displayedWorkshops.length === 0 ? (
          <View style={styles.noDataBox}>
            <Ionicons
              name="calendar-outline"
              size={40}
              color={COLORS.placeholder}
            />
            <Text style={styles.noDataText}>
              No workshops found for this category.
            </Text>
          </View>
        ) : (
          displayedWorkshops.map((item) => (
            <View key={item._id || item.id} style={styles.workshopCard}>
              <Image
                source={{
                  uri:
                    item.image ||
                    "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600",
                }}
                style={styles.workshopImg}
                contentFit="cover"
              />
              <View style={styles.badgeTag}>
                <Text style={styles.badgeText}>{item.type || "Offline"}</Text>
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.workshopTitle}>{item.title}</Text>

                <View style={styles.infoRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={15}
                    color={COLORS.secondary}
                  />
                  <Text style={styles.infoText}>
                    {item.date
                      ? new Date(item.date).toLocaleDateString()
                      : "Upcoming"}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons
                    name="location-outline"
                    size={15}
                    color={COLORS.secondary}
                  />
                  <Text style={styles.infoText}>
                    {item.location || "Madurai"}
                  </Text>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Workshop Fee:</Text>
                  <Text style={styles.priceVal}>₹{item.price || "499"}</Text>
                </View>

                <TouchableOpacity
                  style={styles.bookBtn}
                  onPress={() =>
                    router.push(
                      `/payment?id=${item._id || item.id}&amount=${item.price || 499}&title=${encodeURIComponent(item.title)}`,
                    )
                  }
                >
                  <Text style={styles.bookBtnText}>Book Offline Seat</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Demo Enquiry Modal Form */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Book a Demo / Send Enquiry</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Fill out this form and our expert team will contact you shortly
              for a free offline demo session!
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={COLORS.placeholder}
                value={enquiryForm.name}
                onChangeText={(v) =>
                  setEnquiryForm({ ...enquiryForm, name: v })
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your mobile number"
                placeholderTextColor={COLORS.placeholder}
                keyboardType="phone-pad"
                value={enquiryForm.phone}
                onChangeText={(v) =>
                  setEnquiryForm({ ...enquiryForm, phone: v })
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={COLORS.placeholder}
                keyboardType="email-address"
                value={enquiryForm.email}
                onChangeText={(v) =>
                  setEnquiryForm({ ...enquiryForm, email: v })
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Message / Query</Text>
              <TextInput
                style={[styles.input, { height: 75, textAlignVertical: "top" }]}
                placeholder="Tell us about your goals or questions..."
                placeholderTextColor={COLORS.placeholder}
                multiline
                value={enquiryForm.message}
                onChangeText={(v) =>
                  setEnquiryForm({ ...enquiryForm, message: v })
                }
              />
            </View>

            <TouchableOpacity
              style={styles.submitEnquiryBtn}
              onPress={handleEnquirySubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color={COLORS.textWhite} />
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
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 45,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
    backgroundColor: COLORS.cardBg,
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerLoginBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  headerLoginText: {
    color: COLORS.textWhite,
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  userProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.cardBg,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerUserName: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.secondaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  carouselWrapper: {
    marginBottom: 20,
  },
  carouselCard: {
    width: width - 32,
    height: 220, // Increased Height for Prominence
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
    color: COLORS.secondary,
    fontSize: 10,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
  },
  carouselTitle: {
    color: COLORS.textWhite,
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginTop: 4,
  },
  carouselSub: {
    color: COLORS.border,
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginTop: 4,
  },
  carouselBtn: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: "flex-start",
  },
  carouselBtnText: {
    color: COLORS.textWhite,
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
    backgroundColor: COLORS.border,
  },
  activeDot: {
    width: 20,
    backgroundColor: COLORS.primary,
  },
  highlightSection: {
    marginBottom: 20,
    backgroundColor: "#FFF7ED",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FFEDD5",
  },
  highlightHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF7A00",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.textWhite,
  },
  liveBadgeText: {
    color: COLORS.textWhite,
    fontSize: 9,
    fontFamily: FONTS.bold,
  },
  highlightTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  highlightCard: {
    width: 230,
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  highlightBadge: {
    backgroundColor: COLORS.secondaryLight,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  highlightBadgeText: {
    color: COLORS.secondary,
    fontSize: 9,
    fontFamily: FONTS.bold,
  },
  highlightCardTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontFamily: FONTS.bold,
    marginBottom: 8,
    height: 36,
  },
  highlightInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  highlightInfoText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontFamily: FONTS.regular,
  },
  highlightPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  highlightPriceText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  highlightBookText: {
    color: COLORS.secondary,
    fontSize: 11,
    fontFamily: FONTS.bold,
  },
  tabContainer: {
    gap: 10,
    marginBottom: 20,
    paddingRight: 16,
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeTabBtn: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  activeTabText: {
    color: COLORS.textWhite,
    fontFamily: FONTS.bold,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  seeAllText: {
    color: COLORS.primary,
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  noDataBox: {
    padding: 30,
    alignItems: "center",
  },
  noDataText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontFamily: FONTS.regular,
    marginTop: 8,
  },
  workshopCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  workshopImg: {
    width: "100%",
    height: 160,
  },
  badgeTag: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: COLORS.cardBg,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderColor: COLORS.secondary,
    borderWidth: 1,
  },
  badgeText: {
    color: COLORS.secondary,
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  cardContent: {
    padding: 16,
  },
  workshopTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  infoText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.regular,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 10,
    marginVertical: 12,
  },
  priceLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  priceVal: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  bookBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  bookBtnText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontFamily: FONTS.bold,
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
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  modalSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginBottom: 16,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontFamily: FONTS.medium,
    marginBottom: 4,
  },
  input: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.textPrimary,
    fontSize: 13,
    fontFamily: FONTS.regular,
  },
  submitEnquiryBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  submitEnquiryText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
});
