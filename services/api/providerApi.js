import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// ── Config ───────────────────────────────────────────────────
const LAN_API_HOST       = '40.192.103.12';
const PORT               = 8080;
const REQUEST_TIMEOUT_MS = 8000;

// Never return empty on Android/iOS — only skip HTTP on HTTPS web
const buildOrigins = () => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
        return [`http://${LAN_API_HOST}:${PORT}`];
    }
    if (
        Platform.OS === 'web' &&
        typeof window !== 'undefined' &&
        window.location?.protocol === 'https:'
    ) {
        return []; // browser blocks mixed content — surface a clear error
    }
    return [`http://${LAN_API_HOST}:${PORT}`];
};

const API_ORIGINS = buildOrigins();
export const API_BASE_URL = API_ORIGINS[0] ?? '';

const BASE_AUTH_URL       = `${API_BASE_URL}/api/provider/auth`;
const BASE_OWNER_AUTH_URL = `${API_BASE_URL}/api/owner/auth`;
const BASE_PROVIDER_URL   = `${API_BASE_URL}/api/provider`;
const BASE_BOOKING_URL    = `${API_BASE_URL}/api/bookings`;
const BASE_PAYMENT_URL    = `${API_BASE_URL}/api/payments`;

// ── Token helpers ────────────────────────────────────────────
const getToken   = async () => AsyncStorage.getItem('authToken');
const setToken   = async (token) => AsyncStorage.setItem('authToken', token);
const clearToken = async () => AsyncStorage.removeItem('authToken');

// ── Availability helpers ─────────────────────────────────────
const AVAILABILITY_KEY         = 'providerAvailability';
const PROVIDER_PREFERENCES_KEY = 'providerPreferences';
const OWNER_BOOKING_IDS_KEY    = 'ownerBookingIds';

const saveAvailability  = async (data) => AsyncStorage.setItem(AVAILABILITY_KEY, JSON.stringify(data));
const getAvailability   = async () => { const r = await AsyncStorage.getItem(AVAILABILITY_KEY); return r ? JSON.parse(r) : null; };
const clearAvailability = async () => AsyncStorage.removeItem(AVAILABILITY_KEY);

// ── Preference / profile listeners ──────────────────────────
const providerPreferenceListeners = new Set();
const ownerProfileListeners       = new Set();

const notifyProviderPreferenceListeners = (prefs) => {
    providerPreferenceListeners.forEach((l) => { try { l(prefs); } catch { /* ignore */ } });
};
const notifyOwnerProfileListeners = (owner) => {
    ownerProfileListeners.forEach((l) => { try { l(owner); } catch { /* ignore */ } });
};

const saveProviderPreferences = async (preferences) => {
    const next = { language: preferences?.language || 'en', theme: preferences?.theme || 'light' };
    await AsyncStorage.setItem(PROVIDER_PREFERENCES_KEY, JSON.stringify(next));
    notifyProviderPreferenceListeners(next);
};
const getProviderPreferences = async () => {
    const r = await AsyncStorage.getItem(PROVIDER_PREFERENCES_KEY);
    return r ? JSON.parse(r) : { language: 'en', theme: 'light' };
};
const subscribeProviderPreferences = (listener) => {
    providerPreferenceListeners.add(listener);
    return () => providerPreferenceListeners.delete(listener);
};
const subscribeOwnerProfile = (listener) => {
    ownerProfileListeners.add(listener);
    return () => ownerProfileListeners.delete(listener);
};

// ── Owner booking ID helpers ─────────────────────────────────
const saveOwnerBookingId = async (bookingId) => {
    if (!bookingId) return;
    const r   = await AsyncStorage.getItem(OWNER_BOOKING_IDS_KEY);
    const ids = r ? JSON.parse(r) : [];
    await AsyncStorage.setItem(
        OWNER_BOOKING_IDS_KEY,
        JSON.stringify([bookingId, ...ids.filter((id) => id !== bookingId)])
    );
};
const getOwnerBookingIds = async () => {
    const r = await AsyncStorage.getItem(OWNER_BOOKING_IDS_KEY);
    return r ? JSON.parse(r) : [];
};

// ── Provider / Owner profile local storage ───────────────────
const setProvider      = async (p)     => AsyncStorage.setItem('providerProfile', JSON.stringify(p));
const getLocalProvider = async ()      => { const r = await AsyncStorage.getItem('providerProfile'); return r ? JSON.parse(r) : null; };
const clearProvider    = async ()      => AsyncStorage.removeItem('providerProfile');

