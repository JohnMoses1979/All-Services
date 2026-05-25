import React, { useState } from "react";
import {
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

const COLORS = {
  bg: "#F8F9FC",
  green: "#22C55E",
  greenLight: "#DCFCE7",
  text: "#1E1B4B",
  muted: "#6B7280",
  border: "#E5E7EB",
  orange: "#FB923C",
  purple: "#4F46E5",
  red: "#FB923C",
};

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
      bg: "#E5E7EB",
      icon: "broom",
      iconColor: "#22C55E",
    },
    {
      id: "#BK12346",
      title: "Salon at Home",
      date: "16 May 2024",
      time: "02:00 PM",
      price: "₹299",
      provider: "Priya Sharma",
      rating: "4.9",
      bg: "#E5E7EB",
      icon: "face-woman-shimmer",
      iconColor: "#22C55E",
    },
    {
      id: "#BK12347",
      title: "Massage Therapy",
      date: "17 May 2024",
      time: "11:30 AM",
      price: "₹699",
      provider: "Amit Verma",
      rating: "4.7",
      bg: "#E5E7EB",
      icon: "meditation",
      iconColor: "#22C55E",
    },
    {
      id: "#BK12348",
      title: "Appliance Repair",
      date: "18 May 2024",
      time: "03:00 PM",
      price: "₹399",
      provider: "Ramesh Yadav",
      rating: "4.6",
      bg: "#E5E7EB",
      icon: "washing-machine",
      iconColor: "#22C55E",
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
      bg: "#E5E7EB",
      icon: "broom",
      iconColor: "#22C55E",
    },
    {
      id: "#BK12321",
      title: "WiFi Installation",
      date: "09 May 2024",
      time: "05:00 PM",
      price: "₹599",
      provider: "NetFix Technician",
      rating: "4.7",
      bg: "#E5E7EB",
      icon: "wifi",
      iconColor: "#22C55E",
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
      bg: "#E5E7EB",
      icon: "balloon",
      iconColor: "#22C55E",
    },
  ],
};

export default function MyJobs({ navigation }) {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const currentBookings = BOOKINGS[activeTab] || [];

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
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation?.goBack?.()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Bookings</Text>
        </View>

        <TouchableOpacity style={styles.bellBtn}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {["Upcoming", "Completed", "Cancelled"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.tabItem}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.activeLine} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {currentBookings.map((item) => (
          <View key={item.id} style={styles.bookingCard}>
            <View style={[styles.imageBox, { backgroundColor: item.bg }]}>
              <MaterialCommunityIcons
                name={item.icon}
                size={50}
                color={item.iconColor}
              />
            </View>

            <View style={styles.bookingContent}>
              <View style={styles.topRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bookingTitle}>{item.title}</Text>
                  <Text style={styles.bookingId}>Booking ID: {item.id}</Text>
                </View>

                <View style={[styles.statusPill, getStatusStyle()]}>
                  <Text style={[styles.statusText, getStatusTextStyle()]}>
                    {activeTab}
                  </Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Feather name="calendar" size={13} color={COLORS.muted} />
                  <Text style={styles.metaText}>{item.date}</Text>
                </View>

                <View style={styles.metaItem}>
                  <Feather name="clock" size={13} color={COLORS.muted} />
                  <Text style={styles.metaText}>{item.time}</Text>
                </View>

                <View style={styles.metaItem}>
                  <Feather name="smartphone" size={13} color={COLORS.muted} />
                  <Text style={styles.metaText}>{item.price}</Text>
                </View>
              </View>

              <View style={styles.providerRow}>
                <View style={styles.providerLeft}>
                  <View style={styles.avatar}>
                    <MaterialCommunityIcons
                      name="account"
                      size={20}
                      color="#FFFFFF"
                    />
                  </View>

                  <Text style={styles.providerName}>{item.provider}</Text>
                  <Ionicons name="star" size={15} color={COLORS.orange} />
                  <Text style={styles.rating}>{item.rating}</Text>
                </View>

                {activeTab === "Upcoming" ? (
                  <TouchableOpacity style={styles.callButton}>
                    <Feather name="phone" size={18} color={COLORS.text} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.smallActionBtn}>
                    <Text style={styles.smallActionText}>
                      {activeTab === "Completed" ? "Book Again" : "Rebook"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}

        <View style={styles.offerCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.offerTitle}>Book Again, Save More!</Text>
            <Text style={styles.offerSub}>
              Get up to 20% OFF on your next booking
            </Text>

            <TouchableOpacity style={styles.offerBtn}>
              <Text style={styles.offerBtnText}>View Offers</Text>
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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    color: "#E5E7EB",
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

  bookingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 10,
    marginBottom: 16,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#1E1B4B",
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
    backgroundColor: "#FFFFFF",
  },

  statusCancelled: {
    backgroundColor: "#FFFFFF",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "800",
  },

  statusUpcomingText: {
    color: COLORS.green,
  },

  statusCompletedText: {
    color: "#E5E7EB",
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

  providerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
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
    color: "#E5E7EB",
    fontSize: 11,
    fontWeight: "800",
  },

  offerCard: {
    backgroundColor: "#FFFFFF",
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
    color: "#E5E7EB",
    fontSize: 12,
    fontWeight: "800",
  },

  giftEmoji: {
    fontSize: 70,
  },
});
