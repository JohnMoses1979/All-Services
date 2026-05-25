import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  Dimensions,
  Animated,
  Modal,
  Pressable,
  StatusBar,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavBar from "../components/BottomNavBar";
import { OWNER_COLORS } from "../styles/ownerTheme";
import { providerApi } from "../api/providerApi";
import { getOwnerColors, t } from "../styles/ownerPreferences";

const { width } = Dimensions.get("window");
const SCREEN_WIDTH = Math.min(width, 430);

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const CATEGORIES = [
  { id: "all", name: "All Services", emoji: "🏷️", color: OWNER_COLORS.primary },
  { id: "household", name: "Household", emoji: "🏠", color: OWNER_COLORS.primary },
  { id: "repairs", name: "Repairs", emoji: "🔧", color: OWNER_COLORS.primary },
  { id: "personalCare", name: "Personal Care", emoji: "💄", color: OWNER_COLORS.accent },
  { id: "healthcare", name: "Healthcare", emoji: "🏥", color: OWNER_COLORS.primary },
  { id: "transport", name: "Transport", emoji: "🚗", color: OWNER_COLORS.accent },
  { id: "petLifestyle", name: "Pet & Lifestyle", emoji: "🐾", color: OWNER_COLORS.accent },
  { id: "personalServices", name: "Personal Services", emoji: "🎓", color: OWNER_COLORS.accent },
  { id: "techSupport", name: "Tech & Support", emoji: "💻", color: OWNER_COLORS.primaryLight },
  { id: "events", name: "Events", emoji: "🎉", color: OWNER_COLORS.accent },
  { id: "outdoor", name: "Outdoor & Safety", emoji: "🌿", color: OWNER_COLORS.primaryLight },
];

