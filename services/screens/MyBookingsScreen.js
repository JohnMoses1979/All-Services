import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import BottomNavBar from "../components/BottomNavBar";
import providerApi from "../api/providerApi";
import { getOwnerColors, t } from "../styles/ownerPreferences";

const withColorAliases = (colors) => ({
  ...colors,
  bg: colors.background,
  green: colors.primary,
  greenLight: colors.surfaceAlt,
  orange: colors.accent,
  purple: colors.primary,
  red: colors.danger,
});

const COLORS = withColorAliases(getOwnerColors("light"));

const BOOKINGS = {
  Upcoming: [
    {
      id: "#BK12345",
      title: "Deep Cleaning",
      date: "15 May 2024",
      time: "10:00 AM",
      price: "₹499",
      provider: "Rajesh Kumar",
      rating: "4.8",
      bg: COLORS.surfaceAlt,
      icon: "broom",
      iconColor: COLORS.primary,
    },
    {
      id: "#BK12346",
      title: "Salon at Home",
      date: "16 May 2024",
      time: "02:00 PM",
      price: "₹299",
      provider: "Priya Sharma",
      rating: "4.9",
      bg: "#F0FAFA",
      icon: "face-woman-shimmer",
      iconColor: "#1A7A7A",
    },
    {
      id: "#BK12347",
      title: "Massage Therapy",
      date: "17 May 2024",
      time: "11:30 AM",
      price: "₹699",
      provider: "Amit Verma",
      rating: "4.7",
      bg: COLORS.surfaceAlt,
      icon: "meditation",
      iconColor: COLORS.accent,
    },
    {
      id: "#BK12348",
      title: "Appliance Repair",
      date: "18 May 2024",
      time: "03:00 PM",
      price: "₹399",
      provider: "Ramesh Yadav",
      rating: "4.6",
      bg: "#F0FAFA",
      icon: "washing-machine",
      iconColor: "#1A7A7A",
    },
  ],
  Completed: [
    {
      id: "#BK12320",
      title: "Home Cleaning",
      date: "10 May 2024",
      time: "09:30 AM",
      price: "₹799",
      provider: "Sunita B.",
      rating: "4.8",
      bg: "#F0FAFA",
      icon: "broom",
      iconColor: COLORS.primary,
    },
    {
      id: "#BK12321",
      title: "WiFi Installation",
      date: "09 May 2024",
      time: "05:00 PM",
      price: "₹599",
      provider: "NetFix Technician",
      rating: "4.7",
      bg: "#F0FAFA",
      icon: "wifi",
      iconColor: "#1A7A7A",
    },
  ],
  Cancelled: [
    {
      id: "#BK12310",
      title: "Party Decoration",
      date: "08 May 2024",
      time: "06:00 PM",
      price: "₹1499",
      provider: "PartyGlow Decor",
      rating: "4.8",
      bg: "#F0FAFA",
      icon: "balloon",
      iconColor: "#D94848",
    },
  ],
};