const setOwner   = async (owner) => { await AsyncStorage.setItem('ownerProfile', JSON.stringify(owner)); notifyOwnerProfileListeners(owner); };
const clearOwner = async ()      => { await AsyncStorage.removeItem('ownerProfile'); notifyOwnerProfileListeners(null); };

// ── Core request helper ──────────────────────────────────────
/**
 * Accepts a full URL (e.g. `${BASE_AUTH_URL}/signin`).
 * Retries across API_ORIGINS by swapping the origin prefix.
 */
const apiRequest = async (fullUrl, method = 'GET', body = null, auth = false) => {
    if (!API_ORIGINS.length) {
        throw new Error(
            `HTTPS web detected — cannot make plain HTTP requests. ` +
            `Open the app via HTTP or add HTTPS to your backend (${LAN_API_HOST}:${PORT}).`
        );
    }

    const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
    if (auth) {
        const token = await getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    const config = {
        method,
        headers,
        ...(body !== null ? { body: JSON.stringify(body) } : {}),
    };

    // Build retry list: replace origin in the full URL for each fallback
    const urlsToTry = API_ORIGINS.map((origin) =>
        fullUrl.replace(API_ORIGINS[0], origin)
    );

    let lastError;
    for (const targetUrl of urlsToTry) {
        const controller = new AbortController();
        const timeoutId  = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        try {
            const response = await fetch(targetUrl, { ...config, signal: controller.signal });
            clearTimeout(timeoutId);

            let data;
            try   { data = await response.json(); }
            catch { throw new Error(`Server returned non-JSON response (HTTP ${response.status})`); }

            if (!response.ok) {
                throw new Error(data?.message || `Request failed with HTTP ${response.status}`);
            }
            return data;

        } catch (err) {
            clearTimeout(timeoutId);
            // HTTP-level errors (4xx/5xx) — don't retry, surface immediately
            if (
                err.message?.includes('HTTP') ||
                err.message?.includes('non-JSON') ||
                (err.message && !String(err.message).toLowerCase().includes('network') && err.name !== 'AbortError')
            ) {
                throw err;
            }
            lastError = err;
        }
    }

    // All origins exhausted
    throw new Error(
        `Cannot reach the backend at http://${LAN_API_HOST}:${PORT}. ` +
        `Make sure the server is running. ` +
        `(Android: ensure "usesCleartextTraffic": true is in app.json → android)`
    );
};

// ── Misc helpers ─────────────────────────────────────────────
const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [timePart, period] = timeStr.split(' ');
    let [hours, minutes]     = timePart.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours  = 0;
    return hours * 60 + minutes;
};

const getTodayShortDay = () => {
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return DAYS[new Date().getDay()];
};

// ── File helpers ─────────────────────────────────────────────
const getExtensionFromUri = (uri = '', fallback = 'jpg') => {
    const clean = uri.split('?')[0];
    const ext   = clean.includes('.') ? clean.split('.').pop().toLowerCase() : fallback;
    return ext || fallback;
};

const appendDocumentFile = async (formData, fieldName, document, fallbackName) => {
    if (!document?.uri) return;
    const ext      = getExtensionFromUri(document.uri);
    const type     = document.mimeType || (ext === 'png' ? 'image/png' : 'image/jpeg');
    const fileName = `${fallbackName}.${ext === 'jpeg' ? 'jpg' : ext}`;

    if (
        typeof File !== 'undefined' &&
        (document.uri.startsWith('blob:') || document.uri.startsWith('data:') || document.uri.startsWith('http'))
    ) {
        let blob;
        try   { blob = await fetch(document.uri).then((r) => r.blob()); }
        catch { throw new Error(`Could not read ${fallbackName} image. Please select the file again.`); }
        formData.append(fieldName, new File([blob], fileName, { type: blob.type || type }));
        return;
    }
    formData.append(fieldName, { uri: document.uri, name: fileName, type });
};

const formatApiError = (responseData, status) => {
    if (responseData?.data && typeof responseData.data === 'object') {
        return Object.values(responseData.data).filter(Boolean).join('\n');
    }
    return responseData?.message || `Request failed with HTTP ${status}`;
};

