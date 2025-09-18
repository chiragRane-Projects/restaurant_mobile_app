import { AuthContext } from "@/context/authContext";
import { useRouter } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [step, setStep] = useState("email"); 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const {login} = useContext(AuthContext);

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
    ]).start();
  }, []);

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

  const handleEmailSubmit = async () => {
    if (!name || !email || !address) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await fetch("https://restaurant-admin-backend.onrender.com/api/customers/email-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, address }),
      });
      const data = await response.json();
      if (response.ok && data.message === "OTP sent to email") {
        setStep("otp");
      } else {
        console.log("Email Submission:", data.message);
        setError(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.log("Email Submission:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await fetch("https://restaurant-admin-backend.onrender.com/api/customers/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (response.ok && data.message === "OTP verified successfully")
        {
        await login(data.token, data.customer)
        router.push("/(tabs)/Home");
      } else {
        setError(data.message || "Failed to verify OTP. Please try again.");
      }
    } catch (err) {
      console.log("OTP submission:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
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
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              {step === "email" ? "Join Our Restaurant" : "Verify Your OTP"}
            </Text>
            <View style={styles.titleUnderline} />
            <Text style={styles.subtitle}>
              {step === "email"
                ? "Enter your details to receive a one-time password."
                : "Enter the OTP sent to your email to log in."}
            </Text>
          </View>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            {step === "email" ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  placeholderTextColor="#5D6D7E"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#5D6D7E"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  value={address}
                  onChangeText={setAddress}
                  autoCapitalize="sentences"
                  placeholderTextColor="#5D6D7E"
                />
              </>
            ) : (
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                maxLength={6}
                placeholderTextColor="#5D6D7E"
              />
            )}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          {/* Button */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={styles.button}
              onPress={step === "email" ? handleEmailSubmit : handleOtpSubmit}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
              disabled={loading}
            >
              <View style={styles.buttonInner}>
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>
                      {step === "email" ? "Send OTP" : "Verify OTP"}
                    </Text>
                    <View style={styles.buttonArrow}>
                      <Text style={styles.arrowText}>→</Text>
                    </View>
                  </>
                )}
              </View>
            </TouchableOpacity>
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
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    fontFamily: Platform.OS === "ios" ? "Avenir-Heavy" : "Roboto-Bold",
    color: "#2C3E50",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: -0.4,
  },
  titleUnderline: {
    width: 80,
    height: 5,
    backgroundColor: "#E74C3C",
    borderRadius: 3,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 17,
    fontFamily: Platform.OS === "ios" ? "Avenir-Book" : "Roboto-Regular",
    color: "#5D6D7E",
    textAlign: "center",
    lineHeight: 26,
    paddingHorizontal: 15,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    fontFamily: Platform.OS === "ios" ? "Avenir-Book" : "Roboto-Regular",
    color: "#2C3E50",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(231, 76, 60, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  errorText: {
    fontSize: 14,
    color: "#E74C3C",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: Platform.OS === "ios" ? "Avenir-Book" : "Roboto-Regular",
  },
  button: {
    borderRadius: 30,
    overflow: "hidden",
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
});