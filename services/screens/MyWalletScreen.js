// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   Platform,
// } from "react-native";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import BottomNavBar from "../components/BottomNavBar";
// import { OWNER_COLORS } from "../styles/ownerTheme";

// const COLORS = {
//   bg: OWNER_COLORS.background,
//   green: OWNER_COLORS.primary,
//   purple: OWNER_COLORS.primary,
//   text: OWNER_COLORS.text,
//   muted: OWNER_COLORS.muted,
//   border: OWNER_COLORS.border,
//   red: OWNER_COLORS.danger,
//   orange: OWNER_COLORS.accent,
//   blue: OWNER_COLORS.primaryLight,
//   surface: OWNER_COLORS.surface,
//   surfaceAlt: OWNER_COLORS.surfaceAlt,
// };

// const TRANSACTIONS = [
//   {
//     id: "1",
//     title: "Added to Wallet",
//     date: "12 May 2024, 10:30 AM",
//     amount: "+ ₹500",
//     type: "credit",
//     icon: "plus",
//     bg: "#F0FAFA",
//     color: COLORS.green,
//   },
//   {
//     id: "2",
//     title: "Deep Cleaning",
//     date: "12 May 2024, 11:00 AM",
//     amount: "- ₹499",
//     type: "debit",
//     icon: "broom",
//     bg: "#F0FAFA",
//     color: COLORS.red,
//   },
//   {
//     id: "3",
//     title: "Salon at Home",
//     date: "10 May 2024, 02:00 PM",
//     amount: "- ₹299",
//     type: "debit",
//     icon: "face-woman",
//     bg: "#F0FAFA",
//     color: "#1A7A7A",
//   },
//   {
//     id: "4",
//     title: "Cashback Received",
//     date: "08 May 2024, 09:15 AM",
//     amount: "+ ₹50",
//     type: "credit",
//     icon: "gift-outline",
//     bg: "#F0FAFA",
//     color: COLORS.orange,
//   },
//   {
//     id: "5",
//     title: "Added to Wallet",
//     date: "05 May 2024, 04:45 PM",
//     amount: "+ ₹300",
//     type: "credit",
//     icon: "plus",
//     bg: "#F0FAFA",
//     color: COLORS.green,
//   },
// ];

// export default function MyWalletScreen({ navigation }) {
//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />

//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <TouchableOpacity
//             style={styles.backBtn}
//             onPress={() => navigation?.goBack?.()}
//             activeOpacity={0.8}
//           >
//             <Ionicons name="arrow-back" size={24} color={COLORS.text} />
//           </TouchableOpacity>

//           <Text style={styles.headerTitle}>My Wallet</Text>
//         </View>

//         <TouchableOpacity style={styles.bellBtn}>
//           <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         <View style={styles.walletCard}>
//           <View>
//             <Text style={styles.walletLabel}>Wallet Balance</Text>
//             <Text style={styles.walletAmount}>₹1,250.00</Text>

//             <TouchableOpacity style={styles.addMoneyBtn}>
//               <Ionicons name="add" size={18} color={COLORS.purple} />
//               <Text style={styles.addMoneyText}>Add Money</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.walletArtBox}>
//             <Text style={styles.coinEmoji}>🪙</Text>
//             <MaterialCommunityIcons
//               name="wallet"
//               size={95}
//               color="rgba(255,255,255,0.28)"
//             />
//           </View>
//         </View>

//         <View style={styles.actionCard}>
//           <WalletAction icon="plus-circle-outline" title="Add Money" />
//           <View style={styles.verticalDivider} />
//           <WalletAction icon="wallet-outline" title="Send Money" />
//           <View style={styles.verticalDivider} />
//           <WalletAction icon="history" title="Transaction History" />
//         </View>

//         <View style={styles.sectionHeaderRow}>
//           <Text style={styles.sectionTitle}>Recent Transactions</Text>
//           <TouchableOpacity>
//             <Text style={styles.viewAll}>View All</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.transactionCard}>
//           {TRANSACTIONS.map((item, index) => (
//             <View key={item.id}>
//               <TouchableOpacity style={styles.transactionRow}>
//                 <View style={[styles.transactionIcon, { backgroundColor: item.bg }]}>
//                   <MaterialCommunityIcons
//                     name={item.icon}
//                     size={25}
//                     color={item.color}
//                   />
//                 </View>

