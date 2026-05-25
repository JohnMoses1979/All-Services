


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
} from 'react-native';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const NEW_COLOR = '#1A7A7A';
const BG = '#E8F5F5';
const ACCENT = '#E8A020';

/* ─────────────────────────────────────────────
   CALENDAR MODAL
───────────────────────────────────────────── */
const CalendarModal = ({ visible, onClose, onSelectDate, selectedDate }) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDay   = (y, m) => new Date(y, m, 1).getDay();

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay    = getFirstDay(viewYear, viewMonth);
  const cells = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const isSelected = (day) => {
    if (!selectedDate || !day) return false;
    return selectedDate.getDate() === day && selectedDate.getMonth() === viewMonth && selectedDate.getFullYear() === viewYear;
  };
  const isPast = (day) => {
    if (!day) return false;
    const d = new Date(viewYear, viewMonth, day); d.setHours(0,0,0,0);
    const t = new Date(); t.setHours(0,0,0,0);
    return d < t;
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={cal.overlay} activeOpacity={1} onPress={onClose} />
      <View style={cal.container}>
        <View style={cal.header}>
          <TouchableOpacity onPress={prevMonth} style={cal.navBtn}><Text style={cal.navArrow}>‹</Text></TouchableOpacity>
          <Text style={cal.monthYear}>{MONTHS[viewMonth]} {viewYear}</Text>
          <TouchableOpacity onPress={nextMonth} style={cal.navBtn}><Text style={cal.navArrow}>›</Text></TouchableOpacity>
        </View>
        <View style={cal.dayLabels}>{DAYS.map(d => <Text key={d} style={cal.dayLabel}>{d}</Text>)}</View>
        <View style={cal.grid}>
          {cells.map((day, idx) => (
            <TouchableOpacity
              key={idx}
              style={[cal.cell, isSelected(day) && cal.cellSelected, isPast(day) && cal.cellPast]}
              onPress={() => { if (!day || isPast(day)) return; onSelectDate(new Date(viewYear, viewMonth, day)); onClose(); }}
              disabled={!day || isPast(day)}
            >
              <Text style={[cal.cellText, isSelected(day) && cal.cellTextSelected, isPast(day) && cal.cellTextPast]}>{day || ''}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={cal.closeBtn} onPress={onClose}><Text style={cal.closeBtnText}>Cancel</Text></TouchableOpacity>
      </View>
    </Modal>
  );
};

const cal = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' },
  container: { position: 'absolute', top: '50%', left: 20, right: 20, transform: [{ translateY: -230 }], backgroundColor: '#fff', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 15 },
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
   ADDRESS MODAL
───────────────────────────────────────────── */
const INITIAL_ADDRESSES = [
  { id: 'a1', label: 'Home',         address: 'Flat 4B, Block C, Green Valley Apartments, Gachibowli, Hyderabad – 500032', icon: '🏠' },
  { id: 'a2', label: 'Office',       address: '3rd Floor, Cyber Towers, HITEC City, Madhapur, Hyderabad – 500081',         icon: '🏢' },
  { id: 'a3', label: 'Parents Home', address: '12-4-56, Mehdipatnam, Hyderabad – 500028',                                   icon: '👨‍👩‍👦' },
];
const ADDR_ICONS = ['🏠','🏢','👨‍👩‍👦','📍','🏥','🏨','🏫','📌'];

const AddressModal = ({ visible, onClose, selectedAddress, onSelect }) => {
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [search, setSearch]       = useState('');
  const [mode, setMode]           = useState('list');
  const [editTarget, setEditTarget] = useState(null);
  const [formLabel, setFormLabel]   = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formIcon, setFormIcon]     = useState('📍');

  const openAdd = () => { setFormLabel(''); setFormAddress(''); setFormIcon('📍'); setEditTarget(null); setMode('add'); };
  const openEdit = (item) => { setFormLabel(item.label); setFormAddress(item.address); setFormIcon(item.icon); setEditTarget(item); setMode('edit'); };

  const saveAddress = () => {
    if (!formAddress.trim()) return;
    if (mode === 'add') {
      const newAddr = { id: `custom_${Date.now()}`, label: formLabel.trim() || 'New Address', address: formAddress.trim(), icon: formIcon };
      setAddresses(prev => [...prev, newAddr]);
      onSelect(newAddr);
    } else if (mode === 'edit' && editTarget) {
      const updated = { ...editTarget, label: formLabel.trim() || editTarget.label, address: formAddress.trim(), icon: formIcon };
      setAddresses(prev => prev.map(a => a.id === editTarget.id ? updated : a));
      if (selectedAddress?.id === editTarget.id) onSelect(updated);
    }
    setMode('list'); onClose();
  };

  const deleteAddress = (id) => { setAddresses(prev => prev.filter(a => a.id !== id)); if (selectedAddress?.id === id) onSelect(null); };
  const filtered = addresses.filter(a => a.address.toLowerCase().includes(search.toLowerCase()) || a.label.toLowerCase().includes(search.toLowerCase()));

  if (mode === 'add' || mode === 'edit') {
    return (
      <Modal transparent visible={visible} animationType="slide" onRequestClose={() => setMode('list')}>
        <View style={addr.overlay}>
          <View style={addr.sheet}>
            <View style={addr.handle} />
            <View style={addr.header}>
              <TouchableOpacity onPress={() => setMode('list')} style={addr.backBtn}><Text style={addr.backArrow}>←</Text></TouchableOpacity>
              <Text style={addr.title}>{mode === 'add' ? 'Add New Address' : 'Edit Address'}</Text>
              <View style={{ width: 36 }} />
            </View>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
              <Text style={addr.formLabel}>Choose Icon</Text>
              <View style={addr.iconRow}>
                {ADDR_ICONS.map(ic => (
                  <TouchableOpacity key={ic} style={[addr.iconChip, formIcon === ic && addr.iconChipActive]} onPress={() => setFormIcon(ic)}>
                    <Text style={{ fontSize: 20 }}>{ic}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={addr.formLabel}>Label</Text>
              <TextInput style={addr.formInput} placeholder="e.g. Home" placeholderTextColor="#bbb" value={formLabel} onChangeText={setFormLabel} />
              <Text style={addr.formLabel}>Full Address *</Text>
              <TextInput style={[addr.formInput, { minHeight: 90, textAlignVertical: 'top' }]} placeholder="Enter complete address..." placeholderTextColor="#bbb" value={formAddress} onChangeText={setFormAddress} multiline />
              <TouchableOpacity style={[addr.saveBtn, !formAddress.trim() && { opacity: 0.4 }]} disabled={!formAddress.trim()} onPress={saveAddress}>
                <Text style={addr.saveBtnText}>{mode === 'add' ? '✓ Save & Use This Address' : '✓ Update Address'}</Text>
              </TouchableOpacity>
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={addr.overlay} activeOpacity={1} onPress={onClose} />
      <View style={addr.sheet}>
        <View style={addr.handle} />
        <View style={addr.header}>
          <Text style={addr.title}>Select Address</Text>
          <TouchableOpacity onPress={onClose} style={addr.closeXBtn}><Text style={addr.closeXText}>✕</Text></TouchableOpacity>
        </View>
        <View style={addr.searchBox}>
          <Text style={addr.searchIcon}>🔍</Text>
          <TextInput style={addr.searchInput} placeholder="Search address..." placeholderTextColor="#bbb" value={search} onChangeText={setSearch} />
          {search.length > 0 && <TouchableOpacity onPress={() => setSearch('')}><Text style={{ color: '#aaa', fontSize: 16 }}>✕</Text></TouchableOpacity>}
        </View>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <Text style={addr.sectionLabel}>SAVED ADDRESSES</Text>
          {filtered.map(item => (
            <View key={item.id} style={[addr.addrCard, selectedAddress?.id === item.id && addr.addrCardActive]}>
              <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} onPress={() => { onSelect(item); onClose(); }}>
                <View style={addr.addrIcon}><Text style={{ fontSize: 18 }}>{item.icon}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={[addr.addrLabel, selectedAddress?.id === item.id && addr.addrLabelActive]}>{item.label}</Text>
                  <Text style={addr.addrText} numberOfLines={2}>{item.address}</Text>
                </View>
                {selectedAddress?.id === item.id && <Text style={addr.checkmark}>✓</Text>}
              </TouchableOpacity>
              <View style={addr.addrActions}>
                <TouchableOpacity style={addr.editBtn} onPress={() => openEdit(item)}><Text style={addr.editBtnText}>✏️</Text></TouchableOpacity>
                <TouchableOpacity style={addr.deleteBtn} onPress={() => deleteAddress(item.id)}><Text style={addr.deleteBtnText}>🗑️</Text></TouchableOpacity>
              </View>
            </View>
          ))}
          {filtered.length === 0 && (
            <View style={{ alignItems: 'center', paddingVertical: 30 }}>
              <Text style={{ fontSize: 30 }}>📭</Text>
              <Text style={{ color: '#aaa', marginTop: 8, fontSize: 14 }}>No addresses found</Text>
            </View>
          )}
          <TouchableOpacity style={addr.addNewBtn} onPress={openAdd}><Text style={addr.addNewText}>+ Add New Address</Text></TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
};

const addr = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, height: SCREEN_HEIGHT * 0.78, backgroundColor: BG, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: Platform.OS === 'ios' ? 34 : 20 },
  handle: { width: 42, height: 5, borderRadius: 3, backgroundColor: '#DDD', alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0FAFA' },
  title: { fontSize: 18, fontWeight: '800', color: NEW_COLOR },
  closeXBtn: { padding: 4 }, closeXText: { fontSize: 18, color: '#999', fontWeight: '600' },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0FAFA', alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 20, color: NEW_COLOR, fontWeight: '700' },
  searchBox: { flexDirection: 'row', alignItems: 'center', margin: 16, backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1.5, borderColor: '#EEE' },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: ACCENT, letterSpacing: 1, marginLeft: 16, marginBottom: 8, marginTop: 4 },
  addrCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 10, backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 2, borderColor: 'transparent', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  addrCardActive: { borderColor: NEW_COLOR, backgroundColor: '#F0FAFA' },
  addrIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F0FAFA', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  addrLabel: { fontSize: 14, fontWeight: '700', color: '#102A2A', marginBottom: 3 },
  addrLabelActive: { color: NEW_COLOR },
  addrText: { fontSize: 12, color: '#888', lineHeight: 17 },
  checkmark: { fontSize: 18, color: NEW_COLOR, fontWeight: '800', marginHorizontal: 8 },
  addrActions: { flexDirection: 'row', gap: 4, marginLeft: 4 },
  editBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F0FAFA', alignItems: 'center', justifyContent: 'center' },
  editBtnText: { fontSize: 14 },
  deleteBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F0FAFA', alignItems: 'center', justifyContent: 'center' },
  deleteBtnText: { fontSize: 14 },
  addNewBtn: { marginHorizontal: 16, marginTop: 6, paddingVertical: 14, alignItems: 'center', borderWidth: 1.5, borderColor: ACCENT, borderRadius: 14, borderStyle: 'dashed' },
  addNewText: { color: ACCENT, fontSize: 14, fontWeight: '700' },
  formLabel: { fontSize: 12, fontWeight: '700', color: '#888', marginBottom: 8, marginTop: 16 },
  formInput: { backgroundColor: '#fff', borderRadius: 14, padding: 14, fontSize: 14, color: '#333', borderWidth: 1.5, borderColor: '#EEE' },
  iconRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  iconChip: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#fff', borderWidth: 2, borderColor: '#EEE', alignItems: 'center', justifyContent: 'center' },
  iconChipActive: { borderColor: NEW_COLOR, backgroundColor: '#F0FAFA' },
  saveBtn: { backgroundColor: ACCENT, borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginTop: 24 },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});

/* ─────────────────────────────────────────────
   PAYMENT MODAL
───────────────────────────────────────────── */
const PAYMENT_METHODS = [
  { id: 'upi',        label: 'UPI',                 sub: 'Pay via any UPI app',         icon: '📱' },
  { id: 'card',       label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Rupay',     icon: '💳' },
  { id: 'netbanking', label: 'Net Banking',          sub: 'All major banks supported',   icon: '🏦' },
  { id: 'wallet',     label: 'Wallet',               sub: 'Paytm, PhonePe, Amazon Pay', icon: '👛' },
  { id: 'cod',        label: 'Pay After Service',    sub: 'Cash on completion',          icon: '💵' },
];

const PaymentModal = ({ visible, onClose, onPay, totalAmount, selectedPayment, setSelectedPayment }) => {
  const [upiId, setUpiId]       = useState('');
  const [cardNum, setCardNum]   = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExp, setCardExp]   = useState('');
  const [cardCvv, setCardCvv]   = useState('');

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
            <Text style={pay.amountLabel}>Total Amount</Text>
            <Text style={pay.amountVal}>₹{totalAmount.toLocaleString('en-IN')}</Text>
            <Text style={pay.amountSub}>Inclusive of all charges</Text>
          </View>
          <Text style={pay.sectionLabel}>SELECT PAYMENT METHOD</Text>
          {PAYMENT_METHODS.map(method => (
            <TouchableOpacity key={method.id} style={[pay.methodCard, selectedPayment === method.id && pay.methodCardActive]} onPress={() => setSelectedPayment(method.id)}>
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
          {selectedPayment === 'upi' && (
            <View style={pay.inputSection}>
              <Text style={pay.inputLabel}>Enter UPI ID</Text>
              <TextInput style={pay.textInput} placeholder="yourname@upi" placeholderTextColor="#bbb" value={upiId} onChangeText={setUpiId} autoCapitalize="none" />
            </View>
          )}
          {selectedPayment === 'card' && (
            <View style={pay.inputSection}>
              <Text style={pay.inputLabel}>Card Number</Text>
              <TextInput style={pay.textInput} placeholder="1234 5678 9012 3456" placeholderTextColor="#bbb" value={cardNum} onChangeText={setCardNum} keyboardType="numeric" maxLength={19} />
              <Text style={pay.inputLabel}>Cardholder Name</Text>
              <TextInput style={pay.textInput} placeholder="Name on card" placeholderTextColor="#bbb" value={cardName} onChangeText={setCardName} />
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={pay.inputLabel}>Expiry</Text>
                  <TextInput style={pay.textInput} placeholder="MM/YY" placeholderTextColor="#bbb" value={cardExp} onChangeText={setCardExp} maxLength={5} keyboardType="numeric" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={pay.inputLabel}>CVV</Text>
                  <TextInput style={pay.textInput} placeholder="•••" placeholderTextColor="#bbb" value={cardCvv} onChangeText={setCardCvv} maxLength={3} secureTextEntry keyboardType="numeric" />
                </View>
              </View>
            </View>
          )}
          <View style={{ height: 120 }} />
        </ScrollView>
        <View style={pay.footer}>
          <TouchableOpacity style={[pay.payBtn, !selectedPayment && { opacity: 0.4 }]} disabled={!selectedPayment} activeOpacity={0.85} onPress={onPay}>
            <Text style={pay.payBtnText}>{selectedPayment === 'cod' ? '✅ Confirm Booking' : `💳 Pay ₹${totalAmount.toLocaleString('en-IN')}`}</Text>
          </TouchableOpacity>
          <Text style={pay.secureNote}>🔒 Secured by 256-bit SSL encryption</Text>
        </View>
      </View>
    </Modal>
  );
};

const pay = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, height: SCREEN_HEIGHT * 0.88, backgroundColor: BG, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: Platform.OS === 'ios' ? 34 : 20 },
  handle: { width: 42, height: 5, borderRadius: 3, backgroundColor: '#DDD', alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0FAFA' },
  title: { fontSize: 18, fontWeight: '800', color: NEW_COLOR },
  closeBtn: { padding: 4 }, closeText: { fontSize: 18, color: '#999', fontWeight: '600' },
  amountBanner: { margin: 16, backgroundColor: NEW_COLOR, borderRadius: 18, padding: 20, alignItems: 'center' },
  amountLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginBottom: 4 },
  amountVal: { fontSize: 34, fontWeight: '900', color: '#fff' },
  amountSub: { fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: ACCENT, letterSpacing: 1, marginLeft: 16, marginBottom: 8 },
  methodCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 10, backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 2, borderColor: 'transparent', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  methodCardActive: { borderColor: NEW_COLOR, backgroundColor: '#F0FAFA' },
  methodIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F0FAFA', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  methodLabel: { fontSize: 14, fontWeight: '700', color: '#102A2A' },
  methodLabelActive: { color: NEW_COLOR },
  methodSub: { fontSize: 12, color: '#888', marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#ccc', alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: NEW_COLOR },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: NEW_COLOR },
  inputSection: { marginHorizontal: 16, marginTop: 4 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#888', marginBottom: 6, marginTop: 12 },
  textInput: { backgroundColor: '#fff', borderRadius: 12, padding: 13, fontSize: 14, color: '#333', borderWidth: 1.5, borderColor: '#EEE' },
  footer: { paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0FAFA', backgroundColor: BG },
  payBtn: { backgroundColor: ACCENT, borderRadius: 50, paddingVertical: 16, alignItems: 'center', shadowColor: ACCENT, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 6 },
  payBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  secureNote: { textAlign: 'center', fontSize: 12, color: '#aaa', marginTop: 10, marginBottom: 4 },
});

/* ─────────────────────────────────────────────
   BOOKING STATUS MODAL
───────────────────────────────────────────── */
const BookingStatusModal = ({ visible, onClose, bookingData }) => {
  const [currentStatus, setCurrentStatus] = useState(0);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      setCurrentStatus(0);
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 8 }).start();
      const t1 = setTimeout(() => setCurrentStatus(1), 2000);
      const t2 = setTimeout(() => setCurrentStatus(2), 5000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [visible]);

  const statuses = [
    { icon: '📋', title: 'Booking Received',  sub: 'Your request has been submitted',   done: currentStatus >= 0 },
    { icon: '🔍', title: 'Matching Nurse',    sub: 'Finding the best match for you',    done: currentStatus >= 1 },
    { icon: '✅', title: 'Nurse Assigned',    sub: 'Professional has been notified',    done: currentStatus >= 2 },
  ];
  const bookingId = React.useRef(`#NRS${Math.floor(Math.random() * 90000) + 10000}`).current;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={bst.overlay}>
        <Animated.View style={[bst.card, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={bst.bigIcon}>🎉</Text>
          <Text style={bst.title}>Booking Confirmed!</Text>
          <Text style={bst.id}>Booking ID: {bookingId}</Text>
          <View style={bst.statusList}>
            {statuses.map((s, i) => (
              <View key={i} style={bst.statusItem}>
                <View style={[bst.statusDot, s.done && bst.statusDotDone]}>
                  <Text style={{ fontSize: s.done ? 12 : 14, color: s.done ? '#1A9E9E' : '#ccc' }}>{s.done ? '✓' : '○'}</Text>
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
              {bookingData.residentName  && <Text style={bst.summaryRow}>👤 {bookingData.residentName}</Text>}
              {bookingData.residentPhone && <Text style={bst.summaryRow}>📞 {bookingData.residentPhone}</Text>}
              <Text style={bst.summaryRow}>📅 {bookingData.date}</Text>
              <Text style={bst.summaryRow}>⏰ {bookingData.slot}</Text>
              <Text style={bst.summaryRow}>📆 {bookingData.duration}</Text>
              {bookingData.address && <Text style={bst.summaryRow} numberOfLines={1}>📍 {bookingData.address}</Text>}
              <Text style={bst.summaryRow}>💳 {bookingData.payment}</Text>
            </View>
          )}
          <TouchableOpacity style={bst.doneBtn} onPress={onClose}><Text style={bst.doneBtnText}>Done</Text></TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const bst = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 28, padding: 28, width: '100%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 12 },
  bigIcon: { fontSize: 52, marginBottom: 10 },
  title: { fontSize: 22, fontWeight: '900', color: NEW_COLOR, marginBottom: 4 },
  id: { fontSize: 12, color: '#aaa', marginBottom: 20 },
  statusList: { width: '100%', marginBottom: 16 },
  statusItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  statusDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#EEE', alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 2 },
  statusDotDone: { backgroundColor: '#F0FAFA' },
  statusLine: { position: 'absolute', left: 13, top: 30, width: 2, height: 30, backgroundColor: '#EEE' },
  statusLineDone: { backgroundColor: '#1A9E9E' },
  statusTextBox: { flex: 1, paddingBottom: 20 },
  statusTitle: { fontSize: 14, fontWeight: '700', color: '#ccc' },
  statusTitleDone: { color: '#102A2A' },
  statusSub: { fontSize: 12, color: '#aaa', marginTop: 2 },
  summaryBox: { backgroundColor: '#F0FAFA', borderRadius: 14, padding: 14, width: '100%', marginBottom: 20, gap: 6 },
  summaryRow: { fontSize: 13, color: '#555', fontWeight: '500' },
  doneBtn: { backgroundColor: NEW_COLOR, borderRadius: 50, paddingVertical: 14, paddingHorizontal: 60 },
  doneBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

/* ─────────────────────────────────────────────
   BOOKING SCREEN
───────────────────────────────────────────── */
const BookingScreen = ({ visible, onClose, onConfirm }) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const [calendarOpen, setCalendarOpen]         = useState(false);
  const [selectedDate, setSelectedDate]         = useState(null);
  const [selectedSlot, setSelectedSlot]         = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [nurseGender, setNurseGender]           = useState('Female');
  const [specialNote, setSpecialNote]           = useState('');
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress]   = useState(null);
  const [step, setStep]                         = useState(1);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment]   = useState(null);
  const [residentName, setResidentName]         = useState('');
  const [residentPhone, setResidentPhone]       = useState('');
  const [residentRelation, setResidentRelation] = useState('');

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 12 }).start();
    } else {
      Animated.timing(slideAnim, { toValue: SCREEN_WIDTH, duration: 280, useNativeDriver: true }).start();
      setTimeout(() => {
        setSelectedDate(null); setSelectedSlot(null); setSelectedDuration(null);
        setNurseGender('Female'); setSpecialNote(''); setStep(1);
        setSelectedAddress(null); setSelectedPayment(null);
        setResidentName(''); setResidentPhone(''); setResidentRelation('');
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
    { id: 'd1', label: '1 Day',   sub: 'Trial',   rate: 800   },
    { id: 'd2', label: '1 Week',  sub: '7 days',  rate: 5200  },
    { id: 'd3', label: '2 Weeks', sub: '14 days', rate: 9800  },
    { id: 'd4', label: '1 Month', sub: '30 days', rate: 18000 },
  ];
  const genders   = ['Female', 'Male', 'No Preference'];
  const relations = ['Self', 'Spouse', 'Parent', 'Child', 'Sibling', 'Other'];

  const selectedSlotData = timeSlots.find(s => s.id === selectedSlot);
  const selectedDurData  = durations.find(d => d.id === selectedDuration);
  const totalAmount      = selectedDurData ? selectedDurData.rate : 0;
  const paymentLabel     = PAYMENT_METHODS.find(p => p.id === selectedPayment)?.label || '';
  const canProceed = !!(selectedDate && selectedSlot && selectedDuration && selectedAddress && residentName.trim() && residentPhone.trim());

  const handleFinalConfirm = () => {
    onConfirm({
      residentName:     residentName.trim(),
      residentPhone:    residentPhone.trim(),
      residentRelation: residentRelation || 'Self',
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
          <StatusBar barStyle="light-content" backgroundColor={NEW_COLOR} />
          <View style={bk.header}>
            <TouchableOpacity onPress={step === 1 ? onClose : () => setStep(1)} style={bk.backBtn}>
              <Text style={bk.backArrow}>←</Text>
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={bk.headerTitle}>{step === 1 ? 'Book a Slot' : 'Confirm Booking'}</Text>
              <Text style={bk.headerSub}>{step === 1 ? 'Choose your schedule' : 'Review your details'}</Text>
            </View>
            <View style={{ width: 36 }} />
          </View>

          <View style={bk.stepRow}>
            {['Schedule', 'Confirm', 'Payment'].map((label, i) => (
              <View key={i} style={bk.stepItem}>
                <View style={[bk.stepCircle, step > i && bk.stepCircleDone, step === i+1 && bk.stepCircleActive]}>
                  <Text style={[bk.stepNum, (step > i || step === i+1) && bk.stepNumActive]}>{step > i+1 ? '✓' : i+1}</Text>
                </View>
                <Text style={[bk.stepLabel, step === i+1 && bk.stepLabelActive]}>{label}</Text>
                {i < 2 && <View style={[bk.stepConnector, step > i+1 && bk.stepConnectorDone]} />}
              </View>
            ))}
          </View>

          <ScrollView style={bk.body} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }} keyboardShouldPersistTaps="handled">
            {step === 1 ? (
              <>
                {/* Resident Details */}
                <View style={bk.sectionCard}>
                  <Text style={bk.sectionCardTitle}>👤 Resident / Patient Details</Text>
                  <Text style={bk.fieldLabel}>Full Name *</Text>
                  <TextInput style={bk.fieldInput} placeholder="Enter patient's full name" placeholderTextColor="#bbb" value={residentName} onChangeText={setResidentName} />
                  <Text style={bk.fieldLabel}>Mobile Number *</Text>
                  <TextInput style={bk.fieldInput} placeholder="10-digit mobile number" placeholderTextColor="#bbb" value={residentPhone} onChangeText={setResidentPhone} keyboardType="phone-pad" maxLength={10} />
                  <Text style={bk.fieldLabel}>Relation to Patient</Text>
                  <View style={bk.relationRow}>
                    {relations.map(r => (
                      <TouchableOpacity key={r} style={[bk.relationChip, residentRelation === r && bk.relationChipActive]} onPress={() => setResidentRelation(r)}>
                        <Text style={[bk.relationText, residentRelation === r && bk.relationTextActive]}>{r}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Date */}
                <Text style={bk.sectionLabel}>📅 Start Date</Text>
                <TouchableOpacity style={[bk.datePicker, selectedDate && bk.datePickerSelected]} onPress={() => setCalendarOpen(true)}>
                  <Text style={{ fontSize: 20, marginRight: 10 }}>🗓</Text>
                  <Text style={[bk.datePickerText, selectedDate && bk.datePickerTextSelected]}>
                    {selectedDate ? selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Tap to select a date'}
                  </Text>
                  <Text style={bk.datePickerArrow}>›</Text>
                </TouchableOpacity>

                {/* Time Slots */}
                <Text style={bk.sectionLabel}>⏰ Time Slot</Text>
                <View style={bk.slotsGrid}>
                  {timeSlots.map(slot => (
                    <TouchableOpacity key={slot.id} disabled={!slot.available} style={[bk.slotCard, selectedSlot === slot.id && bk.slotCardActive, !slot.available && bk.slotCardDisabled]} onPress={() => setSelectedSlot(slot.id)}>
                      <Text style={[bk.slotPeriod, selectedSlot === slot.id && bk.slotTextActive, !slot.available && bk.slotTextDim]}>{slot.period}</Text>
                      <Text style={[bk.slotTime, selectedSlot === slot.id && bk.slotTextActive, !slot.available && bk.slotTextDim]}>{slot.label}</Text>
                      {!slot.available && <View style={bk.fullBadge}><Text style={bk.fullBadgeText}>Full</Text></View>}
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Duration */}
                <Text style={bk.sectionLabel}>📆 Duration</Text>
                <View style={bk.durRow}>
                  {durations.map(dur => (
                    <TouchableOpacity key={dur.id} style={[bk.durCard, selectedDuration === dur.id && bk.durCardActive]} onPress={() => setSelectedDuration(dur.id)}>
                      <Text style={[bk.durLabel, selectedDuration === dur.id && bk.durLabelActive]}>{dur.label}</Text>
                      <Text style={[bk.durSub, selectedDuration === dur.id && bk.durSubActive]}>{dur.sub}</Text>
                      <Text style={[bk.durRate, selectedDuration === dur.id && bk.durRateActive]}>₹{dur.rate.toLocaleString('en-IN')}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Address */}
                <Text style={bk.sectionLabel}>📍 Service Address</Text>
                <TouchableOpacity style={[bk.addrPicker, selectedAddress && bk.addrPickerSelected]} onPress={() => setAddressModalOpen(true)}>
                  {selectedAddress ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <Text style={{ fontSize: 20, marginRight: 10 }}>{selectedAddress.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={bk.addrLabel}>{selectedAddress.label}</Text>
                        <Text style={bk.addrText} numberOfLines={2}>{selectedAddress.address}</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <Text style={{ fontSize: 20, marginRight: 10 }}>📍</Text>
                      <Text style={bk.addrPlaceholder}>Select service address</Text>
                    </View>
                  )}
                  <Text style={bk.datePickerArrow}>›</Text>
                </TouchableOpacity>

                {/* Gender */}
                <Text style={bk.sectionLabel}>👤 Nurse Gender Preference</Text>
                <View style={bk.genderRow}>
                  {genders.map(g => (
                    <TouchableOpacity key={g} style={[bk.genderChip, nurseGender === g && bk.genderChipActive]} onPress={() => setNurseGender(g)}>
                      <Text style={[bk.genderText, nurseGender === g && bk.genderTextActive]}>{g}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Note */}
                <Text style={bk.sectionLabel}>📝 Special Instructions (Optional)</Text>
                <TextInput style={bk.noteInput} multiline numberOfLines={3} placeholder="E.g. patient is diabetic, needs IV care..." placeholderTextColor="#bbb" value={specialNote} onChangeText={setSpecialNote} />

                {(!residentName.trim() || !residentPhone.trim()) && (
                  <View style={bk.hintBox}>
                    <Text style={bk.hintText}>⚠️ Please fill in Resident Name and Mobile Number to proceed.</Text>
                  </View>
                )}
              </>
            ) : (
              <>
                <View style={bk.confirmCard}>
                  <Text style={bk.confirmTitle}>👤 Resident / Patient Details</Text>
                  {[
                    { label: 'Name',     value: residentName },
                    { label: 'Mobile',   value: `+91 ${residentPhone}` },
                    { label: 'Relation', value: residentRelation || 'Self' },
                  ].map((row, i) => (
                    <View key={i}>
                      {i > 0 && <View style={bk.divider} />}
                      <View style={bk.summaryRow}>
                        <Text style={bk.summaryLabel}>{row.label}</Text>
                        <Text style={bk.summaryValue}>{row.value}</Text>
                      </View>
                    </View>
                  ))}
                </View>
                <View style={bk.confirmCard}>
                  <Text style={bk.confirmTitle}>📋 Booking Summary</Text>
                  {[
                    { label: '📅 Start Date',   value: selectedDate?.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) },
                    { label: '⏰ Time Slot',    value: selectedSlotData?.label },
                    { label: '📆 Duration',     value: selectedDurData ? `${selectedDurData.label} (${selectedDurData.sub})` : '' },
                    { label: '👤 Nurse Gender', value: nurseGender },
                    { label: '📍 Address',      value: selectedAddress?.address },
                    ...(specialNote.trim() ? [{ label: '📝 Note', value: specialNote }] : []),
                  ].map((row, i) => (
                    <View key={i}>
                      {i > 0 && <View style={bk.divider} />}
                      <View style={bk.summaryRow}>
                        <Text style={bk.summaryLabel}>{row.label}</Text>
                        <Text style={bk.summaryValue} numberOfLines={2}>{row.value}</Text>
                      </View>
                    </View>
                  ))}
                </View>
                <View style={bk.amountCard}>
                  <Text style={bk.amountTitle}>💰 Payment Estimate</Text>
                  <View style={bk.summaryRow}>
                    <Text style={bk.amountLabel2}>Base Rate</Text>
                    <Text style={bk.amountValue}>₹800 / day</Text>
                  </View>
                  <View style={bk.summaryRow}>
                    <Text style={bk.amountLabel2}>Duration</Text>
                    <Text style={bk.amountValue}>{selectedDurData?.sub}</Text>
                  </View>
                  <View style={bk.divider} />
                  <View style={bk.summaryRow}>
                    <Text style={bk.totalLabel}>Total Estimated</Text>
                    <Text style={bk.totalVal}>₹{totalAmount.toLocaleString('en-IN')}</Text>
                  </View>
                  <Text style={bk.amountNote}>* Final amount may vary. Pay after service.</Text>
                </View>
                {selectedPayment && (
                  <View style={[bk.confirmCard, { marginTop: 0 }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={bk.confirmTitle}>💳 Payment Method</Text>
                      <TouchableOpacity onPress={() => setPaymentModalOpen(true)}><Text style={{ color: ACCENT, fontWeight: '700', fontSize: 13 }}>Change</Text></TouchableOpacity>
                    </View>
                    <Text style={bk.summaryValue}>{paymentLabel}</Text>
                  </View>
                )}
              </>
            )}
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
        </SafeAreaView>

        <CalendarModal visible={calendarOpen} onClose={() => setCalendarOpen(false)} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        <AddressModal visible={addressModalOpen} onClose={() => setAddressModalOpen(false)} selectedAddress={selectedAddress} onSelect={setSelectedAddress} />
        <PaymentModal visible={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} totalAmount={totalAmount} selectedPayment={selectedPayment} setSelectedPayment={setSelectedPayment}
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
  body: { flex: 1, backgroundColor: BG, paddingHorizontal: 16, paddingTop: 20 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: ACCENT, letterSpacing: 0.8, marginBottom: 10, marginTop: 6 },
  sectionCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3 },
  sectionCardTitle: { fontSize: 14, fontWeight: '800', color: NEW_COLOR, marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: '#888', marginBottom: 6, marginTop: 10 },
  fieldInput: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 13, fontSize: 14, color: '#333', borderWidth: 1.5, borderColor: '#EEE' },
  relationRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  relationChip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#EEE' },
  relationChipActive: { borderColor: NEW_COLOR, backgroundColor: '#F0FAFA' },
  relationText: { fontSize: 12, fontWeight: '600', color: '#555' },
  relationTextActive: { color: NEW_COLOR },
  datePicker: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 2, borderColor: 'transparent', marginBottom: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  datePickerSelected: { borderColor: NEW_COLOR, backgroundColor: '#F0FAFA' },
  datePickerText: { flex: 1, fontSize: 14, color: '#bbb', fontWeight: '600' },
  datePickerTextSelected: { color: NEW_COLOR },
  datePickerArrow: { fontSize: 22, color: '#ccc' },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 6 },
  slotCard: { width: '47%', backgroundColor: '#fff', borderRadius: 14, padding: 12, borderWidth: 2, borderColor: 'transparent', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2, position: 'relative' },
  slotCardActive: { borderColor: NEW_COLOR, backgroundColor: '#F0FAFA' },
  slotCardDisabled: { backgroundColor: '#FFFFFF', opacity: 0.6 },
  slotPeriod: { fontSize: 11, color: '#aaa', fontWeight: '600', marginBottom: 3 },
  slotTime: { fontSize: 13, fontWeight: '700', color: '#102A2A' },
  slotTextActive: { color: NEW_COLOR },
  slotTextDim: { color: '#ccc' },
  fullBadge: { position: 'absolute', top: 8, right: 10, backgroundColor: '#F0FAFA', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  fullBadgeText: { fontSize: 10, color: '#D44', fontWeight: '700' },
  durRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginBottom: 6 },
  durCard: { flex: 1, minWidth: '22%', backgroundColor: '#fff', borderRadius: 14, paddingVertical: 12, paddingHorizontal: 8, alignItems: 'center', borderWidth: 2, borderColor: 'transparent', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  durCardActive: { borderColor: ACCENT, backgroundColor: '#F0FAFA' },
  durLabel: { fontSize: 13, fontWeight: '800', color: '#102A2A', textAlign: 'center' },
  durLabelActive: { color: ACCENT },
  durSub: { fontSize: 10, color: '#aaa', marginTop: 2 },
  durSubActive: { color: ACCENT },
  durRate: { fontSize: 12, color: '#888', fontWeight: '700', marginTop: 4 },
  durRateActive: { color: ACCENT },
  addrPicker: { backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 2, borderColor: 'transparent', flexDirection: 'row', alignItems: 'center', marginBottom: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  addrPickerSelected: { borderColor: NEW_COLOR, backgroundColor: '#F0FAFA' },
  addrLabel: { fontSize: 13, fontWeight: '700', color: NEW_COLOR, marginBottom: 2 },
  addrText: { fontSize: 12, color: '#555', lineHeight: 17 },
  addrPlaceholder: { fontSize: 14, color: '#bbb', fontWeight: '600' },
  genderRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 6 },
  genderChip: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#fff', borderWidth: 2, borderColor: 'transparent', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  genderChipActive: { borderColor: NEW_COLOR, backgroundColor: '#F0FAFA' },
  genderText: { fontSize: 13, fontWeight: '600', color: '#555' },
  genderTextActive: { color: NEW_COLOR },
  noteInput: { backgroundColor: '#fff', borderRadius: 14, padding: 14, fontSize: 14, color: '#333', borderWidth: 1.5, borderColor: '#EEE', textAlignVertical: 'top', minHeight: 80, marginBottom: 10 },
  hintBox: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#F0FAFA' },
  hintText: { fontSize: 12, color: '#E8A020', fontWeight: '600' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingBottom: Platform.OS === 'ios' ? 34 : 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0FAFA', backgroundColor: BG },
  cta: { backgroundColor: NEW_COLOR, borderRadius: 50, paddingVertical: 16, alignItems: 'center', shadowColor: NEW_COLOR, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
  ctaDisabled: { backgroundColor: '#E8F5F5', shadowOpacity: 0 },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
  confirmCard: { backgroundColor: '#fff', borderRadius: 18, padding: 18, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 },
  confirmTitle: { fontSize: 15, fontWeight: '800', color: NEW_COLOR, marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 8 },
  summaryLabel: { fontSize: 13, color: '#888', fontWeight: '500', flex: 1 },
  summaryValue: { fontSize: 13, color: '#102A2A', fontWeight: '700', textAlign: 'right', flex: 1.2 },
  divider: { height: 1, backgroundColor: '#F0FAFA' },
  amountCard: { backgroundColor: '#F0FAFA', borderRadius: 18, padding: 18, borderWidth: 1.5, borderColor: '#E8F5F5', marginBottom: 14 },
  amountTitle: { fontSize: 15, fontWeight: '800', color: ACCENT, marginBottom: 12 },
  amountLabel2: { fontSize: 13, color: '#E8A020', fontWeight: '500', flex: 1 },
  amountValue: { fontSize: 13, color: '#102A2A', fontWeight: '700' },
  totalLabel: { fontSize: 15, fontWeight: '800', color: NEW_COLOR, flex: 1 },
  totalVal: { fontSize: 18, fontWeight: '900', color: NEW_COLOR },
  amountNote: { fontSize: 11, color: '#bbb', marginTop: 8, textAlign: 'center' },
});

/* ─────────────────────────────────────────────
   MAIN SCREEN — HomeNurseScreen
───────────────────────────────────────────── */
export default function HomeNurseScreen({ navigation, route }) {
  // ── Read workerData passed from MedicalWorkersListScreen ──────────────────
  const workerData = route?.params?.workerData;

  const workerName    = workerData?.name         || 'Suresh T.';
  const workerRating  = workerData?.rating       || 4.6;
  const workerReviews = workerData?.reviews      || 5;
  const workerInitial = workerData?.initials?.[0]|| 'S';
  const skills        = workerData?.skills       || ['Post-Surgery', 'Dressing', 'Meds'];
  const workerGender  = workerData?.gender       || 'Female';

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
          <Text style={styles.headerTitle}>Job Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={styles.ratingPill}>
            <Text style={styles.ratingPillText}>Rating {workerRating}</Text>
          </View>
          <Text style={styles.jobTitle}>Home Nurse Needed 🩺</Text>
          <Text style={styles.postedBy}>Posted by {workerName} · Block C</Text>
          <View style={styles.tagsRow}>
            <View style={[styles.tag, styles.tagUrgent]}><Text style={styles.tagTextUrgent}>URGENT</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>{workerGender === 'Female' ? 'Female Nurse' : 'Male Nurse'}</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>{workerData?.location || '0.8 km'}</Text></View>
          </View>
        </View>

        {/* Body */}
        <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Pay / Day</Text>
              <Text style={styles.infoValue}>₹800</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Shift</Text>
              <Text style={styles.infoValue}>7–11 AM</Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>DESCRIPTION</Text>
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>
              Need a home nurse for morning care. Patient is post-surgery recovery.
              Medication &amp; dressing change daily.{' '}
              <Text style={styles.descriptionTextMuted}>
                {workerGender === 'Female' ? 'Female nurse preferred.' : 'Male nurse acceptable.'}
              </Text>
            </Text>
          </View>

          <Text style={styles.sectionLabel}>SKILLS</Text>
          <View style={styles.skillsRow}>
            {skills.map(skill => (
              <View key={skill} style={styles.skillChip}>
                <Text style={styles.skillChipText}>{skill}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionLabel}>WORKER RATING</Text>
          <View style={styles.ratingCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{workerInitial}</Text>
            </View>
            <View style={styles.ratingInfo}>
              <Text style={styles.ratingName}>{workerName}</Text>
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
  scrollBody: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20 },
  infoRow:   { flexDirection: 'row', gap: 12, marginBottom: 22 },
  infoCard:  { flex: 1, backgroundColor: '#fff', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3 },
  infoLabel: { fontSize: 11, color: '#999', fontWeight: '500', letterSpacing: 0.3, marginBottom: 4 },
  infoValue: { fontSize: 22, fontWeight: '800', color: '#102A2A' },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: ACCENT, letterSpacing: 1.2, marginBottom: 10 },
  descriptionBox: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 22, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  descriptionText: { fontSize: 14, color: '#333', lineHeight: 22, fontWeight: '500' },
  descriptionTextMuted: { color: '#999', fontWeight: '400' },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 22 },
  skillChip: { backgroundColor: '#F0FAFA', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  skillChipText: { color: NEW_COLOR, fontSize: 13, fontWeight: '600' },
  ratingCard: { backgroundColor: '#fff', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 22, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  avatarCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: NEW_COLOR, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText:  { color: '#fff', fontSize: 18, fontWeight: '800' },
  ratingInfo:  { flex: 1 },
  ratingName:  { fontSize: 15, fontWeight: '700', color: '#102A2A', marginBottom: 3 },
  starsRow:    { flexDirection: 'row', alignItems: 'center' },
  stars:       { color: '#E8A020', fontSize: 15 },
  starsEmpty:  { color: '#DDD', fontSize: 15 },
  ratingMeta:  { fontSize: 12, color: '#888', fontWeight: '500' },
  applyContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingBottom: 28, paddingTop: 10, backgroundColor: BG },
  applyButton: { backgroundColor: NEW_COLOR, borderRadius: 50, paddingVertical: 17, alignItems: 'center', shadowColor: NEW_COLOR, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 6, marginBottom: 50 },
  applyButtonText: { color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 0.3 },
});

