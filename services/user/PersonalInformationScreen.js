// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   SafeAreaView,
//   TextInput,
//   ActivityIndicator,
//   Alert,
//   Modal,
//   FlatList,
// } from 'react-native';
// import { providerApi } from '../api/providerApi';

// const GREEN = '#22C55E';
// const LIGHT_GREEN = '#DCFCE7';
// const DARK = '#FFFFFF';
// const GREY = '#E5E7EB';
// const BORDER = '#E5E7EB';
// const INPUT_BG = '#1E3A8A';
// const ERROR_RED = '#FB923C';

// // ── Gender options ────────────────────────────────────────────
// const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

// // ── Blood group options ───────────────────────────────────────
// const BLOOD_GROUP_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Unknown'];

// // ── Validation ────────────────────────────────────────────────
// function validateField(key, value) {
//   switch (key) {
//     case 'fullName':
//       if (!value.trim()) return 'Full name is required.';
//       if (value.trim().length < 2) return 'Name must be at least 2 characters.';
//       return '';
//     case 'mobile': {
//       const clean = value.replace(/\s/g, '');
//       if (!clean) return 'Mobile number is required.';
//       if (!/^[6-9]\d{9}$/.test(clean)) return 'Enter a valid 10-digit Indian mobile number.';
//       return '';
//     }
//     case 'email':
//       if (!value.trim()) return 'Email is required.';
//       if (!/\S+@\S+\.\S+/.test(value)) return 'Enter a valid email address.';
//       return '';
//     case 'dateOfBirth':
//       if (!value.trim()) return '';
//       // dd/mm/yyyy
//       if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return 'Use format DD/MM/YYYY.';
//       return '';
//     case 'pinCode':
//       if (value && !/^\d{6}$/.test(value)) return 'Enter a valid 6-digit PIN code.';
//       return '';
//     case 'aadhaarNumber':
//       if (value && !/^\d{12}$/.test(value.replace(/\s/g, '')))
//         return 'Aadhaar must be 12 digits.';
//       return '';
//     default:
//       return '';
//   }
// }

// // ── Dropdown Modal ────────────────────────────────────────────
// function DropdownModal({ visible, title, options, selected, onSelect, onClose }) {
//   return (
//     <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
//       <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
//         <View style={styles.modalSheet}>
//           <View style={styles.modalHandle} />
//           <Text style={styles.modalTitle}>{title}</Text>
//           <FlatList
//             data={options}
//             keyExtractor={(item) => item}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 style={[styles.modalOption, selected === item && styles.modalOptionSelected]}
//                 onPress={() => { onSelect(item); onClose(); }}
//               >
//                 <Text
//                   style={[
//                     styles.modalOptionText,
//                     selected === item && styles.modalOptionTextSelected,
//                   ]}
//                 >
//                   {item}
//                 </Text>
//                 {selected === item && <Text style={{ color: GREEN, fontSize: 18 }}>✓</Text>}
//               </TouchableOpacity>
//             )}
//           />
//         </View>
//       </TouchableOpacity>
//     </Modal>
//   );
// }

// // ── Field components ──────────────────────────────────────────
// function SectionHeader({ title }) {
//   return (
//     <View style={styles.sectionHeader}>
//       <View style={styles.sectionDot} />
//       <Text style={styles.sectionTitle}>{title}</Text>
//     </View>
//   );
// }

// function FieldLabel({ label, required }) {
//   return (
//     <Text style={styles.fieldLabel}>
//       {label}
//       {required && <Text style={{ color: ERROR_RED }}> *</Text>}
//     </Text>
//   );
// }

// function ReadOnlyField({ icon, value, placeholder }) {
//   return (
//     <View style={[styles.inputWrap, styles.readOnlyWrap]}>
//       {icon ? <Text style={styles.inputIcon}>{icon}</Text> : null}
//       <Text style={[styles.inputText, !value && { color: '#E5E7EB' }]}>
//         {value || placeholder}
//       </Text>
//       <View style={styles.lockedBadge}>
//         <Text style={styles.lockedText}>🔒</Text>
//       </View>
//     </View>
//   );
// }

// function EditableField({
//   icon, value, placeholder, onChangeText, onBlur,
//   keyboardType, maxLength, editable = true, error,
// }) {
//   return (
//     <>
//       <View style={[styles.inputWrap, error ? styles.inputWrapError : null]}>
//         {icon ? <Text style={styles.inputIcon}>{icon}</Text> : null}
//         <TextInput
//           style={styles.inputText}
//           value={value}
//           onChangeText={onChangeText}
//           onBlur={onBlur}
//           placeholder={placeholder}
//           placeholderTextColor="#E5E7EB"
//           keyboardType={keyboardType || 'default'}
//           maxLength={maxLength}
//           editable={editable}
//         />
//       </View>
//       {error ? <Text style={styles.fieldError}>{error}</Text> : null}
//     </>
//   );
// }

// function SelectField({ icon, value, placeholder, onPress, error }) {
//   return (
//     <>
//       <TouchableOpacity
//         style={[styles.inputWrap, error ? styles.inputWrapError : null]}
//         onPress={onPress}
//         activeOpacity={0.8}
//       >
//         {icon ? <Text style={styles.inputIcon}>{icon}</Text> : null}
//         <Text style={[styles.inputText, !value && { color: '#E5E7EB' }]}>
//           {value || placeholder}
//         </Text>
//         <Text style={{ color: GREY, fontSize: 18 }}>›</Text>
//       </TouchableOpacity>
//       {error ? <Text style={styles.fieldError}>{error}</Text> : null}
//     </>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// export default function PersonalInformationScreen({ navigation }) {
//   const [provider, setProvider] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [errors, setErrors] = useState({});

//   // Dropdown modals
//   const [genderModal, setGenderModal] = useState(false);
//   const [bloodModal, setBloodModal] = useState(false);

//   // Form state
//   const [form, setForm] = useState({
//     fullName: '',
//     mobile: '',
//     email: '',
//     dateOfBirth: '',
//     gender: '',
//     bloodGroup: '',
//     area: '',
//     city: '',
//     state: '',
//     pinCode: '',
//     aadhaarNumber: '',
//     bio: '',
//     emergencyContact: '',
//     emergencyName: '',
//     experience: '',
//   });

//   // ── Load provider data ──────────────────────────────────────
//   useEffect(() => {
//     providerApi.getProvider().then((p) => {
//       if (p) {
//         setProvider(p);
//         setForm((prev) => ({
//           ...prev,
//           fullName: p.fullName || '',
//           mobile: p.mobile || '',
//           email: p.email || '',
//           area: p.area || '',
//           experience: p.experienceYears ? String(p.experienceYears) : '',
//           // Fields that may not exist yet in the API – read from stored extras
//           dateOfBirth: p.dateOfBirth || '',
//           gender: p.gender || '',
//           bloodGroup: p.bloodGroup || '',
//           city: p.city || '',
//           state: p.state || '',
//           pinCode: p.pinCode || '',
//           aadhaarNumber: p.aadhaarNumber || '',
//           bio: p.bio || '',
//           emergencyContact: p.emergencyContact || '',
//           emergencyName: p.emergencyName || '',
//         }));
//       }
//       setLoading(false);
//     });
//   }, []);

//   // ── Field helpers ───────────────────────────────────────────
//   const updateField = (key, value) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//     if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
//   };

//   const blurField = (key) => {
//     const err = validateField(key, form[key]);
//     setErrors((prev) => ({ ...prev, [key]: err }));
//   };

//   // ── Validate all editable fields ────────────────────────────
//   const validateAll = () => {
//     const keys = ['fullName', 'mobile', 'email', 'dateOfBirth', 'pinCode', 'aadhaarNumber'];
//     const newErrors = {};
//     let hasError = false;
//     keys.forEach((k) => {
//       const err = validateField(k, form[k]);
//       newErrors[k] = err;
//       if (err) hasError = true;
//     });
//     setErrors(newErrors);
//     return !hasError;
//   };

