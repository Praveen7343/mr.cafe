import React, { useState } from 'react';
import { useCafe, ADMIN_EMAIL } from '../../context/CafeContext';
import { Coffee, ShieldCheck, User, X, Check, Sparkles, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'customer' | 'owner';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultRole = 'customer' }) => {
  const { loginWithEmail, loginAsCustomerDemo, loginAsOwnerDemo } = useCafe();
  const [roleTab, setRoleTab] = useState<'customer' | 'owner'>(defaultRole);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    loginWithEmail(email.trim(), name.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#EADBCE]">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-[#78350F] via-[#92400E] to-[#B45309] text-white p-6 pb-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center space-x-2.5 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 backdrop-blur-xs flex items-center justify-center border border-amber-300/30">
              <Coffee className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Brew & Bite</h2>
              <p className="text-xs text-amber-200/90 font-medium">Good Food • Great Vibes</p>
            </div>
          </div>
          <p className="text-xs text-white/80 mt-1">
            Sign in to earn loyalty rewards, order freshly brewed drinks, or manage your cafe.
          </p>
        </div>

        {/* Role Tab Selector */}
        <div className="flex p-1.5 bg-[#F5EDE4] mx-6 -mt-3 rounded-xl shadow-sm border border-[#E2D5C7] relative z-10">
          <button
            type="button"
            onClick={() => setRoleTab('customer')}
            className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              roleTab === 'customer'
                ? 'bg-white text-[#78350F] shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <User className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
            Customer Portal
          </button>
          <button
            type="button"
            onClick={() => setRoleTab('owner')}
            className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              roleTab === 'owner'
                ? 'bg-white text-[#78350F] shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
            Owner / Staff
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 pt-5">
          {/* 1-Click Quick Demo Login Button */}
          <div className="mb-5 bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-600" /> Quick Demo Sign-In
              </span>
              <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-sm">1-Click</span>
            </div>
            
            {roleTab === 'customer' ? (
              <button
                type="button"
                onClick={() => {
                  loginAsCustomerDemo();
                  onClose();
                }}
                className="w-full mt-1.5 py-2.5 px-4 bg-[#78350F] hover:bg-[#602A0C] text-white rounded-xl text-xs font-medium flex items-center justify-between transition-colors shadow-xs"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-amber-400 text-neutral-900 flex items-center justify-center text-xs font-bold">
                    BP
                  </div>
                  <span className="text-left font-medium">Bhanu Prakash (Gold Member, 1,250 Pts)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-200" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  loginAsOwnerDemo();
                  onClose();
                }}
                className="w-full mt-1.5 py-2.5 px-4 bg-[#291A10] hover:bg-[#1A1009] text-white rounded-xl text-xs font-medium flex items-center justify-between transition-colors shadow-xs"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                    ⚡
                  </div>
                  <span className="text-left font-medium">Bhanu Prakash (Admin - {ADMIN_EMAIL})</span>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-200" />
              </button>
            )}
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-neutral-200"></div>
            <span className="flex-shrink mx-3 text-xs text-neutral-400 font-medium">or continue with credentials</span>
            <div className="flex-grow border-t border-neutral-200"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 mt-2">
            {isSignUp && (
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required={isSignUp}
                  placeholder={roleTab === 'customer' ? 'e.g. Bhanu Prakash' : 'e.g. Cafe Manager'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                {roleTab === 'customer' ? 'Customer Email' : 'Owner / Staff Email'}
              </label>
              <input
                type="email"
                required
                placeholder={roleTab === 'customer' ? 'bhanu@gmail.com' : 'manager@brewandbite.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
                />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-neutral-700">Password</label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => alert('Demo password reminder: Any password works for testing!')}
                    className="text-[11px] text-amber-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#78350F] hover:bg-[#602A0C] text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all mt-4"
            >
              {isSignUp
                ? `Create ${roleTab === 'customer' ? 'Customer' : 'Owner'} Account`
                : `Sign In to ${roleTab === 'customer' ? 'Brew & Bite' : 'Manager Dashboard'}`}
            </button>
          </form>

          {/* Toggle between Login and Sign Up */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-neutral-600 hover:text-amber-800"
            >
              {isSignUp ? (
                <>Already have an account? <span className="font-semibold text-amber-700">Sign In</span></>
              ) : (
                <>New to Brew & Bite? <span className="font-semibold text-amber-700">Create an account (+100 Pts)</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
