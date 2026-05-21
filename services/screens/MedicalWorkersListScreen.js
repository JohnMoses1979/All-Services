import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const NEW_COLOR = '#1A7A7A';
const BG        = '#E8F5F5';
const ACCENT    = '#E8A020';
const GREEN     = '#1A9E9E';
const GREEN_BG  = '#F0FAFA';

// ─── Workers Data per category ────────────────────────────────────────────────
const WORKERS_DATA = {
  HomeNurse: [
    {
      id: 'n1',
      name: 'Priya Sharma',
      initials: 'PS',
      experience: '7 Years Exp.',
      rating: 4.9,
      reviews: 42,
      badge: 'Top Rated',
      badgeColor: ACCENT,
      skills: ['Post-Surgery', 'IV Care', 'Dressing'],
      available: true,
      location: '0.8 km away',
      gender: 'Female',
    },
    {
      id: 'n2',
      name: 'Meera Nair',
      initials: 'MN',
      experience: '4 Years Exp.',
      rating: 4.5,
      reviews: 19,
      badge: 'Verified',
      badgeColor: GREEN,
      skills: ['Elderly Care', 'Medication', 'Physiotherapy'],
      available: true,
      location: '1.2 km away',
      gender: 'Female',
    },
    {
      id: 'n3',
      name: 'Rajesh Kumar',
      initials: 'RK',
      experience: '9 Years Exp.',
      rating: 4.7,
      reviews: 63,
      badge: 'Expert',
      badgeColor: NEW_COLOR,
      skills: ['ICU Care', 'Diabetic Care', 'Wound Dressing'],
      available: false,
      location: '2.0 km away',
      gender: 'Male',
    },
  ],

  Doctor: [
    {
      id: 'd1',
      name: 'Dr. Ananya Reddy',
      initials: 'AR',
      experience: '12 Years Exp.',
      rating: 4.9,
      reviews: 87,
      badge: 'Top Rated',
      badgeColor: ACCENT,
      skills: ['General MD', 'Home Visit', 'Elderly Care'],
      available: true,
      location: '0.5 km away',
      gender: 'Female',
      qualification: 'MBBS, MD',
    },
    {
      id: 'd2',
      name: 'Dr. Suresh Babu',
      initials: 'SB',
      experience: '8 Years Exp.',
      rating: 4.6,
      reviews: 34,
      badge: 'Verified',
      badgeColor: GREEN,
      skills: ['General Physician', 'Diabetes', 'Hypertension'],
      available: true,
      location: '1.0 km away',
      gender: 'Male',
      qualification: 'MBBS',
    },
    {
      id: 'd3',
      name: 'Dr. Kavitha Iyer',
      initials: 'KI',
      experience: '15 Years Exp.',
      rating: 4.8,
      reviews: 112,
      badge: 'Expert',
      badgeColor: NEW_COLOR,
      skills: ['Internal Medicine', 'Geriatrics', 'Palliative Care'],
      available: true,
      location: '1.6 km away',
      gender: 'Female',
      qualification: 'MBBS, MD, DNB',
    },
  ],

  // ─── NEW: Electrician ───────────────────────────────────────────────────────
  Electrician: [
    {
      id: 'el1',
      name: 'Arvind Patel',
      initials: 'AP',
      experience: '8 Years Exp.',
      rating: 4.8,
      reviews: 51,
      badge: 'Top Rated',
      badgeColor: ACCENT,
      skills: ['Wiring', 'Panel Repair', 'Switchboard Fix'],
      available: true,
      location: '0.6 km away',
      gender: 'Male',
    },
    {
      id: 'el2',
      name: 'Suresh Yadav',
      initials: 'SY',
      experience: '4 Years Exp.',
      rating: 4.3,
      reviews: 18,
      badge: 'Verified',
      badgeColor: GREEN,
      skills: ['Fan Installation', 'Light Fitting', 'MCB Repair'],
      available: true,
      location: '1.1 km away',
      gender: 'Male',
    },
    {
      id: 'el3',
      name: 'Ramesh Pillai',
      initials: 'RP',
      experience: '12 Years Exp.',
      rating: 4.9,
      reviews: 94,
      badge: 'Expert',
      badgeColor: NEW_COLOR,
      skills: ['Full Wiring', 'Inverter Setup', 'CCTV Wiring'],
      available: false,
      location: '2.2 km away',
      gender: 'Male',
    },
  ],

  // ─── NEW: Maid ──────────────────────────────────────────────────────────────
  Maid: [
    {
      id: 'm1',
      name: 'Sunita Devi',
      initials: 'SD',
      experience: '6 Years Exp.',
      rating: 4.8,
      reviews: 37,
      badge: 'Top Rated',
      badgeColor: ACCENT,
      skills: ['Sweeping', 'Mopping', 'Utensil Washing'],
      available: true,
      location: '0.4 km away',
      gender: 'Female',
    },
    {
      id: 'm2',
      name: 'Kavitha Bai',
      initials: 'KB',
      experience: '3 Years Exp.',
      rating: 4.4,
      reviews: 14,
      badge: 'Verified',
      badgeColor: GREEN,
      skills: ['Cooking', 'Cleaning', 'Laundry'],
      available: true,
      location: '0.9 km away',
      gender: 'Female',
    },
    {
      id: 'm3',
      name: 'Radha Kumari',
      initials: 'RK',
      experience: '10 Years Exp.',
      rating: 4.9,
      reviews: 78,
      badge: 'Expert',
      badgeColor: NEW_COLOR,
      skills: ['Full Home Care', 'Childcare', 'Kitchen Help'],
      available: true,
      location: '1.5 km away',
      gender: 'Female',
    },
  ],

  // ─── NEW: PoolCleaning ──────────────────────────────────────────────────────
  PoolCleaning: [
    {
      id: 'pc1',
      name: 'Dinesh Nair',
      initials: 'DN',
      experience: '5 Years Exp.',
      rating: 4.7,
      reviews: 29,
      badge: 'Top Rated',
      badgeColor: ACCENT,
      skills: ['Vacuuming', 'Chemical Balance', 'Filter Clean'],
      available: true,
      location: '1.0 km away',
      gender: 'Male',
    },
    {
      id: 'pc2',
      name: 'Anil Sharma',
      initials: 'AS',
      experience: '3 Years Exp.',
      rating: 4.2,
      reviews: 11,
      badge: 'Verified',
      badgeColor: GREEN,
      skills: ['Brushing', 'Skimming', 'Pump Service'],
      available: true,
      location: '1.7 km away',
      gender: 'Male',
    },
    {
      id: 'pc3',
      name: 'Mahesh Rao',
      initials: 'MR',
      experience: '9 Years Exp.',
      rating: 4.9,
      reviews: 66,
      badge: 'Expert',
      badgeColor: NEW_COLOR,
      skills: ['Full Pool Service', 'Water Testing', 'Tile Scrub'],
      available: false,
      location: '2.4 km away',
      gender: 'Male',
    },
  ],
};

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ rating }) {
  const filled = Math.round(rating);
  return (
    <View style={s.starsRow}>
      {[1, 2, 3, 4, 5].map(i => (
        <Text key={i} style={[s.star, i <= filled && s.starFilled]}>★</Text>
      ))}
    </View>
  );
}

