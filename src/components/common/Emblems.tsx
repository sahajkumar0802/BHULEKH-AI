import React from 'react';

/**
 * State Emblem of India (Ashoka Lion Capital) Vector SVG
 */
export const AshokaEmblem: React.FC<{ className?: string; size?: number; variant?: 'dark' | 'light' }> = ({ 
  className = "h-12 w-auto", 
  size = 48,
  variant = 'dark'
}) => {
  const isLight = variant === 'light';
  const primaryFill = isLight ? '#FFFFFF' : '#002856';
  const secondaryFill = isLight ? '#C2DCF0' : '#003D7C';
  const textFill = isLight ? '#002856' : '#FFFFFF';

  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      viewBox="0 0 100 130" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="State Emblem of India"
    >
      {/* 3 Visible Lions Silhouette */}
      <path 
        d="M50 8C42 8 36 14 36 22C36 28 40 33 45 35C42 37 38 41 38 47C38 53 42 57 46 59C44 62 42 66 42 71H58C58 66 56 62 54 59C58 57 62 53 62 47C62 41 58 37 55 35C60 33 64 28 64 22C64 14 58 8 50 8Z" 
        fill={primaryFill} 
      />
      {/* Left Lion Head */}
      <path 
        d="M26 22C20 22 15 27 15 34C15 39 18 43 22 45C20 47 17 50 17 55C17 60 20 63 23 65C22 67 20 70 20 74H36C36 70 34 67 33 65C36 63 39 60 39 55C39 50 36 47 34 45C38 43 41 39 41 34C41 27 36 22 26 22Z" 
        fill={primaryFill} 
      />
      {/* Right Lion Head */}
      <path 
        d="M74 22C68 22 63 27 63 34C63 39 66 43 70 45C68 47 65 50 65 55C65 60 68 63 71 65C70 67 68 70 68 74H84C84 70 82 67 81 65C84 63 87 60 87 55C87 50 84 47 82 45C86 43 89 39 89 34C89 27 84 22 74 22Z" 
        fill={primaryFill} 
      />
      
      {/* Abacus Base Platform */}
      <rect x="12" y="74" width="76" height="12" rx="1" fill={secondaryFill} />
      
      {/* Central Ashoka Chakra on Base */}
      <circle cx="50" cy="80" r="5" fill="#FFFFFF" stroke="#002856" strokeWidth="1.5" />
      <circle cx="50" cy="80" r="1.5" fill="#002856" />
      
      {/* Galloping Horse (Left) & Bull (Right) reliefs */}
      <circle cx="28" cy="80" r="2.5" fill="#FFFFFF" opacity="0.9" />
      <circle cx="72" cy="80" r="2.5" fill="#FFFFFF" opacity="0.9" />
      
      {/* Base Pedestal with Satyameva Jayate Banner */}
      <path d="M20 88L15 98H85L80 88H20Z" fill={primaryFill} />
      <rect x="18" y="100" width="64" height="10" rx="1" fill={secondaryFill} />
      
      {/* Devanagari Satyameva Jayate representation */}
      <text 
        x="50" 
        y="108" 
        fontFamily="sans-serif" 
        fontSize="7" 
        fontWeight="bold" 
        fill={textFill} 
        textAnchor="middle" 
        letterSpacing="0.8"
      >
        सत्यमेव जयते
      </text>
    </svg>
  );
};

/**
 * Digital India Emblem SVG
 */
export const DigitalIndiaEmblem: React.FC<{ className?: string }> = ({ className = "h-9 w-auto" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 rounded-md bg-[#003D7C] flex items-center justify-center p-1 text-white shadow-xs border border-[#002856]">
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="16" stroke="#FF9933" strokeWidth="2.5" strokeDasharray="4 2" />
          <path d="M12 20L18 26L28 14" stroke="#138808" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="20" cy="20" r="4" fill="#FFFFFF" />
        </svg>
      </div>
      <div className="leading-none text-left">
        <div className="text-[11px] font-extrabold text-[#002856] tracking-tight uppercase">
          Digital India
        </div>
        <div className="text-[9px] font-semibold text-[#FF9933]">
          Power To Empower
        </div>
      </div>
    </div>
  );
};

/**
 * Smart India Hackathon 2026 Badge
 */
export const SihBadge: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F0F5FA] border border-[#003D7C] rounded text-[11px] font-bold text-[#002856] ${className}`}>
      <span className="w-2 h-2 rounded-full bg-[#138808] animate-pulse" />
      <span>SIH 2026</span>
      <span className="text-[#94A3B8]">•</span>
      <span className="text-[#005FA8]">PS-18</span>
    </div>
  );
};

/**
 * Official Tricolor Ribbon Bar
 */
export const TricolorRibbon: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`w-full flex h-1 ${className}`} aria-hidden="true">
      <div className="flex-1 bg-[#FF9933]" />
      <div className="flex-1 bg-[#FFFFFF]" />
      <div className="flex-1 bg-[#138808]" />
    </div>
  );
};
