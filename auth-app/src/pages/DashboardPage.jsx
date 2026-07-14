import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Bell, ChevronDown, LayoutDashboard, FolderKanban, CheckSquare, 
  MessageSquare, Settings, LogOut, Menu, User, Calendar, Plus, 
  UserPlus, Upload, FileText, Check, TrendingUp, X, Sparkles 
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  
  // Responsive / Toggle States
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  
  // Toast notifications list
  const [toasts, setToasts] = useState([]);
  
  // Date and Time states
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Tasks List
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Review login UI design', tag: 'Design', due: 'Due today', completed: true },
    { id: 2, name: 'Update API documentation', tag: 'Dev', due: 'Overdue', completed: true },
    { id: 3, name: 'Write unit tests for auth module', tag: 'Dev', due: 'Tomorrow', completed: false },
    { id: 4, name: 'Present dashboard to stakeholders', tag: 'Meeting', due: 'Jul 18', completed: false },
    { id: 5, name: 'Onboard new team members', tag: 'HR', due: 'Jul 20', completed: false },
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'complete', user: 'Maya', detail: 'completed "Homepage Redesign"', time: '2 min ago', read: false },
    { id: 2, type: 'mention', user: 'Sam', detail: 'mentioned you in a comment', time: '15 min ago', read: false },
    { id: 3, type: 'assign', user: 'Jordan', detail: 'assigned a task to you', time: '1 hr ago', read: false },
    { id: 4, type: 'due', user: 'System', detail: 'Project "Revamp UI" is due tomorrow', time: '3 hr ago', read: true }
  ]);

  // Keyboard shortcut (Ctrl + K or Cmd + K) listener for search focus
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

  // Update Dynamic Clock
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Formatting time: e.g. 10:45 AM
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      
      // Formatting date: e.g. Tuesday, Jul 14
      setCurrentDate(now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
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

  // Toggle single task completed state
  const toggleTask = (id) => {
    setTasks((prev) => 
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.completed;
          showToast(`Task "${t.name}" marked as ${nextState ? 'completed' : 'incomplete'}`, nextState ? 'success' : 'info');
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  // Count unread notifications
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  // Calculate task progress percentage
  const totalTasks = tasks.length;
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const taskProgressPct = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  // Filter tasks based on search
  const filteredTasks = tasks.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans relative">
      
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

      {/* TOP NAVIGATION */}
      <header className="sticky top-0 bg-white border-b border-slate-100 h-16 px-6 flex items-center justify-between z-40 shadow-sm">
        
        {/* Left section: Hamburger & Logo */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-brand bg-brand-primary flex items-center justify-center shadow-inner">
              <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 16L13 21L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-bold text-lg text-slate-800 tracking-tight">AuthFlow</span>
          </div>
        </div>

        {/* Center section: Search Bar */}
        <div className="hidden sm:block w-96 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="globalSearch"
            type="search"
            placeholder="Search projects, tasks, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-12 py-2 bg-slate-50 border border-slate-200 rounded-brand text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-200"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded pointer-events-none">
            ⌘K
          </kbd>
        </div>

        {/* Right section: Notifications & User profile */}
        <div className="flex items-center space-x-3.5">
          
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
                      className={`px-4 py-3 flex items-start space-x-3 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-blue-50/20' : ''}`}
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
                  <a href="#" onClick={(e) => { e.preventDefault(); showToast('Viewing all notifications'); }} className="text-xs text-slate-500 hover:text-slate-800 font-medium">
                    View all notifications
                  </a>
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
                T
              </div>
              <div className="hidden md:block text-left pr-1">
                <span className="block text-xs font-semibold text-slate-800">Timnan</span>
                <span className="block text-[10px] text-slate-400">Administrator</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
            </button>

            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-brand shadow-lg py-2 z-50 animate-slide-up">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                    T
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-800 leading-tight">Timnan</span>
                    <span className="block text-xs text-slate-400">timnan@authflow.io</span>
                  </div>
                </div>
                
                <div className="py-1">
                  <a href="#" onClick={(e) => { e.preventDefault(); showToast('Profile loaded'); }} className="flex items-center space-x-2.5 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-800 text-xs sm:text-sm">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My Profile</span>
                  </a>
                  <a href="#" onClick={(e) => { e.preventDefault(); showToast('Settings loaded'); }} className="flex items-center space-x-2.5 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-800 text-xs sm:text-sm">
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Settings</span>
                  </a>
                </div>

                <div className="border-t border-slate-100 py-1">
                  <button 
                    onClick={() => navigate('/')} 
                    className="w-full flex items-center space-x-2.5 px-4 py-2 text-brand-danger hover:bg-red-50 text-xs sm:text-sm text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR */}
        <aside className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-slate-100 flex-shrink-0 flex flex-col justify-between transition-all duration-300 ease-in-out hidden sm:flex`}>
          
          <nav className="p-4 space-y-2 flex-1">
            <ul className="space-y-1">
              <li>
                <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-brand bg-blue-50 text-brand-primary text-sm font-semibold transition-all">
                  <LayoutDashboard className="w-5 h-5" />
                  {isSidebarOpen && <span>Dashboard</span>}
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); showToast('Projects list loaded'); }} className="flex items-center justify-between px-3 py-2.5 rounded-brand text-slate-600 hover:bg-slate-50 hover:text-slate-800 text-sm font-medium transition-all group">
                  <div className="flex items-center space-x-3">
                    <FolderKanban className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                    {isSidebarOpen && <span>Projects</span>}
                  </div>
                  {isSidebarOpen && (
                    <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">12</span>
                  )}
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); showToast('Tasks list loaded'); }} className="flex items-center justify-between px-3 py-2.5 rounded-brand text-slate-600 hover:bg-slate-50 hover:text-slate-800 text-sm font-medium transition-all group">
                  <div className="flex items-center space-x-3">
                    <CheckSquare className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                    {isSidebarOpen && <span>Tasks</span>}
                  </div>
                  {isSidebarOpen && (
                    <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold">5</span>
                  )}
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); showToast('Messages panel loaded'); }} className="flex items-center justify-between px-3 py-2.5 rounded-brand text-slate-600 hover:bg-slate-50 hover:text-slate-800 text-sm font-medium transition-all group">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                    {isSidebarOpen && <span>Messages</span>}
                  </div>
                  {isSidebarOpen && (
                    <span className="bg-blue-100 text-brand-primary text-[10px] px-2 py-0.5 rounded-full font-bold">2</span>
                  )}
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); showToast('Settings loaded'); }} className="flex items-center space-x-3 px-3 py-2.5 rounded-brand text-slate-600 hover:bg-slate-50 hover:text-slate-800 text-sm font-medium transition-all group">
                  <Settings className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                  {isSidebarOpen && <span>Settings</span>}
                </a>
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t border-slate-50">
            <button 
              onClick={() => navigate('/')}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-brand text-brand-danger hover:bg-red-50 text-sm font-medium transition-all"
            >
              <LogOut className="w-5 h-5" />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>

        </aside>

        {/* MAIN BODY LAYOUT */}
        <div className="flex-1 overflow-y-auto flex flex-col xl:flex-row">
          
          {/* MAIN AREA */}
          <main className="flex-1 p-6 space-y-6 max-w-6xl mx-auto w-full">
            
            {/* GREETING CARD */}
            <div className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-brand p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 relative overflow-hidden animate-slide-up">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />
              <div className="z-10">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
                  Good Morning, Timnan <span className="ml-1.5 animate-[bounce_2s_infinite]">👋</span>
                </h2>
                <p className="text-white/80 text-xs sm:text-sm mt-1">Here's a breakdown of your pending and active workspaces today.</p>
              </div>
              <div className="z-10 bg-white/10 backdrop-blur-md px-4 py-2 border border-white/20 rounded-brand text-right">
                <span className="block text-xs font-semibold text-white/95">{currentDate}</span>
                <span className="block text-[10px] text-white/70 font-mono mt-0.5">{currentTime}</span>
              </div>
            </div>

            {/* QUICK STATS CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up [animation-delay:50ms]">
              
              <div className="bg-white border border-slate-100 p-4 rounded-brand shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500 font-medium">Active Projects</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-brand-primary font-bold flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                    +2
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-800">12</p>
                <p className="text-[10px] text-slate-400 mt-1">Updated 20 mins ago</p>
              </div>

              <div className="bg-white border border-slate-100 p-4 rounded-brand shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500 font-medium">Completed Tasks</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                    +24
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-800">128</p>
                <p className="text-[10px] text-slate-400 mt-1">84% success rate</p>
              </div>

              <div className="bg-white border border-slate-100 p-4 rounded-brand shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500 font-medium">Pending Reviews</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold">
                    +3
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-800">7</p>
                <p className="text-[10px] text-slate-400 mt-1">2 flagged critical</p>
              </div>

              <div className="bg-white border border-slate-100 p-4 rounded-brand shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500 font-medium">Team Members</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold">
                    +4
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-800">24</p>
                <p className="text-[10px] text-slate-400 mt-1">12 online now</p>
              </div>

            </div>

            {/* MIDDLE SECTION: ACTIVITY & TASK LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Recent Activity */}
              <div className="bg-white border border-slate-100 p-5 rounded-brand shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between pb-4 border-b border-slate-50 mb-4">
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">Recent Activity</h3>
                  <button onClick={() => showToast('Activity log loaded')} className="text-xs text-brand-primary font-semibold hover:underline">
                    View all
                  </button>
                </div>

                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  
                  <div className="flex items-start space-x-3.5 relative">
                    <div className="absolute top-7 bottom-0 left-[15px] w-0.5 bg-slate-100" />
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-brand-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                      M
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-slate-700 leading-snug">
                        <strong>Maya</strong> completed <span className="text-slate-800 font-medium">"Homepage Redesign"</span>
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-1">2 mins ago</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5 relative">
                    <div className="absolute top-7 bottom-0 left-[15px] w-0.5 bg-slate-100" />
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      S
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-slate-700 leading-snug">
                        <strong>Sam</strong> uploaded 3 new UI mockups to Figma
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-1">45 mins ago</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5 relative">
                    <div className="absolute top-7 bottom-0 left-[15px] w-0.5 bg-slate-100" />
                    <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      J
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-slate-700 leading-snug">
                        <strong>Jordan</strong> created new project <span className="text-slate-800 font-medium">"API Integration"</span>
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-1">2 hrs ago</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      T
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-slate-700 leading-snug">
                        <strong>You</strong> reviewed the draft requirements document
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-1">3 hrs ago</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Interactive Task List */}
              <div className="bg-white border border-slate-100 p-5 rounded-brand shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-50 mb-4">
                    <h3 className="font-bold text-slate-800 text-sm sm:text-base">My Tasks</h3>
                    <button 
                      onClick={() => {
                        const name = prompt('Enter task name:');
                        if (name) {
                          setTasks(prev => [...prev, {
                            id: Date.now(),
                            name,
                            tag: 'Dev',
                            due: 'Due soon',
                            completed: false
                          }]);
                          showToast('Task added successfully', 'success');
                        }
                      }}
                      className="text-xs text-brand-primary font-semibold hover:underline"
                    >
                      + Add Task
                    </button>
                  </div>

                  {/* Task Completion Progress */}
                  <div className="mb-5 bg-slate-50 p-3 rounded-brand">
                    <div className="flex justify-between items-center text-xs text-slate-500 font-semibold mb-1.5">
                      <span>Task Progress</span>
                      <span className="text-brand-primary">{taskProgressPct}% Complete</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-brand-primary h-full transition-all duration-500 ease-out" 
                        style={{ width: `${taskProgressPct}%` }}
                      />
                    </div>
                  </div>

                  <ul className="space-y-3 max-h-[190px] overflow-y-auto pr-1">
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => (
                        <li 
                          key={task.id}
                          onClick={() => toggleTask(task.id)}
                          className="flex items-center justify-between p-2.5 rounded-brand hover:bg-slate-50 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <span className={`w-4 h-4 border rounded flex items-center justify-center transition-all ${
                              task.completed 
                                ? 'bg-brand-primary border-brand-primary' 
                                : 'border-slate-300 group-hover:border-slate-400 bg-white'
                            }`}>
                              {task.completed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                            </span>
                            <span className={`text-xs sm:text-sm text-slate-700 min-w-0 truncate ${task.completed ? 'line-through text-slate-400' : ''}`}>
                              {task.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0 pl-2">
                            <span className={`text-[9px] px-2 py-0.5 rounded font-bold tracking-wider uppercase ${
                              task.tag === 'Design' ? 'bg-blue-100 text-blue-800' :
                              task.tag === 'Dev' ? 'bg-emerald-100 text-emerald-800' :
                              task.tag === 'Meeting' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {task.tag}
                            </span>
                            <span className="text-[10px] text-slate-400 font-light hidden sm:inline">{task.due}</span>
                          </div>
                        </li>
                      ))
                    ) : (
                      <p className="text-slate-400 text-center text-xs py-8">No tasks match your filter.</p>
                    )}
                  </ul>
                </div>
              </div>

            </div>

            {/* BOTTOM SECTION: EVENTS & QUICK ACTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Upcoming Events Calendar List */}
              <div className="bg-white border border-slate-100 p-5 rounded-brand shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-50 mb-4">
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">Upcoming Events</h3>
                  <button onClick={() => showToast('Calendar view loaded')} className="text-xs text-brand-primary font-semibold flex items-center hover:underline">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    Calendar
                  </button>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto">
                  
                  <div className="flex items-center justify-between p-2 rounded-brand hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-11 h-11 bg-blue-50 rounded-brand text-brand-primary flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold">JUL</span>
                        <span className="text-sm font-extrabold -mt-1">14</span>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-800">Sprint Planning Meeting</p>
                        <span className="text-[10px] text-slate-400">10:00 AM · 1 hr · Online</span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex-shrink-0">Online</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-brand hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-11 h-11 bg-indigo-50 rounded-brand text-indigo-500 flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold">JUL</span>
                        <span className="text-sm font-extrabold -mt-1">16</span>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-800">UI Review with Client</p>
                        <span className="text-[10px] text-slate-400">2:00 PM · 45 mins · Hybrid</span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold flex-shrink-0">Hybrid</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-brand hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-11 h-11 bg-amber-50 rounded-brand text-amber-500 flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold">JUL</span>
                        <span className="text-sm font-extrabold -mt-1">18</span>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-800">Stakeholder Presentation</p>
                        <span className="text-[10px] text-slate-400">9:00 AM · 2 hrs · Office</span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold flex-shrink-0">In Person</span>
                  </div>

                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="bg-white border border-slate-100 p-5 rounded-brand shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base pb-4 border-b border-slate-50 mb-4">Quick Actions</h3>
                  
                  <div className="grid grid-cols-2 gap-3.5">
                    
                    <button 
                      onClick={() => showToast('Opening New Project Dialog...', 'success')}
                      className="p-3 bg-slate-50 border border-slate-100 hover:bg-slate-100/50 hover:border-slate-200 rounded-brand text-left flex flex-col items-start transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-primary flex items-center justify-center mb-2.5">
                        <Plus className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">New Project</span>
                    </button>

                    <button 
                      onClick={() => showToast('Invite Team email sent!', 'success')}
                      className="p-3 bg-slate-50 border border-slate-100 hover:bg-slate-100/50 hover:border-slate-200 rounded-brand text-left flex flex-col items-start transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center mb-2.5">
                        <UserPlus className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">Invite Team</span>
                    </button>

                    <button 
                      onClick={() => showToast('Uploader tool launched')}
                      className="p-3 bg-slate-50 border border-slate-100 hover:bg-slate-100/50 hover:border-slate-200 rounded-brand text-left flex flex-col items-start transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
                        <Upload className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">Upload File</span>
                    </button>

                    <button 
                      onClick={() => showToast('Report Builder loaded')}
                      className="p-3 bg-slate-50 border border-slate-100 hover:bg-slate-100/50 hover:border-slate-200 rounded-brand text-left flex flex-col items-start transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">New Report</span>
                    </button>

                  </div>
                </div>

                {/* Project Spotlight Sub-card */}
                <div className="mt-6 border-t border-slate-50 pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                  <div className="min-w-0">
                    <span className="text-[10px] text-brand-primary font-bold uppercase tracking-wider">Current Spotlight</span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">AuthFlow v2.0 Redesign</h4>
                    <span className="text-[10px] text-slate-400 font-light block mt-0.5">Due date: July 31, 2026</span>
                  </div>
                  <div className="w-full sm:w-28 flex-shrink-0 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-brand-primary h-full rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>

              </div>

            </div>

          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="w-full xl:w-80 bg-white border-t xl:border-t-0 xl:border-l border-slate-100 p-6 space-y-6 flex-shrink-0 flex flex-col justify-start">
            
            {/* PROFILE SUMMARY */}
            <div className="bg-slate-50 border border-slate-100 rounded-brand p-5 flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xl shadow-md">
                  T
                </div>
                <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-brand-success rounded-full border-2 border-white" />
              </div>
              <h3 className="font-bold text-slate-800 text-base mt-3">Timnan</h3>
              <p className="text-xs text-slate-400 font-light leading-snug">Lead UI/UX Designer & Developer</p>
              
              <div className="flex justify-between items-center w-full mt-4 pt-4 border-t border-slate-200/60 text-xs">
                <div className="flex-1">
                  <span className="block font-bold text-slate-700">48</span>
                  <span className="block text-[10px] text-slate-400 font-light mt-0.5">Assigned Tasks</span>
                </div>
                <div className="w-px h-6 bg-slate-200" />
                <div className="flex-1">
                  <span className="block font-bold text-slate-700">12</span>
                  <span className="block text-[10px] text-slate-400 font-light mt-0.5">Active Projects</span>
                </div>
              </div>
            </div>

            {/* PRODUCTIVITY CIRCULAR INDICATOR */}
            <div className="bg-white border border-slate-100 rounded-brand p-5 flex flex-col items-center">
              <div className="flex justify-between items-center w-full mb-4">
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Productivity Score</h4>
                <span className="text-[10px] px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded-full font-bold">This Week</span>
              </div>

              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* SVG circular track and bar */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="transparent" 
                    stroke="#2563EB" 
                    strokeWidth="8" 
                    strokeDasharray="251.2" 
                    strokeDashoffset="40.2" // 84% score
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-3xl font-extrabold text-slate-800">84</span>
                  <span className="text-sm font-semibold text-slate-500">%</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 w-full mt-5 text-center text-[10px]">
                <div>
                  <span className="w-2 h-2 rounded-full bg-brand-success inline-block mr-1" />
                  <span className="block font-bold text-slate-700">92%</span>
                  <span className="text-slate-400">Done</span>
                </div>
                <div>
                  <span className="w-2 h-2 rounded-full bg-brand-primary inline-block mr-1" />
                  <span className="block font-bold text-slate-700">78%</span>
                  <span className="text-slate-400">On Time</span>
                </div>
                <div>
                  <span className="w-2 h-2 rounded-full bg-brand-secondary inline-block mr-1" />
                  <span className="block font-bold text-slate-700">81%</span>
                  <span className="text-slate-400">Collab</span>
                </div>
              </div>
            </div>

            {/* PRODUCTIVITY CHART (WEEKLY ACTIVITY) */}
            <div className="bg-white border border-slate-100 rounded-brand p-5">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Activity Analysis</h4>
                <span className="text-[10px] text-slate-400 font-light">Last 7 Days</span>
              </div>

              {/* Bar Chart representation */}
              <div className="flex justify-between items-end h-28 pt-2">
                <div className="flex flex-col items-center space-y-1 w-full">
                  <div className="w-2.5 bg-brand-primary/20 hover:bg-brand-primary rounded-t transition-all cursor-pointer" style={{ height: '40px' }} title="Monday: 8 tasks" />
                  <span className="text-[9px] font-semibold text-slate-400">M</span>
                </div>
                <div className="flex flex-col items-center space-y-1 w-full">
                  <div className="w-2.5 bg-brand-primary/20 hover:bg-brand-primary rounded-t transition-all cursor-pointer" style={{ height: '70px' }} title="Tuesday: 14 tasks" />
                  <span className="text-[9px] font-semibold text-slate-400">T</span>
                </div>
                <div className="flex flex-col items-center space-y-1 w-full">
                  <div className="w-2.5 bg-brand-primary/20 hover:bg-brand-primary rounded-t transition-all cursor-pointer" style={{ height: '55px' }} title="Wednesday: 11 tasks" />
                  <span className="text-[9px] font-semibold text-slate-400">W</span>
                </div>
                <div className="flex flex-col items-center space-y-1 w-full">
                  <div className="w-2.5 bg-brand-primary hover:bg-blue-700 rounded-t transition-all cursor-pointer" style={{ height: '90px' }} title="Thursday: 18 tasks" />
                  <span className="text-[9px] font-semibold text-brand-primary font-bold">T</span>
                </div>
                <div className="flex flex-col items-center space-y-1 w-full">
                  <div className="w-2.5 bg-brand-primary/20 hover:bg-brand-primary rounded-t transition-all cursor-pointer" style={{ height: '65px' }} title="Friday: 13 tasks" />
                  <span className="text-[9px] font-semibold text-slate-400">F</span>
                </div>
                <div className="flex flex-col items-center space-y-1 w-full">
                  <div className="w-2.5 bg-brand-primary/10 hover:bg-brand-primary rounded-t transition-all cursor-pointer" style={{ height: '30px' }} title="Saturday: 6 tasks" />
                  <span className="text-[9px] font-semibold text-slate-400">S</span>
                </div>
                <div className="flex flex-col items-center space-y-1 w-full">
                  <div className="w-2.5 bg-brand-primary/10 hover:bg-brand-primary rounded-t transition-all cursor-pointer" style={{ height: '20px' }} title="Sunday: 4 tasks" />
                  <span className="text-[9px] font-semibold text-slate-400">S</span>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between text-[10px] text-slate-500">
                <span>74 tasks this week</span>
                <span className="text-brand-success font-semibold flex items-center">
                  +12% vs last week
                </span>
              </div>
            </div>

          </aside>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-center space-y-2.5 sm:space-y-0 text-xs text-slate-400 flex-shrink-0 z-35">
        <p>&copy; 2026 AuthFlow. All rights reserved.</p>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Support Desk</a>
        </div>
      </footer>

    </div>
  );
}
