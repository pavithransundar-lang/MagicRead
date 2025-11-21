
import React from 'react';
import { CastleType, STEPS, Message, MAX_TOKENS } from '../types';
import { ButterflyIcon, CastleIcon, LockIcon, SparkleIcon, CheckIcon, GardenIcon, ForestIcon, CrystalIcon, GateIcon } from './Icons';

interface QuestBoardProps {
  tokens: number;
  castle: CastleType;
  latestMessage?: Message;
  onCatchButterfly: () => void;
}

const THEMES: Record<CastleType, {
  hill1: string;
  hill2: string;
  sun: string;
  pathStart: string;
  pathEnd: string;
  textGradient: string;
  cardBorder: string;
}> = {
  [CastleType.CLASSIC]: {
    hill1: 'bg-[#e0f2fe]',
    hill2: 'bg-gradient-to-t from-green-100 to-transparent',
    sun: 'bg-yellow-300',
    pathStart: '#fbcfe8', // Pink
    pathEnd: '#c084fc',   // Purple
    textGradient: 'from-pink-600 to-purple-600',
    cardBorder: 'border-pink-200'
  },
  [CastleType.FAIRYTALE]: {
    hill1: 'bg-blue-100',
    hill2: 'bg-gradient-to-t from-indigo-100 to-transparent',
    sun: 'bg-blue-200',
    pathStart: '#93c5fd', // Blue
    pathEnd: '#f472b6',   // Pink
    textGradient: 'from-blue-600 to-pink-600',
    cardBorder: 'border-blue-200'
  },
  [CastleType.CRYSTAL]: {
    hill1: 'bg-fuchsia-100',
    hill2: 'bg-gradient-to-t from-purple-200 to-transparent',
    sun: 'bg-purple-300',
    pathStart: '#e879f9', // Fuchsia
    pathEnd: '#6366f1',   // Indigo
    textGradient: 'from-purple-600 to-indigo-600',
    cardBorder: 'border-purple-200'
  },
  [CastleType.FOREST]: {
    hill1: 'bg-emerald-100',
    hill2: 'bg-gradient-to-t from-yellow-100 to-transparent',
    sun: 'bg-orange-300',
    pathStart: '#facc15', // Yellow
    pathEnd: '#22c55e',   // Green
    textGradient: 'from-green-600 to-yellow-600',
    cardBorder: 'border-green-200'
  }
};

