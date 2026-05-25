// import React, { useState } from "react";
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function Signup({ navigation }) {
//   const [step, setStep] = useState("signup");
//   const [form, setForm] = useState({
//     fullName: "",
//     mobile: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     area: "",
//   });
//   const [documents, setDocuments] = useState({
//     aadhaar: false,
//     pan: false,
//   });
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);

//   const updateField = (key, value) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const updateOtp = (index, value) => {
//     const next = [...otp];
//     next[index] = value.slice(-1);
//     setOtp(next);
//   };

//   const markDocumentUploaded = (key) => {
//     setDocuments((prev) => ({ ...prev, [key]: true }));
//   };

//   const handleVerifyOtp = () => {
//     navigation?.navigate?.("SelectServices");
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="light-content" backgroundColor="#FFFFFF" />
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.container}
//       >
//         {step === "signup" ? (
//           <>
//             <Text style={styles.logo}>ServeNow</Text>
//             <Text style={styles.tagline}>Create your account</Text>

//             <View style={styles.progress}>
//               <View style={styles.done} />
//               <View style={styles.active} />
//               <View style={styles.inactive} />
//               <View style={styles.inactive} />
//             </View>

//             <View style={styles.tabRow}>
//               <TouchableOpacity
//                 style={styles.tab}
//                 onPress={() => navigation?.navigate("SignIn")}
//               >
//                 <Text style={styles.tabText}>Sign in</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={[styles.tab, styles.tabActive]}>
//                 <Text style={styles.tabActiveText}>Sign up</Text>
//               </TouchableOpacity>
//             </View>

//             <Text style={styles.label}>Full name</Text>
//             <TextInput
//               style={styles.input}
//               value={form.fullName}
//               onChangeText={(value) => updateField("fullName", value)}
//               placeholder="Enter full name"
//               placeholderTextColor="#E5E7EB"
//             />

//             <Text style={styles.label}>Mobile number</Text>
//             <View style={styles.phoneInput}>
//               <Text style={styles.flag}>+91</Text>
//               <TextInput
//                 style={styles.phoneTextInput}
//                 value={form.mobile}
//                 onChangeText={(value) => updateField("mobile", value)}
//                 keyboardType="phone-pad"
//                 placeholder="Enter mobile number"
//                 placeholderTextColor="#E5E7EB"
//               />
//             </View>

//             <Text style={styles.label}>Email address</Text>
//             <TextInput
//               style={styles.input}
//               value={form.email}
//               onChangeText={(value) => updateField("email", value)}
//               keyboardType="email-address"
//               autoCapitalize="none"
//               placeholder="Enter email address"
//               placeholderTextColor="#E5E7EB"
//             />

//             <View style={styles.row}>
//               <View style={styles.half}>
//                 <Text style={styles.label}>Password</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={form.password}
//                   onChangeText={(value) => updateField("password", value)}
//                   secureTextEntry
//                   placeholder="Enter password"
//                   placeholderTextColor="#E5E7EB"
//                 />
//               </View>

//               <View style={styles.half}>
//                 <Text style={styles.label}>Confirm</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={form.confirmPassword}
//                   onChangeText={(value) => updateField("confirmPassword", value)}
//                   secureTextEntry
//                   placeholder="Confirm password"
//                   placeholderTextColor="#E5E7EB"
//                 />
//               </View>
//             </View>

//             <Text style={styles.label}>City / Area</Text>
//             <TextInput
//               style={styles.input}
//               value={form.area}
//               onChangeText={(value) => updateField("area", value)}
//               placeholder="Enter city / area"
//               placeholderTextColor="#E5E7EB"
//             />

//             <Text style={styles.label}>Documents</Text>
//             <UploadRow
//               title="Aadhaar Card"
//               hint="Upload front and back side"
//               uploaded={documents.aadhaar}
//               onPress={() => markDocumentUploaded("aadhaar")}
//             />
//             <UploadRow
//               title="PAN Card"
//               hint="Upload clear PAN card image"
//               uploaded={documents.pan}
//               onPress={() => markDocumentUploaded("pan")}
//             />

//             <View style={styles.checkRow}>
//               <View style={styles.checkBox}>
//                 <Text style={styles.checkText}>✓</Text>
//               </View>

//               <Text style={styles.terms}>
//                 I agree to the <Text style={styles.link}>Terms of Service</Text>{" "}
//                 and <Text style={styles.link}>Privacy Policy</Text>
//               </Text>
//             </View>

//             <TouchableOpacity
//               style={styles.primaryBtn}
//               onPress={() => setStep("otp")}
//             >
//               <Text style={styles.primaryText}>Create Account</Text>
//             </TouchableOpacity>

