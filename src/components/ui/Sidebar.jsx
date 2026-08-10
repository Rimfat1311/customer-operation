import React from 'react';
import { 
  MessageSquare, CheckSquare, Search, Bell,
  Upload, UserCheck, HelpCircle, FileText 
} from 'lucide-react';
import NavItem from './NavItem';
import { useAuth } from '@/features/auth';

/**
 * Dynamic Sidebar with role-based navigation links.
 * Supervisors (CRM_SUPERVISOR / ADMIN) vs Agents.
 */
export default function Sidebar({ isSidebarOpen, unreadNotifCount }) {
  const { user } = useAuth();
  const isSupervisor = user?.role === 'CRM_SUPERVISOR' || user?.role === 'ADMIN';

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 ${
      isSidebarOpen ? 'w-64' : 'w-20'
    } bg-white border-r border-slate-100 flex flex-col justify-between transition-all duration-300 ease-in-out hidden sm:flex`}>
      
      {/* Header Logo */}
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

      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {/* ── Main Routes (Visible to Everyone) ── */}
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
            to="/dashboard/notifications"
            icon={<Bell className="w-5 h-5" />}
            label="Notifications"
            badgeCount={unreadNotifCount}
            isSidebarOpen={isSidebarOpen}
          />

          {/* ── CRM Supervisor / Admin Exclusive Items ── */}
          {isSupervisor && (
            <>
              <NavItem
                to="/dashboard/admin/upload-customers"
                icon={<Upload className="w-5 h-5" />}
                label="Upload Customers"
                isSidebarOpen={isSidebarOpen}
              />
              <NavItem
                to="/dashboard/admin/update-drivers"
                icon={<UserCheck className="w-5 h-5" />}
                label="Update Drivers"
                isSidebarOpen={isSidebarOpen}
              />
              <NavItem
                to="/dashboard/admin/set-questions"
                icon={<HelpCircle className="w-5 h-5" />}
                label="Set Questions"
                isSidebarOpen={isSidebarOpen}
              />
              <NavItem
                to="/dashboard/admin/manage-questions"
                icon={<FileText className="w-5 h-5" />}
                label="Manage Questions"
                isSidebarOpen={isSidebarOpen}
              />
            </>
          )}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
          Role: {isSupervisor ? 'Supervisor' : 'Agent'}
        </span>
        <span className="block text-xs sm:text-sm font-semibold text-slate-700 mt-1.5 truncate">
          {user?.profile ? `${user.profile.firstName} ${user.profile.lastName}` : user?.username || 'User'}
        </span>
      </div>
    </aside>
  );
}
