import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  Animated,
  Dimensions,
  TextInput,
  Platform,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const NEW_COLOR = '#1A7A7A'; // deep teal
const BG = '#E8F5F5';        // light teal background
const ACCENT = '#E8A020';    // amber accent

/* ─────────────────────────────────────────────
   CALENDAR MODAL
───────────────────────────────────────────── */
const CalendarModal = ({ visible, onClose, onSelectDate, selectedDate }) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const MONTHS = ['January','February','March','April','May','June',
    'July','August','September','October','November','December'];
  const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDay = (y, m) => new Date(y, m, 1).getDay();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDay(viewYear, viewMonth);
  const cells = Array(firstDay).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  const isSelected = (day) => {
    if (!selectedDate || !day) return false;
    return selectedDate.getDate() === day &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getFullYear() === viewYear;
  };

  const isPast = (day) => {
    if (!day) return false;
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0,0,0,0);
    const t = new Date(); t.setHours(0,0,0,0);
    return d < t;
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={cal.overlay} activeOpacity={1} onPress={onClose} />
      <View style={cal.container}>
        <View style={cal.header}>
          <TouchableOpacity onPress={prevMonth} style={cal.navBtn}>
            <Text style={cal.navArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={cal.monthYear}>{MONTHS[viewMonth]} {viewYear}</Text>
          <TouchableOpacity onPress={nextMonth} style={cal.navBtn}>
            <Text style={cal.navArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={cal.dayLabels}>
          {DAYS.map(d => (
            <Text key={d} style={cal.dayLabel}>{d}</Text>
          ))}
        </View>

        <View style={cal.grid}>
          {cells.map((day, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                cal.cell,
                isSelected(day) && cal.cellSelected,
                isPast(day) && cal.cellPast,
              ]}
              onPress={() => {
                if (!day || isPast(day)) return;
                const d = new Date(viewYear, viewMonth, day);
                onSelectDate(d);
                onClose();
              }}
              disabled={!day || isPast(day)}
            >
              <Text style={[
                cal.cellText,
                isSelected(day) && cal.cellTextSelected,
                isPast(day) && cal.cellTextPast,
              ]}>
                {day || ''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={cal.closeBtn} onPress={onClose}>
          <Text style={cal.closeBtnText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const cal = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' },
  container: {
    position: 'absolute', top: '50%', left: 20, right: 20, transform: [{ translateY: -230 }],
    backgroundColor: '#fff', borderRadius: 24, padding: 20, elevation: 15,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  navBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0FAFA', alignItems: 'center', justifyContent: 'center' },
  navArrow: { fontSize: 22, color: NEW_COLOR, fontWeight: '700' },
  monthYear: { fontSize: 17, fontWeight: '800', color: NEW_COLOR },
  dayLabels: { flexDirection: 'row', marginBottom: 8 },
  dayLabel: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '700', color: '#aaa' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100/7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
  cellSelected: { backgroundColor: NEW_COLOR },
  cellPast: { opacity: 0.3 },
  cellText: { fontSize: 14, fontWeight: '600', color: '#333' },
  cellTextSelected: { color: '#fff', fontWeight: '800' },
  cellTextPast: { color: '#ccc' },
  closeBtn: { marginTop: 16, alignItems: 'center', paddingVertical: 10 },
  closeBtnText: { color: '#999', fontSize: 14, fontWeight: '600' },
});

/* ─────────────────────────────────────────────
   ADDRESS SELECTION MODAL
───────────────────────────────────────────── */
const SAMPLE_ADDRESSES = [
  { id: 'a1', label: 'Home', address: 'Flat 4B, Block C, Green Valley Apartments, Madhapur, Hyderabad – 500081', icon: '🏠' },
  { id: 'a2', label: 'Office', address: '8th Floor, Skyview Tower, HITEC City, Hyderabad – 500032', icon: '🏢' },
  { id: 'a3', label: 'Flat 202', address: 'B-Block, Reliance Residency, Kondapur, Hyderabad – 500084', icon: '🏙️' },
];

const AddressModal = ({ visible, onClose, selectedAddress, onSelect }) => {
  const [search, setSearch] = useState('');
  const [customAddress, setCustomAddress] = useState('');
  const [adding, setAdding] = useState(false);

  const filtered = SAMPLE_ADDRESSES.filter(a =>
    a.address.toLowerCase().includes(search.toLowerCase()) ||
    a.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={addr.overlay} activeOpacity={1} onPress={onClose} />
      <View style={addr.sheet}>
        <View style={addr.handle} />
        <View style={addr.header}>
          <Text style={addr.title}>Select Service Location</Text>
          <TouchableOpacity onPress={onClose} style={addr.closeBtn}>
            <Text style={addr.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={addr.searchBox}>
          <MaterialCommunityIcons name="magnify" size={20} color="#bbb" style={{ marginRight: 8 }} />
          <TextInput
            style={addr.searchInput}
            placeholder="Search address..."
            placeholderTextColor="#bbb"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <Text style={addr.sectionLabel}>SAVED ADDRESSES</Text>
          {filtered.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[addr.addrCard, selectedAddress?.id === item.id && addr.addrCardActive]}
              onPress={() => { onSelect(item); onClose(); }}
            >
              <View style={addr.addrIcon}>
                <Text style={{ fontSize: 18 }}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[addr.addrLabel, selectedAddress?.id === item.id && addr.addrLabelActive]}>{item.label}</Text>
                <Text style={addr.addrText} numberOfLines={2}>{item.address}</Text>
              </View>
              {selectedAddress?.id === item.id && (
                <MaterialCommunityIcons name="check-circle" size={22} color={NEW_COLOR} />
              )}
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={addr.addNewBtn} onPress={() => setAdding(!adding)}>
            <Text style={addr.addNewText}>+ Add New Address</Text>
          </TouchableOpacity>

          {adding && (
            <View style={addr.newAddrBox}>
              <TextInput
                style={addr.newAddrInput}
                placeholder="Enter full address details..."
                placeholderTextColor="#bbb"
                value={customAddress}
                onChangeText={setCustomAddress}
                multiline
              />
              <TouchableOpacity
                style={[addr.addConfirmBtn, !customAddress.trim() && { opacity: 0.4 }]}
                disabled={!customAddress.trim()}
                onPress={() => {
                  const newAddr = { id: 'custom-' + Date.now(), label: 'New Location', address: customAddress, icon: '📍' };
                  onSelect(newAddr);
                  setAdding(false);
                  setCustomAddress('');
                  onClose();
                }}
              >
                <Text style={addr.addConfirmText}>Use This Address</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
};

const addr = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: SCREEN_HEIGHT * 0.75,
    backgroundColor: BG, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: 20,
  },
  handle: { width: 42, height: 5, borderRadius: 3, backgroundColor: '#DDD', alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0FAFA' },
  title: { fontSize: 18, fontWeight: '800', color: NEW_COLOR },
  closeBtn: { padding: 4 },
  closeText: { fontSize: 18, color: '#999', fontWeight: '600' },
  searchBox: { flexDirection: 'row', alignItems: 'center', margin: 16, backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1.5, borderColor: '#EEE' },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: ACCENT, letterSpacing: 1, marginLeft: 16, marginBottom: 8, marginTop: 4 },
  addrCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 10, backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 2, borderColor: 'transparent', elevation: 2 },
  addrCardActive: { borderColor: NEW_COLOR, backgroundColor: '#F0FAFA' },
  addrIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F0FAFA', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  addrLabel: { fontSize: 14, fontWeight: '700', color: '#102A2A', marginBottom: 3 },
  addrLabelActive: { color: NEW_COLOR },
  addrText: { fontSize: 12, color: '#888', lineHeight: 17 },
  addNewBtn: { marginHorizontal: 16, marginTop: 6, paddingVertical: 12, alignItems: 'center', borderWidth: 1.5, borderColor: ACCENT, borderRadius: 14, borderStyle: 'dashed' },
  addNewText: { color: ACCENT, fontSize: 14, fontWeight: '700' },
  newAddrBox: { marginHorizontal: 16, marginTop: 12 },
  newAddrInput: { backgroundColor: '#fff', borderRadius: 14, padding: 14, fontSize: 14, color: '#333', borderWidth: 1.5, borderColor: '#EEE', minHeight: 80, textAlignVertical: 'top', marginBottom: 10 },
  addConfirmBtn: { backgroundColor: ACCENT, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  addConfirmText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});

/* ─────────────────────────────────────────────
   PAYMENT MODAL
───────────────────────────────────────────── */
const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', sub: 'Pay via PhonePe, Google Pay', icon: '📱' },
  { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Master, Rupay', icon: '💳' },
  { id: 'cod', label: 'Pay After Cleaning', sub: 'Cash or Online after work', icon: '💵' },
];

const PaymentModal = ({ visible, onClose, onPay, totalAmount, selectedPayment, setSelectedPayment }) => {
  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={pay.overlay} activeOpacity={1} onPress={onClose} />
      <View style={pay.sheet}>
        <View style={pay.handle} />
        <View style={pay.header}>
          <Text style={pay.title}>Payment</Text>
          <TouchableOpacity onPress={onClose} style={pay.closeBtn}><Text style={pay.closeText}>✕</Text></TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={pay.amountBanner}>
            <Text style={pay.amountLabel}>Total Invoice Amount</Text>
            <Text style={pay.amountVal}>₹{totalAmount.toLocaleString('en-IN')}</Text>
            <Text style={pay.amountSub}>Incl. of cleaning materials & taxes</Text>
          </View>

          <Text style={pay.sectionLabel}>CHOOSE PAYMENT METHOD</Text>
          {PAYMENT_METHODS.map(method => (
            <TouchableOpacity
              key={method.id}
              style={[pay.methodCard, selectedPayment === method.id && pay.methodCardActive]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <View style={pay.methodIcon}><Text style={{ fontSize: 22 }}>{method.icon}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={[pay.methodLabel, selectedPayment === method.id && pay.methodLabelActive]}>{method.label}</Text>
                <Text style={pay.methodSub}>{method.sub}</Text>
              </View>
              <View style={[pay.radio, selectedPayment === method.id && pay.radioActive]}>
                {selectedPayment === method.id && <View style={pay.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ height: 120 }} />
        </ScrollView>

        <View style={pay.footer}>
          <TouchableOpacity style={[pay.payBtn, !selectedPayment && { opacity: 0.4 }]} disabled={!selectedPayment} onPress={onPay}>
            <Text style={pay.payBtnText}>
              {selectedPayment === 'cod' ? '✅ Confirm Booking' : `💳 Pay ₹${totalAmount.toLocaleString('en-IN')}`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const pay = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, height: SCREEN_HEIGHT * 0.8, backgroundColor: BG, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: 20 },
  handle: { width: 42, height: 5, borderRadius: 3, backgroundColor: '#DDD', alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0FAFA' },
  title: { fontSize: 18, fontWeight: '800', color: NEW_COLOR },
  closeBtn: { padding: 4 },
  closeText: { fontSize: 18, color: '#999', fontWeight: '600' },
  amountBanner: { margin: 16, backgroundColor: NEW_COLOR, borderRadius: 18, padding: 20, alignItems: 'center' },
  amountLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginBottom: 4 },
  amountVal: { fontSize: 34, fontWeight: '900', color: '#fff' },
  amountSub: { fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: ACCENT, letterSpacing: 1, marginLeft: 16, marginBottom: 8 },
  methodCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 10, backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 2, borderColor: 'transparent', elevation: 2 },
  methodCardActive: { borderColor: NEW_COLOR, backgroundColor: '#F0FAFA' },
  methodIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F0FAFA', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  methodLabel: { fontSize: 14, fontWeight: '700', color: '#102A2A' },
  methodLabelActive: { color: NEW_COLOR },
  methodSub: { fontSize: 12, color: '#888', marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#ccc', alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: NEW_COLOR },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: NEW_COLOR },
  footer: { paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0FAFA', backgroundColor: BG },
  payBtn: { backgroundColor: ACCENT, borderRadius: 50, paddingVertical: 16, alignItems: 'center' },
  payBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

/* ─────────────────────────────────────────────
   BOOKING STATUS TRACKER
───────────────────────────────────────────── */
const BookingStatusModal = ({ visible, onClose, bookingData }) => {
  const [currentStatus, setCurrentStatus] = useState(0);

  React.useEffect(() => {
    if (visible) {
      setCurrentStatus(0);
      const t1 = setTimeout(() => setCurrentStatus(1), 2000);
      const t2 = setTimeout(() => setCurrentStatus(2), 5000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [visible]);

  const statuses = [
    { icon: '📋', title: 'Booking Received', sub: 'We have received your deep cleaning request', done: currentStatus >= 0 },
    { icon: '🧹', title: 'Assigning Pro', sub: 'Finding the best cleaning team for you', done: currentStatus >= 1 },
    { icon: '✅', title: 'Cleaner Assigned', sub: 'Sunita B. and team will arrive on time', done: currentStatus >= 2 },
  ];

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={bst.overlay}>
        <View style={bst.card}>
          <Text style={bst.bigIcon}>✨</Text>
          <Text style={bst.title}>Professional Cleaning Booked!</Text>
          <Text style={bst.id}>Booking ID: #CLN{Math.floor(Math.random() * 90000) + 10000}</Text>

          <View style={bst.statusList}>
            {statuses.map((s, i) => (
              <View key={i} style={bst.statusItem}>
                <View style={[bst.statusDot, s.done && bst.statusDotDone]}>
                  {s.done ? <MaterialCommunityIcons name="check" size={16} color="#1A9E9E" /> : <View style={bst.dotSmall} />}
                </View>
                {i < statuses.length - 1 && <View style={[bst.statusLine, statuses[i+1].done && bst.statusLineDone]} />}
                <View style={bst.statusTextBox}>
                  <Text style={[bst.statusTitle, s.done && bst.statusTitleDone]}>{s.icon} {s.title}</Text>
                  <Text style={bst.statusSub}>{s.sub}</Text>
                </View>
              </View>
            ))}
          </View>

          {bookingData && (
            <View style={bst.summaryBox}>
              <Text style={bst.summaryRow}>📅 {bookingData.date}</Text>
              <Text style={bst.summaryRow}>⏰ {bookingData.slot}</Text>
              <Text style={bst.summaryRow}>📦 {bookingData.duration}</Text>
              {bookingData.address && <Text style={bst.summaryRow} numberOfLines={1}>📍 {bookingData.address}</Text>}
            </View>
          )}
          <TouchableOpacity style={bst.doneBtn} onPress={onClose}><Text style={bst.doneBtnText}>Great, thanks!</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const bst = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 28, padding: 28, width: '100%', alignItems: 'center', elevation: 12 },
  bigIcon: { fontSize: 52, marginBottom: 10 },
  title: { fontSize: 20, fontWeight: '900', color: NEW_COLOR, marginBottom: 4, textAlign: 'center' },
  id: { fontSize: 12, color: '#aaa', marginBottom: 20 },
  statusList: { width: '100%', marginBottom: 16 },
  statusItem: { flexDirection: 'row', alignItems: 'flex-start' },
  statusDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#EEE', alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 2, zIndex: 2 },
  statusDotDone: { backgroundColor: '#F0FAFA' },
  dotSmall: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#CCC' },
  statusLine: { position: 'absolute', left: 13, top: 30, width: 2, height: 35, backgroundColor: '#EEE', zIndex: 1 },
  statusLineDone: { backgroundColor: '#1A9E9E' },
  statusTextBox: { flex: 1, paddingBottom: 25 },
  statusTitle: { fontSize: 14, fontWeight: '700', color: '#ccc' },
  statusTitleDone: { color: '#102A2A' },
  statusSub: { fontSize: 12, color: '#aaa', marginTop: 2 },
  summaryBox: { backgroundColor: '#F0FAFA', borderRadius: 14, padding: 14, width: '100%', marginBottom: 20, gap: 6 },
  summaryRow: { fontSize: 13, color: '#555', fontWeight: '500' },
  doneBtn: { backgroundColor: NEW_COLOR, borderRadius: 50, paddingVertical: 14, paddingHorizontal: 60 },
  doneBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

/* ─────────────────────────────────────────────
   BOOKING FLOW SCREEN
───────────────────────────────────────────── */
const BookingScreen = ({ visible, onClose, onConfirm }) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [cleaningNote, setCleaningNote] = useState('');
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [step, setStep] = useState(1);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 12 }).start();
    } else {
      Animated.timing(slideAnim, { toValue: SCREEN_WIDTH, duration: 280, useNativeDriver: true }).start();
      setTimeout(() => {
        setSelectedDate(null); setSelectedSlot(null); setSelectedPackage(null);
        setCleaningNote(''); setStep(1); setSelectedAddress(null); setSelectedPayment(null);
      }, 300);
    }
  }, [visible]);

  const timeSlots = [
    { id: 's1', label: '8:00 AM – 12:00 PM', period: 'Morning Slot', available: true },
    { id: 's2', label: '1:00 PM – 5:00 PM', period: 'Afternoon Slot', available: true },
    { id: 's3', label: '6:00 PM – 9:00 PM', period: 'Evening Slot', available: false },
  ];

  const packages = [
    { id: 'p1', label: 'Basic Clean', sub: 'Sweep & Mop', rate: 1499 },
    { id: 'p2', label: 'Deep Clean', sub: 'Full Sanitization', rate: 3499 },
    { id: 'p3', label: 'Ultra Clean', sub: 'Deep + Carpet', rate: 5999 },
  ];

  const selectedSlotData = timeSlots.find(s => s.id === selectedSlot);
  const selectedPackData = packages.find(p => p.id === selectedPackage);
  const totalAmount = selectedPackData ? selectedPackData.rate : 0;
  const canProceed = selectedDate && selectedSlot && selectedPackage && selectedAddress;

  const handleFinalConfirm = () => {
    onConfirm({
      date: selectedDate?.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }),
      slot: selectedSlotData?.label,
      duration: selectedPackData?.label,
      address: selectedAddress?.address,
      payment: PAYMENT_METHODS.find(p => p.id === selectedPayment)?.label || '',
    });
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Animated.View style={[bk.screen, { transform: [{ translateX: slideAnim }] }]}>
        <SafeAreaView style={{ flex: 1, backgroundColor: NEW_COLOR }}>
          <StatusBar barStyle="light-content" />
          <View style={bk.header}>
            <TouchableOpacity onPress={step === 1 ? onClose : () => setStep(1)} style={bk.backBtn}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={bk.headerTitle}>{step === 1 ? 'Schedule Service' : 'Confirm Order'}</Text>
              <Text style={bk.headerSub}>{step === 1 ? 'Pick date & time' : 'Review details'}</Text>
            </View>
            <View style={{ width: 36 }} />
          </View>

          <View style={bk.stepRow}>
            {['Schedule', 'Confirm'].map((label, i) => (
              <View key={i} style={bk.stepItem}>
                <View style={[bk.stepCircle, step > i && bk.stepCircleDone, step === i + 1 && bk.stepCircleActive]}>
                  <Text style={[bk.stepNum, step === i + 1 && bk.stepNumActive]}>{step > i + 1 ? '✓' : i + 1}</Text>
                </View>
                <Text style={[bk.stepLabel, step === i + 1 && bk.stepLabelActive]}>{label}</Text>
                {i < 1 && <View style={[bk.stepConnector, step > i + 1 && bk.stepConnectorDone]} />}
              </View>
            ))}
          </View>

          <ScrollView style={bk.body} contentContainerStyle={{ paddingBottom: 100 }}>
            {step === 1 ? (
              <>
                <Text style={bk.sectionLabel}>📅 SELECT DATE</Text>
                <TouchableOpacity style={[bk.inputBox, selectedDate && bk.inputActive]} onPress={() => setCalendarOpen(true)}>
                  <MaterialCommunityIcons name="calendar" size={20} color={selectedDate ? NEW_COLOR : "#bbb"} style={{ marginRight: 10 }} />
                  <Text style={[bk.inputText, selectedDate && bk.inputTextSelected]}>
                    {selectedDate ? selectedDate.toLocaleDateString('en-IN', { dateStyle: 'full' }) : 'Tap to select date'}
                  </Text>
                  <MaterialCommunityIcons name="chevron-right" size={20} color="#ccc" />
                </TouchableOpacity>

                <Text style={bk.sectionLabel}>⏰ TIME SLOT</Text>
                <View style={bk.slotsGrid}>
                  {timeSlots.map(slot => (
                    <TouchableOpacity
                      key={slot.id} disabled={!slot.available}
                      style={[bk.slotCard, selectedSlot === slot.id && bk.slotActive, !slot.available && bk.slotDisabled]}
                      onPress={() => setSelectedSlot(slot.id)}
                    >
                      <Text style={[bk.slotPeriod, selectedSlot === slot.id && bk.slotTextActive]}>{slot.period}</Text>
                      <Text style={[bk.slotTime, selectedSlot === slot.id && bk.slotTextActive]}>{slot.label}</Text>
                      {!slot.available && <View style={bk.fullBadge}><Text style={bk.fullBadgeText}>Full</Text></View>}
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={bk.sectionLabel}>📦 SERVICE PACKAGE</Text>
                <View style={bk.packRow}>
                  {packages.map(pkg => (
                    <TouchableOpacity
                      key={pkg.id} style={[bk.packCard, selectedPackage === pkg.id && bk.packActive]}
                      onPress={() => setSelectedPackage(pkg.id)}
                    >
                      <Text style={[bk.packLabel, selectedPackage === pkg.id && bk.packLabelActive]}>{pkg.label}</Text>
                      <Text style={[bk.packRate, selectedPackage === pkg.id && bk.packRateActive]}>₹{pkg.rate}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={bk.sectionLabel}>📍 ADDRESS</Text>
                <TouchableOpacity style={[bk.inputBox, selectedAddress && bk.inputActive]} onPress={() => setAddressModalOpen(true)}>
                  <MaterialCommunityIcons name="map-marker" size={20} color={selectedAddress ? NEW_COLOR : "#bbb"} style={{ marginRight: 10 }} />
                  <Text style={[bk.inputText, selectedAddress && bk.inputTextSelected]} numberOfLines={1}>
                    {selectedAddress ? selectedAddress.address : 'Select service location'}
                  </Text>
                  <MaterialCommunityIcons name="chevron-right" size={20} color="#ccc" />
                </TouchableOpacity>

                <Text style={bk.sectionLabel}>📝 INSTRUCTIONS (OPTIONAL)</Text>
                <TextInput
                  style={bk.noteInput}
                  multiline placeholder="E.g. focus on the kitchen, pets are in the house..."
                  placeholderTextColor="#bbb"
                  value={cleaningNote} onChangeText={setCleaningNote}
                />
              </>
            ) : (
              <View style={bk.confirmCard}>
                <Text style={bk.confirmTitle}>Summary</Text>
                <View style={bk.summaryItem}><Text style={bk.sumLabel}>Date:</Text><Text style={bk.sumVal}>{selectedDate?.toDateString()}</Text></View>
                <View style={bk.summaryItem}><Text style={bk.sumLabel}>Slot:</Text><Text style={bk.sumVal}>{selectedSlotData?.label}</Text></View>
                <View style={bk.summaryItem}><Text style={bk.sumLabel}>Plan:</Text><Text style={bk.sumVal}>{selectedPackData?.label}</Text></View>
                <View style={bk.summaryItem}><Text style={bk.sumLabel}>Total:</Text><Text style={[bk.sumVal, { color: ACCENT }]}>₹{totalAmount}</Text></View>
              </View>
            )}
          </ScrollView>
          <View style={bk.footer}>
            <TouchableOpacity
              style={[bk.cta, !canProceed && bk.ctaDisabled]} disabled={!canProceed}
              onPress={() => step === 1 ? setStep(2) : setPaymentModalOpen(true)}
            >
              <Text style={bk.ctaText}>{step === 1 ? 'Verify Details' : 'Continue to Payment'}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <CalendarModal visible={calendarOpen} onClose={() => setCalendarOpen(false)} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        <AddressModal visible={addressModalOpen} onClose={() => setAddressModalOpen(false)} selectedAddress={selectedAddress} onSelect={setSelectedAddress} />
        <PaymentModal
          visible={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} totalAmount={totalAmount}
          selectedPayment={selectedPayment} setSelectedPayment={setSelectedPayment}
          onPay={() => { setPaymentModalOpen(false); setTimeout(handleFinalConfirm, 300); }}
        />
      </Animated.View>
    </Modal>
  );
};

const bk = StyleSheet.create({
  screen: { flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  header: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: NEW_COLOR, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 14 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 1 },
  stepRow: { flexDirection: 'row', backgroundColor: NEW_COLOR, paddingHorizontal: 40, paddingBottom: 16, alignItems: 'center', justifyContent: 'center' },
  stepItem: { flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  stepCircleActive: { backgroundColor: '#fff' },
  stepCircleDone: { backgroundColor: '#1A9E9E' },
  stepNum: { fontSize: 12, fontWeight: '800', color: 'rgba(255,255,255,0.5)' },
  stepNumActive: { color: NEW_COLOR },
  stepLabel: { fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.5)' },
  stepLabelActive: { color: '#fff' },
  stepConnector: { position: 'absolute', top: 14, right: -40, width: 80, height: 2, backgroundColor: 'rgba(255,255,255,0.2)' },
  stepConnectorDone: { backgroundColor: '#1A9E9E' },
  body: { flex: 1, backgroundColor: BG, paddingHorizontal: 16, paddingTop: 20 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: ACCENT, letterSpacing: 1, marginBottom: 10, marginTop: 15 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 14, elevation: 2 },
  inputActive: { borderWidth: 2, borderColor: NEW_COLOR, backgroundColor: '#F0FAFA' },
  inputText: { flex: 1, fontSize: 14, color: '#bbb', fontWeight: '600' },
  inputTextSelected: { color: NEW_COLOR },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slotCard: { width: '48%', backgroundColor: '#fff', borderRadius: 14, padding: 12, elevation: 2 },
  slotActive: { borderWidth: 2, borderColor: NEW_COLOR, backgroundColor: '#F0FAFA' },
  slotDisabled: { opacity: 0.5 },
  slotPeriod: { fontSize: 11, color: '#aaa', fontWeight: '600' },
  slotTime: { fontSize: 13, fontWeight: '700' },
  slotTextActive: { color: NEW_COLOR },
  fullBadge: { position: 'absolute', top: 8, right: 10, backgroundColor: '#F0FAFA', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  fullBadgeText: { fontSize: 10, color: '#D44', fontWeight: '700' },
  packRow: { flexDirection: 'row', gap: 8 },
  packCard: { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 12, alignItems: 'center', elevation: 2 },
  packActive: { borderColor: ACCENT, borderWidth: 2, backgroundColor: '#F0FAFA' },
  packLabel: { fontSize: 12, fontWeight: '800' },
  packLabelActive: { color: ACCENT },
  packRate: { fontSize: 14, fontWeight: '900', marginTop: 4 },
  packRateActive: { color: ACCENT },
  noteInput: { backgroundColor: '#fff', borderRadius: 14, padding: 14, fontSize: 14, minHeight: 80, textAlignVertical: 'top', elevation: 2 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingBottom: 30, paddingTop: 15, backgroundColor: BG },
  cta: { backgroundColor: NEW_COLOR, borderRadius: 50, paddingVertical: 16, alignItems: 'center' },
  ctaDisabled: { backgroundColor: '#E8F5F5' },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  confirmCard: { backgroundColor: '#fff', borderRadius: 18, padding: 18, elevation: 3 },
  confirmTitle: { fontSize: 16, fontWeight: '800', color: NEW_COLOR, marginBottom: 15 },
  summaryItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  sumLabel: { fontSize: 14, color: '#888' },
  sumVal: { fontSize: 14, fontWeight: '700' },
});

/* ─────────────────────────────────────────────
   MAIN DETAIL SCREEN
───────────────────────────────────────────── */
const HomeCleaningScreen = ({ navigation, route }) => {
  const { memberData } = route.params || {};
  const [bookingVisible, setBookingVisible] = useState(false);
  const [statusVisible, setStatusVisible] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const displayMember = memberData || {
    name: 'SwiftClean Team',
    rating: 4.8,
    jobs: 120,
    price: 1499
  };

  const handleConfirm = (data) => {
    setBookingData({ ...data, providerName: displayMember.name });
    setBookingVisible(false);
    setTimeout(() => setStatusVisible(true), 350);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cleaning Job Details</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.jobTitle}>{displayMember.name}'s Deep Cleaning 🧼</Text>
          <Text style={styles.postedBy}>Service by {displayMember.name} · Verified Pro</Text>
          <View style={styles.tagsRow}>
            <View style={[styles.tag, styles.tagUrgent]}><Text style={styles.tagTextUrgent}>URGENT</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>Full Day</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>⭐ 4.8</Text></View>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <ScrollView 
            style={styles.scrollBody} 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
          >
          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Base Pay</Text>
              <Text style={styles.infoValue}>₹{displayMember.price}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Team Size</Text>
              <Text style={styles.infoValue}>2-3 Pro</Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>DESCRIPTION</Text>
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>
              Complete deep cleaning of your 2BHK/3BHK apartment. Includes kitchen degreasing, bathroom sanitization, floor scrubbing, and balcony dusting.
              We bring all our own materials and equipment.
            </Text>
          </View>

          <Text style={styles.sectionLabel}>SERVICES INCLUDED</Text>
          <View style={styles.skillsRow}>
            {['Sanitization', 'Degreasing', 'Dusting', 'Scrubbing'].map((s) => (
              <View key={s} style={styles.skillChip}><Text style={styles.skillChipText}>{s}</Text></View>
            ))}
          </View>

          <Text style={styles.sectionLabel}>SERVICE PROVIDER</Text>
          <View style={styles.ratingCard}>
            <View style={styles.avatarCircle}><MaterialCommunityIcons name="account-group" size={24} color="#fff" /></View>
            <View style={styles.ratingInfo}>
              <Text style={styles.ratingName}>{displayMember.name}</Text>
              <View style={styles.starsRow}>
                <Text style={styles.stars}>★★★★★</Text>
                <Text style={styles.ratingMeta}>  {displayMember.rating} · {displayMember.jobs} jobs</Text>
              </View>
            </View>
          </View>
          <View style={{ height: 120 }} />
          </ScrollView>
        </View>

        <View style={styles.applyContainer}>
          <TouchableOpacity style={styles.applyButton} onPress={() => setBookingVisible(true)}>
            <Text style={styles.applyButtonText}>📦 Book This Service</Text>
          </TouchableOpacity>
        </View>

        <BookingScreen visible={bookingVisible} onClose={() => setBookingVisible(false)} onConfirm={handleConfirm} />
        <BookingStatusModal visible={statusVisible} onClose={() => setStatusVisible(false)} bookingData={bookingData} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: NEW_COLOR, height: Platform.OS === 'web' ? '100vh' : '100%' },
  container: { flex: 1, backgroundColor: BG, height: '100%' },
header: { flexDirection: 'row', alignItems: 'center', backgroundColor: NEW_COLOR, paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 10, paddingBottom: 10 },
  backButton: { padding: 4 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: '#fff' },
  heroCard: { backgroundColor: NEW_COLOR, paddingHorizontal: 20, paddingBottom: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  jobTitle: { fontSize: 24, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 5 },
  postedBy: { fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: 15 },
  tagsRow: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  tag: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 6 },
  tagUrgent: { backgroundColor: '#fff' },
  tagText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  tagTextUrgent: { color: NEW_COLOR, fontSize: 12, fontWeight: '800' },
  scrollBody: { flex: 1, width: '100%' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20 },
  infoRow: { flexDirection: 'row', gap: 12, marginBottom: 25 },
  infoCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16, elevation: 3 },
  infoLabel: { fontSize: 11, color: '#999', fontWeight: '600', marginBottom: 5 },
  infoValue: { fontSize: 22, fontWeight: '900', color: '#102A2A' },
  sectionLabel: { fontSize: 15, fontWeight: '800', color: ACCENT, letterSpacing: 1, marginBottom: 12, marginTop: 5 },
  descriptionBox: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 20, elevation: 2 },
  descriptionText: { fontSize: 14, color: '#555', lineHeight: 22 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  skillChip: { backgroundColor: '#F0FAFA', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8 },
  skillChipText: { color: NEW_COLOR, fontSize: 13, fontWeight: '700' },
  ratingCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  avatarCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: NEW_COLOR, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  ratingInfo: { flex: 1 },
  ratingName: { fontSize: 16, fontWeight: '700' },
  starsRow: { flexDirection: 'row', alignItems: 'center' },
  stars: { color: '#E8A020', fontSize: 14 },
  ratingMeta: { fontSize: 12, color: '#999' },
  applyContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: BG },
  applyButton: { backgroundColor: NEW_COLOR, borderRadius: 50, paddingVertical: 18, alignItems: 'center', elevation: 5 },
  applyButtonText: { color: '#fff', fontSize: 17, fontWeight: '800' },
});

export default HomeCleaningScreen;

