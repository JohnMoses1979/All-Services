import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Modal, FlatList, ScrollView, Platform,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../data/theme';

// ─── Input Field ───────────────────────────────────────────────────────────────
export const InputField = ({
  label, placeholder, value, onChangeText,
  keyboardType = 'default', multiline = false,
  required = false, error, maxLength, leftText,
}) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.label}>
      {label}{required && <Text style={styles.req}> *</Text>}
    </Text>
    <View style={[
      styles.inputRow,
      multiline && styles.inputMulti,
      error && styles.inputError,
    ]}>
      {leftText && (
        <View style={styles.leftTextWrap}>
          <Text style={styles.leftText}>{leftText}</Text>
          <View style={styles.leftDivider} />
        </View>
      )}
      <TextInput
        style={[styles.inputInner, multiline && { textAlignVertical: 'top', paddingTop: 12 }]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textLight}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        maxLength={maxLength}
      />
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

// ─── Spinner Column (used inside DOBPicker) ────────────────────────────────────
const ITEM_H = 46;
const VISIBLE = 5; // odd number so center is clear

const SpinnerColumn = ({ data, selected, onSelect, renderLabel }) => {
  const ref = useRef(null);
  const selectedIdx = data.indexOf(selected);

  // Scroll to selected item after modal opens
  useEffect(() => {
    if (ref.current && selectedIdx >= 0) {
      setTimeout(() => {
        ref.current?.scrollToIndex({
          index: selectedIdx,
          animated: false,
          viewPosition: 0.5,
        });
      }, 100);
    }
  }, [selectedIdx]);

  return (
    <View style={styles.spinnerCol}>
      <FlatList
        ref={ref}
        data={data}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        getItemLayout={(_, i) => ({ length: ITEM_H, offset: ITEM_H * i, index: i })}
        onScrollToIndexFailed={(info) => {
          // Fallback: scroll by offset if index scroll fails
          setTimeout(() => {
            ref.current?.scrollToOffset({
              offset: info.index * ITEM_H,
              animated: false,
            });
          }, 100);
        }}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
          const clamped = Math.max(0, Math.min(idx, data.length - 1));
          onSelect(data[clamped]);
        }}
        // padding so first/last items can reach center
        ListHeaderComponent={<View style={{ height: ITEM_H * Math.floor(VISIBLE / 2) }} />}
        ListFooterComponent={<View style={{ height: ITEM_H * Math.floor(VISIBLE / 2) }} />}
        renderItem={({ item }) => {
          const active = item === selected;
          return (
            <TouchableOpacity
              style={[styles.spinnerItem]}
              activeOpacity={0.6}
              onPress={() => {
                onSelect(item);
                const i = data.indexOf(item);
                ref.current?.scrollToIndex({ index: i, animated: true, viewPosition: 0.5 });
              }}
            >
              <Text style={[styles.spinnerText, active && styles.spinnerTextActive]}>
                {renderLabel ? renderLabel(item) : item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
      {/* Selection highlight lines — purely visual, non-blocking */}
      <View style={styles.spinnerTopLine} pointerEvents="none" />
      <View style={styles.spinnerBottomLine} pointerEvents="none" />
    </View>
  );
};

// ─── Date of Birth Picker ─────────────────────────────────────────────────────
export const DOBPicker = ({ label, value, onChange, required = false, error }) => {
  const [open, setOpen] = useState(false);

  const currentYear = new Date().getFullYear();
  const days   = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const months = [
    { val: '01', label: 'January' },  { val: '02', label: 'February' },
    { val: '03', label: 'March' },    { val: '04', label: 'April' },
    { val: '05', label: 'May' },      { val: '06', label: 'June' },
    { val: '07', label: 'July' },     { val: '08', label: 'August' },
    { val: '09', label: 'September' },{ val: '10', label: 'October' },
    { val: '11', label: 'November' }, { val: '12', label: 'December' },
  ];
  const years  = Array.from({ length: 60 }, (_, i) => String(currentYear - 18 - i));
  const monthVals = months.map(m => m.val);
  const monthName = (val) => months.find(m => m.val === val)?.label || val;

  const parsed   = value ? value.split('/') : [];
  const [tempDay,   setTempDay]   = useState(parsed[0] || days[0]);
  const [tempMonth, setTempMonth] = useState(parsed[1] || monthVals[0]);
  const [tempYear,  setTempYear]  = useState(parsed[2] || years[0]);

  const handleOpen = () => {
    const p = value ? value.split('/') : [];
    setTempDay(p[0]   || days[0]);
    setTempMonth(p[1] || monthVals[0]);
    setTempYear(p[2]  || years[0]);
    setOpen(true);
  };

  const handleConfirm = () => {
    onChange(`${tempDay}/${tempMonth}/${tempYear}`);
    setOpen(false);
  };

  const displayValue = value
    ? (() => {
        const [d, m, y] = value.split('/');
        return `${d} ${monthName(m)} ${y}`;
      })()
    : '';

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>
        {label}{required && <Text style={styles.req}> *</Text>}
      </Text>

      <TouchableOpacity
        style={[styles.inputRow, styles.dropTrigger, error && styles.inputError]}
        onPress={handleOpen}
        activeOpacity={0.7}
      >
        <Text style={displayValue ? styles.dropValue : styles.dropPlaceholder}>
          {displayValue || 'Select date of birth'}
        </Text>
        <Text style={styles.dobCalIcon}>📅</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal visible={open} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.dobModal}>

            <Text style={styles.dobModalTitle}>Date of Birth</Text>

            {/* Column labels */}
            <View style={styles.spinnerLabelRow}>
              <Text style={styles.spinnerLabel}>Day</Text>
              <Text style={styles.spinnerLabel}>Month</Text>
              <Text style={styles.spinnerLabel}>Year</Text>
            </View>

            {/* 3 spinners side by side */}
            <View style={styles.spinnerContainer}>
              <SpinnerColumn
                data={days}
                selected={tempDay}
                onSelect={setTempDay}
              />
              <View style={styles.spinnerDivider} />
              <SpinnerColumn
                data={monthVals}
                selected={tempMonth}
                onSelect={setTempMonth}
                renderLabel={monthName}
              />
              <View style={styles.spinnerDivider} />
              <SpinnerColumn
                data={years}
                selected={tempYear}
                onSelect={setTempYear}
              />
            </View>

            {/* Action buttons */}
            <View style={styles.dobActions}>
              <TouchableOpacity
                style={styles.dobCancelBtn}
                onPress={() => setOpen(false)}
              >
                <Text style={styles.dobCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dobConfirmBtn}
                onPress={handleConfirm}
              >
                <Text style={styles.dobConfirmText}>Confirm Date</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
};

// ─── Dropdown ──────────────────────────────────────────────────────────────────
export const Dropdown = ({ label, options, value, onChange, placeholder = 'Select...', required = false, error }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}{required && <Text style={styles.req}> *</Text>}</Text>
      <TouchableOpacity
        style={[styles.inputRow, styles.dropTrigger, error && styles.inputError]}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={value ? styles.dropValue : styles.dropPlaceholder}>{value || placeholder}</Text>
        <Text style={styles.dropArrow}>▾</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setOpen(false)} activeOpacity={1}>
          <View style={styles.dropModal}>
            <Text style={styles.dropModalTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.dropItem, value === item && styles.dropItemActive]}
                  onPress={() => { onChange(item); setOpen(false); }}
                >
                  <Text style={[styles.dropItemText, value === item && styles.dropItemTextActive]}>{item}</Text>
                  {value === item && <Text style={styles.checkIcon}>✓</Text>}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// ─── Multi-Select Chips ────────────────────────────────────────────────────────
