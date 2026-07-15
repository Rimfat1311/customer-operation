import React, { useState } from 'react';
import { Search, User, Mail, Phone, MapPin, Building, ShieldAlert, Loader2, CheckCircle } from 'lucide-react';

const MOCK_CUSTOMERS = {
  '470011': {
    id: '470011',
    name: 'Acme Corporation Ltd',
    contactPerson: 'Sarah Jenkins',
    email: 'sarah.j@acme.com',
    phone: '+1 (555) 234-5678',
    address: '100 Industrial Parkway, Sector 4, Metro City',
    tier: 'Platinum Partner',
    status: 'Active',
    creditLimit: '$500,000',
    outstandingBalance: '$12,450'
  },
  '123456': {
    id: '123456',
    name: 'Global Tech Solutions',
    contactPerson: 'David Chen',
    email: 'd.chen@globaltech.io',
    phone: '+1 (555) 876-5432',
    address: '88 Innovation Way, Suite 400, Tech Valley',
    tier: 'Gold Partner',
    status: 'Active',
    creditLimit: '$250,000',
    outstandingBalance: '$0'
  },
  '789012': {
    id: '789012',
    name: 'Summit Retailers',
    contactPerson: 'Emma Rodriguez',
    email: 'emma@summitretail.com',
    phone: '+1 (555) 345-6789',
    address: '452 Highland Blvd, Retail District, Denver',
    tier: 'Silver Partner',
    status: 'Suspended (Overdue Invoice)',
    creditLimit: '$100,000',
    outstandingBalance: '$98,750'
  }
};

export default function SearchCustomersPage() {
  const [soldToId, setSoldToId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [customer, setCustomer] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!soldToId.trim()) return;

    setIsLoading(true);
    setSearched(false);
    
    // Simulate API search call
    setTimeout(() => {
      const result = MOCK_CUSTOMERS[soldToId.trim()];
      setCustomer(result || null);
      setIsLoading(false);
      setSearched(true);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Search Customers</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Lookup customer account info using their 6-digit SAP Sold To ID.</p>
        </div>
      </div>

      {/* Search Input Card */}
      <div className="bg-white border border-slate-100 p-6 rounded-brand shadow-sm">
        <form onSubmit={handleSearch} className="space-y-4 max-w-xl">
          <div>
            <label htmlFor="soldToId" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
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
                  onChange={(e) => setSoldToId(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-brand text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-brand hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-70 disabled:hover:bg-brand-primary"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 font-light">
              Try searching "470011", "123456", or "789012" to see mock customer details.
            </p>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {searched && (
        <div className="animate-slide-up [animation-delay:50ms]">
          {customer ? (
            <div className="bg-white border border-slate-100 rounded-brand shadow-sm overflow-hidden">
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
                  <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider bg-blue-50 text-brand-primary">
                    {customer.tier}
                  </span>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center ${
                    customer.status.includes('Active') 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'bg-rose-50 text-rose-700'
                  }`}>
                    {customer.status.includes('Active') ? (
                      <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    ) : (
                      <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                    )}
                    {customer.status}
                  </span>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-xs sm:text-sm text-slate-600">
                      <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span><strong>Key Contact:</strong> {customer.contactPerson}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs sm:text-sm text-slate-600">
                      <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <a href={`mailto:${customer.email}`} className="text-brand-primary hover:underline">{customer.email}</a>
                    </div>
                    <div className="flex items-center space-x-3 text-xs sm:text-sm text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-start space-x-3 text-xs sm:text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>{customer.address}</span>
                    </div>
                  </div>
                </div>

                {/* Account Details */}
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
          ) : (
            <div className="bg-white border border-slate-100 p-8 rounded-brand shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">Account Not Found</h3>
              <p className="text-slate-400 text-xs sm:text-sm max-w-sm mt-1">
                No customer profile is registered under the SAP Sold To ID <strong>"{soldToId}"</strong>. Please verify the ID and try again.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