//             <TouchableOpacity onPress={() => navigation?.navigate("SignIn")}>
//               <Text style={styles.bottomText}>
//                 Already have an account? <Text style={styles.link}>Sign in</Text>
//               </Text>
//             </TouchableOpacity>
//           </>
//         ) : (
//           <>
//             <Text style={styles.logo}>ServeNow</Text>
//             <Text style={styles.tagline}>Verify your number</Text>

//             <View style={styles.progress}>
//               <View style={styles.done} />
//               <View style={styles.done} />
//               <View style={styles.active} />
//               <View style={styles.inactive} />
//             </View>

//             <View style={styles.centerBox}>
//               <View style={styles.iconCircle}>
//                 <Text style={styles.icon}>OTP</Text>
//               </View>

//               <Text style={styles.title}>OTP sent</Text>
//               <Text style={styles.subtitle}>
//                 We sent a 6-digit code to{"\n"}
//                 <Text style={styles.bold}>
//                   +91 {form.mobile || "your mobile number"}
//                 </Text>
//               </Text>
//             </View>

//             <View style={styles.otpRow}>
//               {otp.map((value, index) => (
//                 <TextInput
//                   key={index}
//                   style={[styles.otpBox, value ? styles.otpFilled : null]}
//                   value={value}
//                   onChangeText={(nextValue) => updateOtp(index, nextValue)}
//                   keyboardType="number-pad"
//                   maxLength={1}
//                   textAlign="center"
//                 />
//               ))}
//             </View>

//             <Text style={styles.timer}>
//               Resend OTP in <Text style={styles.link}>00:28</Text>
//             </Text>

//             <TouchableOpacity style={styles.primaryBtn} onPress={handleVerifyOtp}>
//               <Text style={styles.primaryText}>Verify & Continue</Text>
//             </TouchableOpacity>

//             <TouchableOpacity onPress={() => setStep("signup")}>
//               <Text style={styles.changeText}>
//                 Wrong number? <Text style={styles.link}>Change</Text>
//               </Text>
//             </TouchableOpacity>
//           </>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// function UploadRow({ title, hint, uploaded, onPress }) {
//   return (
//     <View style={styles.uploadRow}>
//       <View style={styles.uploadTextWrap}>
//         <Text style={styles.uploadTitle}>{title}</Text>
//         <Text style={styles.uploadHint}>{uploaded ? "File selected" : hint}</Text>
//       </View>

//       <TouchableOpacity
//         style={[styles.uploadBtn, uploaded && styles.uploadBtnDone]}
//         onPress={onPress}
//         activeOpacity={0.85}
//       >
//         <Text style={[styles.uploadBtnText, uploaded && styles.uploadBtnTextDone]}>
//           {uploaded ? "Uploaded" : "Upload"}
//         </Text>
//       </TouchableOpacity>
//     </View>
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
//     fontSize: 24,
//     fontWeight: "800",
//     color: "#FFFFFF",
//     textAlign: "center",
//     marginTop: 8,
//   },

//   tagline: {
//     fontSize: 13,
//     color: "#FFFFFF",
//     textAlign: "center",
//     marginTop: 4,
//     marginBottom: 22,
//   },

//   progress: {
//     flexDirection: "row",
//     gap: 6,
//     marginBottom: 22,
//   },

//   done: {
//     flex: 1,
//     height: 5,
//     borderRadius: 8,
//     backgroundColor: "#1E1B4B",
//   },

//   active: {
//     flex: 1,
//     height: 5,
//     borderRadius: 8,
//     backgroundColor: "#1E1B4B",
//   },

//   inactive: {
//     flex: 1,
//     height: 5,
//     borderRadius: 8,
//     backgroundColor: "#1E1B4B",
//   },

//   tabRow: {
//     flexDirection: "row",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 12,
//     overflow: "hidden",
//     marginBottom: 22,
//   },

//   tab: {
//     flex: 1,
//     paddingVertical: 12,
//     alignItems: "center",
//   },

//   tabActive: {
//     backgroundColor: "#1E1B4B",
//   },

//   tabText: {
//     color: "#FFFFFF",
//     fontWeight: "600",
//   },

//   tabActiveText: {
//     color: "#FFFFFF",
//     fontWeight: "800",
//   },

//   label: {
//     fontSize: 13,
//     color: "#FFFFFF",
//     fontWeight: "700",
//     marginBottom: 7,
//   },

//   input: {
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 12,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     fontSize: 14,
//     color: "#FFFFFF",
//     marginBottom: 15,
//     backgroundColor: "#1E1B4B",
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
//     fontWeight: "800",
//     color: "#FFFFFF",
//     marginRight: 8,
//   },