//   // ── Save ────────────────────────────────────────────────────
//   const handleSave = async () => {
//     if (!validateAll()) return;
//     setSaving(true);
//     try {
//       // Merge updates — providerApi.updateProfile should PATCH /api/provider/me
//       await providerApi.updateProfile({
//         fullName: form.fullName.trim(),
//         area: form.area.trim(),
//         dateOfBirth: form.dateOfBirth,
//         gender: form.gender,
//         bloodGroup: form.bloodGroup,
//         city: form.city,
//         state: form.state,
//         pinCode: form.pinCode,
//         bio: form.bio,
//         emergencyContact: form.emergencyContact,
//         emergencyName: form.emergencyName,
//         experienceYears: form.experience ? parseInt(form.experience) : undefined,
//       });
//       setIsEditing(false);
//       Alert.alert('Success', 'Your profile has been updated successfully.');
//     } catch (err) {
//       Alert.alert('Error', err?.message || 'Failed to save changes. Please try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── Cancel edit ─────────────────────────────────────────────
//   const handleCancel = () => {
//     // Reset to last known provider values
//     if (provider) {
//       setForm({
//         fullName: provider.fullName || '',
//         mobile: provider.mobile || '',
//         email: provider.email || '',
//         dateOfBirth: provider.dateOfBirth || '',
//         gender: provider.gender || '',
//         bloodGroup: provider.bloodGroup || '',
//         area: provider.area || '',
//         city: provider.city || '',
//         state: provider.state || '',
//         pinCode: provider.pinCode || '',
//         aadhaarNumber: provider.aadhaarNumber || '',
//         bio: provider.bio || '',
//         emergencyContact: provider.emergencyContact || '',
//         emergencyName: provider.emergencyName || '',
//         experience: provider.experienceYears ? String(provider.experienceYears) : '',
//       });
//     }
//     setErrors({});
//     setIsEditing(false);
//   };

//   // ── Avatar initials ─────────────────────────────────────────
//   const initials = provider?.initials || (form.fullName
//     ? form.fullName.trim().split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
//     : '?');

//   // ─────────────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <SafeAreaView style={styles.safe}>
//         <View style={styles.loadingWrap}>
//           <ActivityIndicator size="large" color={GREEN} />
//           <Text style={styles.loadingText}>Loading profile…</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safe}>
//       {/* ── Header ────────────────────────────────────────── */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
//           <Text style={{ fontSize: 22 }}>←</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Personal Information</Text>
//         {isEditing ? (
//           <TouchableOpacity onPress={handleCancel} style={styles.headerBtn}>
//             <Text style={styles.cancelText}>Cancel</Text>
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.headerBtn}>
//             <View style={styles.editBtn}>
//               <Text style={styles.editBtnText}>✏️ Edit</Text>
//             </View>
//           </TouchableOpacity>
//         )}
//       </View>

//       <ScrollView
//         contentContainerStyle={styles.scroll}
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//       >
//         {/* ── Avatar card ─────────────────────────────────── */}
//         <View style={styles.avatarCard}>
//           <View style={styles.avatarCircle}>
//             <Text style={styles.avatarText}>{initials}</Text>
//           </View>
//           <Text style={styles.avatarName}>{form.fullName || 'Provider'}</Text>
//           {provider?.status === 'ACTIVE' && (
//             <View style={styles.activeBadge}>
//               <View style={styles.activeDot} />
//               <Text style={styles.activeBadgeText}>Active</Text>
//             </View>
//           )}
//           {isEditing && (
//             <Text style={styles.editingNote}>✏️ Editing mode — make your changes below</Text>
//           )}
//         </View>

//         {/* ══ SECTION 1: Basic Information ════════════════════ */}
//         <SectionHeader title="Basic Information" />

//         <View style={styles.card}>
//           <FieldLabel label="Full Name" required />
//           {isEditing ? (
//             <EditableField
//               icon="👤"
//               value={form.fullName}
//               placeholder="Enter full name"
//               onChangeText={(v) => updateField('fullName', v)}
//               onBlur={() => blurField('fullName')}
//               error={errors.fullName}
//             />
//           ) : (
//             <ReadOnlyField icon="👤" value={form.fullName} placeholder="Not set" />
//           )}

//           <FieldLabel label="Mobile Number" required />
//           <ReadOnlyField icon="📱" value={form.mobile} placeholder="Not set" />
//           <Text style={styles.lockedHint}>Mobile number cannot be changed here. Contact support.</Text>

//           <FieldLabel label="Email Address" required />
//           <ReadOnlyField icon="✉️" value={form.email} placeholder="Not set" />
//           <Text style={styles.lockedHint}>Email cannot be changed here. Contact support.</Text>

//           <FieldLabel label="Date of Birth" />
//           {isEditing ? (
//             <EditableField
//               icon="🎂"
//               value={form.dateOfBirth}
//               placeholder="DD/MM/YYYY"
//               onChangeText={(v) => updateField('dateOfBirth', v)}
//               onBlur={() => blurField('dateOfBirth')}
//               keyboardType="numeric"
//               maxLength={10}
//               error={errors.dateOfBirth}
//             />
//           ) : (
//             <ReadOnlyField icon="🎂" value={form.dateOfBirth} placeholder="Not set" />
//           )}

//           <FieldLabel label="Gender" />
//           {isEditing ? (
//             <SelectField
//               icon="🧑"
//               value={form.gender}
//               placeholder="Select gender"
//               onPress={() => setGenderModal(true)}
//             />
//           ) : (
//             <ReadOnlyField icon="🧑" value={form.gender} placeholder="Not set" />
//           )}

//           <FieldLabel label="Blood Group" />
//           {isEditing ? (
//             <SelectField
//               icon="🩸"
//               value={form.bloodGroup}
//               placeholder="Select blood group"
//               onPress={() => setBloodModal(true)}
//             />
//           ) : (
//             <ReadOnlyField icon="🩸" value={form.bloodGroup} placeholder="Not set" />
//           )}
//         </View>

//         {/* ══ SECTION 2: Address ══════════════════════════════ */}
//         <SectionHeader title="Address" />

//         <View style={styles.card}>
//           <FieldLabel label="Area / Locality" />
//           {isEditing ? (
//             <EditableField
//               icon="📍"
//               value={form.area}
//               placeholder="e.g. Banjara Hills"
//               onChangeText={(v) => updateField('area', v)}
//             />
//           ) : (
//             <ReadOnlyField icon="📍" value={form.area} placeholder="Not set" />
//           )}

//           <FieldLabel label="City" />
//           {isEditing ? (
//             <EditableField
//               icon="🏙️"
//               value={form.city}
//               placeholder="e.g. Hyderabad"
//               onChangeText={(v) => updateField('city', v)}
//             />
//           ) : (
//             <ReadOnlyField icon="🏙️" value={form.city} placeholder="Not set" />
//           )}

//           <FieldLabel label="State" />
//           {isEditing ? (
//             <EditableField
//               icon="🗺️"
//               value={form.state}
//               placeholder="e.g. Telangana"
//               onChangeText={(v) => updateField('state', v)}
//             />
//           ) : (
//             <ReadOnlyField icon="🗺️" value={form.state} placeholder="Not set" />
//           )}

//           <FieldLabel label="PIN Code" />
//           {isEditing ? (
//             <EditableField
//               icon="📮"
//               value={form.pinCode}
//               placeholder="6-digit PIN code"
//               onChangeText={(v) => updateField('pinCode', v)}
//               onBlur={() => blurField('pinCode')}
//               keyboardType="numeric"
//               maxLength={6}
//               error={errors.pinCode}
//             />
//           ) : (
//             <ReadOnlyField icon="📮" value={form.pinCode} placeholder="Not set" />
//           )}
//         </View>

//         {/* ══ SECTION 3: Professional Details ════════════════ */}
//         <SectionHeader title="Professional Details" />

//         <View style={styles.card}>
//           <FieldLabel label="Years of Experience" />
//           {isEditing ? (
//             <EditableField
//               icon="💼"
//               value={form.experience}
//               placeholder="e.g. 3"
//               onChangeText={(v) => updateField('experience', v)}
//               keyboardType="numeric"
//               maxLength={2}
//             />
//           ) : (
//             <ReadOnlyField
//               icon="💼"
//               value={form.experience ? `${form.experience} Years` : ''}
//               placeholder="Not set"
//             />
//           )}

//           <FieldLabel label="About / Bio" />
//           {isEditing ? (
//             <>
//               <View style={[styles.inputWrap, { height: 90, alignItems: 'flex-start', paddingTop: 12 }]}>
//                 <TextInput
//                   style={[styles.inputText, { flex: 1 }]}
//                   value={form.bio}
//                   onChangeText={(v) => updateField('bio', v)}
//                   placeholder="Briefly describe your skills and experience…"
//                   placeholderTextColor="#E5E7EB"
//                   multiline
//                   numberOfLines={3}
//                   textAlignVertical="top"
//                   maxLength={300}
//                 />
//               </View>
//               <Text style={styles.charCount}>{form.bio.length}/300</Text>
//             </>
//           ) : (
//             <ReadOnlyField
//               icon="📝"
//               value={form.bio}
//               placeholder="Not set"
//             />
//           )}
//         </View>

//         {/* ══ SECTION 4: KYC Information ══════════════════════ */}
//         <SectionHeader title="KYC Information" />

