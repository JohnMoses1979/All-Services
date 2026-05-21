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
import { Feather } from "@expo/vector-icons";
import { providerApi } from "../api/providerApi";
import { getOwnerColors, t } from "../styles/ownerPreferences";

export default function AddressesScreen({ navigation }) {
  const [owner, setOwner] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const language = owner?.language || "en";
  const colors = getOwnerColors(owner?.theme || "light");

  useEffect(() => {
    let active = true;
    providerApi.getLocalOwner().then((profile) => {
      if (!active || !profile) return;
      setOwner(profile);
      setAddress(profile.address || "");
    });
    return () => {
      active = false;
    };
  }, []);

  const saveAddress = async () => {
    if (!owner?.mobile) return;
    setLoading(true);
    setMessage("");
    try {
      const response = await providerApi.updateOwnerProfile({
        ...owner,
        address,
        mobile: owner.mobile,
        fullName: owner.fullName || "Owner",
      });
      setOwner(response?.data);
      setMessage("Address updated successfully.");
    } catch (err) {
      setMessage(err?.message || "Could not update address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={owner?.theme === "dark" ? "light-content" : "dark-content"} backgroundColor={colors.surface} />
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={23} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t(language, "addresses")}</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.label, { color: colors.text }]}>{t(language, "address")}</Text>
        <View style={[styles.inputWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Feather name="map-pin" size={20} color={colors.primary} style={styles.icon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={address}
            onChangeText={setAddress}
            multiline
            placeholder="House, street, landmark, city"
            placeholderTextColor={colors.muted}
          />
        </View>
        {!!message && <Text style={[styles.message, { color: colors.text }]}>{message}</Text>}
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={saveAddress} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{t(language, "saveAddress")}</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    height: 68,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
  },
  inputWrap: {
    minHeight: 130,
    borderWidth: 1,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
  },
  icon: {
    marginTop: 8,
    marginRight: 12,
  },
  input: {
    flex: 1,
    minHeight: 96,
    fontSize: 16,
    textAlignVertical: "top",
  },
  message: {
    marginTop: 14,
    fontWeight: "700",
  },
  button: {
    marginTop: 20,
    minHeight: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
  },
});