//   phoneTextInput: {
//     flex: 1,
//     paddingVertical: 10,
//     fontSize: 14,
//     color: "#FFFFFF",
//   },

//   row: {
//     flexDirection: "row",
//     gap: 10,
//   },

//   half: {
//     flex: 1,
//   },

//   checkRow: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     marginTop: 4,
//     marginBottom: 18,
//     gap: 10,
//   },

//   uploadRow: {
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 12,
//     padding: 14,
//     marginBottom: 12,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#1E1B4B",
//   },

//   uploadTextWrap: {
//     flex: 1,
//     paddingRight: 10,
//   },

//   uploadTitle: {
//     color: "#FFFFFF",
//     fontSize: 14,
//     fontWeight: "800",
//   },

//   uploadHint: {
//     color: "#FFFFFF",
//     fontSize: 12,
//     fontWeight: "600",
//     marginTop: 4,
//   },

//   uploadBtn: {
//     borderRadius: 10,
//     backgroundColor: "#1E1B4B",
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//   },

//   uploadBtnDone: {
//     backgroundColor: "#1E1B4B",
//   },

//   uploadBtnText: {
//     color: "#FFFFFF",
//     fontSize: 12,
//     fontWeight: "900",
//   },

//   uploadBtnTextDone: {
//     color: "#FFFFFF",
//   },

//   checkBox: {
//     width: 20,
//     height: 20,
//     borderRadius: 6,
//     backgroundColor: "#1E1B4B",
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 2,
//   },

//   checkText: {
//     color: "#FFFFFF",
//     fontSize: 12,
//     fontWeight: "900",
//   },

//   terms: {
//     flex: 1,
//     fontSize: 12,
//     color: "#FFFFFF",
//     lineHeight: 18,
//   },

//   link: {
//     color: "#FFFFFF",
//     fontWeight: "800",
//   },

//   primaryBtn: {
//     backgroundColor: "#1E1B4B",
//     borderRadius: 13,
//     paddingVertical: 15,
//     alignItems: "center",
//     marginBottom: 16,
//   },

//   primaryText: {
//     color: "#FFFFFF",
//     fontWeight: "800",
//     fontSize: 15,
//   },

//   bottomText: {
//     textAlign: "center",
//     color: "#FFFFFF",
//     fontSize: 13,
//   },

//   centerBox: {
//     alignItems: "center",
//     marginVertical: 25,
//   },

//   iconCircle: {
//     width: 82,
//     height: 82,
//     borderRadius: 41,
//     backgroundColor: "#1E1B4B",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 14,
//   },

//   icon: {
//     color: "#FFFFFF",
//     fontSize: 18,
//     fontWeight: "900",
//   },

//   title: {
//     fontSize: 20,
//     color: "#FFFFFF",
//     fontWeight: "800",
//     marginBottom: 8,
//   },

//   subtitle: {
//     color: "#FFFFFF",
//     textAlign: "center",
//     lineHeight: 22,
//     fontSize: 14,
//   },

//   bold: {
//     color: "#FFFFFF",
//     fontWeight: "800",
//   },

//   otpRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 13,
//   },

//   otpBox: {
//     width: 42,
//     height: 48,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 10,
//     fontSize: 18,
//     fontWeight: "800",
//     color: "#FFFFFF",
//     backgroundColor: "#1E1B4B",
//   },

//   otpFilled: {
//     borderColor: "#E5E7EB",
//     backgroundColor: "#1E1B4B",
//     color: "#FFFFFF",
//   },

//   timer: {
//     textAlign: "center",
//     color: "#FFFFFF",
//     fontSize: 13,
//     marginBottom: 20,
//   },

//   changeText: {
//     textAlign: "center",
//     color: "#FFFFFF",
//     fontSize: 13,
//   },
// });





























import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ImageBackground,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { providerApi } from "../api/providerApi";
import AnimatedSignButton from "../components/AnimatedSignButton";

const OTP_RESEND_SECONDS = 60;

