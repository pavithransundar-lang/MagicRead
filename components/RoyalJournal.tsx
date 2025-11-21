import React from 'react';
import { Message, Achievement } from '../types';
import { SparkleIcon, CheckIcon } from './Icons';

interface RoyalJournalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: Message[];
  achievements: Achievement[];
}

const RoyalJournal: React.FC<RoyalJournalProps> = ({ isOpen, onClose, entries, achievements }) => {
  const [activeTab, setActiveTab] = React.useState<'messages' | 'badges'>('messages');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#fffbf0] w-full max-w-2xl h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative border-8 border-[#e6d5ac]">
        {/* Book Spine visual effect */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#d4c095] to-[#fffbf0] z-10"></div>
        
        {/* Header */}
        <div className="pt-8 pb-4 px-12 text-center bg-[#fffbf0] border-b border-[#e6d5ac] relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
          <h2 className="text-4xl font-handwriting text-[#8b5e3c]">Royal Journal</h2>
          
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-1 rounded-full text-sm font-bold transition-colors ${
                activeTab === 'messages' ? 'bg-pink-500 text-white' : 'bg-[#f0e6d2] text-[#8b5e3c]'
              }`}
            >
              Messages
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`px-4 py-1 rounded-full text-sm font-bold transition-colors ${
                activeTab === 'badges' ? 'bg-purple-500 text-white' : 'bg-[#f0e6d2] text-[#8b5e3c]'
              }`}
            >
              Achievements
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 pl-14 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/paper.png')]">
          
          {activeTab === 'messages' ? (
            <div className="space-y-6">
              {entries.length === 0 ? (
                <p className="text-center text-gray-400 italic mt-10">No journal entries yet. Start reading to fill your pages!</p>
              ) : (
                entries.slice().reverse().map((entry, idx) => (
                  <div key={entry.id} className="relative pl-6 border-l-2 border-pink-200 pb-2">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-pink-400 rounded-full border-2 border-white"></div>
                    <p className="font-handwriting text-2xl text-gray-800 mb-1">"{entry.text}"</p>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">
                      {new Date(entry.timestamp).toLocaleDateString()} • From Fairy Godmother
                    </span>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {achievements.map((badge) => (
                <div 
                  key={badge.id} 
                  className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 text-center transition-all ${
                    badge.unlockedAt 
                      ? 'bg-white border-yellow-400 shadow-md' 
                      : 'bg-gray-100 border-gray-200 opacity-60 grayscale'
                  }`}
                >
                  <span className="text-4xl mb-2 filter drop-shadow-sm">{badge.icon}</span>
                  <h4 className="font-bold text-xs md:text-sm text-gray-700">{badge.name}</h4>
                  <p className="text-[10px] text-gray-500 leading-tight mt-1">{badge.description}</p>
                  {badge.unlockedAt && (
                    <div className="mt-1 text-yellow-500">
                      <SparkleIcon className="w-4 h-4 inline" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoyalJournal;