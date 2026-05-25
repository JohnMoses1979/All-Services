import React, { useEffect, useState } from "react";
import {
  Image,
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
import BottomNavBar from "../components/BottomNavBar";
import { providerApi } from "../api/providerApi";
import { getOwnerColors, t } from "../styles/ownerPreferences";

export default function MyProfileScreen({ navigation }) {
  const [owner, setOwner] = useState(null);
  const [languageOpen, setLanguageOpen] = useState(false);
  const language = owner?.language || "en";
  const colors = getOwnerColors(owner?.theme || "light");

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

  const updatePreference = async (field, value) => {
    if (!owner?.mobile) return;
    const response = await providerApi.updateOwnerProfile({
      ...owner,
      [field]: value,
      mobile: owner.mobile,
      fullName: owner.fullName || "Owner",
    });
    setOwner(response?.data || { ...owner, [field]: value });
  };

  const languageOptions = [
    { code: "en", label: "English" },
    { code: "te", label: "Telugu" },
    { code: "hi", label: "Hindi" },
  ];

  const accountItems = [
    { icon: "user", title: t(language, "personalInformation"), route: "PersonalDetails" },
    { icon: "map-pin", title: t(language, "addresses"), route: "Addresses" },
    { icon: "credit-card", title: t(language, "paymentMethods"), route: "PaymentMethods", params: { autoStart: true } },
    { icon: "gift", title: t(language, "referEarn"), route: "ReferEarn" },
    { icon: "bell", title: t(language, "notificationSettings"), route: "NotificationSettings" },
    { icon: "help-circle", title: t(language, "helpSupport"), route: "HelpSupport" },
  ];

  const handleNavigate = (route, params) => {
    navigation?.navigate?.(route, params);
  };

  const handleLogout = async () => {
    await providerApi.signout();
    navigation?.navigate?.("Login");
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={owner?.theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.surface}
      />

      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t(language, "myProfile")}</Text>
        </View>
        <TouchableOpacity style={styles.bellBtn}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.profileHero, { backgroundColor: colors.surfaceAlt }]}>
          <View style={styles.profileTop}>
            <View style={[styles.profileAvatar, { backgroundColor: colors.surface }]}>
              {owner?.profileImageUri ? (
                <Image source={{ uri: owner.profileImageUri }} style={styles.avatarImage} />
              ) : (
                <Feather name="user" size={46} color={colors.primary} />
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.profileName, { color: colors.text }]}>{owner?.fullName || "Owner"}</Text>
              <Text style={[styles.profilePhone, { color: colors.text }]}>+91 {owner?.mobile || ""}</Text>
              <Text style={[styles.profileEmail, { color: colors.text }]}>{owner?.societyName || ""}</Text>
            </View>

            <Feather name="chevron-right" size={23} color={colors.text} />
          </View>

          <TouchableOpacity style={[styles.editBtn, { backgroundColor: colors.primary }]} onPress={() => handleNavigate("PersonalDetails")}>
            <Feather name="edit-2" size={16} color="#fff" />
            <Text style={styles.editBtnText}>{t(language, "editProfile")}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t(language, "myAccount")}</Text>
        <View style={[styles.listCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {accountItems.map((item, index) => (
            <ProfileListItem
              key={item.title}
              icon={item.icon}
              title={item.title}
              showDivider={index !== accountItems.length - 1}
              onPress={() => handleNavigate(item.route, item.params)}
              colors={colors}
            />
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t(language, "appSettings")}</Text>
        <View style={[styles.listCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <ProfileListItem
            icon="globe"
            title={t(language, "language")}
            value={language === "te" ? "Telugu" : language === "hi" ? "Hindi" : "English"}
            showDivider
            onPress={() => setLanguageOpen((open) => !open)}
            colors={colors}
          />
          {languageOpen ? (
            <View style={styles.languageOptions}>
              {languageOptions.map((option) => {
                const selected = language === option.code;
                return (
                  <TouchableOpacity
                    key={option.code}
                    style={[
                      styles.languageOption,
                      {
                        backgroundColor: selected ? colors.primary : colors.surfaceAlt,
                        borderColor: selected ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={async () => {
                      await updatePreference("language", option.code);
                      setLanguageOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.languageOptionText,
                        { color: selected ? "#FFFFFF" : colors.text },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
          <ProfileListItem
            icon={owner?.theme === "dark" ? "moon" : "sun"}
            title={t(language, "theme")}
            value={owner?.theme === "dark" ? t(language, "dark") : t(language, "light")}
            showDivider
            onPress={() => updatePreference("theme", owner?.theme === "dark" ? "light" : "dark")}
            colors={colors}
          />
          <TouchableOpacity style={styles.profileItem} onPress={handleLogout}>
            <Feather name="log-out" size={22} color={colors.danger} />
            <Text style={[styles.profileItemTitle, { color: colors.danger }]}>{t(language, "logout")}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 25 }} />
      </ScrollView>

      <BottomNavBar key={`${language}-${owner?.theme || "light"}`} activeId="profile" navigation={navigation} />
    </SafeAreaView>
  );
}

function ProfileListItem({ icon, title, value, showDivider, onPress, colors }) {
  return (
    <>
      <TouchableOpacity style={styles.profileItem} onPress={onPress}>
        <Feather name={icon} size={22} color={colors.muted} />
        <Text style={[styles.profileItemTitle, { color: colors.text }]}>{title}</Text>
        {value ? <Text style={[styles.profileItemValue, { color: colors.muted }]}>{value}</Text> : null}
        <Feather name="chevron-right" size={22} color={colors.muted} />
      </TouchableOpacity>
      {showDivider && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
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
  profileHero: {
    borderRadius: 18,
    padding: 18,
    marginTop: 4,
  },
  profileTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileAvatar: {
    width: 108,
    height: 108,
    borderRadius: 54,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "900",
  },
  profilePhone: {
    fontSize: 13,
    marginTop: 9,
    fontWeight: "700",
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 5,
    fontWeight: "700",
  },
  editBtn: {
    marginTop: 18,
    alignSelf: "flex-end",
    width: 175,
    height: 44,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  editBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    marginTop: 28,
    marginBottom: 12,
  },
  listCard: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  profileItem: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
  },
  profileItemTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 16,
  },
  profileItemValue: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 10,
  },
  divider: {
    height: 1,
    marginLeft: 38,
  },
  languageOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingBottom: 12,
    paddingLeft: 38,
  },
  languageOption: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  languageOptionText: {
    fontSize: 12,
    fontWeight: "800",
  },
});