// ── Validation helpers ────────────────────────────────────────────────────────
function validateField(key, value, form = {}) {
  switch (key) {
    case "fullName":
      if (!value.trim()) return "Full name is required.";
      if (value.trim().length < 2) return "Name must be at least 2 characters.";
      return "";
    case "mobile": {
      const clean = value.replace(/\s/g, "");
      if (!clean) return "Mobile number is required.";
      if (!/^[6-9]\d{9}$/.test(clean))
        return "Enter a valid 10-digit Indian mobile number.";
      return "";
    }
    case "email":
      if (!value.trim()) return "Email address is required.";
      if (!/\S+@\S+\.\S+/.test(value)) return "Enter a valid email address.";
      return "";
    case "password":
      if (!value) return "Password is required.";
      if (value.length < 8) return "Password must be at least 8 characters.";
      return "";
    case "confirmPassword":
      if (!value) return "Please confirm your password.";
      if (value !== form.password) return "Passwords do not match.";
      return "";
    default:
      return "";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Signup({ navigation }) {
  const [step, setStep] = useState("signup");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    area: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ── Document state ────────────────────────────────────────────────────────
  const [aadhaar, setAadhaar] = useState(null); // { base64, mimeType, uri }
  const [pan, setPan] = useState(null);
  const [docErrors, setDocErrors] = useState({ aadhaar: "", pan: "" });

  // ── OTP state ─────────────────────────────────────────────────────────────
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(OTP_RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const otpRefs = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (step === "otp") startCountdown();
    return () => clearInterval(timerRef.current);
  }, [step]);

  const startCountdown = () => {
    setCountdown(OTP_RESEND_SECONDS);
    setCanResend(false);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current); setCanResend(true); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // ── Field helpers ─────────────────────────────────────────────────────────
  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    if (apiError) setApiError("");
  };

  const blurField = (key) => {
    const err = validateField(key, form[key], form);
    setErrors((prev) => ({ ...prev, [key]: err }));
  };

  const updateOtp = (index, value) => {
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    setOtpError("");
    setApiError("");
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (!value && index > 0) otpRefs.current[index - 1]?.focus();
  };

  // ── Image picker ─────────────────────────────────────────────────────────
  const pickImage = async (docType) => {
    try {
      // Ask permission — required on iOS, graceful on Android/web
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          setDocErrors((prev) => ({
            ...prev,
            [docType]: "Gallery permission is required to upload documents.",
          }));
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.7,
        // base64: true  ← remove this line, not needed anymore
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      // Derive MIME type from URI extension; default to jpeg
      const ext = (asset.uri.split(".").pop() || "jpg").toLowerCase();
      const mimeType = ext === "png" ? "image/png" : "image/jpeg";

      const docData = { uri: asset.uri, mimeType };

      if (docType === "aadhaar") {
        setAadhaar(docData);
        setDocErrors((prev) => ({ ...prev, aadhaar: "" }));
      } else {
        setPan(docData);
        setDocErrors((prev) => ({ ...prev, pan: "" }));
      }
    } catch (err) {
      setDocErrors((prev) => ({
        ...prev,
        [docType]: "Could not open gallery. Please try again.",
      }));
    }
  };

  // ── Full form validation ──────────────────────────────────────────────────
  const validateSignupForm = () => {
    const keys = ["fullName", "mobile", "email", "password", "confirmPassword"];
    const newErrors = {};
    let hasError = false;
    keys.forEach((key) => {
      const err = validateField(key, form[key], form);
      newErrors[key] = err;
      if (err) hasError = true;
    });
    setErrors(newErrors);

    // Validate documents
    const newDocErrors = { aadhaar: "", pan: "" };
    if (!aadhaar) { newDocErrors.aadhaar = "Aadhaar card is required."; hasError = true; }
    if (!pan) { newDocErrors.pan = "PAN card is required."; hasError = true; }
    setDocErrors(newDocErrors);

    return !hasError;
  };

  const friendlyError = (raw = "") => {
    if (raw.includes("already exists") && raw.includes("email"))
      return "This email is already registered. Try signing in instead.";
    if (raw.includes("already exists") && raw.includes("mobile"))
      return "This mobile number is already registered. Try signing in instead.";
    if (raw.includes("already exists"))
      return "An account with these details already exists. Try signing in.";
    if (raw.includes("Network") || raw.includes("fetch"))
      return "Cannot reach the server. Check your internet connection.";
    return raw || "Something went wrong. Please try again.";
  };

  // ── Step 1: Signup ────────────────────────────────────────────────────────
  const handleSignup = async () => {
    setApiError("");
    setSuccessMsg("");
    if (!validateSignupForm()) return;

    setLoading(true);
    try {
      await providerApi.signup({
        fullName: form.fullName.trim(),
        mobile: form.mobile.replace(/\s/g, ""),
        email: form.email.toLowerCase().trim(),
        password: form.password,
        area: form.area.trim() || undefined,
        aadhaar,   // { uri, base64, mimeType } — providerApi uses uri
        pan,       // { uri, base64, mimeType } — providerApi uses uri
      });

      setSuccessMsg(`OTP sent to +91 ${form.mobile.replace(/\s/g, '')}. Please check your SMS.`);
      setTimeout(() => { setSuccessMsg(""); setStep("otp"); }, 1000);
    } catch (err) {
      setApiError(friendlyError(err?.message));
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    if (!canResend) return;
    setApiError(""); setOtpError("");
    setLoading(true);
    try {
      await providerApi.sendOtp({ mobile: form.mobile.replace(/\s/g, ''), purpose: "SIGNUP" });
      setOtp(["", "", "", "", "", ""]);
      startCountdown();
      setSuccessMsg("A new OTP has been sent to your email.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setApiError(err?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    setOtpError(""); setApiError("");
    const otpString = otp.join("");
    if (otpString.length !== 6) { setOtpError("Please enter all 6 digits of the OTP."); return; }
    if (!/^\d{6}$/.test(otpString)) { setOtpError("OTP must contain digits only."); return; }

    setLoading(true);
    try {
      await providerApi.verifyOtp({
        mobile: form.mobile.replace(/\s/g, ''),
        otp: otpString,
        purpose: "SIGNUP",
      });
      setSuccessMsg("Mobile verified! Proceeding to skill selection…");
      setTimeout(() => {
        navigation?.navigate?.("SelectServices", { email: form.email.toLowerCase().trim() });
      }, 600);
    } catch (err) {
      const raw = err?.message || "";
      if (raw.includes("expired")) setOtpError("OTP has expired. Please request a new one.");
      else if (raw.includes("Incorrect") || raw.includes("incorrect"))
        setOtpError("Incorrect OTP. Please check the code in your email.");
      else if (raw.includes("already been used")) setOtpError("This OTP has already been used. Please request a new one.");
      else setApiError(raw || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {step === "signup" ? (
          <SignupForm
            form={form}
            errors={errors}
            loading={loading}
            apiError={apiError}
            successMsg={successMsg}
            aadhaar={aadhaar}
            pan={pan}
            docErrors={docErrors}
            navigation={navigation}
            updateField={updateField}
            blurField={blurField}
            onPickImage={pickImage}
            onSubmit={handleSignup}
          />
        ) : (
          <OtpForm
            form={form}
            otp={otp}
            loading={loading}
            countdown={countdown}
            canResend={canResend}
            otpRefs={otpRefs}
            otpError={otpError}
            apiError={apiError}
            successMsg={successMsg}
            updateOtp={updateOtp}
            onVerify={handleVerifyOtp}
            onResend={handleResendOtp}
            onChangeNumber={() => {
              clearInterval(timerRef.current);
              setOtp(["", "", "", "", "", ""]);
              setOtpError(""); setApiError("");
              setStep("signup");
            }}
          />
        )}
      </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function SignupForm({
  form, errors, loading, apiError, successMsg,
  aadhaar, pan, docErrors,
  navigation, updateField, blurField, onPickImage, onSubmit,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <>
      <Image source={require("../assets/worker.png")} style={styles.logoImage} />
      <Text style={styles.logo}>worker</Text>
      <Text style={styles.tagline}>Create your account</Text>
      <ProgressBar steps={4} filled={1} active={1} />

      <View style={styles.signupTitleRow}>
        <Text style={styles.signupTitleText}>Sign up</Text>
      </View>

      {apiError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.bannerIcon}>⚠️</Text>
          <Text style={styles.errorBannerText}>{apiError}</Text>
        </View>
      ) : null}

      {successMsg ? (
        <View style={styles.successBanner}>
          <Text style={styles.bannerIcon}>✅</Text>
          <Text style={styles.successBannerText}>{successMsg}</Text>
        </View>
      ) : null}

      {/* Full Name */}
      <Label>Full name</Label>
      <TextInput
        style={[styles.input, errors.fullName ? styles.inputError : null]}
        value={form.fullName}
        onChangeText={(v) => updateField("fullName", v)}
        onBlur={() => blurField("fullName")}
        placeholder="Enter full name"
        placeholderTextColor="#E5E7EB"
        autoCapitalize="words"
      />
      {errors.fullName ? <FieldError msg={errors.fullName} /> : null}

      {/* Mobile */}
      <Label>Mobile number</Label>
      <View style={[styles.phoneInput, errors.mobile ? styles.inputError : null]}>
        <Text style={styles.flag}>+91</Text>
        <TextInput
          style={styles.phoneTextInput}
          value={form.mobile}
          onChangeText={(v) => updateField("mobile", v)}
          onBlur={() => blurField("mobile")}
          keyboardType="phone-pad"
          placeholder="Enter mobile number"
          placeholderTextColor="#E5E7EB"
          maxLength={10}
        />
      </View>
      {errors.mobile ? <FieldError msg={errors.mobile} /> : null}

      {/* Email */}
      <Label>Email address</Label>
      <TextInput
        style={[styles.input, errors.email ? styles.inputError : null]}
        value={form.email}
        onChangeText={(v) => updateField("email", v)}
        onBlur={() => blurField("email")}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="Enter email address"
        placeholderTextColor="#E5E7EB"
      />
      {errors.email ? <FieldError msg={errors.email} /> : null}

      {/* Password row */}
      <View style={styles.row}>
        <View style={styles.half}>
          <Label>Password</Label>
          <View style={[styles.passwordWrap, errors.password ? styles.inputError : null]}>
            <TextInput
              style={styles.passwordInput}
              value={form.password}
              onChangeText={(v) => updateField("password", v)}
              onBlur={() => blurField("password")}
              secureTextEntry={!showPassword}
              placeholder="Min 8 chars"
              placeholderTextColor="#E5E7EB"
            />
            <TouchableOpacity onPress={() => setShowPassword((visible) => !visible)}>
              <Feather name={showPassword ? "eye-off" : "eye"} size={19} color="#FB923C" />
            </TouchableOpacity>
          </View>
          {errors.password ? <FieldError msg={errors.password} /> : null}
        </View>
        <View style={styles.half}>
          <Label>Confirm</Label>
          <View style={[styles.passwordWrap, errors.confirmPassword ? styles.inputError : null]}>
            <TextInput
              style={styles.passwordInput}
              value={form.confirmPassword}
              onChangeText={(v) => updateField("confirmPassword", v)}
              onBlur={() => blurField("confirmPassword")}
              secureTextEntry={!showConfirmPassword}
              placeholder="Repeat password"
              placeholderTextColor="#E5E7EB"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword((visible) => !visible)}>
              <Feather name={showConfirmPassword ? "eye-off" : "eye"} size={19} color="#FB923C" />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword ? <FieldError msg={errors.confirmPassword} /> : null}
        </View>
      </View>

      {/* Area */}
      <Label>City / Area</Label>
      <TextInput
        style={styles.input}
        value={form.area}
        onChangeText={(v) => updateField("area", v)}
        placeholder="e.g. Banjara Hills, Hyderabad"
        placeholderTextColor="#E5E7EB"
      />

      {/* Documents */}
      <Label>Documents</Label>

      <UploadRow
        title="Aadhaar Card"
        hint="Upload front and back side"
        docData={aadhaar}
        error={docErrors.aadhaar}
        onPress={() => onPickImage("aadhaar")}
      />

      <UploadRow
        title="PAN Card"
        hint="Upload clear PAN card image"
        docData={pan}
        error={docErrors.pan}
        onPress={() => onPickImage("pan")}
      />

      {/* Terms */}
      <View style={styles.checkRow}>
        <TouchableOpacity
          style={[styles.checkBox, !agreed && styles.checkBoxEmpty]}
          onPress={() => setAgreed((value) => !value)}
          activeOpacity={0.8}
        >
          {agreed ? <Text style={styles.checkText}>✓</Text> : null}
        </TouchableOpacity>
        <Text style={styles.terms}>
          I agree to the <Text style={styles.link}>Terms of Service</Text> and{" "}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </View>

      <AnimatedSignButton
        style={[styles.primaryBtn, (loading || !agreed) && styles.primaryBtnDisabled]}
        onPress={onSubmit}
        disabled={loading || !agreed}
      >
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color="#FFFFFF" size="small" />
            <Text style={[styles.primaryText, { marginLeft: 8 }]}>Creating account…</Text>
          </View>
        ) : (
          <Text style={styles.primaryText}>Create Account</Text>
        )}
      </AnimatedSignButton>

      <TouchableOpacity onPress={() => navigation?.navigate("SignIn")}>
        <Text style={styles.bottomText}>
          Already have an account? <Text style={styles.link}>Sign in</Text>
        </Text>
      </TouchableOpacity>
    </>
  );
}

// ── UploadRow — identical design to the original screenshot ──────────────────
function UploadRow({ title, hint, docData, error, onPress }) {
  return (
    <>
      <TouchableOpacity
        style={[styles.uploadRow, error ? styles.uploadRowError : null]}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <View style={styles.uploadTextWrap}>
          <Text style={styles.uploadTitle}>{title}</Text>
          <Text style={styles.uploadHint}>
            {docData ? "✓  File selected" : hint}
          </Text>
          {/* Thumbnail preview */}
          {docData?.uri ? (
            <Image
              source={{ uri: docData.uri }}
              style={styles.docThumb}
              resizeMode="cover"
            />
          ) : null}
        </View>
        <TouchableOpacity
          style={[styles.uploadBtn, docData && styles.uploadBtnDone]}
          onPress={onPress}
          activeOpacity={0.85}
        >
          <Text style={[styles.uploadBtnText, docData && styles.uploadBtnTextDone]}>
            {docData ? "Change" : "Upload"}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
      {error ? <FieldError msg={error} /> : null}
    </>
  );
}

function OtpForm({
  form, otp, loading, countdown, canResend,
  otpRefs, otpError, apiError, successMsg,
  updateOtp, onVerify, onResend, onChangeNumber,
}) {
  const pad = (n) => String(n).padStart(2, "0");
  return (
    <>
      <Text style={styles.logo}>ServeNow</Text>
      <Text style={styles.tagline}>Verify your mobile</Text>
      <ProgressBar steps={4} filled={2} active={2} />

      {apiError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.bannerIcon}>⚠️</Text>
          <Text style={styles.errorBannerText}>{apiError}</Text>
        </View>
      ) : null}
      {successMsg ? (
        <View style={styles.successBanner}>
          <Text style={styles.bannerIcon}>✅</Text>
          <Text style={styles.successBannerText}>{successMsg}</Text>
        </View>
      ) : null}

      <View style={styles.centerBox}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>📱</Text>
        </View>
        <Text style={styles.title}>Check your SMS</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit SMS code to{"\n"}
          <Text style={styles.bold}>+91 {form.mobile || "your mobile number"}</Text>
        </Text>
      </View>

      <View style={styles.otpRow}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            ref={(ref) => (otpRefs.current[index] = ref)}
            style={[
              styles.otpBox,
              value ? styles.otpFilled : null,
              otpError ? styles.otpBoxError : null,
            ]}
            value={value}
            onChangeText={(v) => updateOtp(index, v)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
          />
        ))}
      </View>

      {otpError ? (
        <View style={styles.otpErrorWrap}>
          <Text style={styles.otpErrorText}>{otpError}</Text>
        </View>
      ) : null}

      {canResend ? (
        <TouchableOpacity onPress={onResend} disabled={loading}>
          <Text style={[styles.timer, styles.resendActive]}>
            {loading ? "Sending…" : "Resend OTP"}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.timer}>
          Resend OTP in{" "}
          <Text style={styles.link}>
            {pad(Math.floor(countdown / 60))}:{pad(countdown % 60)}
          </Text>
        </Text>
      )}

      <AnimatedSignButton
        style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
        onPress={onVerify}
        disabled={loading}
      >
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color="#FFFFFF" size="small" />
            <Text style={[styles.primaryText, { marginLeft: 8 }]}>Verifying…</Text>
          </View>
        ) : (
          <Text style={styles.primaryText}>Verify &amp; Continue</Text>
        )}
      </AnimatedSignButton>

      <TouchableOpacity onPress={onChangeNumber}>
        <Text style={styles.changeText}>
          Wrong email? <Text style={styles.link}>Change</Text>
        </Text>
      </TouchableOpacity>
    </>
  );
}

