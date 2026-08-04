import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";

export default function BottomNavbar() {
  const router = useRouter();
  const pathname = usePathname();

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
    <View style={styles.bottomBar}>
      {navItems.map((item) => {
        const isActive = pathname === item.route;
        return (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => router.push(item.route)}
          >
            <Ionicons
              name={isActive ? item.activeIcon : item.icon}
              size={22}
              color={isActive ? COLORS.primary : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.navText,
                { color: isActive ? COLORS.primary : COLORS.textSecondary },
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: COLORS.cardBg,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 20,
    zIndex: 1000,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  navText: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    marginTop: 3,
  },
});
