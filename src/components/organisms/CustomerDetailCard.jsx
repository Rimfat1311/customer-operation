import React from 'react';
import { User, Mail, Phone, MapPin, Building, ShieldAlert, CheckCircle } from 'lucide-react';
import Badge from '../atoms/Badge';
import CustomerInfoRow from '../molecules/CustomerInfoRow';

/**
 * Full customer result card with header, badges, contact info, and financial details.
 * @param {object} customer - Customer data object
 */
export default function CustomerDetailCard({ customer }) {
  const isActive = customer.status.includes('Active');

  return (
    <div className="bg-white border border-slate-100 rounded-brand shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">{customer.name}</h3>
            <span className="text-xs text-slate-400 font-light">Sold-To Account: #{customer.id}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="primary">{customer.tier}</Badge>
          <Badge 
            variant={isActive ? 'success' : 'danger'}
            icon={isActive ? <CheckCircle className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
          >
            {customer.status}
          </Badge>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact Information</h4>
          <div className="space-y-3">
            <CustomerInfoRow icon={<User className="w-4 h-4" />}>
              <strong>Key Contact:</strong> {customer.contactPerson}
            </CustomerInfoRow>
            <CustomerInfoRow icon={<Mail className="w-4 h-4" />}>
              <a href={`mailto:${customer.email}`} className="text-brand-primary hover:underline">{customer.email}</a>
            </CustomerInfoRow>
            <CustomerInfoRow icon={<Phone className="w-4 h-4" />}>
              {customer.phone}
            </CustomerInfoRow>
            <CustomerInfoRow icon={<MapPin className="w-4 h-4" />}>
              {customer.address}
            </CustomerInfoRow>
          </div>
        </div>

        {/* Financial Status */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Financial Status</h4>
          <div className="bg-slate-50 rounded-brand p-4 space-y-3.5 border border-slate-100">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-slate-500 font-medium">Credit Limit:</span>
              <span className="font-semibold text-slate-800">{customer.creditLimit}</span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-slate-500 font-medium">Outstanding Balance:</span>
              <span className={`font-semibold ${customer.outstandingBalance !== '$0' ? 'text-rose-600' : 'text-slate-800'}`}>
                {customer.outstandingBalance}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center text-xs">
              <span className="text-slate-400">Payment Terms:</span>
              <span className="text-slate-600 font-medium">Net 30 Days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
