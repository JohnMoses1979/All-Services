import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { providerApi } from "../api/providerApi";
import AnimatedSignButton from "../components/AnimatedSignButton";

const LoginScreen = ({ navigation }) => {
  const [role, setRole] = useState("Owner");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const isOwner = role === "Owner";

  const handleLogin = async () => {
    setApiError("");
    const cleanMobile = mobile.replace(/\D/g, "");

    if (!cleanMobile || !password) {
      setApiError("Enter mobile number and password.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setApiError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (isOwner) {
      setLoading(true);
      try {
        const response = await providerApi.ownerSignin({
          mobile: cleanMobile,
          password,
        });
        navigation.reset("Home", { owner: response?.data?.owner });
      } catch (err) {
        const raw = err?.message || "";
        if (raw.toLowerCase().includes("not registered")) {
          setApiError("This mobile number is not registered. Please sign up first.");
        } else if (raw.toLowerCase().includes("verify")) {
          setApiError("Please complete OTP verification before signing in.");
        } else if (raw.toLowerCase().includes("incorrect password")) {
          setApiError("Incorrect password. Please try again.");
        } else {
          setApiError(raw || "Owner login failed. Please try again.");
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const response = await providerApi.signin({
        mobile: cleanMobile,
        password,
      });
      navigation.reset("ProviderTabs", { provider: response?.data?.provider });
    } catch (err) {
      setApiError(err?.message || "Worker login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    navigation.navigate(isOwner ? "Signup" : "SignupAllInOne");
  };

  return (
    <ImageBackground
      source={isOwner ? require("../assets/shared image.jpg") : require("../assets/workerbg.png")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentWrap}>
            <View style={styles.brandBlock}>
              <View style={styles.logoCircle}>
                {isOwner ? (
                  <Ionicons name="home" size={34} color="#E9C978" />
                ) : (
                  <Image source={require("../assets/worker.png")} style={styles.workerLogoImage} />
                )}
              </View>
              {isOwner ? (
                <>
                  <Text style={styles.appTitle}>Community{"\n"}Connect</Text>
                  <Text style={styles.appSubtitle}>Choose your workspace to continue</Text>
                </>
              ) : (
                <>
                  <View style={styles.workerBrandTitle}>
                    <Text style={styles.workerBrandMain}>Cent</Text>
                    <Text style={styles.workerBrandAccent}>ra</Text>
                  </View>
                  <View style={styles.workerTaglinePill}>
                    <Text style={styles.workerTagline}>"One app. Every service. Always near."</Text>
                  </View>
                </>
              )}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Login Portal</Text>

              <View style={styles.choiceGrid}>
                <TouchableOpacity
                  style={[styles.choiceCard, isOwner && styles.adminChoice]}
                  onPress={() => setRole("Owner")}
                  activeOpacity={0.88}
                >
                  <View style={styles.choiceIcon}>
                    <MaterialIcons name="admin-panel-settings" size={26} color="#0B1220" />
                  </View>
                  <View style={styles.choiceTextWrap}>
                    <Text style={[styles.choiceTitle, isOwner && styles.adminChoiceTitle]}>Owner</Text>
                    <Text style={[styles.choiceSubtitle, isOwner && styles.adminChoiceSubtitle]}>
                      Browse service categories and bookings
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.choiceCard, !isOwner && styles.workerChoice]}
                  onPress={() => setRole("Worker")}
                  activeOpacity={0.88}
                >
                  <View style={[styles.choiceIcon, styles.workerIcon]}>
                    <Image source={require("../assets/worker.png")} style={styles.workerChoiceImage} />
                  </View>
                  <View style={styles.choiceTextWrap}>
                    <Text style={styles.choiceTitle}>Worker</Text>
                    <Text style={styles.choiceSubtitle}>Jobs, schedule, earnings, profile</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionLabel}>{isOwner ? "Owner login" : "Worker login"}</Text>

              {apiError ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{apiError}</Text>
                </View>
              ) : null}

              <Text style={styles.label}>Mobile Number</Text>
              <View style={styles.inputWrapper}>
                <Feather name="phone" size={21} color="#D7DCE5" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter 10-digit mobile number"
                  placeholderTextColor="#BFC6D2"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={mobile}
                  onChangeText={(v) => setMobile(v.replace(/\D/g, ""))}
                />
              </View>

              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={21} color="#D7DCE5" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={isOwner ? "Enter owner password" : "Enter worker password"}
                  placeholderTextColor="#BFC6D2"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword((visible) => !visible)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#EBCB7A"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.forgotWrap}
                onPress={() => navigation.navigate("ForgotPassword", { accountType: isOwner ? "owner" : "worker" })}
              >
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>

              <AnimatedSignButton
                style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator color="#FFFFFF" size="small" />
                    <Text style={[styles.primaryButtonText, styles.loadingText]}>Signing in...</Text>
                  </View>
                ) : (
                  <Text style={styles.primaryButtonText}>
                    {isOwner ? "Login as Owner" : "Login as Worker"}
                  </Text>
                )}
              </AnimatedSignButton>

              <TouchableOpacity onPress={handleSignup}>
                <Text style={styles.bottomText}>
                  {isOwner ? "New owner?" : "New worker?"}{" "}
                  <Text style={styles.linkText}>Register here</Text>
                </Text>
              </TouchableOpacity>
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
    backgroundColor: "rgba(4, 22, 56, 0.68)",
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
  contentWrap: {
    width: "100%",
    maxWidth: 460,
  },
  brandBlock: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  workerLogoImage: {
    width: 58,
    height: 58,
    resizeMode: "contain",
  },
  appTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 40,
  },
  appSubtitle: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "700",
    color: "#E7C779",
    textAlign: "center",
  },
  workerBrandTitle: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  workerBrandMain: {
    fontSize: 46,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 52,
  },
  workerBrandAccent: {
    fontSize: 46,
    fontWeight: "900",
    color: "#EBCB7A",
    lineHeight: 52,
  },
  workerTaglinePill: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(235,203,122,0.45)",
  },
  workerTagline: {
    fontSize: 13,
    fontWeight: "800",
    color: "#F7E4AE",
    textAlign: "center",
    lineHeight: 18,
  },
  card: {
    backgroundColor: "rgba(52, 62, 82, 0.9)",
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  cardTitle: {
    fontSize: 27,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 18,
  },
  choiceGrid: {
    gap: 12,
    marginBottom: 18,
  },
  choiceCard: {
    minHeight: 76,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  adminChoice: {
    backgroundColor: "rgba(235, 203, 122, 0.95)",
    borderColor: "#EBCB7A",
  },
  workerChoice: {
    backgroundColor: "rgba(255,255,255,0.13)",
    borderColor: "#EBCB7A",
  },
  choiceIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  workerIcon: {
    backgroundColor: "#1E3A8A",
  },
  workerChoiceImage: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  choiceTextWrap: {
    flex: 1,
  },
  choiceTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  adminChoiceTitle: {
    color: "#0B1220",
  },
  choiceSubtitle: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "700",
    color: "#D7DCE5",
    lineHeight: 17,
  },
  adminChoiceSubtitle: {
    color: "#263244",
  },
  sectionLabel: {
    color: "#EBCB7A",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 4,
    marginBottom: 14,
    textTransform: "uppercase",
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    minHeight: 62,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 11,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    minWidth: 0,
  },
  eyeButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  forgotWrap: {
    alignSelf: "flex-end",
    marginTop: -4,
    marginBottom: 14,
  },
  forgotText: {
    color: "#EBCB7A",
    fontSize: 13,
    fontWeight: "900",
  },
  primaryButton: {
    minHeight: 62,
    borderRadius: 20,
    backgroundColor: "#EBCB7A",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 18,
    paddingHorizontal: 14,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginLeft: 8,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
  },
  bottomText: {
    fontSize: 15,
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "700",
  },
  linkText: {
    color: "#EBCB7A",
    fontWeight: "900",
  },
});

export default LoginScreen;
