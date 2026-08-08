import { FontAwesome5, Ionicons } from "@expo/vector-icons";
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

        {/* Horizontal Workshops */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {userRole === "BUSINESS"
              ? "BUSINESS Offline Workshops"
              : "STUDENT Offline Workshops"}
          </Text>
          <TouchableOpacity onPress={() => router.push("/workshops")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="small"
            color={COLORS.primary}
            style={{ marginVertical: 20 }}
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
          >
            {displayedWorkshops.map((item) => (
              <TouchableOpacity
                key={item._id || item.id}
                style={styles.horizCard}
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
                  <Text style={styles.horizBadgeText}>
                    {item.type || "STUDENT"}
                  </Text>
                </View>

                <View style={styles.horizCardContent}>
                  <Text style={styles.horizTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.horizDesc} numberOfLines={2}>
                    {item.description}
                  </Text>

                  <View style={styles.horizInfoRow}>
                    <View style={styles.infoMeta}>
                      <Ionicons
                        name="location-outline"
                        size={12}
                        color={COLORS.secondary}
                      />
                      <Text style={styles.infoMetaText}>
                        {item.location || "Madurai"}
                      </Text>
                    </View>
                    <View style={styles.infoMeta}>
                      <Ionicons
                        name="calendar-outline"
                        size={12}
                        color={COLORS.secondary}
                      />
                      <Text style={styles.infoMetaText}>
                        {item.date
                          ? new Date(item.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })
                          : "15 Sep"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.horizPriceRow}>
                    <View>
                      <Text style={styles.seatFeeText}>Seat Fee</Text>
                      <Text style={styles.priceValText}>
                        ₹{item.price || "999"}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.horizBookBtn}
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

        {/* Popular Categories (Aligned in 3 Columns x 2 Rows) */}
        <Text
          style={[styles.sectionTitle, { marginTop: 24, marginBottom: 14 }]}
        >
          Popular Categories
        </Text>
        <View style={styles.categoryGrid}>
          {[
            {
              title: "Full Stack",
              sub: "Development",
              icon: "laptop-code",
              color: "#DBEAFE",
            },
            {
              title: "Python",
              sub: "Programming",
              icon: "python",
              color: "#FEF3C7",
            },
            {
              title: "UI/UX",
              sub: "Design",
              icon: "palette",
              color: "#F3E8FF",
            },
            {
              title: "AI & ML",
              sub: "Artificial Intelligence",
              icon: "brain",
              color: "#DCFCE7",
            },
            {
              title: "Data Analytics",
              sub: "& Science",
              icon: "chart-bar",
              color: "#FFEDD5",
            },
            {
              title: "Cloud",
              sub: "Computing",
              icon: "cloud",
              color: "#E0F2FE",
            },
          ].map((cat, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.categoryCardThreeCol}
              onPress={() => router.push("/workshops")}
            >
              <View
                style={[styles.catIconCircle, { backgroundColor: cat.color }]}
              >
                <FontAwesome5
                  name={cat.icon}
                  size={16}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.catTitleText} numberOfLines={1}>
                {cat.title}
              </Text>
              <Text style={styles.catSubText} numberOfLines={1}>
                {cat.sub}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming Workshops */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Upcoming Workshops</Text>
          <TouchableOpacity onPress={() => router.push("/workshops")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.upcomingContainer}>
          {workshops.slice(0, 3).map((item, index) => (
            <View key={item._id || item.id || index} style={styles.upcomingRow}>
              <View style={styles.upcomingLogoBox}>
                <Ionicons name="code-slash" size={18} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.upcomingTitleText}>{item.title}</Text>
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
                    color={COLORS.textSecondary}
                  />
                  <Text style={styles.upcomingSubText}>
                    {item.location || "Madurai"}
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: "flex-end", gap: 6 }}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={11}
                    color={COLORS.textSecondary}
                  />
                  <Text style={styles.upcomingDateText}>
                    {item.date
                      ? new Date(item.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })
                      : "10 Sep"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.registerOutlineBtn}
                  onPress={() =>
                    router.push(`/workshop-details?id=${item._id || item.id}`)
                  }
                >
                  <Text style={styles.registerOutlineBtnText}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Why Choose WeGrow */}
        <Text
          style={[styles.sectionTitle, { marginTop: 24, marginBottom: 14 }]}
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
            { title: "Placement", sub: "Support", icon: "briefcase-outline" },
          ].map((feature, i) => (
            <View key={i} style={styles.whyCard}>
              <Ionicons name={feature.icon} size={24} color={COLORS.primary} />
              <Text style={styles.whyTitleText}>{feature.title}</Text>
              <Text style={styles.whySubText}>{feature.sub}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Demo Enquiry Modal */}
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
  seeAllText: {
    color: COLORS.primary,
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  noDataBox: {
    padding: 30,
    alignItems: "center",
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  noDataText: {
    color: COLORS.textSecondary,
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
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.primary,
  },
  horizCardContent: {
    padding: 12,
  },
  horizTitle: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  horizDesc: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
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
    color: COLORS.textSecondary,
  },
  horizPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  seatFeeText: {
    fontSize: 9,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  },
  priceValText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  horizBookBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  horizBookBtnText: {
    color: COLORS.textWhite,
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  categoryCardThreeCol: {
    width: (width - 48) / 3, // 3 Columns x 2 Rows Alignment
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  catSubText: {
    fontSize: 8,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 1,
  },
  upcomingContainer: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
  },
  upcomingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 10,
  },
  upcomingLogoBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.secondaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  upcomingTitleText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  upcomingSubText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
  },
  upcomingDateText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  },
  registerOutlineBtn: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  registerOutlineBtnText: {
    color: COLORS.primary,
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
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  whyTitleText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginTop: 6,
    textAlign: "center",
  },
  whySubText: {
    fontSize: 10,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
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
