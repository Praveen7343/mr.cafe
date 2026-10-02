import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import {
  Coffee,
  LayoutDashboard,
  Smartphone,
  Monitor,
  UserCheck,
  Sparkles,
  ShoppingBag,
  LogOut,
  Database,
  ShieldCheck
} from 'lucide-react';
import { SupabaseModal } from './SupabaseModal';

export const RoleSwitcher: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    activeUser,
    deviceMode,
    setDeviceMode,
    cartItemCount,
    setCustomerView,
    isSupabaseConnected,
    isAdmin,
    logout,
    toast,
  } = useCafe();

  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-14 right-4 z-50 bg-[#291A10] text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2 border border-amber-600/30 animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Universal Mode & Role Bar */}
      <header className="bg-[#21140C] text-[#EADBCE] text-xs border-b border-[#3B2516] sticky top-0 z-40 px-4 py-2 flex items-center justify-between shadow-sm">
        {/* Left: Role Switcher Buttons */}
        <div className="flex items-center space-x-2">
          {isAdmin ? (
            <>
              <span className="text-[11px] uppercase tracking-wider text-amber-300/80 font-bold hidden sm:inline mr-1">
                Admin Mode:
              </span>

              <button
                onClick={() => setActiveRole('customer')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeRole === 'customer'
                    ? 'bg-amber-600 text-white shadow-xs font-semibold'
                    : 'text-amber-200/70 hover:text-white hover:bg-white/5'
                }`}
                title="Preview Customer Storefront"
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Customer View</span>
                {cartItemCount > 0 && activeRole === 'customer' && (
                  <span className="bg-white text-amber-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveRole('owner')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeRole === 'owner'
                    ? 'bg-amber-600 text-white shadow-xs font-semibold'
                    : 'text-amber-200/70 hover:text-white hover:bg-white/5'
                }`}
                title="Switch to Cafe Owner / Manager Dashboard"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Owner Dashboard</span>
                <span className="bg-amber-400/20 text-amber-200 text-[10px] font-bold px-1.5 py-0.2 rounded-md hidden md:inline">
                  Admin
                </span>
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-amber-600/30 flex items-center justify-center text-amber-300">
                <Coffee className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-xs text-amber-200">Brew &amp; Bite Customer Portal</span>
            </div>
          )}
        </div>

        {/* Center: Device Simulation Toggle (Only relevant when in customer view) */}
        {activeRole === 'customer' && (
          <div className="hidden md:flex items-center bg-black/40 rounded-lg p-0.5 border border-white/10">
            <button
              onClick={() => setDeviceMode('responsive')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                deviceMode === 'responsive'
                  ? 'bg-white/20 text-white font-medium'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Full Desktop Browser View"
            >
              <Monitor className="w-3 h-3" />
              <span>Desktop</span>
            </button>

            <button
              onClick={() => setDeviceMode('mobile-mock')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                deviceMode === 'mobile-mock'
                  ? 'bg-white/20 text-white font-medium'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Mobile App Frame (Mockup View)"
            >
              <Smartphone className="w-3 h-3" />
              <span>Mobile Frame</span>
            </button>
          </div>
        )}

        {/* Right: Supabase DB & SQL button, Current Active User info & Switch Account */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setSupabaseModalOpen(true)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
              isSupabaseConnected
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900'
                : 'bg-amber-950/80 text-amber-300 border-amber-500/50 hover:bg-amber-900'
            }`}
            title="View Supabase SQL Code & Database Connection"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Supabase DB & SQL</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
          </button>

          <div className="flex items-center space-x-2 text-right">
            <div className="hidden sm:block">
              <div className="text-[11px] font-semibold text-white leading-tight flex items-center justify-end space-x-1">
                {isAdmin && <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" />}
                <span>{activeUser.name}</span>
              </div>
              <div className="text-[10px] text-amber-300/80 leading-tight">
                {isAdmin
                  ? '👑 Admin (bhanu934785@gmail.com)'
                  : `⭐ ${activeUser.loyaltyPoints} Pts · Customer`}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center space-x-1 px-2.5 py-1 bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-500/30 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            title="Sign Out to Intro Page"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Supabase Database & SQL Code Modal */}
      <SupabaseModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
      />
    </>
  );
};
