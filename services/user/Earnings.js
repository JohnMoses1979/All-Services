import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { BottomNav } from './HomeScreen';
import providerApi from '../api/providerApi';
import { getWorkerColors, useWorkerPreferences, wt } from './workerPreferences';

const GREEN = '#22C55E';
const LIGHT_GREEN = '#DCFCE7';
const PRIMARY = '#4F46E5';
const HEADER = '#1E1B4B';
const WORKER_BG = '#F8F9FC';
const WORKER_CARD = '#FFFFFF';
const WORKER_TEXT = '#1E1B4B';
const WORKER_MUTED = '#6B7280';
const WORKER_BORDER = '#E5E7EB';
const PAID_STATUSES = ['PAID', 'RATED'];

const formatAmount = (amount) => `Rs ${Number(amount || 0).toLocaleString('en-IN')}`;
const formatBookingTime = (booking) =>
  [booking.bookingDate, booking.timeSlot, booking.paymentMethod ? `Paid by ${booking.paymentMethod}` : null]
    .filter(Boolean)
    .join(' - ');

export default function Earnings({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const preferences = useWorkerPreferences();
  const lang = preferences.language;
  const colors = getWorkerColors(preferences.theme);

  const load = async () => {
    const profile = await providerApi.getProvider();
    if (profile?.id) {
      const response = await providerApi.getProviderBookings(profile.id);
      setBookings(Array.isArray(response?.data) ? response.data : []);
    }
  };

  useEffect(() => {
    load();
    const unsubscribe = navigation?.addListener ? navigation.addListener('focus', load) : null;
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [navigation]);

  const paidBookings = useMemo(
    () => bookings.filter((booking) => PAID_STATUSES.includes(booking.status)),
    [bookings]
  );
  const totalEarnings = paidBookings.reduce((sum, booking) => sum + Number(booking.amount || 0), 0);
  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = today.slice(0, 7);
  const todayEarnings = paidBookings
    .filter((booking) => !booking.bookingDate || String(booking.bookingDate).slice(0, 10) === today)
    .reduce((sum, booking) => sum + Number(booking.amount || 0), 0);
  const monthEarnings = paidBookings
    .filter((booking) => !booking.bookingDate || String(booking.bookingDate).slice(0, 7) === currentMonth)
    .reduce((sum, booking) => sum + Number(booking.amount || 0), 0);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { backgroundColor: HEADER }]}>
        <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>{wt(lang, 'earnings')}</Text>
        <TouchableOpacity onPress={load}><Text style={styles.refreshText}>{wt(lang, 'refresh')}</Text></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.totalCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.totalLabel}>{wt(lang, 'totalEarnings')}</Text>
            <Text style={styles.totalAmount}>{formatAmount(totalEarnings)}</Text>
            <Text style={styles.totalPeriod}>{wt(lang, 'thisMonth')}</Text>
          </View>
          <Text style={styles.totalIcon}>Rs</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{wt(lang, 'earningsSummary')}</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { label: wt(lang, 'today'), value: formatAmount(todayEarnings) },
            { label: wt(lang, 'completedServices'), value: String(paidBookings.length) },
            { label: wt(lang, 'thisMonth'), value: formatAmount(monthEarnings) },
            { label: wt(lang, 'lastMonth'), value: 'Rs 0' },
          ].map((row, i, arr) => (
            <View key={row.label} style={[styles.summaryRow, { borderBottomColor: colors.border }, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={[styles.summaryLabel, { color: colors.muted }]}>{row.label}</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{wt(lang, 'recentTransactions')}</Text>
          <TouchableOpacity onPress={load}><Text style={styles.viewAll}>{wt(lang, 'refresh')}</Text></TouchableOpacity>
        </View>

        {paidBookings.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No paid earnings yet</Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>Completed services will appear here after the owner makes payment.</Text>
          </View>
        ) : (
          paidBookings.map((booking) => (
            <View key={booking.id} style={[styles.txCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.txIcon, { backgroundColor: colors.soft }]}>
                <Text style={styles.txIconText}>Rs</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.txTitle, { color: colors.text }]}>{booking.serviceName || 'Service booking'}</Text>
                <Text style={[styles.txTime, { color: colors.muted }]}>{formatBookingTime(booking) || 'Payment completed'}</Text>
              </View>
              <Text style={styles.txAmount}>+{formatAmount(booking.amount)}</Text>
            </View>
          ))
        )}
      </ScrollView>

      <BottomNav navigation={navigation} active="Earnings" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: WORKER_BG },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: WORKER_TEXT },
  refreshText: { color: PRIMARY, fontSize: 13, fontWeight: '800' },
  scroll: { paddingHorizontal: 16, paddingBottom: 24 },

  totalCard: { backgroundColor: PRIMARY, borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  totalLabel: { color: '#E5E7EB', fontSize: 13 },
  totalAmount: { color: '#FFFFFF', fontSize: 34, fontWeight: '900', marginVertical: 4 },
  totalPeriod: { color: '#E5E7EB', fontSize: 12 },
  totalIcon: { color: '#FFFFFF', fontSize: 34, fontWeight: '900' },

  sectionTitle: { fontSize: 15, fontWeight: '800', color: WORKER_TEXT, marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 4 },
  viewAll: { color: PRIMARY, fontSize: 13, fontWeight: '600' },

  card: { backgroundColor: WORKER_CARD, borderRadius: 14, padding: 4, marginBottom: 20, elevation: 2, borderWidth: 1, borderColor: WORKER_BORDER },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 14, borderBottomWidth: 1, borderBottomColor: WORKER_BORDER },
  summaryLabel: { fontSize: 14, color: WORKER_MUTED, fontWeight: '700' },
  summaryValue: { fontSize: 14, fontWeight: '800', color: WORKER_TEXT },

  txCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: WORKER_CARD, borderRadius: 12, padding: 14, marginBottom: 10, elevation: 2, gap: 12, borderWidth: 1, borderColor: WORKER_BORDER },
  txIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: LIGHT_GREEN, alignItems: 'center', justifyContent: 'center' },
  txIconText: { fontSize: 13, fontWeight: '900', color: GREEN },
  txTitle: { fontSize: 14, fontWeight: '700', color: WORKER_TEXT },
  txTime: { fontSize: 12, color: WORKER_MUTED, marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: '800', color: GREEN },
  emptyCard: { backgroundColor: WORKER_CARD, borderRadius: 14, padding: 18, borderWidth: 1, borderColor: WORKER_BORDER, alignItems: 'center' },
  emptyTitle: { color: WORKER_TEXT, fontSize: 15, fontWeight: '800' },
  emptyText: { color: WORKER_MUTED, fontSize: 12, marginTop: 6, textAlign: 'center', lineHeight: 18 },
});