//         <View style={styles.card}>
//           <FieldLabel label="Aadhaar Number" />
//           {isEditing ? (
//             <EditableField
//               icon="🪪"
//               value={form.aadhaarNumber}
//               placeholder="12-digit Aadhaar number"
//               onChangeText={(v) => updateField('aadhaarNumber', v)}
//               onBlur={() => blurField('aadhaarNumber')}
//               keyboardType="numeric"
//               maxLength={12}
//               error={errors.aadhaarNumber}
//             />
//           ) : (
//             <ReadOnlyField
//               icon="🪪"
//               value={form.aadhaarNumber ? '••••  ••••  ' + form.aadhaarNumber.slice(-4) : ''}
//               placeholder="Not set"
//             />
//           )}

//           {/* KYC status */}
//           {provider?.kycStatus && (
//             <>
//               <FieldLabel label="KYC Status" />
//               <View style={styles.inputWrap}>
//                 <Text style={styles.inputIcon}>
//                   {provider.kycStatus === 'VERIFIED' ? '✅' : provider.kycStatus === 'REJECTED' ? '❌' : '⏳'}
//                 </Text>
//                 <Text
//                   style={[
//                     styles.inputText,
//                     {
//                       color:
//                         provider.kycStatus === 'VERIFIED'
//                           ? GREEN
//                           : provider.kycStatus === 'REJECTED'
//                           ? ERROR_RED
//                           : '#FB923C',
//                       fontWeight: '700',
//                     },
//                   ]}
//                 >
//                   {provider.kycStatus === 'VERIFIED'
//                     ? 'Verified'
//                     : provider.kycStatus === 'REJECTED'
//                     ? 'Rejected — Re-upload required'
//                     : 'Pending Review'}
//                 </Text>
//               </View>
//             </>
//           )}
//         </View>

//         {/* ══ SECTION 5: Emergency Contact ════════════════════ */}
//         <SectionHeader title="Emergency Contact" />

//         <View style={styles.card}>
//           <FieldLabel label="Contact Name" />
//           {isEditing ? (
//             <EditableField
//               icon="👨‍👩‍👦"
//               value={form.emergencyName}
//               placeholder="e.g. Parent / Spouse name"
//               onChangeText={(v) => updateField('emergencyName', v)}
//             />
//           ) : (
//             <ReadOnlyField icon="👨‍👩‍👦" value={form.emergencyName} placeholder="Not set" />
//           )}

//           <FieldLabel label="Contact Number" />
//           {isEditing ? (
//             <EditableField
//               icon="📞"
//               value={form.emergencyContact}
//               placeholder="10-digit mobile number"
//               onChangeText={(v) => updateField('emergencyContact', v)}
//               keyboardType="phone-pad"
//               maxLength={10}
//             />
//           ) : (
//             <ReadOnlyField icon="📞" value={form.emergencyContact} placeholder="Not set" />
//           )}
//         </View>

//         {/* ── Save button ──────────────────────────────────── */}
//         {isEditing && (
//           <TouchableOpacity
//             style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
//             onPress={handleSave}
//             disabled={saving}
//             activeOpacity={0.85}
//           >
//             {saving ? (
//               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
//                 <ActivityIndicator color="#FFFFFF" size="small" />
//                 <Text style={styles.saveBtnText}>Saving…</Text>
//               </View>
//             ) : (
//               <Text style={styles.saveBtnText}>💾  Save Changes</Text>
//             )}
//           </TouchableOpacity>
//         )}

//         <View style={{ height: 32 }} />
//       </ScrollView>

//       {/* ── Dropdown modals ─────────────────────────────────── */}
//       <DropdownModal
//         visible={genderModal}
//         title="Select Gender"
//         options={GENDER_OPTIONS}
//         selected={form.gender}
//         onSelect={(v) => updateField('gender', v)}
//         onClose={() => setGenderModal(false)}
//       />
//       <DropdownModal
//         visible={bloodModal}
//         title="Select Blood Group"
//         options={BLOOD_GROUP_OPTIONS}
//         selected={form.bloodGroup}
//         onSelect={(v) => updateField('bloodGroup', v)}
//         onClose={() => setBloodModal(false)}
//       />
//     </SafeAreaView>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: '#1E3A8A' },

//   // ── Loading ────────────────────────────────────────────────
//   loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
//   loadingText: { color: GREY, fontSize: 14 },

//   // ── Header ────────────────────────────────────────────────
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     backgroundColor: '#1E3A8A',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//     elevation: 2,
//   },
//   headerBtn: { minWidth: 60, alignItems: 'center' },
//   headerTitle: { fontSize: 17, fontWeight: '700', color: DARK },
//   cancelText: { color: ERROR_RED, fontWeight: '700', fontSize: 14 },
//   editBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: LIGHT_GREEN,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     gap: 4,
//   },
//   editBtnText: { color: GREEN, fontWeight: '700', fontSize: 13 },

//   // ── Scroll ────────────────────────────────────────────────
//   scroll: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 },

//   // ── Avatar card ───────────────────────────────────────────
//   avatarCard: {
//     backgroundColor: '#1E3A8A',
//     borderRadius: 16,
//     padding: 24,
//     alignItems: 'center',
//     marginBottom: 16,
//     elevation: 2,
//   },
//   avatarCircle: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: LIGHT_GREEN,
//     borderWidth: 3,
//     borderColor: GREEN,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 12,
//   },
//   avatarText: { fontSize: 30, fontWeight: '900', color: GREEN },
//   avatarName: { fontSize: 20, fontWeight: '800', color: DARK, marginBottom: 8 },
//   activeBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     backgroundColor: LIGHT_GREEN,
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 20,
//   },
//   activeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: GREEN },
//   activeBadgeText: { color: GREEN, fontSize: 12, fontWeight: '700' },
//   editingNote: {
//     marginTop: 10,
//     color: '#FB923C',
//     fontSize: 12,
//     fontWeight: '600',
//     backgroundColor: '#1E3A8A',
//     paddingHorizontal: 12,
//     paddingVertical: 5,
//     borderRadius: 20,
//   },

//   // ── Section header ────────────────────────────────────────
//   sectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 8,
//     marginTop: 4,
//   },
//   sectionDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: GREEN,
//   },
//   sectionTitle: {
//     fontSize: 12,
//     fontWeight: '800',
//     color: GREEN,
//     textTransform: 'uppercase',
//     letterSpacing: 0.8,
//   },

//   // ── Card ──────────────────────────────────────────────────
//   card: {
//     backgroundColor: '#1E3A8A',
//     borderRadius: 14,
//     paddingHorizontal: 16,
//     paddingTop: 16,
//     paddingBottom: 8,
//     marginBottom: 16,
//     elevation: 2,
//   },

//   // ── Field label ───────────────────────────────────────────
//   fieldLabel: {
//     fontSize: 11,
//     fontWeight: '700',
//     color: GREY,
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//     marginBottom: 6,
//     marginTop: 4,
//   },

//   // ── Input wrap ────────────────────────────────────────────
//   inputWrap: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: INPUT_BG,
//     borderWidth: 1,
//     borderColor: BORDER,
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     minHeight: 48,
//     marginBottom: 12,
//     gap: 10,
//   },
//   readOnlyWrap: { backgroundColor: '#1E3A8A' },
//   inputWrapError: { borderColor: ERROR_RED, backgroundColor: '#1E3A8A' },
//   inputIcon: { fontSize: 16 },
//   inputText: {
//     flex: 1,
//     fontSize: 14,
//     color: DARK,
//     fontWeight: '500',
//   },
//   lockedBadge: {
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 8,
//   },
//   lockedText: { fontSize: 12 },
//   lockedHint: {
//     fontSize: 11,
//     color: '#FB923C',
//     marginTop: -8,
//     marginBottom: 12,
//     marginLeft: 2,
//     fontStyle: 'italic',
//   },

//   // ── Errors & counters ─────────────────────────────────────
//   fieldError: {
//     color: ERROR_RED,
//     fontSize: 11,
//     fontWeight: '600',
//     marginTop: -8,
//     marginBottom: 10,
//     marginLeft: 2,
//   },
//   charCount: {
//     fontSize: 11,
//     color: '#FB923C',
//     textAlign: 'right',
//     marginTop: -10,
//     marginBottom: 10,
//   },

//   // ── Save button ───────────────────────────────────────────
//   saveBtn: {
//     backgroundColor: GREEN,
//     borderRadius: 14,
//     paddingVertical: 16,
//     alignItems: 'center',
//     marginTop: 8,
//     elevation: 3,
//   },
//   saveBtnDisabled: { opacity: 0.6 },
//   saveBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },

