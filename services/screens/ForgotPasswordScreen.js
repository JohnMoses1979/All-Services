import React, { useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { providerApi } from "../api/providerApi";

const ForgotPasswordScreen = ({ navigation, route }) => {
  const accountType = route?.params?.accountType === "worker" ? "worker" : "owner";
  const isWorker = accountType === "worker";
  const minPasswordLength = isWorker ? 8 : 5;

  const [step, setStep] = useState("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const cleanMobile = mobile.replace(/\D/g, "");

  const validateMobile = () => {
    if (!cleanMobile) return "Mobile number is required.";
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) return "Enter a valid 10-digit Indian mobile number.";
    return "";
  };

  const handleSendOtp = async () => {
    setError("");
    setSuccessMsg("");
    const mobileError = validateMobile();
    if (mobileError) {
      setError(mobileError);
      return;
    }

    setLoading(true);
    try {
      if (isWorker) {
        await providerApi.checkMobile(cleanMobile);
      } else {
        await providerApi.ownerCheckMobile(cleanMobile);
      }
      setStep("reset");
      setSuccessMsg(`OTP sent to +91 ${cleanMobile}.`);
    } catch (err) {
      setError(err?.message || "Could not send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const validateReset = () => {
    const mobileError = validateMobile();
    if (mobileError) return mobileError;
    if (!/^\d{6}$/.test(otp)) return "Enter the 6-digit OTP sent to your mobile.";
    if (!newPassword) return "New password is required.";
    if (newPassword.length < minPasswordLength) {
      return isWorker
        ? "Worker password must be at least 8 characters."
        : "Owner password must be at least 5 characters.";
    }
    if (newPassword !== confirmPassword) return "Passwords do not match.";
    return "";
  };

  const handleResetPassword = async () => {
    setError("");
    setSuccessMsg("");
    const resetError = validateReset();
    if (resetError) {
      setError(resetError);
      return;
    }

    setLoading(true);
    try {
      if (isWorker) {
        await providerApi.resetPassword(cleanMobile, otp, newPassword);
      } else {
        await providerApi.ownerResetPassword(cleanMobile, otp, newPassword);
      }
      setSuccessMsg("Password reset successfully. You can now sign in.");
      setTimeout(() => navigation.reset("Login"), 900);
    } catch (err) {
      setError(err?.message || "Password reset failed. Please check the OTP and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={isWorker ? require("../assets/workerbg.png") : require("../assets/shared image.jpg")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={[styles.overlay, isWorker && styles.workerOverlay]} />
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.contentWrap}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>

            <View style={styles.topSection}>
              <View style={styles.iconCircle}>
                <Ionicons name="lock-closed-outline" size={34} color={isWorker ? "#FB923C" : "#E8A020"} />
              </View>
              <Text style={styles.title}>Forgot Password</Text>
              <Text style={styles.subtitle}>
                {isWorker ? "Worker account" : "Owner account"} password reset
              </Text>
            </View>

            <View style={styles.card}>
              {!!error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
              {!!successMsg && (
                <View style={styles.successBox}>
                  <Text style={styles.successText}>{successMsg}</Text>
                </View>
              )}

              <Text style={styles.label}>Mobile Number</Text>
              <View style={styles.inputWrapper}>
                <Feather name="phone" size={22} color="#D7DCE5" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter registered mobile number"
                  placeholderTextColor="#BFC6D2"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={mobile}
                  editable={step === "mobile" && !loading}
                  onChangeText={(v) => {
                    setMobile(v.replace(/\D/g, ""));
                    setError("");
                  }}
                />
              </View>

              {step === "mobile" ? (
                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.disabledButton]}
                  onPress={handleSendOtp}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#0C1320" /> : <Text style={styles.primaryButtonText}>Send OTP</Text>}
                </TouchableOpacity>
              ) : (
                <>
                  <Text style={styles.label}>OTP</Text>
                  <View style={styles.inputWrapper}>
                    <Feather name="shield" size={22} color="#D7DCE5" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter 6-digit OTP"
                      placeholderTextColor="#BFC6D2"
                      keyboardType="number-pad"
                      maxLength={6}
                      value={otp}
                      onChangeText={(v) => {
                        setOtp(v.replace(/\D/g, ""));
                        setError("");
                      }}
                    />
                  </View>

                  <Text style={styles.label}>New Password</Text>
                  <View style={styles.inputWrapper}>
                    <Feather name="lock" size={22} color="#D7DCE5" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder={isWorker ? "Minimum 8 characters" : "Minimum 5 characters"}
                      placeholderTextColor="#BFC6D2"
                      secureTextEntry={!showNew}
                      value={newPassword}
                      onChangeText={(v) => {
                        setNewPassword(v);
                        setError("");
                      }}
                    />
                    <TouchableOpacity onPress={() => setShowNew((v) => !v)}>
                      <Feather name={showNew ? "eye-off" : "eye"} size={20} color="#D7DCE5" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={styles.inputWrapper}>
                    <Feather name="shield" size={22} color="#D7DCE5" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Re-enter new password"
                      placeholderTextColor="#BFC6D2"
                      secureTextEntry={!showConfirm}
                      value={confirmPassword}
                      onChangeText={(v) => {
                        setConfirmPassword(v);
                        setError("");
                      }}
                    />
                    <TouchableOpacity onPress={() => setShowConfirm((v) => !v)}>
                      <Feather name={showConfirm ? "eye-off" : "eye"} size={20} color="#D7DCE5" />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={[styles.primaryButton, loading && styles.disabledButton]}
                    onPress={handleResetPassword}
                    disabled={loading}
                  >
                    {loading ? <ActivityIndicator color="#0C1320" /> : <Text style={styles.primaryButtonText}>Reset Password</Text>}
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleSendOtp} disabled={loading}>
                    <Text style={styles.resendText}>Resend OTP</Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity onPress={() => navigation.reset("Login")}>
                <Text style={styles.backText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  backgroundImage: { opacity: 0.98 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(4, 22, 56, 0.64)",
  },
  workerOverlay: {
    backgroundColor: "rgba(30, 58, 138, 0.72)",
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 28,
  },
  contentWrap: { width: "100%", maxWidth: 460 },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    marginBottom: 8,
  },
  backIcon: { color: "#FFFFFF", fontSize: 24, fontWeight: "900" },
  topSection: { alignItems: "center", marginBottom: 18 },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: "#E5E7EB",
    textAlign: "center",
    fontWeight: "700",
  },
  card: {
    backgroundColor: "rgba(30, 58, 138, 0.88)",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  errorBox: {
    backgroundColor: "rgba(251,146,60,0.15)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(251,146,60,0.45)",
  },
  errorText: { color: "#FB923C", fontSize: 13, fontWeight: "700", lineHeight: 18 },
  successBox: {
    backgroundColor: "rgba(16,185,129,0.15)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.45)",
  },
  successText: { color: "#10B981", fontSize: 13, fontWeight: "700", lineHeight: 18 },
  label: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 9,
    marginLeft: 4,
  },
  inputWrapper: {
    minHeight: 62,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: "#FFFFFF", fontSize: 16, minWidth: 0 },
  primaryButton: {
    minHeight: 62,
    borderRadius: 20,
    backgroundColor: "#FB923C",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    marginTop: 4,
  },
  disabledButton: { opacity: 0.72 },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: "900",
    color: "#0C1320",
  },
  resendText: {
    color: "#E5E7EB",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 14,
  },
  backText: {
    fontSize: 15,
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "800",
  },
});

export default ForgotPasswordScreen;
