// import AsyncStorage from '@react-native-async-storage/async-storage';

// // ─────────────────────────────────────────────────────────────────────────────
// // BASE URL CONFIGURATION
// // ─────────────────────────────────────────────────────────────────────────────
// // Change this to match your environment:
// //   Android Emulator  → 'http://40.192.103.12:8080'
// //   iOS Simulator     → 'http://localhost:8080'
// //
// // ✅ FIX: Split into two base URLs — auth endpoints live under /api/provider/auth
// //         but categories (and other provider endpoints) live under /api/provider
// const BASE_AUTH_URL = 'http://40.192.103.12:8080/api/provider/auth';
// const BASE_PROVIDER_URL = 'http://40.192.103.12:8080/api/provider';

// // ─────────────────────────────────────────────────────────────────────────────
// // TOKEN HELPERS
// // ─────────────────────────────────────────────────────────────────────────────
// const getToken = async () => await AsyncStorage.getItem('authToken');
// const setToken = async (token) => await AsyncStorage.setItem('authToken', token);
// const clearToken = async () => await AsyncStorage.removeItem('authToken');
// // ─────────────────────────────────────────────────────────────────────────────
// // AVAILABILITY HELPERS  (add these two private helpers near the top, with the
// // other token helpers around line 20)
// // ─────────────────────────────────────────────────────────────────────────────
// const AVAILABILITY_KEY = 'providerAvailability';

// const saveAvailability = async (data) =>
//     await AsyncStorage.setItem(AVAILABILITY_KEY, JSON.stringify(data));

// const getAvailability = async () => {
//     const raw = await AsyncStorage.getItem(AVAILABILITY_KEY);
//     return raw ? JSON.parse(raw) : null;
// };

// const clearAvailability = async () =>
//     await AsyncStorage.removeItem(AVAILABILITY_KEY);

// // Save/load the provider profile so the app can use it without an extra call
// const setProvider = async (provider) =>
//     await AsyncStorage.setItem('providerProfile', JSON.stringify(provider));
// const getProvider = async () => {
//     const raw = await AsyncStorage.getItem('providerProfile');
//     return raw ? JSON.parse(raw) : null;
// };
// const getLocalProvider = async () => {
//     const raw = await AsyncStorage.getItem('providerProfile');
//     return raw ? JSON.parse(raw) : null;
// };
// const clearProvider = async () => await AsyncStorage.removeItem('providerProfile');

// // ─────────────────────────────────────────────────────────────────────────────
// // CORE REQUEST HELPER
// // ─────────────────────────────────────────────────────────────────────────────
// /**
//  * @param {string}  url     Full URL to call
//  * @param {string}  method  HTTP verb
//  * @param {object}  body    Request body (will be JSON-stringified)
//  * @param {boolean} auth    Whether to attach the Bearer token
//  * @returns {object}        Parsed ApiResponse<T>: { success, message, data }
//  * @throws  {Error}         With .message set to the API error message
//  */
// const apiRequest = async (url, method = 'GET', body = null, auth = false) => {
//     const headers = {
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//     };

//     if (auth) {
//         const token = await getToken();
//         if (token) headers['Authorization'] = `Bearer ${token}`;
//     }

//     const config = {
//         method,
//         headers,
//         ...(body ? { body: JSON.stringify(body) } : {}),
//     };

//     let response;
//     try {
//         response = await fetch(url, config);
//     } catch (networkError) {
//         // Network-level failure (server down, wrong IP, no wifi, etc.)
//         throw new Error(
//             'Cannot reach the server. Check your internet connection or BASE_URL setting.'
//         );
//     }

//     let data;
//     try {
//         data = await response.json();
//     } catch {
//         throw new Error(`Server returned non-JSON response (HTTP ${response.status})`);
//     }

//     // HTTP error: surface the API message so the UI can show it directly
//     if (!response.ok) {
//         throw new Error(data?.message || `Request failed with HTTP ${response.status}`);
//     }

