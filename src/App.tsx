import React from 'react';
import { CafeProvider, useCafe } from './context/CafeContext';
import { RoleSwitcher } from './components/common/RoleSwitcher';
import { CustomerLayout } from './components/customer/CustomerLayout';
import { OwnerLayout } from './components/owner/OwnerLayout';
import { IntroLoginPage } from './components/auth/IntroLoginPage';

function MainApp() {
  const { activeRole, isAuthenticated } = useCafe();

  // If user is not logged in, show the Intro Login Page
  if (!isAuthenticated) {
    return <IntroLoginPage />;
  }

  // If already logged in, enter directly into the app without asking for login again!
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-neutral-800 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Universal Mode & Role Switcher */}
      <RoleSwitcher />

      {/* Screen container */}
      <div className="flex-1">
        {activeRole === 'customer' ? <CustomerLayout /> : <OwnerLayout />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <CafeProvider>
      <MainApp />
    </CafeProvider>
  );
}
