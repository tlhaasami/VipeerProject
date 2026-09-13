import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { useToast } from '../../components/NotificationToast';
import {
  Bell,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const SupplierNotifications = () => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await dataService.getNotificationsBySupplier(currentUser?.supplierId);
      setNotifications(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [currentUser]);

  const handleMarkAsRead = async (id) => {
    await dataService.markNotificationAsRead(id);
    addToast('Notification marked as read.', 'info');
    loadNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-[#D8D2BC] rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2D0000]">Supplier Notification Inbox</h1>
          <p className="text-[#50574B] text-xs mt-0.5 font-medium">
            Automated alerts dispatched when supply requests are modified, re-scheduled, or cancelled by operations.
          </p>
        </div>

        <div className="text-xs font-bold bg-[#F8F6EC] px-3.5 py-2 rounded-xl border border-[#D8D2BC] text-[#2D0000]">
          <span className="text-[#6D0808] font-mono">{unreadCount}</span> Unread Alerts
        </div>
      </div>

      {/* Notifications Feed */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-12 text-center bg-white border border-[#D8D2BC] rounded-2xl shadow-sm">
            <Bell className="w-10 h-10 text-[#757D6F] mx-auto mb-3" />
            <h3 className="text-[#2D0000] font-bold text-sm">No Notifications</h3>
            <p className="text-[#757D6F] text-xs mt-1 font-medium">
              You will receive real-time alerts whenever a coordinator modifies your assigned supply requests.
            </p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
                !notif.isRead
                  ? 'bg-white border-[#6D0808]/40 shadow-[#6D0808]/5'
                  : 'bg-[#F8F6EC] border-[#D8D2BC] text-[#50574B]'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D0000]">
                    <span className={`w-2 h-2 rounded-full ${
                      notif.type === 'CANCEL' ? 'bg-red-600' :
                      notif.type === 'UPDATE' ? 'bg-amber-500' : 'bg-blue-500'
                    }`}></span>
                    {notif.type}
                  </span>
                  <h3 className="text-sm font-bold text-[#2D0000]">{notif.title}</h3>
                  {!notif.isRead && (
                    <span className="text-[10px] bg-[#6D0808] text-[#EEEAD7] px-2 py-0.5 rounded font-bold">
                      NEW
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#50574B] leading-relaxed font-medium">{notif.message}</p>
                <div className="flex items-center space-x-2 text-[11px] text-[#757D6F] font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(notif.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {!notif.isRead && (
                <button
                  onClick={() => handleMarkAsRead(notif.id)}
                  className="px-3.5 py-2 bg-[#F8F6EC] hover:bg-[#EEEAD7] text-[#2D0000] rounded-xl text-xs font-semibold border border-[#D8D2BC] transition-colors self-start sm:self-auto shrink-0 flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6D0808]" />
                  <span>Mark as Read</span>
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
