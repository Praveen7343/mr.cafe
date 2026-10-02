import React from 'react';
import { useCafe, CustomerScreen } from '../../context/CafeContext';
import {
  Home,
  BookOpen,
  Receipt,
  Star,
  User,
  ShoppingBag
} from 'lucide-react';

export const CustomerBottomNav: React.FC = () => {
  const { customerView, setCustomerView, cartItemCount, cartTotal, orders } = useCafe();

  const navItems: { id: CustomerScreen; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'menu', label: 'Menu', icon: BookOpen },
    { id: 'orders', label: 'Orders', icon: Receipt },
    { id: 'profile', label: 'Points', icon: Star },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready'
  ).length;

  return (
    <>
      {/* Floating Cart Pill if user has items and isn't on cart screen */}
      {cartItemCount > 0 && customerView !== 'cart' && customerView !== 'order-success' && (
        <div className="fixed bottom-16 left-0 right-0 z-30 px-4 max-w-md mx-auto pointer-events-none">
          <button
            onClick={() => setCustomerView('cart')}
            className="w-full bg-[#78350F] hover:bg-[#5C2607] text-white p-3 rounded-2xl shadow-xl flex items-center justify-between pointer-events-auto transition-transform active:scale-[0.98] border border-amber-600/40"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-xl bg-amber-400 text-[#78350F] flex items-center justify-center font-bold text-xs">
                {cartItemCount}
              </div>
              <div className="text-left text-xs font-bold leading-tight">
                <div>View Your Cart</div>
                <div className="text-[10px] text-amber-200/80 font-normal">
                  {cartItemCount === 1 ? '1 item added' : `${cartItemCount} items added`}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 text-xs font-bold tabular-nums">
              <span>₹{cartTotal}</span>
              <span className="text-amber-200 text-sm">→</span>
            </div>
          </button>
        </div>
      )}

      {/* Persistent Bottom Bar matching mockup */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#FAF7F2] border-t border-[#EADBCE] py-1.5 px-3 z-30 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {/* Home */}
          <button
            onClick={() => setCustomerView('home')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
              customerView === 'home'
                ? 'text-[#78350F] font-bold'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Home</span>
          </button>

          {/* Menu */}
          <button
            onClick={() => setCustomerView('menu')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
              customerView === 'menu'
                ? 'text-[#78350F] font-bold'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Menu</span>
          </button>

          {/* Orders */}
          <button
            onClick={() => setCustomerView('orders')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors relative ${
              customerView === 'orders'
                ? 'text-[#78350F] font-bold'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <div className="relative">
              <Receipt className="w-5 h-5 mb-0.5" />
              {activeOrdersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-600 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </div>
            <span className="text-[10px] tracking-tight">Orders</span>
          </button>

          {/* Cart */}
          <button
            onClick={() => setCustomerView('cart')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors relative ${
              customerView === 'cart'
                ? 'text-[#78350F] font-bold'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 mb-0.5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-amber-600 text-white text-[9px] font-bold px-1 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight">Cart</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => setCustomerView('profile')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
              customerView === 'profile'
                ? 'text-[#78350F] font-bold'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Profile</span>
          </button>
        </div>
      </nav>
    </>
  );
};
