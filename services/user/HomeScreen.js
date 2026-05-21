


// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View, Text, TouchableOpacity, ScrollView,
//   Switch, StyleSheet, SafeAreaView,
// } from 'react-native';
// import { providerApi } from '../api/providerApi';
// import { useFocusEffect } from '@react-navigation/native';

// const GREEN = '#22C55E';
// const LIGHT_GREEN = '#DCFCE7';
// const RED = '#FB923C';

// const INITIAL_JOB_REQUESTS = [
//   {
//     id: 'job-1',
//     icon: '🧽',
//     title: 'Deep Cleaning',
//     location: 'Banjara Hills, Hyderabad',
//     time: 'Today, 10:00 AM',
//     price: '₹499',
//     countdown: '00:25',
//     bg: '#1E3A8A',
//   },
//   {
//     id: 'job-2',
//     icon: '💇',
//     title: 'Salon at Home',
//     location: 'Jubilee Hills, Hyderabad',
//     time: 'Today, 02:00 PM',
//     price: '₹299',
//     countdown: '00:28',
//     bg: '#1E3A8A',
//   },
// ];

// export default function HomeScreen({ navigation }) {
//   const [isOnline, setIsOnline] = useState(true);
//   const [jobRequests, setJobRequests] = useState(INITIAL_JOB_REQUESTS);
//   const [ownerNotice, setOwnerNotice] = useState('');
//   const [provider, setProvider] = useState(null);

//   // Reload provider profile AND availability every time the screen gets focus.
//   // navigation.addListener('focus') works without any extra package.
//   useEffect(() => {
//     const load = () => {
//       providerApi.getProvider().then((p) => { if (p) setProvider(p); });
//       providerApi.getAvailability().then((avail) => {
//         if (avail != null) setIsOnline(avail.isOnline ?? true);
//       });
//     };
//     load(); // run on mount
//     const unsub = navigation.addListener('focus', load); // run on every re-focus
//     return unsub;
//   }, [navigation]);

//   // Derive first name safely
//   const firstName = provider?.fullName
//     ? provider.fullName.trim().split(' ')[0]
//     : 'there';

//   const handleAcceptJob = (job) => {
//     setJobRequests((prev) => prev.filter((item) => item.id !== job.id));
//     setOwnerNotice(`${job.title} accepted. Confirmation sent to owner.`);
//   };

//   const handleRejectJob = (job) => {
//     setJobRequests((prev) => prev.filter((item) => item.id !== job.id));
//     setOwnerNotice(`${job.title} request rejected.`);
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

//         {/* Header */}
//         <View style={styles.header}>
//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
//             {/* ↓ was hardcoded "Hi, Rajesh 👋" */}
//             <Text style={[styles.greeting, { color: colors.text }]}>Hi, {firstName} 👋</Text>
//             <View style={styles.onlineBadge}>
//               <View style={styles.dot} />
//               <Text style={styles.onlineBadgeText}>Online</Text>
//             </View>
//           </View>
//           <TouchableOpacity onPress={() => navigation.navigate('ProviderNotifications')}>
//             <Text style={{ fontSize: 22 }}>🔔</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Earnings Card */}
//         <View style={styles.earningsCard}>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.earningsLabel}>Today's Earnings</Text>
//             <Text style={styles.earningsAmount}>₹1,250</Text>
//             <TouchableOpacity style={styles.viewBtn} onPress={() => navigation.navigate('ProviderEarnings')}>
//               <Text style={styles.viewBtnText}>View Earnings</Text>
//             </TouchableOpacity>
//           </View>
//           <Text style={{ fontSize: 60 }}>👜</Text>
//         </View>

//         {/* Online Toggle */}
//         <View style={styles.toggleCard}>
//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
//             <Text style={{ fontSize: 22 }}>🕐</Text>
//             <View>
//               <Text style={styles.toggleTitle}>You are Online</Text>
//               <Text style={styles.toggleSub}>You will receive new booking requests</Text>
//             </View>
//           </View>
//           <Switch
//             value={isOnline}
//             onValueChange={async (val) => {
//               setIsOnline(val);
//               const current = await providerApi.getAvailability();
//               await providerApi.saveAvailability({ ...(current || {}), isOnline: val });
//             }}
//             trackColor={{ false: '#E5E7EB', true: GREEN }}
//             thumbColor="#FFFFFF"
//           />
//         </View>

