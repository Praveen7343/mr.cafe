import React from 'react';

interface MrCafeLogoProps {
  className?: string;
  size?: number;
}

export const MrCafeLogo: React.FC<MrCafeLogoProps> = ({ className = 'w-10 h-10', size }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Mr. CAFE Logo"
    >
      <defs>
        {/* Luxury Gold Rim Gradient */}
        <linearGradient id="mrCafeGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E6C875" />
          <stop offset="25%" stopColor="#FFF3CE" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="75%" stopColor="#AA8222" />
          <stop offset="100%" stopColor="#F5DC8C" />
        </linearGradient>

        <linearGradient id="innerShadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E1915" />
          <stop offset="100%" stopColor="#0B0907" />
        </linearGradient>
      </defs>

      {/* Outer Ring Gold Border */}
      <circle cx="100" cy="100" r="96" fill="url(#innerShadow)" stroke="url(#mrCafeGold)" strokeWidth="6.5" />
      <circle cx="100" cy="100" r="91" fill="none" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.5" />

      {/* TOP HAT */}
      <g id="top-hat">
        {/* Hat Crown */}
        <path
          d="M 75 66 C 74 38, 126 38, 125 66 Z"
          fill="#FFFFFF"
        />
        {/* Hat Ribbon */}
        <path
          d="M 74.8 59 Q 100 63.5 125.2 59 L 125.5 64 Q 100 68.5 74.5 64 Z"
          fill="#1A110B"
        />
        {/* Hat Brim */}
        <ellipse cx="100" cy="67" rx="44" ry="7.5" fill="#FFFFFF" />
        {/* Brim subtle lower curvature highlight */}
        <path
          d="M 57 67 Q 100 73 143 67 Q 100 69.5 57 67 Z"
          fill="#E6E6E6"
        />
      </g>

      {/* TEXT: "Mr." */}
      <text
        x="68"
        y="94"
        fill="#FFFFFF"
        fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        fontWeight="900"
        fontSize="19"
        letterSpacing="0.5"
      >
        Mr.
      </text>

      {/* TEXT: "CAFE" */}
      <text
        x="100"
        y="117"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        fontWeight="900"
        fontSize="25"
        letterSpacing="3"
      >
        CAFE
      </text>

      {/* MUSTACHE */}
      <path
        d="M 100 128 C 93 123, 76 117, 65 123 C 56 128, 52 118, 62 114 C 71 110, 83 118, 100 131 C 117 118, 129 110, 138 114 C 148 118, 144 128, 135 123 C 124 117, 107 123, 100 128 Z"
        fill="#FFFFFF"
      />

      {/* SUNBURST RAYS (Under Mustache) */}
      <g stroke="#E5C07B" strokeLinecap="round">
        <line x1="100" y1="137" x2="100" y2="174" strokeWidth="2.5" />
        <line x1="93" y1="138" x2="88" y2="171" strokeWidth="2" />
        <line x1="107" y1="138" x2="112" y2="171" strokeWidth="2" />
        <line x1="86" y1="140" x2="77" y2="167" strokeWidth="2" />
        <line x1="114" y1="140" x2="123" y2="167" strokeWidth="2" />
        <line x1="79" y1="143" x2="68" y2="162" strokeWidth="1.7" />
        <line x1="121" y1="143" x2="132" y2="162" strokeWidth="1.7" />
        <line x1="73" y1="147" x2="59" y2="157" strokeWidth="1.5" />
        <line x1="127" y1="147" x2="141" y2="157" strokeWidth="1.5" />
        <line x1="68" y1="152" x2="51" y2="152" strokeWidth="1.4" />
        <line x1="132" y1="152" x2="149" y2="152" strokeWidth="1.4" />
        <line x1="64" y1="157" x2="44" y2="147" strokeWidth="1.2" />
        <line x1="136" y1="157" x2="156" y2="147" strokeWidth="1.2" />
      </g>

      {/* SURROUNDING ICONS */}

      {/* 1. Coffee Mug with Steam (Top-Left) */}
      <g id="icon-coffee" transform="translate(42, 33) rotate(-8) scale(0.68)" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 5 15 L 29 15 C 29 27, 25 32, 17 32 C 9 32, 5 27, 5 15 Z" fill="#FFFFFF" fillOpacity="0.1" />
        <path d="M 29 18 C 35 18, 35 26, 28 27" />
        <path d="M 11 6 Q 14 10 11 13" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M 17 3 Q 20 8 17 12" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M 23 6 Q 26 10 23 13" stroke="#FFFFFF" strokeWidth="2" />
      </g>

      {/* 2. Cold Drink / Frappe with Straw (Top-Right) */}
      <g id="icon-cold-drink" transform="translate(142, 34) rotate(10) scale(0.68)" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 7 14 L 25 14 L 21 34 L 11 34 Z" fill="#FFFFFF" fillOpacity="0.1" />
        {/* Dome lid */}
        <path d="M 5 14 C 5 8, 27 8, 27 14" />
        {/* Straw */}
        <line x1="16" y1="8" x2="23" y2="1" strokeWidth="2.5" />
        {/* Logo circle on cup */}
        <circle cx="16" cy="24" r="3.5" fill="#FFFFFF" />
      </g>

      {/* 3. Burger (Middle-Left) */}
      <g id="icon-burger" transform="translate(23, 76) rotate(-5) scale(0.65)" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Top Bun */}
        <path d="M 6 15 C 6 6, 32 6, 32 15 Z" fill="#FFFFFF" fillOpacity="0.1" />
        {/* Sesame seeds */}
        <circle cx="14" cy="9" r="0.8" fill="#FFFFFF" stroke="none" />
        <circle cx="21" cy="8" r="0.8" fill="#FFFFFF" stroke="none" />
        <circle cx="25" cy="11" r="0.8" fill="#FFFFFF" stroke="none" />
        {/* Patty & lettuce */}
        <path d="M 6 18 Q 12 16 19 18 Q 26 16 32 18" strokeWidth="2" />
        {/* Bottom Bun */}
        <path d="M 7 21 C 7 24, 31 24, 31 21 Z" />
      </g>

      {/* 4. French Fries (Middle-Right) */}
      <g id="icon-fries" transform="translate(148, 74) rotate(6) scale(0.66)" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Fries carton */}
        <path d="M 7 13 L 25 13 L 22 30 L 10 30 Z" fill="#FFFFFF" fillOpacity="0.1" />
        <ellipse cx="16" cy="22" rx="4.5" ry="3" />
        {/* Fries sticks */}
        <line x1="10" y1="13" x2="10" y2="4" strokeWidth="2.2" />
        <line x1="13" y1="13" x2="13" y2="2" strokeWidth="2.2" />
        <line x1="16" y1="13" x2="16" y2="1" strokeWidth="2.2" />
        <line x1="19" y1="13" x2="19" y2="3" strokeWidth="2.2" />
        <line x1="22" y1="13" x2="22" y2="6" strokeWidth="2.2" />
      </g>

      {/* 5. Cupcake / Muffin with Cherry (Bottom-Left) */}
      <g id="icon-cupcake" transform="translate(26, 114) rotate(-3) scale(0.66)" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Cup base */}
        <path d="M 8 18 L 24 18 L 21 32 L 11 32 Z" fill="#FFFFFF" fillOpacity="0.1" />
        <line x1="14" y1="18" x2="13.5" y2="32" strokeWidth="1.5" />
        <line x1="18" y1="18" x2="18.5" y2="32" strokeWidth="1.5" />
        {/* Swirl Frosting */}
        <path d="M 7 18 C 7 13, 11 12, 16 12 C 21 12, 25 13, 25 18" />
        {/* Cherry */}
        <circle cx="16" cy="9" r="2.5" fill="#FFFFFF" />
        <path d="M 16 7 Q 19 3 22 4" strokeWidth="1.5" />
      </g>

      {/* 6. Cake Slice with Cherry (Bottom-Right) */}
      <g id="icon-cake" transform="translate(146, 118) rotate(4) scale(0.66)" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Cake wedge */}
        <path d="M 7 24 L 28 14 L 28 26 L 7 32 Z" fill="#FFFFFF" fillOpacity="0.1" />
        <line x1="7" y1="28" x2="28" y2="20" strokeWidth="1.8" />
        {/* Cherry on top */}
        <circle cx="21" cy="11" r="2.5" fill="#FFFFFF" />
        <path d="M 21 9 Q 23 5 26 6" strokeWidth="1.5" />
      </g>

      {/* GOLD ACCENT DASHES AROUND PERIMETER */}
      <g stroke="#E5C07B" strokeWidth="2" strokeLinecap="round">
        <line x1="33" y1="58" x2="39" y2="65" />
        <line x1="167" y1="58" x2="161" y2="65" />
        <line x1="23" y1="106" x2="31" y2="108" />
        <line x1="177" y1="106" x2="169" y2="108" />
        <line x1="45" y1="145" x2="52" y2="152" />
        <line x1="155" y1="145" x2="148" y2="152" />
      </g>
    </svg>
  );
};
