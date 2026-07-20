// ─── Customer Service ──────────────────────────────────────────────────────
// Thin service layer for customer-related API calls.
// Re-uses the shared apiClient (with auth interceptors already attached).

import { apiClient } from './authService';
import { ENDPOINTS } from '../api/endpoints';

export const customerService = {
  /**
   * Fetch detailed customer profile by SAP Sold-To ID.
   *
   * @param {string|number} sapSoldTo - The 6-digit SAP Sold-To account ID.
   * @returns {Promise<object>} The unwrapped customer payload.
   * @throws {Error} Re-throws with a human-readable message on failure.
   */
  async getCustomerDetails(sapSoldTo) {
    try {
      // apiClient's response interceptor already unwraps `response.data.result`
      return await apiClient.get(ENDPOINTS.CUSTOMERS.GET_DETAILED(sapSoldTo));
    } catch (error) {
      // Re-throw with a clean, caller-friendly message
      const message =
        error?.message || 'Failed to fetch customer details. Please try again.';
      throw new Error(message);
    }
  },
};
