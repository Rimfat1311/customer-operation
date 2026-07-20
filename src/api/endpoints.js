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
};
