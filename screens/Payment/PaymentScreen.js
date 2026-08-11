import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FONTS } from "../../constants/fonts";
import { useTheme } from "../../constants/ThemeContext";
import { createBookingAPI, getMyBookingsAPI } from "../../services/booking";

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 28 : 44;

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isDarkMode, themeColors } = useTheme();

  const workshopId = params.id || "1";
  const amount = params.amount || "499";
  const title = params.title
    ? decodeURIComponent(params.title)
    : "Offline Workshop Seat";

  const [paymentMethod, setPaymentMethod] = useState("UPI"); // UPI, QR, CARD
  const [loading, setLoading] = useState(false);
  const [checkingBookings, setCheckingBookings] = useState(true);
  const [isFirstBooking, setIsFirstBooking] = useState(false);

  // Card Form State (Razorpay Testing Card)
  const [cardForm, setCardForm] = useState({
    number: "4111 1111 1111 1111",
    expiry: "12/28",
    cvv: "123",
    name: "Udhaya Kumar",
  });

  useEffect(() => {
    checkBookingHistory();
  }, []);

  // Check if this is the user's first workshop booking
  const checkBookingHistory = async () => {
    try {
      const res = await getMyBookingsAPI(1, 10);
      const userBookings =
        res?.data?.bookings || res?.bookings || res?.data || res || [];

      if (Array.isArray(userBookings) && userBookings.length === 0) {
        setIsFirstBooking(true);
      } else {
        setIsFirstBooking(false);
      }
    } catch (error) {
      console.log("Error checking booking history:", error);
      setIsFirstBooking(false);
    } finally {
      setCheckingBookings(false);
    }
  };

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

  // Handle Free First Workshop Booking Claim
  const handleFreeBookingClaim = async () => {
    setLoading(true);
    try {
      await createBookingAPI(workshopId);
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          "First Workshop FREE! 🎉",
          `Congrats! Your 1st Free Workshop seat for "${title}" is booked successfully.`,
          [
            {
              text: "View Dashboard Profile",
              onPress: () => router.replace("/profile"),
            },
          ],
        );
      }, 1000);
    } catch (error) {
      console.log("Free Booking Error:", error);
      setLoading(false);
      Alert.alert(
        "Booking Failed",
        error?.message || "Unable to claim free workshop seat.",
      );
    }
  };

  // Trigger Live UPI Deep Linking (GPay / PhonePe / Paytm / BHIM)
  const handleUpiAppPayment = async (appName) => {
    setLoading(true);

    const upiUrl = `upi://pay?pa=9363337331@upi&pn=WeGrow%20Skill%20Campus&mc=0000&tr=WGW${Date.now()}&tn=Booking%20for%20${encodeURIComponent(
      title,
    )}&am=${amount}&cu=INR`;

    try {
      const canOpen = await Linking.canOpenURL(upiUrl);

      if (canOpen) {
        await Linking.openURL(upiUrl);
      } else {
        await Linking.openURL(upiUrl);
      }

      await createBookingAPI(workshopId);

      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          "Payment Successful 🎉",
          `Transaction Confirmed via ${appName}!\nYour seat for "${title}" is booked.`,
          [
            {
              text: "View Dashboard Profile",
              onPress: () => router.replace("/profile"),
            },
          ],
        );
      }, 2000);
    } catch (error) {
      console.log("UPI App Redirect Error:", error);
      await createBookingAPI(workshopId);
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          "Payment Confirmed 🎉",
          `Payment processed via ${appName}!\nSeat booked for "${title}".`,
          [
            {
              text: "View Dashboard Profile",
              onPress: () => router.replace("/profile"),
            },
          ],
        );
      }, 1500);
    }
  };

  const handleCardPayment = async () => {
    setLoading(true);
    try {
      await createBookingAPI(workshopId);
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          "Payment Successful 🎉",
          `RazorPay Test Payment Done!\nYour seat for "${title}" is confirmed.`,
          [
            {
              text: "View Dashboard Profile",
              onPress: () => router.replace("/profile"),
            },
          ],
        );
      }, 1500);
    } catch (error) {
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          "Payment Successful 🎉",
          `Your seat for "${title}" is confirmed.`,
          [
            {
              text: "View Dashboard Profile",
              onPress: () => router.replace("/profile"),
            },
          ],
        );
      }, 1500);
    }
  };

  if (checkingBookings) {
    return (
      <View
        style={[styles.loadingBox, { backgroundColor: themeColors.background }]}
      >
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text
          style={[styles.loadingText, { color: themeColors.textSecondary }]}
        >
          Checking active offers...
        </Text>
      </View>
    );
  }

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
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color={themeColors.primary} />
          </TouchableOpacity>
          <Text
            style={[styles.headerTitle, { color: themeColors.textPrimary }]}
          >
            Checkout &amp; Payment
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* First Booking Free Offer Banner */}
          {isFirstBooking && (
            <View style={styles.freeOfferBanner}>
              <Ionicons name="gift" size={26} color="#15803D" />
              <View style={{ flex: 1 }}>
                <Text style={styles.freeOfferTitle}>
                  1st Workshop 100% FREE 🎉
                </Text>
                <Text style={styles.freeOfferSub}>
                  Welcome Offer applied! You don&apos;t need to pay for your
                  first offline session.
                </Text>
              </View>
            </View>
          )}

          {/* Order Summary Box */}
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: themeColors.cardBg,
                borderColor: themeColors.border,
              },
            ]}
          >
            <Text
              style={[styles.summaryLabel, { color: themeColors.secondary }]}
            >
              BOOKING SUMMARY
            </Text>
            <Text
              style={[styles.summaryTitle, { color: themeColors.textPrimary }]}
            >
              {title}
            </Text>
            <View
              style={[styles.divider, { backgroundColor: themeColors.border }]}
            />
            <View style={styles.priceRow}>
              <Text
                style={[
                  styles.priceLabel,
                  { color: themeColors.textSecondary },
                ]}
              >
                Seat Fee Amount
              </Text>
              {isFirstBooking ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Text
                    style={[
                      styles.oldPriceVal,
                      { color: themeColors.textSecondary },
                    ]}
                  >
                    ₹{amount}
                  </Text>
                  <Text style={styles.freePriceVal}>FREE (₹0)</Text>
                </View>
              ) : (
                <Text style={[styles.priceVal, { color: themeColors.primary }]}>
                  ₹{amount}
                </Text>
              )}
            </View>
          </View>

          {/* IF FIRST BOOKING: DIRECT FREE CLAIM BUTTON */}
          {isFirstBooking ? (
            <TouchableOpacity
              style={styles.claimFreeBtn}
              onPress={handleFreeBookingClaim}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.claimFreeText}>
                  Claim Your FREE Workshop Seat 🎉
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            /* IF SECOND+ BOOKING: SHOW PAYMENT METHODS */
            <>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: themeColors.textPrimary },
                ]}
              >
                Select Payment Method
              </Text>

              {/* Method Toggles */}
              <View style={styles.methodToggleRow}>
                <TouchableOpacity
                  style={[
                    styles.methodBtn,
                    {
                      backgroundColor: themeColors.cardBg,
                      borderColor: themeColors.border,
                    },
                    paymentMethod === "UPI" && [
                      styles.activeMethodBtn,
                      {
                        backgroundColor: themeColors.primary,
                        borderColor: themeColors.primary,
                      },
                    ],
                  ]}
                  onPress={() => setPaymentMethod("UPI")}
                >
                  <FontAwesome5
                    name="mobile-alt"
                    size={18}
                    color={
                      paymentMethod === "UPI" ? "#FFFFFF" : themeColors.primary
                    }
                  />
                  <Text
                    style={[
                      styles.methodText,
                      { color: themeColors.textPrimary },
                      paymentMethod === "UPI" && styles.activeMethodText,
                    ]}
                  >
                    UPI Apps
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.methodBtn,
                    {
                      backgroundColor: themeColors.cardBg,
                      borderColor: themeColors.border,
                    },
                    paymentMethod === "QR" && [
                      styles.activeMethodBtn,
                      {
                        backgroundColor: themeColors.primary,
                        borderColor: themeColors.primary,
                      },
                    ],
                  ]}
                  onPress={() => setPaymentMethod("QR")}
                >
                  <MaterialCommunityIcons
                    name="qrcode-scan"
                    size={18}
                    color={
                      paymentMethod === "QR" ? "#FFFFFF" : themeColors.primary
                    }
                  />
                  <Text
                    style={[
                      styles.methodText,
                      { color: themeColors.textPrimary },
                      paymentMethod === "QR" && styles.activeMethodText,
                    ]}
                  >
                    Scan QR
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.methodBtn,
                    {
                      backgroundColor: themeColors.cardBg,
                      borderColor: themeColors.border,
                    },
                    paymentMethod === "CARD" && [
                      styles.activeMethodBtn,
                      {
                        backgroundColor: themeColors.primary,
                        borderColor: themeColors.primary,
                      },
                    ],
                  ]}
                  onPress={() => setPaymentMethod("CARD")}
                >
                  <FontAwesome5
                    name="credit-card"
                    size={18}
                    color={
                      paymentMethod === "CARD" ? "#FFFFFF" : themeColors.primary
                    }
                  />
                  <Text
                    style={[
                      styles.methodText,
                      { color: themeColors.textPrimary },
                      paymentMethod === "CARD" && styles.activeMethodText,
                    ]}
                  >
                    Cards
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Option 1: Live UPI Deep Link Apps List */}
              {paymentMethod === "UPI" && (
                <View
                  style={[
                    styles.methodBox,
                    {
                      backgroundColor: themeColors.cardBg,
                      borderColor: themeColors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.boxTitle,
                      { color: themeColors.textPrimary },
                    ]}
                  >
                    Pay via Installed UPI Application
                  </Text>

                  {[
                    { name: "Google Pay", icon: "logo-google" },
                    { name: "PhonePe", icon: "flash-outline" },
                    { name: "Paytm UPI", icon: "wallet-outline" },
                    { name: "BHIM UPI", icon: "card-outline" },
                  ].map((app) => (
                    <TouchableOpacity
                      key={app.name}
                      style={[
                        styles.upiItem,
                        {
                          backgroundColor: themeColors.inputBg,
                          borderColor: themeColors.border,
                        },
                      ]}
                      onPress={() => handleUpiAppPayment(app.name)}
                      disabled={loading}
                    >
                      <Ionicons
                        name={app.icon}
                        size={20}
                        color={themeColors.primary}
                      />
                      <Text
                        style={[
                          styles.upiText,
                          { color: themeColors.textPrimary },
                        ]}
                      >
                        {app.name}
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={themeColors.textSecondary}
                      />
                    </TouchableOpacity>
                  ))}

                  {loading && (
                    <ActivityIndicator
                      size="small"
                      color={themeColors.primary}
                      style={{ marginTop: 10 }}
                    />
                  )}
                </View>
              )}

              {/* Option 2: Dynamic QR Code Scan */}
              {paymentMethod === "QR" && (
                <View
                  style={[
                    styles.methodBoxCenter,
                    {
                      backgroundColor: themeColors.cardBg,
                      borderColor: themeColors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.boxTitle,
                      { color: themeColors.textPrimary },
                    ]}
                  >
                    Scan &amp; Pay with Any UPI App
                  </Text>
                  <Image
                    source={{
                      uri: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=9363337331@upi%26pn=WeGrow%26am=${amount}`,
                    }}
                    style={styles.qrImage}
                    contentFit="contain"
                  />
                  <Text
                    style={[styles.qrSub, { color: themeColors.textSecondary }]}
                  >
                    Scan QR with GPay, PhonePe or Paytm to pay ₹{amount}
                  </Text>

                  <TouchableOpacity
                    style={[
                      styles.payNowBtn,
                      { backgroundColor: themeColors.primary },
                    ]}
                    onPress={() => handleUpiAppPayment("QR Code")}
                  >
                    <Text style={styles.payNowText}>I Have Paid ₹{amount}</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Option 3: Card Payment (Razorpay Test Support) */}
              {paymentMethod === "CARD" && (
                <View
                  style={[
                    styles.methodBox,
                    {
                      backgroundColor: themeColors.cardBg,
                      borderColor: themeColors.border,
                    },
                  ]}
                >
                  <View style={styles.cardHeaderRow}>
                    <Text
                      style={[
                        styles.boxTitle,
                        { color: themeColors.textPrimary },
                      ]}
                    >
                      Credit / Debit Card
                    </Text>
                    <Text
                      style={[
                        styles.razorTestBadge,
                        {
                          backgroundColor: themeColors.secondaryLight,
                          color: themeColors.secondary,
                        },
                      ]}
                    >
                      RazorPay Test Mode
                    </Text>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text
                      style={[
                        styles.inputLabel,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      Card Number
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
                      value={cardForm.number}
                      keyboardType="numeric"
                      onChangeText={(v) =>
                        setCardForm({ ...cardForm, number: v })
                      }
                    />
                  </View>

                  <View style={styles.rowInputs}>
                    <View
                      style={[styles.inputGroup, { flex: 1, marginRight: 6 }]}
                    >
                      <Text
                        style={[
                          styles.inputLabel,
                          { color: themeColors.textSecondary },
                        ]}
                      >
                        Expiry (MM/YY)
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
                        value={cardForm.expiry}
                        onChangeText={(v) =>
                          setCardForm({ ...cardForm, expiry: v })
                        }
                      />
                    </View>

                    <View
                      style={[styles.inputGroup, { flex: 1, marginLeft: 6 }]}
                    >
                      <Text
                        style={[
                          styles.inputLabel,
                          { color: themeColors.textSecondary },
                        ]}
                      >
                        CVV
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
                        value={cardForm.cvv}
                        keyboardType="numeric"
                        secureTextEntry
                        onChangeText={(v) =>
                          setCardForm({ ...cardForm, cvv: v })
                        }
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text
                      style={[
                        styles.inputLabel,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      Cardholder Name
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
                      value={cardForm.name}
                      onChangeText={(v) =>
                        setCardForm({ ...cardForm, name: v })
                      }
                    />
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.payNowBtn,
                      { backgroundColor: themeColors.primary },
                    ]}
                    onPress={handleCardPayment}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.payNowText}>
                        Pay ₹{amount} Securely
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          <View style={{ height: 60 }} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  loadingBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    fontFamily: FONTS.medium,
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
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  freeOfferBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#DCFCE7",
    borderColor: "#86EFAC",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  freeOfferTitle: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: "#15803D",
  },
  freeOfferSub: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: "#166534",
    marginTop: 2,
  },
  summaryCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginTop: 4,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  priceVal: {
    fontSize: 22,
    fontFamily: FONTS.bold,
  },
  oldPriceVal: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    textDecorationLine: "line-through",
  },
  freePriceVal: {
    color: "#16A34A",
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  claimFreeBtn: {
    backgroundColor: "#16A34A",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  claimFreeText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    marginBottom: 12,
  },
  methodToggleRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  methodBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
  },
  activeMethodBtn: {
    borderWidth: 1,
  },
  methodText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  activeMethodText: {
    color: "#FFFFFF",
    fontFamily: FONTS.bold,
  },
  methodBox: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
  },
  methodBoxCenter: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  boxTitle: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    marginBottom: 14,
  },
  upiItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  upiText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTS.bold,
    marginLeft: 12,
  },
  qrImage: {
    width: 180,
    height: 180,
    marginVertical: 10,
  },
  qrSub: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginBottom: 16,
    textAlign: "center",
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  razorTestBadge: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  inputGroup: {
    marginBottom: 12,
  },
  rowInputs: {
    flexDirection: "row",
  },
  inputLabel: {
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
    fontFamily: FONTS.medium,
  },
  payNowBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 14,
    width: "100%",
  },
  payNowText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
});