//     return data; // { success: true, message: "...", data: ... }
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // PROVIDER AUTH API
// // ─────────────────────────────────────────────────────────────────────────────
// export const providerApi = {

//     // ── Step 1: Register ────────────────────────────────────────────────────
//     /**
//      * POST /api/provider/auth/signup
//      *
//      * @param {{
//      *   fullName: string,
//      *   mobile: string,       // 10-digit, e.g. "9876543210"  (strip +91 on FE if needed)
//      *   email: string,
//      *   password: string,
//      *   area?: string,
//      *   experienceYears?: number
//      * }} data
//      * @returns {ApiResponse<null>}
//      */
//     signup: async (data) => {
//         // Build multipart/form-data — required because we're sending image files
//         const formData = new FormData();
//         formData.append('fullName', data.fullName);
//         formData.append('mobile', data.mobile);
//         formData.append('email', data.email);
//         formData.append('password', data.password);
//         if (data.area) formData.append('area', data.area);
//         if (data.experienceYears != null)
//             formData.append('experienceYears', String(data.experienceYears));

//         // Append Aadhaar image
//         if (data.aadhaar) {
//             const aadhaarExt = data.aadhaar.uri.split('.').pop() || 'jpg';
//             const aadhaarMime = aadhaarExt.toLowerCase() === 'png' ? 'image/png' : 'image/jpeg';
//             formData.append('aadhaarFile', {
//                 uri: data.aadhaar.uri,
//                 name: 'aadhaar.' + aadhaarExt,
//                 type: aadhaarMime,
//             });
//         }

//         // Append PAN image
//         if (data.pan) {
//             const panExt = data.pan.uri.split('.').pop() || 'jpg';
//             const panMime = panExt.toLowerCase() === 'png' ? 'image/png' : 'image/jpeg';
//             formData.append('panFile', {
//                 uri: data.pan.uri,
//                 name: 'pan.' + panExt,
//                 type: panMime,
//             });
//         }

//         const headers = {
//             'Accept': 'application/json',
//             // Do NOT set Content-Type manually — fetch sets it with the correct boundary
//         };

//         let response;
//         try {
//             response = await fetch(`${BASE_AUTH_URL}/signup`, {
//                 method: 'POST',
//                 headers,
//                 body: formData,
//             });
//         } catch (networkError) {
//             throw new Error('Cannot reach the server. Check your internet connection or BASE_URL setting.');
//         }

//         let responseData;
//         try {
//             responseData = await response.json();
//         } catch {
//             throw new Error(`Server returned non-JSON response (HTTP ${response.status})`);
//         }

//         if (!response.ok) {
//             throw new Error(responseData?.message || `Request failed with HTTP ${response.status}`);
//         }

//         return responseData;
//     },

//     // ── Send / Resend OTP ───────────────────────────────────────────────────
//     /**
//      * POST /api/provider/auth/send-otp
//      *
//      * @param {{ email: string, purpose?: 'SIGNUP'|'FORGOT_PASSWORD'|'LOGIN_OTP' }} data
//      * @returns {ApiResponse<null>}
//      */
//     sendOtp: (data) => apiRequest(`${BASE_AUTH_URL}/send-otp`, 'POST', data),

//     // ── Step 2: Verify OTP ──────────────────────────────────────────────────
//     /**
//      * POST /api/provider/auth/verify-otp
//      *
//      * @param {{ email: string, otp: string, purpose?: string }} data
//      * @returns {ApiResponse<null>}
//      */
//     verifyOtp: (data) => apiRequest(`${BASE_AUTH_URL}/verify-otp`, 'POST', data),

//     // ── Step 3: Select Skills ───────────────────────────────────────────────
//     /**
//      * POST /api/provider/auth/select-skills
//      * Completes registration. Saves the JWT and provider profile on success.
//      *
//      * @param {{ email: string, skills: string[] }} data
//      * @returns {ApiResponse<{ token: string, role: string, provider: ProviderDto }>}
//      */
//     selectSkills: async (data) => {
//         const response = await apiRequest(`${BASE_AUTH_URL}/select-skills`, 'POST', data);
//         if (response?.data?.token) {
//             await setToken(response.data.token);
//             await setProvider(response.data.provider);
//         }
//         return response;
//     },

