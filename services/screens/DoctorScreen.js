

import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Modal, Animated,
  Dimensions, TextInput, Platform,
} from 'react-native';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const NEW_COLOR = '#1A7A7A';
const BG        = '#E8F5F5';
const ACCENT    = '#E8A020';

const PAYMENT_METHODS = [
  { id: 'upi',        label: 'UPI',                  sub: 'Pay via any UPI app',          icon: '📱' },
  { id: 'card',       label: 'Credit / Debit Card',  sub: 'Visa, Mastercard, Rupay',      icon: '💳' },
  { id: 'netbanking', label: 'Net Banking',           sub: 'All major banks supported',    icon: '🏦' },
  { id: 'wallet',     label: 'Wallet',                sub: 'Paytm, PhonePe, Amazon Pay',  icon: '👛' },
  { id: 'cod',        label: 'Pay After Service',     sub: 'Cash on completion',           icon: '💵' },
];

const SAVED_ADDRESSES = [
  { id: 'a1', label: 'Home',   icon: '🏠', address: 'Flat 4B, Sunrise Apartments, Banjara Hills, Hyderabad – 500034' },
  { id: 'a2', label: 'Office', icon: '🏢', address: 'Level 3, Tech Park, Madhapur, Hyderabad – 500081' },
  { id: 'a3', label: 'Other',  icon: '📌', address: 'Plot 12, Green Valley Colony, Miyapur, Hyderabad – 500049' },
];

// ─── Calendar Modal ───────────────────────────────────────────────────────────
const CalendarModal = ({ visible, onClose, onSelect }) => {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [picked,    setPicked]    = useState(null);

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };
  const isDisabled = (day) => { if (!day) return true; const d = new Date(viewYear, viewMonth, day); d.setHours(0,0,0,0); const t = new Date(); t.setHours(0,0,0,0); return d < t; };
  const isPicked = (day) => { if (!day || !picked) return false; return picked.getDate() === day && picked.getMonth() === viewMonth && picked.getFullYear() === viewYear; };
  const confirm = () => { if (picked) { onSelect(picked); onClose(); } };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={cal.overlay}>
        <View style={cal.card}>
          <View style={cal.navRow}>
            <TouchableOpacity onPress={prevMonth} style={cal.navBtn}><Text style={cal.navArrow}>‹</Text></TouchableOpacity>
            <Text style={cal.monthLabel}>{monthNames[viewMonth]} {viewYear}</Text>
            <TouchableOpacity onPress={nextMonth} style={cal.navBtn}><Text style={cal.navArrow}>›</Text></TouchableOpacity>
          </View>
          <View style={cal.dayHeaders}>{['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <Text key={d} style={cal.dayHeader}>{d}</Text>)}</View>
          <View style={cal.grid}>
            {cells.map((day, idx) => (
              <TouchableOpacity key={idx} style={[cal.cell, isPicked(day) && cal.cellPicked, isDisabled(day) && cal.cellDisabled]} onPress={() => !isDisabled(day) && day && setPicked(new Date(viewYear, viewMonth, day))} disabled={!day || isDisabled(day)}>
                {day ? <Text style={[cal.cellText, isPicked(day) && cal.cellTextPicked, isDisabled(day) && cal.cellTextDisabled]}>{day}</Text> : null}
              </TouchableOpacity>
            ))}
          </View>
          <View style={cal.actions}>
            <TouchableOpacity onPress={onClose} style={cal.cancelBtn}><Text style={cal.cancelText}>Cancel</Text></TouchableOpacity>
            <TouchableOpacity onPress={confirm} style={[cal.confirmBtn, !picked && cal.confirmBtnDisabled]} disabled={!picked}><Text style={cal.confirmText}>Confirm Date</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const cal = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, width: '100%' },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  navBtn: { padding: 8 },
  navArrow: { fontSize: 22, color: NEW_COLOR, fontWeight: '700' },
  monthLabel: { fontSize: 16, fontWeight: '800', color: NEW_COLOR },
  dayHeaders: { flexDirection: 'row', marginBottom: 8 },
  dayHeader: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '700', color: '#aaa' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100/7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 50 },
  cellPicked: { backgroundColor: NEW_COLOR },
  cellDisabled: { opacity: 0.3 },
  cellText: { fontSize: 14, fontWeight: '600', color: '#102A2A' },
  cellTextPicked: { color: '#fff', fontWeight: '800' },
  cellTextDisabled: { color: '#ccc' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  cancelBtn: { flex: 1, paddingVertical: 13, borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center' },
  cancelText: { fontSize: 14, fontWeight: '700', color: '#555' },
  confirmBtn: { flex: 2, paddingVertical: 13, borderRadius: 12, backgroundColor: NEW_COLOR, alignItems: 'center' },
  confirmBtnDisabled: { backgroundColor: '#E8F5F5' },
  confirmText: { fontSize: 14, fontWeight: '800', color: '#fff' },
});

