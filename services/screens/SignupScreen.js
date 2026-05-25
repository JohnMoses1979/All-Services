import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  StatusBar,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons, Feather, FontAwesome5 } from "@expo/vector-icons";
import { providerApi } from "../api/providerApi";
import AnimatedSignButton from "../components/AnimatedSignButton";

const SignupScreen = ({ navigation }) => {
  const [role, setRole] = useState("Admin");
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [societyName, setSocietyName] = useState("");
  const [flatNo, setFlatNo] = useState("");
  const [address, setAddress] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [success, setSuccess] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOwnerSignup = async () => {
    setError("");
    const cleanMobile = mobile.replace(/\D/g, "");
    if (!fullName.trim() || !cleanMobile || !password || !confirmPassword) {
      setError("Enter name, mobile number, password, and confirm password.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (password.length < 5) {
      setError("Password must be at least 5 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await providerApi.ownerSignup({
        fullName: fullName.trim(),
        mobile: cleanMobile,
        societyName,
        flatNo,
        address,
        password,
      });
      setOtpSent(true);
      setSuccess(`OTP sent to +91 ${cleanMobile}. Enter it to verify your account.`);
    } catch (err) {
      const raw = err?.message || "";
      if (raw.toLowerCase().includes("already registered") || raw.toLowerCase().includes("already exists")) {
        setError("This mobile number is already registered. Please login.");
      } else {
        setError(raw || "Could not create owner account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setSuccess("");
    const cleanMobile = mobile.replace(/\D/g, "");
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit OTP sent to your mobile number.");
      return;
    }

    setLoading(true);
    try {
      const response = await providerApi.ownerVerifyOtp(cleanMobile, otp);
      setVerified(true);
      setSuccess(response?.message || "Welcome. Your mobile is verified. Please sign in.");
    } catch (err) {
      setError(err?.message || "Could not verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/shared image.jpg")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.contentWrap}>
            <View style={styles.topSection}>
              <Text style={styles.createTitle}>Create Account</Text>
              <Text style={styles.subTop}>Register as Admin </Text>
            </View>

            <View style={styles.card}>
              <View style={styles.roleRow}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    role === "Admin" ? styles.activeRoleDark : styles.inactiveRole,
                  ]}
                  onPress={() => setRole("Admin")}
                >
                  <MaterialIcons
                    name="verified-user"
                    size={22}
                    color={role === "Admin" ? "#FFFFFF" : "#E8F5F5"}
                    style={styles.roleIcon}
                  />
                  <Text
                    style={[
                      styles.roleText,
                      role === "Admin" ? styles.activeRoleText : styles.inactiveRoleText,
                    ]}
                  >
                    Admin
                  </Text>
                </TouchableOpacity>

              </View>

              {!!error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
              {!!success && (
                <View style={styles.successBox}>
                  <Text style={styles.successText}>{success}</Text>
                </View>
              )}

              {verified ? (
                <>
                  <View style={styles.verifiedIcon}>
                    <Ionicons name="checkmark-circle" size={58} color="#E8F5F5" />
                  </View>
                  <Text style={styles.welcomeTitle}>Welcome to Servixo</Text>
                  <Text style={styles.welcomeText}>Your owner account is ready. Please sign in to continue.</Text>
                  <AnimatedSignButton
                    style={styles.primaryButton}
                    onPress={() => navigation.reset("Login")}
                  >
                    <Text style={styles.primaryButtonText}>Go to Sign In</Text>
                  </AnimatedSignButton>
                </>
              ) : otpSent ? (
                <>
                  <Text style={styles.label}>Enter OTP</Text>
                  <View style={styles.inputWrapper}>
                    <Feather name="shield" size={22} color="#E8F5F5" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="6-digit OTP"
                      placeholderTextColor="#E8A020"
                      keyboardType="number-pad"
                      maxLength={6}
                      value={otp}
                      onChangeText={(v) => setOtp(v.replace(/\D/g, ""))}
                    />
                  </View>

                  <AnimatedSignButton
                    style={[styles.primaryButton, loading && styles.disabledButton]}
                    onPress={handleVerifyOtp}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.primaryButtonText}>Verify OTP</Text>
                    )}
                  </AnimatedSignButton>
                </>
              ) : (
                <>
              <Text style={styles.label}>Full Name</Text>

              <View style={styles.inputWrapper}>
                <Feather name="user" size={22} color="#E8F5F5" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter full name"
                  placeholderTextColor="#E8A020"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>

              <Text style={styles.label}>Mobile Number</Text>
              <View style={styles.inputWrapper}>
                <Feather name="phone" size={22} color="#E8F5F5" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter 10-digit mobile number"
                  placeholderTextColor="#E8A020"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={mobile}
                  onChangeText={(v) => setMobile(v.replace(/\D/g, ""))}
                />
              </View>

              <Text style={styles.label}>Society Name</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="apartment" size={22} color="#E8F5F5" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter society name"
                  placeholderTextColor="#E8A020"
                  value={societyName}
                  onChangeText={setSocietyName}
                />
              </View>

              <Text style={styles.label}>Flat / House Number</Text>
              <View style={styles.inputWrapper}>
                <FontAwesome5 name="home" size={20} color="#E8F5F5" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter flat / house number"
                  placeholderTextColor="#E8A020"
                  value={flatNo}
                  onChangeText={setFlatNo}
                />
              </View>

              <Text style={styles.label}>Address</Text>
              <View style={[styles.inputWrapper, styles.addressInputWrapper]}>
                <Feather name="map-pin" size={22} color="#E8F5F5" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.addressInput]}
                  placeholder="Enter address"
                  placeholderTextColor="#E8A020"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                />
              </View>

              <Text style={styles.label}>Set 5-Digit Password</Text>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={22} color="#E8F5F5" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter 5-digit password"
                  placeholderTextColor="#E8A020"
                  keyboardType="number-pad"
                  maxLength={5}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <Feather name="shield" size={22} color="#E8F5F5" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter 5-digit password"
                  placeholderTextColor="#E8A020"
                  keyboardType="number-pad"
                  maxLength={5}
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>

              <AnimatedSignButton
                style={[styles.primaryButton, loading && styles.disabledButton]}
                onPress={handleOwnerSignup}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Create Account</Text>
                )}
              </AnimatedSignButton>

              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.bottomText}>
                  Already have an account? <Text style={styles.linkText}>Log In</Text>
                </Text>
              </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.98,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(4, 22, 56, 0.64)",
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 25,
    paddingBottom: 30,
  },
  contentWrap: {
    width: "100%",
    maxWidth: 460,
  },
  topSection: {
    alignItems: "center",
    marginBottom: 14,
  },
  createTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
  },
  subTop: {
    marginTop: 6,
    color: "#E8A020",
    fontSize: 16,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "rgba(67, 76, 95, 0.86)",
    borderRadius: 34,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  roleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  roleButton: {
    width: "47.5%",
    height: 78,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  inactiveRole: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderColor: "rgba(255,255,255,0.10)",
  },
  activeRoleDark: {
    backgroundColor: "rgba(255,255,255,0.10)",
    borderColor: "rgba(255,255,255,0.15)",
  },
  activeRoleGold: {
    backgroundColor: "#E8F5F5",
    borderColor: "#E8F5F5",
  },
  roleIcon: {
    marginRight: 8,
  },
  roleText: {
    fontSize: 17,
    fontWeight: "800",
  },
  activeRoleText: {
    color: "#FFFFFF",
  },
  activeGoldRoleText: {
    color: "#1A7A7A",
  },
  inactiveRoleText: {
    color: "#FFFFFF",
  },
  label: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 10,
    marginLeft: 4,
  },
  errorBox: {
    backgroundColor: "rgba(232,160,32,0.16)",
    borderColor: "rgba(232,160,32,0.5)",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#F0C060",
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18,
  },
  successBox: {
    backgroundColor: "rgba(232,245,245,0.16)",
    borderColor: "rgba(232,245,245,0.5)",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  successText: {
    color: "#E8F5F5",
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18,
  },
  verifiedIcon: {
    alignItems: "center",
    marginVertical: 10,
  },
  welcomeTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 4,
  },
  welcomeText: {
    color: "#E8F5F5",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 18,
  },
  inputWrapper: {
    height: 74,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 12,
    width: 24,
    textAlign: "center",
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 17,
  },
  addressInputWrapper: {
    minHeight: 96,
    alignItems: "flex-start",
    paddingTop: 18,
  },
  addressInput: {
    minHeight: 62,
    textAlignVertical: "top",
  },
  primaryButton: {
    height: 74,
    borderRadius: 24,
    backgroundColor: "#E8F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.72,
  },
  primaryButtonText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  bottomText: {
    fontSize: 15,
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "600",
  },
  linkText: {
    color: "#E8F5F5",
    fontWeight: "800",
  },
});

export default SignupScreen;

