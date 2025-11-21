import React from 'react';
import { Mood, CastleType } from '../types';
import { CastleIcon } from './Icons';

interface SetupScreenProps {
  onComplete: (mood: Mood, castle: CastleType) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onComplete }) => {
  const [mood, setMood] = React.useState<Mood | null>(null);
  const [castle, setCastle] = React.useState<CastleType | null>(null);

  const handleStart = () => {
    if (mood && castle) {
      onComplete(mood, castle);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative z-10">
      <div className="max-w-4xl w-full glass-panel rounded-[2.5rem] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row gap-12 items-center md:items-start">
        
        {/* Left Column: Welcome Text */}
        <div className="flex-1 text-center md:text-left space-y-6">
          <div className="inline-block bg-pink-100 px-4 py-1 rounded-full text-pink-600 text-xs font-bold uppercase tracking-widest mb-2">
            New Adventure
          </div>
          <h1 className="text-5xl md:text-7xl font-handwriting text-transparent bg-clip-text bg-gradient-to-br from-pink-600 to-purple-800 leading-tight py-2">
            Royal Reading Quest
          </h1>
          <p className="text-lg text-slate-600 font-light leading-relaxed">
            Welcome, Princess Celine! <br/>
            Every book you read adds magic to our kingdom. Let's prepare for your journey today.
          </p>

          <div className="hidden md:block pt-8">
             <button
                onClick={handleStart}
                disabled={!mood || !castle}
                className={`w-full py-5 rounded-2xl text-2xl font-bold shadow-xl transition-all transform duration-300 ${
                  mood && castle
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:scale-105 hover:shadow-pink-400/50 cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Begin Your Journey ✨
              </button>
          </div>
        </div>

        {/* Right Column: Selections */}
        <div className="flex-1 w-full space-y-10">
          
          {/* Mood Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-handwriting text-purple-800">1. How are you feeling?</h2>
            <div className="flex justify-center md:justify-start gap-4">
              {[
                { type: Mood.HAPPY, emoji: '😊', label: 'Happy', color: 'bg-yellow-100 border-yellow-300 text-yellow-700' },
                { type: Mood.OKAY, emoji: '🙂', label: 'Okay', color: 'bg-blue-100 border-blue-300 text-blue-700' },
                { type: Mood.TIRED, emoji: '😴', label: 'Tired', color: 'bg-purple-100 border-purple-300 text-purple-700' }
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => setMood(item.type)}
                  className={`flex flex-col items-center p-3 w-24 rounded-2xl border-2 transition-all duration-300 ${
                    mood === item.type 
                      ? `${item.color} scale-110 shadow-lg ring-2 ring-offset-2 ring-pink-200` 
                      : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-400 hover:scale-105'
                  }`}
                >
                  <span className="text-3xl mb-1">{item.emoji}</span>
                  <span className="text-xs font-bold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Castle Section */}
          <div className="space-y-4">
             <h2 className="text-2xl font-handwriting text-purple-800">2. Choose your Castle</h2>
             <div className="grid grid-cols-2 gap-3">
                {Object.values(CastleType).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCastle(c)}
                    className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-300 group ${
                      castle === c
                        ? 'bg-gradient-to-br from-pink-50 to-purple-50 border-pink-400 shadow-md'
                        : 'bg-white border-slate-100 hover:border-pink-200'
                    }`}
                  >
                    <div className={`mb-2 transition-transform duration-500 ${castle === c ? 'scale-110 rotate-3' : 'group-hover:scale-110'}`}>
                       <CastleIcon type={c} className={`w-10 h-10 ${castle === c ? 'text-pink-600' : 'text-slate-300'}`} />
                    </div>
                    <span className={`text-sm font-bold ${castle === c ? 'text-pink-700' : 'text-slate-500'}`}>
                      {c}
                    </span>
                    {castle === c && (
                        <div className="absolute top-2 right-2 w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                    )}
                  </button>
                ))}
             </div>
          </div>

          {/* Mobile Only Start Button */}
          <div className="block md:hidden pt-4">
             <button
                onClick={handleStart}
                disabled={!mood || !castle}
                className={`w-full py-4 rounded-xl text-xl font-bold shadow-lg transition-all ${
                  mood && castle
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                Begin Quest! ✨
              </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SetupScreen;