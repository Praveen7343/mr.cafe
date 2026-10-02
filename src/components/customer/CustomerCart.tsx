import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import { FoodImage } from '../common/FoodImage';
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  Tag,
  Star,
  CheckCircle,
  CreditCard,
  QrCode,
  Banknote,
  MapPin,
  UtensilsCrossed,
  ShoppingBag,
  Sparkles,
  X
} from 'lucide-react';
import { OrderType } from '../../types/cafe';

export const CustomerCart: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    placeOrder,
    setCustomerView,
    activeUser,
  } = useCafe();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [tableNumber, setTableNumber] = useState('Table 4');
  const [deliveryAddress, setDeliveryAddress] = useState(
    activeUser.addresses?.[0]?.address || 'Flat 402, Green Glen Layout, Indiranagar, Bengaluru'
  );
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Cash'>('UPI');
  const [orderNotes, setOrderNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApplyCoupon = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError(null);
      setCouponInput('');
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      placeOrder(orderType, {
        tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
        paymentMethod,
        notes: orderNotes,
      });
      setIsProcessing(false);
    }, 700);
  };

  if (cart.length === 0) {
    return (
      <div className="p-4 max-w-lg mx-auto text-center py-16 space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#FAF3EC] border border-[#E8DEC8] flex items-center justify-center text-3xl">
          🛒
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#2A180D]">Your Cart is Empty</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
            Looks like you haven't added any fresh brews or artisanal snacks yet.
          </p>
        </div>
        <button
          onClick={() => setCustomerView('menu')}
          className="px-6 py-2.5 bg-[#78350F] hover:bg-[#5C2607] text-white rounded-xl text-xs font-semibold shadow-xs transition-transform active:scale-95"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-28 max-w-xl mx-auto">
      {/* Top Header matching Mockup Screen 3 */}
      <div className="flex items-center justify-between pb-2 border-b border-[#EADBCE]">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCustomerView('menu')}
            className="p-1.5 rounded-xl hover:bg-neutral-100 text-neutral-700 transition-colors"
            title="Back to Menu"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold text-[#29170C]">Your Cart</h2>
          <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
            {cart.reduce((sum, i) => sum + i.quantity, 0)} items
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 bg-[#FFF8E7] text-[#92400E] border border-amber-300 px-2 py-1 rounded-full text-xs font-bold">
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
      </div>

      {/* Cart Items List matching mockup */}
      <div className="space-y-3">
        {cart.map((cartItem) => (
          <div
            key={cartItem.item.id}
            className="bg-white rounded-2xl p-3 shadow-2xs border border-[#ECE2D8] flex items-center justify-between"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#F5EDE4] shadow-2xs">
                <FoodImage type={cartItem.item.image} alt={cartItem.item.name} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#2A170B] truncate">
                  {cartItem.item.name}
                </h4>
                <div className="text-xs font-bold text-[#78350F] mt-0.5 tabular-nums">
                  ₹{cartItem.item.price}
                </div>
              </div>
            </div>

            {/* Stepper controls matching mockup [- 1 +] */}
            <div className="flex items-center space-x-2.5 bg-[#FAF7F2] border border-[#E4D7C8] rounded-xl px-2 py-1">
              <button
                onClick={() => updateCartQuantity(cartItem.item.id, -1)}
                className="w-5 h-5 flex items-center justify-center text-neutral-600 hover:text-black rounded"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-neutral-800 w-4 text-center tabular-nums">
                {cartItem.quantity}
              </span>
              <button
                onClick={() => updateCartQuantity(cartItem.item.id, 1)}
                className="w-5 h-5 flex items-center justify-center text-neutral-600 hover:text-black rounded"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dining Mode Selector */}
      <div className="bg-white rounded-2xl p-3.5 border border-[#ECE2D8] shadow-2xs space-y-2.5">
        <label className="text-xs font-bold text-[#3B2211] block">Dining Preference</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setOrderType('dine-in')}
            className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all ${
              orderType === 'dine-in'
                ? 'bg-[#78350F] text-white shadow-xs'
                : 'bg-[#FAF7F2] text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Dine-In</span>
          </button>

          <button
            type="button"
            onClick={() => setOrderType('takeaway')}
            className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all ${
              orderType === 'takeaway'
                ? 'bg-[#78350F] text-white shadow-xs'
                : 'bg-[#FAF7F2] text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Takeaway</span>
          </button>

          <button
            type="button"
            onClick={() => setOrderType('delivery')}
            className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all ${
              orderType === 'delivery'
                ? 'bg-[#78350F] text-white shadow-xs'
                : 'bg-[#FAF7F2] text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Delivery</span>
          </button>
        </div>

        {orderType === 'dine-in' && (
          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="text-neutral-500 font-medium">Select Table:</span>
            <select
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="bg-[#FAF7F2] border border-[#E2D5C7] rounded-lg px-2.5 py-1 text-xs font-bold text-neutral-800"
            >
              <option value="Table 1">Table 1 (Window)</option>
              <option value="Table 2">Table 2 (Corner)</option>
              <option value="Table 3">Table 3 (Patio)</option>
              <option value="Table 4">Table 4 (Center Lounge)</option>
              <option value="Table 5">Table 5 (Bar Stool)</option>
            </select>
          </div>
        )}

        {orderType === 'delivery' && (
          <div className="pt-2 text-xs">
            <span className="text-neutral-500 font-medium block mb-1">Delivery Address:</span>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E2D5C7] rounded-lg px-2.5 py-1.5 text-xs text-neutral-800"
              placeholder="Enter full street address"
            />
          </div>
        )}
      </div>

      {/* Apply Coupon Input matching mockup */}
      <div className="bg-white rounded-2xl p-3.5 border border-[#ECE2D8] shadow-2xs space-y-2">
        <form onSubmit={handleApplyCoupon} className="flex space-x-2">
          <div className="relative flex-1">
            <div className="absolute left-3 top-2.5 text-neutral-400">
              <Tag className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={couponInput}
              onChange={(e) => {
                setCouponInput(e.target.value);
                setCouponError(null);
              }}
              placeholder="Apply Coupon"
              className="w-full bg-[#FAF7F2] pl-8 pr-3 py-2 text-xs rounded-xl border border-[#E4D7C8] uppercase font-semibold text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-amber-600"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#78350F] hover:bg-[#5C2607] text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            Apply
          </button>
        </form>

        {couponError && (
          <p className="text-[11px] text-red-600 font-medium px-1">{couponError}</p>
        )}

        {/* Active coupon status */}
        {activeCoupon ? (
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-xs text-emerald-800">
            <div className="flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong className="uppercase font-bold">{activeCoupon.code}</strong> applied ({activeCoupon.description})
              </span>
            </div>
            <button
              onClick={removeCoupon}
              className="text-neutral-400 hover:text-neutral-700 p-0.5"
              title="Remove coupon"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-[11px] text-neutral-500 pt-1">
            <span>Try code:</span>
            <button
              type="button"
              onClick={() => {
                setCouponInput('BREW10');
                applyCoupon('BREW10');
              }}
              className="font-bold text-amber-700 underline"
            >
              BREW10
            </button>
            <span>(10% off)</span>
          </div>
        )}
      </div>

      {/* Payment Method Selector */}
      <div className="bg-white rounded-2xl p-3.5 border border-[#ECE2D8] shadow-2xs space-y-2">
        <label className="text-xs font-bold text-[#3B2211] block">Payment Method</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setPaymentMethod('UPI')}
            className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 border transition-all ${
              paymentMethod === 'UPI'
                ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-2xs'
                : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-amber-700" />
            <span>UPI / GPay</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('Card')}
            className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 border transition-all ${
              paymentMethod === 'Card'
                ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-2xs'
                : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-amber-700" />
            <span>Card</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('Cash')}
            className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 border transition-all ${
              paymentMethod === 'Cash'
                ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-2xs'
                : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <Banknote className="w-3.5 h-3.5 text-amber-700" />
            <span>Cash</span>
          </button>
        </div>
      </div>

      {/* Order Summary card matching mockup */}
      <div className="bg-white rounded-2xl p-4 border border-[#ECE2D8] shadow-2xs space-y-2.5">
        <h3 className="text-xs font-bold text-[#2E180C] uppercase tracking-wider">
          Order Summary
        </h3>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between text-neutral-600">
            <span>Subtotal</span>
            <span className="font-bold text-neutral-900 tabular-nums">₹{cartSubtotal}</span>
          </div>

          {cartDiscount > 0 && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Discount ({activeCoupon?.discountPercent ? `${activeCoupon.discountPercent}%` : 'Coupon'})</span>
              <span className="tabular-nums">-₹{cartDiscount}</span>
            </div>
          )}

          <div className="flex justify-between text-neutral-600">
            <span>Delivery / Service Fee</span>
            <span className="font-bold text-neutral-900 tabular-nums">₹0</span>
          </div>

          <div className="border-t border-dashed border-[#E0D3C4] pt-2 flex justify-between text-sm font-extrabold text-[#2A170B]">
            <span>Total</span>
            <span className="text-[#78350F] tabular-nums">₹{cartTotal}</span>
          </div>
        </div>
      </div>

      {/* Sticky Proceed to Pay button matching mockup */}
      <div className="pt-2">
        <button
          onClick={handleCheckout}
          disabled={isProcessing}
          className="w-full py-3.5 px-6 bg-[#78350F] hover:bg-[#5C2607] disabled:opacity-60 text-white rounded-2xl text-sm font-bold shadow-md transition-all active:scale-[0.99] flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing Payment...</span>
            </div>
          ) : (
            <span>Proceed to Pay ₹{cartTotal}</span>
          )}
        </button>

        <p className="text-[11px] text-center text-neutral-400 mt-2">
          You will earn ~{Math.max(30, Math.round(cartSubtotal * 0.1))} loyalty points with this order!
        </p>
      </div>
    </div>
  );
};