// ─── Worker Card ──────────────────────────────────────────────────────────────
function WorkerCard({ worker, onPress, isDoctor }) {
  const ratingValue = Number(worker.rating || 0).toFixed(1);
  return (
    <TouchableOpacity
      style={[s.card, !worker.available && s.cardUnavailable]}
      onPress={() => worker.available && onPress(worker)}
      activeOpacity={worker.available ? 0.82 : 1}
    >
      {/* Top Row */}
      <View style={s.cardTop}>
        <View style={s.avatarWrap}>
          <Text style={s.avatarText}>{worker.initials}</Text>
          {/* Gender dot */}
          <View style={[s.genderDot, worker.gender === 'Female' ? s.genderDotF : s.genderDotM]}>
            <Text style={s.genderDotText}>{worker.gender === 'Female' ? '♀' : '♂'}</Text>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <View style={s.nameRow}>
            <Text style={s.workerName}>{worker.name}</Text>
            {worker.experience ? <Text style={s.inlineExperience}>{worker.experience}</Text> : null}
            <View style={s.ratingBadge}>
              <Text style={s.ratingBadgeText}>Rating {ratingValue}</Text>
            </View>
          </View>

          {/* Qualification for doctors */}
          {isDoctor && worker.qualification && (
            <Text style={s.qualification}>{worker.qualification}</Text>
          )}

          <View style={s.ratingRow}>
            <StarRating rating={worker.rating} />
            <Text style={s.ratingScore}>{worker.rating} · {worker.reviews} reviews</Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={s.divider} />

      {/* Skills */}
      <View style={s.skillsRow}>
        {worker.skills.map(sk => (
          <View key={sk} style={s.skillTag}>
            <Text style={s.skillTagText}>{sk}</Text>
          </View>
        ))}
      </View>

      {/* Bottom Row */}
      <View style={s.cardBottom}>
        <Text style={s.location}>📍 {worker.location}</Text>
        <View style={[s.availDot, !worker.available && s.availDotOff]} />
        <Text style={[s.availText, !worker.available && s.availTextOff]}>
          {worker.available ? 'Available' : 'Busy'}
        </Text>
        {worker.available && (
          <View style={s.viewBtn}>
            <Text style={s.viewBtnText}>View →</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
export default function MedicalWorkersListScreen({ navigation, route }) {
  const category     = route?.params?.category || 'HomeNurse';
  const categoryIcon = route?.params?.icon     || '🩺';
  const workers      = [...(WORKERS_DATA[category]  || [])].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
  const availableCount = workers.filter(w => w.available).length;
  const isDoctor     = category === 'Doctor';

  const DISPLAY_NAMES = {
    HomeNurse:    'Home Nurses',
    Doctor:       'Doctors',
    Electrician:  'Electricians',
    Maid:         'Maids',
    PoolCleaning: 'Pool Cleaners',
  };
  const displayName = DISPLAY_NAMES[category] || `${category}s`;

  const HEADER_LABELS = {
    HomeNurse:    'Nurses',
    Doctor:       'Doctors',
    Electrician:  'Electricians',
    Maid:         'Maids',
    PoolCleaning: 'Pool Cleaners',
  };
  const headerLabel = HEADER_LABELS[category] || category;

  const handleWorkerPress = (worker) => {
    navigation.navigate(category, { workerData: worker });
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={NEW_COLOR} />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation?.goBack?.()} activeOpacity={0.7}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Available {headerLabel}</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Banner */}
      <View style={s.banner}>
        <View style={s.bannerRow}>
          <View style={{ flex: 1 }}>
            <Text style={s.bannerTitle}>{categoryIcon} {displayName} Near You</Text>
            <Text style={s.bannerSub}>
              {availableCount} of {workers.length} available right now
            </Text>
          </View>
          <View style={s.countBadge}>
            <Text style={s.countNum}>{availableCount}</Text>
            <Text style={s.countLabel}>Free</Text>
          </View>
        </View>
        <View style={s.wave} />
      </View>

      {/* Workers List */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.listHint}>Tap a professional to view their profile & book</Text>

        {workers.map(worker => (
          <WorkerCard
            key={worker.id}
            worker={worker}
            onPress={handleWorkerPress}
            isDoctor={isDoctor}
          />
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: NEW_COLOR },

  header: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: NEW_COLOR,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backBtn:     { width: 32, height: 32, justifyContent: 'center' },
  backArrow:   { color: '#fff', fontSize: 22, fontWeight: '300' },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },

  banner: {
    backgroundColor: NEW_COLOR,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 32,
  },
  bannerRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bannerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  bannerSub:   { color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 4 },
  countBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  countNum:   { color: '#fff', fontSize: 24, fontWeight: '800' },
  countLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 11 },
  wave: {
    position: 'absolute', bottom: -1, left: 0, right: 0,
    height: 20,
    backgroundColor: BG,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  scroll:        { flex: 1, backgroundColor: BG },
  scrollContent: { paddingHorizontal: 16, paddingTop: 14 },

  listHint: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 14,
    textAlign: 'center',
  },

  
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#F0FAFA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardUnavailable: { opacity: 0.5, borderColor: '#EEE' },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },

  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: NEW_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F0FAFA',
    position: 'relative',
  },
  avatarText:   { color: '#fff', fontSize: 18, fontWeight: '800' },
  genderDot: {
    position: 'absolute',
    bottom: -2, right: -2,
    width: 20, height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  genderDotF:    { backgroundColor: '#F0FAFA' },
  genderDotM:    { backgroundColor: '#F0FAFA' },
  genderDotText: { fontSize: 9, fontWeight: '800', color: NEW_COLOR },

  nameRow:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' },
  workerName: { color: '#102A2A', fontSize: 15, fontWeight: '800' },
  inlineExperience: { color: '#777', fontSize: 11, fontWeight: '700' },
  ratingBadge: {
    backgroundColor: '#FFF8EC',
    borderColor: ACCENT,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  ratingBadgeText: { color: ACCENT, fontSize: 10, fontWeight: '800' },

  qualification: { color: ACCENT, fontSize: 11, fontWeight: '700', marginBottom: 2 },

  badge: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 10, fontWeight: '700' },

  experience: { color: '#aaa', fontSize: 12, marginBottom: 5 },

  ratingRow:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  starsRow:    { flexDirection: 'row', gap: 1 },
  star:        { fontSize: 12, color: '#DDD' },
  starFilled:  { color: '#E8A020' },
  ratingScore: { color: '#aaa', fontSize: 11 },

  divider: { height: 1, backgroundColor: '#F0FAFA', marginVertical: 10 },

  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  skillTag: {
    backgroundColor: '#F0FAFA',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8F5F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  skillTagText: { color: ACCENT, fontSize: 11, fontWeight: '600' },

  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  location:     { color: '#aaa', fontSize: 12, flex: 1 },
  availDot:     { width: 8, height: 8, borderRadius: 4, backgroundColor: GREEN },
  availDotOff:  { backgroundColor: '#CCC' },
  availText:    { color: GREEN, fontSize: 12, fontWeight: '600' },
  availTextOff: { color: '#aaa' },

  viewBtn: {
    backgroundColor: NEW_COLOR,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginLeft: 4,
  },
  viewBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});

