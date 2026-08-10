// ─── Customer Service ──────────────────────────────────────────────────────
// Thin service layer for customer-related API calls.
// Re-uses the shared apiClient (with auth interceptors already attached).

import { apiClient } from '@/features/auth/services/authService';
import { ENDPOINTS } from '@/utils/endpoints';

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

  /**
   * Upload an Excel file (.xlsx or .xls) for partial detailed customer upsert.
   *
   * Required column: sapSoldTo
   * Optional columns: salesArea, customerName, email, phoneNumber, address,
   *   location, stateCode, geoState, geoRegion, accountType, isKeyAccount,
   *   commercialRegion, commercialState, zone, territory, segment, cpTp,
   *   tsmName, zsmName, hosName, propRegion, propZoneTerritory,
   *   sapSoldToSecondary.
   *
   * @param {File}     file              - The .xlsx / .xls file to upload.
   * @param {Function} [onUploadProgress] - Axios progress callback.
   * @returns {Promise<object>} Result with totalRows, createdCount, updatedCount,
   *                            skippedCount, and errors[].
   * @throws {Error} Re-throws with a human-readable message on failure.
   */
  async uploadDetailedCustomerExcel(file, onUploadProgress) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      return await apiClient.post(
        ENDPOINTS.CUSTOMERS.UPLOAD_DETAILED_EXCEL,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress,
        },
      );
    } catch (error) {
      const message =
        error?.message || 'Failed to upload detailed customer Excel. Please try again.';
      throw new Error(message);
    }
  },
};
