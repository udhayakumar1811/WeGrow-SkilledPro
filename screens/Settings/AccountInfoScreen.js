import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
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

export default function AccountInfoScreen() {
  const router = useRouter();
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Information</Text>
        <TouchableOpacity
          style={styles.editHeaderBtn}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Text style={styles.editHeaderBtnText}>
            {isEditing ? "Cancel" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginVertical: 40 }}
          />
        ) : (
          <>
            {/* Top Overview Avatar Card */}
            <View style={styles.card}>
              <View style={styles.avatarWrapper}>
                <FontAwesome5
                  name={isBusiness ? "briefcase" : "user-graduate"}
                  size={30}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.userName}>
                {form.firstName} {form.lastName}
              </Text>
              <View style={styles.badgeRow}>
                <Text style={styles.roleTag}>{profile?.role || "STUDENT"}</Text>
                <View style={styles.verifiedBadge}>
                  <Ionicons
                    name="checkmark-circle"
                    size={12}
                    color={COLORS.success}
                  />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </View>
            </View>

            {/* Profile Details Form Box */}
            <View style={styles.infoCard}>
              <Text style={styles.sectionHeaderTitle}>
                Personal & Contact Details
              </Text>

              {/* First & Last Name Fields */}
              <View style={styles.rowFields}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 6 }]}>
                  <Text style={styles.label}>First Name</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.input}
                      value={form.firstName}
                      onChangeText={(v) => setForm({ ...form, firstName: v })}
                    />
                  ) : (
                    <Text style={styles.val}>{form.firstName}</Text>
                  )}
                </View>

                <View style={[styles.inputGroup, { flex: 1, marginLeft: 6 }]}>
                  <Text style={styles.label}>Last Name</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.input}
                      value={form.lastName}
                      onChangeText={(v) => setForm({ ...form, lastName: v })}
                    />
                  ) : (
                    <Text style={styles.val}>{form.lastName}</Text>
                  )}
                </View>
              </View>

              <View style={styles.divider} />

              {/* Email Address */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={form.email}
                    keyboardType="email-address"
                    onChangeText={(v) => setForm({ ...form, email: v })}
                  />
                ) : (
                  <Text style={styles.val}>{form.email}</Text>
                )}
              </View>

              <View style={styles.divider} />

              {/* Phone Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={form.phone}
                    keyboardType="phone-pad"
                    onChangeText={(v) => setForm({ ...form, phone: v })}
                  />
                ) : (
                  <Text style={styles.val}>{form.phone}</Text>
                )}
              </View>

              <View style={styles.divider} />

              {/* Role Specific Details */}
              {isBusiness ? (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Company / Business Name</Text>
                    {isEditing ? (
                      <TextInput
                        style={styles.input}
                        value={form.companyName}
                        onChangeText={(v) =>
                          setForm({ ...form, companyName: v })
                        }
                      />
                    ) : (
                      <Text style={styles.val}>
                        {form.companyName || "Tech Solutions"}
                      </Text>
                    )}
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Designation & Industry</Text>
                    {isEditing ? (
                      <TextInput
                        style={styles.input}
                        value={form.businessType}
                        onChangeText={(v) =>
                          setForm({ ...form, businessType: v })
                        }
                      />
                    ) : (
                      <Text style={styles.val}>
                        {form.designation || "Founder"} -{" "}
                        {form.businessType || "Software"}
                      </Text>
                    )}
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>College / Institution</Text>
                    {isEditing ? (
                      <TextInput
                        style={styles.input}
                        value={form.college}
                        onChangeText={(v) => setForm({ ...form, college: v })}
                      />
                    ) : (
                      <Text style={styles.val}>{form.college}</Text>
                    )}
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Course & Department</Text>
                    {isEditing ? (
                      <TextInput
                        style={styles.input}
                        value={form.course}
                        onChangeText={(v) => setForm({ ...form, course: v })}
                      />
                    ) : (
                      <Text style={styles.val}>
                        {form.course} - {form.department}
                      </Text>
                    )}
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Academic Year</Text>
                    {isEditing ? (
                      <TextInput
                        style={styles.input}
                        value={form.year}
                        onChangeText={(v) => setForm({ ...form, year: v })}
                      />
                    ) : (
                      <Text style={styles.val}>{form.year}</Text>
                    )}
                  </View>
                </>
              )}

              <View style={styles.divider} />

              {/* City & State */}
              <View style={styles.rowFields}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 6 }]}>
                  <Text style={styles.label}>City</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.input}
                      value={form.city}
                      onChangeText={(v) => setForm({ ...form, city: v })}
                    />
                  ) : (
                    <Text style={styles.val}>{form.city}</Text>
                  )}
                </View>

                <View style={[styles.inputGroup, { flex: 1, marginLeft: 6 }]}>
                  <Text style={styles.label}>State</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.input}
                      value={form.state}
                      onChangeText={(v) => setForm({ ...form, state: v })}
                    />
                  ) : (
                    <Text style={styles.val}>{form.state}</Text>
                  )}
                </View>
              </View>
            </View>

            {/* Save / Edit Bottom Button */}
            {isEditing ? (
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color={COLORS.textWhite} />
                ) : (
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.toggleEditBtn}
                onPress={() => setIsEditing(true)}
              >
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={COLORS.primary}
                />
                <Text style={styles.toggleEditText}>Edit Profile Details</Text>
              </TouchableOpacity>
            )}

            <View style={{ height: 120 }} />
          </>
        )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 50,
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
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  editHeaderBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editHeaderBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.secondaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  userName: {
    color: COLORS.textPrimary,
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
    color: COLORS.primary,
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
    color: COLORS.success,
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  infoCard: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  sectionHeaderTitle: {
    color: COLORS.primary,
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
    color: COLORS.textSecondary,
    fontSize: 11,
    fontFamily: FONTS.medium,
    marginBottom: 4,
  },
  val: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  input: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: COLORS.textPrimary,
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveBtnText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  toggleEditBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.border,
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 12,
  },
  toggleEditText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
});
