export enum Mood {
  HAPPY = 'Happy',
  OKAY = 'Okay',
  TIRED = 'Tired'
}

export enum CastleType {
  CLASSIC = 'Classic',
  FAIRYTALE = 'Fairytale',
  CRYSTAL = 'Crystal',
  FOREST = 'Forest'
}

export interface Message {
  id: string;
  text: string;
  timestamp: number;
  sender: 'user' | 'helper' | 'system';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface AppState {
  isSetup: boolean;
  mood: Mood | null;
  castle: CastleType | null;
  tokens: number; // 0 to 5
  totalTokensEarned: number;
  messages: Message[]; // Helper chat history
  journalEntries: Message[]; // Motivational quotes history
  achievements: Achievement[];
}

export const STEPS = [
  'Butterfly Garden',
  'Magic Forest',
  'Crystal Bridge',
  'Royal Gate',
  'The Royal Castle'
];

export const MAX_TOKENS = 5;