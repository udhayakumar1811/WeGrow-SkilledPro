import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../../constants/ThemeContext";

const { width } = Dimensions.get("window");

export default function IndexSplashScreen() {
  const router = useRouter();
  const { themeColors } = useTheme();

  // Animation Shared Values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);

  useEffect(() => {
    // 1. Fade In & Logo Zoom Animation
    opacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.ease),
    });
    scale.value = withTiming(1, {
      duration: 1200,
      easing: Easing.out(Easing.back(1.2)),
    });

    // 2. Automatically navigate to Home Screen after 2.5 seconds
    const timer = setTimeout(() => {
      router.replace("/home");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      {/* Main Square Logo in Center */}
      <Animated.View
        style={[
          styles.logoContainer,
          logoAnimatedStyle,
          {
            backgroundColor: themeColors.cardBg,
            shadowColor: themeColors.primary,
          },
        ]}
      >
        <Image
          source={require("../../assets/logo/logo_square.png")}
          style={styles.logo}
          contentFit="contain"
          transition={300}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 24,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  logo: {
    width: width * 0.65,
    height: width * 0.65,
  },
});
