// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View, Text, TouchableOpacity, ScrollView,
//   StyleSheet, SafeAreaView,
// } from 'react-native';
// import { BottomNav } from './HomeScreen';
// import { providerApi } from '../api/providerApi';
// import { useFocusEffect } from '@react-navigation/native';


// const GREEN = '#22C55E';
// const LIGHT_GREEN = '#DCFCE7';

// // Remove MENU_ITEMS from the top-level constant and put this INSIDE the component,
// // after the state declarations:


// export default function Profile({ navigation }) {
//   const [provider, setProvider] = useState(null);
//   const [isOnline, setIsOnline] = useState(true); // ← new
//   const MENU_ITEMS = [
//     { icon: '👤', label: 'Personal Information', chevron: true },
//     { icon: '📄', label: 'Documents', tag: 'Verified', tagColor: GREEN, chevron: true },
//     { icon: '🛠️', label: 'Services Offered', chevron: true },
//     { icon: '🏦', label: 'Bank Details', chevron: true },
//     {
//       icon: '📅',
//       label: 'Availability',
//       // ↓ THIS LINE CHANGES — dynamically reflects saved state
//       tag: isOnline ? 'Online' : 'Offline',
//       tagColor: isOnline ? GREEN : '#FB923C',
//       chevron: true,
//     },
//     { icon: '🔒', label: 'Change Password', chevron: true },
//   ];


//   useEffect(() => {
//     const load = () => {
//       providerApi.getProvider().then((p) => { if (p) setProvider(p); });
//       providerApi.getAvailability().then((avail) => {
//         if (avail != null) setIsOnline(avail.isOnline ?? true);
//       });
//     };
//     load();
//     const unsub = navigation.addListener('focus', load);
//     return unsub;
//   }, [navigation]);

//   const fullName = provider?.fullName || 'Provider';
//   const rating = provider?.rating != null ? provider.rating.toFixed(1) : '—';
//   const initials = provider?.initials || '👷';

//   // Handle logout — clear storage and go back to Login
//   const handleLogout = async () => {
//     await providerApi.signout();
//     navigation.reset('Login');
//   };
//   return (
//     <SafeAreaView style={styles.safe}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Text style={{ fontSize: 22, color: '#FFFFFF' }}>←</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>My Profile</Text>
//         <TouchableOpacity>
//           <Text style={{ fontSize: 20, color: '#FFFFFF' }}>✏️</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
//         {/* Profile Info */}
//         <View style={styles.profileCard}>
//           <View style={styles.avatarWrap}>
//             <Text style={{ fontSize: 44 }}>{initials}</Text>
//           </View>
//           <Text style={styles.profileName}>{fullName}</Text>
//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
//             <Text style={{ color: GREEN, fontSize: 14 }}>⭐ {rating}</Text>
//           </View>
//           <View style={styles.verifiedBadge}>
//             <Text style={{ fontSize: 12 }}>✅</Text>
//             <Text style={styles.verifiedText}>Verified Worker</Text>
//           </View>
//         </View>

//         {/* Profile Completion */}
//         <View style={styles.completionCard}>
//           <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
//             <Text style={styles.completionLabel}>Profile Completion</Text>
//             <Text style={styles.completionPct}>80%</Text>
//           </View>
//           <View style={styles.progressBg}>
//             <View style={[styles.progressFill, { width: '80%' }]} />
//           </View>
//         </View>

//         {/* Menu Items */}
//         <View style={styles.menuCard}>
//           {MENU_ITEMS.map((item, i) => (
//             <TouchableOpacity
//               key={item.label}
//               style={[styles.menuItem, i === MENU_ITEMS.length - 1 && { borderBottomWidth: 0 }]}
//               onPress={() => item.label === 'Availability' && navigation.navigate('ProviderSchedule')}
//             >
//               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
//                 <Text style={{ fontSize: 20, color: '#FFFFFF' }}>{item.icon}</Text>
//                 <Text style={styles.menuLabel}>{item.label}</Text>
//               </View>
//               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
//                 {item.tag && (
//                   <Text style={[styles.menuTag, { color: item.tagColor }]}>{item.tag}</Text>
//                 )}
//                 {item.chevron && <Text style={{ color: '#E5E7EB', fontSize: 18 }}>›</Text>}
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Log Out */}
//         <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
//           <Text style={{ fontSize: 18 }}>🚪</Text>
//           <Text style={styles.logoutText}>Log Out</Text>
//         </TouchableOpacity>
//       </ScrollView>

