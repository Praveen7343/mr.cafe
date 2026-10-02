import React from 'react';

interface FoodImageProps {
  type: string;
  className?: string;
  alt?: string;
}

export const FoodImage: React.FC<FoodImageProps> = ({ type, className = 'w-full h-full', alt }) => {
  // Check if type is an external URL
  if (type && (type.startsWith('http://') || type.startsWith('https://') || type.startsWith('data:'))) {
    return (
      <img
        src={type}
        alt={alt || 'Cafe item'}
        referrerPolicy="no-referrer"
        className={`object-cover ${className}`}
        onError={(e) => {
          (e.currentTarget as HTMLElement).style.display = 'none';
        }}
      />
    );
  }

  const normalized = (type || '').toLowerCase();

  // FRIED CHICKEN
  if (normalized.includes('wings') || normalized.includes('lollipop') || normalized.includes('drumstick')) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-[#7C2D12] via-[#9A3412] to-[#431407] flex items-center justify-center ${className}`}>
        <div className="relative w-[70%] h-[70%] flex items-center justify-center">
          {/* Bone handle */}
          <div className="absolute -left-1 bottom-3 w-7 h-2.5 bg-[#FEF3C7] rounded-l-full border border-amber-300 transform -rotate-30" />
          {/* Crispy golden fried meat bulb */}
          <div className="w-12 h-12 bg-gradient-to-tr from-[#B45309] via-[#D97706] to-[#F59E0B] rounded-full shadow-lg border border-amber-600 flex items-center justify-center relative overflow-hidden">
            {/* Crisp flakes texture */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#78350F_2px,transparent_2px)] [background-size:6px_6px]" />
            <div className="w-4 h-4 bg-red-600/30 rounded-full blur-xs" />
          </div>
          <span className="absolute -top-1 -right-1 text-xs">🔥</span>
        </div>
      </div>
    );
  }

  if (normalized.includes('fried') || normalized.includes('strips') || normalized.includes('popcorn') || normalized.includes('chicken-pop')) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-[#9A3412] via-[#B45309] to-[#451A03] flex items-center justify-center ${className}`}>
        {/* Bucket or Basket */}
        <div className="relative w-[65%] h-[75%] flex flex-col items-center justify-end">
          {/* Crunchy Fried Clusters */}
          <div className="relative w-full h-[55%] flex justify-center items-end -mb-2 z-10">
            <div className="w-6 h-6 bg-gradient-to-b from-[#FBBF24] to-[#B45309] rounded-xl transform -rotate-12 shadow-sm border border-amber-400" />
            <div className="w-8 h-8 bg-gradient-to-b from-[#F59E0B] to-[#92400E] rounded-xl transform rotate-6 -mx-1 shadow-md border border-amber-400" />
            <div className="w-7 h-7 bg-gradient-to-b from-[#FBBF24] to-[#B45309] rounded-xl transform rotate-45 shadow-sm border border-amber-400" />
          </div>
          {/* Bucket */}
          <div className="w-full h-[50%] bg-gradient-to-b from-[#DC2626] to-[#991B1B] rounded-b-2xl rounded-t-sm shadow-xl border-t border-amber-300 flex items-center justify-center text-white">
            <span className="text-[9px] font-black tracking-widest text-amber-200">CRISPY</span>
          </div>
        </div>
      </div>
    );
  }

  // PIZZA
  if (normalized.includes('pizza')) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-[#78350F] via-[#92400E] to-[#451A03] flex items-center justify-center ${className}`}>
        {/* Round Golden Pizza Pan */}
        <div className="relative w-[78%] h-[78%] rounded-full bg-gradient-to-tr from-[#D97706] to-[#F59E0B] border-4 border-[#92400E] shadow-xl flex items-center justify-center overflow-hidden p-1">
          {/* Melted Cheese Surface */}
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#FEF08A] to-[#FDE047] relative flex items-center justify-center">
            {/* Pepperoni / Chicken / Paneer / Olive Toppings */}
            <div className="absolute top-2 left-3 w-3 h-3 rounded-full bg-red-600 shadow-xs border border-red-700" />
            <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-red-600 shadow-xs border border-red-700" />
            <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-sm bg-green-700 shadow-xs" />
            <div className="absolute bottom-2 left-4 w-2.5 h-2.5 rounded-sm bg-amber-800 shadow-xs" />
            <div className="absolute w-3.5 h-3.5 rounded-full bg-red-600 shadow-xs border border-red-700" />
            {/* Basil herbs */}
            <div className="w-1.5 h-1 bg-green-800 rounded-full transform rotate-45" />
          </div>
        </div>
      </div>
    );
  }

  // MOMOS
  if (normalized.includes('momo') || normalized.includes('dimsum')) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-[#573016] to-[#2B1508] flex items-center justify-center ${className}`}>
        {/* Bamboo steamer basket outline */}
        <div className="relative w-[76%] h-[76%] rounded-full border-2 border-amber-300/40 bg-[#FAF5EE]/95 shadow-inner flex items-center justify-center p-2">
          {/* Steamed Momo Pleated Dumplings */}
          <div className="relative flex items-center justify-center">
            <div className="w-6 h-6 rounded-t-full rounded-b-lg bg-gradient-to-b from-white to-[#F3E8D6] shadow border border-amber-200/80 transform -translate-x-2 -rotate-12 flex justify-center">
              <div className="w-1 h-2 bg-amber-400/40 rounded-full" />
            </div>
            <div className="w-7 h-7 rounded-t-full rounded-b-lg bg-gradient-to-b from-white to-[#F3E8D6] shadow-md border border-amber-200/80 z-10 flex justify-center">
              <div className="w-1 h-2 bg-amber-400/40 rounded-full" />
            </div>
            <div className="w-6 h-6 rounded-t-full rounded-b-lg bg-gradient-to-b from-white to-[#F3E8D6] shadow border border-amber-200/80 transform translate-x-2 rotate-12 flex justify-center">
              <div className="w-1 h-2 bg-amber-400/40 rounded-full" />
            </div>
          </div>
          {/* Red Spicy Chutney Cup */}
          <div className="absolute bottom-1 w-4 h-4 rounded-full bg-red-600 border border-white shadow-xs" />
        </div>
      </div>
    );
  }

  // MAGGI NOODLES
  if (normalized.includes('maggi') || normalized.includes('noodle')) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-[#78350F] via-[#92400E] to-[#451A03] flex items-center justify-center ${className}`}>
        {/* Bowl */}
        <div className="relative w-[75%] h-[68%] flex flex-col items-center justify-end">
          {/* Yellow Maggi swirls */}
          <div className="w-[88%] h-[50%] bg-[#F59E0B] rounded-t-2xl shadow-inner border border-amber-400 flex flex-wrap items-center justify-center p-1 overflow-hidden relative">
            <div className="w-full h-1 bg-[#D97706] rounded-full mb-1" />
            <div className="w-full h-1 bg-[#FBBF24] rounded-full mb-1" />
            <div className="w-2 h-2 rounded-full bg-green-600 absolute top-1 right-2" />
            <div className="w-2 h-2 rounded-full bg-red-600 absolute top-2 left-3" />
          </div>
          {/* Ceramic Bowl */}
          <div className="w-full h-[50%] bg-gradient-to-b from-[#FFFDF9] to-[#E5D7C5] rounded-b-3xl shadow-lg border border-[#D1BFA9] flex items-center justify-center">
            <div className="w-12 h-1 bg-amber-900/20 rounded-full" />
          </div>
          {/* Fork */}
          <div className="absolute -top-3 right-2 w-1.5 h-8 bg-neutral-300 transform rotate-12 rounded-full" />
        </div>
      </div>
    );
  }

  // BROWNIE & SIZZLER DESSERT
  if (normalized.includes('brownie') || normalized.includes('lava') || normalized.includes('dessert')) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-[#451A03] via-[#2A1202] to-[#120701] flex items-center justify-center ${className}`}>
        <div className="relative w-[70%] h-[70%] flex flex-col items-center justify-end">
          {/* Vanilla Ice cream scoop on top */}
          <div className="w-7 h-7 rounded-full bg-[#FFFDF0] shadow-md border border-amber-100 -mb-2 z-10 flex items-center justify-center relative">
            {/* Chocolate drizzle */}
            <div className="w-full h-1 bg-[#451A03] rounded-full transform -rotate-12" />
          </div>
          {/* Rich Dark Brownie Block */}
          <div className="w-[82%] h-[42%] bg-gradient-to-b from-[#3B1E08] to-[#1C0D03] rounded-md shadow-lg border border-[#5C3212] flex items-center justify-center relative">
            {/* Walnut speckles */}
            <div className="w-1.5 h-1 bg-amber-200 rounded-full absolute top-1 left-2" />
            <div className="w-1.5 h-1 bg-amber-200 rounded-full absolute top-2 right-2" />
          </div>
          {/* Sizzling cast iron plate base */}
          <div className="w-[96%] h-[18%] bg-[#262626] rounded-full shadow-inner border border-neutral-600 mt-1" />
        </div>
      </div>
    );
  }

  // WRAPS
  if (normalized.includes('wrap') || normalized.includes('roll')) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-[#78350F] via-[#5C2B0B] to-[#3B1804] flex items-center justify-center ${className}`}>
        {/* Diagonal Tortilla Roll */}
        <div className="relative w-[65%] h-[70%] flex items-center justify-center">
          <div className="w-12 h-16 bg-[#FDE68A] rounded-2xl transform rotate-25 shadow-lg border-2 border-[#D97706] flex flex-col justify-between p-1.5 overflow-hidden">
            {/* Filling bursting out top */}
            <div className="flex items-center space-x-1">
              <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
              <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            </div>
            {/* Paper wrap bottom */}
            <div className="w-[120%] -ml-1 h-6 bg-red-600 rounded-b-lg border-t border-white" />
          </div>
        </div>
      </div>
    );
  }

  // SANDWICH
  if (normalized.includes('sandwich')) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-[#6E4020] to-[#3B1F0A] flex items-center justify-center ${className}`}>
        <div className="relative w-[70%] h-[60%] flex flex-col justify-center items-center">
          <div className="w-full h-[25%] bg-[#D4904A] rounded-t-lg relative shadow">
            {/* Grill marks */}
            <div className="absolute inset-0 flex justify-around py-1">
              <div className="w-0.5 h-full bg-[#7C4015] transform rotate-12" />
              <div className="w-0.5 h-full bg-[#7C4015] transform rotate-12" />
              <div className="w-0.5 h-full bg-[#7C4015] transform rotate-12" />
            </div>
          </div>
          <div className="w-[96%] h-[35%] bg-[#FAF5EE] border-y-2 border-[#16A34A] flex items-center justify-around px-1 z-10 shadow-xs">
            <div className="w-3 h-3 bg-amber-400 rounded-xs" />
            <div className="w-3 h-3 bg-red-400 rounded-xs" />
          </div>
          <div className="w-full h-[25%] bg-[#C47E35] rounded-b-lg shadow-md" />
        </div>
      </div>
    );
  }

  // BURGER
  if (normalized.includes('burger')) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-[#5E381E] to-[#3B1F0C] flex items-center justify-center ${className}`}>
        <div className="relative w-[70%] h-[65%] flex flex-col items-center justify-center">
          {/* Top Bun with sesame */}
          <div className="w-full h-[38%] bg-[#D98A3C] rounded-t-full relative shadow-sm border-b-2 border-[#BA6E24] flex justify-center">
            <div className="absolute top-2 left-3 w-1 h-0.5 bg-amber-100 rounded-full" />
            <div className="absolute top-1.5 left-7 w-1 h-0.5 bg-amber-100 rounded-full" />
            <div className="absolute top-2 right-4 w-1 h-0.5 bg-amber-100 rounded-full" />
          </div>
          {/* Lettuce frill */}
          <div className="w-[104%] h-[12%] bg-[#65A30D] rounded-sm -my-0.5 z-10 shadow-xs" />
          {/* Tomato slice */}
          <div className="w-[96%] h-[10%] bg-[#DC2626] rounded-xs z-10" />
          {/* Cheddar cheese corner drip */}
          <div className="w-[100%] h-[10%] bg-[#F59E0B] rounded-xs -my-0.5 z-10 relative">
            <div className="absolute -bottom-1.5 left-3 w-2 h-2 bg-[#F59E0B] transform rotate-45" />
          </div>
          {/* Patty */}
          <div className="w-[96%] h-[20%] bg-[#5C3317] rounded-sm border-t border-[#7A4520] z-10" />
          {/* Bottom Bun */}
          <div className="w-[90%] h-[20%] bg-[#C77C32] rounded-b-xl shadow-md" />
        </div>
      </div>
    );
  }

  // FRIES & NUGGETS SIDES
  if (normalized.includes('fries') || normalized.includes('peri') || normalized.includes('nugget') || normalized.includes('corn')) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-[#854D27] to-[#45240E] flex items-center justify-center ${className}`}>
        <div className="relative w-[65%] h-[72%] flex flex-col items-center justify-end">
          <div className="relative w-[85%] h-[55%] flex justify-between items-end px-1 mb-[-4px] z-0">
            <div className="w-2 h-14 bg-[#FBBF24] rounded-t-sm transform -rotate-12 border-t border-amber-300 shadow-xs" />
            <div className="w-2 h-16 bg-[#F59E0B] rounded-t-sm transform -rotate-6 border-t border-amber-300 shadow-xs" />
            <div className="w-2 h-18 bg-[#FBBF24] rounded-t-sm border-t border-amber-300 shadow-xs" />
            <div className="w-2 h-15 bg-[#D97706] rounded-t-sm transform rotate-6 border-t border-amber-300 shadow-xs" />
            <div className="w-2 h-13 bg-[#FBBF24] rounded-t-sm transform rotate-12 border-t border-amber-300 shadow-xs" />
          </div>
          <div className="w-full h-[52%] bg-gradient-to-b from-[#DC2626] to-[#991B1B] rounded-b-xl rounded-t-xs p-1 shadow-lg relative z-10 flex flex-col items-center justify-center border-t border-red-400">
            <div className="w-6 h-6 rounded-full bg-amber-400/90 flex items-center justify-center text-[9px] font-bold text-red-900">
              MC
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DIPS
  if (normalized.includes('dip') || normalized.includes('mayo')) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-[#451A03] to-[#241003] flex items-center justify-center ${className}`}>
        <div className="relative w-14 h-14 rounded-full bg-white shadow-md border-2 border-neutral-300 p-1 flex items-center justify-center">
          <div className={`w-full h-full rounded-full shadow-inner ${
            normalized.includes('chilly') ? 'bg-gradient-to-tr from-red-600 to-amber-500' :
            normalized.includes('thousand') ? 'bg-gradient-to-tr from-amber-400 to-orange-400' :
            'bg-gradient-to-tr from-amber-50 to-amber-100'
          }`} />
        </div>
      </div>
    );
  }

  // COFFEE & DRINKS
  if (normalized.includes('cold') || normalized.includes('shake') || normalized.includes('mojito') || normalized.includes('drink')) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-[#3D2517] via-[#5C3B24] to-[#2B170B] flex items-center justify-center ${className}`}>
        <div className="relative w-[46%] h-[78%] bg-gradient-to-b from-white/30 to-white/10 rounded-b-3xl rounded-t-md border border-white/40 p-1 flex flex-col justify-end shadow-lg overflow-hidden">
          <div className="absolute -top-3 right-3 w-1.5 h-12 bg-amber-400 transform rotate-12 rounded-full shadow" />
          <div className={`w-full h-[70%] rounded-b-2xl relative ${
            normalized.includes('mojito') ? 'bg-gradient-to-b from-cyan-500 to-blue-600' : 'bg-gradient-to-b from-[#8C5D3B] to-[#59341B]'
          }`}>
            <div className="absolute top-2 left-2 w-3 h-3 bg-white/40 rounded-xs transform rotate-12" />
          </div>
          <div className="w-full h-[20%] bg-[#F7EFE4] rounded-t-md flex items-center justify-center">
            <div className="w-full h-1 bg-[#4A2511]/40 rounded-full mx-1" />
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT / HOT COFFEE
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-[#7C4A27] via-[#5C3215] to-[#3B1F0C] flex items-center justify-center ${className}`}>
      <div className="absolute w-[80%] h-[24%] bottom-[16%] bg-[#E8DEC8] rounded-full shadow-md opacity-80" />
      <div className="relative w-[62%] h-[56%] bg-gradient-to-b from-[#FAF4EC] to-[#DDD2C0] rounded-b-3xl rounded-t-lg shadow-inner flex flex-col items-center justify-center p-1.5 border border-[#B8A793]">
        <div className="absolute -right-3 top-2 w-4 h-6 border-3 border-[#FAF4EC] rounded-r-full" />
        <div className="w-full h-[70%] bg-gradient-to-br from-[#9E6539] via-[#6B3E1F] to-[#512B12] rounded-full shadow-inner flex items-center justify-center overflow-hidden">
          <div className="w-4 h-4 bg-[#F5EADB] rounded-full transform -translate-x-1 rotate-45" />
          <div className="w-4 h-4 bg-[#F5EADB] rounded-full transform translate-x-1 -rotate-45" />
        </div>
      </div>
    </div>
  );
};
