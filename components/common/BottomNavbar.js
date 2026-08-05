import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";

export default function BottomNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const navItems = [
    { name: "Home", route: "/home", icon: "home-outline", activeIcon: "home" },
    {
      name: "Workshops",
      route: "/workshops",
      icon: "calendar-outline",
      activeIcon: "calendar",
    },
    {
      name: "Pass",
      route: "/membership",
      icon: "card-outline",
      activeIcon: "card",
    },
    {
      name: "Profile",
      route: "/profile",
      icon: "person-outline",
      activeIcon: "person",
    },
  ];

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.route;
        return (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => router.replace(item.route)}
          >
            <Ionicons
              name={isActive ? item.activeIcon : item.icon}
              size={22}
              color={isActive ? COLORS.primary : COLORS.placeholder}
            />
            <Text style={[styles.navText, isActive && styles.activeNavText]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: COLORS.cardBg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    paddingHorizontal: 16,
    elevation: 8,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 11,
    color: COLORS.placeholder,
    fontFamily: FONTS.medium,
    marginTop: 3,
  },
  activeNavText: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
});
