import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { getAllEventsAPI } from "../../services/workshop";

export default function WorkshopScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  // Phone Hardware Back Button -> Go to Home Screen
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.replace("/home");
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => subscription.remove();
    }, []),
  );

  const fetchWorkshops = async () => {
    setLoading(true);
    try {
      const res = await getAllEventsAPI(1, 20);
      const data = res?.data || res?.events || res || [];
      if (Array.isArray(data)) {
        setWorkshops(data);
      }
    } catch (error) {
      console.log("Error fetching workshops API:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkshops = Array.isArray(workshops)
    ? workshops.filter(
        (item) =>
          item.title?.toLowerCase().includes(search.toLowerCase()) ||
          item.location?.toLowerCase().includes(search.toLowerCase()) ||
          item.type?.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {/* Header Back Arrow -> router.back() Goes to Previous Page */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Offline Workshops</Text>
          <TouchableOpacity onPress={fetchWorkshops}>
            <Ionicons name="refresh-outline" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.placeholder} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search workshops in Madurai, AI, MERN..."
            placeholderTextColor={COLORS.placeholder}
            value={search}
            onChangeText={setSearch}
          />
          {search !== "" && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={COLORS.placeholder}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* List Content */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
              style={{ marginVertical: 40 }}
            />
          ) : filteredWorkshops.length === 0 ? (
            <View style={styles.noDataBox}>
              <Ionicons
                name="search-outline"
                size={40}
                color={COLORS.placeholder}
              />
              <Text style={styles.noDataText}>
                No workshops found matching "{search}"
              </Text>
            </View>
          ) : (
            filteredWorkshops.map((item) => (
              <TouchableOpacity
                key={item._id || item.id}
                style={styles.card}
                activeOpacity={0.8}
                onPress={() =>
                  router.push(`/workshop-details?id=${item._id || item.id}`)
                }
              >
                <Image
                  source={{
                    uri:
                      item.image ||
                      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600",
                  }}
                  style={styles.image}
                  contentFit="cover"
                />
                <View style={styles.cardContent}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.info}>
                    {item.date
                      ? new Date(item.date).toLocaleDateString()
                      : "Upcoming"}{" "}
                    • {item.location || "Madurai"}
                  </Text>

                  <View style={styles.priceRow}>
                    <Text style={styles.priceText}>
                      Type: {item.type || "Offline"}
                    </Text>
                    <Text style={styles.priceText}>
                      Fee: ₹{item.price || "499"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>

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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  noDataBox: {
    padding: 40,
    alignItems: "center",
  },
  noDataText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontFamily: FONTS.regular,
    marginTop: 10,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 140,
  },
  cardContent: {
    padding: 16,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
  info: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginTop: 4,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    backgroundColor: COLORS.background,
    padding: 8,
    borderRadius: 8,
  },
  priceText: {
    color: COLORS.primary,
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
});