function ProgressBar({ steps, filled, active }) {
  return (
    <View style={styles.progress}>
      {Array.from({ length: steps }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.progressSegment,
            i < filled ? styles.done : null,
            i === active && i >= filled ? styles.active : null,
          ]}
        />
      ))}
    </View>
  );
}

function Label({ children }) {
  return <Text style={styles.label}>{children}</Text>;
}

function FieldError({ msg }) {
  return <Text style={styles.fieldError}>{msg}</Text>;
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

  logoImage: { width: 76, height: 76, resizeMode: "contain", alignSelf: "center", marginTop: 8 },
  logo: { fontSize: 24, fontWeight: "800", color: "#FFFFFF", textAlign: "center", marginTop: 8, textTransform: "lowercase" },
  tagline: { fontSize: 13, color: "#E5E7EB", textAlign: "center", marginTop: 4, marginBottom: 22 },

  progress: { flexDirection: "row", gap: 6, marginBottom: 22 },
  progressSegment: { flex: 1, height: 5, borderRadius: 8, backgroundColor: "#E5E7EB" },
  done: { backgroundColor: "#FB923C" },
  active: { backgroundColor: "#FB923C" },

  tabRow: { flexDirection: "row", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, overflow: "hidden", marginBottom: 22 },
  signupTitleRow: { alignItems: "center", marginBottom: 20 },
  signupTitleText: { color: "#FFFFFF", fontSize: 24, fontWeight: "900", textAlign: "center" },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabActive: { backgroundColor: "#4F46E5" },
  tabText: { color: "#E5E7EB", fontWeight: "600" },
  tabActiveText: { color: "#FFFFFF", fontWeight: "800" },

  errorBanner: { flexDirection: "row", alignItems: "flex-start", backgroundColor: "#1E1B4B", borderWidth: 1, borderColor: "#FB923C", borderRadius: 10, padding: 12, marginBottom: 16, gap: 8 },
  successBanner: { flexDirection: "row", alignItems: "flex-start", backgroundColor: "#E5E7EB", borderWidth: 1, borderColor: "#22C55E", borderRadius: 10, padding: 12, marginBottom: 16, gap: 8 },
  bannerIcon: { fontSize: 15, marginTop: 1 },
  errorBannerText: { flex: 1, color: "#FB923C", fontSize: 13, fontWeight: "600", lineHeight: 18 },
  successBannerText: { flex: 1, color: "#22C55E", fontSize: 13, fontWeight: "600", lineHeight: 18 },

  label: { fontSize: 13, color: "#E5E7EB", fontWeight: "700", marginBottom: 7 },
  input: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: "#FFFFFF", marginBottom: 4, backgroundColor: "#1E1B4B" },
  passwordWrap: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 4, flexDirection: "row", alignItems: "center", backgroundColor: "#1E1B4B" },
  passwordInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: "#FFFFFF", minWidth: 0 },
  phoneInput: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 4, marginBottom: 4, flexDirection: "row", alignItems: "center", backgroundColor: "#1E1B4B" },
  flag: { fontSize: 14, fontWeight: "800", color: "#FFFFFF", marginRight: 8 },
  phoneTextInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: "#FFFFFF" },
  inputError: { borderColor: "#FB923C", backgroundColor: "#1E1B4B" },
  fieldError: { color: "#FB923C", fontSize: 12, fontWeight: "600", marginBottom: 10, marginLeft: 4 },

  row: { flexDirection: "row", gap: 10 },
  half: { flex: 1 },

  // ── Upload rows — matches original screenshot exactly ───────
  uploadRow: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1B4B",
  },
  uploadRowError: { borderColor: "#FB923C", backgroundColor: "#1E1B4B" },
  uploadTextWrap: { flex: 1, paddingRight: 10 },
  uploadTitle: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  uploadHint: { color: "#E5E7EB", fontSize: 12, fontWeight: "600", marginTop: 4 },
  docThumb: { width: 60, height: 40, borderRadius: 6, marginTop: 8 },
  uploadBtn: { borderRadius: 10, backgroundColor: "#4F46E5", paddingHorizontal: 16, paddingVertical: 10 },
  uploadBtnDone: { backgroundColor: "#E5E7EB" },
  uploadBtnText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },
  uploadBtnTextDone: { color: "#22C55E" },

  checkRow: { flexDirection: "row", alignItems: "flex-start", marginTop: 4, marginBottom: 18, gap: 10 },
  checkBox: { width: 20, height: 20, borderRadius: 6, backgroundColor: "#FB923C", alignItems: "center", justifyContent: "center", marginTop: 2 },
  checkBoxEmpty: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: "#E5E7EB" },
  checkText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },
  terms: { flex: 1, fontSize: 12, color: "#E5E7EB", lineHeight: 18 },
  link: { color: "#FB923C", fontWeight: "800" },

  primaryBtn: { backgroundColor: "#4F46E5", borderRadius: 13, paddingVertical: 15, alignItems: "center", marginBottom: 16 },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryText: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },
  loadingRow: { flexDirection: "row", alignItems: "center" },
  bottomText: { textAlign: "center", color: "#E5E7EB", fontSize: 13 },

  centerBox: { alignItems: "center", marginVertical: 25 },
  iconCircle: { width: 82, height: 82, borderRadius: 41, backgroundColor: "#E5E7EB", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  icon: { fontSize: 36 },
  title: { fontSize: 20, color: "#FFFFFF", fontWeight: "800", marginBottom: 8 },
  subtitle: { color: "#E5E7EB", textAlign: "center", lineHeight: 22, fontSize: 14 },
  bold: { color: "#FFFFFF", fontWeight: "800" },

  otpRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  otpBox: { width: 42, height: 48, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 10, fontSize: 18, fontWeight: "800", color: "#FFFFFF", backgroundColor: "#1E1B4B" },
  otpFilled: { borderColor: "#FB923C", backgroundColor: "#E5E7EB", color: "#FB923C" },
  otpBoxError: { borderColor: "#FB923C", backgroundColor: "#1E1B4B" },
  otpErrorWrap: { marginBottom: 12, alignItems: "center" },
  otpErrorText: { color: "#FB923C", fontSize: 13, fontWeight: "600", textAlign: "center" },
  timer: { textAlign: "center", color: "#E5E7EB", fontSize: 13, marginBottom: 20 },
  resendActive: { color: "#FB923C", fontWeight: "800", marginBottom: 20 },
  changeText: { textAlign: "center", color: "#E5E7EB", fontSize: 13 },
});