// ─── Address Modal ────────────────────────────────────────────────────────────
const AddressModal = ({ visible, onClose, onSelect, selected }) => (
  <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
    <View style={addr.overlay}>
      <View style={addr.sheet}>
        <View style={addr.handle} />
        <Text style={addr.title}>Select Address</Text>
        {SAVED_ADDRESSES.map(a => (
          <TouchableOpacity key={a.id} style={[addr.row, selected?.id === a.id && addr.rowActive]} onPress={() => { onSelect(a); onClose(); }}>
            <Text style={addr.icon}>{a.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={addr.label}>{a.label}</Text>
              <Text style={addr.text} numberOfLines={2}>{a.address}</Text>
            </View>
            {selected?.id === a.id && <Text style={addr.check}>✓</Text>}
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={addr.cancelBtn} onPress={onClose}><Text style={addr.cancelText}>Cancel</Text></TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const addr = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36 },
  handle: { width: 40, height: 4, backgroundColor: '#E8F5F5', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  title: { fontSize: 17, fontWeight: '800', color: NEW_COLOR, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#FFFFFF' },
  rowActive: { backgroundColor: '#F0FAFA' },
  icon: { fontSize: 22, marginRight: 14 },
  label: { fontSize: 13, fontWeight: '700', color: '#102A2A', marginBottom: 2 },
  text: { fontSize: 12, color: '#888', fontWeight: '500' },
  check: { fontSize: 18, color: NEW_COLOR, fontWeight: '800', marginLeft: 8 },
  cancelBtn: { marginTop: 16, paddingVertical: 14, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center' },
  cancelText: { fontSize: 14, fontWeight: '700', color: '#555' },
});

// ─── Payment Modal ────────────────────────────────────────────────────────────
const PaymentModal = ({ visible, onClose, onSelect, selected, totalAmount, onConfirm }) => (
  <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
    <View style={pay.overlay}>
      <View style={pay.sheet}>
        <View style={pay.handle} />
        <Text style={pay.title}>Choose Payment</Text>
        <Text style={pay.amount}>Total: ₹{totalAmount.toLocaleString('en-IN')}</Text>
        {PAYMENT_METHODS.map(m => (
          <TouchableOpacity key={m.id} style={[pay.row, selected === m.id && pay.rowActive]} onPress={() => onSelect(m.id)}>
            <Text style={pay.icon}>{m.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={pay.label}>{m.label}</Text>
              <Text style={pay.sub}>{m.sub}</Text>
            </View>
            <View style={[pay.radio, selected === m.id && pay.radioActive]}>
              {selected === m.id && <View style={pay.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={[pay.cta, !selected && pay.ctaDisabled]} disabled={!selected} onPress={() => { onClose(); onConfirm(); }}>
          <Text style={pay.ctaText}>Confirm & Book</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const pay = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36 },
  handle: { width: 40, height: 4, backgroundColor: '#E8F5F5', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  title: { fontSize: 17, fontWeight: '800', color: NEW_COLOR, marginBottom: 4 },
  amount: { fontSize: 13, color: '#888', fontWeight: '600', marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#FFFFFF' },
  rowActive: { backgroundColor: '#F0FAFA' },
  icon: { fontSize: 22, marginRight: 14 },
  label: { fontSize: 14, fontWeight: '700', color: '#102A2A', marginBottom: 2 },
  sub: { fontSize: 12, color: '#888', fontWeight: '500' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#DDD', alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: NEW_COLOR },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: NEW_COLOR },
  cta: { marginTop: 20, paddingVertical: 15, borderRadius: 50, backgroundColor: NEW_COLOR, alignItems: 'center' },
  ctaDisabled: { backgroundColor: '#E8F5F5' },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

// ─── Booking Status Modal ─────────────────────────────────────────────────────
const BookingStatusModal = ({ visible, onClose, bookingData }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    if (visible) { Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 8 }).start(); }
    else scaleAnim.setValue(0);
  }, [visible]);
  if (!visible || !bookingData) return null;
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={bstatus.overlay}>
        <Animated.View style={[bstatus.card, { transform: [{ scale: scaleAnim }] }]}>
          <View style={bstatus.iconCircle}><Text style={bstatus.iconText}>✓</Text></View>
          <Text style={bstatus.title}>Booking Confirmed!</Text>
          <Text style={bstatus.subtitle}>Your slot has been reserved successfully.</Text>
          <View style={bstatus.divider} />
          {[
            { label: '📅 Date',     value: bookingData.date },
            { label: '⏰ Slot',     value: bookingData.slot },
            { label: '📆 Duration', value: bookingData.duration },
            { label: '📍 Address',  value: bookingData.address },
            { label: '💳 Payment',  value: bookingData.payment || 'Pay After Service' },
          ].map((row, i) => (
            <View key={i} style={bstatus.row}>
              <Text style={bstatus.rowLabel}>{row.label}</Text>
              <Text style={bstatus.rowValue} numberOfLines={2}>{row.value}</Text>
            </View>
          ))}
          <View style={bstatus.divider} />
          <Text style={bstatus.note}>The doctor will contact you before arrival.</Text>
          <TouchableOpacity style={bstatus.btn} onPress={onClose}><Text style={bstatus.btnText}>Done</Text></TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const bstatus = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 24, width: '100%', alignItems: 'center' },
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#1A9E9E', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  iconText: { fontSize: 36, color: '#fff', fontWeight: '900' },
  title: { fontSize: 22, fontWeight: '900', color: NEW_COLOR, marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#888', fontWeight: '500', textAlign: 'center', marginBottom: 20 },
  divider: { height: 1, backgroundColor: '#F0FAFA', width: '100%', marginVertical: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingVertical: 6 },
  rowLabel: { fontSize: 13, color: '#888', fontWeight: '600', flex: 1 },
  rowValue: { fontSize: 13, color: '#102A2A', fontWeight: '700', flex: 1.2, textAlign: 'right' },
  note: { fontSize: 12, color: '#aaa', fontStyle: 'italic', textAlign: 'center', marginTop: 4 },
  btn: { marginTop: 20, backgroundColor: NEW_COLOR, borderRadius: 50, paddingVertical: 14, width: '100%', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

// ─── Booking Screen ───────────────────────────────────────────────────────────
const BookingScreen = ({ visible, onClose, onConfirm }) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const [calendarOpen,     setCalendarOpen]     = useState(false);
  const [selectedDate,     setSelectedDate]     = useState(null);
  const [selectedSlot,     setSelectedSlot]     = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [nurseGender,      setNurseGender]      = useState('Female');
  const [specialNote,      setSpecialNote]      = useState('');
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedAddress,  setSelectedAddress]  = useState(null);
  const [step,             setStep]             = useState(1);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPayment,  setSelectedPayment]  = useState(null);

  // ✅ FIX: Resident state lives HERE inside BookingScreen where it's actually used
  const [residentName,   setResidentName]   = useState('');
  const [residentMobile, setResidentMobile] = useState('');

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 12 }).start();
    } else {
      Animated.timing(slideAnim, { toValue: SCREEN_WIDTH, duration: 280, useNativeDriver: true }).start();
      setTimeout(() => {
        setSelectedDate(null); setSelectedSlot(null); setSelectedDuration(null);
        setNurseGender('Female'); setSpecialNote(''); setStep(1);
        setSelectedAddress(null); setSelectedPayment(null);
        setResidentName(''); setResidentMobile('');
      }, 300);
    }
  }, [visible]);

  const timeSlots = [
    { id: 'slot1', label: '6:00 – 8:00 AM',     period: 'Early Morning', available: true  },
    { id: 'slot2', label: '7:00 – 11:00 AM',     period: 'Morning',       available: true  },
    { id: 'slot3', label: '11:00 AM – 1:00 PM',  period: 'Late Morning',  available: false },
    { id: 'slot4', label: '2:00 – 5:00 PM',      period: 'Afternoon',     available: true  },
    { id: 'slot5', label: '6:00 – 9:00 PM',      period: 'Evening',       available: true  },
  ];
  const durations = [
    { id: 'd1', label: '1 Visit',  sub: 'One-time',   rate: 1500 },
    { id: 'd2', label: '4 Visits', sub: '4 Sundays',  rate: 5500 },
    { id: 'd3', label: '8 Visits', sub: '2 months',   rate: 9800 },
    { id: 'd4', label: 'Monthly',  sub: '4× / month', rate: 5200 },
  ];
  const genders = ['Female', 'Male', 'No Preference'];

  const selectedSlotData = timeSlots.find(s => s.id === selectedSlot);
  const selectedDurData  = durations.find(d => d.id === selectedDuration);
  const totalAmount      = selectedDurData ? selectedDurData.rate : 0;
  const paymentLabel     = PAYMENT_METHODS.find(p => p.id === selectedPayment)?.label || '';
  const canProceed       = !!(selectedDate && selectedSlot && selectedDuration && selectedAddress);
  const stepMeta         = [{ label: 'Schedule', done: step > 1 }, { label: 'Confirm', done: step > 2 }, { label: 'Payment', done: false }];

  const handleFinalConfirm = () => {
    onConfirm({
      date:     selectedDate?.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }),
      slot:     selectedSlotData?.label,
      duration: selectedDurData ? `${selectedDurData.label} (${selectedDurData.sub})` : '',
      address:  selectedAddress?.address,
      payment:  paymentLabel,
    });
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Animated.View style={[bk.screen, { transform: [{ translateX: slideAnim }] }]}>
        <SafeAreaView style={{ flex: 1, backgroundColor: NEW_COLOR }}>
          <View style={bk.header}>
            <TouchableOpacity onPress={step === 1 ? onClose : () => setStep(1)} style={bk.backBtn}><Text style={bk.backArrow}>←</Text></TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={bk.headerTitle}>{step === 1 ? 'Book a Slot' : 'Confirm Booking'}</Text>
              <Text style={bk.headerSub}>{step === 1 ? 'Choose your schedule' : 'Review your details'}</Text>
            </View>
            <View style={{ width: 36 }} />
          </View>

          <View style={bk.stepRow}>
            {stepMeta.map((s, i) => (
              <View key={i} style={bk.stepItem}>
                <View style={[bk.stepCircle, s.done && bk.stepCircleDone, step === i+1 && bk.stepCircleActive]}>
                  <Text style={[bk.stepNum, (s.done || step === i+1) && bk.stepNumActive]}>{s.done ? '✓' : i+1}</Text>
                </View>
                <Text style={[bk.stepLabel, step === i+1 && bk.stepLabelActive]}>{s.label}</Text>
                {i < 2 && <View style={[bk.stepConnector, stepMeta[i].done && bk.stepConnectorDone]} />}
              </View>
            ))}
          </View>

          {/* ✅ ScrollView using bk styles (self-contained) */}
          <ScrollView style={bk.body} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>

            {/* Info Cards */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 22 }}>
              <View style={bk.infoCard}>
                <Text style={bk.infoLabel}>Pay / Visit</Text>
                <Text style={bk.infoValue}>₹1,500</Text>
              </View>
              <View style={bk.infoCard}>
                <Text style={bk.infoLabel}>Schedule</Text>
                <Text style={bk.infoValue}>Sundays</Text>
              </View>
            </View>

            {/* Resident Details */}
            <Text style={bk.sectionLabel}>Resident Details</Text>
            <TextInput
              style={bk.inputField}
              placeholder="Resident Name"
              placeholderTextColor="#aaa"
              value={residentName}
              onChangeText={setResidentName}
            />
            <TextInput
              style={bk.inputField}
              placeholder="Mobile Number"
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
              value={residentMobile}
              onChangeText={setResidentMobile}
            />

            {/* Address Picker */}
            <Text style={bk.sectionLabel}>📍 Home Address</Text>
            <TouchableOpacity
              style={[bk.addrPicker, selectedAddress && bk.addrPickerSelected]}
              onPress={() => setAddressModalOpen(true)}
            >
              {selectedAddress ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <Text style={{ fontSize: 20, marginRight: 10 }}>{selectedAddress.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={bk.addrLabel}>{selectedAddress.label}</Text>
                    <Text style={bk.addrText} numberOfLines={2}>{selectedAddress.address}</Text>
                  </View>
                </View>
              ) : (
                <Text style={bk.addrPlaceholder}>Select home address</Text>
              )}
              <Text style={{ fontSize: 20, color: '#aaa' }}>›</Text>
            </TouchableOpacity>

            {/* Date Picker */}
            <Text style={bk.sectionLabel}>📅 Preferred Date</Text>
            <TouchableOpacity
              style={[bk.datePicker, selectedDate && bk.datePickerSelected]}
              onPress={() => setCalendarOpen(true)}
            >
              <Text style={[bk.datePickerText, selectedDate && bk.datePickerTextSelected]}>
                {selectedDate
                  ? selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
                  : 'Choose a date'}
              </Text>
              <Text style={{ fontSize: 20, color: '#aaa' }}>›</Text>
            </TouchableOpacity>

            {/* Time Slots */}
            <Text style={bk.sectionLabel}>⏰ Time Slot</Text>
            <View style={bk.slotsGrid}>
              {timeSlots.map(slot => (
                <TouchableOpacity
                  key={slot.id}
                  style={[bk.slotCard, selectedSlot === slot.id && bk.slotCardActive, !slot.available && bk.slotCardDisabled]}
                  onPress={() => slot.available && setSelectedSlot(slot.id)}
                  disabled={!slot.available}
                >
                  <Text style={[bk.slotPeriod, selectedSlot === slot.id && bk.slotTextActive, !slot.available && bk.slotTextDim]}>{slot.period}</Text>
                  <Text style={[bk.slotTime, selectedSlot === slot.id && bk.slotTextActive, !slot.available && bk.slotTextDim]}>{slot.label}</Text>
                  {!slot.available && (
                    <View style={bk.fullBadge}><Text style={bk.fullBadgeText}>Full</Text></View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Duration */}
            <Text style={bk.sectionLabel}>📆 Duration</Text>
            <View style={bk.durRow}>
              {durations.map(d => (
                <TouchableOpacity
                  key={d.id}
                  style={[bk.durCard, selectedDuration === d.id && bk.durCardActive]}
                  onPress={() => setSelectedDuration(d.id)}
                >
                  <Text style={[bk.durLabel, selectedDuration === d.id && bk.durLabelActive]}>{d.label}</Text>
                  <Text style={[bk.durSub, selectedDuration === d.id && bk.durSubActive]}>{d.sub}</Text>
                  <Text style={[bk.durRate, selectedDuration === d.id && bk.durRateActive]}>₹{d.rate.toLocaleString('en-IN')}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Gender Preference */}
            <Text style={bk.sectionLabel}>Doctor Gender</Text>
            <View style={bk.genderRow}>
              {genders.map(g => (
                <TouchableOpacity
                  key={g}
                  style={[bk.genderChip, nurseGender === g && bk.genderChipActive]}
                  onPress={() => setNurseGender(g)}
                >
                  <Text style={[bk.genderText, nurseGender === g && bk.genderTextActive]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Special Note */}
            <Text style={bk.sectionLabel}>Special Note</Text>
            <TextInput
              style={bk.noteInput}
              placeholder="Any special instructions..."
              placeholderTextColor="#bbb"
              multiline
              numberOfLines={3}
              value={specialNote}
              onChangeText={setSpecialNote}
            />
          </ScrollView>

          <View style={bk.footer}>
            {step === 1 ? (
              <TouchableOpacity style={[bk.cta, !canProceed && bk.ctaDisabled]} disabled={!canProceed} onPress={() => setStep(2)}>
                <Text style={bk.ctaText}>Review Booking →</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[bk.cta, { backgroundColor: ACCENT }]} onPress={() => setPaymentModalOpen(true)}>
                <Text style={bk.ctaText}>💳 Proceed to Payment</Text>
              </TouchableOpacity>
            )}
          </View>

          <CalendarModal visible={calendarOpen} onClose={() => setCalendarOpen(false)} onSelect={(d) => setSelectedDate(d)} />
          <AddressModal visible={addressModalOpen} onClose={() => setAddressModalOpen(false)} onSelect={(a) => setSelectedAddress(a)} selected={selectedAddress} />
          <PaymentModal visible={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} onSelect={(id) => setSelectedPayment(id)} selected={selectedPayment} totalAmount={totalAmount} onConfirm={handleFinalConfirm} />
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
};

const bk = StyleSheet.create({
  screen: { flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: BG },
  header: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: NEW_COLOR, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 14 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 20, color: '#fff', fontWeight: '700' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 1 },
  stepRow: { flexDirection: 'row', backgroundColor: NEW_COLOR, paddingHorizontal: 20, paddingBottom: 16, alignItems: 'center', justifyContent: 'center' },
  stepItem: { flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' },
  stepCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  stepCircleActive: { backgroundColor: '#fff' },
  stepCircleDone: { backgroundColor: '#1A9E9E' },
  stepNum: { fontSize: 13, fontWeight: '800', color: 'rgba(255,255,255,0.7)' },
  stepNumActive: { color: NEW_COLOR },
  stepLabel: { fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.5)' },
  stepLabelActive: { color: '#fff' },
  stepConnector: { position: 'absolute', top: 15, right: -(SCREEN_WIDTH * 0.13), width: SCREEN_WIDTH * 0.26, height: 2, backgroundColor: 'rgba(255,255,255,0.2)' },
  stepConnectorDone: { backgroundColor: '#1A9E9E' },
  // ── Body ──
  body: { flex: 1, backgroundColor: BG, paddingHorizontal: 16, paddingTop: 20 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: ACCENT, letterSpacing: 1.2, marginBottom: 10, marginTop: 6 },
  // Info cards
  infoCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 14, alignItems: 'flex-start', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3 },
  infoLabel: { fontSize: 11, color: '#999', fontWeight: '500', letterSpacing: 0.3, marginBottom: 4 },
  infoValue: { fontSize: 22, fontWeight: '800', color: '#102A2A' },
  // Input fields
  inputField: { height: 48, borderColor: '#F0FAFA', borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, marginBottom: 12, fontSize: 14, color: '#102A2A', backgroundColor: '#fff', fontWeight: '500' },
  // Address picker
  addrPicker: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 20, borderWidth: 1.5, borderColor: '#EEE' },
  addrPickerSelected: { borderColor: NEW_COLOR },
  addrLabel: { fontSize: 12, fontWeight: '700', color: NEW_COLOR, marginBottom: 2 },
  addrText: { fontSize: 13, color: '#444', fontWeight: '500' },
  addrPlaceholder: { fontSize: 14, color: '#aaa', fontWeight: '500', flex: 1 },
  // Date picker
  datePicker: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 20, borderWidth: 1.5, borderColor: '#EEE', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 2 },
  datePickerSelected: { borderColor: NEW_COLOR },
  datePickerText: { flex: 1, fontSize: 14, color: '#aaa', fontWeight: '500' },
  datePickerTextSelected: { color: '#102A2A', fontWeight: '600' },
  // Slots
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  slotCard: { width: (SCREEN_WIDTH - 52) / 2, backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1.5, borderColor: '#EEE', position: 'relative' },
  slotCardActive: { backgroundColor: NEW_COLOR, borderColor: NEW_COLOR },
  slotCardDisabled: { opacity: 0.45 },
  slotPeriod: { fontSize: 11, color: '#999', fontWeight: '600', marginBottom: 2 },
  slotTime: { fontSize: 13, color: '#102A2A', fontWeight: '700' },
  slotTextActive: { color: '#fff' },
  slotTextDim: { color: '#bbb' },
  fullBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#F0FAFA', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  fullBadgeText: { fontSize: 10, color: '#D94848', fontWeight: '700' },
  // Duration
  durRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  durCard: { width: (SCREEN_WIDTH - 52) / 2, backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1.5, borderColor: '#EEE', alignItems: 'flex-start' },
  durCardActive: { backgroundColor: NEW_COLOR, borderColor: NEW_COLOR },
  durLabel: { fontSize: 15, fontWeight: '800', color: '#102A2A', marginBottom: 2 },
  durLabelActive: { color: '#fff' },
  durSub: { fontSize: 11, color: '#999', fontWeight: '500', marginBottom: 6 },
  durSubActive: { color: 'rgba(255,255,255,0.7)' },
  durRate: { fontSize: 14, fontWeight: '800', color: ACCENT },
  durRateActive: { color: '#fff' },
  // Gender
  genderRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  genderChip: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#EEE', alignItems: 'center' },
  genderChipActive: { backgroundColor: NEW_COLOR, borderColor: NEW_COLOR },
  genderText: { fontSize: 12, fontWeight: '600', color: '#555' },
  genderTextActive: { color: '#fff' },
  // Note
  noteInput: { backgroundColor: '#fff', borderRadius: 14, padding: 14, fontSize: 13, color: '#333', borderWidth: 1.5, borderColor: '#EEE', textAlignVertical: 'top', minHeight: 80, marginBottom: 20 },
  // Footer
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingBottom: Platform.OS === 'ios' ? 34 : 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0FAFA', backgroundColor: BG },
  cta: { backgroundColor: NEW_COLOR, borderRadius: 50, paddingVertical: 16, alignItems: 'center', shadowColor: NEW_COLOR, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
  ctaDisabled: { backgroundColor: '#E8F5F5', shadowOpacity: 0 },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
});

// ─── MAIN SCREEN — DoctorScreen ───────────────────────────────────────────────
export default function DoctorScreen({ navigation, route }) {
  const workerData = route?.params?.workerData;

  const workerName          = workerData?.name          || 'Ravi T.';
  const workerRating        = workerData?.rating        || 4.8;
  const workerReviews       = workerData?.reviews       || 14;
  const workerInitial       = workerData?.initials?.[0] || 'R';
  const skills              = workerData?.skills        || ['General MD', 'Home Visit', 'Elderly'];
  const workerQualification = workerData?.qualification || 'MBBS';

  const [bookingVisible, setBookingVisible] = useState(false);
  const [statusVisible,  setStatusVisible]  = useState(false);
  const [bookingData,    setBookingData]    = useState(null);

  const handleConfirm = (data) => {
    setBookingData(data);
    setBookingVisible(false);
    setTimeout(() => setStatusVisible(true), 350);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={NEW_COLOR} />
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Doctor Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={styles.ratingPill}>
            <Text style={styles.ratingPillText}>Rating {workerRating}</Text>
          </View>
          <Text style={styles.jobTitle}>Doctor Needed 🩺</Text>
          <Text style={styles.postedBy}>
            {workerName}{workerQualification ? ` · ${workerQualification}` : ''}
          </Text>
          <View style={styles.tagsRow}>
            <View style={[styles.tag, styles.tagUrgent]}><Text style={styles.tagTextUrgent}>HOME VISIT</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>General</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>{workerData?.location || '0.5 km'}</Text></View>
          </View>
        </View>

        {/* Scrollable Body */}
        <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Pay / Visit</Text>
              <Text style={styles.infoValue}>₹1,500</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Schedule</Text>
              <Text style={styles.infoValue}>Sundays</Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>DESCRIPTION</Text>
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>
              Need a general physician for weekly home visits. Patient is 70 years old.
              Morning slot preferred, 9–11 AM. Location shared after acceptance.
            </Text>
          </View>

          <Text style={styles.sectionLabel}>SPECIALISATIONS</Text>
          <View style={styles.skillsRow}>
            {skills.map(skill => (
              <View key={skill} style={styles.skillChip}>
                <Text style={styles.skillChipText}>{skill}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionLabel}>DOCTOR RATING</Text>
          <View style={styles.ratingCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{workerInitial}</Text>
            </View>
            <View style={styles.ratingInfo}>
              <Text style={styles.ratingName}>{workerName}</Text>
              {workerQualification && <Text style={{ fontSize: 11, color: ACCENT, fontWeight: '700', marginBottom: 2 }}>{workerQualification}</Text>}
              <View style={styles.starsRow}>
                <Text style={styles.stars}>{'★'.repeat(Math.round(workerRating))}</Text>
                <Text style={styles.starsEmpty}>{'★'.repeat(5 - Math.round(workerRating))}</Text>
                <Text style={styles.ratingMeta}>  {workerRating} · {workerReviews} reviews</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Book Button */}
        <View style={styles.applyContainer}>
          <TouchableOpacity style={styles.applyButton} activeOpacity={0.85} onPress={() => setBookingVisible(true)}>
            <Text style={styles.applyButtonText}>📅  Book {workerName}</Text>
          </TouchableOpacity>
        </View>

        <BookingScreen visible={bookingVisible} onClose={() => setBookingVisible(false)} onConfirm={handleConfirm} />
        <BookingStatusModal visible={statusVisible} onClose={() => setStatusVisible(false)} bookingData={bookingData} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:  { flex: 1, backgroundColor: NEW_COLOR },
  container: { flex: 1, backgroundColor: BG },
header: { flexDirection: 'row', alignItems: 'center', backgroundColor: NEW_COLOR, paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 12 : 12, paddingBottom: 8 },
  backButton: { marginTop: 20, padding: 4 },
  backArrow:  { fontSize: 22, color: '#fff', fontWeight: '600' },
  headerTitle: { marginTop: 20, flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },
  headerSpacer: { width: 30 },
  heroCard: { backgroundColor: NEW_COLOR, paddingHorizontal: 20, paddingBottom: 28, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, position: 'relative' },
  ratingPill: { position: 'absolute', top: 4, right: 16, backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  ratingPillText: { color: NEW_COLOR, fontSize: 11, fontWeight: '800' },
  jobTitle:  { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4, textAlign: 'center' },
  postedBy:  { fontSize: 13, color: 'rgba(255,255,255,0.82)', marginBottom: 14, textAlign: 'center' },
  tagsRow:   { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  tag:       { backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  tagUrgent: { backgroundColor: '#fff' },
  tagText:   { color: '#fff', fontSize: 12, fontWeight: '600' },
  tagTextUrgent: { color: NEW_COLOR, fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  scrollBody:    { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20 },
  infoRow:  { flexDirection: 'row', gap: 12, marginBottom: 22 },
  infoCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 14, alignItems: 'flex-start', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3 },
  infoLabel: { fontSize: 11, color: '#999', fontWeight: '500', letterSpacing: 0.3, marginBottom: 4 },
  infoValue: { fontSize: 22, fontWeight: '800', color: '#102A2A' },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: ACCENT, letterSpacing: 1.2, marginBottom: 10 },
  descriptionBox: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 22, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  descriptionText: { fontSize: 14, color: '#333', lineHeight: 22, fontWeight: '500' },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 22 },
  skillChip: { backgroundColor: '#F0FAFA', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  skillChipText: { color: NEW_COLOR, fontSize: 13, fontWeight: '600' },
  ratingCard: { backgroundColor: '#fff', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 22, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  avatarCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: NEW_COLOR, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText:  { color: '#fff', fontSize: 18, fontWeight: '800' },
  ratingInfo:  { flex: 1 },
  ratingName:  { fontSize: 15, fontWeight: '700', color: '#102A2A', marginBottom: 3 },
  starsRow:    { flexDirection: 'row', alignItems: 'center' },
  stars:       { color: '#E8A020', fontSize: 14 },
  starsEmpty:  { color: '#DDD', fontSize: 14 },
  ratingMeta:  { fontSize: 12, color: '#888', fontWeight: '500' },
  applyContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingBottom: 28, paddingTop: 10, backgroundColor: BG },
  applyButton: { backgroundColor: NEW_COLOR, borderRadius: 50, paddingVertical: 17, alignItems: 'center', shadowColor: NEW_COLOR, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 6 },
  applyButtonText: { color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 0.3 },
});

