import React from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { BottomNav } from './HomeScreen';

const GREEN = '#22C55E';
const PRIMARY = '#4F46E5';
const HEADER = '#1E1B4B';
const BG = '#F8F9FC';
const CARD = '#FFFFFF';
const TEXT = '#1E1B4B';
const MUTED = '#6B7280';
const BORDER = '#E5E7EB';
const SOFT = '#EEF2FF';

export default function LiveTrackingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 22, color: '#FFFFFF' }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Tracking</Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 22, color: '#FFFFFF' }}>📤</Text>
        </TouchableOpacity>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        {/* Simulated map background */}
        <View style={styles.mapBg}>
          {/* Grid lines */}
          {[...Array(8)].map((_, i) => (
            <View key={`h${i}`} style={[styles.gridLineH, { top: `${i * 14}%` }]} />
          ))}
          {[...Array(6)].map((_, i) => (
            <View key={`v${i}`} style={[styles.gridLineV, { left: `${i * 20}%` }]} />
          ))}

          {/* Route line simulation */}
          <View style={styles.routeLine} />

          {/* Worker marker (top) */}
          <View style={[styles.marker, { top: '25%', left: '55%' }]}>
            <View style={styles.workerMarker}>
              <Text style={{ fontSize: 18 }}>🧑</Text>
            </View>
          </View>

          {/* Destination marker (bottom) */}
          <View style={[styles.marker, { top: '62%', left: '35%' }]}>
            <View style={styles.destMarker}>
              <Text style={{ fontSize: 18 }}>🏠</Text>
            </View>
          </View>

          {/* Map labels */}
          <Text style={[styles.mapLabel, { top: '18%', left: '40%' }]}>Banjara Hills</Text>
          <Text style={[styles.mapLabel, { top: '45%', left: '55%' }]}>Road No. 12</Text>
          <Text style={[styles.mapLabel, { top: '70%', left: '20%' }]}>Jubilee Hills</Text>
        </View>
      </View>

      {/* Bottom Info Panel */}
      <View style={styles.infoPanel}>
        <View style={styles.arrivingBox}>
          <Text style={styles.arrivingLabel}>Arriving in</Text>
          <Text style={styles.arrivingTime}>8 mins</Text>
          <Text style={styles.arrivingDist}>(2.4 km away)</Text>
        </View>

        {/* Customer Row */}
        <View style={styles.customerRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={styles.avatar}>
              <Text style={{ fontSize: 24 }}>👤</Text>
            </View>
            <Text style={styles.customerName}>Priya Sharma</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={styles.iconBtn}>
              <Text style={{ fontSize: 18 }}>📞</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Text style={{ fontSize: 18 }}>💬</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigate Button */}
        <TouchableOpacity style={styles.navigateBtn}>
          <Text style={styles.navigateBtnText}>🧭  Navigate</Text>
        </TouchableOpacity>
      </View>

      <BottomNav navigation={navigation} active="Bookings" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: HEADER, borderBottomWidth: 1, borderBottomColor: HEADER },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },

  mapContainer: { flex: 1 },
  mapBg: { flex: 1, backgroundColor: SOFT, position: 'relative', overflow: 'hidden' },
  gridLineH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: BORDER },
  gridLineV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: BORDER },
  routeLine: {
    position: 'absolute', top: '28%', left: '38%',
    width: 3, height: '35%', backgroundColor: GREEN,
    borderRadius: 2, transform: [{ rotate: '20deg' }],
  },
  marker: { position: 'absolute' },
  workerMarker: { width: 44, height: 44, borderRadius: 22, backgroundColor: CARD, borderWidth: 3, borderColor: GREEN, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  destMarker: { width: 44, height: 44, borderRadius: 22, backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  mapLabel: { position: 'absolute', fontSize: 11, color: MUTED, fontWeight: '700' },

  infoPanel: { backgroundColor: CARD, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 8, elevation: 8, borderWidth: 1, borderColor: BORDER },
  arrivingBox: { alignItems: 'center', marginBottom: 16 },
  arrivingLabel: { fontSize: 14, color: MUTED },
  arrivingTime: { fontSize: 36, fontWeight: '900', color: GREEN },
  arrivingDist: { fontSize: 13, color: MUTED, marginTop: 2 },
  customerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: SOFT, alignItems: 'center', justifyContent: 'center' },
  customerName: { fontSize: 16, fontWeight: '800', color: TEXT },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: SOFT, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: BORDER },
  navigateBtn: { backgroundColor: PRIMARY, borderRadius: 12, paddingVertical: 15, alignItems: 'center' },
  navigateBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});
