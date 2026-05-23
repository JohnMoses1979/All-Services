import React, { useEffect, useMemo, useState } from "react";
import { View, StatusBar, StyleSheet, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AllServicesScreen from "./screens/AllServicesScreen";
import AddressesScreen from "./screens/AddressesScreen";
import BeauticianScreen from "./screens/BeauticianScreen";
import BirthdayDecorationScreen from "./screens/BirthdayDecorationScreen";
import BookingFlowStatusScreen from "./screens/BookingFlowStatusScreen";
import BookingScreen from "./screens/BookingScreen";
import BookWorkerScreen from "./screens/BookWorkerScreen";
import CateringServicesScreen from "./screens/CateringServicesScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import DoctorScreen from "./screens/DoctorScreen";
import DriverPage from "./screens/DriverPage";
import ElectricianScreen from "./screens/ElectricianScreen";
import EventPhotographyScreen from "./screens/EventPhotographyScreen";
import FitnessYogaTrainerScreen from "./screens/FitnessYogaTrainerScreen";
import FurnitureAssemblyPage from "./screens/FurnitureAssemblyPage";
import GuardScreen from "./screens/GuardScreen";
import HandymanPage from "./screens/HandymanPage";
import HelpSupportScreen from "./screens/HelpSupportScreen";
import HomeACRepairScreen from "./screens/HomeACRepairScreen";
import HomeCarpenterScreen from "./screens/HomeCarpenterScreen";
import HomeCarWashScreen from "./screens/HomeCarWashScreen";
import HomeCleaningScreen from "./screens/HomeCleaningScreen";
import HomeCookScreen from "./screens/HomeCookScreen";
import HomeGardenScreen from "./screens/HomeGardenScreen";
import HomeLaundryScreen from "./screens/HomeLaundryScreen";
import HomeNurseScreen from "./screens/HomeNurseScreen";
import HomePaintingScreen from "./screens/HomePaintingScreen";
import HomePestControlScreen from "./screens/HomePestControlScreen";
import HomeRenovationPage from "./screens/HomeRenovationPage";
import HomeRoofingScreen from "./screens/HomeRoofingScreen";
import HomeSalonScreen from "./screens/HomeSalonScreen";
import HomeSewageScreen from "./screens/HomeSewageScreen";
import HomeShiftingScreen from "./screens/HomeShiftingScreen";
import HomeScreen from "./screens/HomeScreen";
import HomeTilingScreen from "./screens/HomeTilingScreen";
import HomeTutionScreen from "./screens/HomeTutionScreen";
import HomeWaterTankScreen from "./screens/HomeWaterTankScreen";
import JobDetailScreen from "./screens/JobDetailScreen";
import LabTestAtHomeScreen from "./screens/LabTestAtHomeScreen";
import LoginScreen from "./screens/LoginScreen";
import MaidScreen from "./screens/MaidScreen";
import MassageTherapyScreen from "./screens/MassageTherapyScreen";
import MedicalWorkersListScreen from "./screens/MedicalWorkersListScreen";
import MyBookingsScreen from "./screens/MyBookingsScreen";
import MyProfileScreen from "./screens/MyProfileScreen";
import MyWalletScreen from "./screens/MyWalletScreen";
import NotificationSettingsScreen from "./screens/NotificationSettingsScreen";
import PartyPlannerScreen from "./screens/PartyPlannerScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PersonalDetailsScreen from "./screens/PersonalDetailsScreen";
import PhysiotherapyScreen from "./screens/PhysiotherapyScreen";
import PlumberPage from "./screens/Plumberpage";
import PoolCleaningScreen from "./screens/PoolCleaningScreen";
import ReferEarnScreen from "./screens/ReferEarnScreen";
import RepairsPage from "./screens/RepairsPage";
import RegisteredWorkersScreen from "./screens/RegisteredWorkersScreen";
import ServiceMemberScreen from "./screens/ServiceMemberScreen";
import SignupScreen from "./screens/SignupScreen";
import WifiSetupInstallationScreen from "./screens/WifiSetupInstallationScreen";
import WorkerListScreen from "./screens/WorkerListScreen";
import WorkersCategoryListScreen from "./screens/Workerslistscreen";
import SignIn from "./user/SignIn";
import SignUp from "./user/SignUp";
import SelectServicesScreen from './user/SelectServicesScreen';
import RegistrationSuccessScreen from './user/RegistrationSuccessScreen';
import ProviderTabs from "./user/ProviderTabs";
import ProviderBookingsScreen from "./user/MyBookingsScreen";
import ProviderEarningsScreen from "./user/Earnings";
import ProviderProfileScreen from "./user/Profile";
import ProviderScheduleScreen from "./user/MyScheduleScreen";
import ProviderNotificationsScreen from "./user/NotificationsScreen";
import ProviderBookingDetailsScreen from "./user/BookingDetailsScreen";
import ProviderLiveTrackingScreen from "./user/LiveTrackingScreen";
import PersonalInformationScreen from "./user/PersonalInformationScreen";

const ROUTES = {
  Login: LoginScreen,
  SignIn: SignIn,
  Signup: SignupScreen,
  SignupAllInOne: SignUp,
  BookWorker: BookWorkerScreen,
  BookingFlowStatus: BookingFlowStatusScreen,
  SelectServices: SelectServicesScreen,
  RegistrationSuccess: RegistrationSuccessScreen,
  ProviderTabs: ProviderTabs,
  ProviderHome: ProviderTabs,
  ProviderBookings: ProviderBookingsScreen,
  ProviderEarnings: ProviderEarningsScreen,
  ProviderProfile: ProviderProfileScreen,
  ProviderSchedule: ProviderScheduleScreen,
  ProviderNotifications: ProviderNotificationsScreen,
  ProviderBookingDetails: ProviderBookingDetailsScreen,
  ProviderLiveTracking: ProviderLiveTrackingScreen,
  PersonalInformation: PersonalInformationScreen,
  ForgotPassword: ForgotPasswordScreen,
  Home: HomeScreen,
  PersonalDetails: PersonalDetailsScreen,
  ServiceMembers: ServiceMemberScreen,
  Beautician: BeauticianScreen,
  BirthdayDecoration: BirthdayDecorationScreen,
  CateringServices: CateringServicesScreen,
  HomeACRepair: HomeACRepairScreen,
  HomeCarpenter: HomeCarpenterScreen,
  HomeCarWash: HomeCarWashScreen,
  HomeCleaning: HomeCleaningScreen,
  HomeCook: HomeCookScreen,
  HomeGarden: HomeGardenScreen,
  HomeLaundry: HomeLaundryScreen,
  HomeSalon: HomeSalonScreen,
  HomePainting: HomePaintingScreen,
  HomePestControl: HomePestControlScreen,
  HomeRoofing: HomeRoofingScreen,
  HomeSewage: HomeSewageScreen,
  HomeShifting: HomeShiftingScreen,
  HomeTution: HomeTutionScreen,
  HomeTiling: HomeTilingScreen,
  HomeWaterTank: HomeWaterTankScreen,
  HomeNurse: HomeNurseScreen,
  Doctor: DoctorScreen,
  Driver: DriverPage,
  DriverNeeded: DriverPage,
  Electrician: ElectricianScreen,
  EventPhotography: EventPhotographyScreen,
  FitnessYogaTrainer: FitnessYogaTrainerScreen,
  FurnitureAssembly: FurnitureAssemblyPage,
  Handyman: HandymanPage,
  LabTestAtHome: LabTestAtHomeScreen,
  Maid: MaidScreen,
  MassageTherapy: MassageTherapyScreen,
  HomeRenovation: HomeRenovationPage,
  PartyPlanner: PartyPlannerScreen,
  Plumber: PlumberPage,
  PoolCleaning: PoolCleaningScreen,
  Physiotherapy: PhysiotherapyScreen,
  SecurityGuard: GuardScreen,
  AllServices: AllServicesScreen,
  Addresses: AddressesScreen,
  WifiSetupInstallation: WifiSetupInstallationScreen,
  WorkersList: WorkerListScreen,
  Booking: BookingScreen,
  MyBookings: MyBookingsScreen,
  MyWallet: MyWalletScreen,
  MyProfile: MyProfileScreen,
  Payment: PaymentScreen,
  PaymentMethods: PaymentScreen,
  HelpSupport: HelpSupportScreen,
  ReferEarn: ReferEarnScreen,
  NotificationSettings: NotificationSettingsScreen,
  MedicalWorkersList: MedicalWorkersListScreen,
  WorkersCategoryList: WorkersCategoryListScreen,
  RegisteredWorkers: RegisteredWorkersScreen,
  JobDetail: JobDetailScreen,
};

const NAV_STATE_KEY = "servixo.currentRoute";
const DEFAULT_ENTRY = { routeName: "Login", params: {} };

// ✅ FIXED: Use public server IP instead of local LAN IP (192.168.29.170)
const PUBLIC_WEB_ORIGIN = "http://40.192.103.12:8081";

const canUseWebStorage = () => typeof window !== "undefined" && !!window.localStorage;

const redirectHttpsTunnelToLocalWeb = () => {
  if (Platform.OS !== "web" || typeof window === "undefined") {
    return;
  }

  const { protocol, hostname, hash } = window.location;
  if (protocol === "https:" && hostname.endsWith(".exp.direct")) {
    // ✅ FIXED: redirect to public IP, not local LAN
    window.location.replace(`${PUBLIC_WEB_ORIGIN}${hash || "#/Login"}`);
  }
};

const getInitialStack = () => {
  redirectHttpsTunnelToLocalWeb();

  if (!canUseWebStorage()) {
    return [DEFAULT_ENTRY];
  }

  try {
    window.localStorage.removeItem(NAV_STATE_KEY);
    window.history.replaceState(null, "", "#/Login");
  } catch {
    window.localStorage.removeItem(NAV_STATE_KEY);
  }

  return [DEFAULT_ENTRY];
};

export default function App() {
  const [stack, setStack] = useState(getInitialStack);

  const currentEntry = stack[stack.length - 1];
  const ScreenComponent = ROUTES[currentEntry.routeName] ?? LoginScreen;

  useEffect(() => {
    redirectHttpsTunnelToLocalWeb();

    if (!canUseWebStorage()) {
      return;
    }

    window.localStorage.setItem(NAV_STATE_KEY, JSON.stringify(currentEntry));

    const nextHash = `#/${currentEntry.routeName}`;
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }
  }, [currentEntry]);

  const navigation = useMemo(
    () => ({
      navigate: (routeName, params = {}) => {
        if (!ROUTES[routeName]) {
          return;
        }
        setStack((prev) => [...prev, { routeName, params }]);
      },
      goBack: () => {
        setStack((prev) => {
          if (prev.length > 1) {
            return prev.slice(0, -1);
          }
          const currentRoute = prev[0]?.routeName;
          if (currentRoute && currentRoute !== "Home" && currentRoute !== "Login") {
            return [{ routeName: "Home", params: {} }];
          }
          return prev;
        });
      },
      canGoBack: () =>
        stack.length > 1 || !["Home", "Login"].includes(currentEntry.routeName),
      reset: (config, params = {}) => {
        if (typeof config === "object" && config !== null) {
          const routeName = config?.routes?.[0]?.name;
          if (!routeName || !ROUTES[routeName]) return;
          setStack([{ routeName, params: config?.routes?.[0]?.params || {} }]);
          return;
        }
        if (!ROUTES[config]) return;
        setStack([{ routeName: config, params }]);
      },
    }),
    [currentEntry.routeName, stack.length]
  );

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ScreenComponent
          navigation={navigation}
          route={{ params: currentEntry.params }}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fb",
  },
});