
import { GoogleGenAI, Chat } from "@google/genai";
import { Message } from '../types';

const MODEL_NAME = 'gemini-2.5-flash';

// Helper to get the AI instance safely
const getAI = () => {
  const apiKey = process.env.API_KEY || '';
  return new GoogleGenAI({ apiKey });
};

export const generateMotivationalMessage = async (name: string, mood: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Write a very short, encouraging, princess-themed motivational message for a child named ${name} who just finished a reading task. 
      The child is feeling ${mood}. 
      The message must be under 15 words. 
      Do not use quotes. 
      Example: "You are reading like a true queen, ${name}!"`,
    });
    return response.text?.trim() || `You are doing great, Princess ${name}!`;
  } catch (error) {
    console.error("Error generating motivation:", error);
    return `Keep shining, Princess ${name}!`;
  }
};

export const createHelperChat = (name: string) => {
  const ai = getAI();
  return ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: `You are a magical Fairy Godmother helper for a young girl named ${name}. 
      Your tone is warm, encouraging, magical, and simple. 
      Use emojis like ✨, 🦋, 👑. 
      Keep responses short (under 2 sentences) and easy to read.`,
    },
  });
};

export const sendHelperMessage = async (chat: Chat, text: string): Promise<string> => {
  try {
    const response = await chat.sendMessage({ message: text });
    return response.text?.trim() || "Magic is everywhere! ✨";
  } catch (error) {
    console.error("Error sending message:", error);
    return "Oh my! The magic dust settled... try again? ✨";
  }
};
