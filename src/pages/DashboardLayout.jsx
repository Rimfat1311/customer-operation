import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { 
  Search, Bell, ChevronDown, MessageSquare, CheckSquare, 
  Settings, LogOut, Menu, User, Upload, UserCheck, HelpCircle, FileText, Megaphone
} from 'lucide-react';
import { useAuth } from '@/features/auth';

export default function DashboardLayout() {
  const navigate = useNavigate();
  
  // Responsive / Toggle States
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  
  // Toast notifications list
  const [toasts, setToasts] = useState([]);
  
  // Notifications State (rebranded to LAP Contact Center context)
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', user: 'System', detail: 'synchronized SAP account records', time: '5 min ago', read: false },
    { id: 2, type: 'assign', user: 'Jordan', detail: 'assigned inquiry #Q-9812 to you', time: '12 min ago', read: false },
    { id: 3, type: 'warning', user: 'System', detail: 'GDPR Compliance Certificate renewal in 15 days', time: '2 hr ago', read: false },
    { id: 4, type: 'grade', user: 'System', detail: 'SAP Sold-To ID Hierarchy quiz graded: 84% (Passed)', time: '1 day ago', read: true }
  ]);

  // Load user data from the live authenticated session
  const { user: rawUser, logout: contextLogout } = useAuth();
  const isSupervisor = rawUser?.role === 'CRM_SUPERVISOR' || rawUser?.role === 'ADMIN';

  const currentUser = {
    name: rawUser?.profile ? `${rawUser.profile.firstName} ${rawUser.profile.lastName}` : 'Unknown User',
    email: rawUser?.username || 'user@example.com',
    role: isSupervisor ? 'Supervisor' : 'Agent',
    firstName: rawUser?.profile ? rawUser.profile.firstName : 'User',
  };
  const userInitials = currentUser.name !== 'Unknown User' ? currentUser.name.charAt(0).toUpperCase() : 'U';

  // Keyboard shortcut (Ctrl + K or Cmd + K) listener for search focus (if needed in page)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('globalSearch')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Add toast alert
  const showToast = (message, type = 'info') => {
    const newToast = { id: Date.now(), message, type };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 3000);
  };

  // Mark all notifications as read
  const markAllNotifRead = (e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'success');
  };

  // Count unread notifications
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    contextLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-brand-bg flex font-sans relative">
      
      {/* Toast Notifications Box */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className="pointer-events-auto bg-slate-900 text-white text-sm px-4 py-2.5 rounded-full shadow-lg flex items-center space-x-2.5 animate-slide-up"
          >
            <span className={`w-2 h-2 rounded-full ${
              toast.type === 'success' ? 'bg-brand-success' : 
              toast.type === 'error' ? 'bg-brand-danger' : 'bg-brand-primary'
            }`} />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* LEFT SIDEBAR (Fixed) */}
      <aside className={`fixed inset-y-0 left-0 z-50 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      } bg-white border-r border-slate-100 flex flex-col justify-between transition-all duration-300 ease-in-out hidden sm:flex`}>
        
        {/* Logo at the top of the sidebar */}
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
            {isSupervisor ? (
              <>
                <li>
                  <NavLink 
                    to="/dashboard/admin/upload-customers" 
                    className={({ isActive }) => 
                      `flex items-center space-x-3 px-3 py-2.5 rounded-brand transition-all ${
                        isActive 
                          ? 'bg-brand-primary-light text-brand-primary font-semibold shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium'
                      }`
                    }
                  >
                    <Upload className="w-5 h-5 flex-shrink-0" />
                    {isSidebarOpen && <span>Upload Customers</span>}
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/dashboard/admin/update-drivers" 
                    className={({ isActive }) => 
                      `flex items-center space-x-3 px-3 py-2.5 rounded-brand transition-all ${
                        isActive 
                          ? 'bg-brand-primary-light text-brand-primary font-semibold shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium'
                      }`
                    }
                  >
                    <UserCheck className="w-5 h-5 flex-shrink-0" />
                    {isSidebarOpen && <span>Update Drivers</span>}
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/dashboard/admin/set-questions" 
                    className={({ isActive }) => 
                      `flex items-center space-x-3 px-3 py-2.5 rounded-brand transition-all ${
                        isActive 
                          ? 'bg-brand-primary-light text-brand-primary font-semibold shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium'
                      }`
                    }
                  >
                    <HelpCircle className="w-5 h-5 flex-shrink-0" />
                    {isSidebarOpen && <span>Set Questions</span>}
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/dashboard/admin/manage-questions" 
                    className={({ isActive }) => 
                      `flex items-center space-x-3 px-3 py-2.5 rounded-brand transition-all ${
                        isActive 
                          ? 'bg-brand-primary-light text-brand-primary font-semibold shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium'
                      }`
                    }
                  >
                    <FileText className="w-5 h-5 flex-shrink-0" />
                    {isSidebarOpen && <span>Manage Questions</span>}
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/dashboard/quiz-results" 
                    className={({ isActive }) => 
                      `flex items-center space-x-3 px-3 py-2.5 rounded-brand transition-all ${
                        isActive 
                          ? 'bg-brand-primary-light text-brand-primary font-semibold shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium'
                      }`
                    }
                  >
                    <CheckSquare className="w-5 h-5 flex-shrink-0" />
                    {isSidebarOpen && <span>My Quiz Results</span>}
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/dashboard/search-customers" 
                    className={({ isActive }) => 
                      `flex items-center space-x-3 px-3 py-2.5 rounded-brand transition-all ${
                        isActive 
                          ? 'bg-brand-primary-light text-brand-primary font-semibold shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium'
                      }`
                    }
                  >
                    <Search className="w-5 h-5 flex-shrink-0" />
                    {isSidebarOpen && <span>Search Customers</span>}
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/dashboard/compose-notification" 
                    className={({ isActive }) => 
                      `flex items-center space-x-3 px-3 py-2.5 rounded-brand transition-all ${
                        isActive 
                          ? 'bg-brand-primary-light text-brand-primary font-semibold shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium'
                      }`
                    }
                  >
                    <Megaphone className="w-5 h-5 flex-shrink-0" />
                    {isSidebarOpen && <span>Compose Notif</span>}
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink 
                    to="/dashboard/take-questions" 
                    className={({ isActive }) => 
                      `flex items-center space-x-3 px-3 py-2.5 rounded-brand transition-all ${
                        isActive 
                          ? 'bg-brand-primary-light text-brand-primary font-semibold shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium'
                      }`
                    }
                  >
                    <MessageSquare className="w-5 h-5 flex-shrink-0" />
                    {isSidebarOpen && <span>Take Questions</span>}
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/dashboard/quiz-results" 
                    className={({ isActive }) => 
                      `flex items-center space-x-3 px-3 py-2.5 rounded-brand transition-all ${
                        isActive 
                          ? 'bg-brand-primary-light text-brand-primary font-semibold shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium'
                      }`
                    }
                  >
                    <CheckSquare className="w-5 h-5 flex-shrink-0" />
                    {isSidebarOpen && <span>My Quiz Results</span>}
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/dashboard/search-customers" 
                    className={({ isActive }) => 
                      `flex items-center space-x-3 px-3 py-2.5 rounded-brand transition-all ${
                        isActive 
                          ? 'bg-brand-primary-light text-brand-primary font-semibold shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium'
                      }`
                    }
                  >
                    <Search className="w-5 h-5 flex-shrink-0" />
                    {isSidebarOpen && <span>Search Customers</span>}
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/dashboard/compose-notification" 
                    className={({ isActive }) => 
                      `flex items-center space-x-3 px-3 py-2.5 rounded-brand transition-all ${
                        isActive 
                          ? 'bg-brand-primary-light text-brand-primary font-semibold shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium'
                      }`
                    }
                  >
                    <Megaphone className="w-5 h-5 flex-shrink-0" />
                    {isSidebarOpen && <span>Compose Notif</span>}
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Sidebar Footer matching screenshot */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
            Logged In As ({currentUser.role})
          </span>
          <span className="block text-xs sm:text-sm font-semibold text-slate-700 mt-1.5 truncate">{currentUser.name}</span>
        </div>

      </aside>

      {/* RIGHT SIDE WRAPPER */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isSidebarOpen ? 'sm:pl-64' : 'sm:pl-20'}`}>
        
        {/* TOP NAVIGATION */}
        <header className={`fixed top-0 right-0 z-40 h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between shadow-sm transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'sm:left-64 left-0' : 'sm:left-20 left-0'
        }`}>
          
          {/* Left section: Hamburger only */}
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Right section: Notifications, User profile & Logout */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Notifications Bell Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsNotifDropdownOpen(!isNotifDropdownOpen);
                  setIsUserDropdownOpen(false);
                }}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-danger text-[9px] text-white rounded-full flex items-center justify-center font-bold">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {isNotifDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-brand shadow-lg py-2 z-50 animate-slide-up">
                  <div className="px-4 py-2 border-b border-slate-50 flex items-center justify-between">
                    <span className="font-semibold text-slate-800 text-sm">Notifications</span>
                    <button 
                      onClick={markAllNotifRead}
                      className="text-xs text-brand-primary font-medium hover:underline focus:outline-none"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        className={`px-4 py-3 flex items-start space-x-3 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-brand-primary-light/20' : ''}`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${!notif.read ? 'bg-brand-primary' : 'bg-transparent'}`} />
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-xs text-slate-600 flex-shrink-0">
                          {notif.user[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-700 leading-snug">
                            <strong>{notif.user}</strong> {notif.detail}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">{notif.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-slate-50 px-4 py-2 text-center">
                    <button 
                      onClick={() => {
                        setIsNotifDropdownOpen(false);
                        navigate('/dashboard/compose-notification');
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsUserDropdownOpen(!isUserDropdownOpen);
                  setIsNotifDropdownOpen(false);
                }}
                className="flex items-center space-x-2 p-1 rounded-full sm:hover:bg-slate-50 transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {userInitials}
                </div>
                <div className="hidden md:block text-left pr-1">
                  <span className="block text-xs font-semibold text-slate-800">{currentUser.firstName}</span>
                  <span className="block text-[10px] text-slate-400">{currentUser.role}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-brand shadow-lg py-2 z-50 animate-slide-up">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                      {userInitials}
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-slate-800 leading-tight">{currentUser.name}</span>
                      <span className="block text-xs text-slate-400">{currentUser.email}</span>
                    </div>
                  </div>
                  
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        showToast('Profile settings coming soon');
                      }}
                      className="w-full flex items-center space-x-2.5 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-800 text-xs sm:text-sm text-left"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Profile</span>
                    </button>
                    <button 
                      onClick={() => {
                        setIsUserDropdownOpen(false);
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
                      onClick={handleLogout} 
                      className="w-full flex items-center space-x-2.5 px-4 py-2 text-brand-danger hover:bg-red-50 text-xs sm:text-sm text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Header Logout Button matching screenshot */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-brand-danger text-white text-xs sm:text-sm font-semibold rounded-brand hover:bg-red-600 transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

          </div>
        </header>

        {/* MAIN BODY LAYOUT & FOOTER */}
        <div className="flex-1 flex flex-col pt-16 overflow-y-auto">
          <main className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full flex-1">
            <Outlet />
          </main>
          
          {/* FOOTER */}
          <footer className="bg-white border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-center space-y-2.5 sm:space-y-0 text-xs text-slate-400 flex-shrink-0 z-35">
            <p>&copy; 2026 LAP Contact Center. All rights reserved.</p>
            <div className="flex space-x-4">
              <button onClick={() => showToast('Privacy Policy')} className="hover:text-slate-600 transition-colors">Privacy Policy</button>
              <button onClick={() => showToast('Terms of Service')} className="hover:text-slate-600 transition-colors">Terms of Service</button>
              <button onClick={() => showToast('Support Desk')} className="hover:text-slate-600 transition-colors">Support Desk</button>
            </div>
          </footer>
        </div>

      </div>

    </div>
  );
}
