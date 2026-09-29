import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  CheckCheck,
  Trash2,
  X,
  FileText,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { AppNotification } from '../../services/notificationService';

export const NotificationBellDrawer: React.FC = () => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    clearAllNotifications,
    setActiveTab,
    setSelectedTrackCaseId,
    govLanguage
  } = useApp();

  const isHindi = govLanguage === 'hi';
  const [isOpen, setIsOpen] = useState(false);
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'alerts'>('all');
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const filteredNotifications = notifications.filter(n => {
    if (filterTab === 'unread') return !n.read;
    if (filterTab === 'alerts') return n.type === 'alert' || n.type === 'warning';
    return true;
  });

  const handleOpenApplication = (notif: AppNotification) => {
    markNotificationRead(notif.id);
    if (notif.caseId) {
      setSelectedTrackCaseId(notif.caseId);
    }
    setActiveTab('track-progress');
    setIsOpen(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-[#138808]" />;
      case 'alert':
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-[#C62828]" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-[#003D7C]" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-4 border-l-[#138808]';
      case 'alert':
      case 'warning':
        return 'border-l-4 border-l-[#C62828]';
      case 'info':
      default:
        return 'border-l-4 border-l-[#003D7C]';
    }
  };

  return (
    <div className="relative inline-block" ref={drawerRef}>
      {/* Bell Trigger Button */}
      <button
        id="citizen-notification-bell-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="View notifications"
        className={`relative p-2 rounded-full transition-all duration-150 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-amber-400 ${
          isOpen ? 'bg-[#002856] text-white shadow-inner' : 'bg-[#002856]/60 hover:bg-[#002856] text-slate-200 hover:text-white'
        }`}
        title={isHindi ? 'सूचनाएं देखें' : 'View Notifications'}
      >
        <Bell className="w-4 h-4 text-[#FF9933]" />
        
        {/* Unread Counter Badge */}
        {unreadNotificationsCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#D32F2F] text-white font-black text-[10px] rounded-full flex items-center justify-center px-1 border-2 border-[#003D7C] animate-pulse shadow-md font-mono">
            {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel / Drawer */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[90vw] bg-white rounded-lg shadow-2xl border border-slate-300 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 text-slate-800">
          
          {/* Header */}
          <div className="bg-[#003D7C] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#FF9933]" />
              <span className="font-bold text-xs sm:text-sm">
                {isHindi ? 'सूचनाएं' : 'Notifications'}
              </span>
              {unreadNotificationsCount > 0 && (
                <span className="bg-[#FF9933] text-[#002856] text-[10px] font-black px-1.5 py-0.2 rounded font-mono">
                  {unreadNotificationsCount} {isHindi ? 'नया' : 'new'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {unreadNotificationsCount > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  className="text-[11px] text-[#C2DCF0] hover:text-white flex items-center gap-1 font-semibold hover:underline"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isHindi ? 'सभी पढ़ें' : 'Mark all read'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center border-b border-slate-200 bg-[#F8FAFC] px-3 pt-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilterTab('all')}
              className={`pb-2 px-2.5 border-b-2 transition-all ${
                filterTab === 'all'
                  ? 'border-[#003D7C] text-[#003D7C] font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {isHindi ? 'सभी' : 'All'} ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('unread')}
              className={`pb-2 px-2.5 border-b-2 transition-all ${
                filterTab === 'unread'
                  ? 'border-[#003D7C] text-[#003D7C] font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {isHindi ? 'अपठित' : 'Unread'} ({unreadNotificationsCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('alerts')}
              className={`pb-2 px-2.5 border-b-2 transition-all ${
                filterTab === 'alerts'
                  ? 'border-[#C62828] text-[#C62828] font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {isHindi ? 'अलर्ट / कार्रवाई' : 'Action Alerts'}
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 transition-colors hover:bg-[#F0F5FA] relative flex flex-col gap-1.5 ${getBorderColor(
                    n.type
                  )} ${!n.read ? 'bg-[#F4F8FC]' : 'bg-white'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {getIcon(n.type)}
                      <h4 className={`text-xs ${!n.read ? 'font-bold text-[#002856]' : 'font-semibold text-slate-700'}`}>
                        {n.title}
                      </h4>
                    </div>

                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[#003D7C] shrink-0" title="Unread" />
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                    {n.desc}
                  </p>

                  <div className="flex items-center justify-between gap-2 pt-1 mt-0.5 text-[10px] text-slate-500">
                    <div className="flex items-center gap-2 flex-wrap">
                      {n.caseId && (
                        <span className="font-mono font-bold px-1.5 py-0.2 bg-slate-100 text-[#003D7C] rounded border border-slate-200">
                          {n.caseId}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{n.time}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenApplication(n)}
                        className="text-[#003D7C] hover:text-[#002856] font-bold flex items-center gap-0.5 hover:underline"
                        title="View Application Details"
                      >
                        <span>{isHindi ? 'ट्रैक करें' : 'Track'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteNotification(n.id)}
                        className="p-1 rounded text-slate-400 hover:text-red-700 hover:bg-red-50"
                        title="Delete notification"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center space-y-2 text-slate-500">
                <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold">
                  {filterTab === 'unread'
                    ? (isHindi ? 'कोई नई अपठित सूचना नहीं है।' : 'No unread notifications.')
                    : (isHindi ? 'कोई सूचना उपलब्ध नहीं है।' : 'No notifications in this category.')}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-[#F8FAFC] border-t border-slate-200 flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('track-progress');
                setIsOpen(false);
              }}
              className="text-[#003D7C] font-bold hover:underline flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isHindi ? 'आवेदन ट्रैकर खोलें' : 'Open Application Tracker'}</span>
            </button>

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={clearAllNotifications}
                className="text-slate-500 hover:text-red-700 hover:underline"
              >
                {isHindi ? 'सभी हटाएं' : 'Clear All'}
              </button>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