//       <BottomNav navigation={navigation} active="Profile" />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: '#1E3A8A' },
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#1E3A8A', borderBottomWidth: 1, borderBottomColor: HEADER },
//   headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
//   scroll: { paddingHorizontal: 16, paddingBottom: 24 },

//   profileCard: { backgroundColor: '#1E3A8A', borderRadius: 16, padding: 24, alignItems: 'center', marginTop: 16, marginBottom: 12, elevation: 2 },
//   avatarWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: LIGHT_GREEN, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
//   profileName: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
//   verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: LIGHT_GREEN, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, marginTop: 8 },
//   verifiedText: { color: GREEN, fontSize: 12, fontWeight: '600' },

//   completionCard: { backgroundColor: '#1E3A8A', borderRadius: 14, padding: 16, marginBottom: 12, elevation: 2 },
//   completionLabel: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
//   completionPct: { fontSize: 14, fontWeight: '700', color: GREEN },
//   progressBg: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4 },
//   progressFill: { height: 8, backgroundColor: GREEN, borderRadius: 4 },

//   menuCard: { backgroundColor: '#1E3A8A', borderRadius: 14, marginBottom: 16, elevation: 2, overflow: 'hidden' },
//   menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#1E3A8A' },
//   menuLabel: { fontSize: 14, color: '#FFFFFF', fontWeight: '500' },
//   menuTag: { fontSize: 12, fontWeight: '600' },

//   logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, backgroundColor: '#1E3A8A', borderRadius: 14 },
//   logoutText: { color: '#FB923C', fontWeight: '700', fontSize: 15 },
// });



























import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { BottomNav } from './HomeScreen';
import { providerApi } from '../api/providerApi';
import { wt } from './workerPreferences';

const GREEN = '#22C55E';
const LIGHT_GREEN = '#DCFCE7';
const PRIMARY = '#4F46E5';
const HEADER = '#1E1B4B';
const WORKER_LIGHT = {
  bg: '#F8F9FC',
  card: '#FFFFFF',
  text: '#1E1B4B',
  muted: '#6B7280',
  border: '#E5E7EB',
  soft: '#EEF2FF',
};
const WORKER_DARK = {
  bg: '#1E1B4B',
  card: '#172A40',
  text: '#EEF2FF',
  muted: '#B8C7D9',
  border: '#284057',
  soft: '#20364F',
};
const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'te', label: 'Telugu' },
  { code: 'hi', label: 'Hindi' },
];
const PROFILE_SERVICE_OPTIONS = [
  'Deep Cleaning',
  'Home Chef',
  'Maid',
  'Laundry',
  'Electrician',
  'Plumber',
  'AC Repair',
  'Carpenter',
  'Painting',
  'Driver',
  'Security Services',
  'Gardening',
];

// ── Helper: get a human-readable status message based on schedule ─────────────
const getScheduleStatusMessage = (availability) => {
  if (!availability) {
    return { isOnline: true, message: 'Online manually. Tap Availability to set working hours.' };
  }

  const {
    isOnline,
    selectedDays = [],
    startTime = '09:00 AM',
    endTime = '08:00 PM',
    breakEnabled = false,
    breakStart = '01:00 PM',
    breakEnd = '02:00 PM',
  } = availability;

  // Manual override — provider explicitly switched off
  if (!isOnline) {
    return {
      isOnline: false,
      message: 'You manually set yourself Offline. Toggle Availability to go Online.',
    };
  }

  if (selectedDays.length === 0) {
    return {
      isOnline: true,
      message: 'Online manually. Add working days in Availability for automatic schedule control.',
    };
  }

  const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = SHORT_DAYS[new Date().getDay()];
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [timePart, period] = timeStr.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const breakStartMinutes = timeToMinutes(breakStart);
  const breakEndMinutes = timeToMinutes(breakEnd);

  // Today is not a working day — find next working day
  if (!selectedDays.includes(today)) {
    let nextDayIndex = -1;
    for (let i = 1; i <= 7; i++) {
      const checkDay = SHORT_DAYS[(new Date().getDay() + i) % 7];
      if (selectedDays.includes(checkDay)) {
        nextDayIndex = i;
        break;
      }
    }
    const nextDay = nextDayIndex === 1
      ? 'Tomorrow'
      : SHORT_DAYS[(new Date().getDay() + nextDayIndex) % 7];
    return {
      isOnline: false,
      message: `Today (${today}) is not a working day.\nYou'll go Online ${nextDay} at ${startTime}.`,
    };
  }

  // Today IS a working day — before shift starts
  if (nowMinutes < startMinutes) {
    const minsUntil = startMinutes - nowMinutes;
    const hoursUntil = Math.floor(minsUntil / 60);
    const minsRemainder = minsUntil % 60;
    const timeLeft = hoursUntil > 0
      ? `${hoursUntil}h ${minsRemainder}m`
      : `${minsRemainder} min`;
    return {
      isOnline: false,
      message: `⏰ Schedule saved! You'll go Online today at ${startTime} (in ${timeLeft}).`,
    };
  }

  // After shift ends — find next working day
  if (nowMinutes >= endMinutes) {
    let nextDayIndex = -1;
    for (let i = 1; i <= 7; i++) {
      const checkDay = SHORT_DAYS[(new Date().getDay() + i) % 7];
      if (selectedDays.includes(checkDay)) {
        nextDayIndex = i;
        break;
      }
    }
    const nextDay = nextDayIndex === 1
      ? 'Tomorrow'
      : SHORT_DAYS[(new Date().getDay() + nextDayIndex) % 7];
    return {
      isOnline: false,
      message: `Today's shift ended at ${endTime}.\nNext Online: ${nextDay} at ${startTime}.`,
    };
  }

  // Inside break window
  if (breakEnabled && nowMinutes >= breakStartMinutes && nowMinutes < breakEndMinutes) {
    const minsUntil = breakEndMinutes - nowMinutes;
    return {
      isOnline: false,
      message: `☕ Break time! You'll go Online again at ${breakEnd} (in ${minsUntil} min).`,
    };
  }

  // ✅ All checks passed — currently online
  const minsLeft = endMinutes - nowMinutes;
  const hoursLeft = Math.floor(minsLeft / 60);
  const minsRemainder = minsLeft % 60;
  const timeLeft = hoursLeft > 0
    ? `${hoursLeft}h ${minsRemainder}m`
    : `${minsRemainder} min`;
  return {
    isOnline: true,
    message: `🟢 You are Online until ${endTime} (${timeLeft} remaining).`,
  };
};