const SERVICES = [
  // HOUSEHOLD
  { id: "deepCleaning", name: "Deep Cleaning", emoji: "🧽", color: OWNER_COLORS.primary, bg: OWNER_COLORS.surfaceAlt, category: "household" },
  { id: "homeChef", name: "Home Chef", emoji: "👨‍🍳", color: OWNER_COLORS.accent, bg: OWNER_COLORS.surfaceAlt, category: "household" },
  { id: "maid", name: "Maid", emoji: "🧑‍🔧", color: OWNER_COLORS.primary, bg: OWNER_COLORS.surfaceAlt, category: "household" },
  { id: "laundry", name: "Laundry", emoji: "🧺", color: OWNER_COLORS.primary, bg: OWNER_COLORS.surfaceAlt, category: "household" },
  { id: "waterTankCleaning", name: "Water Tank Cleaning", emoji: "💧", color: OWNER_COLORS.primaryLight, bg: OWNER_COLORS.surfaceAlt, category: "household" },
  { id: "poolCleaning", name: "Pool Cleaning", emoji: "🏊", color: OWNER_COLORS.primaryLight, bg: OWNER_COLORS.surfaceAlt, category: "household" },
  { id: "ironingService", name: "Ironing Service", emoji: "👔", color: OWNER_COLORS.primary, bg: OWNER_COLORS.surfaceAlt, category: "household" },
  { id: "sofaCleaning", name: "Sofa / Carpet Cleaning", emoji: "🛋️", color: OWNER_COLORS.primary, bg: OWNER_COLORS.surfaceAlt, category: "household" },

  // REPAIRS
  { id: "electrician", name: "Electrician", emoji: "💡", color: OWNER_COLORS.accent, bg: OWNER_COLORS.surfaceAlt, category: "repairs" },
  { id: "plumber", name: "Plumber", emoji: "🔧", color: OWNER_COLORS.accent, bg: OWNER_COLORS.surfaceAlt, category: "repairs" },
  { id: "acRepair", name: "AC Repair", emoji: "❄️", color: OWNER_COLORS.primaryLight, bg: OWNER_COLORS.surfaceAlt, category: "repairs" },
  { id: "handyman", name: "Handyman", emoji: "🛠️", color: OWNER_COLORS.accent, bg: OWNER_COLORS.surfaceAlt, category: "repairs" },
  { id: "carpenter", name: "Carpenter", emoji: "🪚", color: OWNER_COLORS.accent, bg: OWNER_COLORS.surfaceAlt, category: "repairs" },
  { id: "painting", name: "Painting", emoji: "🎨", color: OWNER_COLORS.primary, bg: OWNER_COLORS.surfaceAlt, category: "repairs" },
  { id: "furnitureAssembly", name: "Furniture Assembly", emoji: "🪑", color: OWNER_COLORS.accent, bg: OWNER_COLORS.surfaceAlt, category: "repairs" },
  { id: "homeRenovation", name: "Home Renovation", emoji: "🏡", color: OWNER_COLORS.accent, bg: OWNER_COLORS.surfaceAlt, category: "repairs" },
  { id: "tiling", name: "Tiling", emoji: "🔲", color: OWNER_COLORS.primary, bg: OWNER_COLORS.surfaceAlt, category: "repairs" },
  { id: "roofing", name: "Roofing", emoji: "🏠", color: OWNER_COLORS.accent, bg: OWNER_COLORS.surfaceAlt, category: "repairs" },
  { id: "glassFitting", name: "Glass / Window Fitting", emoji: "🪟", color: OWNER_COLORS.primaryLight, bg: OWNER_COLORS.surfaceAlt, category: "repairs" },
  { id: "waterproofing", name: "Waterproofing", emoji: "🛡️", color: OWNER_COLORS.primary, bg: OWNER_COLORS.surfaceAlt, category: "repairs" },

  // PERSONAL CARE
  { id: "salonAtHome", name: "Salon at Home", emoji: "💇", color: OWNER_COLORS.accent, bg: OWNER_COLORS.surfaceAlt, category: "personalCare" },
  { id: "beautician", name: "Beautician", emoji: "💅", color: OWNER_COLORS.accent, bg: OWNER_COLORS.surfaceAlt, category: "personalCare" },
  { id: "massageTherapy", name: "Massage Therapy", emoji: "💆", color: OWNER_COLORS.primary, bg: OWNER_COLORS.surfaceAlt, category: "personalCare" },
  { id: "mehendi", name: "Mehendi Artist", emoji: "🌿", color: OWNER_COLORS.accent, bg: OWNER_COLORS.surfaceAlt, category: "personalCare" },
  { id: "makeupArtist", name: "Makeup Artist", emoji: "💄", color: OWNER_COLORS.accent, bg: OWNER_COLORS.surfaceAlt, category: "personalCare" },

  // HEALTHCARE
  { id: "doctor", name: "Doctor Visit", emoji: "🩺", color: OWNER_COLORS.primaryLight, bg: OWNER_COLORS.surfaceAlt, category: "healthcare" },
  { id: "homeNurse", name: "Home Nurse", emoji: "💊", color: OWNER_COLORS.primary, bg: OWNER_COLORS.surfaceAlt, category: "healthcare" },
  { id: "physiotherapy", name: "Physiotherapy", emoji: "🦯", color: OWNER_COLORS.primary, bg: OWNER_COLORS.surfaceAlt, category: "healthcare" },
  { id: "labTestAtHome", name: "Lab Test at Home", emoji: "🧪", color: OWNER_COLORS.accent, bg: OWNER_COLORS.surfaceAlt, category: "healthcare" },
  { id: "elderCare", name: "Elder Care", emoji: "🧓", color: OWNER_COLORS.primary, bg: OWNER_COLORS.surfaceAlt, category: "healthcare" },
  { id: "babyCare", name: "Baby Care / Nanny", emoji: "👶", color: OWNER_COLORS.accent, bg: OWNER_COLORS.surfaceAlt, category: "healthcare" },

  // TRANSPORT
  { id: "driver", name: "Driver", emoji: "🚗", color: OWNER_COLORS.accent, bg: OWNER_COLORS.surfaceAlt, category: "transport" },
  { id: "carWash", name: "Car Wash", emoji: "🚙", color: OWNER_COLORS.primary, bg: OWNER_COLORS.surfaceAlt, category: "transport" },
  { id: "moving", name: "Shifting / Moving", emoji: "📦", color: OWNER_COLORS.primary, bg: OWNER_COLORS.surfaceAlt, category: "transport" },

  // PET & LIFESTYLE
  { id: "petWalking", name: "Pet Training", emoji: "🦮", color: OWNER_COLORS.primaryLight, bg: OWNER_COLORS.surfaceAlt, category: "petLifestyle" },

  // PERSONAL SERVICES
  { id: "fitnessTrainer", name: "Fitness / Yoga", emoji: "🏋️", color: OWNER_COLORS.accent, bg: OWNER_COLORS.surfaceAlt, category: "personalServices" },
  { id: "tutor", name: "Tutor", emoji: "📚", color: OWNER_COLORS.primary, bg: OWNER_COLORS.surfaceAlt, category: "personalServices" },
  { id: "dietitian", name: "Dietitian / Nutritionist", emoji: "🥗", color: OWNER_COLORS.primary, bg: OWNER_COLORS.surfaceAlt, category: "personalServices" },

  // TECH SUPPORT
  { id: "wifiSetup", name: "WiFi Setup", emoji: "📶", color: OWNER_COLORS.primaryLight, bg: OWNER_COLORS.surfaceAlt, category: "techSupport" },
  { id: "cctvInstallation", name: "CCTV Installation", emoji: "📹", color: OWNER_COLORS.text, bg: OWNER_COLORS.surfaceAlt, category: "techSupport" },
  { id: "security", name: "Security Services", emoji: "🔒", color: OWNER_COLORS.accent, bg: OWNER_COLORS.surfaceAlt, category: "techSupport" },
  { id: "computerRepair", name: "Computer / Laptop Repair", emoji: "💻", color: OWNER_COLORS.primary, bg: OWNER_COLORS.surfaceAlt, category: "techSupport" },

  // EVENTS
  { id: "birthdayDecor", name: "Birthday Decorations", emoji: "🎂", color: OWNER_COLORS.accent, bg: OWNER_COLORS.surfaceAlt, category: "events" },
  { id: "eventPhotography", name: "Event Photography", emoji: "📸", color: OWNER_COLORS.primary, bg: OWNER_COLORS.surfaceAlt, category: "events" },
  { id: "cateringServices", name: "Catering Services", emoji: "🍽️", color: OWNER_COLORS.accent, bg: OWNER_COLORS.surfaceAlt, category: "events" },
  { id: "partyPlanner", name: "Party Planner", emoji: "🎉", color: OWNER_COLORS.accent, bg: OWNER_COLORS.surfaceAlt, category: "events" },
  { id: "tentHouse", name: "Tent House / Mandap", emoji: "🏕️", color: OWNER_COLORS.accent, bg: OWNER_COLORS.surfaceAlt, category: "events" },
  { id: "dj", name: "DJ / Sound System", emoji: "🎶", color: OWNER_COLORS.primary, bg: OWNER_COLORS.surfaceAlt, category: "events" },

  // OUTDOOR
  { id: "gardening", name: "Gardening", emoji: "🌱", color: OWNER_COLORS.primaryLight, bg: OWNER_COLORS.surfaceAlt, category: "outdoor" },
  { id: "pestControl", name: "Pest Control", emoji: "🦟", color: OWNER_COLORS.accent, bg: OWNER_COLORS.surfaceAlt, category: "outdoor" },
  { id: "sewageTreatment", name: "Sewage Treatment", emoji: "🚧", color: OWNER_COLORS.accent, bg: OWNER_COLORS.surfaceAlt, category: "outdoor" },
  { id: "borewellService", name: "Borewell Service", emoji: "⛏️", color: OWNER_COLORS.muted, bg: OWNER_COLORS.surfaceAlt, category: "outdoor" },
  { id: "solarInstallation", name: "Solar Panel Installation", emoji: "☀️", color: OWNER_COLORS.accent, bg: OWNER_COLORS.surfaceAlt, category: "outdoor" },
];

