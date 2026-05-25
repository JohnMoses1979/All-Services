import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import providerApi from "../api/providerApi";
import { OWNER_COLORS } from "../styles/ownerTheme";

const COLORS = {
  bg: OWNER_COLORS.background,
  card: OWNER_COLORS.surface,
  text: OWNER_COLORS.text,
  muted: OWNER_COLORS.muted,
  border: OWNER_COLORS.border,
  primary: OWNER_COLORS.primary,
  softPrimary: OWNER_COLORS.surfaceAlt,
  green: OWNER_COLORS.accent,
  softGreen: OWNER_COLORS.surfaceAlt,
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "W";

const normalizeProviders = (response) => {
  const providers = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : [];

  return providers
    .filter((provider) => provider?.available === true)
    .sort((a, b) => Number(b?.rating ?? b?.averageRating ?? b?.providerRating ?? 0) - Number(a?.rating ?? a?.averageRating ?? a?.providerRating ?? 0));
};

export default function RegisteredWorkersScreen({ navigation, route }) {
  const { skill = "", title = skill || "Workers", service } = route?.params || {};
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const hasLoadedRef = useRef(false);

  const loadWorkers = useCallback(async (showLoader = false) => {
    if (!skill) {
      setWorkers([]);
      setLoading(false);
      hasLoadedRef.current = true;
      return;
    }

    try {
      if (showLoader) setLoading(true);
      setError("");
      const response = await providerApi.getOnlineProvidersBySkill(skill);
      setWorkers(normalizeProviders(response));
    } catch (err) {
      setError(err?.message || "Could not load workers.");
      setWorkers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
      hasLoadedRef.current = true;
    }
  }, [skill]);

  useEffect(() => {
    loadWorkers(!hasLoadedRef.current);
    const refreshTimer = setInterval(() => loadWorkers(false), 8000);
    const unsubscribe = navigation?.addListener?.("focus", () => loadWorkers(false));

    return () => {
      clearInterval(refreshTimer);
      unsubscribe?.();
    };
  }, [loadWorkers, navigation]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadWorkers(false);
  };

  const renderWorker = (worker) => {
    const name = worker.fullName || worker.name || "Worker";
    const skills = Array.isArray(worker.skills) ? worker.skills.filter(Boolean) : [];
    const experience =
      worker.experienceYears != null
        ? `${worker.experienceYears} years experience`
        : "Experience not added";
    const location = worker.area || worker.city || "Location not added";
    const rawRating = worker.rating ?? worker.averageRating ?? worker.providerRating ?? 0;
    const rating = Number(rawRating || 0).toFixed(1);

    return (
      <TouchableOpacity
        key={worker.id || name}
        style={styles.workerCard}
        activeOpacity={0.85}
        onPress={() => navigation.navigate("BookWorker", { worker, service, skill, title })}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{worker.initials || getInitials(name)}</Text>
        </View>

        <View style={styles.workerBody}>
          <View style={styles.workerHeader}>
            <Text style={styles.workerName}>{name}</Text>
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>Rating {rating}</Text>
            </View>
          </View>

          <Text style={styles.workerMeta}>{experience}</Text>
          <Text style={styles.workerMeta}>{location}</Text>

          <View style={styles.skillsRow}>
            {(skills.length ? skills : [title]).slice(0, 4).map((item) => (
              <View key={item} style={styles.skillChip}>
                <Text style={styles.skillText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            Registered workers for {service?.name || title}
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.centerText}>Loading workers...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {!!error && (
            <View style={styles.messageCard}>
              <Text style={styles.messageTitle}>Server issue</Text>
              <Text style={styles.messageText}>{error}</Text>
            </View>
          )}

          {!error && workers.length === 0 && (
            <View style={styles.messageCard}>
              <Text style={styles.messageTitle}>No workers found</Text>
              <Text style={styles.messageText}>
                No online worker has selected {title} right now.
              </Text>
            </View>
          )}

          {workers.map(renderWorker)}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.softPrimary,
  },
  backText: {
    color: COLORS.primary,
    fontWeight: "800",
    fontSize: 14,
  },
  headerTextWrap: {
    flex: 1,
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "900",
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 2,
  },
  content: {
    padding: 16,
    paddingBottom: 28,
    gap: 12,
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  centerText: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: "700",
  },
  messageCard: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  messageTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 6,
  },
  messageText: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  workerCard: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.softPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "900",
  },
  workerBody: {
    flex: 1,
  },
  workerHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  workerName: {
    flex: 1,
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "900",
  },
  statusPill: {
    backgroundColor: COLORS.softGreen,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  statusText: {
    color: COLORS.green,
    fontSize: 11,
    fontWeight: "900",
  },
  workerMeta: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 4,
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },
  skillChip: {
    backgroundColor: "#F0FAFA",
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  skillText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
  },
});