// ─────────────────────────────────────────────────────────────────────────────

export default function Profile({ navigation }) {
  const [provider, setProvider] = useState(null);
  const [preferences, setPreferences] = useState({ language: 'en', theme: 'light' });
  const [servicesOpen, setServicesOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [scheduleStatus, setScheduleStatus] = useState({
    isOnline: false,
    message: 'Checking schedule…',
  });

  const refreshStatus = async () => {
    const availability = await providerApi.getAvailability();
    const status = getScheduleStatusMessage(availability);
    setScheduleStatus(status);
  };

  // ── Load provider profile on mount ──────────────────────────
  useEffect(() => {
    providerApi.getProvider().then((p) => { if (p) setProvider(p); });
    providerApi.getProviderPreferences().then(setPreferences);
  }, []);

  // ── Real-time status — check every 60 seconds ────────────────
  useEffect(() => {
    refreshStatus();
    const interval = setInterval(refreshStatus, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Re-check when screen comes back into focus ───────────────
  // Fires immediately when navigating back from MyScheduleScreen
  // so the banner updates right away without waiting 60 seconds
  useEffect(() => {
    const unsubscribe = navigation.addListener
      ? navigation.addListener('focus', () => {
        refreshStatus();
        providerApi.getProvider().then((p) => { if (p) setProvider(p); });
        providerApi.getProviderPreferences().then(setPreferences);
      })
      : null;
    return () => { if (unsubscribe) unsubscribe(); };
  }, [navigation]);

  const { isOnline} = scheduleStatus;
  const colors = preferences.theme === 'dark' ? WORKER_DARK : WORKER_LIGHT;

  const MENU_ITEMS = [
    { icon: '👤', label: 'Personal Information', chevron: true },
    { icon: '📄', label: 'Documents', tag: 'Verified', tagColor: GREEN, chevron: true },
    { icon: '🛠️', label: 'Services Offered', chevron: true },
    { icon: '🏦', label: 'Bank Details', chevron: true },
    {
      icon: '📅',
      label: wt(preferences.language, 'availability'),
      key: 'Availability',
      tag: isOnline ? wt(preferences.language, 'online') : wt(preferences.language, 'offline'),
      tagColor: isOnline ? GREEN : '#FB923C',
      chevron: true,
    },
    {
      icon: 'Aa',
      label: wt(preferences.language, 'language'),
      key: 'Language',
      tag: LANGUAGE_OPTIONS.find((option) => option.code === preferences.language)?.label || 'English',
      tagColor: GREEN,
      chevron: true,
    },
    {
      icon: 'T',
      label: wt(preferences.language, 'theme'),
      key: 'Theme',
      tag: wt(preferences.language, preferences.theme === 'dark' ? 'dark' : 'light'),
      tagColor: GREEN,
      chevron: true,
    },
    { icon: '🔒', label: 'Change Password', chevron: true },
  ];

  const fullName = provider?.fullName || 'Provider';
  const rating = provider?.rating != null ? provider.rating.toFixed(1) : '—';
  const initials = provider?.initials || '👷';

  const servicesOffered = Array.isArray(provider?.skills)
    ? provider.skills.filter(Boolean)
    : [];

  const updatePreferences = async (next) => {
    const nextPreferences = { ...preferences, ...next };
    setPreferences(nextPreferences);
    await providerApi.saveProviderPreferences(nextPreferences);
  };

  const toggleService = async (service) => {
    const nextSkills = servicesOffered.includes(service)
      ? servicesOffered.filter((item) => item !== service)
      : [...servicesOffered, service];
    setProvider((prev) => ({ ...(prev || {}), skills: nextSkills }));
    try {
      const response = await providerApi.updateProfile({ skills: nextSkills });
      if (response?.data) setProvider(response.data);
    } catch {
      setProvider((prev) => ({ ...(prev || {}), skills: nextSkills }));
    }
  };

  const handleLogout = async () => {
    await providerApi.signout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: HEADER, borderBottomColor: HEADER }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 22, color: '#FFFFFF' }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>{wt(preferences.language, 'myProfile')}</Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 20, color: '#FFFFFF' }}>✏️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.avatarWrap}>
            <Text style={{ fontSize: 44 }}>{initials}</Text>
          </View>
          <Text style={[styles.profileName, { color: colors.text }]}>{fullName}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <Text style={{ color: GREEN, fontSize: 14 }}>⭐ {rating}</Text>
          </View>
          <View style={styles.verifiedBadge}>
            <Text style={{ fontSize: 12 }}>✅</Text>
            <Text style={styles.verifiedText}>{wt(preferences.language, 'verifiedWorker')}</Text>
          </View>

          {/* Online / Offline pill */}
          <View style={[styles.onlinePill, { backgroundColor: isOnline ? LIGHT_GREEN : colors.soft }]}>
            <View style={[styles.onlineDot, { backgroundColor: isOnline ? GREEN : '#FB923C' }]} />
            <Text style={[styles.onlinePillText, { color: isOnline ? GREEN : '#FB923C' }]}>
              {isOnline ? wt(preferences.language, 'online') : wt(preferences.language, 'offline')}
            </Text>
          </View>
        </View>
        {/* Profile Completion */}
        <View style={[styles.completionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={[styles.completionLabel, { color: colors.text }]}>{wt(preferences.language, 'profileCompletion')}</Text>
            <Text style={styles.completionPct}>80%</Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: '80%' }]} />
          </View>
        </View>

        <View style={[styles.servicesCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.servicesHeader}>
            <Text style={[styles.servicesTitle, { color: colors.text }]}>{wt(preferences.language, 'servicesOffered')}</Text>
            <Text style={styles.servicesCount}>{servicesOffered.length}</Text>
          </View>

          {servicesOffered.length > 0 ? (
            <View style={styles.servicesWrap}>
              {servicesOffered.map((service) => (
                <View key={service} style={styles.serviceChip}>
                  <Text style={styles.serviceChipText}>{service}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.emptyServicesText, { color: colors.muted }]}>
              No services selected yet. {wt(preferences.language, 'addServices')} below.
            </Text>
          )}
          <TouchableOpacity style={styles.addServicesButton} onPress={() => setServicesOpen((open) => !open)}>
            <Text style={styles.addServicesText}>{servicesOpen ? wt(preferences.language, 'done') : wt(preferences.language, 'addServices')}</Text>
          </TouchableOpacity>
          {servicesOpen ? (
            <View style={styles.servicesWrap}>
              {PROFILE_SERVICE_OPTIONS.map((service) => {
                const selected = servicesOffered.includes(service);
                return (
                  <TouchableOpacity
                    key={service}
                    style={[
                      styles.serviceOption,
                      {
                        backgroundColor: selected ? PRIMARY : colors.soft,
                        borderColor: selected ? PRIMARY : colors.border,
                      },
                    ]}
                    onPress={() => toggleService(service)}
                  >
                    <Text style={[styles.serviceOptionText, { color: selected ? '#FFFFFF' : colors.text }]}>
                      {service}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>

        {/* Menu Items */}
        <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {MENU_ITEMS.map((item, i) => (
            <View key={item.label}>
            <TouchableOpacity
              style={[
                styles.menuItem,
                { borderBottomColor: colors.border },
                i === MENU_ITEMS.length - 1 && { borderBottomWidth: 0 },
              ]}
              onPress={() => {
                if (item.key === 'Availability') navigation.navigate('ProviderSchedule');
                if (item.label === 'Personal Information') navigation.navigate('PersonalInformation');
                if (item.key === 'Language') setLanguageOpen((open) => !open);
                if (item.key === 'Theme') setThemeOpen((open) => !open);
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <Text style={{ fontSize: 20, color: '#FFFFFF' }}>{item.icon}</Text>
                <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {item.tag && (
                  <Text style={[styles.menuTag, { color: item.tagColor }]}>{item.tag}</Text>
                )}
                {item.chevron && <Text style={{ color: colors.muted, fontSize: 18 }}>›</Text>}
              </View>
            </TouchableOpacity>
            {item.key === 'Language' && languageOpen ? (
              <View style={styles.menuOptions}>
                {LANGUAGE_OPTIONS.map((option) => {
                  const selected = preferences.language === option.code;
                  return (
                    <TouchableOpacity
                      key={option.code}
                      style={[
                        styles.serviceOption,
                        {
                          backgroundColor: selected ? PRIMARY : colors.soft,
                          borderColor: selected ? PRIMARY : colors.border,
                        },
                      ]}
                      onPress={() => updatePreferences({ language: option.code })}
                    >
                      <Text style={[styles.serviceOptionText, { color: selected ? '#FFFFFF' : colors.text }]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
            {item.key === 'Theme' && themeOpen ? (
              <View style={styles.menuOptions}>
                {['light', 'dark'].map((theme) => {
                  const selected = preferences.theme === theme;
                  return (
                    <TouchableOpacity
                      key={theme}
                      style={[
                        styles.serviceOption,
                        {
                          backgroundColor: selected ? PRIMARY : colors.soft,
                          borderColor: selected ? PRIMARY : colors.border,
                        },
                      ]}
                      onPress={() => updatePreferences({ theme })}
                    >
                      <Text style={[styles.serviceOptionText, { color: selected ? '#FFFFFF' : colors.text }]}>
                        {wt(preferences.language, theme)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
            </View>
          ))}
        </View>

        {/* Log Out */}
        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={handleLogout}
        >
          <Text style={{ fontSize: 18 }}>🚪</Text>
          <Text style={styles.logoutText}>{wt(preferences.language, 'logOut')}</Text>
        </TouchableOpacity>

      </ScrollView>

      <BottomNav navigation={navigation} active="Profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FC' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, backgroundColor: HEADER,
    borderBottomWidth: 1, borderBottomColor: HEADER,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1E1B4B' },
  scroll: { paddingHorizontal: 16, paddingBottom: 24 },
  profileCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24,
    alignItems: 'center', marginTop: 16, marginBottom: 12, elevation: 2,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  avatarWrap: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: LIGHT_GREEN,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  profileName: { fontSize: 20, fontWeight: '800', color: '#1E1B4B' },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: LIGHT_GREEN, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 4, marginTop: 8,
  },
  verifiedText: { color: GREEN, fontSize: 12, fontWeight: '600' },
  onlinePill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, marginTop: 10,
  },
  onlineDot: { width: 8, height: 8, borderRadius: 4 },
  onlinePillText: { fontSize: 13, fontWeight: '700' },
  completionCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16,
    marginBottom: 12, elevation: 2, borderWidth: 1, borderColor: '#E5E7EB',
  },
  completionLabel: { fontSize: 14, fontWeight: '700', color: '#1E1B4B' },
  completionPct: { fontSize: 14, fontWeight: '700', color: GREEN },
  progressBg: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4 },
  progressFill: { height: 8, backgroundColor: GREEN, borderRadius: 4 },
  servicesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  servicesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  servicesTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  servicesCount: {
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: LIGHT_GREEN,
    color: GREEN,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 26,
  },
  servicesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceChip: {
    backgroundColor: LIGHT_GREEN,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  serviceChipText: {
    color: GREEN,
    fontSize: 12,
    fontWeight: '800',
  },
  emptyServicesText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },
  menuCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14,
    marginBottom: 16, elevation: 2, overflow: 'hidden',
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  menuItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 16, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: HEADER,
  },
  menuLabel: { fontSize: 14, color: '#1E1B4B', fontWeight: '700' },
  menuTag: { fontSize: 12, fontWeight: '600' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 16, backgroundColor: '#FFFFFF', borderRadius: 14,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  logoutText: { color: '#FB923C', fontWeight: '700', fontSize: 15 },
  addServicesButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: PRIMARY,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  addServicesText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  serviceOption: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  serviceOptionText: {
    fontSize: 12,
    fontWeight: '800',
  },
  menuOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
});
