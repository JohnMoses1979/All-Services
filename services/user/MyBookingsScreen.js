import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { BottomNav } from './HomeScreen';
import providerApi from '../api/providerApi';
import { getWorkerColors, useWorkerPreferences, wt } from './workerPreferences';

const GREEN = '#22C55E';
const LIGHT_GREEN = '#DCFCE7';
const PRIMARY = '#4F46E5';
const HEADER = '#1E1B4B';
const ORANGE = '#FB923C';
const RED = '#FB923C';
const WORKER_BG = '#F8F9FC';
const WORKER_CARD = '#FFFFFF';
const WORKER_TEXT = '#1E1B4B';
const WORKER_MUTED = '#6B7280';
const WORKER_BORDER = '#E5E7EB';

const TABS = ['All', 'Upcoming', 'In Progress', 'Completed', 'Cancelled'];

const getSectionForStatus = (status) => {
  if (status === 'REJECTED') return 'Cancelled';
  if (status === 'STARTED') return 'In Progress';
  if (['COMPLETED', 'PAID', 'RATED'].includes(status)) return 'Completed';
  return 'Upcoming';
};

const getStatusStyle = (status) => {
  if (status === 'REJECTED') return { color: RED, bg: '#FFF3E8', label: 'Cancelled' };
  if (status === 'STARTED') return { color: GREEN, bg: LIGHT_GREEN, label: 'In Progress' };
  if (['COMPLETED', 'PAID', 'RATED'].includes(status)) {
    return { color: GREEN, bg: LIGHT_GREEN, label: status === 'RATED' ? 'Rated' : 'Completed' };
  }
  if (status === 'ACCEPTED') return { color: GREEN, bg: LIGHT_GREEN, label: 'Accepted' };
  return { color: ORANGE, bg: '#FFF3E8', label: 'Upcoming' };
};