//     // ── Sign In ─────────────────────────────────────────────────────────────
//     /**
//      * POST /api/provider/auth/signin
//      * Saves the JWT and provider profile on success.
//      *
//      * @param {{ mobile: string, password: string }} data
//      * @returns {ApiResponse<{ token: string, role: string, provider: ProviderDto }>}
//      */
//     signin: async (data) => {
//         const response = await apiRequest(`${BASE_AUTH_URL}/signin`, 'POST', data);
//         if (response?.data?.token) {
//             await setToken(response.data.token);
//             await setProvider(response.data.provider);
//         }
//         return response;
//     },

//     // ── Service Categories (public — no JWT needed) ─────────────────────────
//     /**
//      * GET /api/provider/categories
//      * Returns the list of service categories for SelectServicesScreen.
//      *
//      * ✅ FIX: Uses BASE_PROVIDER_URL (not BASE_AUTH_URL) — this endpoint lives
//      *         at /api/provider/categories, NOT /api/provider/auth/categories
//      *
//      * @returns {ApiResponse<Array<{ id, icon, title, description }>>}
//      */
//     getCategories: () =>
//         apiRequest(`${BASE_PROVIDER_URL}/categories`, 'GET'),

//     // ── Authenticated provider endpoints ────────────────────────────────────
//     /**
//      * GET /api/provider/me
//      * Returns the logged-in provider's own profile.
//      * Requires a valid JWT stored via setToken().
//      *
//      * @returns {ApiResponse<ProviderDto>}
//      */
//     getMyProfile: () =>
//         apiRequest(`${BASE_PROVIDER_URL}/me`, 'GET', null, true),

//     /**
//      * GET /api/provider/{id}
//      * Returns any provider's public profile by ID.
//      *
//      * @param {number} providerId
//      * @returns {ApiResponse<ProviderDto>}
//      */
//     getProvider: (providerId) =>
//         apiRequest(`${BASE_PROVIDER_URL}/${providerId}`, 'GET', null, true),

//     // ── Availability (local persistence — no server call needed for MVP) ───────
//     /**
//      * Persists the provider's availability settings to AsyncStorage.
//      * Shape: { isOnline, selectedDays, startTime, endTime,
//      *          breakEnabled, breakStart, breakEnd }
//      */
//     saveAvailability,
//     getAvailability,
//     clearAvailability,

//     // ── Sign Out ─────────────────────────────────────────────────────────────
//     /**
//      * Clears the stored token and profile from AsyncStorage (client-side logout).
//      * The backend is stateless (JWT), so no server call is needed.
//      */
//     signout: async () => {
//         await clearToken();
//         await clearProvider();
//     },

//     // ── Expose helpers so screens can use them directly ──────────────────────
//     setToken,
//     getToken,
//     clearToken,
//     setProvider,
//     getProvider,
//     clearProvider,
//     // ✅ ADD THESE
//     saveAvailability,
//     getAvailability,
//     clearAvailability,
// };

// export default providerApi;

























import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const LAN_API_HOST = '40.192.103.12';
const getPrimaryApiHost = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const host = window.location?.hostname;
        if (
            host &&
            host !== '40.192.103.12' &&
            host !== '40.192.103.12' &&
            !host.endsWith('.exp.direct')
        ) {
            return host;
        }
    }
    return LAN_API_HOST;
};
const isHttpsWeb = () =>
    Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    window.location?.protocol === 'https:';
const API_HOST = getPrimaryApiHost();
const API_HOSTS = Array.from(new Set([
    API_HOST,
    ...(Platform.OS === 'web' ? ['40.192.103.12', '40.192.103.12'] : []),
    LAN_API_HOST,
    ...(Platform.OS === 'android' ? ['40.192.103.12'] : []),
]));
const API_ORIGINS = isHttpsWeb()
    ? []
    : API_HOSTS.map((host) => `http://${host}:8080`);