//                 <View style={{ flex: 1 }}>
//                   <Text style={styles.transactionTitle}>{item.title}</Text>
//                   <Text style={styles.transactionDate}>{item.date}</Text>
//                 </View>

//                 <Text
//                   style={[
//                     styles.transactionAmount,
//                     {
//                       color:
//                         item.type === "credit" ? COLORS.green : COLORS.red,
//                     },
//                   ]}
//                 >
//                   {item.amount}
//                 </Text>
//               </TouchableOpacity>

//               {index !== TRANSACTIONS.length - 1 && (
//                 <View style={styles.transactionDivider} />
//               )}
//             </View>
//           ))}
//         </View>

//         <View style={styles.inviteCard}>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.inviteTitle}>Invite & Earn</Text>
//             <Text style={styles.inviteSub}>
//               Invite your friends and get up to ₹500
//             </Text>

//             <TouchableOpacity style={styles.inviteBtn}>
//               <Text style={styles.inviteBtnText}>Invite Now</Text>
//             </TouchableOpacity>
//           </View>

//           <Text style={styles.giftEmoji}>🎁</Text>
//         </View>

//         <View style={{ height: 25 }} />
//       </ScrollView>

//       <BottomNavBar activeId="wallet" navigation={navigation} />
//     </SafeAreaView>
//   );
// }

// function WalletAction({ icon, title }) {
//   return (
//     <TouchableOpacity style={styles.walletAction}>
//       <MaterialCommunityIcons name={icon} size={30} color={COLORS.purple} />
//       <Text style={styles.walletActionText}>{title}</Text>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
//   },

//   header: {
//     height: 72,
//     paddingHorizontal: 22,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   headerLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   backBtn: {
//     width: 38,
//     height: 38,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 8,
//   },

//   headerTitle: {
//     fontSize: 22,
//     fontWeight: "800",
//     color: COLORS.text,
//   },

//   bellBtn: {
//     width: 38,
//     height: 38,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   scrollContent: {
//     paddingHorizontal: 22,
//     paddingBottom: 105,
//   },

//   walletCard: {
//     backgroundColor: COLORS.purple,
//     borderRadius: 16,
//     padding: 24,
//     minHeight: 170,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     overflow: "hidden",
//   },

//   walletLabel: {
//     color: "#fff",
//     fontSize: 13,
//     fontWeight: "700",
//     opacity: 0.9,
//   },

//   walletAmount: {
//     color: "#fff",
//     fontSize: 30,
//     fontWeight: "900",
//     marginTop: 10,
//   },

