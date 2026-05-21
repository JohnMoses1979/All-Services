// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   StatusBar,
// } from "react-native";

// export default function SignIn({ navigation }) {
//   const [mobile, setMobile] = useState("");
//   const [password, setPassword] = useState("");

//   const openProviderTabs = () => {
//     if (navigation?.reset) {
//       navigation.reset("ProviderTabs");
//       return;
//     }

//     navigation?.navigate?.("ProviderTabs");
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="light-content" backgroundColor="#FFFFFF" />
//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={styles.logo}>ServeNow</Text>
//         <Text style={styles.tagline}>Welcome back! Sign in to continue</Text>

//         <Text style={styles.label}>Mobile number</Text>
//         <View style={styles.phoneInput}>
//           <Text style={styles.flag}>+91</Text>
//           <TextInput
//             style={styles.phoneTextInput}
//             value={mobile}
//             onChangeText={setMobile}
//             keyboardType="phone-pad"
//             placeholder="Enter mobile number"
//             placeholderTextColor="#E5E7EB"
//           />
//         </View>
//         <Text style={styles.label}>Password</Text>
//         <TextInput
//           style={styles.input}
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//           placeholder="Enter password"
//           placeholderTextColor="#E5E7EB"
//         />

//         <TouchableOpacity>
//           <Text style={styles.forgot}>Forgot password?</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.primaryBtn}
//           onPress={openProviderTabs}
//         >
//           <Text style={styles.primaryText}>Sign In</Text>
//         </TouchableOpacity>

//         <View style={styles.divider}>
//           <View style={styles.line} />
//           <Text style={styles.or}>or</Text>
//           <View style={styles.line} />
//         </View>

