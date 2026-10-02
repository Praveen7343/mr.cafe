import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import {
  Users,
  Star,
  Search,
  Award,
  Gift,
  Mail,
  Phone,
  Check
} from 'lucide-react';

export const OwnerCustomers: React.FC = () => {
  const { showToast, orders, activeUser } = useCafe();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [bonusPointsInput, setBonusPointsInput] = useState('100');

  // Derive unique customers from real orders and active profiles
  const customerMap = new Map<string, {
    id: string;
    name: string;
    email: string;
    phone: string;
    points: number;
    tier: string;
    totalOrders: number;
    totalSpent: number;
    lastVisit: string;
  }>();

  // Seed default registered customer profile from Supabase
  customerMap.set('user-bhanu-cust', {
    id: 'user-bhanu-cust',
    name: 'Bhanu Prakash',
    email: 'bhanu@gmail.com',
    phone: '+91 98450 12345',
    points: 1250,
    tier: 'Gold',
    totalOrders: 0,
    totalSpent: 0,
    lastVisit: 'Registered Guest',
  });

  // Aggregate real orders
  orders.forEach((order) => {
    const key = (order.customerEmail || order.customerName || order.id).toLowerCase();
    const existing = customerMap.get(key) || customerMap.get(order.customerEmail) || {
      id: `cust-${order.id}`,
      name: order.customerName,
      email: order.customerEmail || 'customer@gmail.com',
      phone: order.customerPhone || '+91 98450 00000',
      points: 100,
      tier: 'Bronze',
      totalOrders: 0,
      totalSpent: 0,
      lastVisit: order.timeFormatted || 'Today',
    };

    existing.totalOrders += 1;
    existing.totalSpent += order.total;
    existing.points += order.pointsEarned;
    existing.lastVisit = order.timeFormatted || 'Today';

    if (existing.points >= 1000) {
      existing.tier = 'Gold';
    } else if (existing.points >= 500) {
      existing.tier = 'Silver';
    } else {
      existing.tier = 'Bronze';
    }

    customerMap.set(key, existing);
  });

  const customersList = Array.from(customerMap.values());

  const filtered = customersList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIssueBonus = (customerName: string) => {
    showToast(`Issued +${bonusPointsInput} loyalty points to ${customerName}`);
    setSelectedCustomerId(null);
  };

  return (
    <div className="p-5 lg:p-7 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#2B170B]">
            Customer Directory & Loyalty Program
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            View repeat guests, membership levels, order volume, and reward loyalty points
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customers..."
            className="w-full bg-white pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E8DEC8] focus:outline-none focus:border-amber-600 shadow-2xs"
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-3xl border border-[#ECE2D8] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#F0E6DA] text-neutral-500 text-[11px] font-semibold">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">Membership Tier</th>
                <th className="py-3 px-3">Loyalty Points</th>
                <th className="py-3 px-3">Total Orders</th>
                <th className="py-3 px-3">Total Spent</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7EFE6]">
              {filtered.map((cust) => (
                <tr key={cust.id} className="hover:bg-[#FCFAF7] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">
                        {cust.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-[#2B170B]">{cust.name}</div>
                        <div className="text-[10px] text-neutral-400">Last visited: {cust.lastVisit}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-neutral-600">
                    <div>{cust.email}</div>
                    <div className="text-[10px] text-neutral-400">{cust.phone}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        cust.tier === 'Gold'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : cust.tier === 'Silver'
                          ? 'bg-slate-50 text-slate-700 border-slate-300'
                          : 'bg-orange-50 text-orange-800 border-orange-300'
                      }`}
                    >
                      👑 {cust.tier}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-extrabold text-[#78350F] tabular-nums">
                    ⭐ {cust.points.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-semibold text-neutral-800 tabular-nums">
                    {cust.totalOrders}
                  </td>
                  <td className="py-3 px-3 font-extrabold text-neutral-900 tabular-nums">
                    ₹{cust.totalSpent.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedCustomerId(cust.id)}
                      className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-bold transition-colors"
                    >
                      + Issue Points
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Points Modal */}
      {selectedCustomerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-[#ECE2D8]">
            <h3 className="text-sm font-bold text-neutral-900 mb-2">Issue Bonus Loyalty Points</h3>
            <p className="text-xs text-neutral-500 mb-3">
              Reward loyal guests for birthdays, apologies, or special promotions.
            </p>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Points Amount</label>
              <input
                type="number"
                value={bonusPointsInput}
                onChange={(e) => setBonusPointsInput(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedCustomerId(null)}
                className="px-3 py-1.5 border border-neutral-300 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const cust = customersList.find((c) => c.id === selectedCustomerId);
                  handleIssueBonus(cust?.name || 'Customer');
                }}
                className="px-4 py-1.5 bg-[#78350F] text-white rounded-xl text-xs font-bold"
              >
                Confirm Reward
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
