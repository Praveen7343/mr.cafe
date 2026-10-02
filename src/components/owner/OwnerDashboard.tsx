import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import { FoodImage } from '../common/FoodImage';
import {
  ClipboardList,
  IndianRupee,
  Star,
  Users,
  TrendingUp,
  ArrowUpRight,
  Clock,
  ChevronDown,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Database,
  ShoppingBag
} from 'lucide-react';
import { OrderStatus } from '../../types/cafe';

export const OwnerDashboard: React.FC = () => {
  const {
    activeUser,
    orders,
    menuItems,
    updateOrderStatus,
    setOwnerView,
    isSupabaseConnected,
    reloadSupabaseData,
  } = useCafe();

  const [timeframe, setTimeframe] = useState<'This Week' | 'Today' | 'This Month'>('This Week');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Derive dynamic stats exclusively from real orders
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const loyaltyIssued = orders.reduce((sum, o) => sum + o.pointsEarned, 0);

  // Unique customers based on actual placed orders
  const uniqueCustomerSet = new Set(orders.map((o) => o.customerEmail || o.customerName));
  const activeCustomersCount = uniqueCustomerSet.size;

  // Real Sales Overview computed from orders grouped by day of week
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const daySalesData = daysOfWeek.map((day, idx) => {
    const dayOrders = orders.filter((o) => {
      const d = new Date(o.createdAt);
      const dayIndex = (d.getDay() + 6) % 7; // Monday = 0, Sunday = 6
      return dayIndex === idx;
    });
    const dayTotal = dayOrders.reduce((sum, o) => sum + o.total, 0);
    return {
      day,
      sales: dayTotal,
      orderCount: dayOrders.length,
    };
  });

  const maxDaySales = Math.max(1000, ...daySalesData.map((d) => d.sales));

  // Top ordered items from menu
  const sortedMenuItems = [...menuItems].sort((a, b) => b.ordersCount - a.ordersCount);
  const topItems = sortedMenuItems.slice(0, 5);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Preparing':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'Ready':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Delivered':
        return 'bg-teal-100 text-teal-900 border-teal-300';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-900 border-red-300';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const maxSales = 25000;

  return (
    <div className="p-5 lg:p-7 space-y-6 max-w-7xl mx-auto">
      {/* Dashboard Top Header matching mockup */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#2B170B]">Dashboard</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Welcome back, <span className="font-semibold text-neutral-800">{activeUser.name}!</span>
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-[#EADBCE] rounded-xl text-neutral-600 font-medium shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <span>Sep 27, 2025</span>
          </div>

          <div className="relative">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="appearance-none bg-white border border-[#EADBCE] rounded-xl px-3 py-1.5 pr-7 text-xs font-semibold text-neutral-800 focus:outline-none shadow-2xs cursor-pointer"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 4 KPI Metric Cards matching mockup */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Orders */}
        <div className="bg-white rounded-2xl p-4 border border-[#ECE2D8] shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-neutral-500">Total Orders</span>
              <div className="text-xl lg:text-2xl font-extrabold text-[#2B170B] mt-1 tabular-nums">
                {totalOrdersCount}
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 text-[#C25E23] flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-emerald-700 font-bold">
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
            <span>+12% from last week</span>
          </div>
        </div>

        {/* Card 2: Total Revenue */}
        <div className="bg-white rounded-2xl p-4 border border-[#ECE2D8] shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-neutral-500">Total Revenue</span>
              <div className="text-xl lg:text-2xl font-extrabold text-[#78350F] mt-1 tabular-nums">
                ₹{totalRevenue.toLocaleString()}
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-[#92400E] flex items-center justify-center font-bold text-base">
              ₹
            </div>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-emerald-700 font-bold">
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
            <span>+8% from last week</span>
          </div>
        </div>

        {/* Card 3: Loyalty Points Issued */}
        <div className="bg-white rounded-2xl p-4 border border-[#ECE2D8] shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-neutral-500">Loyalty Points Issued</span>
              <div className="text-xl lg:text-2xl font-extrabold text-[#2B170B] mt-1 tabular-nums">
                {loyaltyIssued.toLocaleString()}
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-700 flex items-center justify-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-emerald-700 font-bold">
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
            <span>+15% from last week</span>
          </div>
        </div>

        {/* Card 4: Active Customers */}
        <div className="bg-white rounded-2xl p-4 border border-[#ECE2D8] shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-neutral-500">Active Customers</span>
              <div className="text-xl lg:text-2xl font-extrabold text-[#2B170B] mt-1 tabular-nums">
                {activeCustomersCount}
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-neutral-500 font-medium">
            <span>{activeCustomersCount} ordered from cafe</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Sales Overview Chart (Left) & Top Ordered Items (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview Bar Chart matching mockup */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-[#ECE2D8] shadow-2xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-[#2B170B]">Sales Overview</h3>
              <p className="text-[11px] text-neutral-400">Live order revenue by day</p>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#78350F]" />
                <span className="text-neutral-600 font-medium">Daily Sales</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Canvas */}
          <div className="relative pt-6">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none text-[10px] text-neutral-400 font-mono">
              <div className="flex items-center justify-between border-b border-dashed border-neutral-100">
                <span>₹{maxDaySales}</span>
              </div>
              <div className="flex items-center justify-between border-b border-dashed border-neutral-100">
                <span>₹{Math.round(maxDaySales * 0.75)}</span>
              </div>
              <div className="flex items-center justify-between border-b border-dashed border-neutral-100">
                <span>₹{Math.round(maxDaySales * 0.5)}</span>
              </div>
              <div className="flex items-center justify-between border-b border-dashed border-neutral-100">
                <span>₹{Math.round(maxDaySales * 0.25)}</span>
              </div>
              <div className="flex items-center justify-between border-b border-neutral-200">
                <span>0</span>
              </div>
            </div>

            {/* Bars container */}
            <div className="h-48 pl-8 pr-2 flex items-end justify-between relative z-10">
              {daySalesData.map((item, index) => {
                const heightPercent = item.sales > 0 ? Math.max(10, Math.round((item.sales / maxDaySales) * 100)) : 4;

                return (
                  <div
                    key={item.day}
                    className="flex flex-col items-center flex-1 group cursor-pointer relative"
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {/* Tooltip on hover */}
                    {hoveredBar === index && (
                      <div className="absolute -top-12 z-30 bg-[#291A10] text-white px-2.5 py-1 rounded-md text-[10px] whitespace-nowrap shadow-lg">
                        <div className="font-bold text-amber-300">
                          {item.day}: ₹{item.sales.toLocaleString()}
                        </div>
                        <div className="text-neutral-300">
                          {item.orderCount} order{item.orderCount === 1 ? '' : 's'}
                        </div>
                      </div>
                    )}

                    <div className="flex items-end justify-center space-x-1 h-40 w-full">
                      <div
                        className={`w-5 sm:w-7 rounded-t-sm transition-all ${
                          item.sales > 0
                            ? 'bg-[#78350F] hover:bg-[#5C2707]'
                            : 'bg-[#EADBCE]/50'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    <span className="text-[11px] font-semibold text-neutral-500 mt-2">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Widget: Top Ordered Items matching mockup */}
        <div className="bg-white rounded-3xl p-5 border border-[#ECE2D8] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#F2ECE4]">
              <h3 className="text-sm font-bold text-[#2B170B]">Top Ordered Items</h3>
              <span className="text-[11px] font-semibold text-neutral-400">Orders</span>
            </div>

            <div className="space-y-3">
              {topItems.map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-[#F5EDE4] shadow-2xs">
                      <FoodImage type={item.image} alt={item.name} />
                    </div>
                    <span className="text-xs font-bold text-neutral-800 truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#78350F] tabular-nums">
                    {item.ordersCount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Loyalty Points summary card matching mockup */}
          <div className="mt-5 p-3.5 rounded-2xl bg-[#FFF9ED] border border-amber-200/90 flex flex-col">
            <div className="flex items-center space-x-2 mb-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-600" />
              <span className="text-xs font-bold text-amber-900">Loyalty Points</span>
            </div>
            <div className="text-lg font-extrabold text-[#78350F] tabular-nums">
              {loyaltyIssued.toLocaleString()} <span className="text-xs font-medium text-neutral-600">Points</span>
            </div>
            <button
              onClick={() => setOwnerView('customers')}
              className="mt-2.5 py-1.5 px-3 bg-[#FAF2E6] hover:bg-[#F2E5D3] text-[#78350F] border border-amber-300 rounded-xl text-xs font-bold transition-colors text-center"
            >
              Manage Points
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Table: Recent Orders matching mockup */}
      <div className="bg-white rounded-3xl p-5 border border-[#ECE2D8] shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#2B170B]">Recent Orders</h3>
            <p className="text-[11px] text-neutral-400">Live stream from Supabase database</p>
          </div>
          <button
            onClick={() => setOwnerView('orders')}
            className="text-xs font-bold text-[#78350F] hover:underline"
          >
            View All Orders →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#F0E6DA] text-neutral-400 text-[11px] font-semibold">
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Items</th>
                <th className="pb-3 font-semibold">Total</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Time</th>
                <th className="pb-3 font-semibold text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7EFE6]">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-neutral-500 text-xs">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <ShoppingBag className="w-8 h-8 text-neutral-300" />
                      <p className="font-semibold text-neutral-700">No customer orders yet</p>
                      <p className="text-[11px] text-neutral-400 max-w-sm">
                        Orders placed by customers in the storefront or inserted into your Supabase database will appear here in real-time.
                      </p>
                      <button
                        onClick={() => setOwnerView('settings')}
                        className="mt-2 inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#FAF2E6] hover:bg-[#F2E5D3] text-[#78350F] border border-amber-300 rounded-xl text-xs font-bold transition-colors"
                      >
                        <Database className="w-3.5 h-3.5" />
                        <span>Supabase Connection & SQL Setup</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3 font-mono font-bold text-neutral-800">
                    {order.id}
                  </td>
                  <td className="py-3 font-semibold text-neutral-800">
                    {order.customerName}
                  </td>
                  <td className="py-3 text-neutral-600 max-w-[200px] truncate" title={order.items.map((i) => `${i.quantity}x ${i.item.name}`).join(', ')}>
                    {order.items.map((i) => i.item.name).join(', ')}
                  </td>
                  <td className="py-3 font-extrabold text-[#78350F] tabular-nums">
                    ₹{order.total}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-neutral-500 tabular-nums">
                    {order.timeFormatted}
                  </td>
                  <td className="py-3 text-right">
                    {order.status === 'Pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Preparing')}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold"
                      >
                        Start Preparing
                      </button>
                    )}
                    {order.status === 'Preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Ready')}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold"
                      >
                        Mark Ready
                      </button>
                    )}
                    {order.status === 'Ready' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Completed')}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold"
                      >
                        Mark Served
                      </button>
                    )}
                    {(order.status === 'Completed' || order.status === 'Delivered') && (
                      <span className="text-[10px] text-neutral-400 font-medium">Done</span>
                    )}
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
