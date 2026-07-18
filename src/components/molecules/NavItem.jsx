import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * Sidebar navigation link item with icon, label, optional badge, and active state.
 * @param {string} to - Route path
 * @param {React.ReactNode} icon - Leading icon element
 * @param {string} label - Nav item label text
 * @param {number} badgeCount - Optional unread/count badge (0 = hidden)
 * @param {boolean} isSidebarOpen - Whether sidebar is expanded
 */
export default function NavItem({ to, icon, label, badgeCount = 0, isSidebarOpen = true }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center ${badgeCount > 0 ? 'justify-between' : 'space-x-3'} px-3 py-2.5 rounded-brand transition-all ${
            badgeCount > 0 ? 'group' : ''
          } ${
            isActive
              ? 'bg-brand-primary-light text-brand-primary font-semibold shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium'
          }`
        }
      >
        {badgeCount > 0 ? (
          <>
            <div className="flex items-center space-x-3 min-w-0">
              <span className="w-5 h-5 flex-shrink-0">{icon}</span>
              {isSidebarOpen && <span className="truncate">{label}</span>}
            </div>
            {isSidebarOpen && (
              <span className="bg-brand-primary-light text-brand-primary text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                {badgeCount}
              </span>
            )}
          </>
        ) : (
          <>
            <span className="w-5 h-5 flex-shrink-0">{icon}</span>
            {isSidebarOpen && <span>{label}</span>}
          </>
        )}
      </NavLink>
    </li>
  );
}
