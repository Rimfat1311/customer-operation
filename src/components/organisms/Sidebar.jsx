import React from 'react';
import { MessageSquare, CheckSquare, Search, Bell, Megaphone } from 'lucide-react';
import NavItem from '../molecules/NavItem';

/**
 * Left sidebar with navigation items and footer.
 * @param {boolean} isSidebarOpen - Whether sidebar is expanded
 * @param {number} unreadNotifCount - Notification badge count
 */
export default function Sidebar({ isSidebarOpen, unreadNotifCount }) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 ${
      isSidebarOpen ? 'w-64' : 'w-20'
    } bg-white border-r border-slate-100 flex flex-col justify-between transition-all duration-300 ease-in-out hidden sm:flex`}>
      
      {/* Logo Section */}
      <div className={`h-16 border-b border-slate-100 flex items-center ${isSidebarOpen ? 'px-6' : 'justify-center'} transition-all duration-300 flex-shrink-0`}>
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-brand bg-brand-primary flex items-center justify-center shadow-inner flex-shrink-0">
            <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 16L13 21L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {isSidebarOpen && (
            <span className="font-bold text-base text-slate-800 tracking-tight whitespace-nowrap">
              LAP Contact Center
            </span>
          )}
        </div>
      </div>

      <nav className="p-4 space-y-2 flex-1">
        <ul className="space-y-1">
          <NavItem
            to="/dashboard/take-questions"
            icon={<MessageSquare className="w-5 h-5" />}
            label="Take Questions"
            isSidebarOpen={isSidebarOpen}
          />
          <NavItem
            to="/dashboard/quiz-results"
            icon={<CheckSquare className="w-5 h-5" />}
            label="My Quiz Results"
            isSidebarOpen={isSidebarOpen}
          />
          <NavItem
            to="/dashboard/search-customers"
            icon={<Search className="w-5 h-5" />}
            label="Search Customers"
            isSidebarOpen={isSidebarOpen}
          />
          <NavItem
            to="/dashboard/compose-notification"
            icon={<Megaphone className="w-5 h-5" />}
            label="Compose Notif"
            isSidebarOpen={isSidebarOpen}
          />
          <NavItem
            to="/dashboard/notifications"
            icon={<Bell className="w-5 h-5" />}
            label="Notifications"
            badgeCount={unreadNotifCount}
            isSidebarOpen={isSidebarOpen}
          />
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Logged In As</span>
        <span className="block text-xs sm:text-sm font-semibold text-slate-700 mt-1.5 truncate">Timnan Simon</span>
      </div>
    </aside>
  );
}
