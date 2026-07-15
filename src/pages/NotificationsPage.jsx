import React, { useState } from 'react';
import { Bell, Check, Trash2, Mail, Info, ShieldAlert, CheckCircle2, Server } from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'success',
    title: 'SAP Account Data Synchronized',
    message: 'The SAP customer master records database has been successfully updated with yesterday\'s batch records.',
    time: '5 mins ago',
    read: false
  },
  {
    id: 2,
    type: 'assign',
    title: 'Inquiry Assigned to You',
    message: 'Supervisor Jordan assigned ticket #Q-9812 (Sarah Jenkins from Acme Corp) to you for resolution.',
    time: '12 mins ago',
    read: false
  },
  {
    id: 3,
    type: 'warning',
    title: 'GDPR Compliance Retake Deadline',
    message: 'Your certification for Customer Data Protection & GDPR Compliance is set to renew in 15 days.',
    time: '2 hours ago',
    read: false
  },
  {
    id: 4,
    type: 'grade',
    title: 'Quiz Scored: SAP Sold-To ID Mapping',
    message: 'Your submitted quiz for SAP Sold-To ID Hierarchy has been graded: 84% (Passed).',
    time: '1 day ago',
    read: true
  },
  {
    id: 5,
    type: 'system',
    title: 'System Maintenance Scheduled',
    message: 'LAP Contact Center portals will undergo standard database indexing on Saturday at 2:00 AM UTC.',
    time: '2 days ago',
    read: true
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  const toggleRead = (id) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === id) {
        return { ...n, read: !n.read };
      }
      return n;
    }));
  };

  const deleteNotif = (id, e) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast('Notification deleted');
  };

  const clearAll = () => {
    setNotifications([]);
    showToast('All notifications cleared');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'assign':
        return <Mail className="w-5 h-5 text-brand-primary" />;
      case 'warning':
        return <ShieldAlert className="w-5 h-5 text-amber-600" />;
      case 'grade':
        return <Info className="w-5 h-5 text-indigo-500" />;
      default:
        return <Server className="w-5 h-5 text-slate-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 animate-slide-up relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-lg flex items-center space-x-2 z-50 animate-slide-up">
          <span className="w-2 h-2 rounded-full bg-brand-success" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="pb-2 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Notifications</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Stay up to date with customer inquiries, system statuses, and quiz results.</p>
        </div>
        
        {notifications.length > 0 && (
          <div className="flex gap-2 w-full sm:w-auto">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex-1 sm:flex-initial px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold rounded-brand text-xs transition-all flex items-center justify-center space-x-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={clearAll}
              className="flex-1 sm:flex-initial px-4 py-2 bg-rose-50 border border-rose-100 hover:bg-rose-100/60 text-rose-700 font-semibold rounded-brand text-xs transition-all flex items-center justify-center space-x-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear all</span>
            </button>
          </div>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="bg-white border border-slate-100 rounded-brand shadow-sm divide-y divide-slate-100 overflow-hidden">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => toggleRead(notif.id)}
              className={`p-4 sm:p-5 flex items-start gap-4 transition-all hover:bg-slate-50/50 cursor-pointer ${
                !notif.read ? 'bg-blue-50/10 border-l-4 border-brand-primary pl-3 sm:pl-4' : 'pl-4 sm:pl-5'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                notif.type === 'success' ? 'bg-emerald-50' :
                notif.type === 'assign' ? 'bg-blue-50' :
                notif.type === 'warning' ? 'bg-amber-50' :
                notif.type === 'grade' ? 'bg-indigo-50' : 'bg-slate-50'
              }`}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-1">
                  <h4 className={`text-xs sm:text-sm text-slate-800 ${!notif.read ? 'font-bold' : 'font-semibold'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-light flex-shrink-0">{notif.time}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">{notif.message}</p>
                <div className="flex gap-4 mt-2">
                  <span className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 font-light">
                    <span className={`w-1.5 h-1.5 rounded-full ${notif.read ? 'bg-slate-300' : 'bg-brand-primary'}`} />
                    {notif.read ? 'Marked as read' : 'Mark as read'}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => deleteNotif(notif.id, e)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all flex-shrink-0 self-center sm:self-start"
                title="Delete notification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-brand p-12 text-center flex flex-col items-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mb-4">
            <Bell className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">No Notifications</h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-sm mt-1">
            You are completely caught up! We will let you know when new training reports, system notifications, or inquiry updates arrive.
          </p>
        </div>
      )}
    </div>
  );
}