// ── Provider API ─────────────────────────────────────────────
export const providerApi = {

    // ── Signup ───────────────────────────────────────────────
    signup: async (data) => {
        const formData = new FormData();
        formData.append('fullName',        data.fullName?.trim() || '');
        formData.append('mobile',          (data.mobile || '').replace(/\s/g, '').replace(/^\+91/, ''));
        formData.append('email',           data.email?.toLowerCase().trim() || '');
        formData.append('password',        data.password || '');
        if (data.area)                     formData.append('area', data.area);
        if (data.experienceYears != null)  formData.append('experienceYears', String(data.experienceYears));
        await appendDocumentFile(formData, 'aadhaarFile', data.aadhaar, 'aadhaar');
        await appendDocumentFile(formData, 'panFile',     data.pan,     'pan');

        let response;
        try {
            response = await fetch(`${BASE_AUTH_URL}/signup`, {
                method:  'POST',
                headers: { Accept: 'application/json' },
                body:    formData,
            });
        } catch {
            throw new Error('Cannot reach the server. Check your network and server status.');
        }

        let responseData;
        try   { responseData = await response.json(); }
        catch { throw new Error(`Server returned non-JSON response (HTTP ${response.status})`); }

        if (!response.ok) throw new Error(formatApiError(responseData, response.status));
        return responseData;
    },

    // ── Provider Auth ────────────────────────────────────────
    sendOtp:         (data)                                      => apiRequest(`${BASE_AUTH_URL}/send-otp`,      'POST', data),
    verifyOtp:       (data)                                      => apiRequest(`${BASE_AUTH_URL}/verify-otp`,    'POST', data),
    checkMobile:     (mobile, purpose = 'FORGOT_PASSWORD')       => apiRequest(`${BASE_AUTH_URL}/check-mobile`,  'POST', { mobile, purpose }),
    verifyOtpForgot: (mobile, otp, purpose = 'FORGOT_PASSWORD')  => apiRequest(`${BASE_AUTH_URL}/verify-otp`,   'POST', { mobile, otp, purpose }),
    resetPassword:   (mobile, otp, newPassword)                  => apiRequest(`${BASE_AUTH_URL}/reset-password`, 'POST', { mobile, otp, newPassword }),

    selectSkills: async (data) => {
        const response = await apiRequest(`${BASE_AUTH_URL}/select-skills`, 'POST', data);
        if (response?.data?.token) {
            await setToken(response.data.token);
            await setProvider(response.data.provider);
        }
        return response;
    },

    signin: async (data) => {
        const response = await apiRequest(`${BASE_AUTH_URL}/signin`, 'POST', data);
        if (response?.data?.token) {
            await setToken(response.data.token);
            await setProvider(response.data.provider);
        }
        return response;
    },

    // ── Owner Auth ───────────────────────────────────────────
    ownerSignup: (data) => apiRequest(`${BASE_OWNER_AUTH_URL}/signup`, 'POST', data),

    ownerVerifyOtp: async (mobile, otp) => {
        const response = await apiRequest(`${BASE_OWNER_AUTH_URL}/verify-otp`, 'POST', { mobile, otp });
        if (response?.data) await setOwner(response.data);
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

    ownerCheckMobile:   (mobile, purpose = 'FORGOT_PASSWORD') => apiRequest(`${BASE_OWNER_AUTH_URL}/check-mobile`,   'POST', { mobile, purpose }),
    ownerResetPassword: (mobile, otp, newPassword)             => apiRequest(`${BASE_OWNER_AUTH_URL}/reset-password`, 'POST', { mobile, otp, newPassword }),

    // ── Owner Profile ────────────────────────────────────────
    getLocalOwner: async () => {
        const r = await AsyncStorage.getItem('ownerProfile');
        return r ? JSON.parse(r) : null;
    },

    getOwnerProfile: (mobile) =>
        apiRequest(`${BASE_OWNER_AUTH_URL}/profile?mobile=${encodeURIComponent(mobile)}`, 'GET'),

    updateOwnerProfile: async (payload) => {
        const response = await apiRequest(`${BASE_OWNER_AUTH_URL}/profile`, 'PUT', payload);
        if (response?.data) await setOwner(response.data);
        return response;
    },

    // ── Owner Notifications ──────────────────────────────────
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
            if (owner) await setOwner({ ...owner, notificationSettings: response.data });
        }
        return response;
    },

    sendOwnerTestNotification: (mobile, event) =>
        apiRequest(`${API_BASE_URL}/api/owner/notifications/test?mobile=${encodeURIComponent(mobile)}`, 'POST', event),

    getOwnerNotificationStreamUrl: (mobile) =>
        `${API_BASE_URL}/api/owner/notifications/stream?mobile=${encodeURIComponent(mobile)}`,

    // ── Categories / Departments ─────────────────────────────
    getCategories:             ()      => apiRequest(`${BASE_PROVIDER_URL}/categories`, 'GET'),
    getAdminDepartments:       ()      => apiRequest(`${BASE_PROVIDER_URL}/admin/departments`, 'GET'),
    getAdminProvidersBySkill:  (skill) => apiRequest(`${BASE_PROVIDER_URL}/public/providers?skill=${encodeURIComponent(skill)}`, 'GET'),
    getOnlineProvidersBySkill: (skill) => apiRequest(`${BASE_PROVIDER_URL}/public/providers?skill=${encodeURIComponent(skill)}`, 'GET'),

    // ── Bookings ─────────────────────────────────────────────
    createBooking: async (payload) => {
        const response = await apiRequest(BASE_BOOKING_URL, 'POST', payload);
        if (response?.data?.id) await saveOwnerBookingId(response.data.id);
        return response;
    },

    getBooking:          (bookingId)  => apiRequest(`${BASE_BOOKING_URL}/${bookingId}`,           'GET'),
    getProviderBookings: (providerId) => apiRequest(`${BASE_BOOKING_URL}/provider/${providerId}`,  'GET'),

    getOwnerBookings: async () => {
        const ids     = await getOwnerBookingIds();
        const results = await Promise.allSettled(ids.map((id) => apiRequest(`${BASE_BOOKING_URL}/${id}`, 'GET')));
        return results
            .filter((r) => r.status === 'fulfilled' && r.value?.data)
            .map((r)   => r.value.data);
    },

    updateBookingDetails: (bookingId, payload)        => apiRequest(`${BASE_BOOKING_URL}/${bookingId}/details`,  'POST', payload),
    acceptBooking:        (bookingId)                 => apiRequest(`${BASE_BOOKING_URL}/${bookingId}/accept`,   'POST'),
    rejectBooking:        (bookingId)                 => apiRequest(`${BASE_BOOKING_URL}/${bookingId}/reject`,   'POST'),
    startBooking:         (bookingId, otp)            => apiRequest(`${BASE_BOOKING_URL}/${bookingId}/start`,    'POST', { otp }),
    completeBooking:      (bookingId)                 => apiRequest(`${BASE_BOOKING_URL}/${bookingId}/complete`, 'POST'),
    saveBookingPayment:   (bookingId, paymentMethod)  => apiRequest(`${BASE_BOOKING_URL}/${bookingId}/payment`,  'POST', { paymentMethod }),
    rateBooking:          (bookingId, rating, review) => apiRequest(`${BASE_BOOKING_URL}/${bookingId}/rating`,   'POST', { rating, review }),

    // ── Payments ─────────────────────────────────────────────
    createPaymentOrder: (amount)      => apiRequest(`${BASE_PAYMENT_URL}/create-order`, 'POST', { amount }),
    verifyPayment:      (paymentData) => apiRequest(`${BASE_PAYMENT_URL}/verify`,       'POST', paymentData),

    // ── Provider Profile ─────────────────────────────────────
    getProvider: async () => {
        try {
            const response = await apiRequest(`${BASE_PROVIDER_URL}/me`, 'GET', null, true);
            if (response?.data) {
                await setProvider(response.data);
                return response.data;
            }
        } catch (e) {
            const local = await getLocalProvider();
            if (local) return local;
            throw e;
        }
        return null;
    },

    updateProfile: async (payload) => {
        const response = await apiRequest(`${BASE_PROVIDER_URL}/me`, 'PUT', payload, true);
        if (response?.data) await setProvider(response.data);
        return response;
    },

    getMyProfile: () => apiRequest(`${BASE_PROVIDER_URL}/me`, 'GET', null, true),

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
                startTime    = '09:00 AM',
                endTime      = '08:00 PM',
                breakEnabled = false,
                breakStart   = '01:00 PM',
                breakEnd     = '02:00 PM',
            } = availability;

            if (!isOnline) return false;

            const today = getTodayShortDay();
            if (!selectedDays.includes(today)) return false;

            const now        = new Date();
            const nowMinutes = now.getHours() * 60 + now.getMinutes();
            if (nowMinutes < timeToMinutes(startTime) || nowMinutes >= timeToMinutes(endTime)) return false;
            if (breakEnabled && nowMinutes >= timeToMinutes(breakStart) && nowMinutes < timeToMinutes(breakEnd)) return false;

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