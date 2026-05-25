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
  Share,
  Clipboard,
  ToastAndroid,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import BottomNavBar from "../components/BottomNavBar";
import providerApi from "../api/providerApi";
import { getOwnerColors } from "../styles/ownerPreferences";

const withColorAliases = (colors) => ({
  ...colors,
  bg: colors.background,
  green: colors.primary,
  purple: colors.primary,
  lightPurple: colors.surfaceAlt,
  yellow: colors.accent,
  orange: colors.accent,
});

const COLORS = withColorAliases(getOwnerColors("light"));

function generateReferralCode(fullName, mobile) {
  const cleanedName = `${fullName || ""}`.trim().toUpperCase();
  const cleanedMobile = `${mobile || ""}`.replace(/\D/g, "");
  const nameParts = cleanedName.split(/\s+/).filter(Boolean);
  const nameCode = (nameParts.length > 1
    ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}${nameParts[0].slice(1, 4)}`
    : (nameParts[0] || "USER")
  )
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 5)
    .padEnd(5, "X");
  const source = `${cleanedName}:${cleanedMobile}`;
  const hash = source.split("").reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 10000, 0);
  const mobileTail = (cleanedMobile || "0000").slice(-4).padStart(4, "0");
  return `${nameCode}${mobileTail}${hash.toString().padStart(4, "0")}`;
}

export default function ReferEarnScreen({ navigation, route, sessionProfile }) {
  const [profile, setProfile] = useState(sessionProfile || route?.params?.adminProfile || null);
  const [copied, setCopied] = useState(false);
  const colors = withColorAliases(getOwnerColors(profile?.theme || "light"));

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      try {
        const owner = await providerApi.getLocalOwner();
        if (owner && active) {
          setProfile(owner);
          return;
        }
        const stored = await AsyncStorage.getItem("ownerProfile");
        if (stored && active) {
          setProfile(JSON.parse(stored));
          return;
        }
        const legacyStored = await AsyncStorage.getItem("adminProfile");
        if (legacyStored && active) setProfile(JSON.parse(legacyStored));
      } catch (e) {
        console.log("Failed to load profile", e);
      }
    };
    loadProfile();
    const unsubscribe = providerApi.subscribeOwnerProfile?.((owner) => {
      if (active) setProfile(owner);
    });
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const referralCode = generateReferralCode(profile?.fullName, profile?.mobile);

  const handleCopy = () => {
    Clipboard.setString(referralCode);
    setCopied(true);
    if (Platform.OS === "android") {
      ToastAndroid.show("Referral code copied!", ToastAndroid.SHORT);
    } else {
      Alert.alert("Copied!", "Referral code copied to clipboard.");
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🎁 Use my referral code *${referralCode}* and get up to ₹500 on your first booking! Download the app and sign up now.`,
        title: "Refer & Earn",
      });
    } catch (error) {
      console.log("Share error", error);
    }
  };

  const steps = [
    {
      num: "1",
      title: "Share your code",
      desc: "Share your referral code with friends",
      icon: "share-2",
    },
    {
      num: "2",
      title: "Friend signs up",
      desc: "Your friend signs up and completes first booking",
      icon: "user-plus",
    },
    {
      num: "3",
      title: "You earn rewards",
      desc: "You get up to ₹500 in your wallet",
      icon: "gift",
    },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={profile?.theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.surface}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Refer &amp; Earn</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Banner */}
        <View style={[styles.heroBanner, { backgroundColor: colors.surfaceAlt }]}>
          <View style={styles.heroTextCol}>
            <Text style={[styles.heroTitle, { color: colors.text }]}>Refer your friends{"\n"}and earn rewards</Text>
            <Text style={[styles.heroSub, { color: colors.muted }]}>Invite your friends and{"\n"}get up to ₹500</Text>

            {/* Sparkles */}
            <Text style={[styles.sparkle1, { color: colors.primary }]}>✦</Text>
            <Text style={[styles.sparkle2, { color: colors.primary }]}>✦</Text>
          </View>
          {/* Gift Box Illustration */}
          <View style={[styles.giftBox, { backgroundColor: colors.surface }]}>
            <Text style={styles.giftEmoji}>🎁</Text>
          </View>
        </View>

        {/* Referral Code Box */}
        <Text style={[styles.sectionLabel, { color: colors.muted }]}>Your Referral Code</Text>
        <View style={[styles.codeCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.primary }]}>
          <Text style={[styles.codeText, { color: colors.primary }]}>{referralCode}</Text>
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopy} activeOpacity={0.7}>
            <Feather name={copied ? "check" : "copy"} size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Share Now Button */}
        <TouchableOpacity style={[styles.shareBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }]} onPress={handleShare} activeOpacity={0.85}>
          <Feather name="share-2" size={18} color="#fff" />
          <Text style={styles.shareBtnText}>Share Now</Text>
        </TouchableOpacity>

        {/* How It Works */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>How it works</Text>
        <View style={[styles.stepsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {steps.map((step, idx) => (
            <View key={step.num} style={styles.stepRow}>
              <View style={[styles.stepNumCircle, { backgroundColor: colors.surfaceAlt }]}>
                <Text style={[styles.stepNum, { color: colors.primary }]}>{step.num}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.stepTitle, { color: colors.text }]}>{step.title}</Text>
                <Text style={[styles.stepDesc, { color: colors.muted }]}>{step.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Earnings Summary */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Earnings</Text>
        <View style={styles.earningsRow}>
          <View style={[styles.earningCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.earningIconBg, { backgroundColor: colors.surfaceAlt }]}>
              <Text style={{ fontSize: 22 }}>💰</Text>
            </View>
            <Text style={[styles.earningAmount, { color: colors.text }]}>₹750</Text>
            <Text style={[styles.earningLabel, { color: colors.muted }]}>Total Earned</Text>
          </View>
          <View style={[styles.earningCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.earningIconBg, { backgroundColor: colors.surfaceAlt }]}>
              <Text style={{ fontSize: 22 }}>👥</Text>
            </View>
            <Text style={[styles.earningAmount, { color: colors.text }]}>5</Text>
            <Text style={[styles.earningLabel, { color: colors.muted }]}>Total Referrals</Text>
          </View>
        </View>

        <View style={{ height: 25 }} />
      </ScrollView>

      <BottomNavBar activeId="profile" navigation={navigation} />
    </SafeAreaView>
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
  backBtn: { width: 38, height: 38, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 20, fontWeight: "800", color: COLORS.text },
  scrollContent: { paddingHorizontal: 22, paddingBottom: 105 },

  // Hero Banner
  heroBanner: {
    backgroundColor: COLORS.lightPurple,
    borderRadius: 18,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    overflow: "hidden",
    minHeight: 130,
  },
  heroTextCol: { flex: 1, position: "relative" },
  heroTitle: { fontSize: 17, fontWeight: "900", color: COLORS.text, lineHeight: 24 },
  heroSub: { fontSize: 13, color: COLORS.muted, marginTop: 6, lineHeight: 19 },
  sparkle1: { position: "absolute", top: -10, right: 10, fontSize: 18, color: COLORS.purple, opacity: 0.4 },
  sparkle2: { position: "absolute", bottom: -5, right: 40, fontSize: 12, color: COLORS.purple, opacity: 0.3 },
  giftBox: {
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0FAFA",
    borderRadius: 45,
    marginLeft: 12,
  },
  giftEmoji: { fontSize: 46 },

  // Referral Code
  sectionLabel: { fontSize: 13, fontWeight: "700", color: COLORS.muted, marginTop: 22, marginBottom: 10 },
  codeCard: {
    borderWidth: 1.5,
    borderColor: COLORS.purple,
    borderStyle: "dashed",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 22,
    backgroundColor: COLORS.lightPurple,
  },
  codeText: { flex: 1, fontSize: 22, fontWeight: "900", color: COLORS.purple, letterSpacing: 3, textAlign: "center" },
  copyBtn: { padding: 6 },

  // Share Button
  shareBtn: {
    marginTop: 16,
    backgroundColor: COLORS.purple,
    borderRadius: 12,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: COLORS.purple,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  shareBtnText: { color: "#fff", fontSize: 15, fontWeight: "800", marginLeft: 8 },

  // How it works
  sectionTitle: { fontSize: 17, fontWeight: "900", color: COLORS.text, marginTop: 28, marginBottom: 14 },
  stepsCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 18,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  stepRow: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 16, gap: 16 },
  stepNumCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.lightPurple,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNum: { fontSize: 15, fontWeight: "900", color: COLORS.purple },
  stepTitle: { fontSize: 14, fontWeight: "800", color: COLORS.text },
  stepDesc: { fontSize: 12, color: COLORS.muted, marginTop: 3, lineHeight: 17 },

  // Earnings
  earningsRow: { flexDirection: "row", gap: 14 },
  earningCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  earningIconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  earningAmount: { fontSize: 22, fontWeight: "900", color: COLORS.text },
  earningLabel: { fontSize: 12, color: COLORS.muted, fontWeight: "600", marginTop: 3 },
});