export default function MyBookingsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('All');
  const [provider, setProvider] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const preferences = useWorkerPreferences();
  const lang = preferences.language;
  const colors = getWorkerColors(preferences.theme);
  const tabLabel = (tab) => {
    if (tab === 'All') return wt(lang, 'all');
    if (tab === 'Upcoming') return wt(lang, 'upcoming');
    if (tab === 'In Progress') return wt(lang, 'inProgress');
    if (tab === 'Completed') return wt(lang, 'completed');
    if (tab === 'Cancelled') return wt(lang, 'cancelled');
    return tab;
  };

  const loadBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const profile = await providerApi.getProvider();
      setProvider(profile);

      if (profile?.id) {
        const response = await providerApi.getProviderBookings(profile.id);
        setBookings(Array.isArray(response?.data) ? response.data : []);
      } else {
        setBookings([]);
      }
    } catch (err) {
      setError(err?.message || 'Could not load bookings.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const grouped = useMemo(() => {
    const sections = {
      Upcoming: [],
      'In Progress': [],
      Completed: [],
      Cancelled: [],
    };

    bookings.forEach((booking) => {
      const section = getSectionForStatus(booking.status);
      sections[section].push(booking);
    });

    return sections;
  }, [bookings]);

  const filteredGroups = useMemo(() => {
    if (activeTab === 'All') {
      return ['Upcoming', 'In Progress', 'Completed', 'Cancelled']
        .map((section) => ({ section, data: grouped[section] || [] }))
        .filter((group) => group.data.length > 0);
    }

    return [{ section: activeTab, data: grouped[activeTab] || [] }];
  }, [activeTab, grouped]);

  const totalVisible = filteredGroups.reduce((sum, group) => sum + group.data.length, 0);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { backgroundColor: HEADER }]}>
        <View>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>{wt(lang, 'myBookings')}</Text>
          <Text style={[styles.headerSub, { color: '#E5E7EB' }]}>{provider?.fullName || 'Worker'} {wt(lang, 'bookings')}</Text>
        </View>
        <TouchableOpacity onPress={loadBookings}>
          <Text style={styles.refreshText}>{wt(lang, 'refresh')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.tabBar, { backgroundColor: colors.bg, borderBottomColor: colors.border }]}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {TABS.map((tab) => (
          <TouchableOpacity key={tab} style={styles.tabItem} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, { color: colors.muted }, activeTab === tab && styles.tabTextActive]}>{tabLabel(tab)}</Text>
            {activeTab === tab && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={[styles.stateCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ActivityIndicator color={GREEN} />
            <Text style={[styles.stateText, { color: colors.muted }]}>{wt(lang, 'loadingBookings')}</Text>
          </View>
        ) : error ? (
          <View style={[styles.stateCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.stateTitle, { color: colors.text }]}>{wt(lang, 'serverIssue')}</Text>
            <Text style={[styles.stateText, { color: colors.muted }]}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={loadBookings}>
              <Text style={styles.retryText}>{wt(lang, 'retry')}</Text>
            </TouchableOpacity>
          </View>
        ) : totalVisible === 0 ? (
          <View style={[styles.stateCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.stateTitle, { color: colors.text }]}>No {tabLabel(activeTab).toLowerCase()} {wt(lang, 'bookings')}</Text>
            <Text style={[styles.stateText, { color: colors.muted }]}>{wt(lang, 'acceptedJobsAppear')}</Text>
          </View>
        ) : (
          filteredGroups.map((group) => (
            <View key={group.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{tabLabel(group.section)}</Text>
              {group.data.map((item) => {
                const statusStyle = getStatusStyle(item.status);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('ProviderHome')}
                  >
                    <View style={styles.cardRow}>
                      <Text style={[styles.cardTitle, { color: colors.text }]}>{item.serviceName}</Text>
                      <Text style={[styles.cardTime, { color: colors.muted }]}>{item.timeSlot}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Text style={[styles.infoLabel, { color: colors.text }]}>{wt(lang, 'owner')}</Text>
                      <Text style={[styles.infoText, { color: colors.muted }]}>{item.customerName || wt(lang, 'customer')}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Text style={[styles.infoLabel, { color: colors.text }]}>{wt(lang, 'place')}</Text>
                      <Text style={[styles.infoText, { color: colors.muted }]}>{item.address || wt(lang, 'addressNotAdded')}</Text>
                    </View>

                    {item.status === 'ACCEPTED' && item.startOtp ? (
                      <View style={styles.otpHint}>
                        <Text style={styles.otpHintText}>Ask owner for OTP: {item.startOtp}</Text>
                      </View>
                    ) : null}

                    <View style={[styles.cardRow, { marginTop: 10, alignItems: 'center' }]}>
                      <Text style={styles.price}>Rs {item.amount}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.statusText, { color: statusStyle.color }]}>{tabLabel(statusStyle.label)}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))
        )}
      </ScrollView>

      <BottomNav navigation={navigation} active="Bookings" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: WORKER_BG },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: WORKER_TEXT },
  headerSub: { fontSize: 12, color: WORKER_MUTED, marginTop: 3, fontWeight: '600' },
  refreshText: { color: PRIMARY, fontSize: 13, fontWeight: '800' },
  tabBar: { borderBottomWidth: 1, borderBottomColor: WORKER_BORDER, backgroundColor: WORKER_BG },
  tabItem: { marginRight: 20, paddingVertical: 12, alignItems: 'center' },
  tabText: { fontSize: 14, color: WORKER_MUTED, fontWeight: '700' },
  tabTextActive: { color: PRIMARY, fontWeight: '700' },
  tabUnderline: { height: 2, backgroundColor: PRIMARY, borderRadius: 2, width: '100%', marginTop: 4 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 95 },
  stateCard: { backgroundColor: WORKER_CARD, borderRadius: 14, padding: 18, marginTop: 18, alignItems: 'center', elevation: 2, borderWidth: 1, borderColor: WORKER_BORDER },
  stateTitle: { color: WORKER_TEXT, fontSize: 16, fontWeight: '800', marginBottom: 6 },
  stateText: { color: WORKER_MUTED, fontSize: 13, textAlign: 'center', marginTop: 8 },
  retryBtn: { backgroundColor: PRIMARY, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 9, marginTop: 12 },
  retryText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: WORKER_TEXT, marginTop: 20, marginBottom: 10 },
  card: { backgroundColor: WORKER_CARD, borderRadius: 14, padding: 16, marginBottom: 12, elevation: 2, borderWidth: 1, borderColor: WORKER_BORDER },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  cardTitle: { flex: 1, fontSize: 16, fontWeight: '800', color: WORKER_TEXT },
  cardTime: { fontSize: 12, color: WORKER_MUTED, fontWeight: '700' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 7 },
  infoLabel: { fontSize: 12, width: 42, color: WORKER_TEXT, fontWeight: '800' },
  infoText: { flex: 1, fontSize: 13, color: WORKER_MUTED, fontWeight: '600' },
  price: { fontSize: 16, fontWeight: '900', color: GREEN },
  statusBadge: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  statusText: { fontSize: 12, fontWeight: '700' },
  otpHint: { backgroundColor: '#FFF8EC', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, marginTop: 10 },
  otpHintText: { color: ORANGE, fontSize: 12, fontWeight: '800' },
});