export const API_BASE_URL = API_ORIGINS[0] || '';
const BASE_AUTH_URL = `${API_BASE_URL}/api/provider/auth`;
const BASE_OWNER_AUTH_URL = `${API_BASE_URL}/api/owner/auth`;
const BASE_PROVIDER_URL = `${API_BASE_URL}/api/provider`;
const BASE_BOOKING_URL = `${API_BASE_URL}/api/bookings`;
const BASE_PAYMENT_URL = `${API_BASE_URL}/api/payments`;
const REQUEST_TIMEOUT_MS = 8000;

// ── Token helpers ────────────────────────────────────────────
const getToken = async () => await AsyncStorage.getItem('authToken');
const setToken = async (token) => await AsyncStorage.setItem('authToken', token);
const clearToken = async () => await AsyncStorage.removeItem('authToken');

// ── Availability helpers ─────────────────────────────────────
const AVAILABILITY_KEY = 'providerAvailability';
const PROVIDER_PREFERENCES_KEY = 'providerPreferences';
const OWNER_BOOKING_IDS_KEY = 'ownerBookingIds';
const saveAvailability = async (data) =>
    await AsyncStorage.setItem(AVAILABILITY_KEY, JSON.stringify(data));
const getAvailability = async () => {
    const raw = await AsyncStorage.getItem(AVAILABILITY_KEY);
    return raw ? JSON.parse(raw) : null;
};
const clearAvailability = async () =>
    await AsyncStorage.removeItem(AVAILABILITY_KEY);

const providerPreferenceListeners = new Set();
const ownerProfileListeners = new Set();

const notifyProviderPreferenceListeners = (preferences) => {
    providerPreferenceListeners.forEach((listener) => {
        try {
            listener(preferences);
        } catch {
            // Ignore listener failures so one screen cannot block preference saves.
        }
    });
};

const saveProviderPreferences = async (preferences) => {
    const nextPreferences = {
        language: preferences?.language || 'en',
        theme: preferences?.theme || 'light',
    };
    await AsyncStorage.setItem(PROVIDER_PREFERENCES_KEY, JSON.stringify(nextPreferences));
    notifyProviderPreferenceListeners(nextPreferences);
};

const getProviderPreferences = async () => {
    const raw = await AsyncStorage.getItem(PROVIDER_PREFERENCES_KEY);
    return raw ? JSON.parse(raw) : { language: 'en', theme: 'light' };
};

const subscribeProviderPreferences = (listener) => {
    providerPreferenceListeners.add(listener);
    return () => providerPreferenceListeners.delete(listener);
};

const notifyOwnerProfileListeners = (owner) => {
    ownerProfileListeners.forEach((listener) => {
        try {
            listener(owner);
        } catch {
            // Ignore listener failures so one screen cannot block profile updates.
        }
    });
};

const subscribeOwnerProfile = (listener) => {
    ownerProfileListeners.add(listener);
    return () => ownerProfileListeners.delete(listener);
};

const saveOwnerBookingId = async (bookingId) => {
    if (!bookingId) return;
    const raw = await AsyncStorage.getItem(OWNER_BOOKING_IDS_KEY);
    const ids = raw ? JSON.parse(raw) : [];
    const nextIds = [bookingId, ...ids.filter((id) => id !== bookingId)];
    await AsyncStorage.setItem(OWNER_BOOKING_IDS_KEY, JSON.stringify(nextIds));
};

const getOwnerBookingIds = async () => {
    const raw = await AsyncStorage.getItem(OWNER_BOOKING_IDS_KEY);
    return raw ? JSON.parse(raw) : [];
};

// ── Provider profile local storage helpers ───────────────────
const setProvider = async (provider) =>
    await AsyncStorage.setItem('providerProfile', JSON.stringify(provider));
