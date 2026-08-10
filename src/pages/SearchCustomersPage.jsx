import React, { useState } from 'react';
import {
  Phone, MapPin, Building, ShieldAlert, AlertTriangle,
  Hash, Globe, UserCheck, Briefcase
} from 'lucide-react';
import SearchForm from '@/components/ui/SearchForm';
import { customerService } from '@/features/customers';

export default function SearchCustomersPage() {
  const [soldToId, setSoldToId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmed = soldToId.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setSearched(false);
    setError('');
    setCustomer(null);

    try {
      const result = await customerService.getCustomerDetails(trimmed);
      console.log('Customer API response:', result);
      setCustomer(result || null);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
      setSearched(true);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Search Customers</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Lookup customer account info using their SAP Sold To ID.</p>
        </div>
      </div>

      {/* Search Input Card */}
      <SearchForm
        soldToId={soldToId}
        onSoldToIdChange={setSoldToId}
        isLoading={isLoading}
        onSubmit={handleSearch}
      />

      {/* Error State */}
      {searched && error && (
        <div className="animate-slide-up [animation-delay:50ms]">
          <div className="bg-white border border-rose-100 p-8 rounded-2xl shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Lookup Failed</h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success — Customer Details */}
      {searched && !error && customer && (
        <div className="animate-slide-up [animation-delay:50ms]">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            {/* Card Header */}
            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">{customer.customerName || '—'}</h3>
                  <span className="text-xs text-slate-400 font-light">SAP Sold-To: #{customer.sapSoldTo}</span>
                </div>
              </div>
              {customer.zone && (
                <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider bg-brand-primary-light text-brand-primary">
                  {customer.zone}
                </span>
              )}
            </div>

            {/* Card Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Contact & Location */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact & Location</h4>
                <div className="space-y-3">
                  {customer.phoneNumber && (
                    <InfoRow icon={<Phone className="w-4 h-4" />}>
                      <strong>Phone:</strong> {customer.phoneNumber}
                    </InfoRow>
                  )}
                  {customer.address && (
                    <InfoRow icon={<MapPin className="w-4 h-4" />}>
                      {customer.address}
                    </InfoRow>
                  )}
                  {customer.geoState && (
                    <InfoRow icon={<Globe className="w-4 h-4" />}>
                      <strong>State:</strong> {customer.geoState}
                    </InfoRow>
                  )}
                  {customer.zone && (
                    <InfoRow icon={<Hash className="w-4 h-4" />}>
                      <strong>Zone:</strong> {customer.zone}
                    </InfoRow>
                  )}
                </div>
              </div>

              {/* Account Managers */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Managers</h4>
                <div className="bg-slate-50 rounded-xl p-4 space-y-3.5 border border-slate-100">
                  {customer.tsmName && (
                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="text-slate-500 font-medium flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-slate-400" /> TSM
                      </span>
                      <span className="font-semibold text-slate-800">{customer.tsmName}</span>
                    </div>
                  )}
                  {customer.zsmName && (
                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="text-slate-500 font-medium flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-slate-400" /> ZSM
                      </span>
                      <span className="font-semibold text-slate-800">{customer.zsmName}</span>
                    </div>
                  )}
                  {!customer.tsmName && !customer.zsmName && (
                    <p className="text-xs text-slate-400 italic">No manager data available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Not Found */}
      {searched && !error && !customer && (
        <div className="animate-slide-up [animation-delay:50ms]">
          <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Account Not Found</h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm mt-1">
              No customer profile is registered under the SAP Sold To ID <strong>"{soldToId}"</strong>. Please verify the ID and try again.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Tiny helper for consistent info rows ── */
function InfoRow({ icon, children }) {
  return (
    <div className="flex items-start space-x-3 text-xs sm:text-sm text-slate-600">
      <span className="text-slate-400 mt-0.5 flex-shrink-0">{icon}</span>
      <span>{children}</span>
    </div>
  );
}
