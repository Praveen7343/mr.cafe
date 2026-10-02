import React from 'react';
import { useCafe, OwnerScreen } from '../../context/CafeContext';
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Users,
  Award,
  Tag,
  BarChart3,
  Settings,
  Coffee,
  ChevronRight,
  ChevronLeft,
  X,
  LogOut
} from 'lucide-react';
import { MrCafeLogo } from '../common/MrCafeLogo';

interface OwnerSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const OwnerSidebar: React.FC<OwnerSidebarProps> = ({ isOpen, onClose }) => {
  const { ownerView, setOwnerView, activeUser, setActiveRole, logout, isAdmin } = useCafe();

  const navLinks: { id: OwnerScreen; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'menu', label: 'Menu Management', icon: UtensilsCrossed },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'coupons', label: 'Loyalty & Offers', icon: Award },
    { id: 'coupons', label: 'Offers & Coupons', icon: Tag },
    { id: 'dashboard', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (view: OwnerScreen) => {
    setOwnerView(view);
    if (onClose) onClose();
  };

  return (
    <aside
      className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-[#FAF7F2] border-r border-[#EADBCE] flex flex-col justify-between transition-transform duration-200 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Brand Header matching mockup */}
      <div>
        <div className="p-5 border-b border-[#EADBCE] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MrCafeLogo className="w-11 h-11 shrink-0 drop-shadow-sm" />
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-[#2B170B] leading-tight">Mr. CAFE</h1>
              <p className="text-[11px] text-[#8C6D53] font-semibold leading-none mt-0.5">
                Cafe Management
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items matching mockup */}
        <nav className="p-3 space-y-1">
          {navLinks.map((item, index) => {
            const Icon = item.icon;
            const isActive = ownerView === item.id && (index !== 5 && index !== 6);

            return (
              <button
                key={`${item.id}-${index}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#F2E5D5] text-[#78350F] shadow-2xs font-bold'
                    : 'text-[#61493A] hover:bg-[#F5ECE1] hover:text-[#2A170B]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#78350F]' : 'text-[#8C6F5A]'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile matching mockup bottom card */}
      <div className="p-4 border-t border-[#EADBCE]">
        <div className="bg-white rounded-2xl p-3 border border-[#EADBCE] shadow-2xs flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-amber-100 shrink-0 ring-1 ring-amber-300">
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
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#2A170B] truncate">
                {activeUser.name}
              </div>
              <div className="text-[10px] text-amber-800 truncate font-semibold">
                {isAdmin ? 'Admin (Owner)' : 'Manager'}
              </div>
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
        </div>

        <button
          onClick={logout}
          className="w-full mt-2 py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors border border-red-200 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
