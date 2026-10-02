import React, { useState } from 'react';
import { useCafe, ADMIN_EMAIL } from '../../context/CafeContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { SupabaseModal } from '../common/SupabaseModal';
import { MrCafeLogo } from '../common/MrCafeLogo';
import {
  Coffee,
  User,
  ArrowRight,
  Lock,
  Mail,
  Phone,
  Database,
  Loader2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

export const IntroLoginPage: React.FC = () => {
  const {
    loginWithEmail,
    loginWithMobile,
    loginWithGoogle,
    isSupabaseConnected,
    showToast
  } = useCafe();

  // Mode: 'login' or 'signup'
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Method: 'email' or 'mobile'
  const [authMethod, setAuthMethod] = useState<'email' | 'mobile'>('email');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Loading States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Real Google Sign In via Supabase OAuth
  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    if (!isSupabaseConfigured()) {
      showToast('Please configure Supabase URL & Anon Key for Google OAuth');
      setIsSupabaseModalOpen(true);
      return;
    }

    setIsLoadingGoogle(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to authenticate with Google');
      showToast(`Google Auth failed: ${err.message || err}`);
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  // Handle Form Submission (Email or Mobile)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation for Signup
    if (authMode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters');
        return;
      }
      if (confirmPassword && password !== confirmPassword) {
        setErrorMessage('Passwords do not match');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (authMethod === 'email') {
        const cleanEmail = email.trim();
        if (!cleanEmail) {
          setErrorMessage('Please enter a valid email address');
          setIsSubmitting(false);
          return;
        }

        // Real Email Login/Signup
        loginWithEmail(cleanEmail, name.trim() || undefined);
      } else {
        // Mobile Number Login/Signup
        const cleanPhone = phone.trim();
        if (!cleanPhone || cleanPhone.replace(/[^0-9]/g, '').length < 10) {
          setErrorMessage('Please enter a valid 10-digit mobile number');
          setIsSubmitting(false);
          return;
        }

        loginWithMobile(cleanPhone, name.trim() || undefined);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-neutral-800 flex flex-col justify-between font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Clean Top Header matching Home Page Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-[#EEDBCC] bg-[#FAF7F2] max-w-5xl mx-auto w-full sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <MrCafeLogo className="w-11 h-11 shrink-0 drop-shadow-sm" />
          <div>
            <span className="font-extrabold text-lg tracking-tight text-[#2B170B] block leading-tight">
              Mr. CAFE
            </span>
            <span className="text-[11px] text-[#8C6D53] font-semibold leading-none block mt-0.5">
              Good Food &bull; Great Vibes
            </span>
          </div>
        </div>

        {/* Database & Auth status button */}
        <button
          onClick={() => setIsSupabaseModalOpen(true)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
            isSupabaseConnected
              ? 'bg-[#EBF5EE] text-[#1E5631] border-[#C3E4CD] hover:bg-[#E0EFE4]'
              : 'bg-[#FFF8E7] text-[#92400E] border-amber-300 hover:bg-[#FEF3D6]'
          }`}
          title="Supabase Database & Auth status"
        >
          <Database className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Supabase Auth</span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isSupabaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}
          />
        </button>
      </header>

      {/* Main Content - Centered Clean & Neat Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 w-full max-w-md mx-auto my-auto">
        <div className="w-full bg-white border border-[#EEDBCC] rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#78350F]/5 space-y-6">
          {/* Top Switcher: Login vs Sign Up Tabs */}
          <div className="flex p-1 bg-[#F5EDE4] rounded-2xl border border-[#E2D5C7] text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl transition-all text-center cursor-pointer ${
                authMode === 'login'
                  ? 'bg-[#78350F] text-white shadow-sm'
                  : 'text-[#8C6D53] hover:text-[#2B170B]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl transition-all text-center cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-[#78350F] text-white shadow-sm'
                  : 'text-[#8C6D53] hover:text-[#2B170B]'
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-[#2B170B] tracking-tight">
              {authMode === 'login' ? 'Welcome Back' : 'Create New Account'}
            </h2>
            <p className="text-xs text-[#8C6D53]">
              {authMode === 'login'
                ? 'Sign in with your Google account, email, or mobile'
                : 'Sign up with Google, email, or your mobile number'}
            </p>
          </div>

          {/* 1. GOOGLE AUTH (BY SUPABASE) */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoadingGoogle}
            className="w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-2xl bg-white hover:bg-neutral-50 disabled:opacity-75 text-neutral-800 font-bold text-xs transition-all border border-neutral-300 shadow-xs active:scale-98 cursor-pointer"
          >
            {isLoadingGoogle ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#78350F]" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span>
              {isLoadingGoogle
                ? 'Connecting with Google...'
                : `${authMode === 'login' ? 'Sign in' : 'Sign up'} with Google`}
            </span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#EEDBCC] w-full" />
            <span className="bg-white px-3 text-[10px] text-[#8C6D53] uppercase font-bold tracking-wider">
              or continue with
            </span>
            <div className="border-t border-[#EEDBCC] w-full" />
          </div>

          {/* 2. SUB-TABS: MAIL vs MOBILE NUMBER */}
          <div className="flex p-0.5 bg-[#FAF7F2] rounded-xl border border-[#EEDBCC] text-xs">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('email');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center space-x-1.5 font-semibold transition-all cursor-pointer ${
                authMethod === 'email'
                  ? 'bg-white text-[#78350F] font-bold shadow-2xs'
                  : 'text-[#8C6D53] hover:text-[#2B170B]'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-amber-700" />
              <span>Email Address</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('mobile');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center space-x-1.5 font-semibold transition-all cursor-pointer ${
                authMethod === 'mobile'
                  ? 'bg-white text-[#78350F] font-bold shadow-2xs'
                  : 'text-[#8C6D53] hover:text-[#2B170B]'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-amber-700" />
              <span>Mobile Number</span>
            </button>
          </div>

          {/* Error notice if any */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 3. FORM CONTAINER (EMAIL OR MOBILE) */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name field (Only shown on Sign Up) */}
            {authMode === 'signup' && (
              <div>
                <label className="block text-[11px] font-semibold text-[#2B170B] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-3 text-[#8C6D53]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#EEDBCC] rounded-xl text-xs text-[#2B170B] placeholder-neutral-400 focus:outline-none focus:border-[#78350F] focus:ring-2 focus:ring-[#78350F]/10 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            {authMethod === 'email' ? (
              <div>
                <label className="block text-[11px] font-semibold text-[#2B170B] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-[#8C6D53]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email (e.g. name@example.com)"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#EEDBCC] rounded-xl text-xs text-[#2B170B] placeholder-neutral-400 focus:outline-none focus:border-[#78350F] focus:ring-2 focus:ring-[#78350F]/10 transition-colors"
                  />
                </div>
              </div>
            ) : (
              /* Mobile Number Field */
              <div>
                <label className="block text-[11px] font-semibold text-[#2B170B] mb-1">
                  Mobile Number
                </label>
                <div className="relative flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-[#EEDBCC] bg-[#F5EDE4] text-[#78350F] text-xs font-semibold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className="w-full pl-3 pr-3 py-2.5 bg-[#FAF7F2] border border-[#EEDBCC] rounded-r-xl text-xs text-[#2B170B] placeholder-neutral-400 focus:outline-none focus:border-[#78350F] focus:ring-2 focus:ring-[#78350F]/10 font-mono transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-[11px] font-semibold text-[#2B170B] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-[#8C6D53]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={authMode === 'signup' ? 'Create a secure password (min 6 chars)' : 'Enter your password'}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#EEDBCC] rounded-xl text-xs text-[#2B170B] placeholder-neutral-400 focus:outline-none focus:border-[#78350F] focus:ring-2 focus:ring-[#78350F]/10 font-mono transition-colors"
                />
              </div>
            </div>

            {/* Confirm Password (Only shown on Sign Up) */}
            {authMode === 'signup' && (
              <div>
                <label className="block text-[11px] font-semibold text-[#2B170B] mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-[#8C6D53]" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#EEDBCC] rounded-xl text-xs text-[#2B170B] placeholder-neutral-400 focus:outline-none focus:border-[#78350F] focus:ring-2 focus:ring-[#78350F]/10 font-mono transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Role Notice */}
            <div className="p-2.5 rounded-xl bg-[#FFF8E7] border border-amber-300 text-[11px] text-[#92400E] flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
              <span>
                <strong>{ADMIN_EMAIL}</strong> accesses the Admin Owner Dashboard. All other accounts enter as Customer.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-[#78350F] hover:bg-[#602A0C] text-white font-bold text-xs transition-all shadow-md shadow-[#78350F]/20 flex items-center justify-center space-x-2 active:scale-98 cursor-pointer disabled:opacity-75 mt-2"
            >
              <span>
                {isSubmitting
                  ? 'Processing...'
                  : authMode === 'login'
                  ? 'Sign In to Account'
                  : 'Create Account'}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-200" />
            </button>
          </form>

          {/* Toggle between Login and Sign Up text link */}
          <div className="pt-2 text-center text-xs text-[#8C6D53] border-t border-[#EEDBCC]">
            {authMode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMessage(null);
                  }}
                  className="text-[#78350F] font-bold hover:underline cursor-pointer ml-1"
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMessage(null);
                  }}
                  className="text-[#78350F] font-bold hover:underline cursor-pointer ml-1"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </div>
      </main>

      {/* Minimal Footer matching Home Page */}
      <footer className="px-6 py-4 border-t border-[#EEDBCC] bg-[#FAF7F2] max-w-5xl mx-auto w-full text-center text-[11px] text-[#8C6D53]">
        Mr. CAFE &bull; Fresh Food &bull; Great Coffee
      </footer>

      {/* Supabase Connection Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </div>
  );
};
