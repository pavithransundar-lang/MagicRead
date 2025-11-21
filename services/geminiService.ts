import { GoogleGenAI, Chat } from "@google/genai";
import { Message } from '../types';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

export const generateMotivationalMessage = async (mood: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Write a very short, encouraging, princess-themed motivational message for a child named Celine who just finished a reading task. 
      She is feeling ${mood}. 
      The message must be under 15 words. 
      Do not use quotes. 
      Example: "You are reading like a true queen, Celine!"`,
    });
    return response.text?.trim() || "You are doing great, Princess Celine!";
  } catch (error) {
    console.error("Error generating motivation:", error);
    return "Keep shining, Princess Celine!";
  }
};

export const createHelperChat = () => {
  return ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: `You are a magical Fairy Godmother helper for a young girl named Celine. 
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