import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { providerApi } from "../api/providerApi";
import { getOwnerColors, t } from "../styles/ownerPreferences";

export default function PersonalDetailsScreen({ navigation }) {
  const [owner, setOwner] = useState(null);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [societyName, setSocietyName] = useState("");
  const [flatNo, setFlatNo] = useState("");
  const [address, setAddress] = useState("");
  const [profileImageUri, setProfileImageUri] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const language = owner?.language || "en";
  const colors = getOwnerColors(owner?.theme || "light");

  useEffect(() => {
    let active = true;
    providerApi.getLocalOwner().then((profile) => {
      if (!active || !profile) return;
      setOwner(profile);
      setFullName(profile.fullName || "");
      setMobile(profile.mobile || "");
      setSocietyName(profile.societyName || "");
      setFlatNo(profile.flatNo || "");
      setAddress(profile.address || "");
      setProfileImageUri(profile.profileImageUri || "");
    });
    return () => {
      active = false;
    };
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setProfileImageUri(result.assets[0].uri);
    }
  };

  const saveDetails = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await providerApi.updateOwnerProfile({
        ...owner,
        fullName,
        mobile,
        societyName,
        flatNo,
        address,
        profileImageUri,
        language,
        theme: owner?.theme || "light",
      });
      setOwner(response?.data);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err?.message || "Could not update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.header }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.header} />

      <View style={[styles.header, { backgroundColor: colors.header }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={23} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t(language, "personalInformation")}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.backgroundAlt }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity style={styles.avatarWrap} onPress={pickImage} activeOpacity={0.85}>
            <View style={[styles.avatar, { backgroundColor: colors.surfaceAlt }]}>
              {profileImageUri ? (
                <Image source={{ uri: profileImageUri }} style={styles.avatarImage} />
              ) : (
                <Feather name="camera" size={34} color={colors.primary} />
              )}
            </View>
            <Text style={[styles.changePhotoText, { color: colors.primary }]}>Update photo</Text>
          </TouchableOpacity>

          {!!message && (
            <View style={[styles.messageBox, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}>
              <Text style={[styles.messageText, { color: colors.text }]}>{message}</Text>
            </View>
          )}

          <Field label={t(language, "fullName")} icon={<Feather name="user" size={20} color={colors.text} />} value={fullName} onChangeText={setFullName} colors={colors} />
          <Field label={t(language, "mobileNumber")} icon={<Feather name="phone" size={20} color={colors.text} />} value={mobile} onChangeText={(v) => setMobile(v.replace(/\D/g, ""))} keyboardType="phone-pad" maxLength={10} colors={colors} />
          <Field label={t(language, "societyName")} icon={<MaterialIcons name="apartment" size={20} color={colors.text} />} value={societyName} onChangeText={setSocietyName} colors={colors} />
          <Field label={t(language, "flatNo")} icon={<FontAwesome5 name="home" size={18} color={colors.text} />} value={flatNo} onChangeText={setFlatNo} colors={colors} />
          <Field label={t(language, "address")} icon={<Feather name="map-pin" size={20} color={colors.text} />} value={address} onChangeText={setAddress} multiline colors={colors} />

          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={saveDetails} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>{t(language, "saveDetails")}</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, icon, colors, multiline, ...inputProps }) {
  return (
    <>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={[styles.inputWrapper, multiline && styles.multilineWrapper, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <View style={styles.inputIcon}>{icon}</View>
        <TextInput
          style={[styles.input, multiline && styles.multilineInput, { color: colors.text }]}
          placeholderTextColor={colors.muted}
          multiline={multiline}
          {...inputProps}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
  headerSpacer: { width: 36 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 28 },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
  },
  avatarWrap: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  changePhotoText: {
    marginTop: 9,
    fontWeight: "800",
  },
  messageBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
  },
  messageText: {
    fontWeight: "700",
  },
  label: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
    marginLeft: 4,
  },
  inputWrapper: {
    minHeight: 58,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  multilineWrapper: {
    minHeight: 104,
    alignItems: "flex-start",
    paddingTop: 16,
  },
  inputIcon: {
    marginRight: 12,
    width: 22,
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  multilineInput: {
    minHeight: 72,
    textAlignVertical: "top",
  },
  primaryButton: {
    minHeight: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
  },
});