//         {/* Today's Overview */}
//         <Text style={styles.sectionTitle}>Today's Overview</Text>
//         <View style={styles.overviewRow}>
//           {[
//             { icon: '📋', value: '4', label: 'Bookings', color: '#FFFFFF' },
//             { icon: '✅', value: '3', label: 'Completed', color: '#FFFFFF' },
//             { icon: '⭐', value: '4.8', label: 'Rating', color: GREEN },
//           ].map((item) => (
//             <View key={item.label} style={[styles.overviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
//               <Text style={{ fontSize: 20 }}>{item.icon}</Text>
//               <Text style={[styles.overviewValue, { color: item.color }]}>{item.value}</Text>
//               <Text style={[styles.overviewLabel, { color: colors.muted }]}>{item.label}</Text>
//             </View>
//           ))}
//         </View>

//         {/* New Job Requests */}
//         <View style={styles.jobHeader}>
//           <View style={styles.jobHeaderLeft}>
//             <Text style={styles.sectionTitle}>New Job Requests</Text>
//             <View style={styles.requestCountBadge}>
//               <Text style={styles.requestCountText}>{jobRequests.length}</Text>
//             </View>
//           </View>
//           <TouchableOpacity onPress={() => navigation.navigate('ProviderBookings')}>
//             <Text style={styles.viewAllBlue}>View All</Text>
//           </TouchableOpacity>
//         </View>

//         {ownerNotice ? (
//           <View style={[styles.ownerNotice, { backgroundColor: colors.soft, borderColor: colors.border }]}>
//             <Text style={styles.ownerNoticeText}>{ownerNotice}</Text>
//           </View>
//         ) : null}

//         {jobRequests.length === 0 ? (
//           <View style={[styles.emptyRequestsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
//             <Text style={[styles.emptyRequestsTitle, { color: colors.text }]}>No new job requests</Text>
//             <Text style={[styles.emptyRequestsSub, { color: colors.muted }]}>Accepted jobs will appear in your bookings.</Text>
//           </View>
//         ) : (
//           jobRequests.map((job) => (
//             <View key={job.id} style={[styles.jobRequestCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
//               <View style={styles.jobRequestTop}>
//                 <View style={[styles.jobIconWrap, { backgroundColor: job.bg }]}>
//                   <Text style={styles.jobIcon}>{job.icon}</Text>
//                 </View>

//                 <View style={styles.jobDetails}>
//                   <Text style={[styles.jobTitle, { color: colors.text }]}>{job.title}</Text>
//                   <View style={styles.jobMetaRow}>
//                     <Text style={[styles.jobMetaIcon, { color: colors.muted }]}>📍</Text>
//                     <Text style={[styles.jobMetaText, { color: colors.muted }]}>{job.location}</Text>
//                   </View>
//                   <View style={styles.jobMetaRow}>
//                     <Text style={[styles.jobMetaIcon, { color: colors.muted }]}>🕒</Text>
//                     <Text style={[styles.jobMetaText, { color: colors.muted }]}>{job.time}</Text>
//                   </View>
//                 </View>

//                 <View style={styles.jobSide}>
//                   <View style={styles.timerBadge}>
//                     <Text style={styles.timerText}>⏱ {job.countdown}</Text>
//                   </View>
//                   <Text style={styles.jobPrice}>{job.price}</Text>
//                 </View>
//               </View>

//               <View style={styles.jobActions}>
//                 <TouchableOpacity
//                   style={styles.rejectBtn}
//                   onPress={() => handleRejectJob(job)}
//                 >
//                   <Text style={styles.rejectBtnText}>Reject</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.acceptBtn}
//                   onPress={() => handleAcceptJob(job)}
//                 >
//                   <Text style={styles.acceptBtnText}>Accept</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           ))
//         )}

//         {/* Current Booking */}
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Current Booking</Text>
//           <TouchableOpacity onPress={() => navigation.navigate('ProviderBookings')}>
//             <Text style={styles.viewAll}>View All</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={[styles.bookingCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
//           <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
//             <Text style={[styles.bookingTitle, { color: colors.text }]}>Deep Cleaning</Text>
//             <View style={styles.inProgressBadge}>
//               <Text style={styles.inProgressText}>In Progress</Text>
//             </View>
//           </View>
//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
//             <Text>👤</Text><Text style={[styles.bookingInfo, { color: colors.muted }]}>Priya Sharma</Text>
//           </View>
//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
//             <Text>📍</Text><Text style={[styles.bookingInfo, { color: colors.muted }]}>Banjara Hills, Hyd</Text>
//           </View>
//           <View style={{ alignItems: 'flex-end', marginBottom: 14 }}>
//             <Text style={{ fontSize: 11, color: '#E5E7EB' }}>Arriving in</Text>
//             <Text style={{ fontSize: 18, fontWeight: '800', color: '#FFFFFF' }}>8 mins</Text>
//           </View>
//           <TouchableOpacity style={styles.openBtn}
//             onPress={() => navigation.navigate('ProviderBookingDetails')}>
//             <Text style={styles.openBtnText}>Open Details</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       <BottomNav navigation={navigation} active="Home" />
//     </SafeAreaView>
//   );
// }

