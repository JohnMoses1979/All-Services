import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../styles/colors";

export default function ServiceCard({ title, iconName, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.iconWrap}>
        <Ionicons name={iconName} size={28} color={COLORS.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.cardAccent,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
});
