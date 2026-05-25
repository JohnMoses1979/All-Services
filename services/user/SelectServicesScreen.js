// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   SafeAreaView,
//   Modal,
// } from 'react-native';

// const GREEN = '#22C55E';
// const LIGHT_GREEN = '#DCFCE7';
// const PURPLE = '#4F46E5';

// const SERVICES = [
//   { id: 1, icon: '🏠', title: 'Household', desc: 'Cleaning, Cooking, Maid, etc.' },
//   { id: 2, icon: '🔧', title: 'Repairs', desc: 'Plumbing, Carpentry, Painting, etc.' },
//   { id: 3, icon: '💇', title: 'Personal Care', desc: 'Salon, Massage, Grooming, etc.' },
//   { id: 4, icon: '🏥', title: 'Healthcare', desc: 'Nursing, Physiotherapy, Elder Care, etc.' },
//   { id: 5, icon: '🚗', title: 'Transport', desc: 'Driver, Delivery, Courier, etc.' },
//   { id: 6, icon: '🐾', title: 'Pet & Lifestyle', desc: 'Pet Care, Training, Walking, etc.' },
//   { id: 7, icon: '💻', title: 'Tech & Support', desc: 'AC Repair, Computer, Mobile Repair, etc.' },
//   { id: 8, icon: '🎉', title: 'Events', desc: 'Catering, Decor, Photography, etc.' },
//   { id: 9, icon: '🌿', title: 'Outdoor & Safety', desc: 'Pest Control, Home Security, Gardening, etc.' },
//   { id: 10, icon: '🏊', title: 'Pool Cleaning', desc: 'Swimming Pool Cleaning & Maintenance' },
// ];

// export default function SelectServicesScreen({ navigation }) {
//   const [selected, setSelected] = useState([]);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const toggleService = (id) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
//     );
//   };

//   const clearAll = () => setSelected([]);

//   const selectedNames = SERVICES.filter((s) => selected.includes(s.id))
//     .map((s) => s.title)
//     .join(', ');

//   return (
//     <SafeAreaView style={styles.safe}>
//       <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

//         {/* Title */}
//         <Text style={styles.mainTitle}>Select Your Services</Text>
//         <Text style={styles.mainSub}>
//           Choose the services you are skilled in and want to offer.
//         </Text>

//         {/* Dropdown Trigger */}
//         <Text style={styles.fieldLabel}>Select Service(s)</Text>
//         <TouchableOpacity
//           style={[styles.dropdown, dropdownOpen && styles.dropdownOpen]}
//           onPress={() => setDropdownOpen(!dropdownOpen)}
//           activeOpacity={0.8}
//         >
//           <Text style={[styles.dropdownText, selectedNames && { color: '#FFFFFF' }]}>
//             {selectedNames || 'Select one or more services'}
//           </Text>
//           <Text style={{ fontSize: 18, color: '#E5E7EB' }}>{dropdownOpen ? '⌃' : '⌄'}</Text>
//         </TouchableOpacity>

//         {/* Services List */}
//         <View style={styles.listCard}>
//           {SERVICES.map((item, index) => {
//             const isSelected = selected.includes(item.id);
//             return (
//               <TouchableOpacity
//                 key={item.id}
//                 style={[
//                   styles.serviceRow,
//                   index === SERVICES.length - 1 && { borderBottomWidth: 0 },
//                 ]}
//                 onPress={() => toggleService(item.id)}
//                 activeOpacity={0.7}
//               >
//                 <View style={styles.serviceLeft}>
//                   <View style={styles.serviceIconWrap}>
//                     <Text style={{ fontSize: 22 }}>{item.icon}</Text>
//                   </View>
//                   <View style={{ flex: 1 }}>
//                     <Text style={styles.serviceTitle}>{item.title}</Text>
//                     <Text style={styles.serviceDesc}>{item.desc}</Text>
//                   </View>
//                 </View>
//                 <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
//                   {isSelected && <Text style={styles.checkmark}>✓</Text>}
//                 </View>
//               </TouchableOpacity>
//             );
//           })}
//         </View>

//         {/* Footer Row */}
//         {selected.length > 0 && (
//           <View style={styles.footerRow}>
//             <Text style={styles.selectedCount}>
//               Selected <Text style={{ color: GREEN, fontWeight: '700' }}>{selected.length}</Text> service{selected.length > 1 ? 's' : ''}
//             </Text>
//             <TouchableOpacity onPress={clearAll}>
//               <Text style={styles.clearAll}>Clear All</Text>
//             </TouchableOpacity>
//           </View>
//         )}