// export function BottomNav({ navigation, active }) {
//   const tabs = [
//     { icon: '🏠', label: 'Home', screen: 'ProviderHome' },
//     { icon: '📅', label: 'Bookings', screen: 'ProviderBookings' },
//     { icon: '💳', label: 'Earnings', screen: 'ProviderEarnings' },
//     { icon: '👤', label: 'Profile', screen: 'ProviderProfile' },
//   ];
//   return (
//     <View style={navStyles.nav}>
//       {tabs.map((t) => (
//         <TouchableOpacity key={t.label} style={navStyles.item} onPress={() => navigation.navigate(t.screen)}>
//           <Text style={{ fontSize: 22 }}>{t.icon}</Text>
//           <Text style={[navStyles.label, active === t.label && navStyles.active]}>{t.label}</Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );
// }

// const navStyles = StyleSheet.create({
//   nav: { flexDirection: 'row', backgroundColor: '#1E3A8A', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingVertical: 8, paddingBottom: 12 },
//   item: { flex: 1, alignItems: 'center', gap: 2 },
//   label: { fontSize: 11, color: '#E5E7EB' },
//   active: { color: PRIMARY, fontWeight: '700' },
// });

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: '#1E3A8A' },
//   scroll: { paddingHorizontal: 16, paddingBottom: 24 },
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: HEADER, marginHorizontal: -16, marginBottom: 16, paddingHorizontal: 16, paddingVertical: 14 },
//   greeting: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
//   onlineBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: LIGHT_GREEN, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, gap: 4 },
//   dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: GREEN },
//   onlineBadgeText: { color: GREEN, fontSize: 12, fontWeight: '600' },
//   earningsCard: { backgroundColor: PRIMARY, borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
//   earningsLabel: { color: '#E5E7EB', fontSize: 13, marginBottom: 4 },
//   earningsAmount: { color: '#FFFFFF', fontSize: 32, fontWeight: '800', marginBottom: 14 },
//   viewBtn: { backgroundColor: '#1E3A8A', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, alignSelf: 'flex-start' },
//   viewBtnText: { color: PRIMARY, fontWeight: '600', fontSize: 13 },
//   toggleCard: { backgroundColor: '#1E3A8A', borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, elevation: 2 },
//   toggleTitle: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
//   toggleSub: { fontSize: 11, color: '#E5E7EB', marginTop: 2 },
//   sectionTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 12 },
//   sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 4 },
//   viewAll: { color: PRIMARY, fontSize: 13, fontWeight: '600' },
//   overviewRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
//   overviewCard: { flex: 1, backgroundColor: '#1E3A8A', borderRadius: 12, padding: 14, alignItems: 'center', elevation: 2 },
//   overviewValue: { fontSize: 20, fontWeight: '800' },
//   overviewLabel: { fontSize: 11, color: '#E5E7EB', marginTop: 2 },
//   jobHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
//   jobHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   requestCountBadge: { width: 26, height: 26, borderRadius: 13, backgroundColor: RED, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
//   requestCountText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
//   viewAllBlue: { color: PRIMARY, fontSize: 14, fontWeight: '700', marginBottom: 12 },
//   ownerNotice: { backgroundColor: LIGHT_GREEN, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
//   ownerNoticeText: { color: GREEN, fontSize: 13, fontWeight: '700' },
//   emptyRequestsCard: { backgroundColor: '#1E3A8A', borderRadius: 16, padding: 18, marginBottom: 20, alignItems: 'center', elevation: 2 },
//   emptyRequestsTitle: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
//   emptyRequestsSub: { fontSize: 12, color: '#E5E7EB', marginTop: 4 },
//   jobRequestCard: { backgroundColor: '#1E3A8A', borderRadius: 18, padding: 16, marginBottom: 18, elevation: 3 },
//   jobRequestTop: { flexDirection: 'row', alignItems: 'flex-start' },
//   jobIconWrap: { width: 90, height: 90, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
//   jobIcon: { fontSize: 46 },
//   jobDetails: { flex: 1, paddingTop: 4 },
//   jobTitle: { fontSize: 19, fontWeight: '800', color: '#FFFFFF', marginBottom: 8 },
//   jobMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
//   jobMetaIcon: { fontSize: 15, width: 22 },
//   jobMetaText: { flex: 1, color: '#E5E7EB', fontSize: 14, fontWeight: '500' },
//   jobSide: { alignItems: 'flex-end', justifyContent: 'space-between', minHeight: 88, marginLeft: 8 },
//   timerBadge: { backgroundColor: '#1E3A8A', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
//   timerText: { color: RED, fontSize: 13, fontWeight: '800' },
//   jobPrice: { color: GREEN, fontSize: 20, fontWeight: '900' },
//   jobActions: { flexDirection: 'row', gap: 12, marginTop: 14 },
//   rejectBtn: { flex: 1, borderWidth: 1.5, borderColor: RED, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
//   rejectBtnText: { color: RED, fontSize: 16, fontWeight: '800' },
//   acceptBtn: { flex: 1, backgroundColor: PRIMARY, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
//   acceptBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
//   bookingCard: { backgroundColor: '#1E3A8A', borderRadius: 14, padding: 16, elevation: 3 },
//   bookingTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
//   inProgressBadge: { backgroundColor: LIGHT_GREEN, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
//   inProgressText: { color: GREEN, fontSize: 12, fontWeight: '600' },
//   bookingInfo: { fontSize: 13, color: '#E5E7EB' },
//   openBtn: { backgroundColor: PRIMARY, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
//   openBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
// });




