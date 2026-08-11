import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  Platform,
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

export default function SearchScreen() {
  const router = useRouter();
  const { isDarkMode, themeColors } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useFocusEffect(
    useCallback(() => {
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

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setWorkshops([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const res = await getAllEventsAPI(1, 50);
      const list = res?.data?.events || res?.events || res?.data || res || [];

      const filtered = list.filter(
        (item) =>
          item.title?.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase()) ||
          item.location?.toLowerCase().includes(query.toLowerCase()),
      );

      setWorkshops(filtered);
    } catch (error) {
      console.log("Search error:", error);
      setWorkshops([]);
    } finally {
      setLoading(false);
    }
  };

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
            Search Workshops
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Search Input Bar */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: themeColors.cardBg,
              borderColor: themeColors.border,
            },
          ]}
        >
          <Ionicons name="search" size={20} color={themeColors.textSecondary} />
          <TextInput
            style={[styles.input, { color: themeColors.textPrimary }]}
            placeholder="Search by title, location, skill..."
            placeholderTextColor={themeColors.placeholder}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus={true}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={themeColors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Results List */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={themeColors.primary}
            style={{ marginTop: 40 }}
          />
        ) : (
          <FlatList
            data={workshops}
            keyExtractor={(item) => item._id || item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 110 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.resultCard,
                  {
                    backgroundColor: themeColors.cardBg,
                    borderColor: themeColors.border,
                  },
                ]}
                onPress={() =>
                  router.push(`/workshop-details?id=${item._id || item.id}`)
                }
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.resultTitle,
                      { color: themeColors.textPrimary },
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.resultDesc,
                      { color: themeColors.textSecondary },
                    ]}
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>
                  <View style={styles.metaRow}>
                    <Text
                      style={[
                        styles.metaText,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      📍 {item.location || "Madurai"}
                    </Text>
                    <Text
                      style={[styles.priceText, { color: themeColors.primary }]}
                    >
                      ₹{item.price || "499"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              searched ? (
                <View style={styles.emptyBox}>
                  <Ionicons
                    name="search-outline"
                    size={48}
                    color={themeColors.placeholder}
                  />
                  <Text
                    style={[
                      styles.emptyText,
                      { color: themeColors.textSecondary },
                    ]}
                  >
                    No workshops found matching &quot;{searchQuery}&quot;
                  </Text>
                </View>
              ) : (
                <View style={styles.emptyBox}>
                  <Ionicons
                    name="compass-outline"
                    size={48}
                    color={themeColors.placeholder}
                  />
                  <Text
                    style={[
                      styles.emptyText,
                      { color: themeColors.textSecondary },
                    ]}
                  >
                    Type above to search offline workshops &amp; courses.
                  </Text>
                </View>
              )
            }
          />
        )}
      </View>

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
    marginBottom: 16,
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  resultCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    marginBottom: 4,
  },
  resultDesc: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginBottom: 10,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingTop: 8,
  },
  metaText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
  },
  priceText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  emptyBox: {
    marginTop: 60,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    textAlign: "center",
    marginTop: 10,
  },
});
