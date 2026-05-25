import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { BottomNav } from './HomeScreen';
import { getWorkerColors, useWorkerPreferences, wt } from './workerPreferences';

const GREEN = '#22C55E';
const PRIMARY = '#4F46E5';
const HEADER = '#1E1B4B';
const BG = '#F8F9FC';
const CARD = '#FFFFFF';
const TEXT = '#1E1B4B';
const MUTED = '#6B7280';
const BORDER = '#E5E7EB';

const NOTIFICATIONS = [
  { id: 1, icon: 'Job', title: 'New booking request', desc: 'Deep Cleaning at Banjara Hills', time: '2m ago', unread: true, bg: '#EFFFF8' },
  { id: 2, icon: 'OK', title: 'Booking confirmed', desc: 'Your booking has been confirmed', time: '10m ago', unread: true, bg: '#EFFFF8' },
  { id: 3, icon: 'Rs', title: 'Payment received', desc: 'You earned Rs 699', time: '30m ago', unread: true, bg: '#FFF3E8' },
  { id: 4, icon: '5*', title: 'Customer review', desc: 'Priya Sharma rated you 5 stars', time: '1h ago', unread: false, bg: '#FFF3E8' },
  { id: 5, icon: 'Msg', title: 'New message', desc: 'You have a new message', time: '2h ago', unread: false, bg: '#EEF2FF' },
  { id: 6, icon: 'Sum', title: 'Weekly summary', desc: 'Your weekly earnings report', time: '1d ago', unread: false, bg: '#EEF2FF' },
];

export default function NotificationsScreen({ navigation }) {
  const preferences = useWorkerPreferences();
  const lang = preferences.language;
  const colors = getWorkerColors(preferences.theme);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { backgroundColor: HEADER, borderBottomColor: HEADER }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backText, { color: '#FFFFFF' }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>{wt(lang, 'notifications')}</Text>
        <TouchableOpacity>
          <Text style={styles.markAll}>{wt(lang, 'markAllRead')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {NOTIFICATIONS.map((notif) => (
          <TouchableOpacity key={notif.id} style={[styles.notifCard, { backgroundColor: colors.card, borderColor: colors.border }, notif.unread && styles.notifUnread]}>
            <View style={[styles.notifIcon, { backgroundColor: colors.soft }]}>
              <Text style={[styles.notifIconText, { color: colors.text }]}>{notif.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.notifTitle, { color: colors.text }]}>{notif.title}</Text>
              <Text style={[styles.notifDesc, { color: colors.muted }]}>{notif.desc}</Text>
              <Text style={[styles.notifTime, { color: colors.muted }]}>{notif.time}</Text>
            </View>
            {notif.unread && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomNav navigation={navigation} active="Home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: HEADER, borderBottomWidth: 1, borderBottomColor: HEADER },
  backText: { fontSize: 22, color: TEXT, fontWeight: '800' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: TEXT },
  markAll: { color: PRIMARY, fontSize: 12, fontWeight: '800' },
  scroll: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 },
  notifCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: CARD, borderRadius: 14, padding: 14, marginBottom: 10, elevation: 2, gap: 12, borderWidth: 1, borderColor: BORDER },
  notifUnread: { borderColor: GREEN },
  notifIcon: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  notifIconText: { fontSize: 11, fontWeight: '900', color: TEXT },
  notifTitle: { fontSize: 14, fontWeight: '800', color: TEXT, marginBottom: 2 },
  notifDesc: { fontSize: 12, color: MUTED, marginBottom: 4, fontWeight: '600' },
  notifTime: { fontSize: 11, color: MUTED },
  unreadDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: GREEN },
});
