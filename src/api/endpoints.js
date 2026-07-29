// ─── Centralized API Endpoint Map ──────────────────────────────────────────
// All backend route paths live here so they're easy to find, refactor,
// and grep across the codebase.  No service or component should hard-code
// a path string directly.

export const ENDPOINTS = {
  AUTH: {
    LOGIN:            '/auth/login',
    DRIVER_LOGIN:     '/auth/driver/login',
    DRIVER_LOGIN_ALT: '/auth/driver/login/alt',
    REFRESH:          '/auth/refresh',
    FORGET_PASSWORD:  '/auth/forget_password',
  },

  CUSTOMERS: {
    GET_DETAILED: (sapSoldTo) => `/customers/detailed/${sapSoldTo}`,
  },

  NOTIFICATIONS: {
    GET_ALL: '/notification/all',
    CLEAR_ALL: '/notification/all/clear',
    GET_FILTERED: '/notification/all/filtered',
    MARK_ALL_READ: '/notification/all/mark-as-read',
    BROADCAST: '/notification/broadcast',
    BROADCAST_BASE64: '/notification/broadcast/base64',
    BROADCAST_MEDIA: '/notification/broadcast/media',
    CLEAR: '/notification/clear',
    MARK_AS_READ: '/notification/mark-as-read',
    PUSH_TOKEN: '/notification/push-token',
  },
};
