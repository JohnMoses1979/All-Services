import AsyncStorage from "@react-native-async-storage/async-storage";

const OWNER_PROFILE_KEY = "ownerProfile";
const OWNER_TOKEN_KEY = "ownerAuthToken";

export const saveOwnerSession = async ({ token, owner }) => {
  if (token) {
    await AsyncStorage.setItem(OWNER_TOKEN_KEY, token);
  }
  if (owner) {
    await AsyncStorage.setItem(OWNER_PROFILE_KEY, JSON.stringify(owner));
  }
};

export const getOwnerProfile = async () => {
  const raw = await AsyncStorage.getItem(OWNER_PROFILE_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const saveOwnerProfile = async (owner) => {
  await AsyncStorage.setItem(OWNER_PROFILE_KEY, JSON.stringify(owner));
};

export const clearOwnerSession = async () => {
  await AsyncStorage.multiRemove([OWNER_PROFILE_KEY, OWNER_TOKEN_KEY]);
};
