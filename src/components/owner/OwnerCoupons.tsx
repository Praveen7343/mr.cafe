import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import { Tag, Plus, Check, Percent, Sparkles, Trash2, Calendar } from 'lucide-react';
import { Coupon } from '../../types/cafe';
import { createCouponInSupabase } from '../../lib/supabase';

export const OwnerCoupons: React.FC = () => {
  const { coupons, showToast } = useCafe();
  const [couponsList, setCouponsList] = useState<Coupon[]>(coupons);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [percent, setPercent] = useState('10');
  const [minOrder, setMinOrder] = useState('200');
  const [description, setDescription] = useState('');

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const newCoupon: Coupon = {
      id: `c-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discountPercent: parseInt(percent) || 10,
      minOrder: parseInt(minOrder) || 0,
      description: description.trim() || `${percent}% off on orders above ₹${minOrder}`,
      isActive: true,
    };

    setCouponsList([newCoupon, ...couponsList]);
    await createCouponInSupabase(newCoupon);
    setIsModalOpen(false);
    showToast(`Created coupon ${newCoupon.code} in database`);
  };

  const toggleCoupon = (id: string) => {
    setCouponsList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  return (
    <div className="p-5 lg:p-7 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#2B170B]">
            Offers & Promo Coupons
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure discounts, promotional voucher codes, and special seasonal deals
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#78350F] hover:bg-[#5C2707] text-white rounded-xl text-xs font-bold shadow-xs transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {couponsList.map((c) => (
          <div
            key={c.id}
            className={`bg-white rounded-2xl p-4 border shadow-2xs flex flex-col justify-between space-y-3 ${
              c.isActive ? 'border-amber-200' : 'border-neutral-200 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="font-mono text-sm font-extrabold uppercase text-[#78350F] tracking-wider bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                  {c.code}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-500'
                  }`}
                >
                  {c.isActive ? 'Active' : 'Paused'}
                </span>
              </div>

              <div className="mt-2.5">
                <div className="text-base font-extrabold text-[#2B170B]">
                  {c.discountPercent ? `${c.discountPercent}% OFF` : `₹${c.discountAmount} OFF`}
                </div>
                <p className="text-xs text-neutral-500 mt-1">{c.description}</p>
                <div className="text-[11px] text-neutral-400 mt-2 font-medium">
                  Min spend: ₹{c.minOrder}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
              <button
                onClick={() => toggleCoupon(c.id)}
                className="text-xs text-[#78350F] font-bold hover:underline"
              >
                {c.isActive ? 'Pause Coupon' : 'Enable Coupon'}
              </button>

              <button
                onClick={() => setCouponsList((prev) => prev.filter((item) => item.id !== c.id))}
                className="text-neutral-400 hover:text-red-600 p-1"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-[#ECE2D8]">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">Create Promo Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Coupon Code (e.g. MONSOON20)</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full uppercase font-mono px-3 py-2 border rounded-xl"
                  placeholder="CODE"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Discount %</label>
                  <input
                    type="number"
                    value={percent}
                    onChange={(e) => setPercent(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 10% off for weekend brunch"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#78350F] text-white rounded-xl font-bold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
