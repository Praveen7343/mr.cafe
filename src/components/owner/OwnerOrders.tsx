import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import { FoodImage } from '../common/FoodImage';
import {
  Clock,
  CheckCircle2,
  ChefHat,
  PackageCheck,
  Search,
  Filter,
  Check,
  XCircle,
  Phone,
  Mail,
  MapPin,
  UtensilsCrossed,
  ShoppingBag
} from 'lucide-react';
import { OrderStatus, Order } from '../../types/cafe';

export const OwnerOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useCafe();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const statusList: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'Pending', label: 'Pending', count: orders.filter((o) => o.status === 'Pending').length },
    { id: 'Preparing', label: 'Preparing', count: orders.filter((o) => o.status === 'Preparing').length },
    { id: 'Ready', label: 'Ready', count: orders.filter((o) => o.status === 'Ready').length },
    { id: 'Delivered', label: 'Delivered', count: orders.filter((o) => o.status === 'Delivered').length },
    { id: 'Completed', label: 'Completed', count: orders.filter((o) => o.status === 'Completed').length },
  ];

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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

  return (
    <div className="p-5 lg:p-7 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#2B170B]">
            Orders Tracker & Live Kitchen Display
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Monitor real-time customer orders, update kitchen preparation stages, and dispatch
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <div className="relative w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID or customer..."
              className="w-full bg-white pl-9 pr-3 py-2 rounded-xl text-xs border border-[#E8DEC8] focus:outline-none focus:border-amber-600 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        {statusList.map((st) => (
          <button
            key={st.id}
            onClick={() => setFilterStatus(st.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              filterStatus === st.id
                ? 'bg-[#78350F] text-white shadow-2xs font-bold'
                : 'bg-white text-neutral-600 hover:bg-[#FAF5EE] border border-[#EADBCE]'
            }`}
          >
            <span>{st.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                filterStatus === st.id ? 'bg-amber-500/40 text-white' : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              {st.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-[#E2D5C7] p-6 text-neutral-400 text-xs">
            No orders match the selected status filter.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-4 border border-[#ECE2D8] shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow space-y-3"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE4]">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-neutral-900">
                      {order.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-neutral-400">
                    {order.timeFormatted}
                  </span>
                </div>

                {/* Customer & Dining Mode */}
                <div className="mt-2.5 flex items-start justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-[#2B170B]">{order.customerName}</h4>
                    <div className="text-[11px] text-neutral-500 flex items-center space-x-1 mt-0.5">
                      <span>{order.customerPhone}</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-medium bg-[#FAF3EC] text-[#78350F] px-2 py-0.5 rounded-lg border border-[#EADBCE]">
                    {order.orderType === 'dine-in' && `🍽️ ${order.tableNumber || 'Table 4'}`}
                    {order.orderType === 'takeaway' && '🛍️ Takeaway'}
                    {order.orderType === 'delivery' && '🛵 Delivery'}
                  </span>
                </div>

                {/* Ordered Items List */}
                <div className="mt-3 bg-[#FAF7F2] rounded-xl p-2.5 space-y-1.5 text-xs text-neutral-700">
                  {order.items.map((oi, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="font-medium">
                        <strong className="text-neutral-900">{oi.quantity}x</strong> {oi.item.name}
                      </span>
                      <span className="font-semibold text-neutral-800 tabular-nums">
                        ₹{oi.item.price * oi.quantity}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-dashed border-[#EADBCE] pt-1.5 flex justify-between font-bold text-xs">
                    <span>Total Amount</span>
                    <span className="text-[#78350F] tabular-nums">₹{order.total}</span>
                  </div>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-2 border-t border-[#F2ECE4] flex items-center justify-between gap-2">
                {order.status === 'Pending' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'Preparing')}
                    className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1 shadow-2xs"
                  >
                    <ChefHat className="w-3.5 h-3.5" />
                    <span>Start Cooking</span>
                  </button>
                )}

                {order.status === 'Preparing' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'Ready')}
                    className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1 shadow-2xs"
                  >
                    <PackageCheck className="w-3.5 h-3.5" />
                    <span>Mark as Ready</span>
                  </button>
                )}

                {order.status === 'Ready' && (
                  <button
                    onClick={() =>
                      updateOrderStatus(
                        order.id,
                        order.orderType === 'delivery' ? 'Delivered' : 'Completed'
                      )
                    }
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1 shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Complete Order</span>
                  </button>
                )}

                {(order.status === 'Completed' || order.status === 'Delivered') && (
                  <div className="flex-1 py-1.5 px-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Order Fulfilled</span>
                  </div>
                )}

                {order.status !== 'Completed' && order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                  <button
                    onClick={() => {
                      if (confirm(`Cancel order ${order.id}?`)) {
                        updateOrderStatus(order.id, 'Cancelled');
                      }
                    }}
                    className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Cancel Order"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