const getLocalProvider = async () => {
    const raw = await AsyncStorage.getItem('providerProfile');
    return raw ? JSON.parse(raw) : null;
};
const clearProvider = async () =>
    await AsyncStorage.removeItem('providerProfile');

const setOwner = async (owner) => {
    await AsyncStorage.setItem('ownerProfile', JSON.stringify(owner));
    notifyOwnerProfileListeners(owner);
};
const clearOwner = async () => {
    await AsyncStorage.removeItem('ownerProfile');
    notifyOwnerProfileListeners(null);
};

// ── Core request helper ──────────────────────────────────────
const apiRequest = async (url, method = 'GET', body = null, auth = false) => {
    if (!API_ORIGINS.length) {
        throw new Error(`Do not use the HTTPS Expo tunnel for web login. Open this app with HTTP instead: http://localhost:8081 or http://${LAN_API_HOST}:8081. Keep Spring Boot running on port 8080.`);
    }

    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };
    if (auth) {
        const token = await getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    const config = {
        method,
        headers,
        ...(body ? { body: JSON.stringify(body) } : {}),
    };
    let response;
    const requestUrls = Array.from(new Set([
        url,
        ...API_ORIGINS.slice(1).map((origin) => url.replace(API_BASE_URL, origin)),
    ]));
    try {
        let lastError;
        for (const requestUrl of requestUrls) {
            try {
                const controller = typeof AbortController !== 'undefined'
                    ? new AbortController()
                    : null;
                const timeoutId = controller
                    ? setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
                    : null;
                response = await fetch(requestUrl, {
                    ...config,
                    ...(controller ? { signal: controller.signal } : {}),
                });
                if (timeoutId) clearTimeout(timeoutId);
                lastError = null;
                break;
            } catch (networkError) {
                lastError = networkError;
            }
        }
        if (lastError) throw lastError;
    } catch (networkError) {
        throw new Error(`Cannot reach the backend. Tried: ${requestUrls.join(', ')}. Start Spring Boot on port 8080, then reload.`);
    }
    let data;
    try {
        data = await response.json();
    } catch {
        throw new Error(`Server returned non-JSON response (HTTP ${response.status})`);
    }
    if (!response.ok) {
        throw new Error(data?.message || `Request failed with HTTP ${response.status}`);
    }
    return data;
};

// ── helpers ──────────────────────────────────────────────────────────────────

/** Converts a time string like "09:00 AM" → total minutes since midnight */
const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [timePart, period] = timeStr.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
};

/** Returns today's short day name, e.g. "Mon", "Tue" */
const getTodayShortDay = () => {
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return DAYS[new Date().getDay()];
};

// ── Provider API ─────────────────────────────────────────────
const getExtensionFromUri = (uri = "", fallback = "jpg") => {
    const cleanUri = uri.split("?")[0];
    const ext = cleanUri.includes(".") ? cleanUri.split(".").pop().toLowerCase() : fallback;
    return ext || fallback;
};

const appendDocumentFile = async (formData, fieldName, document, fallbackName) => {
    if (!document?.uri) return;

    const ext = getExtensionFromUri(document.uri);
    const type = document.mimeType || (ext === "png" ? "image/png" : "image/jpeg");
    const fileName = `${fallbackName}.${ext === "jpeg" ? "jpg" : ext}`;

    if (
        typeof File !== "undefined" &&
        (document.uri.startsWith("blob:") ||
            document.uri.startsWith("data:") ||
            document.uri.startsWith("http"))
    ) {
        let blob;
        try {
            blob = await fetch(document.uri).then((res) => res.blob());
        } catch {
            throw new Error(`Could not read ${fallbackName} image. Please select the file again.`);
        }
        formData.append(fieldName, new File([blob], fileName, { type: blob.type || type }));
        return;
    }

    formData.append(fieldName, {
        uri: document.uri,
        name: fileName,
        type,
    });
};

const formatApiError = (responseData, status) => {
    if (responseData?.data && typeof responseData.data === "object") {
        return Object.values(responseData.data).filter(Boolean).join("\n");
    }

    return responseData?.message || `Request failed with HTTP ${status}`;
};

