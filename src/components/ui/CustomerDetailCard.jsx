import React from 'react';
import { Phone, MapPin, Building, Globe, Hash, UserCheck, Briefcase, Mail } from 'lucide-react';
import Badge from './Badge';

/**
 * Customer detail card for live SAP Sold-To accounts.
 * @param {object} customer - Real SAP Customer payload from GET /customers/detailed/{sapSoldTo}
 */
export default function CustomerDetailCard({ customer }) {
  if (!customer) return null;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden animate-slide-up">
      {/* Card Header */}
      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">{customer.customerName || customer.name || '—'}</h3>
            <span className="text-xs text-slate-400 font-light">
              SAP Sold-To: #{customer.sapSoldTo || customer.id}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {customer.zone && (
            <Badge variant="primary">
              {customer.zone}
            </Badge>
          )}
          {customer.salesArea && (
            <Badge variant="slate">
              {customer.salesArea}
            </Badge>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact & Location */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact & Location</h4>
          <div className="space-y-3">
            {customer.phoneNumber && (
              <div className="flex items-start space-x-3 text-xs sm:text-sm text-slate-600">
                <Phone className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <span><strong>Phone:</strong> {customer.phoneNumber}</span>
              </div>
            )}
            {customer.email && (
              <div className="flex items-start space-x-3 text-xs sm:text-sm text-slate-600">
                <Mail className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <a href={`mailto:${customer.email}`} className="text-brand-primary hover:underline">{customer.email}</a>
              </div>
            )}
            {customer.address && (
              <div className="flex items-start space-x-3 text-xs sm:text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <span>{customer.address}</span>
              </div>
            )}
            {customer.geoState && (
              <div className="flex items-start space-x-3 text-xs sm:text-sm text-slate-600">
                <Globe className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <span><strong>State:</strong> {customer.geoState}</span>
              </div>
            )}
            {customer.zone && (
              <div className="flex items-start space-x-3 text-xs sm:text-sm text-slate-600">
                <Hash className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <span><strong>Zone:</strong> {customer.zone}</span>
              </div>
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
            {customer.hosName && (
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-slate-500 font-medium flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-400" /> HOS
                </span>
                <span className="font-semibold text-slate-800">{customer.hosName}</span>
              </div>
            )}
            {!customer.tsmName && !customer.zsmName && !customer.hosName && (
              <p className="text-xs text-slate-400 italic">No manager data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
