import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import Logo from './Logo';
import IconButton from './IconButton';
import NotificationDropdown from './NotificationDropdown';
import UserDropdown from './UserDropdown';

/**
 * Top navigation header bar.
 * @param {Function} onToggleSidebar - Toggle sidebar handler
 * @param {boolean} isNotifDropdownOpen - Notification dropdown state
 * @param {Function} onToggleNotifDropdown - Toggle notification dropdown
 * @param {boolean} isUserDropdownOpen - User dropdown state
 * @param {Function} onToggleUserDropdown - Toggle user dropdown
 * @param {Array} notifications - Notification data
 * @param {number} unreadNotifCount - Unread count
 * @param {Function} onMarkAllNotifRead - Mark all read handler
 * @param {Function} onViewAllNotifications - Navigate to notifications
 * @param {Function} onLogout - Logout handler
 * @param {Function} showToast - Toast function
 */
export default function TopNav({
  onToggleSidebar,
  isNotifDropdownOpen,
  onToggleNotifDropdown,
  isUserDropdownOpen,
  onToggleUserDropdown,
  notifications,
  unreadNotifCount,
  onMarkAllNotifRead,
  onViewAllNotifications,
  onLogout,
  showToast,
}) {
  return (
    <header className="sticky top-0 bg-white border-b border-slate-100 h-16 px-6 flex items-center justify-between z-40 shadow-sm">
      {/* Left section: Hamburger & Logo */}
      <div className="flex items-center space-x-4">
        <IconButton
          onClick={onToggleSidebar}
          icon={<Menu className="w-5 h-5" />}
          label="Toggle sidebar"
        />
        <Logo size="sm" textClass="text-slate-800" />
      </div>

      {/* Right section: Notifications, User profile & Logout */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <NotificationDropdown
          isOpen={isNotifDropdownOpen}
          onToggle={onToggleNotifDropdown}
          notifications={notifications}
          unreadCount={unreadNotifCount}
          onMarkAllRead={onMarkAllNotifRead}
          onViewAll={onViewAllNotifications}
        />

        <UserDropdown
          isOpen={isUserDropdownOpen}
          onToggle={onToggleUserDropdown}
          onLogout={onLogout}
          showToast={showToast}
        />

        {/* Quick Header Logout Button */}
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-brand-danger text-white text-xs sm:text-sm font-semibold rounded-brand hover:bg-red-600 transition-all flex items-center space-x-1.5 shadow-sm"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
