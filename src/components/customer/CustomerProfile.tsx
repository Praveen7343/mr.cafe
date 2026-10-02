import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import {
  Star,
  Crown,
  Receipt,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Edit2,
  Gift,
  Check,
  Sparkles,
  X
} from 'lucide-react';

export const CustomerProfile: React.FC = () => {
  const {
    activeUser,
    updateUserProfile,
    redeemPoints,
    logout,
    setCustomerView,
    orders,
  } = useCafe();

  const [redeemModalOpen, setRedeemModalOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(activeUser.name);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      updateUserProfile({ name: nameInput.trim() });
      setIsEditingName(false);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-28 max-w-md mx-auto">
      {/* Top Header matching Mockup Screen 5 */}
      <div className="flex items-center justify-between pb-2 border-b border-[#EADBCE]">
        <h2 className="text-base font-bold text-[#2A170B]">Profile</h2>
        <div className="flex items-center space-x-1.5 bg-[#FFF8E7] text-[#92400E] border border-amber-300 px-2.5 py-1 rounded-full text-xs font-bold">
          <Star className="w-3 h-3 fill-current text-amber-950" />
          <span className="tabular-nums">{activeUser.loyaltyPoints}</span>
          <span className="text-[10px] text-amber-800">Points</span>
        </div>
      </div>

      {/* Profile Card matching mockup */}
      <div className="bg-white rounded-3xl p-5 border border-[#ECE2D8] shadow-2xs text-center relative overflow-hidden">
        <div className="relative inline-block mx-auto mb-3">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-amber-100 ring-4 ring-[#FAF5EE] shadow-md mx-auto">
            {activeUser.avatar ? (
              <img
                src={activeUser.avatar}
                alt={activeUser.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-xl font-bold text-amber-900">
                BP
              </span>
            )}
          </div>
          <button
            onClick={() => setIsEditingName(true)}
            className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#78350F] text-white flex items-center justify-center shadow hover:bg-[#5C2607] transition-transform active:scale-95"
            title="Edit Profile"
          >
            <Edit2 className="w-3 h-3" />
          </button>
        </div>

        {isEditingName ? (
          <div className="flex items-center justify-center space-x-2 mb-1">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="text-sm font-bold text-center border-b border-amber-600 focus:outline-none px-2 py-0.5"
            />
            <button
              onClick={handleSaveName}
              className="p-1 bg-amber-600 text-white rounded text-xs"
            >
              <Check className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <h3 className="text-base font-bold text-[#2A170B]">{activeUser.name}</h3>
        )}

        <p className="text-xs text-neutral-500 mb-2.5">{activeUser.email}</p>

        {/* Member Badge matching mockup */}
        <div className="inline-flex items-center space-x-1.5 bg-[#FFF3DC] border border-amber-300 text-amber-900 px-3 py-1 rounded-full text-xs font-bold shadow-2xs">
          <Crown className="w-3.5 h-3.5 text-amber-600" />
          <span>{activeUser.tier} Member</span>
        </div>
      </div>

      {/* Two Metric Stat Cards matching mockup */}
      <div className="grid grid-cols-2 gap-3">
        {/* Left card: Points */}
        <div
          onClick={() => setRedeemModalOpen(true)}
          className="bg-white rounded-2xl p-4 border border-[#ECE2D8] shadow-2xs flex items-center space-x-3 cursor-pointer hover:border-amber-400 transition-colors"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-amber-400 text-amber-600" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-[#2A170B] tabular-nums">
              {activeUser.loyaltyPoints}
            </div>
            <div className="text-[11px] text-neutral-500 font-medium">Points</div>
          </div>
        </div>

        {/* Right card: Level */}
        <div className="bg-white rounded-2xl p-4 border border-[#ECE2D8] shadow-2xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-800 flex items-center justify-center shrink-0">
            <Crown className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-[#2A170B]">
              Level {activeUser.tierLevel}
            </div>
            <div className="text-[11px] text-neutral-500 font-medium">{activeUser.tier}</div>
          </div>
        </div>
      </div>

      {/* Redeem Voucher Callout */}
      <button
        onClick={() => setRedeemModalOpen(true)}
        className="w-full bg-gradient-to-r from-[#78350F] to-[#A14E1B] text-white p-3.5 rounded-2xl flex items-center justify-between shadow-xs transition-transform active:scale-[0.99]"
      >
        <div className="flex items-center space-x-2.5 text-left">
          <Gift className="w-5 h-5 text-amber-300" />
          <div>
            <div className="text-xs font-bold">Redeem Loyalty Vouchers</div>
            <div className="text-[11px] text-amber-200/90">Use points for instant discounts</div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-amber-200" />
      </button>

      {/* Menu List Items matching mockup */}
      <div className="bg-white rounded-3xl border border-[#ECE2D8] shadow-2xs divide-y divide-[#F5EDE4] overflow-hidden">
        <button
          onClick={() => setCustomerView('orders')}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FAF7F2] transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#FAF5EE] text-[#78350F] flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-neutral-800">My Orders</span>
          </div>
          <div className="flex items-center space-x-1.5 text-neutral-400">
            <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
              {orders.length}
            </span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        <button
          onClick={() => setAddressModalOpen(true)}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FAF7F2] transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#FAF5EE] text-[#78350F] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-neutral-800">Address Book</span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </button>

        <button
          onClick={() => alert('Saved Payment Methods: UPI (GPay - default), ICICI Visa ending in 4022')}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FAF7F2] transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#FAF5EE] text-[#78350F] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-neutral-800">Payment Methods</span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </button>

        <button
          onClick={() => alert('Notifications enabled: Push alerts for order preparation & points')}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FAF7F2] transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#FAF5EE] text-[#78350F] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-neutral-800">Notifications</span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </button>

        <button
          onClick={() => alert('Brew & Bite Support:\nEmail: hello@brewandbite.com\nPhone: +91 80 4123 4567\nHours: 8:00 AM - 11:00 PM')}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FAF7F2] transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#FAF5EE] text-[#78350F] flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-neutral-800">Help & Support</span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </button>

        <button
          onClick={logout}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-red-50 text-red-600 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold">Logout</span>
          </div>
        </button>
      </div>

      {/* Redeem Points Modal */}
      {redeemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-[#ECE2D8]">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                <h3 className="text-sm font-bold text-neutral-900">Redeem Points</h3>
              </div>
              <button onClick={() => setRedeemModalOpen(false)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <div className="py-3 text-xs text-neutral-600">
              Current balance:{' '}
              <strong className="text-amber-800 font-bold">{activeUser.loyaltyPoints} points</strong>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl border border-amber-200 bg-amber-50/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-950">₹25 Discount Voucher</div>
                  <div className="text-[11px] text-neutral-500">Requires 250 points</div>
                </div>
                <button
                  onClick={() => {
                    if (redeemPoints(250)) setRedeemModalOpen(false);
                  }}
                  disabled={activeUser.loyaltyPoints < 250}
                  className="px-3 py-1.5 bg-[#78350F] disabled:opacity-40 text-white rounded-xl text-xs font-bold"
                >
                  Redeem
                </button>
              </div>

              <div className="p-3 rounded-2xl border border-amber-200 bg-amber-50/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-950">₹50 Discount Voucher</div>
                  <div className="text-[11px] text-neutral-500">Requires 500 points</div>
                </div>
                <button
                  onClick={() => {
                    if (redeemPoints(500)) setRedeemModalOpen(false);
                  }}
                  disabled={activeUser.loyaltyPoints < 500}
                  className="px-3 py-1.5 bg-[#78350F] disabled:opacity-40 text-white rounded-xl text-xs font-bold"
                >
                  Redeem
                </button>
              </div>

              <div className="p-3 rounded-2xl border border-amber-200 bg-amber-50/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-950">Free Artisanal Cappuccino</div>
                  <div className="text-[11px] text-neutral-500">Requires 1,000 points</div>
                </div>
                <button
                  onClick={() => {
                    if (redeemPoints(1000)) setRedeemModalOpen(false);
                  }}
                  disabled={activeUser.loyaltyPoints < 1000}
                  className="px-3 py-1.5 bg-[#78350F] disabled:opacity-40 text-white rounded-xl text-xs font-bold"
                >
                  Redeem
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Address Book Modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-[#ECE2D8]">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-[#78350F]" />
                <h3 className="text-sm font-bold text-neutral-900">Saved Addresses</h3>
              </div>
              <button onClick={() => setAddressModalOpen(false)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <div className="py-3 space-y-2 text-xs">
              {activeUser.addresses?.map((addr) => (
                <div key={addr.id} className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50">
                  <div className="font-bold text-neutral-800">{addr.label}</div>
                  <div className="text-neutral-600 mt-0.5">{addr.address}</div>
                </div>
              ))}
            </div>

            <div className="mt-2 pt-2 border-t border-neutral-100">
              <input
                type="text"
                placeholder="Add new delivery address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full text-xs p-2 border border-neutral-300 rounded-xl mb-2"
              />
              <button
                onClick={() => {
                  if (newAddress.trim()) {
                    updateUserProfile({
                      addresses: [
                        ...(activeUser.addresses || []),
                        {
                          id: `addr-${Date.now()}`,
                          label: 'Other',
                          address: newAddress.trim(),
                          isDefault: false,
                        },
                      ],
                    });
                    setNewAddress('');
                    setAddressModalOpen(false);
                  }
                }}
                className="w-full py-2 bg-[#78350F] text-white rounded-xl text-xs font-bold"
              >
                Save New Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
