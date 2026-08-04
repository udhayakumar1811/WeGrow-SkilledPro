import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import { COLORS } from "../../constants/colors";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);

  useEffect(() => {
    // Logo Fade-In and Scale Animation
    opacity.value = withTiming(1, {
      duration: 1200,
      easing: Easing.out(Easing.ease),
    });
    scale.value = withTiming(1, {
      duration: 1500,
      easing: Easing.out(Easing.back(1.5)),
    });

    // Navigate to Home Screen after 3 seconds
    const timer = setTimeout(() => {
      router.replace("/home");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <Image
          source={require("../../assets/logo/logo_square.png")}
          style={styles.logo}
          contentFit="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cardBg, // White Background
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: width * 0.65,
    height: width * 0.65,
  },
});
