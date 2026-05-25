import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, StatusBar, useWindowDimensions,
} from 'react-native';
import { COLORS, SERVICES } from '../data/serviceData';

const AllServicesScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const columns = width >= 768 ? 3 : 2;
  const memberScreenMap = {
    acRepair: 'ACRepair',
    carpenter: 'Carpenter',
    carWash: 'CarWash',
    kitchen: 'Cook',
    cleaning: 'Cleaning',
    gardening: 'Gardening',
    laundry: 'Laundry',
    moving: 'Shifting',
    painting: 'Painting',
    pestControl: 'PestControl',
    roofing: 'Roofing',
    salon: 'Salon',
    sewageTreatment: 'Sewage',
    tiling: 'Tiling',
    tutor: 'Tuition',
    waterTankCleaning: 'WaterTank',
  };

  const workerListRouteMap = {
    handyman: { routeName: 'WorkersCategoryList', params: { category: 'Handyman', icon: 'ðŸ› ï¸' } },
    furnitureAssembly: { routeName: 'WorkersCategoryList', params: { category: 'FurnitureAssembly', icon: 'ðŸª‘' } },
    homeRenovation: { routeName: 'WorkersCategoryList', params: { category: 'HomeRenovation', icon: 'ðŸ¡' } },
    electrician: { routeName: 'MedicalWorkersList', params: { category: 'Electrician', icon: 'ðŸ’¡' } },
    maid: { routeName: 'MedicalWorkersList', params: { category: 'Maid', icon: 'ðŸ§¹' } },
    poolCleaning: { routeName: 'MedicalWorkersList', params: { category: 'PoolCleaning', icon: 'ðŸŠ' } },
    doctor: { routeName: 'MedicalWorkersList', params: { category: 'Doctor', icon: '🩺' } },
    'home-nurse': { routeName: 'MedicalWorkersList', params: { category: 'HomeNurse', icon: '💙' } },
    driver: { routeName: 'WorkersCategoryList', params: { category: 'Driver', icon: '🚗' } },
    plumber: { routeName: 'WorkersCategoryList', params: { category: 'Plumber', icon: '🔧' } },
    repairs: { routeName: 'WorkersCategoryList', params: { category: 'Repairs', icon: '🛠️' } },
    security: { routeName: 'WorkersCategoryList', params: { category: 'SecurityGuard', icon: '🔒' } },
  };

  const openService = (service) => {
    const serviceType = memberScreenMap[service.id];
    const workerListRoute = workerListRouteMap[service.id];

    if (serviceType) {
      navigation.navigate('ServiceMembers', { serviceType, service });
      return;
    }

    if (workerListRoute) {
      navigation.navigate(workerListRoute.routeName, {
        service,
        ...workerListRoute.params,
      });
      return;
    }

    navigation.navigate('WorkersList', { service });
  };

  const rows = [];
  for (let i = 0; i < SERVICES.length; i += columns) {
    rows.push(SERVICES.slice(i, i + columns));
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>All Services</Text>
          <Text style={styles.headerSub}>Browse & apply for any category</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Drag handle style decoration */}
        <View style={styles.handleRow}>
          <View style={styles.handle} />
        </View>

        <Text style={styles.subLabel}>
          {SERVICES.length} services available in your colony
        </Text>

        {/* Services Grid */}
        {rows.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {row.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.tile,
                  service.isNew && styles.tileNew,
                ]}
                activeOpacity={0.75}
                onPress={() => openService(service)}
              >
                {service.isNew && (
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                )}
                <View style={[styles.iconCircle, { backgroundColor: service.bg }]}>
                  <Text style={styles.tileEmoji}>{service.emoji}</Text>
                </View>
                <Text style={[styles.tileName, service.isNew && { color: service.color }]}>
                  {service.name}
                </Text>
                {service.isNew && (
                  <Text style={[styles.tileTagline, { color: service.color }]}>Newly added</Text>
                )}
              </TouchableOpacity>
            ))}

            {/* Fill empty cells in last row */}
            {row.length < columns && Array(columns - row.length).fill(null).map((_, i) => (
              <View key={`empty-${i}`} style={styles.tilePlaceholder} />
            ))}
          </View>
        ))}

        {/* Suggest More */}
        <TouchableOpacity style={styles.suggestTile} activeOpacity={0.8}>
          <Text style={styles.suggestPlus}>+</Text>
          <Text style={styles.suggestText}>Suggest a New Service</Text>
          <Text style={styles.suggestSub}>Help us expand for your colony</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.primary },

  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
  backBtn: {
    width: 36, height: 36, alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { color: '#E8F5F5', fontSize: 22 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '800' },
  headerSub: { color: '#E8F5F5', fontSize: 10, marginTop: 2 },

  scroll: { flex: 1, backgroundColor: COLORS.bg, borderTopLeftRadius: 22, borderTopRightRadius: 22 },
  scrollContent: { paddingTop: 0 },

  handleRow: { alignItems: 'center', paddingTop: 12, paddingBottom: 4 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.border },

  subLabel: {
    textAlign: 'center', fontSize: 12, color: COLORS.medText,
    marginBottom: 20, fontWeight: '500',
  },

  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 12,
  },
  tile: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 6,
    position: 'relative',
  },
  tileNew: {
    backgroundColor: '#F0FAFA',
    borderColor: '#E8A020',
    borderWidth: 1.5,
  },
  tilePlaceholder: { flex: 1 },
  newBadge: {
    position: 'absolute', top: -6, right: 6,
    backgroundColor: COLORS.green,
    borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2,
  },
  newBadgeText: { color: '#fff', fontSize: 7, fontWeight: '800' },
  iconCircle: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  tileEmoji: { fontSize: 26 },
  tileName: { fontSize: 11, color: COLORS.medText, fontWeight: '700', textAlign: 'center' },
  tileTagline: { fontSize: 8, marginTop: 2, fontWeight: '500', textAlign: 'center' },

  suggestTile: {
    marginHorizontal: 16,
    marginTop: 4,
    backgroundColor: 'rgba(232,98,10,0.06)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    paddingVertical: 20,
  },
  suggestPlus: { fontSize: 28, color: COLORS.primary, fontWeight: '700', marginBottom: 4 },
  suggestText: { fontSize: 13, color: COLORS.primary, fontWeight: '700' },
  suggestSub: { fontSize: 10, color: COLORS.medText, marginTop: 4 },
});

export default AllServicesScreen;