//         {/* Continue Button */}
//         <TouchableOpacity
//           style={[styles.continueBtn, selected.length === 0 && styles.continueBtnDisabled]}
//           onPress={() => selected.length > 0 && navigation.navigate('RegistrationSuccess')}
//           activeOpacity={0.85}
//         >
//           <Text style={styles.continueBtnText}>Continue</Text>
//         </TouchableOpacity>

//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: '#F8F9FC' },
//   scroll: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 32 },

//   mainTitle: { fontSize: 22, fontWeight: '800', color: '#1E1B4B', marginBottom: 6 },
//   mainSub: { fontSize: 14, color: '#6B7280', marginBottom: 22, lineHeight: 20 },

//   fieldLabel: { fontSize: 14, fontWeight: '600', color: '#E5E7EB', marginBottom: 8 },

//   dropdown: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     borderWidth: 1.5,
//     borderColor: '#E5E7EB',
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 13,
//     backgroundColor: '#FFFFFF',
//     marginBottom: 16,
//   },
//   dropdownOpen: { borderColor: PURPLE },
//   dropdownText: { fontSize: 14, color: '#E5E7EB', flex: 1, marginRight: 8 },

//   listCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 14,
//     overflow: 'hidden',
//     marginBottom: 16,
//     elevation: 2,
//     shadowColor: '#1E1B4B',
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//   },
//   serviceRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 14,
//     paddingHorizontal: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   serviceLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
//   serviceIconWrap: {
//     width: 42, height: 42, borderRadius: 10,
//     backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center',
//   },
//   serviceTitle: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', marginBottom: 2 },
//   serviceDesc: { fontSize: 12, color: '#E5E7EB' },

//   checkbox: {
//     width: 22, height: 22, borderRadius: 4,
//     borderWidth: 1.5, borderColor: '#E5E7EB',
//     alignItems: 'center', justifyContent: 'center',
//     backgroundColor: '#FFFFFF',
//   },
//   checkboxSelected: { backgroundColor: PURPLE, borderColor: PURPLE },
//   checkmark: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

//   footerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//     paddingHorizontal: 2,
//   },
//   selectedCount: { fontSize: 13, color: '#6B7280' },
//   clearAll: { fontSize: 13, color: PURPLE, fontWeight: '600' },

//   continueBtn: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     paddingVertical: 16,
//     alignItems: 'center',
//   },
//   continueBtnDisabled: { backgroundColor: '#E5E7EB' },
//   continueBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
// });





















import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { providerApi } from '../api/providerApi';

const PURPLE = '#4F46E5';
const GREEN = '#22C55E';

// ── Exact data from HomeScreen.js ─────────────────────────────────────────────
const CATEGORIES = [
  { id: 'household', name: 'Household', emoji: '🏠' },
  { id: 'repairs', name: 'Repairs', emoji: '🔧' },
  { id: 'personalCare', name: 'Personal Care', emoji: '💄' },
  { id: 'healthcare', name: 'Healthcare', emoji: '🏥' },
  { id: 'transport', name: 'Transport', emoji: '🚗' },
  { id: 'petLifestyle', name: 'Pet & Lifestyle', emoji: '🐾' },
  { id: 'personalServices', name: 'Personal Services', emoji: '🎓' },
  { id: 'techSupport', name: 'Tech & Support', emoji: '💻' },
  { id: 'events', name: 'Events', emoji: '🎉' },
  { id: 'outdoor', name: 'Outdoor & Safety', emoji: '🌿' },
];

