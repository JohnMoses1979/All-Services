import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { providerApi } from "../api/providerApi";
import { getOwnerColors } from "../styles/ownerPreferences";

const RAZORPAY_KEY_ID = "rzp_test_SlBQXlGgog4aYP";
const DEFAULT_AMOUNT = 500;

const showMessage = (title, message) => {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.alert(`${title}\n${message}`);
    return;
  }
  Alert.alert(title, message);
};

const loadRazorpayWebCheckout = () =>
  new Promise((resolve, reject) => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      reject(new Error("Razorpay checkout is only available in the browser."));
      return;
    }

    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error("Could not load Razorpay checkout."));
    document.body.appendChild(script);
  });

const openNativeCheckout = async (options) => {
  let RazorpayCheckout;
  try {
    const razorpayModule = require("react-native-razorpay");
    RazorpayCheckout = razorpayModule.default || razorpayModule;
  } catch (error) {
    throw new Error(
      "Razorpay mobile checkout needs a custom Android/iOS build. It will not run inside Expo Go."
    );
  }
  if (!RazorpayCheckout?.open) {
    throw new Error("Razorpay native module is not linked in this mobile build.");
  }
  try {
    return await RazorpayCheckout.open(options);
  } catch (error) {
    if (
      String(error?.message || error).toLowerCase().includes("open") &&
      String(error?.message || error).toLowerCase().includes("null")
    ) {
      throw new Error("Razorpay native checkout is not linked in this app build.");
    }
    throw error;
  }
};

const openWebCheckout = async (options) => {
  const Razorpay = await loadRazorpayWebCheckout();
  return new Promise((resolve, reject) => {
    const checkout = new Razorpay({
      ...options,
      handler: resolve,
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled")),
      },
    });
    checkout.on("payment.failed", (response) => {
      reject(new Error(response?.error?.description || "Payment failed"));
    });
    checkout.open();
  });
};

export default function PaymentScreen({ navigation, route }) {
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(false);
  const autoStartedRef = useRef(false);
  const amount = route?.params?.amount || DEFAULT_AMOUNT;
  const colors = getOwnerColors(owner?.theme || "light");

  useEffect(() => {
    let active = true;
    providerApi.getLocalOwner().then((profile) => {
      if (active) setOwner(profile);
    });
    return () => {
      active = false;
    };
  }, []);

  const prefill = useMemo(
    () => ({
      name: owner?.fullName || "Owner",
      email: owner?.email || "customer@gmail.com",
      contact: owner?.mobile || "",
    }),
    [owner]
  );

  const startPayment = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const orderResponse = await providerApi.createPaymentOrder(amount);
      const order = orderResponse?.data || orderResponse;
      const orderId = order?.id || order?.orderId;

      if (!orderId || !order?.amount) {
        throw new Error("Payment order was not created correctly. Please try again.");
      }

      const options = {
        key: order.keyId || RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Servixo",
        description: "Service Booking Payment",
        order_id: orderId,
        prefill,
        theme: { color: colors.primary || "#2563EB" },
      };

      const paymentData =
        Platform.OS === "web"
          ? await openWebCheckout(options)
          : await openNativeCheckout(options);

      const verifyResult = await providerApi.verifyPayment(paymentData);

      if (verifyResult?.success || verifyResult?.data?.success) {
        showMessage("Success", "Payment completed successfully.");
        navigation?.navigate?.("Home");
        return;
      }

      showMessage("Failed", verifyResult?.message || "Payment verification failed.");
    } catch (error) {
      showMessage("Payment Failed", error?.description || error?.message || "Payment cancelled.");
    } finally {
      setLoading(false);
    }
  }, [amount, colors.primary, loading, navigation, prefill]);

  useEffect(() => {
    if (!route?.params?.autoStart || autoStartedRef.current) return;
    autoStartedRef.current = true;
    const timer = setTimeout(startPayment, 350);
    return () => clearTimeout(timer);
  }, [route?.params?.autoStart, startPayment]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={owner?.theme === "dark" ? "light-content" : "dark-content"} />
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation?.goBack?.()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Payment</Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.containerContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.iconCircle, { backgroundColor: colors.surfaceAlt }]}>
            <Feather name="credit-card" size={34} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Razorpay Checkout</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Pay securely using UPI, card, wallet, or net banking.
          </Text>
          <Text style={[styles.amount, { color: colors.text }]}>
            Rs {amount.toLocaleString("en-IN")}
          </Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }, loading && styles.buttonDisabled]}
            onPress={startPayment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Feather name="lock" size={18} color="#FFFFFF" />
                <Text style={styles.buttonText}>Pay with Razorpay</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
  },
  header: {
    minHeight: 72,
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 2,
    elevation: 3,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
  },
  container: {
    flex: 1,
  },
  containerContent: {
    flexGrow: 1,
    padding: 22,
    paddingTop: 36,
    paddingBottom: 34,
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 23,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 320,
  },
  amount: {
    fontSize: 38,
    fontWeight: "900",
    marginVertical: 28,
  },
  button: {
    width: "100%",
    minHeight: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonDisabled: {
    opacity: 0.75,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    marginLeft: 9,
  },
});