export default function MyBookingsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [owner, setOwner] = useState(null);
  const language = owner?.language || "en";
  const colors = withColorAliases(getOwnerColors(owner?.theme || "light"));
  const tabs = ["Upcoming", "Completed", "Cancelled"];
  const tabLabel = (tab) => t(language, tab.toLowerCase());

  const loadBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const ownerBookings = await providerApi.getOwnerBookings();
      setBookings(ownerBookings);
    } catch (err) {
      setError(err?.message || "Could not load bookings.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    providerApi.getLocalOwner().then((profile) => {
      if (active) setOwner(profile);
    });
    const unsubscribe = providerApi.subscribeOwnerProfile?.((profile) => {
      if (active) setOwner(profile);
    });
    loadBookings();
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const groupedBookings = useMemo(() => {
    const groups = {
      Upcoming: [],
      Completed: [],
      Cancelled: [],
    };

    bookings.forEach((booking) => {
      if (booking.status === "REJECTED") {
        groups.Cancelled.push(booking);
      } else if (["COMPLETED", "PAID", "RATED"].includes(booking.status)) {
        groups.Completed.push(booking);
      } else {
        groups.Upcoming.push(booking);
      }
    });

    return groups;
  }, [bookings]);

  const currentBookings = groupedBookings[activeTab] || [];

  const getStatusStyle = () => {
    if (activeTab === "Upcoming") return styles.statusUpcoming;
    if (activeTab === "Completed") return styles.statusCompleted;
    return styles.statusCancelled;
  };

  const getStatusTextStyle = () => {
    if (activeTab === "Upcoming") return styles.statusUpcomingText;
    if (activeTab === "Completed") return styles.statusCompletedText;
    return styles.statusCancelledText;
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

          <Text style={[styles.headerTitle, { color: colors.text }]}>{t(language, "myBookings")}</Text>
        </View>

        <TouchableOpacity style={styles.bellBtn}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={[styles.tabs, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.tabItem}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                { color: colors.primary },
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tabLabel(tab)}
            </Text>
            {activeTab === tab && <View style={[styles.activeLine, { backgroundColor: colors.primary }]} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <View style={[styles.stateCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ActivityIndicator color={colors.primary} />
            <Text style={[styles.stateText, { color: colors.muted }]}>{t(language, "loadingBookings")}</Text>
          </View>
        ) : error ? (
          <View style={[styles.stateCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.stateTitle, { color: colors.text }]}>{t(language, "serverIssue")}</Text>
            <Text style={[styles.stateText, { color: colors.muted }]}>{error}</Text>
            <TouchableOpacity style={[styles.retryBtn, { backgroundColor: colors.primary }]} onPress={loadBookings}>
              <Text style={styles.retryText}>{t(language, "retry")}</Text>
            </TouchableOpacity>
          </View>
        ) : currentBookings.length === 0 ? (
          <View style={[styles.stateCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.stateTitle, { color: colors.text }]}>
              {t(language, "noBookingsPrefix")} {tabLabel(activeTab).toLowerCase()} {t(language, "noBookingsSuffix")}
            </Text>
            <Text style={[styles.stateText, { color: colors.muted }]}>{t(language, "bookingsAppearHere")}</Text>
          </View>
        ) : currentBookings.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.bookingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("BookingFlowStatus", { booking: item })}
          >
            <View style={[styles.imageBox, { backgroundColor: getBookingTheme(item, colors).bg }]}>
              <MaterialCommunityIcons
                name={getBookingTheme(item, colors).icon}
                size={50}
                color={getBookingTheme(item, colors).iconColor}
              />
            </View>

            <View style={styles.bookingContent}>
              <View style={styles.topRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.bookingTitle, { color: colors.text }]}>{item.serviceName || item.title}</Text>
                  <Text style={[styles.bookingId, { color: colors.muted }]}>{t(language, "bookingId")}: #{item.id}</Text>
                </View>

                <View style={[styles.statusPill, getStatusStyle()]}>
                  <Text style={[styles.statusText, getStatusTextStyle()]}>
                    {tabLabel(activeTab)}
                  </Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Feather name="calendar" size={13} color={colors.muted} />
                  <Text style={[styles.metaText, { color: colors.text }]}>{item.bookingDate || item.date}</Text>
                </View>

                <View style={styles.metaItem}>
                  <Feather name="clock" size={13} color={colors.muted} />
                  <Text style={[styles.metaText, { color: colors.text }]}>{item.timeSlot || item.time}</Text>
                </View>

                <View style={styles.metaItem}>
                  <Feather name="smartphone" size={13} color={colors.muted} />
                  <Text style={[styles.metaText, { color: colors.text }]}>Rs {item.amount}</Text>
                </View>
              </View>

              {item.status === "ACCEPTED" && item.startOtp ? (
                <View style={[styles.otpBox, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
                  <Text style={[styles.otpLabel, { color: colors.muted }]}>{t(language, "startOtp")}</Text>
                  <Text style={styles.otpText}>{item.startOtp}</Text>
                </View>
              ) : null}

              <View style={styles.providerRow}>
                <View style={styles.providerLeft}>
                  <View style={styles.avatar}>
                    <MaterialCommunityIcons
                      name="account"
                      size={20}
                      color="#fff"
                    />
                  </View>

                  <Text style={[styles.providerName, { color: colors.text }]}>{item.providerName || item.provider}</Text>
                  <Ionicons name="star" size={15} color={colors.accent} />
                  <Text style={[styles.rating, { color: colors.text }]}>{item.rating || t(language, "new")}</Text>
                </View>

                {activeTab === "Upcoming" ? (
                  <TouchableOpacity style={[styles.smallActionBtn, { backgroundColor: colors.primary }]}>
                    <Text style={styles.smallActionText}>
                      {item.status === "ACCEPTED" ? t(language, "showOtp") : item.status}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={[styles.smallActionBtn, { backgroundColor: colors.primary }]}>
                    <Text style={styles.smallActionText}>
                      {activeTab === "Completed" ? t(language, "details") : t(language, "rebook")}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={[styles.offerCard, { backgroundColor: colors.surfaceAlt }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.offerTitle, { color: colors.primary }]}>{t(language, "bookAgainSaveMore")}</Text>
            <Text style={[styles.offerSub, { color: colors.text }]}>
              {t(language, "nextBookingOffer")}
            </Text>

            <TouchableOpacity style={[styles.offerBtn, { backgroundColor: colors.primary }]}>
              <Text style={styles.offerBtnText}>{t(language, "viewOffers")}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.giftEmoji}>🎁</Text>
        </View>

        <View style={{ height: 25 }} />
      </ScrollView>

      <BottomNavBar activeId="bookings" navigation={navigation} />
    </SafeAreaView>
  );
}

const getBookingTheme = (booking, colors = COLORS) => {
  const name = `${booking.serviceName || ""}`.toLowerCase();
  if (name.includes("maid")) {
    return { bg: colors.surfaceAlt, icon: "account-hard-hat", iconColor: colors.primary };
  }
  if (name.includes("driver")) {
    return { bg: colors.surfaceAlt, icon: "car", iconColor: colors.danger };
  }
  if (name.includes("chef") || name.includes("cook")) {
    return { bg: colors.surfaceAlt, icon: "chef-hat", iconColor: colors.accent };
  }
  return { bg: colors.surfaceAlt, icon: "briefcase-check", iconColor: colors.primary };
};

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

  tabs: {
    flexDirection: "row",
    paddingHorizontal: 22,
    height: 55,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  tabText: {
    fontSize: 15,
    color: "#1A7A7A",
    fontWeight: "600",
  },

  tabTextActive: {
    color: COLORS.green,
    fontWeight: "800",
  },

  activeLine: {
    position: "absolute",
    bottom: 0,
    width: "70%",
    height: 3,
    borderRadius: 20,
    backgroundColor: COLORS.green,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 105,
  },

  stateCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    marginBottom: 16,
  },

  stateTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 6,
  },

  stateText: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },

  retryBtn: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
    marginTop: 12,
  },

  retryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },

  bookingCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 10,
    marginBottom: 16,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  imageBox: {
    width: 100,
    height: 100,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  bookingContent: {
    flex: 1,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  bookingTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.text,
    marginTop: 4,
  },

  bookingId: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
  },

  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
  },

  statusUpcoming: {
    backgroundColor: COLORS.greenLight,
  },

  statusCompleted: {
    backgroundColor: "#F0FAFA",
  },

  statusCancelled: {
    backgroundColor: "#F0FAFA",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "800",
  },

  statusUpcomingText: {
    color: COLORS.green,
  },

  statusCompletedText: {
    color: "#1A7A7A",
  },

  statusCancelledText: {
    color: COLORS.red,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  metaText: {
    fontSize: 11,
    color: COLORS.text,
    marginLeft: 5,
    fontWeight: "600",
  },

  providerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
  },

  otpBox: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8F5F5",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  otpLabel: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "800",
  },

  otpText: {
    color: "#D94848",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 2,
  },

  providerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#1A7A7A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  providerName: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
    marginRight: 8,
  },

  rating: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.text,
    marginLeft: 3,
  },

  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  smallActionBtn: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
  },

  smallActionText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
  },

  offerCard: {
    backgroundColor: "#F0FAFA",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  offerTitle: {
    color: COLORS.purple,
    fontSize: 18,
    fontWeight: "900",
  },

  offerSub: {
    color: COLORS.text,
    fontSize: 12,
    marginTop: 6,
    marginBottom: 12,
  },

  offerBtn: {
    backgroundColor: COLORS.purple,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },

  offerBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },

  giftEmoji: {
    fontSize: 70,
  },
});


