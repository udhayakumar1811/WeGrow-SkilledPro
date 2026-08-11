import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Platform,
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
import { getUserProfileAPI } from "../../services/auth";

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 28 : 44;

export default function AccountInfoScreen() {
  const router = useRouter();
  const { isDarkMode, themeColors } = useTheme();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State for Editable Fields
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    college: "",
    course: "",
    department: "",
    year: "",
    companyName: "",
    businessType: "",
    designation: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

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

  const fetchProfile = async () => {
    try {
      const res = await getUserProfileAPI();
      const userData = res?.data || res?.user || res;
      setProfile(userData);

      // Populate Form State
      setForm({
        firstName: userData?.firstName || "Udhaya",
        lastName: userData?.lastName || "Kumar",
        email: userData?.email || "udhayakumar2959@gmail.com",
        phone: userData?.phone || "6381582969",
        college: userData?.college || "PSR Engineering College",
        course: userData?.course || "BE",
        department: userData?.department || "CSE",
        year: userData?.year || "3rd Year",
        companyName: userData?.companyName || "",
        businessType: userData?.businessType || "",
        designation: userData?.designation || "",
        city: userData?.city || "Madurai",
        state: userData?.state || "Tamil Nadu",
      });
    } catch (error) {
      console.log("Error fetching profile info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setIsEditing(false);
      Alert.alert(
        "Profile Updated 🎉",
        "Your account information has been updated successfully!",
      );
    }, 1000);
  };

  const isBusiness = profile?.role === "BUSINESS";

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
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color={themeColors.primary} />
          </TouchableOpacity>
          <Text
            style={[styles.headerTitle, { color: themeColors.textPrimary }]}
          >
            Account Information
          </Text>
          <TouchableOpacity
            style={[
              styles.editHeaderBtn,
              {
                backgroundColor: themeColors.cardBg,
                borderColor: themeColors.border,
              },
            ]}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Text
              style={[styles.editHeaderBtnText, { color: themeColors.primary }]}
            >
              {isEditing ? "Cancel" : "Edit"}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color={themeColors.primary}
              style={{ marginVertical: 40 }}
            />
          ) : (
            <>
              {/* Top Overview Avatar Card */}
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: themeColors.cardBg,
                    borderColor: themeColors.border,
                    shadowColor: themeColors.textPrimary,
                  },
                ]}
              >
                <View
                  style={[
                    styles.avatarWrapper,
                    { backgroundColor: themeColors.secondaryLight },
                  ]}
                >
                  <FontAwesome5
                    name={isBusiness ? "briefcase" : "user-graduate"}
                    size={30}
                    color={themeColors.primary}
                  />
                </View>
                <Text
                  style={[styles.userName, { color: themeColors.textPrimary }]}
                >
                  {form.firstName} {form.lastName}
                </Text>
                <View style={styles.badgeRow}>
                  <Text
                    style={[styles.roleTag, { color: themeColors.primary }]}
                  >
                    {profile?.role || "STUDENT"}
                  </Text>
                  <View style={styles.verifiedBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={12}
                      color="#22C55E"
                    />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                </View>
              </View>

              {/* Profile Details Form Box */}
              <View
                style={[
                  styles.infoCard,
                  {
                    backgroundColor: themeColors.cardBg,
                    borderColor: themeColors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.sectionHeaderTitle,
                    { color: themeColors.primary },
                  ]}
                >
                  Personal & Contact Details
                </Text>

                {/* First & Last Name Fields */}
                <View style={styles.rowFields}>
                  <View
                    style={[styles.inputGroup, { flex: 1, marginRight: 6 }]}
                  >
                    <Text
                      style={[
                        styles.label,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      First Name
                    </Text>
                    {isEditing ? (
                      <TextInput
                        style={[
                          styles.input,
                          {
                            backgroundColor: themeColors.inputBg,
                            borderColor: themeColors.border,
                            color: themeColors.textPrimary,
                          },
                        ]}
                        value={form.firstName}
                        onChangeText={(v) => setForm({ ...form, firstName: v })}
                      />
                    ) : (
                      <Text
                        style={[styles.val, { color: themeColors.textPrimary }]}
                      >
                        {form.firstName}
                      </Text>
                    )}
                  </View>

                  <View style={[styles.inputGroup, { flex: 1, marginLeft: 6 }]}>
                    <Text
                      style={[
                        styles.label,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      Last Name
                    </Text>
                    {isEditing ? (
                      <TextInput
                        style={[
                          styles.input,
                          {
                            backgroundColor: themeColors.inputBg,
                            borderColor: themeColors.border,
                            color: themeColors.textPrimary,
                          },
                        ]}
                        value={form.lastName}
                        onChangeText={(v) => setForm({ ...form, lastName: v })}
                      />
                    ) : (
                      <Text
                        style={[styles.val, { color: themeColors.textPrimary }]}
                      >
                        {form.lastName}
                      </Text>
                    )}
                  </View>
                </View>

                <View
                  style={[
                    styles.divider,
                    { backgroundColor: themeColors.border },
                  ]}
                />

                {/* Email Address */}
                <View style={styles.inputGroup}>
                  <Text
                    style={[styles.label, { color: themeColors.textSecondary }]}
                  >
                    Email Address
                  </Text>
                  {isEditing ? (
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: themeColors.inputBg,
                          borderColor: themeColors.border,
                          color: themeColors.textPrimary,
                        },
                      ]}
                      value={form.email}
                      keyboardType="email-address"
                      onChangeText={(v) => setForm({ ...form, email: v })}
                    />
                  ) : (
                    <Text
                      style={[styles.val, { color: themeColors.textPrimary }]}
                    >
                      {form.email}
                    </Text>
                  )}
                </View>

                <View
                  style={[
                    styles.divider,
                    { backgroundColor: themeColors.border },
                  ]}
                />

                {/* Phone Number */}
                <View style={styles.inputGroup}>
                  <Text
                    style={[styles.label, { color: themeColors.textSecondary }]}
                  >
                    Phone Number
                  </Text>
                  {isEditing ? (
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: themeColors.inputBg,
                          borderColor: themeColors.border,
                          color: themeColors.textPrimary,
                        },
                      ]}
                      value={form.phone}
                      keyboardType="phone-pad"
                      onChangeText={(v) => setForm({ ...form, phone: v })}
                    />
                  ) : (
                    <Text
                      style={[styles.val, { color: themeColors.textPrimary }]}
                    >
                      {form.phone}
                    </Text>
                  )}
                </View>

                <View
                  style={[
                    styles.divider,
                    { backgroundColor: themeColors.border },
                  ]}
                />

                {/* Role Specific Details */}
                {isBusiness ? (
                  <>
                    <View style={styles.inputGroup}>
                      <Text
                        style={[
                          styles.label,
                          { color: themeColors.textSecondary },
                        ]}
                      >
                        Company / Business Name
                      </Text>
                      {isEditing ? (
                        <TextInput
                          style={[
                            styles.input,
                            {
                              backgroundColor: themeColors.inputBg,
                              borderColor: themeColors.border,
                              color: themeColors.textPrimary,
                            },
                          ]}
                          value={form.companyName}
                          onChangeText={(v) =>
                            setForm({ ...form, companyName: v })
                          }
                        />
                      ) : (
                        <Text
                          style={[
                            styles.val,
                            { color: themeColors.textPrimary },
                          ]}
                        >
                          {form.companyName || "Tech Solutions"}
                        </Text>
                      )}
                    </View>

                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: themeColors.border },
                      ]}
                    />

                    <View style={styles.inputGroup}>
                      <Text
                        style={[
                          styles.label,
                          { color: themeColors.textSecondary },
                        ]}
                      >
                        Designation & Industry
                      </Text>
                      {isEditing ? (
                        <TextInput
                          style={[
                            styles.input,
                            {
                              backgroundColor: themeColors.inputBg,
                              borderColor: themeColors.border,
                              color: themeColors.textPrimary,
                            },
                          ]}
                          value={form.businessType}
                          onChangeText={(v) =>
                            setForm({ ...form, businessType: v })
                          }
                        />
                      ) : (
                        <Text
                          style={[
                            styles.val,
                            { color: themeColors.textPrimary },
                          ]}
                        >
                          {form.designation || "Founder"} -{" "}
                          {form.businessType || "Software"}
                        </Text>
                      )}
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.inputGroup}>
                      <Text
                        style={[
                          styles.label,
                          { color: themeColors.textSecondary },
                        ]}
                      >
                        College / Institution
                      </Text>
                      {isEditing ? (
                        <TextInput
                          style={[
                            styles.input,
                            {
                              backgroundColor: themeColors.inputBg,
                              borderColor: themeColors.border,
                              color: themeColors.textPrimary,
                            },
                          ]}
                          value={form.college}
                          onChangeText={(v) => setForm({ ...form, college: v })}
                        />
                      ) : (
                        <Text
                          style={[
                            styles.val,
                            { color: themeColors.textPrimary },
                          ]}
                        >
                          {form.college}
                        </Text>
                      )}
                    </View>

                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: themeColors.border },
                      ]}
                    />

                    <View style={styles.inputGroup}>
                      <Text
                        style={[
                          styles.label,
                          { color: themeColors.textSecondary },
                        ]}
                      >
                        Course & Department
                      </Text>
                      {isEditing ? (
                        <TextInput
                          style={[
                            styles.input,
                            {
                              backgroundColor: themeColors.inputBg,
                              borderColor: themeColors.border,
                              color: themeColors.textPrimary,
                            },
                          ]}
                          value={form.course}
                          onChangeText={(v) => setForm({ ...form, course: v })}
                        />
                      ) : (
                        <Text
                          style={[
                            styles.val,
                            { color: themeColors.textPrimary },
                          ]}
                        >
                          {form.course} - {form.department}
                        </Text>
                      )}
                    </View>

                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: themeColors.border },
                      ]}
                    />

                    <View style={styles.inputGroup}>
                      <Text
                        style={[
                          styles.label,
                          { color: themeColors.textSecondary },
                        ]}
                      >
                        Academic Year
                      </Text>
                      {isEditing ? (
                        <TextInput
                          style={[
                            styles.input,
                            {
                              backgroundColor: themeColors.inputBg,
                              borderColor: themeColors.border,
                              color: themeColors.textPrimary,
                            },
                          ]}
                          value={form.year}
                          onChangeText={(v) => setForm({ ...form, year: v })}
                        />
                      ) : (
                        <Text
                          style={[
                            styles.val,
                            { color: themeColors.textPrimary },
                          ]}
                        >
                          {form.year}
                        </Text>
                      )}
                    </View>
                  </>
                )}

                <View
                  style={[
                    styles.divider,
                    { backgroundColor: themeColors.border },
                  ]}
                />

                {/* City & State */}
                <View style={styles.rowFields}>
                  <View
                    style={[styles.inputGroup, { flex: 1, marginRight: 6 }]}
                  >
                    <Text
                      style={[
                        styles.label,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      City
                    </Text>
                    {isEditing ? (
                      <TextInput
                        style={[
                          styles.input,
                          {
                            backgroundColor: themeColors.inputBg,
                            borderColor: themeColors.border,
                            color: themeColors.textPrimary,
                          },
                        ]}
                        value={form.city}
                        onChangeText={(v) => setForm({ ...form, city: v })}
                      />
                    ) : (
                      <Text
                        style={[styles.val, { color: themeColors.textPrimary }]}
                      >
                        {form.city}
                      </Text>
                    )}
                  </View>

                  <View style={[styles.inputGroup, { flex: 1, marginLeft: 6 }]}>
                    <Text
                      style={[
                        styles.label,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      State
                    </Text>
                    {isEditing ? (
                      <TextInput
                        style={[
                          styles.input,
                          {
                            backgroundColor: themeColors.inputBg,
                            borderColor: themeColors.border,
                            color: themeColors.textPrimary,
                          },
                        ]}
                        value={form.state}
                        onChangeText={(v) => setForm({ ...form, state: v })}
                      />
                    ) : (
                      <Text
                        style={[styles.val, { color: themeColors.textPrimary }]}
                      >
                        {form.state}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {/* Save / Edit Bottom Button */}
              {isEditing ? (
                <TouchableOpacity
                  style={[
                    styles.saveBtn,
                    { backgroundColor: themeColors.primary },
                  ]}
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveBtnText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.toggleEditBtn,
                    {
                      backgroundColor: themeColors.cardBg,
                      borderColor: themeColors.border,
                    },
                  ]}
                  onPress={() => setIsEditing(true)}
                >
                  <Ionicons
                    name="create-outline"
                    size={18}
                    color={themeColors.primary}
                  />
                  <Text
                    style={[
                      styles.toggleEditText,
                      { color: themeColors.primary },
                    ]}
                  >
                    Edit Profile Details
                  </Text>
                </TouchableOpacity>
              )}

              <View style={{ height: 120 }} />
            </>
          )}
        </ScrollView>
      </View>

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
    paddingHorizontal: 20,
    paddingTop: 10,
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
  editHeaderBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  editHeaderBtnText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  roleTag: {
    fontSize: 11,
    fontFamily: FONTS.bold,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#DCFCE7",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  verifiedText: {
    color: "#22C55E",
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    marginBottom: 14,
  },
  rowFields: {
    flexDirection: "row",
  },
  inputGroup: {
    paddingVertical: 4,
  },
  label: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    marginBottom: 4,
  },
  val: {
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  saveBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  toggleEditBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 12,
  },
  toggleEditText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
});
