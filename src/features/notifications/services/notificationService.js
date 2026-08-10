import { apiClient } from "@/features/auth/services/authService";
import { ENDPOINTS } from "@/utils/endpoints";

export const notificationService = {
  /**
   * Get all notifications for the logged in user
   */
  async getAll() {
    return await apiClient.get(ENDPOINTS.NOTIFICATIONS.GET_ALL);
  },

  /**
   * Clear all notifications for the user
   */
  async clearAll() {
    return await apiClient.post(ENDPOINTS.NOTIFICATIONS.CLEAR_ALL);
  },

  /**
   * Get filtered notifications
   * @param {Object} filterOptions - { isRead: boolean|null, includeBroadcast: boolean, notificationTypes: array, mediaTypes: array }
   */
  async getFiltered(filterOptions = {}) {
    return await apiClient.post(ENDPOINTS.NOTIFICATIONS.GET_FILTERED, filterOptions);
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    return await apiClient.post(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  },

  /**
   * Create standard broadcast notification (multipart/form-data)
   * @param {Object} payloadData - Metadata and targeting details
   */
  async createBroadcast(payloadData) {
    const formData = new FormData();
    formData.append("payload", JSON.stringify(payloadData));
    
    return await apiClient.post(ENDPOINTS.NOTIFICATIONS.BROADCAST, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  /**
   * Create broadcast notification with Base64 media
   * @param {Object} payload - Includes metadata, targeting, and base64 encoded media string
   */
  async createBroadcastBase64(payload) {
    return await apiClient.post(ENDPOINTS.NOTIFICATIONS.BROADCAST_BASE64, payload);
  },

  /**
   * Create broadcast notification with uploaded media file
   * @param {Object} payloadData - Metadata and targeting details
   * @param {File} mediaFile - Media file (optional)
   * @param {Function} onUploadProgress - Progress tracking callback
   */
  async createBroadcastMedia(payloadData, mediaFile, onUploadProgress) {
    const formData = new FormData();
    formData.append("payload", JSON.stringify(payloadData));
    
    if (mediaFile) {
      formData.append("media", mediaFile);
    }

    return await apiClient.post(ENDPOINTS.NOTIFICATIONS.BROADCAST_MEDIA, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    });
  },

  /**
   * Clear a specific notification
   * @param {number} notificationId 
   * @param {boolean} isBroadcast 
   */
  async clear(notificationId, isBroadcast = false) {
    return await apiClient.post(ENDPOINTS.NOTIFICATIONS.CLEAR, null, {
      params: { notificationId, isBroadcast }
    });
  },

  /**
   * Mark a specific notification as read
   * @param {number} notificationId 
   * @param {boolean} isBroadcast 
   */
  async markAsRead(notificationId, isBroadcast = false) {
    return await apiClient.post(ENDPOINTS.NOTIFICATIONS.MARK_AS_READ, null, {
      params: { notificationId, isBroadcast }
    });
  },

  /**
   * Update push token of a user
   * @param {Object} payload - { userId, pushToken, type, ios }
   */
  async updatePushToken(payload) {
    return await apiClient.post(ENDPOINTS.NOTIFICATIONS.PUSH_TOKEN, payload);
  }
};
