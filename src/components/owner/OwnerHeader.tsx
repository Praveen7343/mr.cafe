import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import {
  Search,
  Star,
  Bell,
  Menu as MenuIcon,
  Coffee,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

interface OwnerHeaderProps {
  onToggleSidebar: () => void;
}

export const OwnerHeader: React.FC<OwnerHeaderProps> = ({ onToggleSidebar }) => {
  const { activeUser, orders, setActiveRole } = useCafe();
  const [showNotifications, setShowNotifications] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');

  const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Preparing');

  return (
    <header className="bg-white border-b border-[#EADBCE] px-4 py-3 sticky top-10 z-20 flex items-center justify-between shadow-2xs">
      <div className="flex items-center space-x-3 flex-1 max-w-md">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-neutral-600 hover:bg-neutral-100"
          aria-label="Open Navigation"
        >
          <MenuIcon className="w-5 h-5" />
        </button>

        {/* Search bar matching mockup header */}
        <div className="relative w-full">
          <div className="absolute left-3.5 top-2.5 text-neutral-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={headerSearch}
            onChange={(e) => setHeaderSearch(e.target.value)}
            placeholder="Search orders, menu, customers..."
            className="w-full bg-[#FAF7F2] pl-10 pr-4 py-2 rounded-xl text-xs border border-[#E8DEC8] text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
          />
        </div>
      </div>

      {/* Right controls matching mockup */}
      <div className="flex items-center space-x-3 pl-3">
        {/* Switch to customer view quick link */}
        <button
          onClick={() => setActiveRole('customer')}
          className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#FAF3EC] hover:bg-[#F3E5D4] text-[#78350F] rounded-xl text-xs font-bold transition-colors border border-[#E8DEC8]"
          title="Open Customer Ordering View"
        >
          <Coffee className="w-3.5 h-3.5" />
          <span>Customer View</span>
          <ExternalLink className="w-3 h-3 text-[#78350F]/70" />
        </button>

        {/* Loyalty Points Pill matching mockup */}
        <div className="flex items-center space-x-1.5 bg-[#FFF8E7] text-[#92400E] border border-amber-300 px-2.5 py-1.5 rounded-full text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-600" />
          <span className="tabular-nums">1,250</span>
          <span className="text-[10px] text-amber-800 font-semibold hidden md:inline">Points</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-full bg-[#FAF7F2] hover:bg-[#F2EAE0] text-neutral-700 flex items-center justify-center relative transition-colors border border-[#EADBCE]"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {pendingOrders.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-600 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#ECE2D8] p-3 text-xs z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 font-bold text-neutral-800">
                <span>Recent Activity</span>
                <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                  {pendingOrders.length} pending
                </span>
              </div>
              <div className="py-2 space-y-2 max-h-56 overflow-y-auto">
                {orders.slice(0, 4).map((o) => (
                  <div key={o.id} className="p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                    <div className="flex justify-between font-semibold text-neutral-800">
                      <span>Order {o.id}</span>
                      <span className="text-[#78350F]">₹{o.total}</span>
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      {o.customerName} · {o.status} ({o.timeFormatted})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="w-9 h-9 rounded-full overflow-hidden bg-amber-100 ring-2 ring-[#78350F]/20">
          {activeUser.avatar ? (
            <img
              src={activeUser.avatar}
              alt={activeUser.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="w-full h-full flex items-center justify-center text-xs font-bold text-amber-900">
              BP
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
