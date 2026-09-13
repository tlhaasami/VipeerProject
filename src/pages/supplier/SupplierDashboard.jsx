import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import {
  Truck,
  ClipboardList,
  Bell,
  CheckCircle2,
  ArrowUpRight,
  MessageSquare
} from 'lucide-react';

export const SupplierDashboard = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSupplierData = async () => {
      setLoading(true);
      try {
        const [allReqs, notifs] = await Promise.all([
          dataService.getRequests(),
          dataService.getNotificationsBySupplier(currentUser?.supplierId)
        ]);
        const assigned = allReqs.filter((r) => !currentUser?.supplierId || r.assignedSupplierId === currentUser.supplierId);
        setRequests(assigned);
        setNotifications(notifs);
      } finally {
        setLoading(false);
      }
    };
    loadSupplierData();
  }, [currentUser]);

  const unreadNotifs = notifications.filter((n) => !n.isRead);
  const pendingFeedbackReqs = requests.filter((r) => r.status === 'Assigned' || r.status === 'Pending');

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border border-[#D8D2BC] rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2D0000]">Supplier Fulfillment Center</h1>
          <p className="text-[#50574B] text-xs mt-0.5 font-medium">
            Logged in as <strong className="text-[#2D0000]">{currentUser?.fullName}</strong> ({currentUser?.roleTitle})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('requests')}
            className="flex items-center space-x-2 px-4 py-2.5 bg-[#6D0808] hover:bg-[#820a0a] text-[#EEEAD7] rounded-xl text-xs font-semibold shadow-md shadow-[#6D0808]/20 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Submit Capacity Response</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#757D6F]">Assigned Orders</span>
            <div className="w-9 h-9 rounded-xl bg-[#6D0808]/10 text-[#6D0808] flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-[#2D0000]">{requests.length}</div>
          <div className="mt-2 text-[11px] text-[#757D6F] flex items-center justify-between font-medium">
            <span>{pendingFeedbackReqs.length} Awaiting Response</span>
            <button onClick={() => onNavigate('requests')} className="text-[#6D0808] hover:underline flex items-center font-bold">
              View <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#757D6F]">Coordinator Alerts</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-[#2D0000]">{notifications.length}</div>
          <div className="mt-2 text-[11px] text-[#757D6F] flex items-center justify-between font-medium">
            <span className="text-amber-800 font-bold">{unreadNotifs.length} Unread Alerts</span>
            <button onClick={() => onNavigate('notifications')} className="text-[#2D0000] hover:underline flex items-center font-bold">
              Inbox <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#757D6F]">Partner Rating</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-emerald-800">4.8 / 5.0</div>
          <div className="mt-2 text-[11px] text-[#757D6F] font-semibold">Tier-1 Approved Supplier</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Requests requiring feedback */}
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-extrabold text-[#2D0000]">Pending Supply Requests</h2>
              <p className="text-xs text-[#757D6F] font-medium">Orders awaiting delivery capacity commitment</p>
            </div>
            <button onClick={() => onNavigate('requests')} className="text-xs text-[#6D0808] hover:underline font-bold">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {requests.length === 0 ? (
              <p className="text-xs text-[#757D6F] p-4 text-center font-medium">No assigned supply requests currently.</p>
            ) : (
              requests.slice(0, 4).map((req) => (
                <div
                  key={req.id}
                  className="p-4 bg-[#F8F6EC] rounded-xl border border-[#D8D2BC] flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-xs text-[#6D0808]">{req.requestCode}</span>
                      <span className="text-xs text-[#50574B] font-medium">Qty: {req.quantity}</span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#2D0000] font-medium">
                        <span className={`w-2 h-2 rounded-full ${
                          req.priority === 'Critical' ? 'bg-red-600' :
                          req.priority === 'High' ? 'bg-amber-500' :
                          req.priority === 'Medium' ? 'bg-blue-500' : 'bg-slate-400'
                        }`}></span>
                        {req.priority}
                      </span>
                    </div>
                    <p className="text-xs text-[#50574B] mt-1 font-medium">Required by: {req.deliveryDate}</p>
                  </div>

                  <button
                    onClick={() => onNavigate('requests')}
                    className="px-3 py-1.5 bg-[#6D0808] hover:bg-[#820a0a] text-[#EEEAD7] rounded-lg text-xs font-semibold shadow-sm"
                  >
                    Respond
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Latest Coordinator Notifications */}
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-extrabold text-[#2D0000]">Recent Order Alerts</h2>
              <p className="text-xs text-[#757D6F] font-medium">Real-time alerts for order edits & cancellations</p>
            </div>
            <button onClick={() => onNavigate('notifications')} className="text-xs text-[#2D0000] hover:underline font-bold">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-xs text-[#757D6F] p-4 text-center font-medium">No notification alerts.</p>
            ) : (
              notifications.slice(0, 4).map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-xl border text-xs space-y-1 ${
                    !notif.isRead ? 'border-[#6D0808]/30 bg-[#6D0808]/5' : 'border-[#D8D2BC] bg-[#F8F6EC]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#2D0000] flex items-center gap-1.5">
                      {!notif.isRead && <span className="w-2 h-2 rounded-full bg-[#6D0808]"></span>}
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-[#757D6F] font-mono">
                      {new Date(notif.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-[#50574B] text-[11px] leading-relaxed font-medium">{notif.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
