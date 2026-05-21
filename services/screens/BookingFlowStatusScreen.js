import React, { useEffect, useState } from "react";
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
  orange: OWNER_COLORS.accent,
  soft: OWNER_COLORS.surfaceAlt,
};

const steps = [
  ["REQUESTED", "Request sent to worker"],
  ["ACCEPTED", "Worker accepted. Share OTP when worker reaches location"],
  ["STARTED", "Work started"],
  ["COMPLETED", "Work completed"],
  ["PAID", "Payment completed"],
  ["RATED", "Rating submitted"],
];

const formatDateValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

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

export default function BookingFlowStatusScreen({ navigation, route }) {
  const initialBooking = route?.params?.booking || {};
  const initialRange = parseTimeRange(initialBooking.timeSlot || "10:00 AM - 11:00 AM");
  const [booking, setBooking] = useState(initialBooking);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [message, setMessage] = useState("");
  const [editingDetails, setEditingDetails] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [detailsForm, setDetailsForm] = useState({
    address: initialBooking.address || "",
    bookingDate: initialBooking.bookingDate || formatDateValue(new Date()),
    startTime: initialRange.startTime,
    endTime: initialRange.endTime,
  });

  const loadBooking = async () => {
    if (!booking?.id) return;
    try {
      const response = await providerApi.getBooking(booking.id);
      setBooking(response.data);
    } catch {
      setMessage("Could not refresh booking status.");
    }
  };

  useEffect(() => {
    loadBooking();
    const timer = setInterval(loadBooking, 4000);
    return () => clearInterval(timer);
  }, [booking?.id]);

  useEffect(() => {
    if (editingDetails) return;
    const range = parseTimeRange(booking.timeSlot || "10:00 AM - 11:00 AM");
    setDetailsForm({
      address: booking.address || "",
      bookingDate: booking.bookingDate || formatDateValue(new Date()),
      startTime: range.startTime,
      endTime: range.endTime,
    });
  }, [booking.address, booking.bookingDate, booking.timeSlot, editingDetails]);

  const runAction = async (action) => {
    setLoading(true);
    setMessage("");
    try {
      const response = await action();
      setBooking(response.data);
      return true;
    } catch (err) {
      setMessage(err?.message || "Action failed.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const statusIndex = Math.max(0, steps.findIndex(([status]) => status === booking.status));
  const canEditDetails = ["REQUESTED", "ACCEPTED"].includes(booking.status);

  const updateDetail = (key, value) => {
    setDetailsForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveDetails = async () => {
    if (!detailsForm.address.trim() || !detailsForm.bookingDate.trim() || !detailsForm.startTime.trim() || !detailsForm.endTime.trim()) {
      setMessage("Enter service location, date, and time.");
      return;
    }

    const saved = await runAction(() => providerApi.updateBookingDetails(booking.id, {
      address: detailsForm.address.trim(),
      bookingDate: detailsForm.bookingDate.trim(),
      timeSlot: `${detailsForm.startTime.trim()} - ${detailsForm.endTime.trim()}`,
    }));
    if (saved) {
      setEditingDetails(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.backText}>Home</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Booking #{booking.id}</Text>
        <Text style={styles.subtitle}>{booking.serviceName} with {booking.providerName}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Status: {booking.status}</Text>
          <Text style={styles.meta}>Date: {booking.bookingDate}</Text>
          <Text style={styles.meta}>Time: {booking.timeSlot}</Text>
          <Text style={styles.meta}>Amount: Rs {booking.amount}</Text>
          <Text style={styles.meta}>Service location: {booking.address}</Text>
          {canEditDetails && (
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => setEditingDetails((prev) => !prev)}>
              <Text style={styles.secondaryText}>{editingDetails ? "Close Edit" : "Update Location / Date / Time"}</Text>
            </TouchableOpacity>
          )}
        </View>

        {canEditDetails && editingDetails && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Update Booking Details</Text>
            <Text style={styles.label}>Service location</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={detailsForm.address}
              onChangeText={(text) => updateDetail("address", text)}
              placeholder="Enter updated service location"
              multiline
            />

            <Text style={styles.label}>Date</Text>
            <TouchableOpacity style={styles.selectorRow} onPress={() => setShowCalendar((prev) => !prev)} activeOpacity={0.85}>
              <Text style={styles.selectorText}>{detailsForm.bookingDate}</Text>
              <Text style={styles.selectorAction}>{showCalendar ? "Hide" : "Open calendar"}</Text>
            </TouchableOpacity>
            {showCalendar && (
              <CalendarPicker
                selectedDate={detailsForm.bookingDate}
                onSelect={(value) => {
                  updateDetail("bookingDate", value);
                  setShowCalendar(false);
                }}
              />
            )}

            <Text style={styles.label}>Time</Text>
            <TouchableOpacity style={styles.selectorRow} onPress={() => setShowTimePicker((prev) => !prev)} activeOpacity={0.85}>
              <Text style={styles.selectorText}>{detailsForm.startTime} - {detailsForm.endTime}</Text>
              <Text style={styles.selectorAction}>{showTimePicker ? "Hide" : "Edit time"}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <TimeRangePicker
                startTime={detailsForm.startTime}
                endTime={detailsForm.endTime}
                onStartChange={(value) => updateDetail("startTime", value)}
                onEndChange={(value) => updateDetail("endTime", value)}
              />
            )}

            <TouchableOpacity style={styles.primaryBtn} onPress={saveDetails} disabled={loading}>
              <Text style={styles.primaryText}>Save Updated Details</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.card}>
          {steps.map(([status, label], index) => (
            <View key={status} style={styles.stepRow}>
              <View style={[styles.stepDot, index <= statusIndex && styles.stepDotDone]} />
              <Text style={[styles.stepText, index <= statusIndex && styles.stepTextDone]}>{label}</Text>
            </View>
          ))}
        </View>

        {booking.status === "ACCEPTED" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Start OTP</Text>
            <Text style={styles.otp}>{booking.startOtp}</Text>
            <Text style={styles.meta}>Give this OTP to the worker after they reach your location.</Text>
          </View>
        )}

        {booking.status === "COMPLETED" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Choose Payment</Text>
            <View style={styles.row}>
              {["Cash", "Online"].map((method) => (
                <TouchableOpacity
                  key={method}
                  style={[styles.choice, paymentMethod === method && styles.choiceActive]}
                  onPress={() => setPaymentMethod(method)}
                >
                  <Text style={[styles.choiceText, paymentMethod === method && styles.choiceTextActive]}>{method}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => runAction(() => providerApi.saveBookingPayment(booking.id, paymentMethod))}
            >
              <Text style={styles.primaryText}>Complete Payment</Text>
            </TouchableOpacity>
          </View>
        )}

        {booking.status === "PAID" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Rate Worker</Text>
            <View style={styles.row}>
              {[1, 2, 3, 4, 5].map((value) => (
                <TouchableOpacity key={value} onPress={() => setRating(value)}>
                  <Text style={[styles.star, rating >= value && styles.starActive]}>*</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput style={styles.input} value={review} onChangeText={setReview} placeholder="Write feedback" />
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => runAction(() => providerApi.rateBooking(booking.id, rating, review))}
            >
              <Text style={styles.primaryText}>Submit Rating</Text>
            </TouchableOpacity>
          </View>
        )}

        {!!message && <Text style={styles.message}>{message}</Text>}
        {loading && <ActivityIndicator color={C.primary} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  content: { padding: 18, gap: 14, paddingBottom: 34 },
  backBtn: { alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 8, backgroundColor: C.soft, borderRadius: 8 },
  backText: { color: C.primary, fontWeight: "800" },
  title: { color: C.text, fontSize: 24, fontWeight: "900" },
  subtitle: { color: C.muted, fontSize: 14 },
  card: { backgroundColor: C.card, borderRadius: 8, borderWidth: 1, borderColor: C.border, padding: 16, gap: 8 },
  cardTitle: { color: C.text, fontSize: 17, fontWeight: "900" },
  meta: { color: C.muted, fontSize: 14 },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 5 },
  stepDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: C.border },
  stepDotDone: { backgroundColor: C.green },
  stepText: { color: C.muted, flex: 1 },
  stepTextDone: { color: C.text, fontWeight: "800" },
  otp: { color: C.orange, fontSize: 34, fontWeight: "900", letterSpacing: 4 },
  row: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  choice: { borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
  choiceActive: { backgroundColor: C.primary, borderColor: C.primary },
  choiceText: { color: C.text, fontWeight: "800" },
  choiceSubText: { color: C.muted, fontWeight: "700", fontSize: 11, marginTop: 2 },
  choiceTextActive: { color: "#fff" },
  selectorRow: { borderWidth: 1, borderColor: C.border, borderRadius: 8, backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 13, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  selectorText: { color: C.text, fontSize: 14, fontWeight: "900", flex: 1 },
  selectorAction: { color: C.primary, fontSize: 12, fontWeight: "900" },
  calendarBox: { borderWidth: 1, borderColor: C.border, borderRadius: 8, backgroundColor: "#fff", padding: 10 },
  calendarHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  calendarNavBtn: { width: 34, height: 34, borderRadius: 8, backgroundColor: C.soft, alignItems: "center", justifyContent: "center" },
  calendarNavText: { color: C.primary, fontSize: 18, fontWeight: "900" },
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
  primaryBtn: { backgroundColor: C.green, borderRadius: 8, paddingVertical: 13, alignItems: "center", marginTop: 8 },
  primaryText: { color: "#fff", fontWeight: "900" },
  secondaryBtn: { borderWidth: 1, borderColor: C.primary, borderRadius: 8, paddingVertical: 10, alignItems: "center", marginTop: 8 },
  secondaryText: { color: C.primary, fontWeight: "900" },
  label: { color: C.text, fontSize: 13, fontWeight: "800", marginTop: 8 },
  input: { borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 11 },
  multiline: { minHeight: 78, textAlignVertical: "top" },
  star: { fontSize: 30, color: C.border, fontWeight: "900" },
  starActive: { color: "#E8A020" },
  message: { color: OWNER_COLORS.danger, fontWeight: "700" },
});

