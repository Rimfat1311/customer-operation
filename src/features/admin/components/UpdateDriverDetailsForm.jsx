import React, { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { adminService } from '../services/adminService';
import { useAuth } from '@/features/auth';
import Toast from '@/components/ui/Toast';

export default function UpdateDriverDetailsForm() {
  const { user } = useAuth();
  
  const [logonTripId, setLogonTripId] = useState('');
  const [driverSapId, setDriverSapId] = useState('');
  const [driverName, setDriverName] = useState('');
  const [reasonForUpdate, setReasonForUpdate] = useState('');
  
  // Read-only "UPDATED BY" field automatically derived from authenticated user
  const updatedByEmail = user?.username || user?.email || 'simontimnan@gmail.com';
  
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success', title) => {
    setToastMessage({ message, type, title });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    try {
      await adminService.updateShipmentDriverDetails({
        logon: logonTripId,
        driverSapId,
        driverName,
        reason: reasonForUpdate,
        updatedBy: updatedByEmail,
      });

      showToast(`Driver details for Logon #${logonTripId || 'N/A'} updated successfully.`, 'success', 'Update Complete');
      setLogonTripId('');
      setDriverSapId('');
      setDriverName('');
      setReasonForUpdate('');
    } catch (err) {
      showToast(err.message || 'Failed to save driver updates.', 'error', 'Save Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-slide-up max-w-2xl mx-auto">
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up px-4 w-full max-w-md pointer-events-none">
          <Toast
            message={toastMessage.message}
            type={toastMessage.type}
            title={toastMessage.title}
            onClose={() => setToastMessage(null)}
          />
        </div>
      )}

      {/* Hero Header Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-brand-primary via-brand-secondary to-indigo-500" />

      <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Update Driver Details (Trip)</h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Modify trip logon ID, driver SAP ID, driver name, and provide an update justification.
          </p>
        </div>

        <div className="space-y-5">
          {/* LOGON (Trip ID) */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              LOGON (Trip ID)
            </label>
            <input
              type="text"
              placeholder="e.g. 50012345"
              value={logonTripId}
              onChange={(e) => setLogonTripId(e.target.value)}
              required
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all"
            />
          </div>

          {/* DRIVER SAP ID */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              DRIVER SAP ID
            </label>
            <input
              type="text"
              placeholder="e.g. 1002345"
              value={driverSapId}
              onChange={(e) => setDriverSapId(e.target.value)}
              required
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all"
            />
          </div>

          {/* DRIVER NAME */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              DRIVER NAME
            </label>
            <input
              type="text"
              placeholder="Enter driver's full name"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              required
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all"
            />
          </div>

          {/* REASON FOR UPDATE */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              REASON FOR UPDATE
            </label>
            <textarea
              rows={4}
              placeholder="Explain why this update is necessary"
              value={reasonForUpdate}
              onChange={(e) => setReasonForUpdate(e.target.value)}
              required
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-light text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all resize-none leading-relaxed"
            />
          </div>

          {/* UPDATED BY (Non-editable read-only display box) */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              UPDATED BY
            </label>
            <div className="w-full px-4 py-3.5 bg-slate-100/80 border border-slate-200/80 rounded-xl text-sm font-medium text-slate-600 select-none cursor-not-allowed">
              {updatedByEmail}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving || !logonTripId.trim() || !driverSapId.trim() || !driverName.trim() || !reasonForUpdate.trim()}
            className="flex items-center gap-2 px-8 py-3.5 bg-brand-primary hover:bg-brand-primary-dark disabled:bg-slate-300 text-white font-bold text-sm rounded-xl transition-all shadow-sm active:scale-95 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Updates...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Update Driver Details</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
