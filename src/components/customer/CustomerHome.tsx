import React from 'react';
import { useCafe } from '../../context/CafeContext';
import { FoodImage } from '../common/FoodImage';
import { ArrowRight, Plus, Star, ChevronRight, Check } from 'lucide-react';
import { MenuCategory } from '../../types/cafe';

export const CustomerHome: React.FC = () => {
  const {
    menuItems,
    addToCart,
    setCustomerView,
    setSelectedCategory,
    activeUser,
    cart,
  } = useCafe();

  const popularItems = menuItems.filter((i) => i.isPopular && i.isActive);

  const categories = [
    { id: 'fried-chicken' as MenuCategory, label: 'Fried Chicken', icon: '🍗' },
    { id: 'burgers' as MenuCategory, label: 'Burgers', icon: '🍔' },
    { id: 'pizza' as MenuCategory, label: 'Pizza', icon: '🍕' },
    { id: 'sandwiches' as MenuCategory, label: 'Sandwiches', icon: '🥪' },
    { id: 'wraps' as MenuCategory, label: 'Wraps', icon: '🌯' },
    { id: 'momos' as MenuCategory, label: 'Momos', icon: '🥟' },
    { id: 'maggi' as MenuCategory, label: 'Maggi', icon: '🍜' },
    { id: 'sides' as MenuCategory, label: 'Sides & Dips', icon: '🍟' },
    { id: 'desserts' as MenuCategory, label: 'Desserts', icon: '🍫' },
    { id: 'coffee-drinks' as MenuCategory, label: 'Beverages', icon: '☕' },
  ];

  const handleCategoryClick = (cat: MenuCategory) => {
    setSelectedCategory(cat);
    setCustomerView('menu');
  };

  return (
    <div className="p-4 space-y-5 pb-24 max-w-4xl mx-auto">
      {/* Hero Banner matching mockup */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2F180B] via-[#4A2612] to-[#6E3B1C] text-white p-6 shadow-md border border-[#522E17]">
        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-[62%] sm:max-w-[68%]">
          <span className="text-[11px] font-semibold text-amber-300 tracking-wider uppercase block mb-1">
            Handcrafted With Passion
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1.5 leading-snug">
            Enjoy Your Favorite Coffee
          </h2>
          <p className="text-xs text-amber-100/80 mb-4 font-normal">
            Freshly brewed, always. Single origin beans and artisanal roasted blends.
          </p>

          <button
            onClick={() => {
              setSelectedCategory('all');
              setCustomerView('menu');
            }}
            className="inline-flex items-center space-x-1.5 bg-white text-[#78350F] hover:bg-amber-50 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-transform active:scale-95"
          >
            <span>Order Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hero Coffee Visual Illustration */}
        <div className="absolute right-2 -bottom-2 w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-300/30">
            <FoodImage type="cappuccino" alt="Freshly Brewed Coffee" />
          </div>
        </div>
      </div>

      {/* Popular Items Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-bold text-[#2A180D] tracking-tight">Popular Items</h3>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCustomerView('menu');
            }}
            className="text-xs font-semibold text-[#8C461C] hover:text-[#602E0E] transition-colors"
          >
            See All
          </button>
        </div>

        {/* Scrollable / Grid popular items cards */}
        <div className="grid grid-cols-3 gap-3">
          {popularItems.slice(0, 3).map((item) => {
            const inCartCount = cart.find((ci) => ci.item.id === item.id)?.quantity || 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-2.5 shadow-2xs border border-[#ECE2D8] flex flex-col justify-between hover:shadow-xs transition-shadow"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 bg-[#F5EDE4] relative">
                  <FoodImage type={item.image} alt={item.name} />
                  {inCartCount > 0 && (
                    <div className="absolute top-1.5 right-1.5 bg-amber-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                      {inCartCount}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#2B170B] truncate" title={item.name}>
                    {item.name}
                  </h4>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs font-bold text-[#78350F] tabular-nums">
                      ₹{item.price}
                    </span>

                    <button
                      onClick={() => addToCart(item, 1)}
                      className="w-6 h-6 rounded-full bg-[#78350F] hover:bg-[#5C2607] text-white flex items-center justify-center transition-transform active:scale-90 shadow-2xs"
                      title={`Add ${item.name} to cart`}
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Categories Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-bold text-[#2A180D] tracking-tight">Categories</h3>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCustomerView('menu');
            }}
            className="text-xs font-semibold text-[#8C461C] hover:text-[#602E0E] transition-colors"
          >
            See All
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2 text-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="flex flex-col items-center p-2 rounded-2xl bg-white hover:bg-amber-50/70 border border-[#EFE5DC] transition-all hover:scale-105 active:scale-95 shadow-2xs group"
            >
              <div className="w-11 h-11 rounded-full bg-[#FAF3EC] group-hover:bg-[#F3E5D4] flex items-center justify-center text-xl mb-1.5 shadow-inner">
                <span>{cat.icon}</span>
              </div>
              <span className="text-[11px] font-semibold text-[#4A2B18] truncate w-full">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Loyalty Points Banner matching mockup */}
      <button
        onClick={() => setCustomerView('profile')}
        className="w-full bg-[#FFF9ED] hover:bg-[#FEF4DC] border border-amber-300/80 rounded-2xl p-4 flex items-center justify-between transition-colors shadow-2xs text-left group"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs">
            <Star className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#78350F]">Loyalty Points</h4>
            <p className="text-[11px] text-[#92400E] font-medium">
              You have <span className="font-bold tabular-nums">{activeUser.loyaltyPoints.toLocaleString()} points</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-xs font-bold text-[#78350F] group-hover:translate-x-0.5 transition-transform">
          <span className="text-[11px]">Redeem</span>
          <ChevronRight className="w-4 h-4 text-amber-700" />
        </div>
      </button>
    </div>
  );
};
