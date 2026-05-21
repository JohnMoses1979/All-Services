

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

// ─── Color Tokens ─────────────────────────────────────────────────────────────
const C = {
  navy:        '#1A7A7A',
  navyLight:   '#1A9E9E',
  cream:       '#E8F5F5',
  white:       '#FFFFFF',
  orange:      '#E8A020',
  orangeLight: '#F0C060',
  textDark:    '#102A2A',
  textMid:     '#5F7474',
  textLight:   '#5F7474',
  border:      '#CFE8E8',
  tagBg:       '#F0FAFA',
  tagBorder:   '#CFE8E8',
  starGold:    '#E8A020',
  green:       '#1A9E9E',
  greenLight:  '#F0FAFA',
};

// ─── Workers Data per category ────────────────────────────────────────────────
const WORKERS_DATA = {
  SecurityGuard: [
    {
      id: 'sg1',
      name: 'Ramesh Kumar',
      initials: 'RK',
      experience: '6 Years Exp.',
      rating: 4.8,
      reviews: 24,
      badge: 'Top Rated',
      badgeColor: C.orange,
      skills: ['Night Patrol', 'CCTV', 'Access Control'],
      available: true,
      location: '1.2 km away',
      jobData: {
        jobTitle: 'Security Guard',
        postedBy: 'Ramesh Kumar · Colony Mgmt',
        icon: '🛡️',
        pay: 750,
        payLabel: '/shift',
        timeSlots: [
          { id: '1', time: '6AM – 2PM',  label: 'Morning Shift' },
          { id: '2', time: '2PM – 10PM', label: 'Afternoon Shift' },
          { id: '3', time: '10PM – 6AM', label: 'Night Shift' },
        ],
      },
    },
    {
      id: 'sg2',
      name: 'Suresh Pillai',
      initials: 'SP',
      experience: '3 Years Exp.',
      rating: 4.3,
      reviews: 11,
      badge: 'Verified',
      badgeColor: C.green,
      skills: ['Gate Duty', 'Visitor Log', 'Patrol'],
      available: true,
      location: '0.8 km away',
      jobData: {
        jobTitle: 'Security Guard',
        postedBy: 'Suresh Pillai · Gate 2',
        icon: '🛡️',
        pay: 700,
        payLabel: '/shift',
        timeSlots: [
          { id: '1', time: '6AM – 2PM',  label: 'Morning Shift' },
          { id: '2', time: '2PM – 10PM', label: 'Afternoon Shift' },
          { id: '3', time: '10PM – 6AM', label: 'Night Shift' },
        ],
      },
    },
    {
      id: 'sg3',
      name: 'Vijay Nair',
      initials: 'VN',
      experience: '8 Years Exp.',
      rating: 4.6,
      reviews: 38,
      badge: 'Expert',
      badgeColor: C.navy,
      skills: ['Armed Guard', 'Emergency Response', 'CCTV'],
      available: false,
      location: '2.1 km away',
      jobData: {
        jobTitle: 'Security Guard',
        postedBy: 'Vijay Nair · Block A',
        icon: '🛡️',
        pay: 850,
        payLabel: '/shift',
        timeSlots: [
          { id: '1', time: '6AM – 2PM',  label: 'Morning Shift' },
          { id: '2', time: '2PM – 10PM', label: 'Afternoon Shift' },
          { id: '3', time: '10PM – 6AM', label: 'Night Shift' },
        ],
      },
    },
  ],

  Plumber: [
    {
      id: 'pl1',
      name: 'Anand Sharma',
      initials: 'AS',
      experience: '5 Years Exp.',
      rating: 4.7,
      reviews: 31,
      badge: 'Top Rated',
      badgeColor: C.orange,
      skills: ['Leak Repair', 'Pipe Fitting', 'Drain Fixing'],
      available: true,
      location: '0.5 km away',
      jobData: {
        jobTitle: 'Plumber',
        postedBy: 'Anand Sharma · Block H',
        icon: '🔧',
        pay: 600,
        payLabel: '/job',
        timeSlots: [
          { id: '1', time: '7AM – 10AM', label: 'Early Morning' },
          { id: '2', time: '10AM – 1PM', label: 'Morning' },
          { id: '3', time: '2PM – 5PM',  label: 'Afternoon' },
          { id: '4', time: '5PM – 8PM',  label: 'Evening' },
        ],
      },
    },
    {
      id: 'pl2',
      name: 'Deepak Rao',
      initials: 'DR',
      experience: '2 Years Exp.',
      rating: 4.1,
      reviews: 8,
      badge: 'Verified',
      badgeColor: C.green,
      skills: ['Drain Cleaning', 'Tap Repair', 'Pipe Fitting'],
      available: true,
      location: '1.0 km away',
      jobData: {
        jobTitle: 'Plumber',
        postedBy: 'Deepak Rao · Sector 4',
        icon: '🔧',
        pay: 500,
        payLabel: '/job',
        timeSlots: [
          { id: '1', time: '7AM – 10AM', label: 'Early Morning' },
          { id: '2', time: '10AM – 1PM', label: 'Morning' },
          { id: '3', time: '2PM – 5PM',  label: 'Afternoon' },
          { id: '4', time: '5PM – 8PM',  label: 'Evening' },
        ],
      },
    },
    {
      id: 'pl3',
      name: 'Mohan Das',
      initials: 'MD',
      experience: '10 Years Exp.',
      rating: 4.9,
      reviews: 56,
      badge: 'Expert',
      badgeColor: C.navy,
      skills: ['Full Plumbing', 'Installation', 'Emergency Repair'],
      available: true,
      location: '1.8 km away',
      jobData: {
        jobTitle: 'Plumber',
        postedBy: 'Mohan Das · Block C',
        icon: '🔧',
        pay: 800,
        payLabel: '/job',
        timeSlots: [
          { id: '1', time: '7AM – 10AM', label: 'Early Morning' },
          { id: '2', time: '10AM – 1PM', label: 'Morning' },
          { id: '3', time: '2PM – 5PM',  label: 'Afternoon' },
          { id: '4', time: '5PM – 8PM',  label: 'Evening' },
        ],
      },
    },
  ],

  Driver: [
    {
      id: 'dr1',
      name: 'Rajesh Patel',
      initials: 'RP',
      experience: '7 Years Exp.',
      rating: 4.9,
      reviews: 42,
      badge: 'Top Rated',
      badgeColor: C.orange,
      skills: ['Cab Driver', 'Delivery', 'Long Distance'],
      available: true,
      location: '0.9 km away',
      jobData: {
        jobTitle: 'Driver',
        postedBy: 'Rajesh Patel · Fleet Services',
        icon: '🚗',
        pay: 450,
        payLabel: '/hour',
        timeSlots: [
          { id: '1', time: '6AM – 12PM', label: 'Morning' },
          { id: '2', time: '12PM – 6PM', label: 'Afternoon' },
          { id: '3', time: '6PM – 12AM', label: 'Evening' },
          { id: '4', time: '12AM – 6AM', label: 'Night' },
        ],
      },
    },
    {
      id: 'dr2',
      name: 'Vikram Singh',
      initials: 'VS',
      experience: '4 Years Exp.',
      rating: 4.5,
      reviews: 19,
      badge: 'Verified',
      badgeColor: C.green,
      skills: ['Two Wheeler', 'Local Trips', 'Airport Runs'],
      available: true,
      location: '1.5 km away',
      jobData: {
        jobTitle: 'Driver',
        postedBy: 'Vikram Singh · Auto Union',
        icon: '🚗',
        pay: 400,
        payLabel: '/hour',
        timeSlots: [
          { id: '1', time: '6AM – 12PM', label: 'Morning' },
          { id: '2', time: '12PM – 6PM', label: 'Afternoon' },
          { id: '3', time: '6PM – 12AM', label: 'Evening' },
          { id: '4', time: '12AM – 6AM', label: 'Night' },
        ],
      },
    },
    {
      id: 'dr3',
      name: 'Arun Kumar',
      initials: 'AK',
      experience: '9 Years Exp.',
      rating: 4.7,
      reviews: 67,
      badge: 'Expert',
      badgeColor: C.navy,
      skills: ['Heavy Vehicle', 'Corporate', 'VIP Transport'],
      available: false,
      location: '2.3 km away',
      jobData: {
        jobTitle: 'Driver',
        postedBy: 'Arun Kumar · Premium Fleet',
        icon: '🚗',
        pay: 600,
        payLabel: '/hour',
        timeSlots: [
          { id: '1', time: '6AM – 12PM', label: 'Morning' },
          { id: '2', time: '12PM – 6PM', label: 'Afternoon' },
          { id: '3', time: '6PM – 12AM', label: 'Evening' },
          { id: '4', time: '12AM – 6AM', label: 'Night' },
        ],
      },
    },
  ],

  Repairs: [
    {
      id: 'rp1',
      name: 'Kiran Reddy',
      initials: 'KR',
      experience: '6 Years Exp.',
      rating: 4.8,
      reviews: 35,
      badge: 'Top Rated',
      badgeColor: C.orange,
      skills: ['AC Repair', 'Fridge', 'Washing Machine'],
      available: true,
      location: '0.7 km away',
      jobData: {
        jobTitle: 'Repairs',
        postedBy: 'Kiran Reddy · Home Services',
        icon: '🛠️',
        pay: 650,
        payLabel: '/job',
        timeSlots: [
          { id: '1', time: '8AM – 11AM', label: 'Morning' },
          { id: '2', time: '11AM – 2PM', label: 'Midday' },
          { id: '3', time: '2PM – 5PM',  label: 'Afternoon' },
          { id: '4', time: '5PM – 8PM',  label: 'Evening' },
        ],
      },
    },
    {
      id: 'rp2',
      name: 'Sanjay Gupta',
      initials: 'SG',
      experience: '3 Years Exp.',
      rating: 4.4,
      reviews: 15,
      badge: 'Verified',
      badgeColor: C.green,
      skills: ['TV Repair', 'Microwave', 'Small Appliances'],
      available: true,
      location: '1.2 km away',
      jobData: {
        jobTitle: 'Repairs',
        postedBy: 'Sanjay Gupta · TechFix',
        icon: '🛠️',
        pay: 550,
        payLabel: '/job',
        timeSlots: [
          { id: '1', time: '8AM – 11AM', label: 'Morning' },
          { id: '2', time: '11AM – 2PM', label: 'Midday' },
          { id: '3', time: '2PM – 5PM',  label: 'Afternoon' },
          { id: '4', time: '5PM – 8PM',  label: 'Evening' },
        ],
      },
    },
    {
      id: 'rp3',
      name: 'Prakash Menon',
      initials: 'PM',
      experience: '12 Years Exp.',
      rating: 4.9,
      reviews: 89,
      badge: 'Expert',
      badgeColor: C.navy,
      skills: ['Electronics', 'Major Appliances', 'Circuit Repair'],
      available: true,
      location: '1.9 km away',
      jobData: {
        jobTitle: 'Repairs',
        postedBy: 'Prakash Menon · Master Tech',
        icon: '🛠️',
        pay: 900,
        payLabel: '/job',
        timeSlots: [
          { id: '1', time: '8AM – 11AM', label: 'Morning' },
          { id: '2', time: '11AM – 2PM', label: 'Midday' },
          { id: '3', time: '2PM – 5PM',  label: 'Afternoon' },
          { id: '4', time: '5PM – 8PM',  label: 'Evening' },
        ],
      },
    },
  ],

  // ─── NEW: Handyman ──────────────────────────────────────────────────────────
  Handyman: [
    {
      id: 'hm1',
      name: 'Sunil Verma',
      initials: 'SV',
      experience: '7 Years Exp.',
      rating: 4.8,
      reviews: 44,
      badge: 'Top Rated',
      badgeColor: C.orange,
      skills: ['Wall Painting', 'Tiling', 'Carpentry'],
      available: true,
      location: '0.6 km away',
      jobData: {
        jobTitle: 'Handyman',
        postedBy: 'Sunil Verma · QuickFix Services',
        icon: '🪛',
        pay: 550,
        payLabel: '/job',
        timeSlots: [
          { id: '1', time: '7AM – 10AM', label: 'Early Morning' },
          { id: '2', time: '10AM – 1PM', label: 'Morning' },
          { id: '3', time: '2PM – 5PM',  label: 'Afternoon' },
          { id: '4', time: '5PM – 8PM',  label: 'Evening' },
        ],
      },
    },
    {
      id: 'hm2',
      name: 'Ravi Shankar',
      initials: 'RS',
      experience: '4 Years Exp.',
      rating: 4.3,
      reviews: 17,
      badge: 'Verified',
      badgeColor: C.green,
      skills: ['Door Fixing', 'Electrical Work', 'Grouting'],
      available: true,
      location: '1.1 km away',
      jobData: {
        jobTitle: 'Handyman',
        postedBy: 'Ravi Shankar · Sector 7',
        icon: '🪛',
        pay: 480,
        payLabel: '/job',
        timeSlots: [
          { id: '1', time: '7AM – 10AM', label: 'Early Morning' },
          { id: '2', time: '10AM – 1PM', label: 'Morning' },
          { id: '3', time: '2PM – 5PM',  label: 'Afternoon' },
          { id: '4', time: '5PM – 8PM',  label: 'Evening' },
        ],
      },
    },
    {
      id: 'hm3',
      name: 'Naresh Yadav',
      initials: 'NY',
      experience: '11 Years Exp.',
      rating: 4.9,
      reviews: 72,
      badge: 'Expert',
      badgeColor: C.navy,
      skills: ['Full Home Repair', 'False Ceiling', 'Waterproofing'],
      available: false,
      location: '2.0 km away',
      jobData: {
        jobTitle: 'Handyman',
        postedBy: 'Naresh Yadav · ProFix Hub',
        icon: '🪛',
        pay: 750,
        payLabel: '/job',
        timeSlots: [
          { id: '1', time: '7AM – 10AM', label: 'Early Morning' },
          { id: '2', time: '10AM – 1PM', label: 'Morning' },
          { id: '3', time: '2PM – 5PM',  label: 'Afternoon' },
          { id: '4', time: '5PM – 8PM',  label: 'Evening' },
        ],
      },
    },
  ],

  // ─── NEW: FurnitureAssembly ─────────────────────────────────────────────────
  FurnitureAssembly: [
    {
      id: 'fa1',
      name: 'Arjun Mehta',
      initials: 'AM',
      experience: '5 Years Exp.',
      rating: 4.7,
      reviews: 28,
      badge: 'Top Rated',
      badgeColor: C.orange,
      skills: ['IKEA Assembly', 'Wardrobe Fitting', 'Bed Setup'],
      available: true,
      location: '0.8 km away',
      jobData: {
        jobTitle: 'Furniture Assembly',
        postedBy: 'Arjun Mehta · AssemblePro',
        icon: '🪑',
        pay: 500,
        payLabel: '/job',
        timeSlots: [
          { id: '1', time: '8AM – 11AM', label: 'Morning' },
          { id: '2', time: '11AM – 2PM', label: 'Midday' },
          { id: '3', time: '2PM – 5PM',  label: 'Afternoon' },
          { id: '4', time: '5PM – 8PM',  label: 'Evening' },
        ],
      },
    },
    {
      id: 'fa2',
      name: 'Pradeep Joshi',
      initials: 'PJ',
      experience: '3 Years Exp.',
      rating: 4.2,
      reviews: 13,
      badge: 'Verified',
      badgeColor: C.green,
      skills: ['Chair Assembly', 'Shelf Install', 'TV Unit'],
      available: true,
      location: '1.3 km away',
      jobData: {
        jobTitle: 'Furniture Assembly',
        postedBy: 'Pradeep Joshi · FlatPack Fix',
        icon: '🪑',
        pay: 420,
        payLabel: '/job',
        timeSlots: [
          { id: '1', time: '8AM – 11AM', label: 'Morning' },
          { id: '2', time: '11AM – 2PM', label: 'Midday' },
          { id: '3', time: '2PM – 5PM',  label: 'Afternoon' },
          { id: '4', time: '5PM – 8PM',  label: 'Evening' },
        ],
      },
    },
    {
      id: 'fa3',
      name: 'Dinesh Kapoor',
      initials: 'DK',
      experience: '9 Years Exp.',
      rating: 4.9,
      reviews: 61,
      badge: 'Expert',
      badgeColor: C.navy,
      skills: ['Modular Kitchen', 'Office Furniture', 'Custom Units'],
      available: true,
      location: '1.7 km away',
      jobData: {
        jobTitle: 'Furniture Assembly',
        postedBy: 'Dinesh Kapoor · Master Assembler',
        icon: '🪑',
        pay: 700,
        payLabel: '/job',
        timeSlots: [
          { id: '1', time: '8AM – 11AM', label: 'Morning' },
          { id: '2', time: '11AM – 2PM', label: 'Midday' },
          { id: '3', time: '2PM – 5PM',  label: 'Afternoon' },
          { id: '4', time: '5PM – 8PM',  label: 'Evening' },
        ],
      },
    },
  ],

  // ─── NEW: HomeRenovation ────────────────────────────────────────────────────
  HomeRenovation: [
    {
      id: 'hr1',
      name: 'Santosh Pillai',
      initials: 'SP',
      experience: '8 Years Exp.',
      rating: 4.8,
      reviews: 52,
      badge: 'Top Rated',
      badgeColor: C.orange,
      skills: ['Flooring', 'Wall Cladding', 'False Ceiling'],
      available: true,
      location: '1.0 km away',
      jobData: {
        jobTitle: 'Home Renovation',
        postedBy: 'Santosh Pillai · RenovateRight',
        icon: '🏠',
        pay: 1200,
        payLabel: '/day',
        timeSlots: [
          { id: '1', time: '8AM – 12PM', label: 'Morning Session' },
          { id: '2', time: '12PM – 4PM', label: 'Midday Session' },
          { id: '3', time: '4PM – 8PM',  label: 'Evening Session' },
        ],
      },
    },
    {
      id: 'hr2',
      name: 'Ganesh Iyer',
      initials: 'GI',
      experience: '5 Years Exp.',
      rating: 4.5,
      reviews: 22,
      badge: 'Verified',
      badgeColor: C.green,
      skills: ['Painting', 'Tiling', 'Kitchen Remodel'],
      available: true,
      location: '1.4 km away',
      jobData: {
        jobTitle: 'Home Renovation',
        postedBy: 'Ganesh Iyer · BuildUp Works',
        icon: '🏠',
        pay: 950,
        payLabel: '/day',
        timeSlots: [
          { id: '1', time: '8AM – 12PM', label: 'Morning Session' },
          { id: '2', time: '12PM – 4PM', label: 'Midday Session' },
          { id: '3', time: '4PM – 8PM',  label: 'Evening Session' },
        ],
      },
    },
    {
      id: 'hr3',
      name: 'Manoj Bhat',
      initials: 'MB',
      experience: '14 Years Exp.',
      rating: 4.9,
      reviews: 98,
      badge: 'Expert',
      badgeColor: C.navy,
      skills: ['Full Home Reno', 'Structural Work', 'Interior Design'],
      available: false,
      location: '2.5 km away',
      jobData: {
        jobTitle: 'Home Renovation',
        postedBy: 'Manoj Bhat · Elite Renovations',
        icon: '🏠',
        pay: 1800,
        payLabel: '/day',
        timeSlots: [
          { id: '1', time: '8AM – 12PM', label: 'Morning Session' },
          { id: '2', time: '12PM – 4PM', label: 'Midday Session' },
          { id: '3', time: '4PM – 8PM',  label: 'Evening Session' },
        ],
      },
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
function WorkerCard({ worker, onPress }) {
  const ratingValue = Number(worker.rating || 0).toFixed(1);
  return (
    <TouchableOpacity
      style={[s.card, !worker.available && s.cardUnavailable]}
      onPress={() => worker.available && onPress(worker)}
      activeOpacity={worker.available ? 0.82 : 1}
    >
      {/* Top Row: Avatar + Name + Badge */}
      <View style={s.cardTop}>
        <View style={s.avatarWrap}>
          <Text style={s.avatarText}>{worker.initials}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <View style={s.nameRow}>
            <Text style={s.workerName}>{worker.name}</Text>
            {worker.experience ? <Text style={s.inlineExperience}>{worker.experience}</Text> : null}
            <View style={s.ratingBadge}>
              <Text style={s.ratingBadgeText}>Rating {ratingValue}</Text>
            </View>
          </View>
          {/* Stars + Score */}
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

      {/* Bottom Row: Location + Availability + CTA */}
      <View style={s.cardBottom}>
        <Text style={s.location}>📍 {worker.location}</Text>
        <View style={[s.availDot, !worker.available && s.availDotOff]} />
        <Text style={[s.availText, !worker.available && s.availTextOff]}>
          {worker.available ? 'Available Now' : 'Busy'}
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
export default function WorkersListScreen({ navigation, route }) {
  const category = route?.params?.category || 'Plumber';
  const categoryIcon = route?.params?.icon || '🔧';
  const workers = [...(WORKERS_DATA[category] || [])].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
  const availableCount = workers.filter(w => w.available).length;

  const handleWorkerPress = (worker) => {
    const routeName = category === 'Driver' ? 'DriverNeeded' : category;
    navigation.navigate(routeName, { workerData: worker });
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.navy} />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation?.goBack?.()} activeOpacity={0.7}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Available Workers</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Banner */}
      <View style={s.banner}>
        <View style={s.bannerRow}>
          <View style={{ flex: 1 }}>
            <Text style={s.bannerTitle}>{categoryIcon} {category}s Near You</Text>
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
        <Text style={s.listHint}>
          {category === 'Driver'
            ? 'Tap View to open the driver needed page'
            : 'Tap a worker to view their profile & book'}
        </Text>

        {workers.map(worker => (
          <WorkerCard
            key={worker.id}
            worker={worker}
            onPress={handleWorkerPress}
          />
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.navy },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.navy,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backBtn:     { width: 32, height: 32, justifyContent: 'center' },
  backArrow:   { color: C.white, fontSize: 22, fontWeight: '300' },
  headerTitle: { color: C.white, fontSize: 17, fontWeight: '700' },

  banner: {
    backgroundColor: C.navy,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 32,
  },
  bannerRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bannerTitle: { color: C.white, fontSize: 18, fontWeight: '800' },
  bannerSub:   { color: '#E8A020', fontSize: 12, marginTop: 4 },
  countBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  countNum:   { color: C.white, fontSize: 24, fontWeight: '800' },
  countLabel: { color: '#E8A020', fontSize: 11 },
  wave: {
    position: 'absolute', bottom: -1, left: 0, right: 0,
    height: 20,
    backgroundColor: C.cream,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  scroll:        { flex: 1, backgroundColor: C.cream },
  scrollContent: { paddingHorizontal: 16, paddingTop: 14 },

  listHint: {
    color: C.textLight,
    fontSize: 12,
    marginBottom: 14,
    textAlign: 'center',
  },

  // Worker Card
  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: C.orangeLight,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardUnavailable: {
    opacity: 0.55,
    borderColor: C.border,
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },

  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: C.navy,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: C.orangeLight,
  },
  avatarText: { color: C.white, fontSize: 18, fontWeight: '800' },

  nameRow:    { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 4, flexWrap: 'wrap' },
  workerName: { color: C.textDark, fontSize: 15, fontWeight: '800' },
  inlineExperience: { color: C.textLight, fontSize: 11, fontWeight: '700' },
  ratingBadge: {
    backgroundColor: '#FFF7E6',
    borderColor: C.starGold,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  ratingBadgeText: { color: C.starGold, fontSize: 10, fontWeight: '800' },

  badge: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 10, fontWeight: '700' },

  experience: { color: C.textLight, fontSize: 12, marginBottom: 5 },

  ratingRow:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  starsRow:    { flexDirection: 'row', gap: 1 },
  star:        { fontSize: 12, color: '#DDD' },
  starFilled:  { color: C.starGold },
  ratingScore: { color: C.textLight, fontSize: 11 },

  divider: { height: 1, backgroundColor: C.border, marginVertical: 10 },

  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  skillTag: {
    backgroundColor: C.tagBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.tagBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  skillTagText: { color: C.textMid, fontSize: 11, fontWeight: '500' },

  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  location: { color: C.textLight, fontSize: 12, flex: 1 },

  availDot:    { width: 8, height: 8, borderRadius: 4, backgroundColor: C.green },
  availDotOff: { backgroundColor: '#CCC' },
  availText:   { color: C.green, fontSize: 12, fontWeight: '600' },
  availTextOff:{ color: C.textLight },

  viewBtn: {
    backgroundColor: C.navy,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginLeft: 4,
  },
  viewBtnText: { color: C.white, fontSize: 12, fontWeight: '700' },
});


