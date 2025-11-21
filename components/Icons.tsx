
import React from 'react';
import { CastleType } from '../types';

export type ButterflyVariant = 'purple' | 'blue' | 'orange' | 'green' | 'pink' | 'gold';

export const ButterflyIcon: React.FC<{ 
  className?: string; 
  onClick?: (e: React.MouseEvent) => void; 
  animated?: boolean; 
  flapSpeed?: number; // duration in seconds, e.g. 0.2 for fast, 0.5 for slow
  variant?: ButterflyVariant;
  uniqueId?: string; // Required if multiple butterflies are on screen to scope gradients
}> = ({ className, onClick, animated = false, flapSpeed = 0.2, variant = 'purple', uniqueId = 'default' }) => {
  
  const wingStyle = animated ? { animationDuration: `${flapSpeed}s` } : {};
  const gid = `wingGradient-${uniqueId}`;

  // Color configurations for variants
  const colors = {
    purple: { start: '#D8B4FE', mid: '#A855F7', end: '#7C3AED', stroke: '#FDE047', body: '#6D28D9', dots: '#FDE047' },
    blue:   { start: '#93C5FD', mid: '#3B82F6', end: '#1D4ED8', stroke: '#DBEAFE', body: '#1E3A8A', dots: '#FFFFFF' },
    orange: { start: '#FDBA74', mid: '#F97316', end: '#C2410C', stroke: '#FEF3C7', body: '#7C2D12', dots: '#FEF3C7' },
    green:  { start: '#86EFAC', mid: '#22C55E', end: '#15803D', stroke: '#ECFCCB', body: '#14532D', dots: '#D9F99D' },
    pink:   { start: '#FBCFE8', mid: '#EC4899', end: '#BE185D', stroke: '#FFF1F2', body: '#831843', dots: '#FFFFFF' },
    gold:   { start: '#FDE047', mid: '#EAB308', end: '#A16207', stroke: '#FFFFFF', body: '#713F12', dots: '#FFFFFF' },
  };

  // Safety fallback if variant is invalid
  const c = colors[variant] || colors['purple'];

  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`${className} overflow-visible`} 
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.start} />
          <stop offset="50%" stopColor={c.mid} />
          <stop offset="100%" stopColor={c.end} />
        </linearGradient>
        <filter id={`glow-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Left Wing Group */}
      <g className={animated ? "wing-left" : ""} style={wingStyle}>
        {/* Upper Wing */}
        <path 
          d="M48 50 C 20 20, 0 10, 5 40 C 8 55, 40 55, 48 50" 
          fill={`url(#${gid})`} 
          stroke={c.stroke} 
          strokeWidth="1"
          opacity="0.9"
        />
        {/* Lower Wing */}
        <path 
          d="M48 52 C 30 70, 10 80, 15 60 C 20 45, 40 55, 48 52" 
          fill={`url(#${gid})`} 
          stroke={c.stroke} 
          strokeWidth="1"
          opacity="0.9"
        />
        {/* Decorative Dots */}
        <circle cx="20" cy="35" r="3" fill={c.dots} opacity="0.8" />
        <circle cx="15" cy="25" r="2" fill={c.dots} opacity="0.6" />
        <circle cx="25" cy="65" r="2.5" fill={c.dots} opacity="0.8" />
      </g>

      {/* Right Wing Group */}
      <g className={animated ? "wing-right" : ""} style={wingStyle}>
        {/* Upper Wing */}
        <path 
          d="M52 50 C 80 20, 100 10, 95 40 C 92 55, 60 55, 52 50" 
          fill={`url(#${gid})`} 
          stroke={c.stroke} 
          strokeWidth="1"
          opacity="0.9"
        />
        {/* Lower Wing */}
        <path 
          d="M52 52 C 70 70, 90 80, 85 60 C 80 45, 60 55, 52 52" 
          fill={`url(#${gid})`} 
          stroke={c.stroke} 
          strokeWidth="1"
          opacity="0.9"
        />
        {/* Decorative Dots */}
        <circle cx="80" cy="35" r="3" fill={c.dots} opacity="0.8" />
        <circle cx="85" cy="25" r="2" fill={c.dots} opacity="0.6" />
        <circle cx="75" cy="65" r="2.5" fill={c.dots} opacity="0.8" />
      </g>

      {/* Body */}
      <g className={animated ? "body-bob" : ""} style={wingStyle}>
        {/* Antennae */}
        <path d="M45 35 Q 40 20 35 25" fill="none" stroke={c.body} strokeWidth="2" strokeLinecap="round" />
        <path d="M55 35 Q 60 20 65 25" fill="none" stroke={c.body} strokeWidth="2" strokeLinecap="round" />
        
        {/* Main Body */}
        <ellipse cx="50" cy="50" rx="4" ry="20" fill={c.body} />
      </g>
    </svg>
  );
};

