import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { providerApi } from "../api/providerApi";
import { getOwnerColors, t } from "../styles/ownerPreferences";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "home-outline", routeName: "Home" },
  { id: "bookings", label: "Bookings", icon: "calendar-outline", routeName: "MyBookings" },
  { id: "wallet", label: "Wallet", icon: "wallet-outline", routeName: "MyWallet" },
  { id: "profile", label: "Profile", icon: "person-outline", routeName: "MyProfile" },
];

export default function BottomNavBar({ activeId, navigation }) {
  const insets = useSafeAreaInsets();
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("light");
  const colors = getOwnerColors(theme);

  useEffect(() => {
    let active = true;
    providerApi.getLocalOwner().then((owner) => {
      if (!active) return;
      if (owner?.language) setLanguage(owner.language);
      if (owner?.theme) setTheme(owner.theme);
    });
    const unsubscribe = providerApi.subscribeOwnerProfile?.((owner) => {
      setLanguage(owner?.language || "en");
      setTheme(owner?.theme || "light");
    });
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [activeId]);

  const handlePress = (item) => {
    if (item.id === activeId) {
      return;
    }

    navigation?.navigate?.(item.routeName);
  };

  return (
    <View
      style={[
        styles.bottomNav,
        {
          paddingBottom: Math.max(insets.bottom, 12),
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      ]}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = item.id === activeId;
        const color = isActive ? colors.primary : colors.muted;

        return (
          <TouchableOpacity
            key={item.id}
            style={styles.navItem}
            onPress={() => handlePress(item)}
            activeOpacity={0.8}
          >
            <Ionicons name={item.icon} size={22} color={color} />
            <Text style={[styles.navLabel, { color }, isActive && styles.navLabelActive]}>
              {t(language, item.id)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    borderTopWidth: 1,
    flexDirection: "row",
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingTop: 2,
  },

  navLabel: {
    fontSize: 10,
    fontWeight: "700",
  },

  navLabelActive: {
    fontWeight: "900",
  },
});
