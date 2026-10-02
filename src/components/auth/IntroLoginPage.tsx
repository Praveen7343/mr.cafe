import React, { useState } from 'react';
import { useCafe, ADMIN_EMAIL } from '../../context/CafeContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { SupabaseModal } from '../common/SupabaseModal';
import {
  Coffee,
  ShieldCheck,
  User,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  UtensilsCrossed,
  Clock,
  Star,
  Database,
  Loader2
} from 'lucide-react';

export const IntroLoginPage: React.FC = () => {
  const { loginWithEmail, loginWithGoogle, isSupabaseConnected, showToast } = useCafe();

  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  const handleGoogleSignIn = async () => {
    if (!isSupabaseConfigured()) {
      showToast('Please connect your Supabase credentials to enable Google OAuth');
      setIsSupabaseModalOpen(true);
      return;
    }

    setIsLoadingGoogle(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      showToast(`Google Auth failed: ${err.message || err}`);
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setIsSubmitting(true);
    try {
      loginWithEmail(emailInput.trim(), nameInput.trim() || undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1D1109] text-white flex flex-col justify-between selection:bg-amber-800 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-amber-600/30 blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-orange-700/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-amber-900/30 blur-3xl" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-white/10 max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/50">
            <Coffee className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white block">
              Brew &amp; Bite
            </span>
            <span className="text-[10px] text-amber-300 font-semibold tracking-wider uppercase block">
              Good Food &bull; Great Vibes
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setIsSupabaseModalOpen(true)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isSupabaseConnected
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900'
                : 'bg-amber-950/80 text-amber-300 border-amber-500/40 hover:bg-amber-900'
            }`}
            title="Configure Supabase Database & OAuth"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Supabase DB &amp; Auth</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
          </button>
        </div>
      </header>

      {/* Main Hero & Login Split View */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-5 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Side: Brand Story & Highlights */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Freshly Brewed &bull; Made Fresh Daily</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Artisanal Cafe Bites, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400">
              Freshly Brewed Coffee
            </span>
          </h1>

          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed max-w-xl">
            Welcome to <strong>Brew &amp; Bite Cafe</strong>. Savor crispy hot wings, juicy gourmet burgers, piping hot pizzas, decadent brownies, and chilled espresso shakes. Sign in to place orders, track live kitchen prep, or manage store operations.
          </p>

          {/* Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-2">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-white">74+ Cafe Items</div>
              <div className="text-[11px] text-neutral-400">Wings, Burgers &amp; Pizza</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-2">
                <Clock className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-white">Live Tracking</div>
              <div className="text-[11px] text-neutral-400">Realtime Kitchen Updates</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs col-span-2 sm:col-span-1">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <div className="font-bold text-xs text-white">Loyalty Points</div>
              <div className="text-[11px] text-neutral-400">Earn rewards on every bite</div>
            </div>
          </div>

          {/* Role Access Information */}
          <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-600/30 text-xs space-y-1.5 max-w-xl">
            <div className="flex items-center space-x-2 font-bold text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Authentication Roles:</span>
            </div>
            <p className="text-neutral-300 text-[11px] leading-relaxed">
              &bull; <strong>Admin / Cafe Owner:</strong> Sign in with <strong className="text-amber-200">{ADMIN_EMAIL}</strong> to access the Owner Dashboard with live kitchen orders, menu editing, price controls, and sales charts.<br />
              &bull; <strong>Customer:</strong> Any other email address enters as a Customer to browse the menu, order, and earn loyalty rewards.
            </p>
          </div>
        </div>

        {/* Right Side: Login Box */}
        <div className="lg:col-span-5">
          <div className="bg-[#2A180E]/90 border border-amber-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-5">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-white tracking-tight">Sign In to Cafe</h2>
              <p className="text-xs text-neutral-400">
                Continue with Google or sign in with email
              </p>
            </div>

            {/* CONTINUE WITH GOOGLE (SUPABASE OAUTH) BUTTON */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoadingGoogle}
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-2xl bg-white hover:bg-neutral-100 disabled:opacity-75 text-neutral-800 font-bold text-xs transition-all shadow-md active:scale-98 cursor-pointer"
            >
              {isLoadingGoogle ? (
                <Loader2 className="w-4 h-4 animate-spin text-neutral-700" />
              ) : (
                /* Google multi-color SVG icon */
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
                {isLoadingGoogle ? 'Connecting with Google...' : 'Continue with Google (Supabase Auth)'}
              </span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#2A180E] px-3 text-[11px] text-neutral-400 uppercase font-semibold">
                or sign in with email
              </span>
              <div className="border-t border-white/10 w-full" />
            </div>

            {/* EMAIL & PASSWORD FORM */}
            <form onSubmit={handleEmailSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter email (e.g. bhanu934785@gmail.com)"
                    className="w-full pl-9 pr-3 py-2.5 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Full Name (Optional)
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Your name"
                    className="w-full pl-9 pr-3 py-2.5 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-3 py-2.5 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs transition-all shadow-md shadow-amber-950 flex items-center justify-center space-x-2 active:scale-98 cursor-pointer disabled:opacity-75"
              >
                <span>{isSubmitting ? 'Signing In...' : 'Sign In & Enter'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="pt-2 text-center text-[11px] text-neutral-400">
              Session is securely remembered upon sign-in.
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 border-t border-white/10 max-w-7xl mx-auto w-full text-center text-[11px] text-neutral-400">
        Brew &amp; Bite Cafe &bull; Live Supabase Database &bull; Realtime Kitchen Orders
      </footer>

      {/* Supabase Configuration Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </div>
  );
};