export const CastleIcon: React.FC<{ type: CastleType; className?: string }> = ({ type, className }) => {
  // Detailed paths for castles
  const paths: Record<CastleType, React.ReactElement> = {
    [CastleType.CLASSIC]: (
      <g fill="currentColor">
         <path d="M4 22H20V12H18V8H15V11H13V4H11V11H9V8H6V12H4V22Z" fill="#F472B6" /> 
         <path d="M6 12H9V14H6V12ZM15 12H18V14H15V12ZM10 16H14V22H10V16Z" fill="#831843" opacity="0.3"/>
         <path d="M13 4L12 2L11 4H13Z" fill="#831843" />
         <path d="M18 8L16.5 5L15 8H18Z" fill="#831843" />
         <path d="M9 8L7.5 5L6 8H9Z" fill="#831843" />
      </g>
    ),
    [CastleType.FAIRYTALE]: (
      <g fill="currentColor">
        <path d="M12 3L8 10H16L12 3Z" fill="#60A5FA" /> {/* Blue Roof */}
        <rect x="9" y="10" width="6" height="12" fill="#FBCFE8" />
        <path d="M5 10L2 15H8L5 10Z" fill="#60A5FA" />
        <rect x="3" y="15" width="4" height="7" fill="#FBCFE8" />
        <path d="M19 10L16 15H22L19 10Z" fill="#60A5FA" />
        <rect x="17" y="15" width="4" height="7" fill="#FBCFE8" />
        <path d="M10 16C10 16 10 14 12 14C14 14 14 16 14 16V22H10V16Z" fill="#831843" />
      </g>
    ),
    [CastleType.CRYSTAL]: (
       <g fill="currentColor">
         <path d="M12 2L5 10L7 22H17L19 10L12 2Z" fill="#E879F9" opacity="0.8" />
         <path d="M12 2L12 22" stroke="white" strokeWidth="0.5" opacity="0.5"/>
         <path d="M12 6L17 12L12 18L7 12L12 6Z" fill="#F0ABFC" />
       </g>
    ),
    [CastleType.FOREST]: (
      <g fill="currentColor">
        <path d="M12 2L6 10H18L12 2Z" fill="#4ADE80" />
        <rect x="7" y="10" width="10" height="12" fill="#BBF7D0" />
        <path d="M10 16H14V22H10V16Z" fill="#166534" />
        <path d="M7 10H17" stroke="#166534" strokeWidth="1"/>
        <circle cx="12" cy="13" r="1.5" fill="#166534" />
      </g>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      {paths[type] || paths[CastleType.CLASSIC]}
    </svg>
  );
};

export const GardenIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <g>
       {/* Stem */}
       <path d="M50 100 Q 50 80 50 60" stroke="#22C55E" strokeWidth="4" fill="none" />
       <path d="M50 80 Q 70 70 65 60 Q 50 80 50 80" fill="#4ADE80" />
       {/* Flower Petals */}
       <circle cx="50" cy="50" r="15" fill="#F472B6" /> {/* Center base */}
       <circle cx="50" cy="30" r="12" fill="#F9A8D4" /> {/* Top */}
       <circle cx="50" cy="70" r="12" fill="#F9A8D4" /> {/* Bottom */}
       <circle cx="30" cy="50" r="12" fill="#F9A8D4" /> {/* Left */}
       <circle cx="70" cy="50" r="12" fill="#F9A8D4" /> {/* Right */}
       <circle cx="36" cy="36" r="10" fill="#FBCFE8" /> 
       <circle cx="64" cy="36" r="10" fill="#FBCFE8" />
       <circle cx="36" cy="64" r="10" fill="#FBCFE8" />
       <circle cx="64" cy="64" r="10" fill="#FBCFE8" />
       {/* Center */}
       <circle cx="50" cy="50" r="10" fill="#FDE047" stroke="#F59E0B" strokeWidth="2" />
    </g>
  </svg>
);

