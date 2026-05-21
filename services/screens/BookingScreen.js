import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

// ─── Colors ───────────────────────────────────────────────────────────────────
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
  green:       '#1A9E9E',
  greenLight:  '#F0FAFA',
  red:         '#D94848',
  selectedBg:  '#F0FAFA',
  todayBg:     '#F0FAFA',
};

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function firstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
function sameDay(a, b) {
  return a && b &&
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();
}
function formatDate(d) {
  if (!d) return '';
  const dd   = String(d.getDate()).padStart(2, '0');
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd} / ${mm} / ${yyyy}`;
}

// ─── Custom Calendar ──────────────────────────────────────────────────────────
function CalendarPicker({ selectedDate, onSelect }) {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const totalDays  = daysInMonth(viewYear, viewMonth);
  const startDay   = firstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  return (
    <View style={cal.wrapper}>
      <View style={cal.nav}>
        <TouchableOpacity onPress={prevMonth} style={cal.navBtn} activeOpacity={0.7}>
          <Text style={cal.navArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={cal.navTitle}>{MONTHS[viewMonth]} {viewYear}</Text>
        <TouchableOpacity onPress={nextMonth} style={cal.navBtn} activeOpacity={0.7}>
          <Text style={cal.navArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={cal.dayRow}>
        {DAYS.map(d => (
          <Text key={d} style={cal.dayHeader}>{d}</Text>
        ))}
      </View>

      <View style={cal.grid}>
        {cells.map((day, idx) => {
          if (!day) return <View key={`e-${idx}`} style={cal.cell} />;

          const cellDate  = new Date(viewYear, viewMonth, day);
          const isPast    = cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const isToday   = sameDay(cellDate, today);
          const isSelected = sameDay(cellDate, selectedDate);

          return (
            <TouchableOpacity
              key={day}
              style={[
                cal.cell,
                isToday    && cal.todayCell,
                isSelected && cal.selectedCell,
                isPast     && cal.pastCell,
              ]}
              onPress={() => !isPast && onSelect(cellDate)}
              activeOpacity={isPast ? 1 : 0.75}
              disabled={isPast}
            >
              <Text style={[
                cal.cellText,
                isToday    && cal.todayCellText,
                isSelected && cal.selectedCellText,
                isPast     && cal.pastCellText,
              ]}>
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Input Field ──────────────────────────────────────────────────────────────
function InputField({ label, value, onChangeText, placeholder, multiline, keyboardType, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={s.fieldWrapper}>
      <Text style={s.fieldLabel}>
        {label}{required && <Text style={s.req}> *</Text>}
      </Text>
      <TextInput
        style={[s.input, multiline && s.inputMulti, focused && s.inputFocused]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.textLight}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        keyboardType={keyboardType || 'default'}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}

// ─── Time Slot ────────────────────────────────────────────────────────────────
function TimeSlot({ slot, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[s.slot, selected && s.slotSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[s.slotTime, selected && s.slotTimeSelected]}>{slot.time}</Text>
      <Text style={[s.slotLabel, selected && s.slotLabelSelected]}>{slot.label}</Text>
    </TouchableOpacity>
  );
}

// ─── Payment Option ───────────────────────────────────────────────────────────
function PaymentOption({ icon, label, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[s.payCard, selected && s.payCardSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={s.payIcon}>{icon}</Text>
      <Text style={[s.payLabel, selected && s.payLabelSelected]}>{label}</Text>
      {selected && (
        <View style={s.payCheck}>
          <Text style={s.payCheckText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Success Modal ────────────────────────────────────────────────────────────
function SuccessModal({ visible, onDone, jobData, selectedDate, selectedSlot, paymentMethod }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={s.overlay}>
        <View style={s.modalCard}>
          <View style={s.successCircle}>
            <Text style={s.successCheck}>✓</Text>
          </View>
          <Text style={s.successTitle}>Booking Confirmed!</Text>

          <Text style={s.successSub}>
            Your <Text>{jobData?.jobTitle || 'Unknown Job'}</Text> has been successfully booked.
          </Text>
          <View style={s.successDivider} />

          <View style={s.summaryRow}>
            <Text style={s.summaryIcon}>{jobData?.icon}</Text>
            <View>
              <Text style={s.summaryTitle}>{jobData?.jobTitle} Needed</Text>
              <Text style={s.summaryMeta}>{jobData?.postedBy}</Text>
            </View>
          </View>

          <View style={s.infoGrid}>
            <View style={s.infoItem}>
              <Text style={s.infoLabel}>Date</Text>
              <Text style={s.infoValue}>{selectedDate ? formatDate(selectedDate) : '—'}</Text>
            </View>
            <View style={s.infoDivider} />
            <View style={s.infoItem}>
              <Text style={s.infoLabel}>Slot</Text>
              <Text style={s.infoValue}>{selectedSlot?.time || '—'}</Text>
            </View>
            <View style={s.infoDivider} />
            <View style={s.infoItem}>
              <Text style={s.infoLabel}>Pay</Text>
              <Text style={s.infoValue}>₹{jobData?.pay}</Text>
            </View>
          </View>

          <View style={s.infoGrid}>
            <View style={s.infoItem}>
              <Text style={s.infoLabel}>Payment</Text>
              <Text style={s.infoValue}>{paymentMethod || '—'}</Text>
            </View>
          </View>

          <Text style={s.successNote}>📩 Confirmation sent to your registered number</Text>

          <TouchableOpacity style={s.doneBtn} onPress={onDone} activeOpacity={0.85}>
            <Text style={s.doneBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
export default function BookingScreen({ navigation, route }) {
  const jobData = route?.params?.jobData || {
    jobTitle: 'Security Guard',
    postedBy: 'Colony Mgmt · Gate 1',
    icon: '🛡️',
    pay: 750,
    payLabel: '/shift',
    timeSlots: [
      { id: '1', time: '6AM – 2PM',  label: 'Morning Shift' },
      { id: '2', time: '2PM – 10PM', label: 'Afternoon Shift' },
      { id: '3', time: '10PM – 6AM', label: 'Night Shift' },
    ],
  };

  const [form, setForm] = useState({
    name: '', phone: '', address: '',
    duration: '', description: '',
    paymentMethod: '', upiId: '',
  });
  const [selectedDate,   setSelectedDate]   = useState(null);
  const [selectedSlot,   setSelectedSlot]   = useState(null);
  const [showSuccess,    setShowSuccess]     = useState(false);
  const [errors,         setErrors]          = useState({});
  const [calendarOpen,   setCalendarOpen]    = useState(false); // ← NEW

  const paymentOptions = [
    { id: 'Cash',   icon: '💵', label: 'Cash'   },
    { id: 'UPI',    icon: '📱', label: 'UPI'    },
    { id: 'Card',   icon: '💳', label: 'Card'   },
    { id: 'Wallet', icon: '👛', label: 'Wallet' },
  ];

  const validate = () => {
    const e = {};
    if (!form.name.trim())                            e.name    = true;
    if (!form.phone.trim() || form.phone.length < 10) e.phone   = true;
    if (!form.address.trim())                         e.address = true;
    if (!selectedDate)                                e.date    = true;
    if (!selectedSlot)                                e.slot    = true;
    if (!form.paymentMethod)                          e.payment = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Handle date selection: store date + close calendar ────────────────────
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setCalendarOpen(false);                          // ← close on selection
    setErrors(e => ({ ...e, date: false }));
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.navy} />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation?.goBack?.()} activeOpacity={0.7}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Book Now</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Banner */}
      <View style={s.banner}>
        <View style={s.bannerRow}>
          <View style={{ flex: 1 }}>
            <Text style={s.bannerTitle}>{jobData.jobTitle} Needed {jobData.icon}</Text>
            <Text style={s.bannerMeta}>{jobData.postedBy}</Text>
          </View>
          <View style={s.priceBadge}>
            <Text style={s.priceAmt}>₹{jobData.pay}</Text>
            <Text style={s.priceLabel}>{jobData.payLabel}</Text>
          </View>
        </View>
        <View style={s.wave} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: C.cream }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
        >

          {/* Your Details */}
          <View style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.cardIcon}>👤</Text>
              <Text style={s.cardTitle}>Your Details</Text>
            </View>
            <InputField
              label="Full Name" required value={form.name}
              onChangeText={v => setForm({ ...form, name: v })}
              placeholder="Enter your full name"
            />
            {errors.name && <Text style={s.err}>Name is required</Text>}

            <InputField
              label="Phone Number" required value={form.phone}
              onChangeText={v => setForm({ ...form, phone: v })}
              placeholder="10-digit mobile number" keyboardType="phone-pad"
            />
            {errors.phone && <Text style={s.err}>Valid phone number required</Text>}
          </View>

          {/* Address */}
          <View style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.cardIcon}>📍</Text>
              <Text style={s.cardTitle}>Address</Text>
            </View>
            <InputField
              label="Full Address" required value={form.address}
              onChangeText={v => setForm({ ...form, address: v })}
              placeholder="Flat no, Block, Colony name..." multiline
            />
            {errors.address && <Text style={s.err}>Address is required</Text>}
          </View>

          {/* ── Date Card ── */}
          <View style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.cardIcon}>📅</Text>
              <Text style={s.cardTitle}>
                Select Date<Text style={s.req}> *</Text>
              </Text>
            </View>

            {/* ── Tappable date field ── */}
            <TouchableOpacity
              style={[
                s.selectedDateBox,
                calendarOpen && s.selectedDateBoxOpen,
                errors.date  && s.selectedDateBoxError,
              ]}
              onPress={() => setCalendarOpen(open => !open)}
              activeOpacity={0.8}
            >
              <Text style={s.selectedDateIcon}>📆</Text>
              <Text style={[s.selectedDateText, !selectedDate && s.selectedDatePlaceholder]}>
                {selectedDate ? formatDate(selectedDate) : 'Tap to select a date'}
              </Text>
              {/* Chevron indicator */}
              <Text style={[s.chevron, calendarOpen && s.chevronUp]}>
                ▾
              </Text>
            </TouchableOpacity>

            {errors.date && <Text style={s.err}>Please select a date</Text>}

            {/* ── Calendar renders only when open ── */}
            {calendarOpen && (
              <CalendarPicker
                selectedDate={selectedDate}
                onSelect={handleDateSelect}
              />
            )}

            <View style={{ marginTop: 14 }}>
              <InputField
                label="Duration / No. of Days" value={form.duration}
                onChangeText={v => setForm({ ...form, duration: v })}
                placeholder="e.g. 7 days, 1 month"
              />
            </View>
          </View>

          {/* Time Slot */}
          <View style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.cardIcon}>🕐</Text>
              <Text style={s.cardTitle}>
                Select Time Slot<Text style={s.req}> *</Text>
              </Text>
            </View>
            <View style={s.slotsGrid}>
              {jobData.timeSlots.map(slot => (
                <TimeSlot
                  key={slot.id}
                  slot={slot}
                  selected={selectedSlot?.id === slot.id}
                  onPress={() => { setSelectedSlot(slot); setErrors(e => ({ ...e, slot: false })); }}
                />
              ))}
            </View>
            {errors.slot && <Text style={s.err}>Please select a time slot</Text>}
          </View>

          {/* Additional Instructions */}
          <View style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.cardIcon}>📝</Text>
              <Text style={s.cardTitle}>Additional Instructions</Text>
            </View>
            <InputField
              label="Special Requirements" value={form.description}
              onChangeText={v => setForm({ ...form, description: v })}
              placeholder={`Any specific instructions for the ${jobData.jobTitle.toLowerCase()}...`}
              multiline
            />
          </View>

          {/* Payment */}
          <View style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.cardIcon}>💰</Text>
              <Text style={s.cardTitle}>
                Payment Method<Text style={s.req}> *</Text>
              </Text>
            </View>
            <View style={s.payGrid}>
              {paymentOptions.map(opt => (
                <PaymentOption
                  key={opt.id} icon={opt.icon} label={opt.label}
                  selected={form.paymentMethod === opt.id}
                  onPress={() => { setForm({ ...form, paymentMethod: opt.id }); setErrors(e => ({ ...e, payment: false })); }}
                />
              ))}
            </View>
            {errors.payment && <Text style={s.err}>Please select a payment method</Text>}
            {form.paymentMethod === 'UPI' && (
              <InputField
                label="UPI ID" value={form.upiId}
                onChangeText={v => setForm({ ...form, upiId: v })}
                placeholder="yourname@upi" keyboardType="email-address"
              />
            )}
          </View>

          {/* Amount Summary */}
          <View style={s.amountCard}>
            <Text style={s.amountTitle}>PAYMENT SUMMARY</Text>
            <View style={s.amountRow}>
              <Text style={s.amountLabel}>Pay {jobData.payLabel}</Text>
              <Text style={s.amountVal}>₹{jobData.pay}</Text>
            </View>
            <View style={s.amountRow}>
              <Text style={s.amountLabel}>Date</Text>
              <Text style={s.amountVal}>{selectedDate ? formatDate(selectedDate) : 'Not selected'}</Text>
            </View>
            <View style={s.amountRow}>
              <Text style={s.amountLabel}>Time Slot</Text>
              <Text style={s.amountVal}>{selectedSlot?.time || 'Not selected'}</Text>
            </View>
            <View style={s.amountRow}>
              <Text style={s.amountLabel}>Platform Fee</Text>
              <Text style={s.amountVal}>₹0</Text>
            </View>
            <View style={s.amountDivider} />
            <View style={s.amountRow}>
              <Text style={s.amountTotalLabel}>Total Amount</Text>
              <Text style={s.amountTotal}>₹{jobData.pay}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={s.confirmBtn}
            onPress={() => { if (validate()) setShowSuccess(true); }}
            activeOpacity={0.85}
          >
            <Text style={s.confirmBtnText}>Confirm Booking →</Text>
          </TouchableOpacity>

          <View style={{ height: 48 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={showSuccess}
        onDone={() => { setShowSuccess(false); navigation?.navigate?.('Home'); }}
        jobData={jobData}
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
        paymentMethod={form.paymentMethod}
      />
    </SafeAreaView>
  );
}

// ─── Calendar Styles ──────────────────────────────────────────────────────────
const cal = StyleSheet.create({
  wrapper: {
    backgroundColor: C.cream,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    padding: 12,
    marginTop: 10,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  navBtn: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: C.white,
    borderWidth: 1.5,
    borderColor: C.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navArrow: { fontSize: 20, color: C.navy, fontWeight: '700', lineHeight: 24 },
  navTitle: { color: C.navy, fontSize: 15, fontWeight: '800' },

  dayRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    color: C.textLight,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  cellText: {
    fontSize: 14,
    color: C.textDark,
    fontWeight: '500',
  },
  todayCell: {
    backgroundColor: C.todayBg,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: C.orange,
  },
  todayCellText: { color: C.orange, fontWeight: '800' },
  selectedCell: {
    backgroundColor: C.navy,
    borderRadius: 22,
  },
  selectedCellText: { color: C.white, fontWeight: '800' },
  pastCell: { opacity: 0.3 },
  pastCellText: { color: C.textLight },
});

// ─── Main Styles ──────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.navy },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.navy,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backBtn:    { width: 32, height: 32, justifyContent: 'center' },
  backArrow:  { color: C.white, fontSize: 22, fontWeight: '300' },
  headerTitle:{ color: C.white, fontSize: 17, fontWeight: '700' },

  // Banner
  banner: {
    backgroundColor: C.navy,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 32,
  },
  bannerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bannerTitle:{ color: C.white, fontSize: 17, fontWeight: '800' },
  bannerMeta: { color: '#E8A020', fontSize: 12, marginTop: 3 },
  priceBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
  },
  priceAmt:   { color: C.white, fontSize: 20, fontWeight: '800' },
  priceLabel: { color: '#E8A020', fontSize: 11 },
  wave: {
    position: 'absolute', bottom: -1, left: 0, right: 0,
    height: 20,
    backgroundColor: C.cream,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  // Scroll
  scroll:       { flex: 1, backgroundColor: C.cream },
  scrollContent:{ paddingHorizontal: 16, paddingTop: 18 },

  // Card
  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: C.orangeLight,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  cardIcon:   { fontSize: 18 },
  cardTitle:  { color: C.navy, fontSize: 14, fontWeight: '800' },

  // Date display — tappable trigger
  selectedDateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.selectedBg,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.navy,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 4,
    gap: 10,
  },
  selectedDateBoxOpen: {
    borderColor: C.orange,
    backgroundColor: C.todayBg,
  },
  selectedDateBoxError: {
    borderColor: C.red,
  },
  selectedDateIcon:        { fontSize: 18 },
  selectedDateText:        { color: C.navy, fontSize: 15, fontWeight: '700', flex: 1 },
  selectedDatePlaceholder: { color: C.textLight, fontWeight: '400', fontSize: 14 },

  // Chevron arrow on date field
  chevron:   { color: C.navy, fontSize: 16, fontWeight: '700' },
  chevronUp: { transform: [{ rotate: '180deg' }] },

  // Input
  fieldWrapper: { marginBottom: 12 },
  fieldLabel:   { color: C.textMid, fontSize: 12, fontWeight: '600', marginBottom: 6 },
  req:          { color: C.red },
  input: {
    backgroundColor: C.cream,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: C.textDark,
    fontSize: 14,
    fontWeight: '500',
  },
  inputMulti:   { height: 80, paddingTop: 10 },
  inputFocused: { borderColor: C.navy, backgroundColor: C.white },
  err:          { color: C.red, fontSize: 11, marginTop: 2, marginBottom: 6 },

  // Slots
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slot: {
    flex: 1, minWidth: '28%',
    borderWidth: 1.5, borderColor: C.border,
    borderRadius: 12, paddingVertical: 10, paddingHorizontal: 8,
    backgroundColor: C.cream, alignItems: 'center',
  },
  slotSelected:      { borderColor: C.navy, backgroundColor: C.selectedBg },
  slotTime:          { color: C.textDark, fontSize: 12, fontWeight: '700', textAlign: 'center' },
  slotTimeSelected:  { color: C.navy },
  slotLabel:         { color: C.textLight, fontSize: 10, marginTop: 2, textAlign: 'center' },
  slotLabelSelected: { color: C.navy },

  // Payment
  payGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  payCard: {
    flex: 1, minWidth: '44%',
    backgroundColor: C.cream,
    borderRadius: 12, borderWidth: 1.5, borderColor: C.border,
    paddingVertical: 12, paddingHorizontal: 14,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  payCardSelected:  { borderColor: C.navy, backgroundColor: C.selectedBg },
  payIcon:          { fontSize: 18 },
  payLabel:         { color: C.textMid, fontSize: 13, fontWeight: '600', flex: 1 },
  payLabelSelected: { color: C.navy },
  payCheck: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: C.navy,
    justifyContent: 'center', alignItems: 'center',
  },
  payCheckText: { color: C.white, fontSize: 10, fontWeight: '800' },

  // Amount
  amountCard: {
    backgroundColor: C.navy,
    borderRadius: 16, padding: 16, marginBottom: 14,
  },
  amountTitle: {
    color: C.orangeLight, fontSize: 11, fontWeight: '700',
    marginBottom: 12, letterSpacing: 1,
  },
  amountRow:       { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  amountLabel:     { color: '#E8A020', fontSize: 13 },
  amountVal:       { color: C.white, fontSize: 13, fontWeight: '600' },
  amountDivider:   { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: 8 },
  amountTotalLabel:{ color: C.white, fontSize: 15, fontWeight: '700' },
  amountTotal:     { color: C.orangeLight, fontSize: 20, fontWeight: '800' },

  // Confirm
  confirmBtn: {
    backgroundColor: C.navy, borderRadius: 30,
    paddingVertical: 16, alignItems: 'center',
    elevation: 6, marginBottom: 6,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10,
  },
  confirmBtnText: { color: C.white, fontSize: 16, fontWeight: '700' },

  // Modal
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: C.white, borderRadius: 24, padding: 28,
    width: '100%', alignItems: 'center', elevation: 10,
  },
  successCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: C.greenLight, borderWidth: 3, borderColor: C.green,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  successCheck:  { fontSize: 32, color: C.green },
  successTitle:  { color: C.textDark, fontSize: 22, fontWeight: '800', marginBottom: 6 },
  successSub:    { color: C.textLight, fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  successDivider:{ height: 1, backgroundColor: C.orangeLight, width: '100%', marginBottom: 16 },

  summaryRow:  { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14, alignSelf: 'flex-start' },
  summaryIcon: { fontSize: 28 },
  summaryTitle:{ color: C.textDark, fontSize: 15, fontWeight: '700' },
  summaryMeta: { color: C.textLight, fontSize: 12, marginTop: 2 },

  infoGrid: {
    flexDirection: 'row', backgroundColor: C.cream,
    borderRadius: 12, padding: 14, width: '100%', marginBottom: 10,
  },
  infoItem:    { flex: 1, alignItems: 'center' },
  infoDivider: { width: 1, backgroundColor: C.orangeLight },
  infoLabel:   { color: C.textLight, fontSize: 10, marginBottom: 4 },
  infoValue:   { color: C.navy, fontSize: 12, fontWeight: '800', textAlign: 'center' },

  successNote: { color: C.textMid, fontSize: 12, textAlign: 'center', marginBottom: 20 },
  doneBtn:     { backgroundColor: C.navy, borderRadius: 30, paddingVertical: 14, width: '100%', alignItems: 'center' },
  doneBtnText: { color: C.white, fontSize: 15, fontWeight: '700' },
});

