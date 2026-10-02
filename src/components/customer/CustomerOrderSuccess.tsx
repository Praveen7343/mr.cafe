import React, { useEffect } from 'react';
import { useCafe } from '../../context/CafeContext';
import {
  Check,
  Star,
  Coffee,
  ArrowRight,
  Home,
  Clock,
  Sparkles
} from 'lucide-react';

export const CustomerOrderSuccess: React.FC = () => {
  const {
    lastPlacedOrder,
    orders,
    setCustomerView,
    activeUser,
  } = useCafe();

  // If no last placed order, pick the latest order
  const order = lastPlacedOrder || orders[0];

  return (
    <div className="p-4 space-y-6 pb-24 max-w-md mx-auto text-center animate-in fade-in zoom-in-95 duration-300">
      {/* Top Points & Avatar header element */}
      <div className="flex justify-end items-center space-x-2">
        <div className="flex items-center space-x-1.5 bg-[#FFF8E7] text-[#92400E] border border-amber-300 px-2.5 py-1 rounded-full text-xs font-bold">
          <Star className="w-3 h-3 fill-current text-amber-950" />
          <span className="tabular-nums">{activeUser.loyaltyPoints}</span>
        </div>
        <div className="w-8 h-8 rounded-full overflow-hidden bg-amber-100 ring-1 ring-amber-300">
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

      {/* Big Green Checkmark Icon matching mockup */}
      <div className="relative pt-2">
        {/* Floating confetti dots */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="absolute -top-1 left-16 w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce delay-100" />
          <span className="absolute top-2 right-14 w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200" />
          <span className="absolute -bottom-2 left-20 w-2 h-3 bg-red-400 rounded-full transform rotate-45 animate-pulse" />
          <span className="absolute bottom-1 right-20 w-3 h-1.5 bg-blue-400 rounded-full transform -rotate-12 animate-pulse" />
        </div>

        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-8 ring-emerald-100">
          <Check className="w-10 h-10 stroke-[3]" />
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div>
        <h2 className="text-xl font-extrabold text-[#241308] tracking-tight">
          Order Placed Successfully!
        </h2>
        <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
          Your order has been confirmed and is being prepared in the kitchen.
        </p>
      </div>

      {/* Order Summary Pill matching mockup */}
      <div className="bg-white rounded-2xl p-4 border border-[#ECE2D8] shadow-2xs flex items-center justify-between text-left">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100/60 border border-amber-200 flex items-center justify-center text-[#78350F]">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-neutral-400 uppercase font-semibold">Order ID</div>
            <div className="text-xs font-bold text-neutral-900 font-mono tracking-tight">
              {order ? order.id : '#CB2025092701'}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] text-neutral-400 uppercase font-semibold">Total Paid</div>
          <div className="text-sm font-extrabold text-[#78350F] tabular-nums">
            ₹{order ? order.total : 297}
          </div>
        </div>
      </div>

      {/* Loyalty Points Earned Card matching mockup */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50/70 border border-amber-200 rounded-2xl p-4 flex items-center space-x-3.5 text-left shadow-2xs">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-300 text-amber-950 flex items-center justify-center shadow-xs shrink-0">
          <Star className="w-6 h-6 fill-current" />
        </div>
        <div>
          <div className="text-xs font-bold text-amber-900 flex items-center">
            <span>You Earned Points!</span>
          </div>
          <div className="text-base font-extrabold text-amber-700 tracking-tight tabular-nums">
            +{order ? order.pointsEarned : 30} Points
          </div>
          <p className="text-[11px] text-amber-800/80">
            You will get {order ? order.pointsEarned : 30} loyalty points for this order.
          </p>
        </div>
      </div>

      {/* Action Buttons matching mockup */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={() => setCustomerView('orders')}
          className="w-full py-3.5 px-4 bg-[#78350F] hover:bg-[#5C2607] text-white rounded-2xl text-xs font-bold shadow-md transition-all active:scale-[0.99] flex items-center justify-center space-x-2"
        >
          <span>View Order Details</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => setCustomerView('home')}
          className="w-full py-3 px-4 bg-white hover:bg-neutral-50 text-[#78350F] border border-[#78350F]/30 rounded-2xl text-xs font-bold transition-all active:scale-[0.99] flex items-center justify-center space-x-2"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
};
