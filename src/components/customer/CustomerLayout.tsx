import React from 'react';
import { useCafe } from '../../context/CafeContext';
import { CustomerHeader } from './CustomerHeader';
import { CustomerHome } from './CustomerHome';
import { CustomerMenu } from './CustomerMenu';
import { CustomerCart } from './CustomerCart';
import { CustomerOrderSuccess } from './CustomerOrderSuccess';
import { CustomerOrders } from './CustomerOrders';
import { CustomerProfile } from './CustomerProfile';
import { CustomerBottomNav } from './CustomerBottomNav';
import { Wifi, Battery, Signal } from 'lucide-react';

export const CustomerLayout: React.FC = () => {
  const { customerView, deviceMode } = useCafe();

  const renderScreen = () => {
    switch (customerView) {
      case 'home':
        return <CustomerHome />;
      case 'menu':
        return <CustomerMenu />;
      case 'cart':
        return <CustomerCart />;
      case 'order-success':
        return <CustomerOrderSuccess />;
      case 'orders':
        return <CustomerOrders />;
      case 'profile':
        return <CustomerProfile />;
      default:
        return <CustomerHome />;
    }
  };

  // If mobile mockup mode is chosen, display in an iPhone frame matching mockup
  if (deviceMode === 'mobile-mock') {
    return (
      <div className="min-h-[calc(100vh-42px)] bg-[#EDE4D8] py-8 px-4 flex justify-center items-start">
        <div className="w-full max-w-[400px] bg-[#FAF7F2] rounded-[48px] shadow-2xl border-[10px] border-[#291A10] overflow-hidden relative flex flex-col min-h-[820px]">
          {/* Simulated Mobile Status Bar (9:41, Wi-Fi, battery) matching mockup */}
          <div className="bg-[#FAF7F2] px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-bold text-neutral-800 select-none">
            <span>9:41</span>
            {/* Dynamic Island / Notch pill */}
            <div className="w-20 h-4 bg-neutral-900 rounded-full mx-auto" />
            <div className="flex items-center space-x-1.5 text-neutral-800">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Customer Header */}
          <CustomerHeader />

          {/* Main View Area */}
          <div className="flex-1 overflow-y-auto">
            {renderScreen()}
          </div>

          {/* Mobile Bottom Navigation */}
          <CustomerBottomNav />

          {/* Home indicator bar */}
          <div className="bg-[#FAF7F2] py-1 flex justify-center">
            <div className="w-32 h-1 bg-neutral-300 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // Standard responsive view
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <CustomerHeader />
      <main className="flex-1 max-w-4xl w-full mx-auto">
        {renderScreen()}
      </main>
      <CustomerBottomNav />
    </div>
  );
};