export const ForestIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <g>
      {/* Trunk */}
      <path d="M40 90 L 45 60 Q 35 50 30 40" stroke="#78350F" strokeWidth="8" fill="none" strokeLinecap="round"/>
      <path d="M60 90 L 55 60 Q 65 50 70 40" stroke="#78350F" strokeWidth="8" fill="none" strokeLinecap="round"/>
      <path d="M40 90 Q 50 80 60 90" fill="#78350F" />
      <rect x="43" y="60" width="14" height="30" fill="#78350F" />
      
      {/* Canopy */}
      <circle cx="50" cy="40" r="35" fill="#22C55E" />
      <circle cx="30" cy="50" r="15" fill="#4ADE80" />
      <circle cx="70" cy="50" r="15" fill="#4ADE80" />
      <circle cx="50" cy="20" r="15" fill="#4ADE80" />
      
      {/* Sparkles */}
      <circle cx="30" cy="30" r="2" fill="#FEF08A" className="animate-pulse" />
      <circle cx="70" cy="30" r="2" fill="#FEF08A" className="animate-pulse" style={{animationDelay: '1s'}} />
    </g>
  </svg>
);

export const CrystalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="crystalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E879F9" />
        <stop offset="50%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#6B21A8" />
      </linearGradient>
    </defs>
    <g filter="drop-shadow(0px 4px 4px rgba(168, 85, 247, 0.4))">
      <path d="M50 10 L 80 40 L 50 90 L 20 40 Z" fill="url(#crystalGrad)" stroke="#F0ABFC" strokeWidth="2" />
      <path d="M50 10 L 50 90" stroke="#F0ABFC" strokeWidth="1" opacity="0.5" />
      <path d="M20 40 L 80 40" stroke="#F0ABFC" strokeWidth="1" opacity="0.5" />
      <path d="M50 40 L 70 25" stroke="white" strokeWidth="1" opacity="0.6" />
    </g>
  </svg>
);

export const GateIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
    </defs>
    <g>
        {/* Key */}
        <circle cx="50" cy="30" r="12" fill="none" stroke="#F59E0B" strokeWidth="6" />
        <rect x="47" y="42" width="6" height="40" fill="#F59E0B" />
        <rect x="53" y="65" width="10" height="6" fill="#F59E0B" />
        <rect x="53" y="75" width="8" height="6" fill="#F59E0B" />

        {/* Ribbon/Bow */}
        <path d="M50 45 C 30 35, 10 50, 10 65 C 10 80, 40 70, 50 55" fill="url(#ribbonGrad)" opacity="0.9" />
        <path d="M50 45 C 70 35, 90 50, 90 65 C 90 80, 60 70, 50 55" fill="url(#ribbonGrad)" opacity="0.9" />
        <circle cx="50" cy="50" r="5" fill="#2563EB" />
        {/* Streamers */}
        <path d="M50 55 Q 40 80 30 90" stroke="#60A5FA" strokeWidth="4" fill="none" />
        <path d="M50 55 Q 60 80 70 90" stroke="#60A5FA" strokeWidth="4" fill="none" />
    </g>
  </svg>
);

export const SparkleIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
);

export const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C9.8 2 8 3.8 8 6V10H6V22H18V10H16V6C16 3.8 14.2 2 12 2ZM12 4C13.1 4 14 4.9 14 6V10H10V6C10 4.9 10.9 4 12 4Z" />
  </svg>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const CrownOverlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 50" className={className} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="crownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>
      </defs>
      <path 
        d="M2 35 L 10 35 L 15 10 L 35 35 L 50 2 L 65 35 L 85 10 L 90 35 L 98 35 L 98 48 L 2 48 Z" 
        fill="url(#crownGradient)" 
        stroke="#A16207" 
        strokeWidth="1"
      />
      {/* Gems */}
      <circle cx="15" cy="10" r="3" fill="#EF4444" stroke="white" strokeWidth="0.5" />
      <circle cx="50" cy="2" r="4" fill="#3B82F6" stroke="white" strokeWidth="0.5" />
      <circle cx="85" cy="10" r="3" fill="#EF4444" stroke="white" strokeWidth="0.5" />
      
      {/* Base Gems */}
      <circle cx="50" cy="42" r="3" fill="#10B981" />
      <circle cx="25" cy="42" r="2" fill="#EC4899" />
      <circle cx="75" cy="42" r="2" fill="#EC4899" />
  </svg>
);
