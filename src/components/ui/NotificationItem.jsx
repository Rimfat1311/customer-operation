import React from 'react';
import Avatar from './Avatar';
import UnreadDot from './UnreadDot';

/**
 * Notification row used in both the header dropdown and full notifications page.
 * Dropdown mode: compact (user initial + detail + time).
 * Page mode: full (icon + title + message + time + delete).
 *
 * @param {object} notification - Notification data object
 * @param {boolean} compact - Use compact dropdown layout (default: false)
 * @param {Function} onClick - Click handler
 * @param {React.ReactNode} actions - Optional trailing action buttons
 * @param {React.ReactNode} icon - Optional leading icon (page mode)
 */
export default function NotificationItem({ notification, compact = false, onClick, actions, icon }) {
  const { read, user, detail, title, message, time } = notification;

  if (compact) {
    // Dashboard dropdown variant
    return (
      <div
        onClick={onClick}
        className={`px-4 py-3 flex items-start space-x-3 hover:bg-slate-50 transition-colors cursor-pointer ${!read ? 'bg-brand-primary-light/20' : ''}`}
      >
        <UnreadDot visible={!read} className="mt-2" />
        <Avatar initials={user?.[0] || '?'} size="md" bgClass="bg-slate-100" textClass="text-slate-600" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-700 leading-snug">
            <strong>{user}</strong> {detail}
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5 block">{time}</span>
        </div>
      </div>
    );
  }

  // Full page variant
  const bgMap = {
    success: 'bg-emerald-50',
    assign: 'bg-brand-primary-light',
    warning: 'bg-amber-50',
    grade: 'bg-indigo-50',
    system: 'bg-slate-50',
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 sm:p-5 flex items-start gap-4 transition-all hover:bg-slate-50/50 cursor-pointer ${
        !read ? 'bg-brand-primary-light/10 border-l-4 border-brand-primary pl-3 sm:pl-4' : 'pl-4 sm:pl-5'
      }`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${bgMap[notification.type] || 'bg-slate-50'}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-1">
          <h4 className={`text-xs sm:text-sm text-slate-800 ${!read ? 'font-bold' : 'font-semibold'}`}>
            {title}
          </h4>
          <span className="text-[10px] text-slate-400 font-light flex-shrink-0">{time}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">{message}</p>
        <div className="flex gap-4 mt-2">
          <span className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 font-light">
            <span className={`w-1.5 h-1.5 rounded-full ${read ? 'bg-slate-300' : 'bg-brand-primary'}`} />
            {read ? 'Marked as read' : 'Mark as read'}
          </span>
        </div>
      </div>
      {actions}
    </div>
  );
}
