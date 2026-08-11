import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FONTS } from "../../constants/fonts";
import { useTheme } from "../../constants/ThemeContext";

export default function BottomNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { themeColors } = useTheme();

  const navItems = [
    { label: "Home", route: "/home", icon: "home-outline", activeIcon: "home" },
    {
      label: "Workshops",
      route: "/workshops",
      icon: "calendar-outline",
      activeIcon: "calendar",
    },
    {
      label: "Bookings",
      route: "/my-bookings",
      icon: "ticket-outline",
      activeIcon: "ticket",
    },
    {
      label: "Rewards",
      route: "/rewards",
      icon: "gift-outline",
      activeIcon: "gift",
    },
    {
      label: "Profile",
      route: "/profile",
      icon: "person-outline",
      activeIcon: "person",
    },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.cardBg,
          borderTopColor: themeColors.border,
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      {navItems.map((item, index) => {
        const isActive = pathname === item.route;
        return (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() => router.push(item.route)}
          >
            <Ionicons
              name={isActive ? item.activeIcon : item.icon}
              size={22}
              color={isActive ? themeColors.primary : themeColors.textSecondary}
            />
            <Text
              style={[
                styles.navLabel,
                {
                  color: isActive
                    ? themeColors.primary
                    : themeColors.textSecondary,
                  fontFamily: isActive ? FONTS.bold : FONTS.regular,
                },
              ]}
            >
              {item.label}
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
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    paddingTop: 10,
    elevation: 10,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  navLabel: {
    fontSize: 10,
    marginTop: 4,
  },
});
