import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Alert,
} from 'react-native';
import { COLORS } from '../data/serviceData';

const StarRating = ({ rating, color, size = 14 }) => {
  const full = Math.floor(rating);
  const stars = Array(5).fill(0).map((_, i) => i < full ? '★' : '☆');
  return <Text style={{ color, fontSize: size }}>{stars.join('')}</Text>;
};

const JobDetailScreen = ({ navigation, route }) => {
  const { worker, service } = route.params;
  const accentColor = worker.accentColor || service.color || COLORS.primary;
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleApply = () => {
    setApplied(true);
    Alert.alert(
      '✅ Applied Successfully!',
      `Your application for "${worker.title}" has been submitted. ${worker.name} will review and contact you soon.`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={accentColor} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: accentColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerLabel}>Job Details</Text>
        <TouchableOpacity onPress={() => setSaved(!saved)} style={styles.saveBtn}>
          <Text style={styles.saveIcon}>{saved ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      {/* Hero section */}
      <View style={[styles.hero, { backgroundColor: accentColor }]}>
        <Text style={styles.heroTitle}>{worker.title}</Text>
        <Text style={styles.heroSub}>Posted by {worker.name} · {worker.block}</Text>

        <View style={styles.heroBadges}>
          {worker.urgent && (
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>URGENT</Text>
            </View>
          )}
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>{worker.jobType}</Text>
          </View>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>{worker.distance}</Text>
          </View>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>{worker.type}</Text>
          </View>
        </View>
      </View>

      {/* Wave */}
      <View style={[styles.waveBg, { backgroundColor: accentColor }]}>
        <View style={styles.waveWhite} />
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Pay + Timing cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Pay / {worker.payUnit}</Text>
            <Text style={[styles.statValue, { color: accentColor }]}>{worker.pay}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Timing</Text>
            <Text style={styles.statValueDark}>{worker.timing}</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.sectionLabel}>DESCRIPTION</Text>
        <View style={styles.descCard}>
          <Text style={styles.descText}>{worker.description}</Text>
        </View>

        {/* Skills */}
        <Text style={styles.sectionLabel}>SKILLS REQUIRED</Text>
        <View style={styles.skillsRow}>
          {worker.skills.map((skill, idx) => (
            <View
              key={idx}
              style={[styles.skillChip, {
                backgroundColor: accentColor + '15',
                borderColor: accentColor,
              }]}
            >
              <Text style={[styles.skillText, { color: accentColor }]}>{skill}</Text>
            </View>
          ))}
        </View>

        {/* Poster Rating */}
        <Text style={styles.sectionLabel}>POSTED BY</Text>
        <View style={styles.ratingCard}>
          <View style={[styles.ratingAvatar, { backgroundColor: worker.avatar || '#F0FAFA' }]}>
            <Text style={[styles.ratingAvatarText, { color: accentColor }]}>
              {worker.initial}
            </Text>
          </View>
          <View style={styles.ratingInfo}>
            <Text style={styles.ratingName}>{worker.name}</Text>
            <StarRating rating={worker.rating} color={accentColor} />
            <Text style={styles.ratingMeta}>
              {worker.rating} · {worker.hires} hires
            </Text>
          </View>
          <View style={styles.ratingRight}>
            <View style={[styles.verifiedBadge, { backgroundColor: accentColor + '20' }]}>
              <Text style={[styles.verifiedText, { color: accentColor }]}>✓ Verified</Text>
            </View>
          </View>
        </View>

        {/* Location */}
        <Text style={styles.sectionLabel}>LOCATION</Text>
        <View style={styles.locationCard}>
          <View style={[styles.locationIconBox, { backgroundColor: accentColor + '18' }]}>
            <Text style={styles.locationIcon}>📍</Text>
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationBlock}>{worker.block}</Text>
            <Text style={styles.locationDist}>{worker.distance} from your location</Text>
          </View>
          <TouchableOpacity style={[styles.mapBtn, { backgroundColor: accentColor }]}>
            <Text style={styles.mapBtnText}>View Map</Text>
          </TouchableOpacity>
        </View>

        {/* Posted time */}
        <View style={styles.postedRow}>
          <Text style={styles.postedText}>🕐 Posted {worker.timeAgo}</Text>
          {worker.urgent && (
            <View style={[styles.urgentChip, { backgroundColor: '#D94848' }]}>
              <Text style={styles.urgentChipText}>URGENT</Text>
            </View>
          )}
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.applyContainer}>
        <TouchableOpacity
          style={[styles.applyBtn, { backgroundColor: applied ? '#1A9E9E' : accentColor }]}
          onPress={handleApply}
          disabled={applied}
          activeOpacity={0.85}
        >
          <Text style={styles.applyBtnText}>
            {applied ? '✅ Applied!' : 'Apply for this Job'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backIcon: { color: '#E8F5F5', fontSize: 22 },
  headerLabel: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '800', textAlign: 'center' },
  saveBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  saveIcon: { fontSize: 20 },

  hero: { paddingHorizontal: 16, paddingBottom: 28, paddingTop: 4 },
  heroTitle: { color: '#fff', fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
  heroSub: { color: '#E8F5F5', fontSize: 11, textAlign: 'center', marginBottom: 12 },
  heroBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  heroBadgeText: { color: '#fff', fontSize: 9, fontWeight: '600' },

  waveBg: { height: 22, marginTop: -1 },
  waveWhite: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 22, backgroundColor: COLORS.bg,
    borderTopLeftRadius: 22, borderTopRightRadius: 22,
  },

  scroll: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingHorizontal: 16, paddingTop: 6 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1, backgroundColor: COLORS.white,
    borderRadius: 14, borderWidth: 1, borderColor: COLORS.border,
    padding: 14, alignItems: 'center',
  },
  statLabel: { fontSize: 10, color: COLORS.medText, marginBottom: 4, fontWeight: '500' },
  statValue: { fontSize: 22, fontWeight: '800' },
  statValueDark: { fontSize: 15, fontWeight: '800', color: COLORS.darkText },

  sectionLabel: {
    fontSize: 9, fontWeight: '800', letterSpacing: 1.5,
    color: COLORS.medText, textTransform: 'uppercase',
    marginBottom: 8, marginTop: 4,
  },

  descCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14, borderWidth: 1, borderColor: COLORS.border,
    padding: 14, marginBottom: 16,
  },
  descText: { fontSize: 13, color: COLORS.darkText, lineHeight: 20 },

  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  skillChip: {
    borderWidth: 1, borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  skillText: { fontSize: 11, fontWeight: '600' },

  ratingCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14, borderWidth: 1, borderColor: COLORS.border,
    padding: 14, flexDirection: 'row', alignItems: 'center',
    gap: 12, marginBottom: 16,
  },
  ratingAvatar: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  ratingAvatarText: { fontSize: 18, fontWeight: '800' },
  ratingInfo: { flex: 1 },
  ratingName: { fontSize: 14, color: COLORS.darkText, fontWeight: '700', marginBottom: 2 },
  ratingMeta: { fontSize: 10, color: COLORS.lightText, marginTop: 2 },
  ratingRight: { alignItems: 'flex-end' },
  verifiedBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  verifiedText: { fontSize: 10, fontWeight: '700' },

  locationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14, borderWidth: 1, borderColor: COLORS.border,
    padding: 14, flexDirection: 'row', alignItems: 'center',
    gap: 10, marginBottom: 12,
  },
  locationIconBox: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  locationIcon: { fontSize: 20 },
  locationInfo: { flex: 1 },
  locationBlock: { fontSize: 14, color: COLORS.darkText, fontWeight: '700' },
  locationDist: { fontSize: 10, color: COLORS.medText, marginTop: 2 },
  mapBtn: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  mapBtnText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  postedRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 8,
  },
  postedText: { fontSize: 11, color: COLORS.lightText },
  urgentChip: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  urgentChipText: { color: '#fff', fontSize: 9, fontWeight: '800' },

  applyContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.bg,
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  applyBtn: {
    borderRadius: 30, height: 52,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 8,
    elevation: 4,
  },
  applyBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
});

export default JobDetailScreen;

