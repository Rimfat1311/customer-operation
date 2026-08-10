import React from 'react';
import { Bell } from 'lucide-react';
import NotificationItem from './NotificationItem';

/**
 * Bell icon button with dropdown panel containing notification list.
 * @param {boolean} isOpen - Whether dropdown is visible
 * @param {Function} onToggle - Toggle dropdown visibility
 * @param {Array} notifications - Array of notification objects
 * @param {number} unreadCount - Number of unread notifications
 * @param {Function} onMarkAllRead - Mark all read handler
 * @param {Function} onViewAll - Navigate to full notifications page
 */
export default function NotificationDropdown({ 
  isOpen, 
  onToggle, 
  notifications, 
  unreadCount, 
  onMarkAllRead, 
  onViewAll 
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="p-2 rounded-full text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all relative"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-danger text-[9px] text-white rounded-full flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-brand shadow-lg py-2 z-50 animate-slide-up">
          <div className="px-4 py-2 border-b border-slate-50 flex items-center justify-between">
            <span className="font-semibold text-slate-800 text-sm">Notifications</span>
            <button
              onClick={onMarkAllRead}
              className="text-xs text-brand-primary font-medium hover:underline focus:outline-none"
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.map((notif) => (
              <NotificationItem key={notif.id} notification={notif} compact />
            ))}
          </div>
          <div className="border-t border-slate-50 px-4 py-2 text-center">
            <button
              onClick={onViewAll}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
