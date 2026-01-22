
import React, { useState, useEffect, useMemo } from 'react';
import SetupScreen from './components/SetupScreen';
import QuestBoard from './components/QuestBoard';
import ButterflyGame from './components/ButterflyGame';
import HelperChat from './components/HelperChat';
import RoyalJournal from './components/RoyalJournal';
import Finale from './components/Finale';
import { AppState, Mood, CastleType, Achievement, Message, MAX_TOKENS } from './types';
import { generateMotivationalMessage } from './services/geminiService';
import { SparkleIcon } from './components/Icons';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_flutter', name: 'First Flutter', description: 'Caught your first butterfly', icon: '🦋' },
  { id: 'halfway', name: 'Halfway Hero', description: 'Reached the Crystal Bridge', icon: '🌉' },
  { id: 'quest_champ', name: 'Quest Champion', description: 'Completed a full journey', icon: '👑' },
  { id: 'bookworm', name: 'Royal Bookworm', description: 'Earned 20 total tokens', icon: '📚' },
];

const StarBackground: React.FC<{ show: boolean }> = React.memo(({ show }) => {
  const stars = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5 + 's',
      duration: Math.random() * 3 + 2 + 's'
    }));
  }, []);

  const shootingStars = useMemo(() => {
    return Array.from({ length: 4 }).map((_, i) => ({
        id: `shoot-${i}`,
        top: Math.random() * 40,
        left: Math.random() * 50 + 50,
        delay: Math.random() * 15 + 's'
    }));
  }, []);

  return (
    <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 z-0 ${show ? 'opacity-100' : 'opacity-0'}`}>
      {stars.map(s => (
        <div
          key={s.id}
          className="star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            '--delay': s.delay,
            '--duration': s.duration
          } as React.CSSProperties}
        />
      ))}
      {shootingStars.map(s => (
          <div 
            key={s.id}
            className="shooting-star"
            style={{
                top: `${s.top}%`,
                left: `${s.left}%`,
                '--delay': s.delay
            } as React.CSSProperties}
          />
      ))}
    </div>
  );
});

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(() => {
    try {
        const saved = localStorage.getItem('royalQuestState');
        if (saved) {
          return JSON.parse(saved);
        }
    } catch (e) {
        console.error("Failed to load save state", e);
    }
    return {
      isSetup: false,
      userName: '',
      mood: null,
      castle: null,
      tokens: 0,
      totalTokensEarned: 0,
      messages: [],
      journalEntries: [],
      achievements: INITIAL_ACHIEVEMENTS
    };
  });

  const [showGame, setShowGame] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [loadingMotivation, setLoadingMotivation] = useState(false);

  useEffect(() => {
    localStorage.setItem('royalQuestState', JSON.stringify(appState));
  }, [appState]);
  
  useEffect(() => {
      if (typeof process !== 'undefined' && process.env && !process.env.API_KEY) {
          console.warn("Warning: API_KEY is missing in environment variables.");
      }
  }, []);

  const handleSetupComplete = (name: string, mood: Mood, castle: CastleType) => {
    setAppState(prev => ({
      ...prev,
      isSetup: true,
      userName: name,
      mood,
      castle,
      tokens: 0
    }));
  };

  const handleCatchButterfly = () => {
    setShowGame(true);
  };

  const handleButterflyCaught = async () => {
    setShowGame(false);
    
    let newTokens = appState.tokens + 1;
    let newTotal = appState.totalTokensEarned + 1;
    let newAchievements = [...appState.achievements];

    if (newTotal === 1) {
        const idx = newAchievements.findIndex(a => a.id === 'first_flutter');
        if (idx > -1 && !newAchievements[idx].unlockedAt) newAchievements[idx].unlockedAt = Date.now();
    }
    if (newTokens === 3) {
       const idx = newAchievements.findIndex(a => a.id === 'halfway');
       if (idx > -1 && !newAchievements[idx].unlockedAt) newAchievements[idx].unlockedAt = Date.now();
    }
    if (newTokens === MAX_TOKENS) {
       const idx = newAchievements.findIndex(a => a.id === 'quest_champ');
       if (idx > -1 && !newAchievements[idx].unlockedAt) newAchievements[idx].unlockedAt = Date.now();
    }
    if (newTotal >= 20) {
       const idx = newAchievements.findIndex(a => a.id === 'bookworm');
       if (idx > -1 && !newAchievements[idx].unlockedAt) newAchievements[idx].unlockedAt = Date.now();
    }

    setLoadingMotivation(true);
    
    const motivationText = await generateMotivationalMessage(appState.userName, appState.mood || 'Happy');
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: motivationText,
      timestamp: Date.now(),
      sender: 'system'
    };

    setAppState(prev => ({
      ...prev,
      tokens: newTokens,
      totalTokensEarned: newTotal,
      achievements: newAchievements,
      journalEntries: [...prev.journalEntries, newMessage]
    }));

    setLoadingMotivation(false);
  };

  const handleReset = () => {
    setAppState(prev => ({
      ...prev,
      tokens: 0,
      isSetup: false
    }));
  };

  const getThemeGradient = (castle: CastleType | null) => {
    switch (castle) {
      case CastleType.FAIRYTALE: return 'bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900';
      case CastleType.CRYSTAL: return 'bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-900';
      case CastleType.FOREST: return 'bg-gradient-to-br from-green-100 via-yellow-50 to-emerald-100';
      case CastleType.CLASSIC:
      default: return 'bg-gradient-to-br from-pink-100 via-white to-purple-100';
    }
  };
  
  const isNightTheme = appState.castle === CastleType.FAIRYTALE || appState.castle === CastleType.CRYSTAL;

  if (!appState.isSetup) {
    return (
      <div className={`min-h-screen relative transition-colors duration-1000 ${getThemeGradient(null)}`}>
        <SetupScreen onComplete={handleSetupComplete} />
      </div>
    );
  }

  if (appState.tokens >= MAX_TOKENS) {
    return <Finale userName={appState.userName} castle={appState.castle || CastleType.CLASSIC} onReset={handleReset} />;
  }

  return (
    <div className={`min-h-screen relative pb-20 transition-colors duration-1000 ${getThemeGradient(appState.castle)}`}>
      
      <div className="fixed inset-0 -z-20 pointer-events-none" />
      <StarBackground show={isNightTheme} />

      <nav className="flex justify-between items-center p-6 relative z-10">
        <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-full">
            <span className="text-2xl animate-bounce-slow">👑</span>
            <h1 className="font-handwriting text-2xl font-bold text-purple-900 hidden md:block">
              {appState.userName}'s Reading Quest
            </h1>
        </div>
        <button 
            onClick={() => setShowJournal(true)}
            className="group flex items-center gap-2 bg-white/80 backdrop-blur-sm px-5 py-2 rounded-full shadow-sm border border-white hover:bg-pink-50 transition-all hover:shadow-md hover:-translate-y-0.5"
        >
            <span className="text-xl group-hover:scale-110 transition-transform">📖</span>
            <span className="font-bold text-purple-900/70 group-hover:text-purple-900">Journal</span>
        </button>
      </nav>

      <main className="container mx-auto px-4 py-2 relative z-10">
        <QuestBoard 
            tokens={appState.tokens} 
            castle={appState.castle || CastleType.CLASSIC}
            latestMessage={appState.journalEntries[appState.journalEntries.length - 1]}
            onCatchButterfly={handleCatchButterfly}
        />
      </main>

      {loadingMotivation && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 glass-panel px-8 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3 animate-pulse border-2 border-pink-200">
              <SparkleIcon className="w-6 h-6 text-yellow-400 animate-spin-slow" />
              <span className="text-purple-800 font-bold font-handwriting text-xl">Fairy Godmother is writing...</span>
          </div>
      )}

      {showGame && (
        <ButterflyGame onCatch={handleButterflyCaught} onClose={() => setShowGame(false)} />
      )}

      <RoyalJournal 
        isOpen={showJournal} 
        onClose={() => setShowJournal(false)}
        entries={appState.journalEntries}
        achievements={appState.achievements}
      />

      <HelperChat 
        isOpen={showChat} 
        setIsOpen={setShowChat} 
        userName={appState.userName}
      />

    </div>
  );
};

export default App;
