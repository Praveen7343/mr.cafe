import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import { OwnerSidebar } from './OwnerSidebar';
import { OwnerHeader } from './OwnerHeader';
import { OwnerDashboard } from './OwnerDashboard';
import { OwnerOrders } from './OwnerOrders';
import { OwnerMenuManagement } from './OwnerMenuManagement';
import { OwnerCustomers } from './OwnerCustomers';
import { OwnerCoupons } from './OwnerCoupons';
import { OwnerSettings } from './OwnerSettings';

export const OwnerLayout: React.FC = () => {
  const { ownerView } = useCafe();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderOwnerScreen = () => {
    switch (ownerView) {
      case 'dashboard':
        return <OwnerDashboard />;
      case 'orders':
        return <OwnerOrders />;
      case 'menu':
        return <OwnerMenuManagement />;
      case 'customers':
        return <OwnerCustomers />;
      case 'coupons':
        return <OwnerCoupons />;
      case 'settings':
        return <OwnerSettings />;
      default:
        return <OwnerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <OwnerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <OwnerHeader onToggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {renderOwnerScreen()}
        </main>
      </div>
    </div>
  );
};
