import { apiClient } from '@/features/auth/services/authService';
import { ENDPOINTS } from '@/utils/endpoints';

export const adminService = {
  /**
   * Upload customer master data via Excel/CSV file
   * @param {File} file 
   * @param {Function} onUploadProgress 
   */
  async uploadCustomerExcel(file, onUploadProgress) {
    const formData = new FormData();
    formData.append('file', file);

    return await apiClient.post(ENDPOINTS.ADMIN.UPLOAD_CUSTOMERS, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
  },

  /**
   * Update driver account details (legacy)
   * @param {Object} driverData
   */
  async updateDriverDetails(driverData) {
    return await apiClient.post(ENDPOINTS.ADMIN.UPDATE_DRIVER, driverData);
  },

  /**
   * Update Driver SAP ID and Driver Name of a shipment using the logon identifier.
   *
   * PUT /shipment/driver-details
   *
   * @param {Object} params
   * @param {string}        params.logon      - Shipment logon identifier (e.g. "50012345").
   * @param {string|number} params.driverSapId - New driver SAP ID.
   * @param {string}        params.driverName  - New driver full name.
   * @param {string}        params.reason      - Justification for the update.
   * @param {string}        params.updatedBy   - Email of the admin performing the update.
   * @returns {Promise<object>} API response payload.
   * @throws {Error} Re-throws with a human-readable message on failure.
   */
  async updateShipmentDriverDetails({ logon, driverSapId, driverName, reason, updatedBy }) {
    try {
      return await apiClient.put(ENDPOINTS.SHIPMENT.UPDATE_DRIVER_DETAILS, {
        logon,
        driverSapId: Number(driverSapId),
        driverName,
        reason,
        updatedBy,
      });
    } catch (error) {
      const message =
        error?.message || 'Failed to update driver details. Please try again.';
      throw new Error(message);
    }
  },
};
