import React from 'react';
import { ChevronDown, User, Settings, LogOut } from 'lucide-react';
import Avatar from './Avatar';

/**
 * User profile dropdown menu with avatar button.
 * @param {boolean} isOpen - Whether dropdown is visible
 * @param {Function} onToggle - Toggle dropdown
 * @param {Function} onLogout - Logout handler
 * @param {Function} showToast - Toast notification function
 */
import { useAuth } from '@/features/auth';

/**
 * User profile dropdown menu with avatar button.
 * @param {boolean} isOpen - Whether dropdown is visible
 * @param {Function} onToggle - Toggle dropdown
 * @param {Function} onLogout - Logout handler
 * @param {Function} showToast - Toast notification function
 */
export default function UserDropdown({ isOpen, onToggle, onLogout, showToast }) {
  const { user } = useAuth();
  const userRole = String(user?.role || user?.profile?.role || '').trim().toUpperCase();
  const isSupervisor = userRole === 'CRM_SUPERVISOR' || userRole === 'ADMIN';
  const roleName = isSupervisor ? 'Supervisor' : 'Customer Center';
  const firstName = user?.profile?.firstName || 'User';
  const fullName = user?.profile ? `${user.profile.firstName} ${user.profile.lastName}` : user?.username || 'User';
  const initials = firstName.charAt(0).toUpperCase();
  const email = user?.username || 'user@example.com';

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 p-1 rounded-full sm:hover:bg-slate-50 transition-colors focus:outline-none"
      >
        <Avatar initials={initials} size="md" bgClass="bg-brand-primary" className="shadow-sm" />
        <div className="hidden md:block text-left pr-1">
          <span className="block text-xs font-semibold text-slate-800">{firstName}</span>
          <span className="block text-[10px] text-slate-400">{roleName}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-brand shadow-lg py-2 z-50 animate-slide-up">
          <div className="px-4 py-2 border-b border-slate-100 flex items-center space-x-3">
            <Avatar initials={initials} size="lg" bgClass="bg-brand-primary" />
            <div>
              <span className="block text-sm font-bold text-slate-800 leading-tight">{fullName}</span>
              <span className="block text-xs text-slate-400">{email}</span>
            </div>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                onToggle();
                showToast('Profile settings coming soon');
              }}
              className="w-full flex items-center space-x-2.5 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-800 text-xs sm:text-sm text-left"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>My Profile</span>
            </button>
            <button
              onClick={() => {
                onToggle();
                showToast('Portal configuration settings coming soon');
              }}
              className="w-full flex items-center space-x-2.5 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-800 text-xs sm:text-sm text-left"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Portal Settings</span>
            </button>
          </div>

          <div className="border-t border-slate-100 py-1">
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-2.5 px-4 py-2 text-brand-danger hover:bg-red-50 text-xs sm:text-sm text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
