import React from 'react';
import { CastleType } from '../types';
import { CastleIcon, SparkleIcon } from './Icons';

interface FinaleProps {
  castle: CastleType;
  onReset: () => void;
}

const Finale: React.FC<FinaleProps> = ({ castle, onReset }) => {
  const getGradient = () => {
    switch (castle) {
        case CastleType.FAIRYTALE: return 'bg-gradient-to-b from-blue-900 via-blue-700 to-pink-500';
        case CastleType.CRYSTAL: return 'bg-gradient-to-b from-indigo-900 via-purple-800 to-fuchsia-600';
        case CastleType.FOREST: return 'bg-gradient-to-b from-green-900 via-emerald-800 to-yellow-600';
        case CastleType.CLASSIC:
        default: return 'bg-gradient-to-b from-purple-900 via-pink-800 to-pink-600';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-white ${getGradient()}`}>
      
      {/* Fireworks / Particles (CSS simplified) */}
      {[...Array(20)].map((_, i) => (
        <div 
            key={i}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-sparkle"
            style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
            }}
        />
      ))}
      
      <div className="relative z-10 text-center p-8 animate-float">
        <div className="mb-8 relative inline-block">
            <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-50 rounded-full"></div>
            <CastleIcon type={castle} className="w-48 h-48 text-white relative z-10 drop-shadow-2xl" />
        </div>
        
        <h1 className="text-6xl font-handwriting mb-4 text-yellow-300 drop-shadow-md">Quest Complete!</h1>
        <p className="text-2xl font-light max-w-md mx-auto mb-12">
            You have reached the {castle} Castle! The kingdom is so proud of your reading.
        </p>
        
        <button 
            onClick={onReset}
            className="bg-white text-purple-900 px-10 py-4 rounded-full text-xl font-bold shadow-xl hover:scale-105 transition-transform"
        >
            Start New Journey ↻
        </button>
      </div>
      
      {/* Decorative bottom glow */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/40 to-transparent"></div>
    </div>
  );
};

export default Finale;