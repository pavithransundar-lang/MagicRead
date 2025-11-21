import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { createHelperChat, sendHelperMessage } from '../services/geminiService';
import { Chat } from '@google/genai';

interface HelperChatProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const HelperChat: React.FC<HelperChatProps> = ({ isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "Hello Princess Celine! I am your Fairy Godmother. How can I help you with your reading quest today? ✨",
      timestamp: Date.now(),
      sender: 'helper'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatSessionRef.current) {
      chatSessionRef.current = createHelperChat();
    }
  }, []);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !chatSessionRef.current) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      timestamp: Date.now(),
      sender: 'user'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const responseText = await sendHelperMessage(chatSessionRef.current, userMsg.text);

    const helperMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: responseText,
      timestamp: Date.now(),
      sender: 'helper'
    };

    setMessages(prev => [...prev, helperMsg]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-pink-300/50 shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 z-40 border-4 border-white ${
          isOpen ? 'bg-pink-600 rotate-90' : 'bg-gradient-to-tr from-pink-400 to-purple-500 animate-pulse-slow'
        }`}
      >
        {isOpen ? (
          <span className="text-3xl text-white">✕</span>
        ) : (
          <span className="text-4xl filter drop-shadow-md">🧚‍♀️</span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[90vw] md:w-96 h-[500px] glass-panel rounded-3xl shadow-2xl flex flex-col overflow-hidden border-4 border-white z-40 animate-in fade-in slide-in-from-bottom-10 duration-300">
          
          {/* Magical Header */}
          <div className="bg-gradient-to-r from-pink-400 to-purple-500 p-4 text-white flex items-center gap-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
            <div className="relative z-10 bg-white/20 p-2 rounded-full backdrop-blur-sm border border-white/30">
              <span className="text-2xl">🧚‍♀️</span>
            </div>
            <div className="relative z-10">
              <h3 className="font-bold font-handwriting text-xl text-white drop-shadow-md">Fairy Godmother</h3>
              <p className="text-[10px] uppercase tracking-widest opacity-90 font-bold">Magical Helper</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm relative ${
                    msg.sender === 'user'
                      ? 'bg-purple-500 text-white rounded-tr-none'
                      : 'bg-white text-purple-900 rounded-tl-none border border-pink-100'
                  }`}
                >
                  {msg.text}
                  {/* Little tail for bubbles */}
                  <div className={`absolute top-0 w-3 h-3 ${msg.sender === 'user' ? '-right-1 bg-purple-500' : '-left-1 bg-white border-l border-t border-pink-100'} transform rotate-45 -z-10`}></div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-pink-100 shadow-sm flex gap-2 items-center">
                   <span className="text-xs text-pink-400 font-bold">Casting spell...</span>
                   <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce delay-150"></div>
                   </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white/90 backdrop-blur border-t border-pink-100">
            <div className="flex gap-2 items-center bg-gray-50 rounded-full px-2 py-1 border border-gray-200 focus-within:border-pink-300 focus-within:ring-2 focus-within:ring-pink-100 transition-all">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask for magic help..."
                className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none text-gray-700 placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50 disabled:scale-100"
              >
                ➤
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default HelperChat;