//   addMoneyBtn: {
//     backgroundColor: "#fff",
//     alignSelf: "flex-start",
//     marginTop: 20,
//     paddingHorizontal: 16,
//     paddingVertical: 11,
//     borderRadius: 10,
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   addMoneyText: {
//     color: COLORS.purple,
//     fontSize: 14,
//     fontWeight: "800",
//     marginLeft: 5,
//   },

//   walletArtBox: {
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   coinEmoji: {
//     fontSize: 38,
//     position: "absolute",
//     top: 12,
//     right: 25,
//     zIndex: 2,
//   },

//   actionCard: {
//     marginTop: 18,
//     backgroundColor: "#fff",
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 14,
//     shadowColor: "#000",
//     shadowOpacity: 0.04,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 1,
//   },

//   walletAction: {
//     flex: 1,
//     alignItems: "center",
//   },

//   walletActionText: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: COLORS.text,
//     marginTop: 8,
//     textAlign: "center",
//   },

//   verticalDivider: {
//     width: 1,
//     height: 50,
//     backgroundColor: COLORS.border,
//   },

//   sectionHeaderRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginTop: 26,
//     marginBottom: 12,
//   },

//   sectionTitle: {
//     fontSize: 17,
//     fontWeight: "900",
//     color: COLORS.text,
//   },

//   viewAll: {
//     color: COLORS.blue,
//     fontSize: 14,
//     fontWeight: "700",
//   },

//   transactionCard: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingHorizontal: 14,
//     paddingVertical: 4,
//     shadowColor: "#000",
//     shadowOpacity: 0.04,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 1,
//   },

//   transactionRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 13,
//   },

//   transactionIcon: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 14,
//   },

//   transactionTitle: {
//     fontSize: 15,
//     fontWeight: "800",
//     color: COLORS.text,
//   },

//   transactionDate: {
//     fontSize: 12,
//     color: COLORS.muted,
//     marginTop: 3,
//   },

//   transactionAmount: {
//     fontSize: 15,
//     fontWeight: "900",
//   },

//   transactionDivider: {
//     height: 1,
//     backgroundColor: COLORS.border,
//     marginLeft: 56,
//   },

//   inviteCard: {
//     backgroundColor: "#F0FAFA",
//     borderRadius: 16,
//     padding: 20,
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 26,
//   },

//   inviteTitle: {
//     fontSize: 20,
//     fontWeight: "900",
//     color: COLORS.text,
//   },

//   inviteSub: {
//     fontSize: 13,
//     color: COLORS.text,
//     marginTop: 8,
//     marginBottom: 18,
//   },

//   inviteBtn: {
//     backgroundColor: COLORS.green,
//     alignSelf: "flex-start",
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },

//   inviteBtnText: {
//     color: "#fff",
//     fontSize: 13,
//     fontWeight: "800",
//   },

//   giftEmoji: {
//     fontSize: 82,
//   },
// });








import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import BottomNavBar from "../components/BottomNavBar";
import providerApi from "../api/providerApi";
import { getOwnerColors, t } from "../styles/ownerPreferences";

const API_BASE_URL = "http://192.168.29.170:8080/api/wallet";
const USER_MOBILE = "9876543210"; // replace with logged-in user mobile

const withColorAliases = (colors) => ({
  ...colors,
  bg: colors.background,
  green: colors.primary,
  purple: colors.primary,
  red: colors.danger,
  orange: colors.accent,
  blue: colors.primaryLight,
});

const COLORS = withColorAliases(getOwnerColors("light"));

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

const openWebRazorpayCheckout = async (options) => {
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

const openNativeRazorpayCheckout = async (options) => {
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

export default function MyWalletScreen({ navigation }) {
  const [wallet, setWallet] = useState({ balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [owner, setOwner] = useState(null);

  const [addModal, setAddModal] = useState(false);
  const [sendModal, setSendModal] = useState(false);

  const [addAmount, setAddAmount] = useState("");
  const [receiverMobile, setReceiverMobile] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const language = owner?.language || "en";
  const colors = withColorAliases(getOwnerColors(owner?.theme || "light"));
  const walletMobile = owner?.mobile || USER_MOBILE;

  useEffect(() => {
    let active = true;
    providerApi.getLocalOwner().then((profile) => {
      if (active) setOwner(profile);
    });
    const unsubscribe = providerApi.subscribeOwnerProfile?.((profile) => {
      if (active) setOwner(profile);
    });
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    loadWalletData();
  }, [walletMobile]);

  const loadWalletData = async () => {
    try {
      setLoading(true);

      const walletRes = await fetch(`${API_BASE_URL}/${walletMobile}`);
      const walletData = await walletRes.json();

      const txRes = await fetch(`${API_BASE_URL}/transactions/${walletMobile}`);
      const txData = await txRes.json();

      setWallet(walletData);
      setTransactions(Array.isArray(txData) ? txData : []);
    } catch (error) {
      Alert.alert("Error", "Unable to load wallet data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async () => {
    if (!addAmount || Number(addAmount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter valid amount");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/add-money/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNumber: walletMobile,
          amount: Number(addAmount),
        }),
      });

      const order = await res.json();

      if (!res.ok || !order?.orderId || !order?.amount || !order?.keyId) {
        throw new Error(order?.message || "Payment order was not created correctly.");
      }

      const options = {
        description: "Add money to wallet",
        currency: order.currency,
        key: order.keyId,
        amount: order.amount,
        order_id: order.orderId,
        name: "Servixo Wallet",
        prefill: {
          name: owner?.fullName || "Owner",
          email: owner?.email || "customer@gmail.com",
          contact: walletMobile,
        },
        theme: {
          color: colors.primary,
        },
      };

      const paymentData =
        Platform.OS === "web"
          ? await openWebRazorpayCheckout(options)
          : await openNativeRazorpayCheckout(options);

      const verifyRes = await fetch(`${API_BASE_URL}/add-money/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNumber: walletMobile,
          razorpayOrderId: paymentData.razorpay_order_id,
          razorpayPaymentId: paymentData.razorpay_payment_id,
          razorpaySignature: paymentData.razorpay_signature,
        }),
      });

      if (!verifyRes.ok) {
        throw new Error("Payment verification failed");
      }

      setAddModal(false);
      setAddAmount("");
      Alert.alert("Success", "Money added successfully");
      loadWalletData();
    } catch (error) {
      Alert.alert("Payment Failed", error?.message || "Add money failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMoney = async () => {
    if (!receiverMobile || receiverMobile.length < 10) {
      Alert.alert("Invalid Mobile", "Enter receiver mobile number");
      return;
    }

    if (!sendAmount || Number(sendAmount) <= 0) {
      Alert.alert("Invalid Amount", "Enter valid amount");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/send-money`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderMobileNumber: walletMobile,
          receiverMobileNumber: receiverMobile,
          amount: Number(sendAmount),
        }),
      });

      if (!res.ok) {
        throw new Error("Send money failed");
      }

      setSendModal(false);
      setReceiverMobile("");
      setSendAmount("");

      Alert.alert("Success", "Money sent successfully");
      loadWalletData();
    } catch (error) {
      Alert.alert("Error", "Insufficient balance or invalid receiver");
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (item) => {
    const sign = item.type === "CREDIT" ? "+" : "-";
    return `${sign} ₹${Number(item.amount || 0).toFixed(2)}`;
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("en-IN");
  };

  const getTransactionIcon = (item) => {
    if (item.paymentProvider === "RAZORPAY") return "plus";
    if (item.type === "CREDIT") return "wallet-plus";
    return "wallet-minus";
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={owner?.theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.surface}
      />

      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation?.goBack?.()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text }]}>{t(language, "myWallet")}</Text>
        </View>

        <TouchableOpacity style={styles.bellBtn}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.walletCard, { backgroundColor: colors.primary }]}>
          <View>
            <Text style={styles.walletLabel}>{t(language, "walletBalance")}</Text>
            <Text style={styles.walletAmount}>
              ₹{Number(wallet?.balance || 0).toFixed(2)}
            </Text>

            <TouchableOpacity
              style={styles.addMoneyBtn}
              onPress={() => setAddModal(true)}
            >
              <Ionicons name="add" size={18} color={colors.primary} />
              <Text style={[styles.addMoneyText, { color: colors.primary }]}>{t(language, "addMoney")}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.walletArtBox}>
            <Text style={styles.coinEmoji}>🪙</Text>
            <MaterialCommunityIcons
              name="wallet"
              size={95}
              color="rgba(255,255,255,0.28)"
            />
          </View>
        </View>

        <View style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <WalletAction
            icon="plus-circle-outline"
            title={t(language, "addMoney")}
            onPress={() => setAddModal(true)}
            colors={colors}
          />
          <View style={[styles.verticalDivider, { backgroundColor: colors.border }]} />

          <WalletAction
            icon="wallet-outline"
            title={t(language, "sendMoney")}
            onPress={() => setSendModal(true)}
            colors={colors}
          />
          <View style={[styles.verticalDivider, { backgroundColor: colors.border }]} />

          <WalletAction
            icon="history"
            title={t(language, "transactionHistory")}
            onPress={loadWalletData}
            colors={colors}
          />
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t(language, "recentTransactions")}</Text>
          <TouchableOpacity onPress={loadWalletData}>
            <Text style={[styles.viewAll, { color: colors.primaryLight }]}>{t(language, "refresh")}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.transactionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {loading ? (
            <ActivityIndicator style={{ marginVertical: 20 }} color={colors.primary} />
          ) : transactions.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.muted }]}>{t(language, "noTransactionsFound")}</Text>
          ) : (
            transactions.map((item, index) => (
              <View key={item.id}>
                <TouchableOpacity style={styles.transactionRow}>
                  <View style={[styles.transactionIcon, { backgroundColor: colors.surfaceAlt }]}>
                    <MaterialCommunityIcons
                      name={getTransactionIcon(item)}
                      size={25}
                      color={item.type === "CREDIT" ? colors.primary : colors.danger}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.transactionTitle, { color: colors.text }]}>{item.title}</Text>
                    <Text style={[styles.transactionDate, { color: colors.muted }]}>
                      {formatDate(item.createdAt)}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.transactionAmount,
                      {
                        color: item.type === "CREDIT" ? colors.primary : colors.danger,
                      },
                    ]}
                  >
                    {formatAmount(item)}
                  </Text>
                </TouchableOpacity>

                {index !== transactions.length - 1 && (
                  <View style={[styles.transactionDivider, { backgroundColor: colors.border }]} />
                )}
              </View>
            ))
          )}
        </View>

        <View style={[styles.inviteCard, { backgroundColor: colors.surfaceAlt }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.inviteTitle, { color: colors.text }]}>{t(language, "inviteEarn")}</Text>
            <Text style={[styles.inviteSub, { color: colors.text }]}>
              {t(language, "inviteFriends")}
            </Text>

            <TouchableOpacity style={[styles.inviteBtn, { backgroundColor: colors.primary }]}>
              <Text style={styles.inviteBtnText}>{t(language, "inviteNow")}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.giftEmoji}>🎁</Text>
        </View>

        <View style={{ height: 25 }} />
      </ScrollView>

      <BottomNavBar activeId="wallet" navigation={navigation} />

      <Modal visible={addModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t(language, "addMoney")}</Text>

            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              placeholder={t(language, "enterAmount")}
              keyboardType="numeric"
              value={addAmount}
              onChangeText={setAddAmount}
            />

            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.primary }]} onPress={handleAddMoney}>
              <Text style={styles.primaryBtnText}>{t(language, "continueToPayment")}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setAddModal(false)}>
              <Text style={[styles.cancelText, { color: colors.danger }]}>{t(language, "cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={sendModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t(language, "sendMoney")}</Text>

            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              placeholder={t(language, "receiverMobileNumber")}
              keyboardType="phone-pad"
              value={receiverMobile}
              onChangeText={setReceiverMobile}
              maxLength={10}
            />

            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              placeholder={t(language, "enterAmount")}
              keyboardType="numeric"
              value={sendAmount}
              onChangeText={setSendAmount}
            />

            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.primary }]} onPress={handleSendMoney}>
              <Text style={styles.primaryBtnText}>{t(language, "sendMoney")}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSendModal(false)}>
              <Text style={[styles.cancelText, { color: colors.danger }]}>{t(language, "cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function WalletAction({ icon, title, onPress, colors = COLORS }) {
  return (
    <TouchableOpacity style={styles.walletAction} onPress={onPress}>
      <MaterialCommunityIcons name={icon} size={30} color={colors.primary} />
      <Text style={[styles.walletActionText, { color: colors.text }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
  },
  header: {
    height: 72,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
  },
  bellBtn: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 105,
  },
  walletCard: {
    backgroundColor: COLORS.purple,
    borderRadius: 16,
    padding: 24,
    minHeight: 170,
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  walletLabel: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    opacity: 0.9,
  },
  walletAmount: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 10,
  },
  addMoneyBtn: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  addMoneyText: {
    color: COLORS.purple,
    fontSize: 14,
    fontWeight: "800",
    marginLeft: 5,
  },
  walletArtBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  coinEmoji: {
    fontSize: 38,
    position: "absolute",
    top: 12,
    right: 25,
    zIndex: 2,
  },
  actionCard: {
    marginTop: 18,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  walletAction: {
    flex: 1,
    alignItems: "center",
  },
  walletActionText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 8,
    textAlign: "center",
  },
  verticalDivider: {
    width: 1,
    height: 50,
    backgroundColor: COLORS.border,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 26,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: COLORS.text,
  },
  viewAll: {
    color: COLORS.blue,
    fontSize: 14,
    fontWeight: "700",
  },
  transactionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
  },
  transactionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },
  transactionDate: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 3,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: "900",
  },
  transactionDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 56,
  },
  emptyText: {
    textAlign: "center",
    paddingVertical: 25,
    color: COLORS.muted,
    fontWeight: "700",
  },
  inviteCard: {
    backgroundColor: "#F0FAFA",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 26,
  },
  inviteTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.text,
  },
  inviteSub: {
    fontSize: 13,
    color: COLORS.text,
    marginTop: 8,
    marginBottom: 18,
  },
  inviteBtn: {
    backgroundColor: COLORS.green,
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  inviteBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
  },
  giftEmoji: {
    fontSize: 82,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 22,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    marginBottom: 14,
    color: COLORS.text,
  },
  primaryBtn: {
    backgroundColor: COLORS.purple,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },
  cancelText: {
    textAlign: "center",
    color: COLORS.red,
    fontSize: 15,
    fontWeight: "800",
    marginTop: 16,
  },
});
