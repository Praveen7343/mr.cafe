import React from 'react';
import { useCafe } from '../../context/CafeContext';
import { FoodImage } from '../common/FoodImage';
import {
  Clock,
  CheckCircle2,
  ChefHat,
  PackageCheck,
  RefreshCw,
  ArrowRight,
  MapPin,
  UtensilsCrossed,
  Receipt
} from 'lucide-react';
import { OrderStatus } from '../../types/cafe';

export const CustomerOrders: React.FC = () => {
  const { orders, addToCart, setCustomerView } = useCafe();

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Preparing':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Ready':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Delivered':
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Preparing':
        return 1;
      case 'Ready':
        return 2;
      case 'Delivered':
      case 'Completed':
        return 3;
      default:
        return 0;
    }
  };

  const activeOrders = orders.filter(
    (o) => o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready'
  );
  const pastOrders = orders.filter(
    (o) => o.status === 'Completed' || o.status === 'Delivered' || o.status === 'Cancelled'
  );

  return (
    <div className="p-4 space-y-5 pb-24 max-w-2xl mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-[#EADBCE]">
        <div>
          <h2 className="text-base font-bold text-[#2A170B]">Track Orders</h2>
          <p className="text-xs text-neutral-500">Live order status and past invoices</p>
        </div>
        <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full">
          {orders.length} Total Orders
        </span>
      </div>

      {/* Active Orders Section */}
      {activeOrders.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping mr-2" />
            Live Orders ({activeOrders.length})
          </h3>

          {activeOrders.map((order) => {
            const currentStep = getStatusStepIndex(order.status);
            const steps = [
              { label: 'Received', icon: Clock },
              { label: 'Brewing / Kitchen', icon: ChefHat },
              { label: 'Ready', icon: PackageCheck },
              { label: 'Served', icon: CheckCircle2 },
            ];

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-4 border border-[#ECE2D8] shadow-sm space-y-3.5 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-[#2B170B]">
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

                  <span className="text-xs font-bold text-[#78350F] tabular-nums">
                    ₹{order.total}
                  </span>
                </div>

                {/* Progress bar tracker */}
                <div className="relative pt-2 pb-1">
                  <div className="flex items-center justify-between relative z-10">
                    {steps.map((st, idx) => {
                      const Icon = st.icon;
                      const isDone = idx <= currentStep;
                      const isCurrent = idx === currentStep;

                      return (
                        <div key={st.label} className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              isDone
                                ? 'bg-[#78350F] text-white shadow-xs'
                                : 'bg-[#F2ECE4] text-neutral-400'
                            } ${isCurrent ? 'ring-4 ring-amber-200' : ''}`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span
                            className={`text-[10px] mt-1 font-medium ${
                              isDone ? 'text-neutral-900 font-bold' : 'text-neutral-400'
                            }`}
                          >
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Connecting bar */}
                  <div className="absolute top-6 left-6 right-6 h-1 bg-[#F2ECE4] -z-0">
                    <div
                      className="h-full bg-[#78350F] transition-all duration-500"
                      style={{
                        width: `${(currentStep / (steps.length - 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Order Details items summary */}
                <div className="bg-[#FAF7F2] rounded-xl p-2.5 text-xs text-neutral-600 space-y-1">
                  <div className="flex justify-between items-center text-[11px] text-neutral-500 border-b border-[#EEDBCC] pb-1">
                    <span>
                      {order.orderType === 'dine-in' && `🍽️ Dine-in · ${order.tableNumber || 'Table 4'}`}
                      {order.orderType === 'takeaway' && '🛍️ Self Pickup Counter'}
                      {order.orderType === 'delivery' && `🛵 Delivery · ${order.deliveryAddress?.slice(0, 30)}...`}
                    </span>
                    <span>Placed at {order.timeFormatted}</span>
                  </div>

                  <div className="pt-1 space-y-1">
                    {order.items.map((oi, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span>
                          {oi.quantity}x {oi.item.name}
                        </span>
                        <span className="font-semibold text-neutral-800 tabular-nums">
                          ₹{oi.item.price * oi.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Past Orders History */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Past Orders
        </h3>

        {pastOrders.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-[#E2D5C7] p-4 text-xs text-neutral-500">
            No past orders recorded yet.
          </div>
        ) : (
          pastOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-3.5 border border-[#ECE2D8] shadow-2xs hover:border-[#D8C7B5] transition-colors space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-neutral-800">
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

                <span className="text-xs font-extrabold text-[#78350F] tabular-nums">
                  ₹{order.total}
                </span>
              </div>

              <div className="text-xs text-neutral-600">
                {order.items.map((oi) => `${oi.quantity}x ${oi.item.name}`).join(', ')}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#F2ECE4] text-[11px] text-neutral-400">
                <span>{order.timeFormatted} · Earned +{order.pointsEarned} pts</span>
                <button
                  onClick={() => {
                    order.items.forEach((oi) => addToCart(oi.item, oi.quantity));
                    setCustomerView('cart');
                  }}
                  className="flex items-center space-x-1 text-[#78350F] hover:text-[#522105] font-bold"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Re-order</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
