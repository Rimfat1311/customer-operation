import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import SearchForm from '@/components/ui/SearchForm';
import CustomerDetailCard from '@/components/ui/CustomerDetailCard';
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
        <CustomerDetailCard customer={customer} />
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
