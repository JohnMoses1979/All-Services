import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';

const COLORS = {
  navyDark:    '#1A7A7A',
  navyMid:     '#1A9E9E',
  cream:       '#E8F5F5',
  cardBg:      '#FFFFFF',
  orange:      '#E8A020',
  orangeLight: '#F0C060',
  textDark:    '#102A2A',
  textMid:     '#5F7474',
  textLight:   '#5F7474',
  tagBorder:   '#CFE8E8',
  tagBg:       '#F0FAFA',
  starGold:    '#E8A020',
  applyBtn:    '#102A2A',
  white:       '#FFFFFF',
};

const StarRating = ({ rating }) => {
  const filled = Math.round(rating);
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={[styles.star, i <= filled && styles.starFilled]}>★</Text>
      ))}
    </View>
  );
};

const Tag = ({ label, dark }) => (
  <View style={[styles.tag, dark && styles.tagDark]}>
    <Text style={[styles.tagText, dark && styles.tagTextDark]}>{label}</Text>
  </View>
);

const SectionLabel = ({ title }) => (
  <Text style={styles.sectionLabel}>{title}</Text>
);

export default function RepairsPage({ navigation, route }) {
  const workerData = route?.params?.workerData;

  const workerName = workerData?.name || 'Mohan R.';
  const workerRating = workerData?.rating || 4.5;
  const workerReviews = workerData?.reviews || 9;
  const workerInitial = workerData?.initials?.[0] || 'M';
  const skills = workerData?.skills || ['Electrical', 'Fan Fitting', 'Switch Board'];
  const jobData = workerData?.jobData || {
    jobTitle: 'Repairs',
    postedBy: 'Mohan R. · Block F',
    icon: '🛠️',
    pay: 900,
    payLabel: '/job',
    timeSlots: [
      { id: '1', time: '9AM – 1PM', label: 'Morning' },
      { id: '2', time: '1PM – 5PM', label: 'Afternoon' },
    ],
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navyDark} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation?.goBack?.()}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Repairs Details</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.heroBanner}>
        <View style={styles.heroTitleRow}>
          <Text style={styles.heroTitle}>Repairs Needed</Text>
          <View style={styles.ratingPill}>
            <Text style={styles.ratingPillText}>Rating {workerRating}</Text>
          </View>
          <Text style={styles.heroEmoji}>🔧</Text>
        </View>
        <Text style={styles.heroSubtitle}>Posted by {workerData?.jobData?.postedBy || 'Mohan R. · Block F'}</Text>

        <View style={styles.heroTagsRow}>
          <Tag label="ONE-TIME" dark />
          <Tag label="Electrical+Fan" dark />
          <Tag label={workerData?.location || '0.6 km'} dark />
        </View>

        <View style={styles.waveCutout} />
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoCardLabel}>Pay / Job</Text>
            <Text style={styles.infoCardValue}>₹{jobData.pay}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoCardLabel}>Duration</Text>
            <Text style={styles.infoCardValue}>Half Day</Text>
          </View>
        </View>

        <SectionLabel title="DESCRIPTION" />
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>
            Ceiling fan install + 2 switchboard repairs. Bring own tools. Wiring experience required. Materials provided by owner.
          </Text>
        </View>

        <SectionLabel title="SKILLS REQUIRED" />
        <View style={styles.skillsRow}>
          {skills.map(sk => <Tag key={sk} label={sk} />)}
        </View>

        <SectionLabel title="TENANT RATING" />
        <View style={styles.ratingCard}>
          <View style={styles.ratingAvatar}>
            <Text style={styles.ratingAvatarText}>{workerInitial}</Text>
          </View>
          <View style={styles.ratingInfo}>
            <Text style={styles.ratingName}>{workerName}</Text>
            <View style={styles.ratingStarsRow}>
              <StarRating rating={workerRating} />
              <Text style={styles.ratingScore}>{workerRating} · {workerReviews} hires</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.applyContainer}>
        <TouchableOpacity
          style={styles.applyBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Booking', { jobData })}
        >
          <Text style={styles.applyBtnText}>Apply for this Job</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.navyDark },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.navyDark,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 8 : 8,
    paddingBottom: 4,
  },
  backBtn: { width: 32, height: 32, justifyContent: 'center' },
  backArrow: { color: COLORS.white, fontSize: 22, fontWeight: '300' },
  headerTitle: { color: COLORS.white, fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },

  heroBanner: {
    backgroundColor: COLORS.navyDark,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 32,
  },
  heroTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  heroTitle: { color: COLORS.white, fontSize: 22, fontWeight: '800', flex: 1, lineHeight: 28 },
  ratingPill: { backgroundColor: COLORS.white, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  ratingPillText: { color: COLORS.navyDark, fontSize: 11, fontWeight: '800' },
  heroEmoji: { display: 'none' },
  heroSubtitle: { color: '#E8A020', fontSize: 13, marginTop: 4, marginBottom: 14 },
  heroTagsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  waveCutout: {
    position: 'absolute', bottom: -1, left: 0, right: 0,
    height: 20, backgroundColor: COLORS.cream,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
  },

  tag: {
    borderWidth: 1, borderColor: COLORS.tagBorder,
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5,
    backgroundColor: COLORS.cream,
  },
  tagDark: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.25)',
  },
  tagText: { color: COLORS.textMid, fontSize: 12, fontWeight: '500' },
  tagTextDark: { color: COLORS.white, fontSize: 12, fontWeight: '500' },

  scrollArea: { flex: 1, backgroundColor: COLORS.cream },
  scrollContent: { paddingHorizontal: 16, paddingTop: 18 },

  infoRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  infoCard: {
    flex: 1, backgroundColor: COLORS.cardBg,
    borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.orangeLight,
    padding: 14, alignItems: 'flex-start',
    shadowColor: '#E8A020', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 2,
  },
  infoCardLabel: {
    color: COLORS.textLight, fontSize: 11, fontWeight: '500',
    marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  infoCardValue: { color: COLORS.textDark, fontSize: 22, fontWeight: '800' },

  sectionLabel: {
    color: COLORS.orange, fontSize: 11, fontWeight: '800',
    letterSpacing: 1.2, marginBottom: 8, marginTop: 2,
  },

  descriptionCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.orangeLight,
    padding: 14, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  descriptionText: { color: COLORS.textDark, fontSize: 14, lineHeight: 22 },

  skillsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 20 },

  ratingCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.orangeLight,
    padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12,
    marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  ratingAvatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.tagBg,
    borderWidth: 1.5, borderColor: COLORS.tagBorder,
    justifyContent: 'center', alignItems: 'center',
  },
  ratingAvatarText: { color: COLORS.textMid, fontSize: 18, fontWeight: '700' },
  ratingInfo: { flex: 1 },
  ratingName: { color: COLORS.textDark, fontSize: 15, fontWeight: '700', marginBottom: 3 },
  ratingStarsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  starsRow: { flexDirection: 'row', gap: 1 },
  star: { fontSize: 14, color: '#DDD' },
  starFilled: { color: COLORS.starGold },
  ratingScore: { color: COLORS.textLight, fontSize: 12, fontWeight: '500' },

  applyContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.cream,
    paddingHorizontal: 16, paddingBottom: 28, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)',
  },
  applyBtn: {
    backgroundColor: COLORS.applyBtn, borderRadius: 30,
    paddingVertical: 16, alignItems: 'center',
    shadowColor: COLORS.navyDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  applyBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
});

