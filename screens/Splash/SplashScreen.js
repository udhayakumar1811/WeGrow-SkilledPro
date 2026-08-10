import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { COLORS } from "../../constants/colors";

const { width } = Dimensions.get("window");

export default function IndexSplashScreen() {
  const router = useRouter();

  // Animation values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);

  useEffect(() => {
    // Fade-in animation
    opacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.ease),
    });

    // Zoom animation
    scale.value = withTiming(1, {
      duration: 1200,
      easing: Easing.out(Easing.back(1.2)),
    });

    // Navigate to Home after 2.5 seconds
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
    <Animated.View style={[styles.container, logoAnimatedStyle]}>
      <Image
        source={require("../../assets/logo/logo_square.png")}
        style={styles.logo}
        contentFit="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background || "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: width * 0.65,
    height: width * 0.65,
  },
});
