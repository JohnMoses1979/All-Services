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
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNavBar from "../components/BottomNavBar";
import providerApi from "../api/providerApi";
import { OWNER_COLORS } from "../styles/ownerTheme";

const COLORS = {
  bg: OWNER_COLORS.background,
  purple: OWNER_COLORS.primary,
  lightPurple: OWNER_COLORS.surfaceAlt,
  text: OWNER_COLORS.text,
  muted: OWNER_COLORS.muted,
  border: OWNER_COLORS.border,
  green: OWNER_COLORS.primaryLight,
  red: OWNER_COLORS.danger,
  orange: OWNER_COLORS.accent,
};

const INITIAL_SETTINGS = {
  bookingConfirmations: true,
  bookingReminders: true,
  bookingCancellations: true,
  offersDiscounts: true,
  newServices: false,
  walletUpdates: true,
  referEarnUpdates: true,
};

const SECTIONS = [
  {
    title: "Booking Updates",
    items: [
      {
        key: "bookingConfirmations",
        title: "Booking Confirmations",
        desc: "Get notified when your booking is confirmed",
        emoji: "🗓️",
        accentColor: COLORS.purple,
      },
      {
        key: "bookingReminders",
        title: "Booking Reminders",
        desc: "Get reminders before your booking time",
        emoji: "⏰",
        accentColor: COLORS.green,
      },
      {
        key: "bookingCancellations",
        title: "Booking Cancellations",
        desc: "Get notified for booking cancellations",
        emoji: "🔔",
        accentColor: COLORS.red,
      },
    ],
  },
  {
    title: "Promotions",
    items: [
      {
        key: "offersDiscounts",
        title: "Offers & Discounts",
        desc: "Get notified about exciting offers and discounts",
        emoji: "🏷️",
        accentColor: COLORS.orange,
      },
      {
        key: "newServices",
        title: "New Services",
        desc: "Get notified about new services",
        emoji: "✨",
        accentColor: COLORS.purple,
      },
    ],
  },
  {
    title: "General",
    items: [
      {
        key: "walletUpdates",
        title: "Wallet Updates",
        desc: "Get notified for wallet transactions",
        emoji: "💰",
        accentColor: COLORS.green,
      },
      {
        key: "referEarnUpdates",
        title: "Refer & Earn Updates",
        desc: "Get notified for referral rewards",
        emoji: "🎁",
        accentColor: COLORS.purple,
      },
    ],
  },
];

export default function NotificationSettingsScreen({ navigation }) {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [owner, setOwner] = useState(null);
  const [savingKey, setSavingKey] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      try {
        const localOwner = await providerApi.getLocalOwner();
        if (!active) return;

        setOwner(localOwner);
        if (localOwner?.notificationSettings) {
          setSettings({ ...INITIAL_SETTINGS, ...localOwner.notificationSettings });
        }

        if (localOwner?.mobile) {
          const response = await providerApi.getOwnerNotificationSettings(localOwner.mobile);
          if (active && response?.data) {
            setSettings({ ...INITIAL_SETTINGS, ...response.data });
          }
        }
      } catch (err) {
        if (active) setMessage(err?.message || "Could not load notification settings.");
      }
    };

    loadSettings();
    return () => {
      active = false;
    };
  }, []);

  const toggleSetting = async (key) => {
    if (!owner?.mobile || savingKey) return;

    const nextSettings = { ...settings, [key]: !settings[key] };
    setSettings(nextSettings);
    setSavingKey(key);
    setMessage("");

    try {
      const response = await providerApi.updateOwnerNotificationSettings(owner.mobile, nextSettings);
      if (response?.data) {
        setSettings({ ...INITIAL_SETTINGS, ...response.data });
      }
    } catch (err) {
      setSettings(settings);
      setMessage(err?.message || "Could not save notification setting.");
    } finally {
      setSavingKey("");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Settings</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {!!message && <Text style={styles.messageText}>{message}</Text>}

        {SECTIONS.map((section) => (
          <View key={section.title}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.listCard}>
              {section.items.map((item, idx) => (
                <React.Fragment key={item.key}>
                  <View style={styles.settingRow}>
                    <View style={[styles.iconCircle, { backgroundColor: item.accentColor + "18" }]}>
                      <Text style={styles.iconEmoji}>{item.emoji}</Text>
                    </View>
                    <View style={styles.settingText}>
                      <Text style={styles.settingTitle}>{item.title}</Text>
                      <Text style={styles.settingDesc}>{item.desc}</Text>
                    </View>
                    <Switch
                      value={settings[item.key]}
                      onValueChange={() => toggleSetting(item.key)}
                      disabled={savingKey === item.key}
                      trackColor={{ false: "#F0FAFA", true: COLORS.purple }}
                      thumbColor="#fff"
                      ios_backgroundColor="#F0FAFA"
                    />
                  </View>
                  {idx < section.items.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

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
  scrollContent: { paddingHorizontal: 22, paddingBottom: 105, paddingTop: 4 },
  messageText: {
    color: COLORS.red,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 8,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: COLORS.text,
    marginTop: 24,
    marginBottom: 12,
  },
  listCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    minHeight: 72,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  iconEmoji: { fontSize: 20 },
  settingText: { flex: 1 },
  settingTitle: { fontSize: 14, fontWeight: "800", color: COLORS.text },
  settingDesc: { fontSize: 12, color: COLORS.muted, marginTop: 3, lineHeight: 17 },
  divider: { height: 1, backgroundColor: COLORS.border, marginLeft: 58 },
});

