import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import {
  Database,
  X,
  Copy,
  Check,
  Server,
  Key,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Code
} from 'lucide-react';
import {
  getStoredSupabaseConfig,
  saveSupabaseConfig,
  testSupabaseConnection,
  isSupabaseConfigured,
  SUPABASE_SQL_SETUP_SCRIPT,
  SUPABASE_FIX_PERMISSIONS_SQL
} from '../../lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const { showToast, reloadSupabaseData, syncMenuToSupabaseAction } = useCafe();

  const initialConfig = getStoredSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(initialConfig.url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(initialConfig.anonKey);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedFixSql, setCopiedFixSql] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'sql' | 'fix' | 'credentials'>('fix');

  if (!isOpen) return null;

  const handleSaveConfig = () => {
    const success = saveSupabaseConfig(supabaseUrl, supabaseAnonKey);
    if (success) {
      showToast(supabaseUrl ? 'Supabase credentials saved successfully!' : 'Cleared Supabase configuration');
      setTestResult(null);
      reloadSupabaseData();
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection();
    setIsTesting(false);
    setTestResult(res);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP_SCRIPT);
    setCopiedSql(true);
    showToast('Copied full Supabase SQL code to clipboard!');
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleCopyFixSql = () => {
    navigator.clipboard.writeText(SUPABASE_FIX_PERMISSIONS_SQL);
    setCopiedFixSql(true);
    showToast('Copied Permission Fix SQL (GRANT & RLS) to clipboard!');
    setTimeout(() => setCopiedFixSql(false), 2500);
  };

  const handleSyncToDb = async () => {
    setIsSyncing(true);
    await syncMenuToSupabaseAction();
    setIsSyncing(false);
  };

  const isConnected = isSupabaseConfigured();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-[#ECE2D8] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#291A10] text-[#F3EBE1] px-5 py-4 flex items-center justify-between border-b border-[#3E291C]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">Supabase Database & SQL Code</h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isConnected
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {isConnected ? 'Connected' : 'Credentials Needed'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Live database for Menu items, Orders, Coupons, and Customer Profiles
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center px-5 pt-3 border-b border-neutral-100 bg-[#FAF7F2] space-x-2 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('fix')}
            className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 border-b-2 font-bold transition-all whitespace-nowrap ${
              activeTab === 'fix'
                ? 'border-amber-600 text-amber-900 bg-amber-50/60'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Fix Permissions (Error 42501 Fix)</span>
            <span className="bg-amber-200/80 text-amber-900 text-[9px] px-1.5 py-0.5 rounded-full font-extrabold">
              Quick Fix
            </span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 border-b-2 font-bold transition-all whitespace-nowrap ${
              activeTab === 'sql'
                ? 'border-[#78350F] text-[#78350F] bg-amber-50/60'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Complete SQL Script (74 Items)</span>
          </button>

          <button
            onClick={() => setActiveTab('credentials')}
            className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 border-b-2 font-bold transition-all whitespace-nowrap ${
              activeTab === 'credentials'
                ? 'border-[#78350F] text-[#78350F] bg-amber-50/60'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>API Credentials & Test</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {activeTab === 'fix' ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-amber-50 rounded-2xl border border-amber-300 shadow-2xs">
                <div className="text-neutral-700">
                  <div className="font-bold text-amber-950 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>Resolves Error 42501: "permission denied for table menu_items"</span>
                  </div>
                  <p className="text-[11px] text-amber-800 mt-1">
                    In Supabase, public anonymous web apps require PostgreSQL table privileges (<code>GRANT ALL</code>) plus RLS policies.
                    Copy and run this quick SQL in your <strong>Supabase Dashboard &rarr; SQL Editor &rarr; Run</strong>.
                  </p>
                </div>

                <button
                  onClick={handleCopyFixSql}
                  className="shrink-0 flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold shadow-xs transition-transform active:scale-95"
                >
                  {copiedFixSql ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedFixSql ? 'Copied to Clipboard!' : 'Copy Permission Fix SQL'}</span>
                </button>
              </div>

              {/* Code Box for Fix */}
              <div className="relative rounded-2xl border border-neutral-300 bg-neutral-900 text-neutral-100 overflow-hidden font-mono text-[11px]">
                <div className="bg-neutral-800 px-3.5 py-2 flex items-center justify-between border-b border-neutral-700 text-neutral-300 text-[10px]">
                  <span>fix_supabase_permissions_42501.sql</span>
                  <button
                    onClick={handleCopyFixSql}
                    className="flex items-center space-x-1 text-amber-300 hover:text-amber-200"
                  >
                    {copiedFixSql ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedFixSql ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="p-4 max-h-80 overflow-y-auto overflow-x-auto text-[11px] leading-relaxed selection:bg-amber-800">
                  {SUPABASE_FIX_PERMISSIONS_SQL}
                </pre>
              </div>
            </div>
          ) : activeTab === 'sql' ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-200">
                <div className="text-neutral-700">
                  <div className="font-bold text-amber-950">How to use this SQL Code:</div>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    1. Open your <strong>Supabase Dashboard</strong> &rarr; Click <strong>SQL Editor</strong> &rarr; <strong>New Query</strong>.<br />
                    2. Paste the SQL script below and click <strong>Run</strong>.<br />
                    3. This creates all 4 tables (<code>menu_items</code>, <code>orders</code>, <code>coupons</code>, <code>profiles</code>), enables RLS policies, Realtime, and seeds all 74 cafe menu items!
                  </p>
                </div>

                <button
                  onClick={handleCopySql}
                  className="shrink-0 flex items-center justify-center space-x-1.5 px-4 py-2 bg-[#78350F] hover:bg-[#5C2707] text-white rounded-xl font-bold shadow-xs transition-transform active:scale-95"
                >
                  {copiedSql ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy Entire SQL Script'}</span>
                </button>
              </div>

              {/* Code Box */}
              <div className="relative rounded-2xl border border-neutral-300 bg-neutral-900 text-neutral-100 overflow-hidden font-mono text-[11px]">
                <div className="bg-neutral-800 px-3.5 py-2 flex items-center justify-between border-b border-neutral-700 text-neutral-300 text-[10px]">
                  <span>supabase_schema_and_seed.sql</span>
                  <button
                    onClick={handleCopySql}
                    className="flex items-center space-x-1 text-amber-300 hover:text-amber-200"
                  >
                    {copiedSql ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSql ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="p-4 max-h-80 overflow-y-auto overflow-x-auto text-[11px] leading-relaxed selection:bg-amber-800">
                  {SUPABASE_SQL_SETUP_SCRIPT}
                </pre>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
                <p className="text-neutral-600 leading-relaxed">
                  Enter your Supabase Project credentials to connect the website directly to your live database.
                  You can find these in your Supabase project under <strong>Project Settings &rarr; API</strong>.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Supabase Project URL:
                  </label>
                  <div className="relative">
                    <Server className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
                    <input
                      type="text"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      placeholder="https://xyzcompany.supabase.co"
                      className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:border-amber-600 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Supabase Anon (Public) Key:
                  </label>
                  <div className="relative">
                    <Key className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
                    <input
                      type="password"
                      value={supabaseAnonKey}
                      onChange={(e) => setSupabaseAnonKey(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:border-amber-600 bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={handleSaveConfig}
                    className="px-4 py-2 bg-[#78350F] hover:bg-[#5C2707] text-white rounded-xl font-bold transition-all shadow-xs"
                  >
                    Save Credentials
                  </button>

                  <button
                    onClick={handleTestConnection}
                    disabled={isTesting || !supabaseUrl}
                    className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl font-semibold transition-colors disabled:opacity-50"
                  >
                    {isTesting ? 'Testing...' : 'Test Connection'}
                  </button>

                  <button
                    onClick={handleSyncToDb}
                    disabled={isSyncing || !isConnected}
                    className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center space-x-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : '1-Click Seed Menu Items to Database'}</span>
                  </button>
                </div>

                {testResult && (
                  <div
                    className={`p-3 rounded-2xl border flex items-start space-x-2 ${
                      testResult.success
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-red-50 border-red-200 text-red-900'
                    }`}
                  >
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold">{testResult.success ? 'Success' : 'Connection Issue'}</div>
                      <p className="text-[11px] mt-0.5">{testResult.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FAF7F2] px-5 py-3 border-t border-[#ECE2D8] flex items-center justify-between text-neutral-500 text-[11px]">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Row Level Security (RLS) policies configured for open client operations</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold rounded-xl text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