const QuestBoard: React.FC<QuestBoardProps> = ({ tokens, castle, latestMessage, onCatchButterfly }) => {
  // Path definition for 5 steps
  const stepPositions = [
    { x: 15, y: 80 }, // Step 1: Garden
    { x: 40, y: 65 }, // Step 2: Forest
    { x: 75, y: 50 }, // Step 3: Bridge
    { x: 50, y: 30 }, // Step 4: Gate
    { x: 85, y: 15 }, // Step 5: Castle
  ];

  const theme = THEMES[castle];

  const getStageIcon = (index: number, isCastle: boolean) => {
    if (isCastle) return <CastleIcon type={castle} className="w-16 h-16 text-white drop-shadow-md" />;
    switch(index) {
      case 0: return <GardenIcon className="w-14 h-14 drop-shadow-sm" />;
      case 1: return <ForestIcon className="w-14 h-14 drop-shadow-sm" />;
      case 2: return <CrystalIcon className="w-14 h-14 drop-shadow-sm" />;
      case 3: return <GateIcon className="w-14 h-14 drop-shadow-sm" />;
      default: return null;
    }
  };

  // Calculate current avatar position based on tokens.
  // If tokens >= stepPositions.length, stay at the last one (Castle).
  const currentStepIndex = Math.min(tokens, stepPositions.length - 1);
  const currentPos = stepPositions[currentStepIndex];

  return (
    <div className="relative w-full max-w-5xl mx-auto h-[700px] glass-panel rounded-[3rem] overflow-hidden flex flex-col">
      
      {/* --- Scenery Layer (CSS Art) --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[3rem]">
        {/* Sun */}
        <div className={`absolute top-10 right-20 w-24 h-24 rounded-full blur-xl opacity-60 animate-pulse ${theme.sun}`}></div>
        <div className={`absolute top-14 right-24 w-16 h-16 bg-white/30 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.8)]`}></div>
        
        {/* Rolling Hills */}
        <div className={`absolute -bottom-20 -left-20 w-[120%] h-64 rounded-[50%] opacity-50 blur-sm transition-colors duration-1000 ${theme.hill1}`}></div>
        <div className={`absolute -bottom-10 -right-20 w-[120%] h-56 rounded-[40%] opacity-60 transition-colors duration-1000 ${theme.hill2}`}></div>
      </div>

      {/* --- Header Message --- */}
      <div className="relative z-20 p-6 flex justify-center">
        <div className={`glass-card px-8 py-4 rounded-3xl border-2 ${theme.cardBorder} max-w-xl text-center transform transition-all hover:scale-105 shadow-xl bg-white/80`}>
            <div className="flex items-center justify-center gap-2 mb-1">
               <span className="text-xl">🧚‍♀️</span>
               <p className="text-gray-400 text-xs uppercase tracking-[0.2em] font-bold">Fairy Godmother Says</p>
               <span className="text-xl">✨</span>
            </div>
            <p className={`text-2xl md:text-3xl font-handwriting text-transparent bg-clip-text bg-gradient-to-r ${theme.textGradient} font-bold drop-shadow-sm`}>
              "{latestMessage ? latestMessage.text : "Let the magic begin!"}"
            </p>
        </div>
      </div>

      {/* --- Game Board Area --- */}
      <div className="relative flex-1 w-full">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="pathGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={theme.pathStart} />
              <stop offset="100%" stopColor={theme.pathEnd} />
            </linearGradient>
          </defs>

          {/* Path Track (Inactive) */}
          <path
            d={`M ${stepPositions[0].x} ${stepPositions[0].y} 
               C 20 70, 50 75, ${stepPositions[1].x} ${stepPositions[1].y} 
               S 65 65, ${stepPositions[2].x} ${stepPositions[2].y}
               S 30 40, ${stepPositions[3].x} ${stepPositions[3].y}
               S 75 25, ${stepPositions[4].x} ${stepPositions[4].y}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="6"
            strokeDasharray="4 6"
            strokeLinecap="round"
          />
          
          {/* Active Path (Progress) */}
          {tokens > 0 && (
             <path
             d={`M ${stepPositions[0].x} ${stepPositions[0].y} 
                C 20 70, 50 75, ${stepPositions[1].x} ${stepPositions[1].y} 
                ${tokens > 1 ? `S 65 65, ${stepPositions[2].x} ${stepPositions[2].y}` : ''}
                ${tokens > 2 ? `S 30 40, ${stepPositions[3].x} ${stepPositions[3].y}` : ''}
                ${tokens > 3 ? `S 75 25, ${stepPositions[4].x} ${stepPositions[4].y}` : ''}`}
             fill="none"
             stroke="url(#pathGradient)"
             strokeWidth="8"
             strokeLinecap="round"
             filter="url(#glow)"
             className="drop-shadow-md transition-all duration-1000 ease-out"
           />
          )}
        </svg>

        {/* Steps Markers */}
        {stepPositions.map((pos, index) => {
          const isCompleted = tokens > index; 
          const isCurrent = tokens === index; 
          const isLocked = tokens < index; 
          const isCastle = index === 4;

          return (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 group"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              {/* Step Node */}
              <div className="relative flex flex-col items-center">
                
                {/* The Marker */}
                <div 
                  className={`
                    relative rounded-full flex items-center justify-center transition-all duration-500 gem-shadow
                    ${isCastle ? 'w-24 h-24 bg-pink-100' : 'w-20 h-20 bg-white'}
                    ${isCompleted ? 'scale-100 ring-2 ring-green-300' : ''}
                    ${isCurrent ? 'scale-110 ring-4 ring-white/50 ring-opacity-70' : ''}
                    ${isLocked ? 'grayscale opacity-70' : ''}
                  `}
                >
                  {/* Render Specific Icon */}
                  <div className="transform transition-transform duration-300 group-hover:scale-110">
                    {getStageIcon(index, isCastle)}
                  </div>

                  {/* Completed Checkmark Overlay */}
                  {isCompleted && !isCastle && (
                    <div className="absolute -bottom-1 -right-1 bg-green-400 rounded-full p-1 border-2 border-white shadow-md z-10">
                      <CheckIcon className="w-4 h-4 text-white stroke-[4]" />
                    </div>
                  )}

                  {/* Lock Icon Overlay */}
                  {isLocked && !isCastle && (
                      <div className="absolute -bottom-1 -right-1 bg-gray-200 p-1 rounded-full shadow-sm z-10 border-2 border-white">
                        <LockIcon className="w-4 h-4 text-gray-400" />
                      </div>
                  )}
                </div>

                {/* Label */}
                <div className={`
                  mt-3 px-3 py-1 rounded-full text-sm font-bold backdrop-blur-md shadow-sm border
                  transition-all duration-500 z-20 whitespace-nowrap
                  ${isCurrent 
                    ? `bg-white ${theme.cardBorder} text-gray-700 scale-110` 
                    : 'bg-white/40 border-transparent text-slate-500'
                  }
                `}>
                  {STEPS[index]}
                </div>
                
                {/* Decorative Stars for current */}
                {isCurrent && (
                    <>
                        <SparkleIcon className="absolute -top-6 -right-6 w-8 h-8 text-yellow-400 animate-sparkle" />
                        <SparkleIcon className="absolute top-0 -left-8 w-5 h-5 text-white animate-sparkle" style={{animationDelay:'0.5s'}} />
                    </>
                )}
              </div>
            </div>
          );
        })}

        {/* Avatar - Floating outside loop for smooth transitions */}
        {tokens < 5 && ( // Only show if not finished (Finale handles completion)
             <div 
             className="absolute z-30 pointer-events-none transition-all duration-700 ease-in-out"
             style={{ 
                 left: `${currentPos.x}%`, 
                 top: `${currentPos.y}%`,
                 transform: 'translate(-50%, -50%)' 
             }}
             >
             <div className="relative -top-12 animate-float drop-shadow-2xl">
                 <span className="text-5xl filter drop-shadow-md">👸</span>
                 <div className="absolute top-full left-1/2 -translate-x-1/2 w-6 h-2 bg-black/20 blur-sm rounded-full"></div>
             </div>
             </div>
        )}

      </div>

      {/* --- Footer Controls --- */}
      <div className="relative z-20 p-6 mt-auto flex justify-between items-end">
         {/* Token Counter */}
         <div className="glass-card px-6 py-3 rounded-2xl flex flex-col gap-2">
             <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Butterflies</span>
             <div className="flex gap-2">
                {[...Array(MAX_TOKENS)].map((_, i) => (
                    <div key={i} className={`transition-all duration-700 ${i < tokens ? 'scale-110' : 'opacity-30 grayscale'}`}>
                         <ButterflyIcon className={`w-8 h-8 ${i < tokens ? 'text-pink-500 drop-shadow-md' : 'text-gray-400'}`} />
                    </div>
                ))}
             </div>
         </div>

         {/* CTA Button */}
         {tokens < MAX_TOKENS && (
            <button
              onClick={onCatchButterfly}
              className={`group relative bg-gradient-to-r ${theme.textGradient} bg-[length:200%_auto] animate-gradient text-white pl-8 pr-10 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 overflow-hidden`}
              style={{ backgroundSize: '200% auto' }}
            >
              <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors"></div>
              <ButterflyIcon className="w-8 h-8 text-yellow-200 animate-pulse" />
              <div className="text-left">
                  <p className="text-xs text-white/80 font-medium uppercase tracking-wide">Task Done?</p>
                  <p className="text-xl font-bold font-handwriting">Catch a Butterfly!</p>
              </div>
            </button>
         )}
      </div>
    </div>
  );
};

export default QuestBoard;
    