//   // ── Modal ────────────────────────────────────────────────
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.45)',
//     justifyContent: 'flex-end',
//   },
//   modalSheet: {
//     backgroundColor: '#1E3A8A',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     paddingHorizontal: 16,
//     paddingBottom: 32,
//     maxHeight: '60%',
//   },
//   modalHandle: {
//     width: 40,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: '#1E3A8A',
//     alignSelf: 'center',
//     marginVertical: 12,
//   },
//   modalTitle: {
//     fontSize: 16,
//     fontWeight: '800',
//     color: DARK,
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   modalOption: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//     borderRadius: 8,
//   },
//   modalOptionSelected: { backgroundColor: LIGHT_GREEN },
//   modalOptionText: { fontSize: 15, color: DARK, fontWeight: '500' },
//   modalOptionTextSelected: { color: GREEN, fontWeight: '700' },
// });
























import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { providerApi } from '../api/providerApi';

const GREEN = '#22C55E';
const LIGHT_GREEN = '#DCFCE7';
const PRIMARY = '#4F46E5';
const DARK = '#1E1B4B';
const GREY = '#6B7280';
const BORDER = '#E5E7EB';
const INPUT_BG = '#EEF2FF';
const CARD = '#FFFFFF';
const BG = '#F8F9FC';
const ERROR_RED = '#FB923C';

const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const BLOOD_GROUP_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Unknown'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Add this constant OUTSIDE the component, at the top of PersonalInformationScreen.js
// (copy from SelectServicesScreen.js — same data)
const CATEGORY_SUB_SKILLS = {
  'Household': [
    'Deep Cleaning', 'Home Chef', 'Maid', 'Laundry',
    'Water Tank Cleaning', 'Pool Cleaning', 'Ironing Service', 'Sofa / Carpet Cleaning',
  ],
  'Repairs': [
    'Electrician', 'Plumber', 'AC Repair', 'Handyman', 'Carpenter',
    'Painting', 'Furniture Assembly', 'Home Renovation',
    'Tiling', 'Roofing', 'Glass / Window Fitting', 'Waterproofing',
  ],
  'Personal Care': [
    'Salon at Home', 'Beautician', 'Massage Therapy', 'Mehendi Artist', 'Makeup Artist',
  ],
  'Healthcare': [
    'Doctor Visit', 'Home Nurse', 'Physiotherapy',
    'Lab Test at Home', 'Elder Care', 'Baby Care / Nanny',
  ],
  'Transport': ['Driver', 'Car Wash', 'Shifting / Moving'],
  'Pet & Lifestyle': ['Pet Training'],
  'Tech & Support': [
    'WiFi Setup', 'CCTV Installation', 'Security Services', 'Computer / Laptop Repair',
  ],
  'Events': [
    'Birthday Decorations', 'Event Photography', 'Catering Services',
    'Party Planner', 'Tent House / Mandap', 'DJ / Sound System',
  ],
  'Outdoor & Safety': [
    'Gardening', 'Pest Control', 'Sewage Treatment',
    'Borewell Service', 'Solar Panel Installation',
  ],
  'Pool Cleaning': ['Swimming Pool Cleaning', 'Pool Maintenance'],
};

// Add this constant (same CATEGORY_SUB_SKILLS map you already have)
// Then add this helper function:

function normalizeSavedSkills(skills) {
  if (!skills || skills.length === 0) return [];

  return skills.map(skill => {
    // Already in "Category > Sub-skill" format — keep as-is
    if (skill.includes(' > ')) return skill;

    // Flat format from registration — find which category it belongs to
    for (const [category, subSkills] of Object.entries(CATEGORY_SUB_SKILLS)) {
      if (subSkills.includes(skill)) {
        return `${category} > ${skill}`;
      }
    }

    // Unknown skill — keep as-is under Other
    return skill;
  });
}