import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  Switch, StyleSheet, SafeAreaView, TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { providerApi } from '../api/providerApi';
import { DEFAULT_WORKER_AVAILABILITY, getWorkerColors, useWorkerPreferences, wt } from './workerPreferences';

const GREEN = '#22C55E';
const LIGHT_GREEN = '#DCFCE7';
const PRIMARY = '#4F46E5';
const HEADER = '#1E1B4B';
const RED = '#FB923C';
const WORKER_BG = '#F8F9FC';
const WORKER_BG_ALT = '#EEF2FF';
const WORKER_CARD = '#FFFFFF';
const WORKER_TEXT = '#1E1B4B';
const WORKER_MUTED = '#6B7280';
const WORKER_BORDER = '#E5E7EB';

const INITIAL_JOB_REQUESTS = [
  {
    id: 'job-1',
    icon: '🧽',
    title: 'Deep Cleaning',
    location: 'Banjara Hills, Hyderabad',
    time: 'Today, 10:00 AM',
    price: '₹499',
    countdown: '00:25',
    bg: '#DDF7EC',
  },
  {
    id: 'job-2',
    icon: '💇',
    title: 'Salon at Home',
    location: 'Jubilee Hills, Hyderabad',
    time: 'Today, 02:00 PM',
    price: '₹299',
    countdown: '00:28',
    bg: '#F8F9FC',
  },
];

