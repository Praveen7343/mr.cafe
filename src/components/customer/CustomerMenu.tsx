import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import { FoodImage } from '../common/FoodImage';
import { Plus, Check, Search, Sparkles, Filter } from 'lucide-react';
import { MenuCategory } from '../../types/cafe';

export const CustomerMenu: React.FC = () => {
  const {
    menuItems,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    addToCart,
    cart,
  } = useCafe();

  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  const categories: { id: MenuCategory; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'fried-chicken', label: 'Fried Chicken' },
    { id: 'burgers', label: 'Burgers' },
    { id: 'pizza', label: 'Pizza' },
    { id: 'sandwiches', label: 'Sandwiches' },
    { id: 'wraps', label: 'Wraps' },
    { id: 'momos', label: 'Momos' },
    { id: 'maggi', label: 'Maggi' },
    { id: 'sides', label: 'Sides & Dips' },
    { id: 'desserts', label: 'Desserts' },
    { id: 'coffee-drinks', label: 'Beverages' },
  ];

  const filteredItems = menuItems.filter((item) => {
    if (!item.isActive) return false;
    const matchesCategory =
      selectedCategory === 'all' ? true : item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDietary =
      dietaryFilter === 'all' ? true : item.dietary === dietaryFilter;

    return matchesCategory && matchesSearch && matchesDietary;
  });

  return (
    <div className="p-4 space-y-4 pb-24 max-w-4xl mx-auto">
      {/* Category Pills Bar matching mockup */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              selectedCategory === cat.id
                ? 'bg-[#78350F] text-white shadow-xs'
                : 'bg-white hover:bg-neutral-100 text-[#543621] border border-[#E8DDCF]'
            }`}
          >
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Dietary filter toggle pills: All, Veg, Non-Veg */}
      <div className="flex items-center justify-between text-xs text-neutral-500 px-1 pt-1">
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setDietaryFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
              dietaryFilter === 'all'
                ? 'bg-[#29170C] text-white'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setDietaryFilter('veg')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition-colors ${
              dietaryFilter === 'veg'
                ? 'bg-emerald-700 text-white'
                : 'bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Veg Only</span>
          </button>
          <button
            onClick={() => setDietaryFilter('non-veg')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition-colors ${
              dietaryFilter === 'non-veg'
                ? 'bg-red-700 text-white'
                : 'bg-white text-red-800 border border-red-300 hover:bg-red-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            <span>Non-Veg</span>
          </button>
        </div>

        <div>
          Showing <span className="font-semibold text-neutral-800">{filteredItems.length}</span> items
        </div>
      </div>

      {/* Menu Items List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#E2D5C7] p-6">
            <p className="text-sm font-semibold text-neutral-600">No items match your criteria</p>
            <p className="text-xs text-neutral-400 mt-1">Try another category or clear your filters</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setDietaryFilter('all');
              }}
              className="mt-3 px-3.5 py-1.5 bg-[#78350F] text-white text-xs rounded-xl font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const inCartItem = cart.find((ci) => ci.item.id === item.id);
            const inCartQuantity = inCartItem?.quantity || 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3 shadow-2xs border border-[#ECE2D8] flex items-center justify-between hover:border-[#D6C2AF] transition-all group"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-center space-x-3.5 flex-1 min-w-0 pr-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-[#F5EDE4] relative shadow-2xs">
                    <FoodImage type={item.image} alt={item.name} />
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-tight text-center px-1">
                        Sold Out
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5 mb-0.5">
                      {item.dietary && (
                        <span
                          className={`w-2.5 h-2.5 rounded-full inline-block shrink-0 ${
                            item.dietary === 'veg' ? 'bg-emerald-600' : 'bg-red-600'
                          }`}
                          title={item.dietary === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                        />
                      )}
                      <h4 className="text-sm font-bold text-[#2A170B] truncate group-hover:text-[#78350F] transition-colors">
                        {item.name}
                      </h4>
                      {item.variant && (
                        <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 font-semibold px-1.5 py-0.2 rounded-md shrink-0">
                          {item.variant}
                        </span>
                      )}
                      {item.isPopular && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.2 rounded-md hidden sm:inline-block shrink-0">
                          Bestseller
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-neutral-500 line-clamp-1 mb-1.5">
                      {item.description}
                    </p>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-extrabold text-[#78350F] tabular-nums">
                        ₹{item.price}
                      </span>
                      {item.prepTime && (
                        <span className="text-[10px] text-neutral-400">· {item.prepTime}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Add to cart button */}
                <div className="shrink-0 flex items-center space-x-2">
                  {inCartQuantity > 0 ? (
                    <div className="flex items-center space-x-1.5 bg-amber-50 border border-amber-300 rounded-full px-2 py-1">
                      <span className="text-xs font-bold text-amber-900 tabular-nums">
                        {inCartQuantity} in cart
                      </span>
                      <button
                        onClick={() => addToCart(item, 1)}
                        disabled={!item.inStock}
                        className="w-6 h-6 rounded-full bg-[#78350F] text-white flex items-center justify-center hover:bg-[#5C2607] transition-all"
                        title="Add another"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item, 1)}
                      disabled={!item.inStock}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-2xs ${
                        item.inStock
                          ? 'bg-[#78350F] hover:bg-[#5C2607] text-white active:scale-95'
                          : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      }`}
                      title={item.inStock ? `Add ${item.name}` : 'Item is sold out'}
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
