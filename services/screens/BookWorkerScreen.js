import React, { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import providerApi from "../api/providerApi";
import { OWNER_COLORS } from "../styles/ownerTheme";

const C = {
  bg: OWNER_COLORS.background,
  card: OWNER_COLORS.surface,
  text: OWNER_COLORS.text,
  muted: OWNER_COLORS.muted,
  border: OWNER_COLORS.border,
  primary: OWNER_COLORS.primary,
  green: OWNER_COLORS.primary,
  accent: OWNER_COLORS.accent,
  soft: OWNER_COLORS.surfaceAlt,
};

const formatDateValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const todayText = () => formatDateValue(new Date());
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];

const parseDateValue = (value) => {
  const [year, month, day] = `${value}`.split("-").map(Number);
  if (!year || !month || !day) return new Date();
  return new Date(year, month - 1, day);
};

const buildCalendarDays = (monthDate) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: firstDay }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
};

const parseTimeValue = (value) => {
  const match = `${value}`.trim().match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  if (!match) return { hour: 10, minute: 0, period: "AM" };
  return {
    hour: Math.max(1, Math.min(12, Number(match[1]))),
    minute: Math.max(0, Math.min(59, Number(match[2]))),
    period: match[3].toUpperCase(),
  };
};

const formatTimeValue = ({ hour, minute, period }) =>
  `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;

const adjustTimeValue = (timeValue, key, delta) => {
  const next = parseTimeValue(timeValue);
  if (key === "hour") {
    next.hour = ((next.hour - 1 + delta + 12) % 12) + 1;
  }
  if (key === "minute") {
    next.minute = (next.minute + delta + 60) % 60;
  }
  return formatTimeValue(next);
};

const parseTimeRange = (value) => {
  const [start, end] = `${value}`.split(/\s*-\s*/);
  return {
    startTime: start || "10:00 AM",
    endTime: end || "11:00 AM",
  };
};

function CalendarPicker({ selectedDate, onSelect }) {
  const [visibleMonth, setVisibleMonth] = useState(() => parseDateValue(selectedDate));
  const days = buildCalendarDays(visibleMonth);

  const moveMonth = (direction) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
  };

  return (
    <View style={styles.calendarBox}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity style={styles.calendarNavBtn} onPress={() => moveMonth(-1)}>
          <Text style={styles.calendarNavText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.calendarTitle}>{MONTHS[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}</Text>
        <TouchableOpacity style={styles.calendarNavBtn} onPress={() => moveMonth(1)}>
          <Text style={styles.calendarNavText}>{">"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.weekRow}>
        {WEEK_DAYS.map((day, index) => <Text key={`${day}-${index}`} style={styles.weekDay}>{day}</Text>)}
      </View>
      <View style={styles.dayGrid}>
        {days.map((date, index) => {
          const value = date ? formatDateValue(date) : "";
          const selected = value === selectedDate;
          return (
            <TouchableOpacity
              key={`${value}-${index}`}
              style={[styles.dayCell, selected && styles.dayCellActive, !date && styles.dayCellEmpty]}
              onPress={() => date && onSelect(value)}
              disabled={!date}
            >
              <Text style={[styles.dayText, selected && styles.dayTextActive]}>{date ? date.getDate() : ""}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function TimePicker({ value, onChange }) {
  const parsed = parseTimeValue(value);
  return (
    <View style={styles.timePicker}>
      {[
        ["hour", String(parsed.hour).padStart(2, "0")],
        ["minute", String(parsed.minute).padStart(2, "0")],
      ].map(([key, display]) => (
        <View key={key} style={styles.timeColumn}>
          <TouchableOpacity style={styles.timeStepBtn} onPress={() => onChange(adjustTimeValue(value, key, key === "minute" ? 5 : 1))}>
            <Text style={styles.timeStepText}>+</Text>
          </TouchableOpacity>
          <Text style={styles.timeValue}>{display}</Text>
          <TouchableOpacity style={styles.timeStepBtn} onPress={() => onChange(adjustTimeValue(value, key, key === "minute" ? -5 : -1))}>
            <Text style={styles.timeStepText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.timeLabel}>{key}</Text>
        </View>
      ))}
      <View style={styles.periodColumn}>
        {["AM", "PM"].map((period) => (
          <TouchableOpacity
            key={period}
            style={[styles.periodBtn, parsed.period === period && styles.periodBtnActive]}
            onPress={() => onChange(formatTimeValue({ ...parsed, period }))}
          >
            <Text style={[styles.periodText, parsed.period === period && styles.periodTextActive]}>{period}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function TimeRangePicker({ startTime, endTime, onStartChange, onEndChange }) {
  return (
    <View style={styles.timeRangeBox}>
      <View>
        <Text style={styles.subLabel}>Start time</Text>
        <TimePicker value={startTime} onChange={onStartChange} />
      </View>
      <View>
        <Text style={styles.subLabel}>End time</Text>
        <TimePicker value={endTime} onChange={onEndChange} />
      </View>
    </View>
  );
}

export default function BookWorkerScreen({ navigation, route }) {
  const { worker = {}, service = {}, skill = service?.name || "" } = route?.params || {};
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [address, setAddress] = useState(worker.area || "");
  const [bookingDate, setBookingDate] = useState(todayText());
  const [{ startTime, endTime }, setTimeRange] = useState(() => parseTimeRange("10:00 AM - 11:00 AM"));
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [amount, setAmount] = useState("499");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleBook = async () => {
    if (!worker.id) {
      setError("Worker details missing.");
      return;
    }
    if (!customerName.trim() || !customerMobile.trim() || !address.trim()) {
      setError("Enter name, mobile, and address.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const response = await providerApi.createBooking({
        providerId: worker.id,
        serviceName: service?.name || skill,
        skill,
        customerName: customerName.trim(),
        customerMobile: customerMobile.trim(),
        address: address.trim(),
        bookingDate,
        timeSlot: `${startTime} - ${endTime}`,
        amount: Number(amount) || 499,
      });
      navigation.navigate("BookingFlowStatus", { booking: response.data });
    } catch (err) {
      setError(err?.message || "Could not create booking.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Book {worker.fullName || worker.name || "Worker"}</Text>
        <Text style={styles.subtitle}>{service?.name || skill}</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Owner name</Text>
          <TextInput style={styles.input} value={customerName} onChangeText={setCustomerName} placeholder="Enter owner name" />

          <Text style={styles.label}>Mobile</Text>
          <TextInput style={styles.input} value={customerMobile} onChangeText={setCustomerMobile} placeholder="Enter mobile number" keyboardType="phone-pad" />

          <Text style={styles.label}>Service location</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter house number, area, landmark"
            multiline
          />
          <Text style={styles.helperText}>This location will be visible to the worker.</Text>

          <Text style={styles.label}>Date</Text>
          <TouchableOpacity style={styles.selectorRow} onPress={() => setShowCalendar((prev) => !prev)} activeOpacity={0.85}>
            <Text style={styles.selectorText}>{bookingDate}</Text>
            <Text style={styles.selectorAction}>{showCalendar ? "Hide" : "Open calendar"}</Text>
          </TouchableOpacity>
          {showCalendar && (
            <CalendarPicker
              selectedDate={bookingDate}
              onSelect={(value) => {
                setBookingDate(value);
                setShowCalendar(false);
              }}
            />
          )}

          <Text style={styles.label}>Time</Text>
          <TouchableOpacity style={styles.selectorRow} onPress={() => setShowTimePicker((prev) => !prev)} activeOpacity={0.85}>
            <Text style={styles.selectorText}>{startTime} - {endTime}</Text>
            <Text style={styles.selectorAction}>{showTimePicker ? "Hide" : "Edit time"}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <TimeRangePicker
              startTime={startTime}
              endTime={endTime}
              onStartChange={(value) => setTimeRange((prev) => ({ ...prev, startTime: value }))}
              onEndChange={(value) => setTimeRange((prev) => ({ ...prev, endTime: value }))}
            />
          )}

          <Text style={styles.label}>Amount</Text>
          <TextInput style={styles.input} value={amount} onChangeText={setAmount} keyboardType="numeric" />
        </View>

        {!!error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity style={styles.primaryBtn} onPress={handleBook} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Send Booking Request</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  content: { padding: 18, paddingBottom: 32 },
  backBtn: { alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 8, backgroundColor: C.soft, borderRadius: 8, marginBottom: 18 },
  backText: { color: C.primary, fontWeight: "800" },
  title: { color: C.text, fontSize: 24, fontWeight: "900" },
  subtitle: { color: C.muted, fontSize: 14, marginTop: 4, marginBottom: 18 },
  card: { backgroundColor: C.card, borderRadius: 8, borderWidth: 1, borderColor: C.border, padding: 16, gap: 8 },
  label: { color: C.text, fontSize: 13, fontWeight: "800", marginTop: 8 },
  input: { borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 11, backgroundColor: "#fff", color: C.text },
  multiline: { minHeight: 78, textAlignVertical: "top" },
  helperText: { color: C.muted, fontSize: 12, fontWeight: "600" },
  selectorRow: { borderWidth: 1, borderColor: C.border, borderRadius: 8, backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 13, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  selectorText: { color: C.text, fontSize: 14, fontWeight: "900", flex: 1 },
  selectorAction: { color: C.primary, fontSize: 12, fontWeight: "900" },
  calendarBox: { borderWidth: 1, borderColor: C.border, borderRadius: 8, backgroundColor: "#fff", padding: 10 },
  calendarHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  calendarNavBtn: { width: 34, height: 34, borderRadius: 8, backgroundColor: C.soft, alignItems: "center", justifyContent: "center" },
  calendarNavText: { color: C.primary, fontSize: 24, fontWeight: "900" },
  calendarTitle: { color: C.text, fontSize: 15, fontWeight: "900" },
  weekRow: { flexDirection: "row" },
  weekDay: { width: "14.285%", textAlign: "center", color: C.muted, fontSize: 12, fontWeight: "900", paddingBottom: 8 },
  dayGrid: { flexDirection: "row", flexWrap: "wrap" },
  dayCell: { width: "14.285%", aspectRatio: 1, alignItems: "center", justifyContent: "center", borderRadius: 8 },
  dayCellActive: { backgroundColor: C.primary },
  dayCellEmpty: { opacity: 0 },
  dayText: { color: C.text, fontSize: 13, fontWeight: "800" },
  dayTextActive: { color: "#fff" },
  timePicker: { flexDirection: "row", alignItems: "stretch", gap: 10 },
  timeRangeBox: { gap: 12 },
  subLabel: { color: C.muted, fontSize: 12, fontWeight: "900" },
  timeColumn: { flex: 1, borderWidth: 1, borderColor: C.border, borderRadius: 8, backgroundColor: "#fff", alignItems: "center", padding: 10 },
  timeStepBtn: { width: 34, height: 30, borderRadius: 8, backgroundColor: C.soft, alignItems: "center", justifyContent: "center" },
  timeStepText: { color: C.primary, fontSize: 18, fontWeight: "900" },
  timeValue: { color: C.text, fontSize: 24, fontWeight: "900", paddingVertical: 8 },
  timeLabel: { color: C.muted, fontSize: 11, fontWeight: "800" },
  periodColumn: { width: 76, gap: 8 },
  periodBtn: { flex: 1, borderWidth: 1, borderColor: C.border, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  periodBtnActive: { backgroundColor: C.primary, borderColor: C.primary },
  periodText: { color: C.text, fontWeight: "900" },
  periodTextActive: { color: "#fff" },
  error: { color: OWNER_COLORS.danger, fontWeight: "700", marginTop: 14 },
  primaryBtn: { backgroundColor: C.green, borderRadius: 8, paddingVertical: 15, alignItems: "center", marginTop: 18 },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "900" },
});