//         <TouchableOpacity style={styles.socialBtn}>
//           <Text style={styles.socialText}>Continue with Google</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.socialBtn}>
//           <Text style={styles.socialText}>Sign in with OTP</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => navigation?.navigate("SignupAllInOne")}>
//           <Text style={styles.bottomText}>
//             Don't have an account? <Text style={styles.link}>Register</Text>
//           </Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: "#1E1B4B",
//   },
//   container: {
//     padding: 22,
//     paddingBottom: 35,
//   },
//   logo: {
//     fontSize: 26,
//     fontWeight: "900",
//     color: "#FFFFFF",
//     textAlign: "center",
//     marginTop: 28,
//   },
//   tagline: {
//     color: "#FFFFFF",
//     textAlign: "center",
//     marginTop: 6,
//     marginBottom: 28,
//     fontSize: 14,
//   },
//   label: {
//     color: "#FFFFFF",
//     fontSize: 13,
//     fontWeight: "800",
//     marginBottom: 7,
//   },
//   phoneInput: {
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 12,
//     paddingHorizontal: 14,
//     paddingVertical: 4,
//     marginBottom: 15,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#1E1B4B",
//   },
//   flag: {
//     fontSize: 14,
//     marginRight: 8,
//   },
//   phoneTextInput: {
//     flex: 1,
//     paddingVertical: 10,
//     fontSize: 14,
//     color: "#FFFFFF",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 12,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     fontSize: 14,
//     color: "#FFFFFF",
//     marginBottom: 8,
//     backgroundColor: "#1E1B4B",
//   },
//   forgot: {
//     color: "#FFFFFF",
//     fontWeight: "800",
//     textAlign: "right",
//     marginBottom: 18,
//   },
//   primaryBtn: {
//     backgroundColor: "#1E1B4B",
//     borderRadius: 13,
//     paddingVertical: 15,
//     alignItems: "center",
//     marginBottom: 18,
//   },
//   primaryText: {
//     color: "#FFFFFF",
//     fontWeight: "900",
//     fontSize: 15,
//   },
//   divider: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     marginBottom: 14,
//   },
//   line: {
//     flex: 1,
//     height: 1,
//     backgroundColor: "#1E1B4B",
//   },
//   or: {
//     color: "#FFFFFF",
//     fontWeight: "700",
//   },
//   socialBtn: {
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 12,
//     paddingVertical: 13,
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   socialText: {
//     color: "#FFFFFF",
//     fontWeight: "800",
//   },
//   bottomText: {
//     color: "#FFFFFF",
//     textAlign: "center",
//     marginTop: 14,
//   },
//   link: {
//     color: "#FFFFFF",
//     fontWeight: "900",
//   },
// });

























import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { providerApi } from "../api/providerApi";
import AnimatedSignButton from "../components/AnimatedSignButton";

// ── Inline validation helper ──────────────────────────────────────────────────
function validateSignInForm(mobile, password) {
  const cleanMobile = mobile.replace(/\s/g, "").replace(/^\+91/, "");
  if (!cleanMobile) return "Please enter your mobile number.";
  if (!/^[6-9]\d{9}$/.test(cleanMobile))
    return "Enter a valid 10-digit Indian mobile number.";
  if (!password) return "Please enter your password.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  return null;
}

export default function SignIn({ navigation }) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Field-level inline errors ─────────────────────────────────────────────
  const [mobileError, setMobileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // ── Inline error banner (API errors) ─────────────────────────────────────
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ── Clear errors when user types ─────────────────────────────────────────
  const handleMobileChange = (val) => {
    setMobile(val);
    if (mobileError) setMobileError("");
    if (apiError) setApiError("");
  };

  const handlePasswordChange = (val) => {
    setPassword(val);
    if (passwordError) setPasswordError("");
    if (apiError) setApiError("");
  };

  // ── Inline field validation on blur ──────────────────────────────────────
  const validateMobileField = () => {
    const clean = mobile.replace(/\s/g, "").replace(/^\+91/, "");
    if (!clean) return setMobileError("Mobile number is required.");
    if (!/^[6-9]\d{9}$/.test(clean))
      return setMobileError("Enter a valid 10-digit Indian mobile number.");
    setMobileError("");
  };

  const validatePasswordField = () => {
    if (!password) return setPasswordError("Password is required.");
    if (password.length < 8)
      return setPasswordError("Password must be at least 8 characters.");
    setPasswordError("");
  };

  // ── Sign In ───────────────────────────────────────────────────────────────
  const handleSignIn = async () => {
    setApiError("");
    setSuccessMsg("");

    // Run validation
    const cleanMobile = mobile.replace(/\s/g, "").replace(/^\+91/, "");
    let hasError = false;

    if (!cleanMobile) {
      setMobileError("Mobile number is required.");
      hasError = true;
    } else if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setMobileError("Enter a valid 10-digit Indian mobile number.");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required.");
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      const response = await providerApi.signin({
        mobile: cleanMobile,
        password,
      });
      const provider = response?.data?.provider;
      navigation.reset("ProviderTabs", { provider });
    } catch (err) {
      // Map backend error messages to user-friendly inline messages
      const raw = err?.message || "";

      if (
        raw.includes("Invalid mobile") ||
        raw.includes("Invalid mobile number or password")
      ) {
        setApiError("Incorrect mobile number or password. Please try again.");
      } else if (raw.includes("verify your email")) {
        setApiError(
          "Your email is not verified yet. Please check your inbox for the OTP."
        );
      } else if (raw.includes("complete skill selection")) {
        setApiError(
          "Registration incomplete. Please complete your skill selection first."
        );
      } else if (raw.includes("suspended")) {
        setApiError(
          "Your account has been suspended. Please contact support@servenow.in."
        );
      } else if (raw.includes("Network") || raw.includes("fetch")) {
        setApiError(
          "Cannot reach the server. Check your internet connection and try again."
        );
      } else if (raw.includes("403") || raw.includes("Forbidden")) {
        setApiError(
          "Access denied. Please check your credentials and try again."
        );
      } else {
        setApiError(
          raw || "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ── OTP Sign In ──────────────────────────────────────────────────────────
  const handleOtpSignIn = () => {
    navigation?.navigate?.("OtpSignIn");
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <ImageBackground
      source={require("../assets/workerbg.png")}
      style={styles.bgImage}
      imageStyle={styles.bgImageInner}
      resizeMode="cover"
    >
      <View style={styles.bgOverlay} />
      <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1B4B" />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        </View>

        <Image source={require("../assets/worker.png")} style={styles.logoImage} />
        <Text style={styles.logo}>worker</Text>
        <Text style={styles.tagline}>Welcome back! Sign in to continue</Text>

        {/* ── API Error Banner ─────────────────────────────── */}
        {apiError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerIcon}>⚠️</Text>
            <Text style={styles.errorBannerText}>{apiError}</Text>
          </View>
        ) : null}

        {/* ── Success Banner ───────────────────────────────── */}
        {successMsg ? (
          <View style={styles.successBanner}>
            <Text style={styles.successBannerIcon}>✅</Text>
            <Text style={styles.successBannerText}>{successMsg}</Text>
          </View>
        ) : null}

        {/* ── Mobile ──────────────────────────────────────── */}
        <Text style={styles.label}>Mobile number</Text>
        <View
          style={[
            styles.phoneInput,
            mobileError ? styles.inputError : null,
          ]}
        >
          <Text style={styles.flag}>+91</Text>
          <TextInput
            style={styles.phoneTextInput}
            value={mobile}
            onChangeText={handleMobileChange}
            onBlur={validateMobileField}
            keyboardType="phone-pad"
            placeholder="Enter mobile number"
            placeholderTextColor="#E5E7EB"
            maxLength={10}
            returnKeyType="next"
          />
        </View>
        {mobileError ? (
          <Text style={styles.fieldError}>{mobileError}</Text>
        ) : null}

        {/* ── Password ─────────────────────────────────────── */}
        <Text style={styles.label}>Password</Text>
        <View
          style={[
            styles.passwordWrap,
            passwordError ? styles.inputError : null,
          ]}
        >
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={handlePasswordChange}
            onBlur={validatePasswordField}
            secureTextEntry={!showPassword}
            placeholder="Enter password"
            placeholderTextColor="#E5E7EB"
            returnKeyType="done"
            onSubmitEditing={handleSignIn}
          />
          <TouchableOpacity
            onPress={() => setShowPassword((v) => !v)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#FB923C"
            />
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <Text style={styles.fieldError}>{passwordError}</Text>
        ) : null}

        {/* ── Forgot Password ──────────────────────────────── */}
        <TouchableOpacity
          onPress={() => navigation?.navigate?.("ForgotPassword", { accountType: "worker" })}
          style={styles.forgotWrap}
        >
          <Text style={styles.forgot}>Forgot password?</Text>
        </TouchableOpacity>

        {/* ── Sign In Button ───────────────────────────────── */}
        <AnimatedSignButton
          style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#FFFFFF" size="small" />
              <Text style={[styles.primaryText, { marginLeft: 8 }]}>
                Signing in…
              </Text>
            </View>
          ) : (
            <Text style={styles.primaryText}>Sign In</Text>
          )}
        </AnimatedSignButton>

        {/* ── Divider ──────────────────────────────────────── */}
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.or}>or</Text>
          <View style={styles.line} />
        </View>

        {/* ── OTP Sign In ──────────────────────────────────── */}
        <TouchableOpacity
          style={styles.socialBtn}
          onPress={handleOtpSignIn}
          activeOpacity={0.85}
        >
          <Text style={styles.socialText}>Sign in with OTP</Text>
        </TouchableOpacity>

        {/* ── Register ─────────────────────────────────────── */}
        <TouchableOpacity
          onPress={() => navigation?.navigate?.("SignupAllInOne")}
        >
          <Text style={styles.bottomText}>
            Don't have an account?{" "}
            <Text style={styles.link}>Register</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#1E1B4B",
  },
  bgImageInner: {
    width: "100%",
    height: "100%",
    opacity: 0.95,
  },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(30, 27, 75, 0.72)",
  },
  safe: { flex: 1 },
  container: { flexGrow: 1, padding: 22, paddingBottom: 35 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  backArrow: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  logo: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 8,
    textTransform: "lowercase",
  },
  logoImage: {
    width: 82,
    height: 82,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 24,
  },
  tagline: {
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 28,
    fontSize: 14,
  },

  // ── Banners ────────────────────────────────────────────────
  errorBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#1E1B4B",
    borderWidth: 1,
    borderColor: "#FB923C",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorBannerIcon: { fontSize: 15, marginTop: 1 },
  errorBannerText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },

  successBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#1E1B4B",
    borderWidth: 1,
    borderColor: "#FB923C",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  successBannerIcon: { fontSize: 15, marginTop: 1 },
  successBannerText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },

  // ── Form ───────────────────────────────────────────────────
  label: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 7,
  },

  phoneInput: {
    borderWidth: 1,
    borderColor: "#FB923C",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1B4B",
  },
  flag: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
    marginRight: 8,
  },
  phoneTextInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: "#FFFFFF",
  },

  passwordWrap: {
    borderWidth: 1,
    borderColor: "#FB923C",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1B4B",
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: "#FFFFFF",
  },
  eyeBtn: { fontSize: 16, paddingHorizontal: 4 },

  inputError: {
    borderColor: "#FB923C",
    backgroundColor: "#1E1B4B",
  },
  fieldError: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 12,
    marginLeft: 4,
  },

  forgotWrap: { alignItems: "flex-end", marginBottom: 18, marginTop: 4 },
  forgot: { color: "#FB923C", fontWeight: "800" },

  primaryBtn: {
    backgroundColor: "#4F46E5",
    borderRadius: 13,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 18,
  },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryText: { color: "#FFFFFF", fontWeight: "900", fontSize: 15 },
  loadingRow: { flexDirection: "row", alignItems: "center" },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  line: { flex: 1, height: 1, backgroundColor: "#E5E7EB" },
  or: { color: "#E5E7EB", fontWeight: "700" },

  socialBtn: {
    borderWidth: 1,
    borderColor: "#FB923C",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    marginBottom: 10,
  },
  socialText: { color: "#E5E7EB", fontWeight: "800" },

  bottomText: { color: "#E5E7EB", textAlign: "center", marginTop: 14 },
  link: { color: "#FB923C", fontWeight: "900" },
});