const BANNERS = [
  {
    id: "b1",
    title: "Cleaning Services",
    subtitle: "Get 20% OFF",
    detail: "on first order",
    emoji: "🫧",
    ctaColor: OWNER_COLORS.primary,
    bg: OWNER_COLORS.surfaceAlt,
    accent: OWNER_COLORS.primaryLight,
  },
  {
    id: "b2",
    title: "Home Chef",
    subtitle: "Try Home Cooked",
    detail: "meals from ₹199",
    emoji: "👨‍🍳",
    ctaColor: OWNER_COLORS.accent,
    bg: OWNER_COLORS.surfaceAlt,
    accent: OWNER_COLORS.accentLight,
  },
  {
    id: "b3",
    title: "Doctor at Home",
    subtitle: "Consult Now",
    detail: "in 30 minutes",
    emoji: "🩺",
    ctaColor: OWNER_COLORS.primaryLight,
    bg: "#FFFFFF",
    accent: "#E8F5F5",
  },
];

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "bookings", label: "Bookings", icon: "📋" },
  { id: "wallet", label: "Wallet", icon: "💳" },
  { id: "profile", label: "Profile", icon: "👤" },
];

// ─────────────────────────────────────────────
// SUB COMPONENTS
// ─────────────────────────────────────────────
function DrawerItem({ item, active, onPress, colors }) {
  return (
    <TouchableOpacity
      style={[
        styles.drawerItem,
        active && styles.drawerItemActive,
        active && { backgroundColor: colors.surfaceAlt, borderLeftColor: colors.primary },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.drawerItemEmoji}>{item.emoji}</Text>
      <Text style={[styles.drawerItemText, { color: active ? colors.primary : colors.text }]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
}

function ServiceCard({ service, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.94,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      style={styles.serviceTouchable}
    >
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <View style={[styles.cardIconWrap, { backgroundColor: service.bg }]}>
          <Text style={styles.cardEmoji}>{service.emoji}</Text>
        </View>
        <Text style={styles.cardName}>{service.name}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

function BannerCard({ item, onPress, language }) {
  return (
    <View style={[styles.bannerCard, { backgroundColor: item.bg }]}>
      <View style={[styles.bannerAccentCircle, { backgroundColor: item.accent }]} />
      <View style={styles.bannerLeft}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={[styles.bannerSubtitle, { color: item.ctaColor }]}>
          {item.subtitle}
        </Text>
        <Text style={styles.bannerDetail}>{item.detail}</Text>
        <TouchableOpacity
          style={[styles.bookBtn, { backgroundColor: item.ctaColor }]}
          onPress={onPress}
          activeOpacity={0.85}
        >
          <Text style={styles.bookBtnText}>{t(language, "bookNow")}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.bannerEmoji}>{item.emoji}</Text>
    </View>
  );
}

// ─────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const [owner, setOwner] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [activeBanner, setActiveBanner] = useState(0);

  const bannerListRef = useRef(null);
  const language = owner?.language || "en";
  const colors = getOwnerColors(owner?.theme || "light");
  const labelFor = (key, fallback) => {
    const translated = t(language, key);
    return translated === key ? fallback : translated;
  };

  useEffect(() => {
    let active = true;
    providerApi.getLocalOwner().then((profile) => {
      if (active) setOwner(profile);
    });
    return () => {
      active = false;
    };
  }, []);

  const filteredServices = useMemo(() => {
    return SERVICES.filter((svc) => {
      const matchCat = activeCategory === "all" || svc.category === activeCategory;
      const serviceName = labelFor(`service.${svc.id}`, svc.name);
      const normalizedSearch = search.toLowerCase();
      const matchSearch =
        serviceName.toLowerCase().includes(normalizedSearch) ||
        svc.name.toLowerCase().includes(normalizedSearch);
      return matchCat && matchSearch;
    });
  }, [activeCategory, search, language]);

  const translatedCategories = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        ...cat,
        name:
          cat.id === "all"
            ? t(language, "allServices")
            : labelFor(`category.${cat.id}`, cat.name),
      })),
    [language]
  );

  const activeLabel =
    translatedCategories.find((c) => c.id === activeCategory)?.name ??
    t(language, "allServices");

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    setDrawerOpen(false);
  };

  // Auto-scroll banners
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBanner((prev) => {
        const next = prev === BANNERS.length - 1 ? 0 : prev + 1;
        bannerListRef.current?.scrollToIndex({
          index: next,
          animated: true,
        });
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const onBannerScrollEnd = (event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 36)
    );
    setActiveBanner(index);
  };

  const renderBanner = ({ item }) => (
    <View style={{ width: SCREEN_WIDTH - 36 }}>
      <BannerCard
        item={item}
        onPress={() => navigation.navigate("SignIn")}
        language={language}
      />
    </View>
  );

  const getServiceTarget = (service) => {
    const memberScreenMap = {
      acRepair: "ServiceMembers",
      beautician: "ServiceMembers",
      birthdayDecor: "ServiceMembers",
      carpenter: "ServiceMembers",
      carWash: "ServiceMembers",
      cateringServices: "ServiceMembers",
      deepCleaning: "ServiceMembers",
      eventPhotography: "ServiceMembers",
      fitnessTrainer: "ServiceMembers",
      homeChef: "ServiceMembers",
      kitchen: "ServiceMembers",
      labTestAtHome: "ServiceMembers",
      cleaning: "ServiceMembers",
      massageTherapy: "ServiceMembers",
      gardening: "ServiceMembers",
      laundry: "ServiceMembers",
      moving: "ServiceMembers",
      painting: "ServiceMembers",
      partyPlanner: "ServiceMembers",
      pestControl: "ServiceMembers",
      physiotherapy: "ServiceMembers",
      roofing: "ServiceMembers",
      salonAtHome: "ServiceMembers",
      salon: "ServiceMembers",
      sewageTreatment: "ServiceMembers",
      tiling: "ServiceMembers",
      tutor: "ServiceMembers",
      waterTankCleaning: "ServiceMembers",
      wifiSetup: "ServiceMembers",
    };

    const memberScreenParams = {
      acRepair: { serviceType: "ACRepair", service },
      beautician: { serviceType: "Beautician", service },
      birthdayDecor: { serviceType: "BirthdayDecoration", service },
      carpenter: { serviceType: "Carpenter", service },
      carWash: { serviceType: "CarWash", service },
      cateringServices: { serviceType: "CateringServices", service },
      deepCleaning: { serviceType: "Cleaning", service },
      eventPhotography: { serviceType: "EventPhotography", service },
      fitnessTrainer: { serviceType: "FitnessYogaTrainer", service },
      homeChef: { serviceType: "Cook", service },
      kitchen: { serviceType: "Cook", service },
      labTestAtHome: { serviceType: "LabTestAtHome", service },
      cleaning: { serviceType: "Cleaning", service },
      massageTherapy: { serviceType: "MassageTherapy", service },
      gardening: { serviceType: "Gardening", service },
      laundry: { serviceType: "Laundry", service },
      moving: { serviceType: "Shifting", service },
      painting: { serviceType: "Painting", service },
      partyPlanner: { serviceType: "PartyPlanner", service },
      pestControl: { serviceType: "PestControl", service },
      physiotherapy: { serviceType: "Physiotherapy", service },
      roofing: { serviceType: "Roofing", service },
      salonAtHome: { serviceType: "Salon", service },
      salon: { serviceType: "Salon", service },
      sewageTreatment: { serviceType: "Sewage", service },
      tiling: { serviceType: "Tiling", service },
      tutor: { serviceType: "Tuition", service },
      waterTankCleaning: { serviceType: "WaterTank", service },
      wifiSetup: { serviceType: "WifiSetupInstallation", service },
    };

    if (service.id === "homeNurse") {
      return {
        routeName: "MedicalWorkersList",
        params: { category: "HomeNurse", icon: "💙", service },
      };
    }

    const workerListRouteMap = {
      handyman: { routeName: "WorkersCategoryList", params: { category: "Handyman", icon: "🛠️", service } },
      furnitureAssembly: { routeName: "WorkersCategoryList", params: { category: "FurnitureAssembly", icon: "🪑", service } },
      homeRenovation: { routeName: "WorkersCategoryList", params: { category: "HomeRenovation", icon: "🏡", service } },
      electrician: { routeName: "MedicalWorkersList", params: { category: "Electrician", icon: "💡", service } },
      maid: { routeName: "MedicalWorkersList", params: { category: "Maid", icon: "🧹", service } },
      poolCleaning: { routeName: "MedicalWorkersList", params: { category: "PoolCleaning", icon: "🏊", service } },
      doctor: { routeName: "MedicalWorkersList", params: { category: "Doctor", icon: "🩺", service } },
      "home-nurse": { routeName: "MedicalWorkersList", params: { category: "HomeNurse", icon: "💙", service } },
      driver: { routeName: "WorkersCategoryList", params: { category: "Driver", icon: "🚗", service } },
      plumber: { routeName: "WorkersCategoryList", params: { category: "Plumber", icon: "🔧", service } },
      repairs: { routeName: "WorkersCategoryList", params: { category: "Repairs", icon: "🛠️", service } },
      security: { routeName: "WorkersCategoryList", params: { category: "SecurityGuard", icon: "🔒", service } },
    };

    if (memberScreenMap[service.id]) {
      return {
        routeName: memberScreenMap[service.id],
        params: memberScreenParams[service.id],
      };
    }

    if (workerListRouteMap[service.id]) {
      return workerListRouteMap[service.id];
    }

    return {
      routeName: "WorkersList",
      params: { service },
    };
  };

  const handleServicePress = (service) => {
    navigation.navigate("RegisteredWorkers", {
      skill: service.name,
      title: service.name,
      service,
    });
    return;

    const target = getServiceTarget(service);

    if (
      target.routeName === "ServiceMembers" ||
      service.id === "handyman" ||
      service.id === "homeRenovation" ||
      service.id === "furnitureAssembly" ||
      service.id === "doctor" ||
      service.id === "homeNurse" ||
      service.id === "electrician" ||
      service.id === "maid" ||
      service.id === "poolCleaning" ||
      service.id === "driver" ||
      service.id === "plumber" ||
      service.id === "repairs" ||
      service.id === "security"
    ) {
      navigation.navigate(target.routeName, target.params);
      return;
    }

    navigation.navigate("SignIn", {
      redirectRouteName: target.routeName,
      redirectParams: target.params,
    });
  };

  const renderService = ({ item }) => (
    <ServiceCard
      service={{ ...item, name: labelFor(`service.${item.id}`, item.name) }}
      onPress={() => handleServicePress(item)}
    />
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={owner?.theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.surface}
      />

      {/* Drawer Overlay */}
      <Modal visible={drawerOpen} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setDrawerOpen(false)} />

        <Animated.View style={[styles.drawer, { backgroundColor: colors.surface }]}>
          <View style={styles.drawerHeader}>
            <Text
              style={[
                styles.drawerBadge,
                { backgroundColor: colors.surfaceAlt, color: colors.primary },
              ]}
            >
              {owner?.fullName || "USER"}
            </Text>
            <Text style={[styles.drawerSubtitle, { color: colors.muted }]}>
              {t(language, "browseByCategory")}
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {translatedCategories.map((cat) => (
              <DrawerItem
                key={cat.id}
                item={cat}
                active={activeCategory === cat.id}
                onPress={() => handleCategorySelect(cat.id)}
                colors={colors}
              />
            ))}
          </ScrollView>
        </Animated.View>
      </Modal>

      {/* Main */}
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.header }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.menuBtn}
              onPress={() => setDrawerOpen(true)}
              activeOpacity={0.8}
            >
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
              <View style={styles.menuLineShort} />
            </TouchableOpacity>

            <View style={styles.locationWrap}>
              <Text style={styles.locationLabel}>{t(language, "location")}</Text>
              <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">
                {owner?.address || owner?.societyName || "Gachibowli, Hyderabad"}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.profileMini} activeOpacity={0.8} onPress={() => navigation.navigate("MyProfile")}>
            {owner?.profileImageUri ? (
              <Image source={{ uri: owner.profileImageUri }} style={styles.profileMiniImage} />
            ) : (
              <Text style={styles.profileMiniInitial}>{(owner?.fullName || "U").charAt(0).toUpperCase()}</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={[styles.searchWrap, { backgroundColor: colors.header }]}>
          <View style={styles.searchInner}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder={t(language, "searchServices")}
              placeholderTextColor="#999"
              value={search}
              onChangeText={setSearch}
            />
            <TouchableOpacity style={styles.searchBtn} activeOpacity={0.8}>
              <Text style={styles.searchBtnText}>🔍</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 18 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Banner Section */}
          <View style={styles.bannerSection}>
            <FlatList
              ref={bannerListRef}
              data={BANNERS}
              renderItem={renderBanner}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onBannerScrollEnd}
              snapToInterval={SCREEN_WIDTH - 36}
              decelerationRate="fast"
              getItemLayout={(_, index) => ({
                length: SCREEN_WIDTH - 36,
                offset: (SCREEN_WIDTH - 36) * index,
                index,
              })}
            />

            <View style={styles.dotsRow}>
              {BANNERS.map((_, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => {
                    setActiveBanner(idx);
                    bannerListRef.current?.scrollToIndex({
                      index: idx,
                      animated: true,
                    });
                  }}
                  activeOpacity={0.8}
                  style={[styles.dot, activeBanner === idx && styles.dotActive]}
                />
              ))}
            </View>
          </View>

          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{activeLabel}</Text>
            <Text style={[styles.sectionCount, { color: colors.muted, backgroundColor: colors.surfaceAlt }]}>
              {filteredServices.length}
            </Text>
          </View>

          {/* Services Grid */}
          {filteredServices.length > 0 ? (
            <FlatList
              data={filteredServices}
              renderItem={renderService}
              keyExtractor={(item) => item.id}
              numColumns={3}
              scrollEnabled={false}
              contentContainerStyle={styles.grid}
              columnWrapperStyle={styles.columnWrap}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyText}>{t(language, "noServicesFound")}</Text>
            </View>
          )}
        </ScrollView>

        <BottomNavBar activeId="home" navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const PURPLE = OWNER_COLORS.primary;
