import React from 'react';
import { useCafe } from '../../context/CafeContext';
import { Coffee, Search, SlidersHorizontal, Star } from 'lucide-react';

export const CustomerHeader: React.FC = () => {
  const {
    activeUser,
    searchQuery,
    setSearchQuery,
    customerView,
    setCustomerView,
  } = useCafe();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (customerView !== 'menu') {
      setCustomerView('menu');
    }
  };

  return (
    <div className="bg-[#FAF7F2] border-b border-[#EEDBCC] px-4 pt-4 pb-3 sticky top-10 z-30">
      {/* Top row: Brand & Profile/Points */}
      <div className="flex items-center justify-between mb-3">
        {/* Brand */}
        <div
          onClick={() => setCustomerView('home')}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#78350F] flex items-center justify-center text-amber-100 shadow-sm group-hover:bg-[#602A0C] transition-colors">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-base tracking-tight text-[#2B170B]">Brew & Bite</span>
            </div>
            <p className="text-[11px] text-[#8C6D53] font-medium leading-none">
              Good Food · Great Vibes
            </p>
          </div>
        </div>

        {/* Right side: Points badge and Profile Avatar */}
        <div className="flex items-center space-x-2">
          {/* Points Pill */}
          <button
            onClick={() => setCustomerView('profile')}
            className="flex items-center space-x-1.5 bg-[#FFF8E7] hover:bg-[#FEF3D6] text-[#92400E] border border-amber-300/80 px-2.5 py-1.5 rounded-full text-xs font-bold transition-colors shadow-2xs"
          >
            <div className="w-4 h-4 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center">
              <Star className="w-2.5 h-2.5 fill-current text-amber-950" />
            </div>
            <span className="tabular-nums">{activeUser.loyaltyPoints.toLocaleString()}</span>
            <span className="text-[10px] text-amber-800 font-semibold hidden sm:inline">Points</span>
          </button>

          {/* User Avatar */}
          <button
            onClick={() => setCustomerView('profile')}
            className="relative w-9 h-9 rounded-full ring-2 ring-[#78350F]/20 hover:ring-[#78350F] transition-all overflow-hidden bg-amber-100 flex items-center justify-center"
            title="View Profile"
          >
            {activeUser.avatar ? (
              <img
                src={activeUser.avatar}
                alt={activeUser.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="text-xs font-bold text-amber-900">
                {activeUser.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search Input Bar matching mockup */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search coffee, food, drinks..."
          className="w-full bg-white pl-10 pr-10 py-2.5 rounded-xl border border-[#E4D7C8] text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all shadow-2xs"
        />
        <button
          onClick={() => setCustomerView('menu')}
          className="absolute right-2.5 text-neutral-500 hover:text-neutral-800 p-1 rounded-md"
          title="Filter menu"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
