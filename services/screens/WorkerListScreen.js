import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, SafeAreaView, StatusBar, Platform,
} from 'react-native';
import { COLORS, WORKERS_DATA } from '../data/serviceData';

const StarRating = ({ rating, color }) => {
  const full = Math.floor(rating);
  const stars = Array(5).fill(0).map((_, i) => i < full ? '★' : '☆');
  return (
    <Text style={{ color, fontSize: 12 }}>{stars.join('')}</Text>
  );
};

const WorkersListScreen = ({ navigation, route }) => {
  const { service } = route.params;
  const workers = [...(WORKERS_DATA[service.id] || [])].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
  const accentColor = service.color || COLORS.primary;

  const [selectedFilter, setSelectedFilter] = useState('All');
  const filters = ['All', 'Nearby', 'Urgent', 'Daily'];

  const filteredWorkers = selectedFilter === 'All'
    ? workers
    : selectedFilter === 'Urgent'
    ? workers.filter(w => w.urgent)
    : selectedFilter === 'Daily'
    ? workers.filter(w => w.type === 'DAILY')
    : [...workers].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

  const renderWorker = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('JobDetail', { worker: item, service })}
    >
      {/* Top stripe */}
      {item.urgent && (
        <View style={[styles.urgentBanner, { backgroundColor: accentColor }]}>
          <Text style={styles.urgentText}>🔴 URGENT · Apply Now</Text>
        </View>
      )}

      <View style={styles.cardBody}>
        {/* Left: Avatar + Info */}
        <View style={styles.cardLeft}>
          <View style={[styles.avatar, { backgroundColor: item.avatar || '#F0FAFA' }]}>
            <Text style={[styles.avatarText, { color: accentColor }]}>
              {item.initial}
            </Text>
          </View>
        </View>

        {/* Center: Details */}
        <View style={styles.cardCenter}>
          <View style={styles.nameRow}>
            <Text style={styles.workerName}>{item.name}</Text>
            {(item.experience || item.experienceYears) ? (
              <Text style={styles.inlineExperience}>
                {item.experience || `${item.experienceYears} Years Exp.`}
              </Text>
            ) : null}
          </View>
          <StarRating rating={item.rating} color={accentColor} />
          <Text style={styles.hireCount}>{item.rating} · {item.hires} hires</Text>
          <Text style={styles.jobTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.jobMeta}>{item.block} · {item.distance}</Text>
        </View>

        {/* Right: Pay + Arrow */}
        <View style={styles.cardRight}>
          <View style={[styles.payBadge, { backgroundColor: accentColor + '18' }]}>
            <Text style={[styles.payAmount, { color: accentColor }]}>{item.pay}</Text>
            <Text style={[styles.payUnit, { color: accentColor }]}>/{item.payUnit}</Text>
          </View>
          <View style={[styles.typeBadge]}>
            <Text style={styles.typeBadgeText}>{item.type}</Text>
          </View>
          <TouchableOpacity
            style={[styles.arrowBtn, { backgroundColor: accentColor }]}
            onPress={() => navigation.navigate('JobDetail', { worker: item, service })}
          >
            <Text style={styles.arrowText}>→</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Skills row */}
      <View style={styles.skillsRow}>
        {item.skills.map((skill, idx) => (
          <View key={idx} style={[styles.skillChip, { borderColor: accentColor, backgroundColor: accentColor + '12' }]}>
            <Text style={[styles.skillText, { color: accentColor }]}>{skill}</Text>
          </View>
        ))}
        <Text style={styles.timeAgo}>{item.timeAgo}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={accentColor} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: accentColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerEmoji}>{service.emoji}</Text>
          <Text style={styles.headerTitle}>{service.name} Jobs</Text>
          <Text style={styles.headerSub}>
            {workers.length} job{workers.length !== 1 ? 's' : ''} near you
          </Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* Wave curve */}
      <View style={[styles.waveBg, { backgroundColor: accentColor }]}>
        <View style={styles.waveWhite} />
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterChip,
              selectedFilter === f && [styles.filterChipActive, { backgroundColor: accentColor }],
            ]}
            onPress={() => setSelectedFilter(f)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === f && styles.filterTextActive,
            ]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredWorkers.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>{service.emoji}</Text>
          <Text style={styles.emptyTitle}>No jobs found</Text>
          <Text style={styles.emptySub}>Check back soon for new listings</Text>
        </View>
      ) : (
        <FlatList
          data={filteredWorkers}
          keyExtractor={(item) => item.id}
          renderItem={renderWorker}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 10,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backIcon: { color: '#E8F5F5', fontSize: 22 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerEmoji: { fontSize: 32, marginBottom: 4 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  headerSub: { color: '#E8F5F5', fontSize: 11, marginTop: 3 },

  waveBg: { height: 20, marginTop: -1 },
  waveWhite: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 20, backgroundColor: COLORS.bg,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
  },

  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 12,
    backgroundColor: COLORS.bg,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: { borderColor: 'transparent' },
  filterText: { fontSize: 11, color: COLORS.medText, fontWeight: '600' },
  filterTextActive: { color: '#fff' },

  listContent: { paddingHorizontal: 16, paddingBottom: 24 },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
    overflow: 'hidden',
  },
  urgentBanner: {
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  urgentText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  cardBody: {
    flexDirection: 'row',
    padding: 14,
    gap: 12,
    alignItems: 'center',
  },
  cardLeft: { alignItems: 'center' },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '800' },

  cardCenter: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 2 },
  workerName: { fontSize: 14, color: COLORS.darkText, fontWeight: '700' },
  inlineExperience: { fontSize: 10, color: COLORS.lightText, fontWeight: '700' },
  hireCount: { fontSize: 9, color: COLORS.lightText, marginTop: 1, marginBottom: 4 },
  jobTitle: { fontSize: 12, color: COLORS.darkText, fontWeight: '600', marginBottom: 2 },
  jobMeta: { fontSize: 10, color: COLORS.medText },

  cardRight: { alignItems: 'center', gap: 6 },
  payBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
  },
  payAmount: { fontSize: 14, fontWeight: '800' },
  payUnit: { fontSize: 8, fontWeight: '600' },
  typeBadge: {
    backgroundColor: COLORS.bg,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  typeBadgeText: { fontSize: 8, color: COLORS.medText, fontWeight: '700' },
  arrowBtn: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
  },
  arrowText: { color: '#fff', fontSize: 13, fontWeight: '800' },

  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    paddingBottom: 12,
    gap: 6,
    alignItems: 'center',
  },
  skillChip: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  skillText: { fontSize: 9, fontWeight: '600' },
  timeAgo: { fontSize: 9, color: COLORS.lightText, marginLeft: 'auto' },

  emptyState: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, color: COLORS.darkText, fontWeight: '700', marginBottom: 6 },
  emptySub: { fontSize: 13, color: COLORS.medText },
});

export default WorkersListScreen;
 

