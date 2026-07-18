import React from 'react';
import { Search } from 'lucide-react';
import LoadingButton from '../atoms/LoadingButton';

/**
 * SAP Sold-To ID search input card.
 * @param {string} soldToId - Current input value
 * @param {Function} onSoldToIdChange - Input change handler
 * @param {boolean} isLoading - Loading state
 * @param {Function} onSubmit - Form submit handler
 */
export default function SearchForm({ soldToId, onSoldToIdChange, isLoading, onSubmit }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Card Hero Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-brand-primary via-brand-secondary to-indigo-500" />
      
      <form onSubmit={onSubmit} className="p-6 sm:p-8 space-y-4">
        <div>
          <label htmlFor="soldToId" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            SAP Sold To ID (6 Digits)
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="soldToId"
                type="text"
                pattern="\d{6}"
                maxLength={6}
                placeholder="e.g. 470011"
                value={soldToId}
                onChange={(e) => onSoldToIdChange(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all"
                required
              />
            </div>
            <LoadingButton
              type="submit"
              isLoading={isLoading}
              loadingText="Searching..."
              icon={<Search className="w-4 h-4" />}
              className="rounded-xl shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 font-bold px-8 py-3.5"
            >
              Search
            </LoadingButton>
          </div>
          <p className="text-[10px] text-slate-400 mt-2.5 font-light">
            Try searching "470011", "123456", or "789012" to see mock customer details.
          </p>
        </div>
      </form>
    </div>
  );
}
