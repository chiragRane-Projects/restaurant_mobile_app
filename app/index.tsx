import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function OnboardingScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => router.push("/authScreen"));
  };

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.92,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.container}>
        {/* Subtle Background Pattern */}
        <View style={styles.waveBackgroundTop} />
        <View style={styles.waveBackgroundBottom} />

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>Welcome to Our Restaurant</Text>
            <View style={styles.titleUnderline} />
            <Text style={styles.subtitle}>
              Indulge in culinary delights crafted with passion, designed to elevate your dining experience.
            </Text>
          </View>

          {/* Enhanced Button */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleContinue}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
            >
              <View style={styles.buttonInner}>
                <Text style={styles.buttonText}>Start Your Journey</Text>
                <View style={styles.buttonArrow}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Simplified Progress Indicator */}
          <Animated.View style={[styles.progressIndicator, { opacity: fadeAnim }]}>
            <View style={styles.progressBar} />
          </Animated.View>
        </Animated.View>
      </View>
    </>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  waveBackgroundTop: {
    position: "absolute",
    top: -120,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(231, 76, 60, 0.08)",
    transform: [{ rotate: "45deg" }],
  },
  waveBackgroundBottom: {
    position: "absolute",
    bottom: -120,
    left: -120,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(241, 196, 15, 0.06)",
    transform: [{ rotate: "-30deg" }],
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    fontFamily: Platform.OS === "ios" ? "Avenir-Heavy" : "Roboto-Bold",
    color: "#2C3E50",
    marginBottom: 15,
    textAlign: "center",
    letterSpacing: -0.4,
  },
  titleUnderline: {
    width: 90,
    height: 5,
    backgroundColor: "#E74C3C",
    borderRadius: 3,
    marginBottom: 25,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: Platform.OS === "ios" ? "Avenir-Book" : "Roboto-Regular",
    color: "#5D6D7E",
    textAlign: "center",
    lineHeight: 28,
    paddingHorizontal: 15,
  },
  button: {
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 40,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 50,
    backgroundColor: "#E74C3C",
    borderRadius: 30,
    shadowColor: "#E74C3C",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: {
    fontSize: 19,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Avenir-Heavy" : "Roboto-Bold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  buttonArrow: {
    marginLeft: 12,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 15,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  progressIndicator: {
    position: "absolute",
    bottom: 30,
    alignItems: "center",
  },
  progressBar: {
    width: 60,
    height: 6,
    backgroundColor: "#E74C3C",
    borderRadius: 3,
  },
});