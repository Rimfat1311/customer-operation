import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HelpCircle, Clock, Search, Bell, FileText, Menu
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  
  // Tab and responsive states
  const [activeTab, setActiveTab] = useState('take-questions');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Date and Time states (reused from original for dynamic look)
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Content map for different tabs
  const tabContent = {
    'take-questions': {
      title: 'Take Questions',
      sectionTitle: 'Assigned Quizzes',
      cardTitle: 'No quizzes are currently assigned to you.',
      cardText: 'Please check back later.',
      icon: <FileText className="w-10 h-10 text-brand-danger" />
    },
    'quiz-results': {
      title: 'My Quiz Results',
      sectionTitle: 'Quiz History & Performance',
      cardTitle: 'No quiz results available.',
      cardText: 'Complete your assigned quizzes to see results here.',
      icon: <Clock className="w-10 h-10 text-brand-primary" />
    },
    'search-customers': {
      title: 'Search Customers',
      sectionTitle: 'Customer Registry',
      cardTitle: 'Customer Database Offline',
      cardText: 'Please connect to the local network to query customer files.',
      icon: <Search className="w-10 h-10 text-brand-secondary" />
    },
    'notifications': {
      title: 'Notifications',
      sectionTitle: 'System Alerts',
      cardTitle: 'All caught up!',
      cardText: 'You have no new notifications.',
      icon: <Bell className="w-10 h-10 text-brand-success" />
    }
  };

  const currentTab = tabContent[activeTab] || tabContent['take-questions'];

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col sm:flex-row font-sans relative">
      
      {/* MOBILE HEADER */}
      <header className="sm:hidden bg-white border-b border-slate-100 h-16 px-4 flex items-center justify-between z-45 shadow-sm">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm text-brand-danger tracking-tight">LAP Contact Center</span>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="px-3 py-1.5 bg-brand-danger hover:bg-red-600 text-white text-xs font-semibold rounded-brand transition-colors shadow-sm"
        >
          Logout
        </button>
      </header>

      {/* LEFT SIDEBAR */}
      <aside className={`${
        isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0 sm:translate-x-0 sm:w-20'
      } fixed inset-y-0 left-0 sm:relative bg-white border-r border-slate-100 flex-shrink-0 flex flex-col justify-between transition-all duration-300 ease-in-out z-50 sm:z-30 h-full sm:h-auto`}>
        
        <div>
          {/* Logo & Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between h-16">
            <span className={`font-extrabold text-brand-danger tracking-tight transition-all duration-300 ${
              isSidebarOpen ? 'text-base' : 'text-xs'
            }`}>
              {isSidebarOpen ? 'LAP Contact Center' : 'LAP'}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('take-questions');
                    if (window.innerWidth < 640) setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-brand transition-all ${
                    activeTab === 'take-questions'
                      ? 'bg-blue-50 text-brand-primary font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium'
                  }`}
                >
                  <HelpCircle className={`w-5 h-5 ${activeTab === 'take-questions' ? 'text-brand-primary' : 'text-slate-400'}`} />
                  {isSidebarOpen && <span className="text-sm">Take Questions</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('quiz-results');
                    if (window.innerWidth < 640) setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-brand transition-all ${
                    activeTab === 'quiz-results'
                      ? 'bg-blue-50 text-brand-primary font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium'
                  }`}
                >
                  <Clock className={`w-5 h-5 ${activeTab === 'quiz-results' ? 'text-brand-primary' : 'text-slate-400'}`} />
                  {isSidebarOpen && <span className="text-sm">My Quiz Results</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('search-customers');
                    if (window.innerWidth < 640) setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-brand transition-all ${
                    activeTab === 'search-customers'
                      ? 'bg-blue-50 text-brand-primary font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium'
                  }`}
                >
                  <Search className={`w-5 h-5 ${activeTab === 'search-customers' ? 'text-brand-primary' : 'text-slate-400'}`} />
                  {isSidebarOpen && <span className="text-sm">Search Customers</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('notifications');
                    if (window.innerWidth < 640) setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-brand transition-all ${
                    activeTab === 'notifications'
                      ? 'bg-blue-50 text-brand-primary font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium'
                  }`}
                >
                  <Bell className={`w-5 h-5 ${activeTab === 'notifications' ? 'text-brand-primary' : 'text-slate-400'}`} />
                  {isSidebarOpen && <span className="text-sm">Notifications</span>}
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Sidebar Footer: Logged In User */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex flex-col">
            <span className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              {isSidebarOpen ? 'Logged In As' : 'USER'}
            </span>
            <span className="block text-sm font-semibold text-slate-700 mt-0.5 truncate" title="Timnan Simon">
              {isSidebarOpen ? 'Timnan Simon' : 'T. Simon'}
            </span>
          </div>
        </div>

      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-h-[calc(100vh-4rem)] sm:min-h-screen overflow-y-auto">
        
        {/* Main Header bar */}
        <header className="hidden sm:flex bg-white border-b border-slate-100 h-16 px-6 items-center justify-between flex-shrink-0 shadow-sm z-10">
          <h1 className="text-lg font-bold text-slate-800">{currentTab.title}</h1>
          
          <div className="flex items-center space-x-4">
            <div className="text-right text-xs text-slate-400 hidden md:block">
              <span>{currentDate} · {currentTime}</span>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-1.5 bg-brand-danger hover:bg-red-600 text-white text-sm font-semibold rounded-brand transition-colors shadow-sm"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Panel Body */}
        <main className="flex-1 p-6 bg-slate-50 flex items-center justify-center">
          <div className="max-w-2xl w-full space-y-6">
            
            {/* Header section title */}
            <h2 className="text-xl font-bold text-brand-danger uppercase tracking-wide border-b border-slate-200 pb-2">
              {currentTab.sectionTitle}
            </h2>

            {/* Central Card */}
            <div className="bg-white border border-slate-200/60 rounded-brand p-12 shadow-sm flex flex-col items-center justify-center text-center space-y-5 transition-all hover:shadow-md">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                {currentTab.icon}
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold text-slate-800">{currentTab.cardTitle}</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-sm">{currentTab.cardText}</p>
              </div>
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-center space-y-2.5 sm:space-y-0 text-xs text-slate-400 flex-shrink-0 z-10">
          <p>&copy; 2026 LAP Contact Center. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Support Desk</a>
          </div>
        </footer>

      </div>

    </div>
  );
}