export const providerApi = {

    // ── Signup ───────────────────────────────────────────────
    signup: async (data) => {
        const formData = new FormData();
        formData.append('fullName', data.fullName?.trim() || "");
        formData.append('mobile', (data.mobile || "").replace(/\s/g, "").replace(/^\+91/, ""));
        formData.append('email', data.email?.toLowerCase().trim() || "");
        formData.append('password', data.password || "");
        if (data.area) formData.append('area', data.area);
        if (data.experienceYears != null)
            formData.append('experienceYears', String(data.experienceYears));
        await appendDocumentFile(formData, 'aadhaarFile', data.aadhaar, 'aadhaar');
        await appendDocumentFile(formData, 'panFile', data.pan, 'pan');
        let response;
        try {
            response = await fetch(`${BASE_AUTH_URL}/signup`, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: formData,
            });
        } catch {
            throw new Error('Cannot reach the server.');
        }
        let responseData;
        try {
            responseData = await response.json();
        } catch {
            throw new Error(`Server returned non-JSON response (HTTP ${response.status})`);
        }
        if (!response.ok)
            throw new Error(formatApiError(responseData, response.status));
        return responseData;
    },

    // ── Send OTP ─────────────────────────────────────────────
    sendOtp: (data) => apiRequest(`${BASE_AUTH_URL}/send-otp`, 'POST', data),

    // ── Verify OTP ───────────────────────────────────────────
    verifyOtp: (data) => apiRequest(`${BASE_AUTH_URL}/verify-otp`, 'POST', data),

    // ── Select Skills (registration step 3) ──────────────────
    selectSkills: async (data) => {
        const response = await apiRequest(`${BASE_AUTH_URL}/select-skills`, 'POST', data);
        if (response?.data?.token) {
            await setToken(response.data.token);
            await setProvider(response.data.provider);
        }
        return response;
    },

    // ── Sign In ──────────────────────────────────────────────
    signin: async (data) => {
        const response = await apiRequest(`${BASE_AUTH_URL}/signin`, 'POST', data);
        if (response?.data?.token) {
            await setToken(response.data.token);
            await setProvider(response.data.provider);
        }
        return response;
    },

    // ── Forgot Password: Check mobile & send OTP ─────────────
    checkMobile: (mobile, purpose = 'FORGOT_PASSWORD') =>
        apiRequest(`${BASE_AUTH_URL}/check-mobile`, 'POST', { mobile, purpose }),

    // ── Forgot Password: Verify OTP ──────────────────────────
    verifyOtpForgot: (mobile, otp, purpose = 'FORGOT_PASSWORD') =>
        apiRequest(`${BASE_AUTH_URL}/verify-otp`, 'POST', { mobile, otp, purpose }),

    // ── Forgot Password: Reset password ──────────────────────
    // OTP was already verified in the previous step.
    // Backend should match mobile against the registered provider's number.
    resetPassword: (mobile, otp, newPassword) =>
        apiRequest(`${BASE_AUTH_URL}/reset-password`, 'POST', { mobile, otp, newPassword }),

    ownerSignup: (data) =>
        apiRequest(`${BASE_OWNER_AUTH_URL}/signup`, 'POST', data),

    ownerVerifyOtp: async (mobile, otp) => {
        const response = await apiRequest(`${BASE_OWNER_AUTH_URL}/verify-otp`, 'POST', { mobile, otp });
        if (response?.data) {
            await setOwner(response.data);
        }
        return response;
    },

    ownerSignin: async (data) => {
        const response = await apiRequest(`${BASE_OWNER_AUTH_URL}/signin`, 'POST', data);
        if (response?.data?.token) {
            await AsyncStorage.setItem('ownerAuthToken', response.data.token);
            await setOwner(response.data.owner);
        }
        return response;
    },

    getLocalOwner: async () => {
        const raw = await AsyncStorage.getItem('ownerProfile');
        return raw ? JSON.parse(raw) : null;
    },

    getOwnerProfile: (mobile) =>
        apiRequest(`${BASE_OWNER_AUTH_URL}/profile?mobile=${encodeURIComponent(mobile)}`, 'GET'),

    updateOwnerProfile: async (payload) => {
        const response = await apiRequest(`${BASE_OWNER_AUTH_URL}/profile`, 'PUT', payload);
        if (response?.data) {
            await setOwner(response.data);
        }
        return response;
    },

    getOwnerNotificationSettings: (mobile) =>
        apiRequest(`${BASE_OWNER_AUTH_URL}/notification-settings?mobile=${encodeURIComponent(mobile)}`, 'GET'),

    updateOwnerNotificationSettings: async (mobile, settings) => {
        const response = await apiRequest(
            `${BASE_OWNER_AUTH_URL}/notification-settings?mobile=${encodeURIComponent(mobile)}`,
            'PUT',
            settings
        );
        if (response?.data) {
            const owner = await providerApi.getLocalOwner();
            if (owner) {
                await setOwner({ ...owner, notificationSettings: response.data });
            }
        }
        return response;
    },

    sendOwnerTestNotification: (mobile, event) =>
        apiRequest(`${API_BASE_URL}/api/owner/notifications/test?mobile=${encodeURIComponent(mobile)}`, 'POST', event),

    getOwnerNotificationStreamUrl: (mobile) =>
        `${API_BASE_URL}/api/owner/notifications/stream?mobile=${encodeURIComponent(mobile)}`,

    ownerCheckMobile: (mobile, purpose = 'FORGOT_PASSWORD') =>
        apiRequest(`${BASE_OWNER_AUTH_URL}/check-mobile`, 'POST', { mobile, purpose }),

    ownerResetPassword: (mobile, otp, newPassword) =>
        apiRequest(`${BASE_OWNER_AUTH_URL}/reset-password`, 'POST', { mobile, otp, newPassword }),

    // ── Get Categories (public) ──────────────────────────────
    getCategories: () => apiRequest(`${BASE_PROVIDER_URL}/categories`, 'GET'),

    getAdminDepartments: () =>
        apiRequest(`${BASE_PROVIDER_URL}/admin/departments`, 'GET'),

    getAdminProvidersBySkill: (skill) =>
        apiRequest(`${BASE_PROVIDER_URL}/public/providers?skill=${encodeURIComponent(skill)}`, 'GET'),

    getOnlineProvidersBySkill: (skill) =>
        apiRequest(`${BASE_PROVIDER_URL}/public/providers?skill=${encodeURIComponent(skill)}`, 'GET'),

    createBooking: async (payload) => {
        const response = await apiRequest(BASE_BOOKING_URL, 'POST', payload);
        if (response?.data?.id) {
            await saveOwnerBookingId(response.data.id);
        }
        return response;
    },

    getBooking: (bookingId) =>
        apiRequest(`${BASE_BOOKING_URL}/${bookingId}`, 'GET'),

    getOwnerBookings: async () => {
        const ids = await getOwnerBookingIds();
        const results = await Promise.allSettled(
            ids.map((id) => apiRequest(`${BASE_BOOKING_URL}/${id}`, 'GET'))
        );
        return results
            .filter((result) => result.status === 'fulfilled' && result.value?.data)
            .map((result) => result.value.data);
    },

    getProviderBookings: (providerId) =>
        apiRequest(`${BASE_BOOKING_URL}/provider/${providerId}`, 'GET'),

    updateBookingDetails: (bookingId, payload) =>
        apiRequest(`${BASE_BOOKING_URL}/${bookingId}/details`, 'POST', payload),

    acceptBooking: (bookingId) =>
        apiRequest(`${BASE_BOOKING_URL}/${bookingId}/accept`, 'POST'),

    rejectBooking: (bookingId) =>
        apiRequest(`${BASE_BOOKING_URL}/${bookingId}/reject`, 'POST'),

    startBooking: (bookingId, otp) =>
        apiRequest(`${BASE_BOOKING_URL}/${bookingId}/start`, 'POST', { otp }),

    completeBooking: (bookingId) =>
        apiRequest(`${BASE_BOOKING_URL}/${bookingId}/complete`, 'POST'),

    saveBookingPayment: (bookingId, paymentMethod) =>
        apiRequest(`${BASE_BOOKING_URL}/${bookingId}/payment`, 'POST', { paymentMethod }),

    createPaymentOrder: (amount) =>
        apiRequest(`${BASE_PAYMENT_URL}/create-order`, 'POST', { amount }),

    verifyPayment: (paymentData) =>
        apiRequest(`${BASE_PAYMENT_URL}/verify`, 'POST', paymentData),

    rateBooking: (bookingId, rating, review) =>
        apiRequest(`${BASE_BOOKING_URL}/${bookingId}/rating`, 'POST', { rating, review }),

    // ── Get my profile — always fetches fresh from server ────
    // Falls back to local storage if server unreachable
    getProvider: async () => {
        try {
            const response = await apiRequest(`${BASE_PROVIDER_URL}/me`, 'GET', null, true);
            if (response?.data) {
                await setProvider(response.data); // keep local cache in sync
                return response.data;
            }
        } catch (e) {
            // Server unreachable — fall back to local cache
            const local = await getLocalProvider();
            if (local) return local;
            throw e;
        }
        return null;
    },

    // ── Update profile ───────────────────────────────────────
    updateProfile: async (payload) => {
        const response = await apiRequest(
            `${BASE_PROVIDER_URL}/me`, 'PUT', payload, true
        );
        if (response?.data) {
            // Update local cache with fresh server data
            await setProvider(response.data);
        }
        return response;
    },

    // ── Get provider by ID ───────────────────────────────────
    getMyProfile: () =>
        apiRequest(`${BASE_PROVIDER_URL}/me`, 'GET', null, true),

    // ── Availability ─────────────────────────────────────────
    saveAvailability,
    getAvailability,
    clearAvailability,
    saveProviderPreferences,
    getProviderPreferences,
    subscribeProviderPreferences,
    subscribeOwnerProfile,

    checkIsOnlineNow: async () => {
        try {
            const availability = await providerApi.getAvailability();
            if (!availability) return false;

            const {
                isOnline,
                selectedDays = [],
                startTime = '09:00 AM',
                endTime = '08:00 PM',
                breakEnabled = false,
                breakStart = '01:00 PM',
                breakEnd = '02:00 PM',
            } = availability;

            // Manual override — provider explicitly went offline
            if (!isOnline) return false;

            // Is today a working day?
            const today = getTodayShortDay();
            if (!selectedDays.includes(today)) return false;

            // Is current time within working hours?
            const now = new Date();
            const nowMinutes = now.getHours() * 60 + now.getMinutes();
            const startMinutes = timeToMinutes(startTime);
            const endMinutes = timeToMinutes(endTime);

            if (nowMinutes < startMinutes || nowMinutes >= endMinutes) return false;

            // Is current time within a break?
            if (breakEnabled) {
                const breakStartMinutes = timeToMinutes(breakStart);
                const breakEndMinutes = timeToMinutes(breakEnd);
                if (nowMinutes >= breakStartMinutes && nowMinutes < breakEndMinutes) return false;
            }

            return true;
        } catch {
            return false;
        }
    },

    // ── Sign Out ─────────────────────────────────────────────
    signout: async () => {
        await clearToken();
        await clearProvider();
        await clearOwner();
        await AsyncStorage.removeItem('ownerAuthToken');
        await AsyncStorage.removeItem(PROVIDER_PREFERENCES_KEY);
        await clearAvailability();
    },

    // ── Expose helpers ────────────────────────────────────────
    setToken,
    getToken,
    clearToken,
    setProvider,
    clearProvider,
    setOwner,
    clearOwner,
};




export default providerApi;