export const MultiSelectChips = ({ label, options, selected = [], onChange, required = false }) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.label}>{label}{required && <Text style={styles.req}> *</Text>}</Text>
    <View style={styles.chipsWrap}>
      {options.map((item) => {
        const val     = typeof item === 'object' ? item.id    : item;
        const display = typeof item === 'object' ? `${item.icon} ${item.label}` : item;
        const active  = selected.includes(val);
        return (
          <TouchableOpacity
            key={val}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onChange(active ? selected.filter(s => s !== val) : [...selected, val])}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{display}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

// ─── Primary Button ────────────────────────────────────────────────────────────
export const PrimaryButton = ({ title, onPress, disabled = false, style }) => (
  <TouchableOpacity
    style={[styles.primaryBtn, disabled && styles.primaryBtnDisabled, style]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.85}
  >
    <Text style={styles.primaryBtnText}>{title}</Text>
  </TouchableOpacity>
);

// ─── Secondary Button ──────────────────────────────────────────────────────────
export const SecondaryButton = ({ title, onPress, style }) => (
  <TouchableOpacity style={[styles.secondaryBtn, style]} onPress={onPress} activeOpacity={0.75}>
    <Text style={styles.secondaryBtnText}>{title}</Text>
  </TouchableOpacity>
);

// ─── Progress Bar ──────────────────────────────────────────────────────────────
export const ProgressBar = ({ step, total, labels = [] }) => (
  <View style={styles.progressWrap}>
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${(step / total) * 100}%` }]} />
    </View>
    <Text style={styles.progressText}>
      Step {step} of {total}{labels[step - 1] ? ` · ${labels[step - 1]}` : ''}
    </Text>
  </View>
);

// ─── Section Header ────────────────────────────────────────────────────────────
export const SectionHeader = ({ title, subtitle }) => (
  <View style={styles.sectionHeaderWrap}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
  </View>
);

// ─── Upload Box ────────────────────────────────────────────────────────────────
export const UploadBox = ({ label, icon = '📎', uploaded = false, onPress, required = false }) => (
  <TouchableOpacity
    style={[styles.uploadBox, uploaded && styles.uploadBoxDone]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={styles.uploadIcon}>{uploaded ? '✅' : icon}</Text>
    <View style={{ flex: 1 }}>
      <Text style={styles.uploadLabel}>{label}{required && <Text style={styles.req}> *</Text>}</Text>
      <Text style={[styles.uploadStatus, uploaded && { color: COLORS.success }]}>
        {uploaded ? 'Uploaded' : 'Tap to upload'}
      </Text>
    </View>
    <Text style={styles.uploadArrow}>›</Text>
  </TouchableOpacity>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  fieldWrap: { marginBottom: SPACING.md },
  label: {
    fontSize: 13, fontWeight: '600', color: COLORS.textSecondary,
    marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  req: { color: COLORS.primary },

  // ── Input row ──
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md,
    backgroundColor: COLORS.white, overflow: 'hidden',
    minHeight: 50,
  },
  inputMulti: { alignItems: 'flex-start', minHeight: 90 },
  inputError: { borderColor: COLORS.error },

  // ── +91 prefix ──
  leftTextWrap: { flexDirection: 'row', alignItems: 'center', paddingLeft: SPACING.md },
  leftText: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  leftDivider: { width: 1, height: 22, backgroundColor: COLORS.border, marginLeft: 10 },

  // ── TextInput inside row ──
  inputInner: {
    flex: 1, fontSize: 15, color: COLORS.text,
    paddingHorizontal: SPACING.md, paddingVertical: 12,
  },

  errorText: { fontSize: 12, color: COLORS.error, marginTop: 4 },

  // ── Dropdown / DOB trigger ──
  dropTrigger: { paddingHorizontal: SPACING.md, justifyContent: 'space-between' },
  dropValue:   { fontSize: 15, color: COLORS.text, flex: 1 },
  dropPlaceholder: { fontSize: 15, color: COLORS.textLight, flex: 1 },
  dropArrow:   { fontSize: 16, color: COLORS.textSecondary },
  dobCalIcon:  { fontSize: 18 },

  // ── Modal overlay ──
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },

  // ── Dropdown modal ──
  dropModal: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl,
    maxHeight: '60%', paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  dropModalTitle: {
    fontSize: 16, fontWeight: '700', color: COLORS.text,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  dropItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: 14,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  dropItemActive: { backgroundColor: COLORS.primaryLight },
  dropItemText: { fontSize: 15, color: COLORS.text },
  dropItemTextActive: { color: COLORS.primaryDark, fontWeight: '600' },
  checkIcon: { color: COLORS.primary, fontSize: 16, fontWeight: '700' },

  // ── DOB modal shell ──
  dobModal: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  dobModalTitle: {
    fontSize: 16, fontWeight: '700', color: COLORS.text,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },

  // ── Spinner column labels ──
  spinnerLabelRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: 4,
  },
  spinnerLabel: {
    flex: 1, textAlign: 'center',
    fontSize: 11, fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.8,
  },

  // ── Spinner container ──
  spinnerContainer: {
    flexDirection: 'row',
    height: ITEM_H * VISIBLE,          // exactly 5 items tall
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    overflow: 'hidden',
  },
  spinnerCol: {
    flex: 1,
    overflow: 'hidden',
  },
  spinnerDivider: {
    width: 1, backgroundColor: COLORS.border, marginVertical: 8,
  },

  // ── Each item in spinner ──
  spinnerItem: {
    height: ITEM_H,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerText: {
    fontSize: 15, color: COLORS.textSecondary, fontWeight: '500',
  },
  spinnerTextActive: {
    fontSize: 18, color: COLORS.primary, fontWeight: '800',
  },

  // ── Selection highlight lines (top & bottom of center row) ──
  spinnerTopLine: {
    position: 'absolute',
    top: ITEM_H * Math.floor(VISIBLE / 2),      // 2 items from top
    left: 4, right: 4, height: 1.5,
    backgroundColor: COLORS.primary,
  },
  spinnerBottomLine: {
    position: 'absolute',
    top: ITEM_H * Math.floor(VISIBLE / 2) + ITEM_H, // 1 item below center
    left: 4, right: 4, height: 1.5,
    backgroundColor: COLORS.primary,
  },

  // ── DOB action buttons ──
  dobActions: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: 4,
  },
  dobCancelBtn: {
    flex: 1, borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: RADIUS.lg, paddingVertical: 13,
    alignItems: 'center', marginRight: 10,
  },
  dobCancelText: { color: COLORS.textSecondary, fontSize: 15, fontWeight: '600' },
  dobConfirmBtn: {
    flex: 2, backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg, paddingVertical: 13, alignItems: 'center',
  },
  dobConfirmText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },

  // ── Chips ──
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.full,
    paddingHorizontal: 12, paddingVertical: 7,
    backgroundColor: COLORS.white, marginBottom: 4,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  chipTextActive: { color: COLORS.white, fontWeight: '600' },

  // ── Buttons ──
  primaryBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.lg,
    paddingVertical: 16, alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  primaryBtnDisabled: { backgroundColor: COLORS.textLight, shadowOpacity: 0 },
  primaryBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  secondaryBtn: {
    borderWidth: 1.5, borderColor: COLORS.primary,
    borderRadius: RADIUS.lg, paddingVertical: 14, alignItems: 'center',
  },
  secondaryBtnText: { color: COLORS.primary, fontSize: 15, fontWeight: '600' },

  // ── Progress ──
  progressWrap: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  progressTrack: {
    height: 5, backgroundColor: COLORS.border,
    borderRadius: 10, overflow: 'hidden', marginBottom: 6,
  },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 10 },
  progressText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },

  // ── Section ──
  sectionHeaderWrap: { marginBottom: SPACING.lg },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text, letterSpacing: -0.3 },
  sectionSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4, lineHeight: 20 },

  // ── Upload ──
  uploadBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md,
    padding: SPACING.md, marginBottom: SPACING.sm,
  },
  uploadBoxDone: { borderColor: COLORS.success, backgroundColor: '#F0FAFA' },
  uploadIcon: { fontSize: 22, marginRight: SPACING.sm },
  uploadLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  uploadStatus: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  uploadArrow: { fontSize: 20, color: COLORS.textLight },
});