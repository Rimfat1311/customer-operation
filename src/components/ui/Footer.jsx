import React from 'react';

/**
 * Dashboard footer with copyright and links.
 * @param {Function} showToast - Toast notification function
 */
export default function Footer({ showToast }) {
  return (
    <footer className="bg-white border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-center space-y-2.5 sm:space-y-0 text-xs text-slate-400 flex-shrink-0 z-35">
      <p>&copy; 2026 HBM Contact Center. All rights reserved.</p>
      <div className="flex space-x-4">
        <button onClick={() => showToast('Privacy Policy')} className="hover:text-slate-600 transition-colors">Privacy Policy</button>
        <button onClick={() => showToast('Terms of Service')} className="hover:text-slate-600 transition-colors">Terms of Service</button>
        <button onClick={() => showToast('Support Desk')} className="hover:text-slate-600 transition-colors">Support Desk</button>
      </div>
    </footer>
  );
}