export default function HomeScreen({ navigation, route }) {
  const [isOnline, setIsOnline] = useState(false);
  const [jobRequests, setJobRequests] = useState([]);
  const [otpInputs, setOtpInputs] = useState({});
  const [ownerNotice, setOwnerNotice] = useState('');
  const [earningsVisible, setEarningsVisible] = useState(true);
  const [provider, setProvider] = useState(route?.params?.provider || null);
  const preferences = useWorkerPreferences();
  const lang = preferences.language;
  const colors = getWorkerColors(preferences.theme);

  const loadProviderHome = async () => {
    let freshProvider = null;
    try {
      freshProvider = await providerApi.getProvider();
      if (!freshProvider && route?.params?.provider) {
        freshProvider = route.params.provider;
      }
      if (freshProvider) setProvider(freshProvider);
      if (freshProvider?.id) {
        const bookingsResponse = await providerApi.getProviderBookings(freshProvider.id);
        setJobRequests(Array.isArray(bookingsResponse?.data) ? bookingsResponse.data : []);
      }
    } catch {
      freshProvider = provider || route?.params?.provider || null;
    }

    const savedAvailability = await providerApi.getAvailability();
    const onlineNow = savedAvailability?.isOnline ?? freshProvider?.available ?? false;
    setIsOnline(onlineNow);

    if (freshProvider) {
      setProvider({ ...freshProvider, available: onlineNow });
    }
  };

  useEffect(() => {
    loadProviderHome();
    const unsubscribe = navigation.addListener
      ? navigation.addListener('focus', loadProviderHome)
      : null;

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [navigation, route?.params?.provider]);

  const providerDisplayName =
    provider?.fullName ||
    provider?.name ||
    provider?.providerName ||
    provider?.firstName ||
    provider?.mobile ||
    '';
  const firstName = providerDisplayName
    ? String(providerDisplayName).trim().split(' ')[0]
    : 'there';

  const refreshProviderBookings = async () => {
    const providerId = provider?.id;
    if (!providerId) return;
    const response = await providerApi.getProviderBookings(providerId);
    setJobRequests(Array.isArray(response?.data) ? response.data : []);
  };

  const handleAcceptJob = async (job) => {
    await providerApi.acceptBooking(job.id);
    await refreshProviderBookings();
    setOwnerNotice(`${job.serviceName || job.title} accepted. OTP sent to owner screen.`);
  };

  const handleRejectJob = async (job) => {
    await providerApi.rejectBooking(job.id);
    await refreshProviderBookings();
    setOwnerNotice(`${job.serviceName || job.title} request rejected.`);
  };

  const handleStartJob = async (job) => {
    const otp = otpInputs[job.id] || '';
    await providerApi.startBooking(job.id, otp);
    await refreshProviderBookings();
    setOwnerNotice(`${job.serviceName} started.`);
  };

  const handleCompleteJob = async (job) => {
    await providerApi.completeBooking(job.id);
    await refreshProviderBookings();
    setOwnerNotice(`${job.serviceName} completed. Owner can make payment now.`);
  };

  const newRequests = jobRequests.filter((job) => job.status === 'REQUESTED');
  const activeBooking = jobRequests.find((job) => job.status === 'ACCEPTED' || job.status === 'STARTED');
  const completedCount = jobRequests.filter((job) => ['COMPLETED', 'PAID', 'RATED'].includes(job.status)).length;
  const today = new Date().toISOString().slice(0, 10);
  const todayEarnings = jobRequests
    .filter((job) => ['PAID', 'RATED'].includes(job.status))
    .filter((job) => !job.bookingDate || String(job.bookingDate).slice(0, 10) === today)
    .reduce((sum, job) => sum + Number(job.amount || 0), 0);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.greeting}>Hi, {firstName} 👋</Text>
            <View style={[styles.onlineBadge, !isOnline && styles.offlineBadge]}>
              <View style={[styles.dot, !isOnline && styles.dotOffline]} />
              <Text style={[styles.onlineBadgeText, !isOnline && styles.offlineBadgeText]}>
                {isOnline ? wt(lang, 'online') : wt(lang, 'offline')}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('ProviderNotifications')}>
            <Text style={{ fontSize: 22 }}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Earnings Card */}
        <View style={styles.earningsCard}>
          <View style={{ flex: 1 }}>
            <View style={styles.earningsHeaderRow}>
              <Text style={styles.earningsLabel}>{wt(lang, 'todaysEarnings')}</Text>
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setEarningsVisible((visible) => !visible)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name={earningsVisible ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.earningsAmount}>
              {earningsVisible ? `Rs ${todayEarnings}` : 'Rs ****'}
            </Text>
            <TouchableOpacity style={styles.viewBtn} onPress={() => navigation.navigate('ProviderEarnings')}>
              <Text style={styles.viewBtnText}>{wt(lang, 'viewEarnings')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.walletIconWrap}>
            <MaterialCommunityIcons name="wallet" size={48} color="#FFFFFF" />
          </View>
        </View>

        {/* Online Toggle */}
        <View style={[styles.toggleCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
            <Text style={{ fontSize: 22 }}>🕐</Text>
            <View>
              <Text style={[styles.toggleTitle, { color: colors.text }]}>
                {isOnline ? wt(lang, 'youAreOnline') : wt(lang, 'youAreOffline')}
              </Text>
              <Text style={[styles.toggleSub, { color: colors.muted }]}>
                {isOnline
                  ? wt(lang, 'receiveRequests')
                  : wt(lang, 'noRequests')}
              </Text>
            </View>
          </View>
          <Switch
            value={isOnline}
            onValueChange={async (val) => {
              setIsOnline(val);
              const current = await providerApi.getAvailability();
              await providerApi.saveAvailability({
                ...DEFAULT_WORKER_AVAILABILITY,
                ...(current || {}),
                isOnline: val,
              });
              try {
                await providerApi.updateProfile({ available: val });
                setProvider((prev) => (prev ? { ...prev, available: val } : prev));
              } catch {
                setOwnerNotice('Online status saved on this phone, but server update failed.');
              }
            }}
            trackColor={{ false: '#E5E7EB', true: GREEN }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Today's Overview */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{wt(lang, 'todaysOverview')}</Text>
        <View style={styles.overviewRow}>
          {[
            { icon: '📋', value: String(jobRequests.length), label: 'Bookings', color: colors.text },
            { icon: '✅', value: String(completedCount), label: 'Completed', color: colors.text },
            { icon: '⭐', value: String(provider?.rating ?? '0.0'), label: 'Rating', color: GREEN },
          ].map((item) => (
            <View key={item.label} style={[styles.overviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={{ fontSize: 20 }}>{item.icon}</Text>
              <Text style={[styles.overviewValue, { color: item.color }]}>{item.value}</Text>
              <Text style={[styles.overviewLabel, { color: colors.muted }]}>
                {item.label === 'Bookings'
                  ? wt(lang, 'bookings')
                  : item.label === 'Completed'
                    ? wt(lang, 'completed')
                    : item.label === 'Rating'
                      ? wt(lang, 'rating')
                      : item.label}
              </Text>
            </View>
          ))}
        </View>

        {/* New Job Requests */}
        <View style={styles.jobHeader}>
          <View style={styles.jobHeaderLeft}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{wt(lang, 'newJobRequests')}</Text>
            <View style={styles.requestCountBadge}>
              <Text style={styles.requestCountText}>{newRequests.length}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('ProviderBookings')}>
            <Text style={styles.viewAllBlue}>{wt(lang, 'viewAll')}</Text>
          </TouchableOpacity>
        </View>

        {ownerNotice ? (
          <View style={[styles.ownerNotice, { backgroundColor: colors.soft, borderColor: colors.border }]}>
            <Text style={styles.ownerNoticeText}>{ownerNotice}</Text>
          </View>
        ) : null}

        {newRequests.length === 0 ? (
          <View style={[styles.emptyRequestsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.emptyRequestsTitle, { color: colors.text }]}>{wt(lang, 'noNewJobRequests')}</Text>
            <Text style={[styles.emptyRequestsSub, { color: colors.muted }]}>{wt(lang, 'acceptedJobsAppear')}</Text>
          </View>
        ) : (
          newRequests.map((job) => (
            <View key={job.id} style={[styles.jobRequestCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.jobRequestTop}>
                <View style={[styles.jobIconWrap, { backgroundColor: colors.soft }]}>
                  <Text style={styles.jobIcon}>📋</Text>
                </View>
                <View style={styles.jobDetails}>
                  <Text style={[styles.jobTitle, { color: colors.text }]}>{job.serviceName || job.title}</Text>
                  <View style={styles.jobMetaRow}>
                    <Text style={[styles.jobMetaIcon, { color: colors.muted }]}>📍</Text>
                    <Text style={[styles.jobMetaText, { color: colors.muted }]}>{job.address || job.location}</Text>
                  </View>
                  <View style={styles.jobMetaRow}>
                    <Text style={[styles.jobMetaIcon, { color: colors.muted }]}>Date</Text>
                    <Text style={[styles.jobMetaText, { color: colors.muted }]}>{job.bookingDate || job.date}</Text>
                  </View>
                  <View style={styles.jobMetaRow}>
                    <Text style={[styles.jobMetaIcon, { color: colors.muted }]}>🕒</Text>
                    <Text style={[styles.jobMetaText, { color: colors.muted }]}>{job.timeSlot || job.time}</Text>
                  </View>
                </View>
                <View style={styles.jobSide}>
                  <View style={styles.timerBadge}>
                    <Text style={styles.timerText}>{job.status}</Text>
                  </View>
                  <Text style={styles.jobPrice}>Rs {job.amount}</Text>
                </View>
              </View>
              <View style={styles.jobActions}>
                <TouchableOpacity style={styles.rejectBtn} onPress={() => handleRejectJob(job)}>
                  <Text style={styles.rejectBtnText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAcceptJob(job)}>
                  <Text style={styles.acceptBtnText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* Current Booking */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{wt(lang, 'currentBooking')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ProviderBookings')}>
            <Text style={styles.viewAll}>{wt(lang, 'viewAll')}</Text>
          </TouchableOpacity>
        </View>

        {activeBooking ? (
        <View style={[styles.bookingCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text style={[styles.bookingTitle, { color: colors.text }]}>{activeBooking.serviceName}</Text>
            <View style={styles.inProgressBadge}>
              <Text style={styles.inProgressText}>{activeBooking.status}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Text>👤</Text><Text style={[styles.bookingInfo, { color: colors.muted }]}>{activeBooking.customerName}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Text>📍</Text><Text style={[styles.bookingInfo, { color: colors.muted }]}>{activeBooking.address}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Text style={{ color: colors.text }}>Date</Text><Text style={[styles.bookingInfo, { color: colors.muted }]}>{activeBooking.bookingDate}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Text style={{ color: colors.text }}>Time</Text><Text style={[styles.bookingInfo, { color: colors.muted }]}>{activeBooking.timeSlot}</Text>
          </View>
          {activeBooking.status === 'ACCEPTED' ? (
            <>
              <TextInput
                style={[styles.otpInput, { backgroundColor: colors.soft, borderColor: colors.border, color: colors.text }]}
                value={otpInputs[activeBooking.id] || ''}
                onChangeText={(text) => setOtpInputs((prev) => ({ ...prev, [activeBooking.id]: text }))}
                placeholder="Enter owner OTP"
                keyboardType="number-pad"
                maxLength={6}
              />
              <TouchableOpacity style={styles.openBtn} onPress={() => handleStartJob(activeBooking)}>
                <Text style={styles.openBtnText}>Start Work</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.openBtn} onPress={() => handleCompleteJob(activeBooking)}>
              <Text style={styles.openBtnText}>Close Service</Text>
            </TouchableOpacity>
          )}
        </View>
        ) : (
          <View style={[styles.emptyRequestsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.emptyRequestsTitle, { color: colors.text }]}>{wt(lang, 'noActiveBooking')}</Text>
            <Text style={[styles.emptyRequestsSub, { color: colors.muted }]}>{wt(lang, 'activeBookingHint')}</Text>
          </View>
        )}
      </ScrollView>

      <BottomNav navigation={navigation} active="Home" />
    </SafeAreaView>
  );
}

export function BottomNav({ navigation, active }) {
  const preferences = useWorkerPreferences();
  const colors = getWorkerColors(preferences.theme);

  const tabs = [
    { icon: '🏠', key: 'Home', label: wt(preferences.language, 'home'), screen: 'ProviderHome' },
    { icon: '📅', key: 'Bookings', label: wt(preferences.language, 'bookings'), screen: 'ProviderBookings' },
    { icon: '💳', key: 'Earnings', label: wt(preferences.language, 'earnings'), screen: 'ProviderEarnings' },
    { icon: '👤', key: 'Profile', label: wt(preferences.language, 'profile'), screen: 'ProviderProfile' },
  ];
  return (
    <View style={[navStyles.nav, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      {tabs.map((t) => (
        <TouchableOpacity key={t.label} style={navStyles.item} onPress={() => navigation.navigate(t.screen)}>
          <Text style={{ fontSize: 22 }}>{t.icon}</Text>
          <Text
            style={[
              navStyles.label,
              { color: active === t.key ? PRIMARY : colors.muted },
              active === t.key && navStyles.active,
            ]}
          >
            {t.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const navStyles = StyleSheet.create({
  nav: { flexDirection: 'row', backgroundColor: WORKER_CARD, borderTopWidth: 1, borderTopColor: WORKER_BORDER, paddingVertical: 8, paddingBottom: 12 },
  item: { flex: 1, alignItems: 'center', gap: 2 },
  label: { fontSize: 11, color: WORKER_MUTED, fontWeight: '700' },
  active: { color: PRIMARY, fontWeight: '700' },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: WORKER_BG },
  scroll: { paddingHorizontal: 16, paddingBottom: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: HEADER, marginHorizontal: -16, marginBottom: 16, paddingHorizontal: 16, paddingVertical: 14 },
  greeting: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: LIGHT_GREEN, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, gap: 4 },
  offlineBadge: { backgroundColor: '#FFF3E8' },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: GREEN },
  dotOffline: { backgroundColor: '#FB923C' },
  onlineBadgeText: { color: GREEN, fontSize: 12, fontWeight: '600' },
  offlineBadgeText: { color: '#FB923C' },
  earningsCard: { backgroundColor: PRIMARY, borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  earningsHeaderRow: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom: 4 },
  earningsLabel: { color: '#EFFFF8', fontSize: 13, marginBottom: 4, fontWeight: '700' },
  eyeBtn: { width: 34, height: 30, alignItems: 'center', justifyContent: 'center', marginLeft: 8, marginTop: -4 },
  earningsAmount: { color: '#FFFFFF', fontSize: 32, fontWeight: '800', marginBottom: 14 },
  viewBtn: { backgroundColor: '#FFFFFF', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, alignSelf: 'flex-start' },
  viewBtnText: { color: PRIMARY, fontWeight: '800', fontSize: 13 },
  walletIconWrap: { width: 72, height: 72, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.16)' },
  toggleCard: { backgroundColor: WORKER_CARD, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, elevation: 2, borderWidth: 1, borderColor: WORKER_BORDER },
  toggleTitle: { fontSize: 14, fontWeight: '700', color: WORKER_TEXT },
  toggleSub: { fontSize: 11, color: WORKER_MUTED, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: WORKER_TEXT, marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 4 },
  viewAll: { color: PRIMARY, fontSize: 13, fontWeight: '600' },
  overviewRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  overviewCard: { flex: 1, backgroundColor: WORKER_CARD, borderRadius: 12, padding: 14, alignItems: 'center', elevation: 2, borderWidth: 1, borderColor: WORKER_BORDER },
  overviewValue: { fontSize: 20, fontWeight: '800' },
  overviewLabel: { fontSize: 11, color: WORKER_MUTED, marginTop: 2 },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  jobHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  requestCountBadge: { width: 26, height: 26, borderRadius: 13, backgroundColor: RED, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  requestCountText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  viewAllBlue: { color: PRIMARY, fontSize: 14, fontWeight: '700', marginBottom: 12 },
  ownerNotice: { backgroundColor: LIGHT_GREEN, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  ownerNoticeText: { color: GREEN, fontSize: 13, fontWeight: '700' },
  emptyRequestsCard: { backgroundColor: WORKER_CARD, borderRadius: 16, padding: 18, marginBottom: 20, alignItems: 'center', elevation: 2, borderWidth: 1, borderColor: WORKER_BORDER },
  emptyRequestsTitle: { fontSize: 15, fontWeight: '800', color: WORKER_TEXT },
  emptyRequestsSub: { fontSize: 12, color: WORKER_MUTED, marginTop: 4 },
  jobRequestCard: { backgroundColor: WORKER_CARD, borderRadius: 18, padding: 16, marginBottom: 18, elevation: 3, borderWidth: 1, borderColor: WORKER_BORDER },
  jobRequestTop: { flexDirection: 'row', alignItems: 'flex-start' },
  jobIconWrap: { width: 90, height: 90, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  jobIcon: { fontSize: 46 },
  jobDetails: { flex: 1, paddingTop: 4 },
  jobTitle: { fontSize: 19, fontWeight: '800', color: WORKER_TEXT, marginBottom: 8 },
  jobMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  jobMetaIcon: { fontSize: 12, width: 34, fontWeight: '700', color: WORKER_MUTED },
  jobMetaText: { flex: 1, color: WORKER_MUTED, fontSize: 14, fontWeight: '600' },
  jobSide: { alignItems: 'flex-end', justifyContent: 'space-between', minHeight: 88, marginLeft: 8 },
  timerBadge: { backgroundColor: '#FFF3E8', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  timerText: { color: RED, fontSize: 13, fontWeight: '800' },
  jobPrice: { color: GREEN, fontSize: 20, fontWeight: '900' },
  jobActions: { flexDirection: 'row', gap: 12, marginTop: 14 },
  rejectBtn: { flex: 1, borderWidth: 1.5, borderColor: RED, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  rejectBtnText: { color: RED, fontSize: 16, fontWeight: '800' },
  acceptBtn: { flex: 1, backgroundColor: PRIMARY, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  acceptBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  bookingCard: { backgroundColor: WORKER_CARD, borderRadius: 14, padding: 16, elevation: 3, borderWidth: 1, borderColor: WORKER_BORDER },
  bookingTitle: { fontSize: 16, fontWeight: '800', color: WORKER_TEXT },
  inProgressBadge: { backgroundColor: LIGHT_GREEN, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  inProgressText: { color: GREEN, fontSize: 12, fontWeight: '600' },
  bookingInfo: { fontSize: 13, color: WORKER_MUTED, fontWeight: '600' },
  otpInput: { borderWidth: 1, borderColor: WORKER_BORDER, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: WORKER_BG_ALT, marginBottom: 12, color: WORKER_TEXT },
  openBtn: { backgroundColor: PRIMARY, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  openBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
