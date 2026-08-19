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
    UPLOAD_EXCEL:     '/customers/upload-excel',
    UPLOAD_DETAILED_EXCEL: '/customers/detailed/upload-excel',
  },

  ADMIN: {
    UPDATE_DRIVER:    '/admin/driver/update',
    UPLOAD_CUSTOMERS: '/admin/customers/upload',
  },

  SHIPMENT: {
    UPDATE_DRIVER_DETAILS: '/shipment/driver-details',
  },

  QUIZ: {
    CREATE_QUIZ:      '/v1/quizzes',
    GET_MY_QUIZZES:   '/v1/quizzes/mine',
    GET_ASSIGNED:     '/v1/quizzes/assigned',
    GET_QUIZ_BY_ID:   (id) => `/v1/quizzes/${id}`,
    UPDATE_QUIZ:      (id) => `/v1/quizzes/${id}`,
    DELETE_QUIZ:      (id) => `/v1/quizzes/${id}`,
    ASSIGN_QUIZ:      (id) => `/v1/quizzes/${id}/assignments`,
    REMOVE_ASSIGNMENT:(quizId, assignmentId) => `/v1/quizzes/${quizId}/assignments/${assignmentId}`,
    START_ATTEMPT:    (quizId) => `/v1/quizzes/${quizId}/attempts`,
    GET_ATTEMPT:      (quizId, attemptId) => `/v1/quizzes/${quizId}/attempts/${attemptId}`,
    SAVE_ANSWER:      (quizId, attemptId) => `/v1/quizzes/${quizId}/attempts/${attemptId}/answers`,
    SUBMIT_ATTEMPT:   (quizId, attemptId) => `/v1/quizzes/${quizId}/attempts/${attemptId}/submit`,
    MY_RESULTS:       (quizId) => `/v1/quizzes/${quizId}/my-results`,
    MY_ATTEMPTS:      (quizId) => `/v1/quizzes/${quizId}/my-attempts`,
    LEADERBOARD:      (quizId) => `/v1/quizzes/${quizId}/leaderboard`,
    PUBLISH_QUIZ:     (quizId) => `/v1/quizzes/${quizId}/publish`,
    ADD_QUESTION:     (quizId) => `/v1/quizzes/${quizId}/questions`,
    UPDATE_QUESTION:  (quizId, questionId) => `/v1/quizzes/${quizId}/questions/${questionId}`,
    DELETE_QUESTION:  (quizId, questionId) => `/v1/quizzes/${quizId}/questions/${questionId}`,
    GET_CREATOR_RESULTS: (quizId) => `/v1/quizzes/${quizId}/results`,
    REPORT_ATTEMPTS:  (quizId) => `/v1/quizzes/${quizId}/reports/attempts`,
    REPORT_SUMMARY:   (quizId) => `/v1/quizzes/${quizId}/reports/summary`,
    // Legacy fallbacks
    QUESTIONS:        '/quiz/questions',
    SUBMIT_QUIZ:      '/quiz/submit',
  },

  NOTIFICATIONS: {
    GET_ALL:          '/notification/all',
    CLEAR_ALL:        '/notification/all/clear',
    GET_FILTERED:     '/notification/all/filtered',
    MARK_ALL_READ:    '/notification/all/mark-as-read',
    BROADCAST:        '/notification/broadcast',
    BROADCAST_BASE64: '/notification/broadcast/base64',
    BROADCAST_MEDIA:  '/notification/broadcast/media',
    CLEAR:            '/notification/clear',
    MARK_AS_READ:     '/notification/mark-as-read',
    PUSH_TOKEN:       '/notification/push-token',
  },
};