const LIGHT_PURPLE = OWNER_COLORS.surfaceAlt;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: OWNER_COLORS.background,
  },
  root: {
    flex: 1,
    alignSelf: "center",
    width: "100%",
    maxWidth: 430,
    backgroundColor: OWNER_COLORS.background,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 250,
    height: "100%",
    backgroundColor: OWNER_COLORS.surface,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 4, height: 0 },
    shadowRadius: 16,
  },
  drawerHeader: {
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: OWNER_COLORS.border,
  },
  drawerBadge: {
    alignSelf: "flex-start",
    backgroundColor: LIGHT_PURPLE,
    color: PURPLE,
    fontWeight: "800",
    fontSize: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 6,
  },
  drawerSubtitle: {
    fontSize: 11,
    color: OWNER_COLORS.muted,
    fontWeight: "600",
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
  },
  drawerItemActive: {
    borderLeftColor: PURPLE,
    backgroundColor: LIGHT_PURPLE,
  },
  drawerItemEmoji: {
    fontSize: 18,
    width: 24,
    textAlign: "center",
  },
  drawerItemText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: OWNER_COLORS.text,
  },
  drawerItemTextActive: {
    color: PURPLE,
  },

  header: {
    backgroundColor: OWNER_COLORS.header,
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginRight: 12,
  },
  locationWrap: {
    flex: 1,
    minWidth: 0,
  },
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: OWNER_COLORS.border,
    backgroundColor: OWNER_COLORS.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  menuLine: {
    width: 18,
    height: 2,
    backgroundColor: OWNER_COLORS.header,
    borderRadius: 2,
  },
  menuLineShort: {
    width: 12,
    height: 2,
    backgroundColor: PURPLE,
    borderRadius: 2,
  },
  locationLabel: {
    fontSize: 10,
    color: "#E8F5F5",
    fontWeight: "600",
    lineHeight: 12,
  },
  locationText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 20,
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: OWNER_COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: OWNER_COLORS.surface,
  },
  bellText: {
    fontSize: 16,
  },
  bellDot: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: OWNER_COLORS.accent,
    borderWidth: 2,
    borderColor: OWNER_COLORS.surface,
  },
  profileMini: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: OWNER_COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: OWNER_COLORS.surface,
    overflow: "hidden",
  },
  profileMiniImage: {
    width: "100%",
    height: "100%",
  },
  profileMiniInitial: {
    fontSize: 16,
    fontWeight: "900",
    color: OWNER_COLORS.primary,
  },

  searchWrap: {
    backgroundColor: OWNER_COLORS.header,
    paddingHorizontal: 18,
    paddingBottom: 14,
  },
  searchInner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: OWNER_COLORS.surfaceAlt,
    borderRadius: 14,
    paddingLeft: 14,
    paddingRight: 6,
    gap: 8,
    height: 46,
  },
  searchIcon: {
    fontSize: 15,
    color: "#bbb",
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: OWNER_COLORS.text,
  },
  searchBtn: {
    width: 34,
    height: 34,
    backgroundColor: PURPLE,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBtnText: {
    fontSize: 15,
  },

  bannerSection: {
    paddingTop: 14,
    paddingHorizontal: 18,
  },
  bannerCard: {
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    minHeight: 140,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  bannerAccentCircle: {
    position: "absolute",
    right: -18,
    top: -18,
    width: 110,
    height: 110,
    borderRadius: 55,
    opacity: 0.45,
  },
  bannerLeft: {
    flex: 1,
    zIndex: 2,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: OWNER_COLORS.text,
    lineHeight: 26,
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 1,
  },
  bannerDetail: {
    fontSize: 12,
    color: OWNER_COLORS.muted,
    marginBottom: 14,
  },
  bookBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  bannerEmoji: {
    fontSize: 72,
    marginRight: -4,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: OWNER_COLORS.border,
  },
  dotActive: {
    width: 18,
    backgroundColor: OWNER_COLORS.primary,
  },

  sectionHeader: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: OWNER_COLORS.text,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: "700",
    color: OWNER_COLORS.muted,
    backgroundColor: OWNER_COLORS.surfaceAlt,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },

  grid: {
    paddingHorizontal: 14,
  },
  columnWrap: {
    justifyContent: "flex-start",
    gap: 8,
    marginBottom: 10,
  },
  serviceTouchable: {
    width: "31.5%",
  },
  card: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: 16,
    backgroundColor: OWNER_COLORS.surface,
    borderWidth: 1,
    borderColor: OWNER_COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    elevation: 1,
  },
  cardIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cardEmoji: {
    fontSize: 28,
  },
  cardName: {
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    color: OWNER_COLORS.text,
    lineHeight: 16,
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
    gap: 10,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "700",
    color: OWNER_COLORS.muted,
  },
});






