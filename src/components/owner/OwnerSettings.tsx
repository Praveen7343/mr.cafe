import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import {
  Save,
  Store,
  BellRing,
  QrCode,
  Clock,
  Check,
  Database,
  ExternalLink,
  Copy,
  RefreshCw,
  Server,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  getStoredSupabaseConfig,
  saveSupabaseConfig,
  testSupabaseConnection,
  isSupabaseConfigured,
  SUPABASE_SQL_SETUP_SCRIPT
} from '../../lib/supabase';

export const OwnerSettings: React.FC = () => {
  const { showToast, syncMenuToSupabaseAction } = useCafe();

  // Cafe Profile State
  const [cafeName, setCafeName] = useState('Mr. CAFE (Brew & Bite)');
  const [tagline, setTagline] = useState('Love At First Bite...!');
  const [upiId, setUpiId] = useState('mrcafe@upi');
  const [openingTime, setOpeningTime] = useState('08:00 AM');
  const [closingTime, setClosingTime] = useState('11:00 PM');
  const [tableCount, setTableCount] = useState('12');
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(false);

  // Supabase Configuration State
  const initialConfig = getStoredSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(initialConfig.url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(initialConfig.anonKey);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showSqlScript, setShowSqlScript] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Cafe settings saved successfully');
  };

  const handleSaveSupabaseConfig = () => {
    const success = saveSupabaseConfig(supabaseUrl, supabaseAnonKey);
    if (success) {
      showToast(supabaseUrl ? 'Supabase configuration saved!' : 'Cleared Supabase configuration');
      setTestResult(null);
    }
  };

  const handleTestSupabase = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection();
    setIsTesting(false);
    setTestResult(res);
  };

  const handleSyncMenu = async () => {
    setIsSyncing(true);
    await syncMenuToSupabaseAction();
    setIsSyncing(false);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP_SCRIPT);
    setCopiedSql(true);
    showToast('Copied Supabase SQL setup script to clipboard!');
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const isConfigured = isSupabaseConfigured();

  return (
    <div className="p-5 lg:p-7 space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#2B170B]">Cafe Settings</h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Configure cafe store profile, Supabase database integration, operating hours and payments
        </p>
      </div>

      {/* --- SUPABASE DATABASE INTEGRATION SECTION --- */}
      <div className="bg-white rounded-3xl p-6 border border-[#ECE2D8] shadow-2xs space-y-5 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Database className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Supabase Database Integration</h3>
              <p className="text-[11px] text-neutral-500">
                Connect your PostgreSQL database for live cross-device sync of menu & orders
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                isConfigured
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                  isConfigured ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'
                }`}
              />
              {isConfigured ? 'Supabase Active' : 'Local Storage Mode (Standby)'}
            </span>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-3.5">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-neutral-700">Supabase Project URL</label>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-700 hover:underline flex items-center space-x-1"
              >
                <span>Find in Supabase Dashboard → Settings → API</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full px-3 py-2 border border-neutral-300 rounded-xl font-mono text-xs focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Supabase Anon / Public API Key
            </label>
            <input
              type="password"
              value={supabaseAnonKey}
              onChange={(e) => setSupabaseAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3 py-2 border border-neutral-300 rounded-xl font-mono text-xs focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleSaveSupabaseConfig}
              className="px-4 py-2 bg-[#78350F] hover:bg-[#5C2707] text-white rounded-xl font-bold shadow-xs flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Credentials</span>
            </button>

            <button
              type="button"
              disabled={isTesting || !supabaseUrl}
              onClick={handleTestSupabase}
              className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50 text-neutral-800 rounded-xl font-semibold flex items-center space-x-1.5"
            >
              {isTesting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              )}
              <span>Test Connection</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowSqlScript(!showSqlScript)}
              className="px-3 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-xl font-semibold flex items-center space-x-1"
            >
              <Database className="w-3.5 h-3.5 text-neutral-500" />
              <span>{showSqlScript ? 'Hide SQL Script' : 'View SQL Schema'}</span>
            </button>

            <button
              type="button"
              disabled={isSyncing || !isConfigured}
              onClick={handleSyncMenu}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl font-bold shadow-xs flex items-center space-x-1.5"
              title="Push all 70+ items into Supabase menu_items table"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Push All Items to Supabase</span>
            </button>
          </div>
        </div>

        {/* Test Connection Output */}
        {testResult && (
          <div
            className={`p-3 rounded-xl border flex items-center space-x-2 text-xs ${
              testResult.success
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{testResult.message}</span>
          </div>
        )}

        {/* SQL Setup Drawer */}
        {showSqlScript && (
          <div className="bg-[#1E1E1E] text-neutral-200 p-4 rounded-2xl space-y-2 border border-neutral-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Supabase SQL Editor Script (Copy & Paste):
              </span>
              <button
                type="button"
                onClick={handleCopySql}
                className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1"
              >
                {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono overflow-x-auto p-2 bg-black/40 rounded-xl max-h-56 leading-relaxed select-all">
              {SUPABASE_SQL_SETUP_SCRIPT}
            </pre>
            <p className="text-[11px] text-neutral-400">
              💡 Open Supabase → SQL Editor → New query → Paste the above snippet & click Run.
            </p>
          </div>
        )}
      </div>

      {/* --- CAFE GENERAL SETTINGS --- */}
      <form onSubmit={handleSaveGeneralSettings} className="bg-white rounded-3xl p-6 border border-[#ECE2D8] shadow-2xs space-y-6 text-xs">
        {/* Brand identity */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 border-b pb-2 flex items-center space-x-2">
            <Store className="w-4 h-4 text-[#78350F]" />
            <span>Store Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Cafe Name</label>
              <input
                type="text"
                value={cafeName}
                onChange={(e) => setCafeName(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 border-b pb-2 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#78350F]" />
            <span>Hours & Capacity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Opening Time</label>
              <input
                type="text"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Closing Time</label>
              <input
                type="text"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Total Dine-In Tables</label>
              <input
                type="number"
                value={tableCount}
                onChange={(e) => setTableCount(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Payments */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 border-b pb-2 flex items-center space-x-2">
            <QrCode className="w-4 h-4 text-[#78350F]" />
            <span>Payment & UPI Gateway</span>
          </h3>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">UPI ID (VPA)</label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full sm:w-80 px-3 py-2 border border-neutral-300 rounded-xl font-mono"
            />
            <p className="text-[11px] text-neutral-400 mt-1">Used for customer UPI QR code payments</p>
          </div>
        </div>

        {/* Sound alerts */}
        <div className="space-y-3 pt-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={soundAlerts}
              onChange={(e) => setSoundAlerts(e.target.checked)}
              className="rounded text-amber-700"
            />
            <span className="font-semibold text-neutral-800">Play audio chime for incoming kitchen orders</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoAcceptOrders}
              onChange={(e) => setAutoAcceptOrders(e.target.checked)}
              className="rounded text-amber-700"
            />
            <span className="font-semibold text-neutral-800">Auto-accept confirmed online orders directly to kitchen</span>
          </label>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#78350F] hover:bg-[#5C2707] text-white rounded-xl font-bold shadow-xs flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
