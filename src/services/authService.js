// authService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const APP_NAME = import.meta.env.VITE_APP_NAME || "Driver's App";
const APP_VERSION = import.meta.env.VITE_APP_VERSION || "1.0.0";
const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || "app_access_token";
const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY || "app_refresh_token";
const USER_KEY = "app_user";

/**
 * Axios instance pre-configured with base URL and required metadata headers.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'accept': '*/*',
    'app-name': APP_NAME,
    'app-version': APP_VERSION,
  },
});

// ─── Token Refresh Queue ───────────────────────────────────────────────────
// Guards against competing 401s firing multiple simultaneous refresh requests.
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ─── Request Interceptor ───────────────────────────────────────────────────
// Injects Bearer token on every outgoing request.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// ─── Response Interceptor ──────────────────────────────────────────────────
// Unwraps the backend envelope, handles structural failures, and retries
// expired requests transparently via a background refresh handshake.
apiClient.interceptors.response.use(
  (response) => {
    const data = response.data;

    // Handle valid HTTP 200 statuses that carry structural application failures
    if (data && Object.prototype.hasOwnProperty.call(data, 'isSuccessful') && !data.isSuccessful) {
      const fallbackMsg = 'An unexpected error occurred.';
      return Promise.reject(new Error(data.message || data.result?.message || fallbackMsg));
    }

    // Return the clean result payload immediately
    return data?.result !== undefined ? data.result : data;
  },
  async (error) => {
    const originalRequest = error.config;
    const data = error.response?.data;

    // Detect proxy misconfiguration returning an HTML error page instead of JSON
    if (typeof data === 'string' && data.includes('<!DOCTYPE html>')) {
      return Promise.reject(new Error('Local server configuration issue: Request matched proxy route but endpoint path was invalid.'));
    }

    // ── Token Expiry: 401 Unauthorized ────────────────────────────────────
    if (error.response?.status === 401 && !originalRequest._retry) {

      // Never attempt a refresh if the login request itself returns a 401
      if (
        originalRequest.url === '/auth/login' ||
        originalRequest.url?.includes('/auth/driver/login')
      ) {
        return Promise.reject(new Error(data?.message || 'Invalid credentials.'));
      }

      // Queue any parallel requests that arrive while refresh is in progress
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const currentRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (!currentRefreshToken) throw new Error('No refresh token available.');

        // Use a raw axios call to avoid triggering the interceptors recursively
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken: currentRefreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
              'app-name': APP_NAME,
              'app-version': APP_VERSION,
            },
          }
        );

        const newResult = refreshResponse.data?.result;
        if (!newResult?.token) throw new Error('Refresh response missing token.');

        // Persist the new tokens
        localStorage.setItem(AUTH_TOKEN_KEY, newResult.token);
        if (newResult.refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, newResult.refreshToken);
        }

        // Flush queued requests with the fresh credentials
        processQueue(null, newResult.token);
        originalRequest.headers['Authorization'] = `Bearer ${newResult.token}`;
        return apiClient(originalRequest);

      } catch (refreshError) {
        // Refresh token expired or invalid — evict session and force re-login
        processQueue(refreshError, null);
        authService.logout();
        window.location.href = '/';
        return Promise.reject(new Error('Session expired. Please log in again.'));
      } finally {
        isRefreshing = false;
      }
    }

    // All other errors: extract the backend message cleanly
    const message =
      data?.message ||
      data?.result?.message ||
      error.message ||
      'An unexpected network error occurred.';

    return Promise.reject(new Error(message));
  }
);

// ─── Auth Service ──────────────────────────────────────────────────────────
export const authService = {
  /**
   * Public Endpoint for logging in (AGENTS and STAFF)
   */
  async login(email, password) {
    const result = await apiClient.post('/auth/login', { email, password });
    authService._persistSession(result);
    return { user: result.user, token: result.token };
  },

  /**
   * Driver Login via standard corporate SAP Identity
   */
  async driverLogin({ sapId, dateOfLicenseExpiry, lastFourDigitsOfPhoneNumber, deviceId }) {
    const result = await apiClient.post(
      '/auth/driver/login',
      { sapId, dateOfLicenseExpiry, lastFourDigitsOfPhoneNumber, deviceId },
      { headers: { 'deviceId': deviceId } }
    );
    authService._persistSession(result);
    return { user: result.user, token: result.token };
  },

  /**
   * Driver Login via fallback routing channels
   */
  async driverLoginAlt({ sapId, dateOfLicenseExpiry, lastFourDigitsOfPhoneNumber, deviceId }) {
    const result = await apiClient.post(
      '/auth/driver/login/alt',
      { sapId, dateOfLicenseExpiry, lastFourDigitsOfPhoneNumber, deviceId }
    );
    authService._persistSession(result);
    return { user: result.user, token: result.token };
  },

  /**
   * Request a recovery password reset token link
   */
  async requestPasswordReset(email) {
    return await apiClient.post('/auth/forget_password', { email });
  },

  _persistSession(result) {
    if (result?.token) localStorage.setItem(AUTH_TOKEN_KEY, result.token);
    if (result?.refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken);
    if (result?.user) localStorage.setItem(USER_KEY, JSON.stringify(result.user));
  },

  getToken() { return localStorage.getItem(AUTH_TOKEN_KEY); },
  getUser() {
    const raw = localStorage.getItem(USER_KEY);
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  },
  isAuthenticated() { return !!localStorage.getItem(AUTH_TOKEN_KEY); },
  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