// ─────────────────────────────────────────────────────────────
// SKILLS EDIT MODAL
// Fetches categories + sub-skills from /api/provider/categories
// Saves selections as "Category > Sub-skill" strings
// ─────────────────────────────────────────────────────────────
function SkillsEditModal({ visible, currentSkills, onSave, onClose }) {
  const [selected, setSelected] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [catError, setCatError] = useState('');

  useEffect(() => {
    if (!visible) return;
    setSelected(currentSkills ? [...currentSkills] : []);
    fetchCategories();
  }, [visible]);

  const fetchCategories = async () => {
    setLoadingCats(true);
    setCatError('');
    try {
      const res = await providerApi.getCategories();
      if (res?.data && Array.isArray(res.data)) {
        // ✅ Merge API categories with local sub-skills by matching title
        const enriched = res.data.map(cat => ({
          ...cat,
          subSkills: CATEGORY_SUB_SKILLS[cat.title] || [],
        }));
        setCategories(enriched);
      } else {
        setCatError('Could not load categories. Please try again.');
      }
    } catch (e) {
      setCatError('Network error. Check your connection.');
    } finally {
      setLoadingCats(false);
    }
  };

  const toggleSkill = (categoryTitle, subSkill) => {
    const key = `${categoryTitle} > ${subSkill}`;
    setSelected(prev =>
      prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]
    );
  };

  const isSubSelected = (categoryTitle, subSkill) =>
    selected.includes(`${categoryTitle} > ${subSkill}`);

  const selectedCountFor = (categoryTitle) =>
    selected.filter(s => s.startsWith(`${categoryTitle} > `)).length;

  const handleSelectAll = (category) => {
    const keys = (category.subSkills || []).map(s => `${category.title} > ${s}`);
    const allSelected = keys.length > 0 && keys.every(k => selected.includes(k));
    if (allSelected) {
      setSelected(prev => prev.filter(s => !s.startsWith(`${category.title} > `)));
    } else {
      setSelected(prev => {
        const without = prev.filter(s => !s.startsWith(`${category.title} > `));
        return [...without, ...keys];
      });
    }
  };

  const handleSave = () => {
    if (selected.length === 0) {
      Alert.alert('Select Skills', 'Please select at least one skill.');
      return;
    }
    onSave(selected);
    onClose();
  };

  const renderCategoryGroup = ({ item: category }) => {
    const count = selectedCountFor(category.title);
    const allSelected = count > 0 && count === (category.subSkills || []).length;

    return (
      <View style={skillStyles.categoryGroup}>
        {/* Category header */}
        <View style={skillStyles.categoryHeader}>
          <Text style={skillStyles.categoryIcon}>{category.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={skillStyles.categoryTitle}>{category.title}</Text>
            <Text style={skillStyles.categoryDesc} numberOfLines={1}>
              {category.description}
            </Text>
          </View>
          <TouchableOpacity
            style={[skillStyles.selectAllBtn, allSelected && skillStyles.selectAllBtnActive]}
            onPress={() => handleSelectAll(category)}
          >
            <Text style={[skillStyles.selectAllText, allSelected && skillStyles.selectAllTextActive]}>
              {allSelected ? '✓ All' : 'All'}
            </Text>
          </TouchableOpacity>
          {count > 0 && (
            <View style={skillStyles.countBadge}>
              <Text style={skillStyles.countBadgeText}>{count}</Text>
            </View>
          )}
        </View>

        {/* Sub-skill chips */}
        <View style={skillStyles.subSkillsWrap}>
          {(category.subSkills || []).map((sub) => {
            const sel = isSubSelected(category.title, sub);
            return (
              <TouchableOpacity
                key={sub}
                style={[skillStyles.subChip, sel && skillStyles.subChipSelected]}
                onPress={() => toggleSkill(category.title, sub)}
                activeOpacity={0.75}
              >
                {sel && <Text style={skillStyles.subChipCheck}>✓ </Text>}
                <Text style={[skillStyles.subChipText, sel && skillStyles.subChipTextSelected]}>
                  {sub}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={skillStyles.overlay}>
        <View style={skillStyles.modalSheet}>
          <View style={mainStyles.modalHandle} />

          {/* Header */}
          <View style={skillStyles.modalHeader}>
            <View style={{ flex: 1 }}>
              <Text style={skillStyles.modalTitle}>Edit Skills & Services</Text>
              <Text style={skillStyles.modalSubtitle}>
                {selected.length} skill{selected.length !== 1 ? 's' : ''} selected
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={skillStyles.closeBtn}>
              <Text style={skillStyles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Body */}
          {loadingCats ? (
            <View style={skillStyles.centerState}>
              <ActivityIndicator size="large" color={GREEN} />
              <Text style={skillStyles.centerStateText}>Loading services…</Text>
            </View>
          ) : catError ? (
            <View style={skillStyles.centerState}>
              <Text style={{ fontSize: 32, marginBottom: 10 }}>⚠️</Text>
              <Text style={skillStyles.errorText}>{catError}</Text>
              <TouchableOpacity style={skillStyles.retryBtn} onPress={fetchCategories}>
                <Text style={skillStyles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={categories}
              keyExtractor={item => String(item.id)}
              renderItem={renderCategoryGroup}
              contentContainerStyle={{ paddingBottom: 8 }}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={skillStyles.separator} />}
            />
          )}

          {/* Footer */}
          {!loadingCats && !catError && (
            <View style={skillStyles.footer}>
              <TouchableOpacity
                style={skillStyles.clearBtn}
                onPress={() => setSelected([])}
              >
                <Text style={skillStyles.clearBtnText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[skillStyles.saveBtn, selected.length === 0 && { opacity: 0.45 }]}
                onPress={handleSave}
                disabled={selected.length === 0}
              >
                <Text style={skillStyles.saveBtnText}>
                  Save {selected.length > 0 ? `(${selected.length})` : ''}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// CALENDAR COMPONENT
// ─────────────────────────────────────────────────────────────
function CalendarPicker({ visible, selectedDate, onSelect, onClose }) {
  const today = new Date();

  const parseDate = (str) => {
    if (!str) return null;
    const parts = str.split('/');
    if (parts.length === 3)
      return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    return null;
  };

  const initDate = parseDate(selectedDate) || new Date(2000, 0, 1);
  const [viewYear, setViewYear] = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth());
  const [mode, setMode] = useState('day');
  const selected = parseDate(selectedDate);

  const getDays = () => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  };

  const handleDayPress = (day) => {
    if (!day) return;
    const dd = String(day).padStart(2, '0');
    const mm = String(viewMonth + 1).padStart(2, '0');
    onSelect(`${dd}/${mm}/${viewYear}`);
    onClose();
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const isSelected = (day) =>
    selected && day &&
    selected.getDate() === day &&
    selected.getMonth() === viewMonth &&
    selected.getFullYear() === viewYear;

  const isFuture = (day) =>
    day && new Date(viewYear, viewMonth, day) > today;

  const years = [];
  for (let y = today.getFullYear(); y >= 1950; y--) years.push(y);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={mainStyles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={mainStyles.calendarSheet}>
          <View style={mainStyles.modalHandle} />
          <Text style={mainStyles.calendarTitle}>Select Date of Birth</Text>

          {mode === 'day' && (
            <>
              <View style={mainStyles.calNavRow}>
                <TouchableOpacity onPress={prevMonth} style={mainStyles.calNavBtn}>
                  <Text style={mainStyles.calNavArrow}>‹</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity onPress={() => setMode('month')}>
                    <Text style={mainStyles.calNavLabel}>{MONTHS[viewMonth]}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setMode('year')}>
                    <Text style={mainStyles.calNavLabel}>{viewYear}</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={nextMonth} style={mainStyles.calNavBtn}>
                  <Text style={mainStyles.calNavArrow}>›</Text>
                </TouchableOpacity>
              </View>
              <View style={mainStyles.calDayHeaders}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                  <Text key={d} style={mainStyles.calDayHeader}>{d}</Text>
                ))}
              </View>
              <View style={mainStyles.calGrid}>
                {getDays().map((day, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      mainStyles.calDayCell,
                      isSelected(day) && mainStyles.calDaySelected,
                      isFuture(day) && mainStyles.calDayFuture,
                    ]}
                    onPress={() => !isFuture(day) && handleDayPress(day)}
                    disabled={!day || isFuture(day)}
                  >
                    <Text style={[
                      mainStyles.calDayText,
                      isSelected(day) && mainStyles.calDayTextSelected,
                      isFuture(day) && mainStyles.calDayTextFuture,
                      !day && { opacity: 0 },
                    ]}>
                      {day || ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {mode === 'month' && (
            <>
              <Text style={mainStyles.calPickerYear}>{viewYear}</Text>
              <View style={mainStyles.calMonthGrid}>
                {MONTHS.map((m, i) => (
                  <TouchableOpacity
                    key={m}
                    style={[mainStyles.calMonthCell, viewMonth === i && mainStyles.calMonthSelected]}
                    onPress={() => { setViewMonth(i); setMode('day'); }}
                  >
                    <Text style={[mainStyles.calMonthText, viewMonth === i && mainStyles.calMonthTextSelected]}>
                      {m.slice(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {mode === 'year' && (
            <FlatList
              data={years}
              keyExtractor={y => String(y)}
              style={{ maxHeight: 280 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[mainStyles.calYearItem, viewYear === item && mainStyles.calYearSelected]}
                  onPress={() => { setViewYear(item); setMode('day'); }}
                >
                  <Text style={[mainStyles.calYearText, viewYear === item && mainStyles.calYearTextSelected]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}

          <TouchableOpacity style={mainStyles.calCancelBtn} onPress={onClose}>
            <Text style={mainStyles.calCancelText}>Cancel</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// DROPDOWN MODAL
// ─────────────────────────────────────────────────────────────
function DropdownModal({ visible, title, options, selected, onSelect, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={mainStyles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={mainStyles.modalSheet}>
          <View style={mainStyles.modalHandle} />
          <Text style={mainStyles.modalTitle}>{title}</Text>
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[mainStyles.modalOption, selected === item && mainStyles.modalOptionSelected]}
                onPress={() => { onSelect(item); onClose(); }}
              >
                <Text style={[mainStyles.modalOptionText, selected === item && mainStyles.modalOptionTextSelected]}>
                  {item}
                </Text>
                {selected === item && <Text style={{ color: GREEN, fontSize: 18 }}>✓</Text>}
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// FIELD COMPONENTS
// ─────────────────────────────────────────────────────────────
function SectionHeader({ title }) {
  return (
    <View style={mainStyles.sectionHeader}>
      <View style={mainStyles.sectionDot} />
      <Text style={mainStyles.sectionTitle}>{title}</Text>
    </View>
  );
}

function FieldLabel({ label, required }) {
  return (
    <Text style={mainStyles.fieldLabel}>
      {label}{required && <Text style={{ color: ERROR_RED }}> *</Text>}
    </Text>
  );
}

function ReadOnlyField({ icon, value, placeholder }) {
  return (
    <View style={[mainStyles.inputWrap, mainStyles.readOnlyWrap]}>
      {icon ? <Text style={mainStyles.inputIcon}>{icon}</Text> : null}
      <Text style={[mainStyles.inputText, !value && { color: '#E5E7EB' }]}>
        {value || placeholder}
      </Text>
      <Text style={{ fontSize: 13 }}>🔒</Text>
    </View>
  );
}

function EditableField({ icon, value, placeholder, onChangeText, onBlur, keyboardType, maxLength, error }) {
  return (
    <>
      <View style={[mainStyles.inputWrap, error ? mainStyles.inputWrapError : null]}>
        {icon ? <Text style={mainStyles.inputIcon}>{icon}</Text> : null}
        <TextInput
          style={mainStyles.inputText}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor="#E5E7EB"
          keyboardType={keyboardType || 'default'}
          maxLength={maxLength}
        />
      </View>
      {error ? <Text style={mainStyles.fieldError}>{error}</Text> : null}
    </>
  );
}

function SelectField({ icon, value, placeholder, onPress }) {
  return (
    <TouchableOpacity style={mainStyles.inputWrap} onPress={onPress} activeOpacity={0.8}>
      {icon ? <Text style={mainStyles.inputIcon}>{icon}</Text> : null}
      <Text style={[mainStyles.inputText, !value && { color: '#E5E7EB' }]}>
        {value || placeholder}
      </Text>
      <Text style={{ color: GREY, fontSize: 18 }}>›</Text>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────
// SKILLS DISPLAY
// Parses "Category > Sub-skill" and renders grouped chips
// ─────────────────────────────────────────────────────────────
function SkillsDisplay({ skills, isEditing, onEditPress }) {
  // Group by category prefix
  const grouped = {};
  (skills || []).forEach(s => {
    const idx = s.indexOf(' > ');
    if (idx !== -1) {
      const cat = s.slice(0, idx);
      const sub = s.slice(idx + 3);
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(sub);
    } else {
      if (!grouped['Other']) grouped['Other'] = [];
      grouped['Other'].push(s);
    }
  });

  const groupKeys = Object.keys(grouped);

  if (groupKeys.length === 0) {
    return (
      <View style={mainStyles.skillsEmptyWrap}>
        <Text style={mainStyles.skillsEmptyIcon}>🛠️</Text>
        <Text style={mainStyles.skillsEmptyText}>No skills added yet</Text>
        {isEditing && (
          <TouchableOpacity style={mainStyles.skillsAddFirstBtn} onPress={onEditPress}>
            <Text style={mainStyles.skillsAddFirstText}>+ Add Skills</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={mainStyles.skillsFieldWrap}>
      {groupKeys.map(cat => (
        <View key={cat} style={mainStyles.skillGroupBlock}>
          <Text style={mainStyles.skillGroupLabel}>{cat}</Text>
          <View style={mainStyles.skillChipsWrap}>
            {grouped[cat].map(sub => (
              <View key={sub} style={mainStyles.skillChip}>
                <Text style={mainStyles.skillChipText}>{sub}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      {isEditing && (
        <TouchableOpacity
          style={mainStyles.skillsEditTrigger}
          onPress={onEditPress}
          activeOpacity={0.8}
        >
          <Text style={mainStyles.skillsEditTriggerIcon}>✏️</Text>
          <Text style={mainStyles.skillsEditTriggerText}>Edit Skills & Services</Text>
          <Text style={mainStyles.skillsEditTriggerChevron}>›</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────
function validateField(key, value) {
  switch (key) {
    case 'fullName':
      if (!value.trim()) return 'Full name is required.';
      if (value.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    case 'pinCode':
      if (value && !/^\d{6}$/.test(value)) return 'Enter a valid 6-digit PIN code.';
      return '';
    case 'aadhaarNumber':
      if (value && !/^\d{12}$/.test(value.replace(/\s/g, '')))
        return 'Aadhaar must be 12 digits.';
      return '';
    default:
      return '';
  }
}

// ─────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────
export default function PersonalInformationScreen({ navigation }) {
  const [provider, setProviderState] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [genderModal, setGenderModal] = useState(false);
  const [bloodModal, setBloodModal] = useState(false);
  const [calendarModal, setCalendarModal] = useState(false);
  const [skillsModal, setSkillsModal] = useState(false);

  const [form, setForm] = useState({
    fullName: '', mobile: '', email: '',
    dateOfBirth: '', gender: '', bloodGroup: '',
    area: '', city: '', state: '', pinCode: '',
    aadhaarNumber: '', bio: '',
    emergencyContact: '', emergencyName: '', experience: '',
    skills: [],
  });

  useEffect(() => {
    const load = async () => {
      try {
        const p = await providerApi.getProvider();
        if (p) {
          setProviderState(p);
          setForm({
            fullName: p.fullName || '',
            mobile: p.mobile || '',
            email: p.email || '',
            dateOfBirth: p.dateOfBirth || '',
            gender: p.gender || '',
            bloodGroup: p.bloodGroup || '',
            area: p.area || '',
            city: p.city || '',
            state: p.state || '',
            pinCode: p.pinCode || '',
            aadhaarNumber: p.aadhaarNumber || '',
            bio: p.bio || '',
            emergencyContact: p.emergencyContact || '',
            emergencyName: p.emergencyName || '',
            experience: p.experienceYears ? String(p.experienceYears) : '',
            skills: normalizeSavedSkills(p.skills || []),
          });
        }
      } catch (e) {
        console.log('Load error:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const blurField = (key) => {
    const err = validateField(key, form[key]);
    setErrors(prev => ({ ...prev, [key]: err }));
  };

  const validateAll = () => {
    const keys = ['fullName', 'pinCode', 'aadhaarNumber'];
    const newErrors = {};
    let hasError = false;
    keys.forEach(k => {
      const err = validateField(k, form[k]);
      newErrors[k] = err;
      if (err) hasError = true;
    });
    setErrors(newErrors);
    return !hasError;
  };

  const handleSave = async () => {
    if (!validateAll()) return;
    setSaving(true);

    const payload = {
      fullName: form.fullName.trim(),
      area: form.area.trim(),
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      bloodGroup: form.bloodGroup,
      city: form.city.trim(),
      state: form.state.trim(),
      pinCode: form.pinCode.trim(),
      bio: form.bio.trim(),
      emergencyContact: form.emergencyContact.trim(),
      emergencyName: form.emergencyName.trim(),
      aadhaarNumber: form.aadhaarNumber.trim(),
      experienceYears: form.experience ? parseInt(form.experience) : undefined,
      skills: form.skills.map(s => {
        const idx = s.indexOf(' > ');
        return idx !== -1 ? s.slice(idx + 3) : s;
      }),
    };

    try {
      const response = await providerApi.updateProfile(payload);
      // Use the fresh data returned by the server
      const updatedProvider = response?.data || { ...payload };
      setProviderState(prev => ({ ...prev, ...updatedProvider }));
      setIsEditing(false);
      Alert.alert('✅ Saved', 'Your profile has been updated successfully.');
    } catch (err) {
      Alert.alert('Error', err?.message || 'Could not save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (provider) {
      setForm({
        fullName: provider.fullName || '',
        mobile: provider.mobile || '',
        email: provider.email || '',
        dateOfBirth: provider.dateOfBirth || '',
        gender: provider.gender || '',
        bloodGroup: provider.bloodGroup || '',
        area: provider.area || '',
        city: provider.city || '',
        state: provider.state || '',
        pinCode: provider.pinCode || '',
        aadhaarNumber: provider.aadhaarNumber || '',
        bio: provider.bio || '',
        emergencyContact: provider.emergencyContact || '',
        emergencyName: provider.emergencyName || '',
        experience: provider.experienceYears ? String(provider.experienceYears) : '',
        skills: normalizeSavedSkills(provider.skills || []),
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  const initials = provider?.initials ||
    (form.fullName
      ? form.fullName.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
      : '?');

  if (loading) {
    return (
      <SafeAreaView style={mainStyles.safe}>
        <View style={mainStyles.loadingWrap}>
          <ActivityIndicator size="large" color={GREEN} />
          <Text style={mainStyles.loadingText}>Loading profile…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={mainStyles.safe}>

      {/* Header */}
      <View style={mainStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={mainStyles.headerBtn}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={mainStyles.headerTitle}>Personal Information</Text>
        {isEditing ? (
          <TouchableOpacity onPress={handleCancel} style={mainStyles.headerBtn}>
            <Text style={mainStyles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)} style={mainStyles.headerBtn}>
            <View style={mainStyles.editBtn}>
              <Text style={mainStyles.editBtnText}>✏️ Edit</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        contentContainerStyle={mainStyles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar card */}
        <View style={mainStyles.avatarCard}>
          <View style={mainStyles.avatarCircle}>
            <Text style={mainStyles.avatarText}>{initials}</Text>
          </View>
          <Text style={mainStyles.avatarName}>{form.fullName || 'Provider'}</Text>
          {provider?.status === 'ACTIVE' && (
            <View style={mainStyles.activeBadge}>
              <View style={mainStyles.activeDot} />
              <Text style={mainStyles.activeBadgeText}>Active</Text>
            </View>
          )}
          {isEditing && (
            <Text style={mainStyles.editingNote}>✏️ Editing — tap Save Changes when done</Text>
          )}
        </View>

        {/* ── Basic Information ── */}
        <SectionHeader title="Basic Information" />
        <View style={mainStyles.card}>
          <FieldLabel label="Full Name" required />
          {isEditing ? (
            <EditableField icon="👤" value={form.fullName} placeholder="Enter full name"
              onChangeText={v => updateField('fullName', v)}
              onBlur={() => blurField('fullName')} error={errors.fullName} />
          ) : (
            <ReadOnlyField icon="👤" value={form.fullName} placeholder="Not set" />
          )}

          <FieldLabel label="Mobile Number" />
          <ReadOnlyField icon="📱" value={form.mobile} placeholder="Not set" />
          <Text style={mainStyles.lockedHint}>Contact support to change mobile number.</Text>

          <FieldLabel label="Email Address" />
          <ReadOnlyField icon="✉️" value={form.email} placeholder="Not set" />
          <Text style={mainStyles.lockedHint}>Contact support to change email address.</Text>

          <FieldLabel label="Date of Birth" />
          {isEditing ? (
            <SelectField icon="🎂" value={form.dateOfBirth}
              placeholder="Select date of birth"
              onPress={() => setCalendarModal(true)} />
          ) : (
            <ReadOnlyField icon="🎂" value={form.dateOfBirth} placeholder="Not set" />
          )}

          <FieldLabel label="Gender" />
          {isEditing ? (
            <SelectField icon="🧑" value={form.gender} placeholder="Select gender"
              onPress={() => setGenderModal(true)} />
          ) : (
            <ReadOnlyField icon="🧑" value={form.gender} placeholder="Not set" />
          )}

          <FieldLabel label="Blood Group" />
          {isEditing ? (
            <SelectField icon="🩸" value={form.bloodGroup} placeholder="Select blood group"
              onPress={() => setBloodModal(true)} />
          ) : (
            <ReadOnlyField icon="🩸" value={form.bloodGroup} placeholder="Not set" />
          )}
        </View>

        {/* ── Address ── */}
        <SectionHeader title="Address" />
        <View style={mainStyles.card}>
          <FieldLabel label="Area / Locality" />
          {isEditing ? (
            <EditableField icon="📍" value={form.area} placeholder="e.g. Banjara Hills"
              onChangeText={v => updateField('area', v)} />
          ) : (
            <ReadOnlyField icon="📍" value={form.area} placeholder="Not set" />
          )}

          <FieldLabel label="City" />
          {isEditing ? (
            <EditableField icon="🏙️" value={form.city} placeholder="e.g. Hyderabad"
              onChangeText={v => updateField('city', v)} />
          ) : (
            <ReadOnlyField icon="🏙️" value={form.city} placeholder="Not set" />
          )}

          <FieldLabel label="State" />
          {isEditing ? (
            <EditableField icon="🗺️" value={form.state} placeholder="e.g. Telangana"
              onChangeText={v => updateField('state', v)} />
          ) : (
            <ReadOnlyField icon="🗺️" value={form.state} placeholder="Not set" />
          )}

          <FieldLabel label="PIN Code" />
          {isEditing ? (
            <EditableField icon="📮" value={form.pinCode} placeholder="6-digit PIN"
              onChangeText={v => updateField('pinCode', v)}
              onBlur={() => blurField('pinCode')}
              keyboardType="numeric" maxLength={6} error={errors.pinCode} />
          ) : (
            <ReadOnlyField icon="📮" value={form.pinCode} placeholder="Not set" />
          )}
        </View>

        {/* ── Professional Details ── */}
        <SectionHeader title="Professional Details" />
        <View style={mainStyles.card}>
          <FieldLabel label="Years of Experience" />
          {isEditing ? (
            <EditableField icon="💼" value={form.experience} placeholder="e.g. 3"
              onChangeText={v => updateField('experience', v)}
              keyboardType="numeric" maxLength={2} />
          ) : (
            <ReadOnlyField icon="💼"
              value={form.experience ? `${form.experience} Years` : ''}
              placeholder="Not set" />
          )}

          <FieldLabel label="About / Bio" />
          {isEditing ? (
            <>
              <View style={[mainStyles.inputWrap, { height: 90, alignItems: 'flex-start', paddingTop: 12 }]}>
                <TextInput
                  style={[mainStyles.inputText, { flex: 1 }]}
                  value={form.bio}
                  onChangeText={v => updateField('bio', v)}
                  placeholder="Briefly describe your skills and experience…"
                  placeholderTextColor="#E5E7EB"
                  multiline numberOfLines={3}
                  textAlignVertical="top" maxLength={300}
                />
              </View>
              <Text style={mainStyles.charCount}>{form.bio.length}/300</Text>
            </>
          ) : (
            <ReadOnlyField icon="📝" value={form.bio} placeholder="Not set" />
          )}

          {/* ── Skills / Services ── */}
          <FieldLabel label="Skills / Services" />

          {isEditing && (
            <View style={mainStyles.skillsInfoBanner}>
              <Text style={mainStyles.skillsInfoIcon}>💡</Text>
              <Text style={mainStyles.skillsInfoText}>
                Select the specific services you offer. Customers discover you through these.
              </Text>
            </View>
          )}

          <SkillsDisplay
            skills={form.skills}
            isEditing={isEditing}
            onEditPress={() => setSkillsModal(true)}
          />
        </View>

        {/* ── KYC Information ── */}
        <SectionHeader title="KYC Information" />
        <View style={mainStyles.card}>
          <FieldLabel label="Aadhaar Number" />
          {isEditing ? (
            <EditableField icon="🪪" value={form.aadhaarNumber}
              placeholder="12-digit Aadhaar number"
              onChangeText={v => updateField('aadhaarNumber', v)}
              onBlur={() => blurField('aadhaarNumber')}
              keyboardType="numeric" maxLength={12} error={errors.aadhaarNumber} />
          ) : (
            <ReadOnlyField icon="🪪"
              value={form.aadhaarNumber
                ? '••••  ••••  ' + form.aadhaarNumber.replace(/\s/g, '').slice(-4)
                : ''}
              placeholder="Not set" />
          )}

          <FieldLabel label="KYC Status" />
          <View style={mainStyles.inputWrap}>
            <Text style={mainStyles.inputIcon}>
              {provider?.kycStatus === 'VERIFIED' ? '✅'
                : provider?.kycStatus === 'REJECTED' ? '❌' : '⏳'}
            </Text>
            <Text style={[mainStyles.inputText, {
              color: provider?.kycStatus === 'VERIFIED' ? GREEN
                : provider?.kycStatus === 'REJECTED' ? ERROR_RED : '#FB923C',
              fontWeight: '700',
            }]}>
              {provider?.kycStatus === 'VERIFIED' ? 'Verified'
                : provider?.kycStatus === 'REJECTED' ? 'Rejected — Re-upload required'
                  : 'Pending Review'}
            </Text>
          </View>
        </View>

        {/* ── Emergency Contact ── */}
        <SectionHeader title="Emergency Contact" />
        <View style={mainStyles.card}>
          <FieldLabel label="Contact Name" />
          {isEditing ? (
            <EditableField icon="👨‍👩‍👦" value={form.emergencyName}
              placeholder="e.g. Parent / Spouse name"
              onChangeText={v => updateField('emergencyName', v)} />
          ) : (
            <ReadOnlyField icon="👨‍👩‍👦" value={form.emergencyName} placeholder="Not set" />
          )}

          <FieldLabel label="Contact Number" />
          {isEditing ? (
            <EditableField icon="📞" value={form.emergencyContact}
              placeholder="10-digit mobile number"
              onChangeText={v => updateField('emergencyContact', v)}
              keyboardType="phone-pad" maxLength={10} />
          ) : (
            <ReadOnlyField icon="📞" value={form.emergencyContact} placeholder="Not set" />
          )}
        </View>

        {/* Save button */}
        {isEditing && (
          <TouchableOpacity
            style={[mainStyles.saveBtn, saving && mainStyles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={mainStyles.saveBtnText}>Saving…</Text>
              </View>
            ) : (
              <Text style={mainStyles.saveBtnText}>💾  Save Changes</Text>
            )}
          </TouchableOpacity>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Modals */}
      <CalendarPicker
        visible={calendarModal}
        selectedDate={form.dateOfBirth}
        onSelect={date => updateField('dateOfBirth', date)}
        onClose={() => setCalendarModal(false)}
      />
      <DropdownModal
        visible={genderModal} title="Select Gender"
        options={GENDER_OPTIONS} selected={form.gender}
        onSelect={v => updateField('gender', v)}
        onClose={() => setGenderModal(false)}
      />
      <DropdownModal
        visible={bloodModal} title="Select Blood Group"
        options={BLOOD_GROUP_OPTIONS} selected={form.bloodGroup}
        onSelect={v => updateField('bloodGroup', v)}
        onClose={() => setBloodModal(false)}
      />
      <SkillsEditModal
        visible={skillsModal}
        currentSkills={form.skills}
        onSave={newSkills => updateField('skills', newSkills)}
        onClose={() => setSkillsModal(false)}
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
// SKILLS MODAL STYLES
// ─────────────────────────────────────────────────────────────
const skillStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: CARD,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingBottom: 24,
    maxHeight: '88%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 4,
    marginBottom: 14,
  },
  modalTitle: { fontSize: 17, fontWeight: '800', color: DARK },
  modalSubtitle: { fontSize: 12, color: GREY, fontWeight: '500', marginTop: 2 },
  closeBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: INPUT_BG,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: 8,
  },
  closeBtnText: { fontSize: 13, color: GREY, fontWeight: '700' },

  centerState: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: 48,
  },
  centerStateText: { color: GREY, marginTop: 12, fontSize: 14 },
  errorText: { color: ERROR_RED, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  retryBtn: {
    marginTop: 14, backgroundColor: LIGHT_GREEN,
    borderRadius: 20, paddingHorizontal: 24, paddingVertical: 10,
  },
  retryText: { color: GREEN, fontWeight: '700', fontSize: 13 },

  categoryGroup: { paddingVertical: 12 },
  categoryHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10,
  },
  categoryIcon: { fontSize: 22 },
  categoryTitle: { fontSize: 14, fontWeight: '800', color: DARK },
  categoryDesc: { fontSize: 11, color: GREY, fontWeight: '400', marginTop: 1 },
  selectAllBtn: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 12, borderWidth: 1, borderColor: BORDER,
    backgroundColor: INPUT_BG,
  },
  selectAllBtnActive: { backgroundColor: LIGHT_GREEN, borderColor: GREEN },
  selectAllText: { fontSize: 11, color: GREY, fontWeight: '700' },
  selectAllTextActive: { color: GREEN },
  countBadge: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: GREEN,
    alignItems: 'center', justifyContent: 'center',
  },
  countBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },

  subSkillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  subChip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1.5,
    borderColor: BORDER, backgroundColor: INPUT_BG,
  },
  subChipSelected: { backgroundColor: LIGHT_GREEN, borderColor: GREEN },
  subChipCheck: { fontSize: 11, color: GREEN, fontWeight: '900' },
  subChipText: { fontSize: 12, color: DARK, fontWeight: '600' },
  subChipTextSelected: { color: GREEN, fontWeight: '700' },

  separator: { height: 1, backgroundColor: '#E5E7EB', marginHorizontal: 4 },

  footer: {
    flexDirection: 'row', gap: 10, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: '#E5E7EB',
  },
  clearBtn: {
    paddingVertical: 13, paddingHorizontal: 16,
    borderRadius: 12, backgroundColor: INPUT_BG,
  },
  clearBtnText: { color: GREY, fontWeight: '700', fontSize: 13 },
  saveBtn: {
    flex: 1, paddingVertical: 13,
    borderRadius: 12, backgroundColor: PRIMARY,
    alignItems: 'center',
  },
  saveBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
});

// ─────────────────────────────────────────────────────────────
// MAIN STYLES
// ─────────────────────────────────────────────────────────────
const mainStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: GREY, fontSize: 14 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: CARD, borderBottomWidth: 1, borderBottomColor: BORDER, elevation: 2,
  },
  headerBtn: { minWidth: 60, alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: DARK },
  cancelText: { color: ERROR_RED, fontWeight: '700', fontSize: 14 },
  editBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: LIGHT_GREEN, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  editBtnText: { color: GREEN, fontWeight: '700', fontSize: 13 },

  scroll: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 },

  avatarCard: {
    backgroundColor: CARD, borderRadius: 16, padding: 24,
    alignItems: 'center', marginBottom: 16, elevation: 2,
  },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: LIGHT_GREEN, borderWidth: 3, borderColor: GREEN,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 30, fontWeight: '900', color: GREEN },
  avatarName: { fontSize: 20, fontWeight: '800', color: DARK, marginBottom: 8 },
  activeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: LIGHT_GREEN, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20,
  },
  activeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: GREEN },
  activeBadgeText: { color: GREEN, fontSize: 12, fontWeight: '700' },
  editingNote: {
    marginTop: 10, color: '#FB923C', fontSize: 12, fontWeight: '600',
    backgroundColor: '#E5E7EB', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
  },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8, marginTop: 4 },
  sectionDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: GREEN },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: GREEN, textTransform: 'uppercase', letterSpacing: 0.8 },

  card: {
    backgroundColor: CARD, borderRadius: 14,
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, marginBottom: 16, elevation: 2,
  },
  fieldLabel: {
    fontSize: 11, fontWeight: '700', color: GREY,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, marginTop: 4,
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: INPUT_BG, borderWidth: 1, borderColor: BORDER,
    borderRadius: 10, paddingHorizontal: 12, minHeight: 48, marginBottom: 12, gap: 10,
  },
  readOnlyWrap: { backgroundColor: INPUT_BG },
  inputWrapError: { borderColor: ERROR_RED, backgroundColor: '#FFF3E8' },
  inputIcon: { fontSize: 16 },
  inputText: { flex: 1, fontSize: 14, color: DARK, fontWeight: '500' },
  lockedHint: { fontSize: 11, color: '#E5E7EB', marginTop: -8, marginBottom: 12, marginLeft: 2, fontStyle: 'italic' },
  fieldError: { color: ERROR_RED, fontSize: 11, fontWeight: '600', marginTop: -8, marginBottom: 10, marginLeft: 2 },
  charCount: { fontSize: 11, color: '#E5E7EB', textAlign: 'right', marginTop: -10, marginBottom: 10 },

  saveBtn: {
    backgroundColor: PRIMARY, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginTop: 8, elevation: 3,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: CARD, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingHorizontal: 16, paddingBottom: 32, maxHeight: '60%',
  },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB', alignSelf: 'center', marginVertical: 12 },
  modalTitle: { fontSize: 16, fontWeight: '800', color: DARK, marginBottom: 12, textAlign: 'center' },
  modalOption: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 12,
    borderBottomWidth: 1, borderBottomColor: '#E5E7EB', borderRadius: 8,
  },
  modalOptionSelected: { backgroundColor: LIGHT_GREEN },
  modalOptionText: { fontSize: 15, color: DARK, fontWeight: '500' },
  modalOptionTextSelected: { color: GREEN, fontWeight: '700' },

  calendarSheet: {
    backgroundColor: CARD, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingHorizontal: 16, paddingBottom: 24,
  },
  calendarTitle: { fontSize: 16, fontWeight: '800', color: DARK, marginBottom: 12, textAlign: 'center' },
  calNavRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  calNavBtn: { padding: 8 },
  calNavArrow: { fontSize: 24, color: GREEN, fontWeight: '700' },
  calNavLabel: { fontSize: 16, fontWeight: '800', color: GREEN },
  calDayHeaders: { flexDirection: 'row', marginBottom: 6 },
  calDayHeader: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '700', color: GREY },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calDayCell: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 100 },
  calDaySelected: { backgroundColor: PRIMARY },
  calDayFuture: { opacity: 0.3 },
  calDayText: { fontSize: 14, color: DARK, fontWeight: '500' },
  calDayTextSelected: { color: '#FFFFFF', fontWeight: '800' },
  calDayTextFuture: { color: GREY },
  calPickerYear: { fontSize: 18, fontWeight: '800', color: DARK, textAlign: 'center', marginBottom: 12 },
  calMonthGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  calMonthCell: { width: '28%', padding: 12, alignItems: 'center', borderRadius: 10, backgroundColor: INPUT_BG },
  calMonthSelected: { backgroundColor: PRIMARY },
  calMonthText: { fontSize: 14, fontWeight: '600', color: DARK },
  calMonthTextSelected: { color: '#FFFFFF', fontWeight: '800' },
  calYearItem: { paddingVertical: 14, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  calYearSelected: { backgroundColor: LIGHT_GREEN },
  calYearText: { fontSize: 16, color: DARK, fontWeight: '500', textAlign: 'center' },
  calYearTextSelected: { color: GREEN, fontWeight: '800' },
  calCancelBtn: { marginTop: 16, padding: 14, alignItems: 'center', backgroundColor: INPUT_BG, borderRadius: 12 },
  calCancelText: { color: ERROR_RED, fontWeight: '700', fontSize: 15 },

  skillsInfoBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: '#E5E7EB', borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 10, padding: 10, marginBottom: 10,
  },
  skillsInfoIcon: { fontSize: 14, marginTop: 1 },
  skillsInfoText: { flex: 1, fontSize: 12, color: '#FB923C', fontWeight: '500', lineHeight: 18 },

  skillsFieldWrap: { marginBottom: 12 },
  skillGroupBlock: { marginBottom: 10 },
  skillGroupLabel: {
    fontSize: 11, fontWeight: '800', color: GREEN,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6,
  },
  skillChipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  skillChip: {
    paddingHorizontal: 11, paddingVertical: 5,
    backgroundColor: LIGHT_GREEN, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16,
  },
  skillChipText: { fontSize: 12, color: GREEN, fontWeight: '700' },
  skillsEditTrigger: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: INPUT_BG, borderWidth: 1.5, borderColor: GREEN,
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, marginTop: 10,
  },
  skillsEditTriggerIcon: { fontSize: 15 },
  skillsEditTriggerText: { flex: 1, fontSize: 13, color: GREEN, fontWeight: '700' },
  skillsEditTriggerChevron: { fontSize: 20, color: GREEN, fontWeight: '700' },
  skillsEmptyWrap: {
    alignItems: 'center', paddingVertical: 20,
    backgroundColor: INPUT_BG, borderRadius: 10,
    borderWidth: 1, borderColor: BORDER, marginBottom: 12,
  },
  skillsEmptyIcon: { fontSize: 28, marginBottom: 6 },
  skillsEmptyText: { fontSize: 13, color: GREY, fontWeight: '500', marginBottom: 10 },
  skillsAddFirstBtn: {
    backgroundColor: LIGHT_GREEN, borderRadius: 20, paddingHorizontal: 18, paddingVertical: 8,
  },
  skillsAddFirstText: { color: GREEN, fontWeight: '700', fontSize: 13 },
});