const SERVICES = [
  // HOUSEHOLD
  { id: 'deepCleaning', name: 'Deep Cleaning', emoji: '🧽', category: 'household' },
  { id: 'homeChef', name: 'Home Chef', emoji: '👨‍🍳', category: 'household' },
  { id: 'maid', name: 'Maid', emoji: '🧑‍🔧', category: 'household' },
  { id: 'laundry', name: 'Laundry', emoji: '🧺', category: 'household' },
  { id: 'waterTankCleaning', name: 'Water Tank Cleaning', emoji: '💧', category: 'household' },
  { id: 'poolCleaning', name: 'Pool Cleaning', emoji: '🏊', category: 'household' },
  { id: 'ironingService', name: 'Ironing Service', emoji: '👔', category: 'household' },
  { id: 'sofaCleaning', name: 'Sofa / Carpet Cleaning', emoji: '🛋️', category: 'household' },
  // REPAIRS
  { id: 'electrician', name: 'Electrician', emoji: '💡', category: 'repairs' },
  { id: 'plumber', name: 'Plumber', emoji: '🔧', category: 'repairs' },
  { id: 'acRepair', name: 'AC Repair', emoji: '❄️', category: 'repairs' },
  { id: 'handyman', name: 'Handyman', emoji: '🛠️', category: 'repairs' },
  { id: 'carpenter', name: 'Carpenter', emoji: '🪚', category: 'repairs' },
  { id: 'painting', name: 'Painting', emoji: '🎨', category: 'repairs' },
  { id: 'furnitureAssembly', name: 'Furniture Assembly', emoji: '🪑', category: 'repairs' },
  { id: 'homeRenovation', name: 'Home Renovation', emoji: '🏡', category: 'repairs' },
  { id: 'tiling', name: 'Tiling', emoji: '🔲', category: 'repairs' },
  { id: 'roofing', name: 'Roofing', emoji: '🏠', category: 'repairs' },
  { id: 'glassFitting', name: 'Glass / Window Fitting', emoji: '🪟', category: 'repairs' },
  { id: 'waterproofing', name: 'Waterproofing', emoji: '🛡️', category: 'repairs' },
  // PERSONAL CARE
  { id: 'salonAtHome', name: 'Salon at Home', emoji: '💇', category: 'personalCare' },
  { id: 'beautician', name: 'Beautician', emoji: '💅', category: 'personalCare' },
  { id: 'massageTherapy', name: 'Massage Therapy', emoji: '💆', category: 'personalCare' },
  { id: 'mehendi', name: 'Mehendi Artist', emoji: '🌿', category: 'personalCare' },
  { id: 'makeupArtist', name: 'Makeup Artist', emoji: '💄', category: 'personalCare' },
  // HEALTHCARE
  { id: 'doctor', name: 'Doctor Visit', emoji: '🩺', category: 'healthcare' },
  { id: 'homeNurse', name: 'Home Nurse', emoji: '💊', category: 'healthcare' },
  { id: 'physiotherapy', name: 'Physiotherapy', emoji: '🦯', category: 'healthcare' },
  { id: 'labTestAtHome', name: 'Lab Test at Home', emoji: '🧪', category: 'healthcare' },
  { id: 'elderCare', name: 'Elder Care', emoji: '🧓', category: 'healthcare' },
  { id: 'babyCare', name: 'Baby Care / Nanny', emoji: '👶', category: 'healthcare' },
  // TRANSPORT
  { id: 'driver', name: 'Driver', emoji: '🚗', category: 'transport' },
  { id: 'carWash', name: 'Car Wash', emoji: '🚙', category: 'transport' },
  { id: 'moving', name: 'Shifting / Moving', emoji: '📦', category: 'transport' },
  // PET & LIFESTYLE
  { id: 'petWalking', name: 'Pet Training', emoji: '🦮', category: 'petLifestyle' },
  // PERSONAL SERVICES
  { id: 'fitnessTrainer', name: 'Fitness / Yoga', emoji: '🏋️', category: 'personalServices' },
  { id: 'tutor', name: 'Tutor', emoji: '📚', category: 'personalServices' },
  { id: 'dietitian', name: 'Dietitian / Nutritionist', emoji: '🥗', category: 'personalServices' },
  // TECH SUPPORT
  { id: 'wifiSetup', name: 'WiFi Setup', emoji: '📶', category: 'techSupport' },
  { id: 'cctvInstallation', name: 'CCTV Installation', emoji: '📹', category: 'techSupport' },
  { id: 'security', name: 'Security Services', emoji: '🔒', category: 'techSupport' },
  { id: 'computerRepair', name: 'Computer / Laptop Repair', emoji: '💻', category: 'techSupport' },
  // EVENTS
  { id: 'birthdayDecor', name: 'Birthday Decorations', emoji: '🎂', category: 'events' },
  { id: 'eventPhotography', name: 'Event Photography', emoji: '📸', category: 'events' },
  { id: 'cateringServices', name: 'Catering Services', emoji: '🍽️', category: 'events' },
  { id: 'partyPlanner', name: 'Party Planner', emoji: '🎉', category: 'events' },
  { id: 'tentHouse', name: 'Tent House / Mandap', emoji: '🏕️', category: 'events' },
  { id: 'dj', name: 'DJ / Sound System', emoji: '🎶', category: 'events' },
  // OUTDOOR
  { id: 'gardening', name: 'Gardening', emoji: '🌱', category: 'outdoor' },
  { id: 'pestControl', name: 'Pest Control', emoji: '🦟', category: 'outdoor' },
  { id: 'sewageTreatment', name: 'Sewage Treatment', emoji: '🚧', category: 'outdoor' },
  { id: 'borewellService', name: 'Borewell Service', emoji: '⛏️', category: 'outdoor' },
  { id: 'solarInstallation', name: 'Solar Panel Installation', emoji: '☀️', category: 'outdoor' },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function SelectServicesScreen({ navigation, route }) {
  const email = route?.params?.email || '';

  // Which category accordions are open
  const [openCategories, setOpenCategories] = useState({});
  // Selected individual skill ids
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const toggleCategory = (catId) => {
    setOpenCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const toggleSkill = (skillId) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId) ? prev.filter((s) => s !== skillId) : [...prev, skillId]
    );
    if (apiError) setApiError('');
  };

  // How many skills selected per category — for the badge
  const selectedCountForCategory = (catId) =>
    SERVICES.filter((s) => s.category === catId && selectedSkills.includes(s.id)).length;

  const totalSelected = selectedSkills.length;

  const clearAll = () => setSelectedSkills([]);

  // Summary text shown in the summary bar
  const summaryText = SERVICES
    .filter((s) => selectedSkills.includes(s.id))
    .map((s) => s.name)
    .join(', ');

  const handleContinue = async () => {
    if (totalSelected === 0) return;
    setApiError('');
    setSubmitting(true);

    // Send the individual skill names to the backend
    const skillNames = SERVICES
      .filter((s) => selectedSkills.includes(s.id))
      .map((s) => s.name);

    try {
      await providerApi.selectSkills({ email, skills: skillNames });
      navigation.navigate('RegistrationSuccess');
    } catch (err) {
      setApiError(err?.message || 'Failed to save your skills. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Title ── */}
        <Text style={styles.mainTitle}>Select Your Services</Text>
        <Text style={styles.mainSub}>
          Tap a category to expand it, then choose the skills you offer.
        </Text>

        {/* ── Summary bar ── */}
        <View style={styles.summaryBar}>
          <Text
            style={[styles.summaryText, summaryText ? { color: '#FFFFFF' } : null]}
            numberOfLines={2}
          >
            {summaryText || 'No skills selected yet'}
          </Text>
        </View>

        {/* ── API Error ── */}
        {apiError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>⚠️  {apiError}</Text>
          </View>
        ) : null}

        {/* ── Category accordion list ── */}
        <View style={styles.accordionCard}>
          {CATEGORIES.map((cat, catIndex) => {
            const isOpen = !!openCategories[cat.id];
            const catSkills = SERVICES.filter((s) => s.category === cat.id);
            const selCount = selectedCountForCategory(cat.id);
            const isLast = catIndex === CATEGORIES.length - 1;

            return (
              <View key={cat.id}>
                {/* Category header row */}
                <TouchableOpacity
                  style={[
                    styles.catRow,
                    isOpen && styles.catRowOpen,
                    isLast && !isOpen && { borderBottomWidth: 0 },
                  ]}
                  onPress={() => toggleCategory(cat.id)}
                  activeOpacity={0.75}
                >
                  <View style={styles.catLeft}>
                    <View style={[styles.catIconWrap, isOpen && styles.catIconWrapOpen]}>
                      <Text style={styles.catEmoji}>{cat.emoji}</Text>
                    </View>
                    <Text style={[styles.catName, isOpen && styles.catNameOpen]}>
                      {cat.name}
                    </Text>
                  </View>
                  <View style={styles.catRight}>
                    {selCount > 0 && (
                      <View style={styles.selBadge}>
                        <Text style={styles.selBadgeText}>{selCount}</Text>
                      </View>
                    )}
                    <Text style={[styles.chevron, isOpen && styles.chevronOpen]}>›</Text>
                  </View>
                </TouchableOpacity>

                {/* Skills list — shown when open */}
                {isOpen && (
                  <View style={[styles.skillsWrap, isLast && { borderBottomWidth: 0 }]}>
                    {catSkills.map((skill, skillIndex) => {
                      const isSel = selectedSkills.includes(skill.id);
                      return (
                        <TouchableOpacity
                          key={skill.id}
                          style={[
                            styles.skillRow,
                            isSel && styles.skillRowSelected,
                            skillIndex === catSkills.length - 1 && { borderBottomWidth: 0 },
                          ]}
                          onPress={() => toggleSkill(skill.id)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.skillLeft}>
                            <Text style={styles.skillEmoji}>{skill.emoji}</Text>
                            <Text style={[styles.skillName, isSel && styles.skillNameSelected]}>
                              {skill.name}
                            </Text>
                          </View>
                          <View style={[styles.checkbox, isSel && styles.checkboxSelected]}>
                            {isSel && <Text style={styles.checkmark}>✓</Text>}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* ── Footer: count + clear ── */}
        {totalSelected > 0 && (
          <View style={styles.footerRow}>
            <Text style={styles.selectedCount}>
              Selected{' '}
              <Text style={{ color: GREEN, fontWeight: '700' }}>{totalSelected}</Text>{' '}
              skill{totalSelected > 1 ? 's' : ''}
            </Text>
            <TouchableOpacity onPress={clearAll}>
              <Text style={styles.clearAll}>Clear All</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Continue button ── */}
        <TouchableOpacity
          style={[
            styles.continueBtn,
            (totalSelected === 0 || submitting) && styles.continueBtnDisabled,
          ]}
          onPress={handleContinue}
          disabled={totalSelected === 0 || submitting}
          activeOpacity={0.85}
        >
          {submitting ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <ActivityIndicator color="#FFFFFF" size="small" />
              <Text style={styles.continueBtnText}>Saving…</Text>
            </View>
          ) : (
            <Text style={styles.continueBtnText}>
              Continue{totalSelected > 0 ? ` (${totalSelected})` : ''}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FC' },
  scroll: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 36 },

  mainTitle: { fontSize: 22, fontWeight: '800', color: '#1E1B4B', marginBottom: 6 },
  mainSub: { fontSize: 14, color: '#6B7280', marginBottom: 18, lineHeight: 20 },

  // Summary bar — replaces the old dropdown trigger
  summaryBar: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 14,
    minHeight: 46,
    justifyContent: 'center',
  },
  summaryText: { fontSize: 13, color: '#6B7280', lineHeight: 18 },

  errorBanner: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  errorBannerText: { color: '#FB923C', fontSize: 13, fontWeight: '600', lineHeight: 18 },

  // ── Accordion card ──────────────────────────────────────────
  accordionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#1E1B4B',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },

  // Category header
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  catRowOpen: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E5E7EB',
  },
  catLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  catIconWrap: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
  },
  catIconWrapOpen: { backgroundColor: '#E5E7EB' },
  catEmoji: { fontSize: 20 },
  catName: { fontSize: 14, fontWeight: '700', color: '#1E1B4B' },
  catNameOpen: { color: PURPLE },
  catRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  // Selected count badge on category row
  selBadge: {
    minWidth: 22, height: 22, borderRadius: 11,
    backgroundColor: PURPLE,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 6,
  },
  selBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },

  chevron: {
    fontSize: 22,
    color: '#E5E7EB',
    transform: [{ rotate: '0deg' }],
  },
  chevronOpen: {
    color: PURPLE,
    transform: [{ rotate: '90deg' }],
  },

  // Skills sub-list
  skillsWrap: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingLeft: 66,   // indent under category icon
    paddingRight: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  skillRowSelected: { backgroundColor: '#E5E7EB' },
  skillLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  skillEmoji: { fontSize: 17 },
  skillName: { fontSize: 13, fontWeight: '600', color: '#1E1B4B' },
  skillNameSelected: { color: PURPLE, fontWeight: '700' },

  // Checkbox
  checkbox: {
    width: 22, height: 22, borderRadius: 4,
    borderWidth: 1.5, borderColor: '#E5E7EB',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxSelected: { backgroundColor: PURPLE, borderColor: PURPLE },
  checkmark: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  // Footer
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    paddingHorizontal: 2,
  },
  selectedCount: { fontSize: 13, color: '#6B7280' },
  clearAll: { fontSize: 13, color: PURPLE, fontWeight: '600' },

  // Continue button
  continueBtn: {
    backgroundColor: PURPLE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueBtnDisabled: { backgroundColor: '#E5E7EB' },
  continueBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
});