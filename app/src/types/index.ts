// SafeSpace Confessions - Type Definitions

export type Category = 
  | 'Love' 
  | 'Regret' 
  | 'School' 
  | 'Family' 
  | 'Work' 
  | 'Mental Health' 
  | 'Secrets' 
  | 'Hope';

export type Mood = 
  | '😊 Happy' 
  | '😢 Sad' 
  | '😠 Angry' 
  | '😰 Anxious' 
  | '😌 Peaceful' 
  | '😍 Loving' 
  | '😔 Regretful' 
  | '🤔 Confused';

export type Sentiment = 'happy' | 'sad' | 'angry' | 'anxious' | 'neutral' | 'loving';

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Comment {
  id: string;
  confessionId: string;
  content: string;
  nickname: string;
  createdAt: number;
  likes: number;
  isDeleted?: boolean;
}

export interface Confession {
  id: string;
  content: string;
  nickname: string;
  category: Category;
  mood: Mood;
  sentiment: Sentiment;
  createdAt: number;
  expiresAt: number | null;
  likes: number;
  reactions: Record<string, number>;
  comments: Comment[];
  isPrivate: boolean;
  shareToken?: string;
  views: number;
  isDeleted?: boolean;
  isFlagged?: boolean;
  flagReason?: string;
  poll?: Poll;
  userIp?: string;
}

export interface ConfessionFormData {
  content: string;
  nickname: string;
  category: Category;
  mood: Mood;
  isPrivate: boolean;
  expiresIn: number | null;
  includePoll: boolean;
  pollQuestion?: string;
  pollOptions?: string[];
}

export interface AdminStats {
  totalConfessions: number;
  totalComments: number;
  totalLikes: number;
  activeCategories: Record<Category, number>;
  peakHours: Record<number, number>;
  flaggedContent: number;
  bannedIps: string[];
}

export const CATEGORIES: Category[] = [
  'Love',
  'Regret',
  'School',
  'Family',
  'Work',
  'Mental Health',
  'Secrets',
  'Hope'
];

export const MOODS: Mood[] = [
  '😊 Happy',
  '😢 Sad',
  '😠 Angry',
  '😰 Anxious',
  '😌 Peaceful',
  '😍 Loving',
  '😔 Regretful',
  '🤔 Confused'
];

export const REACTIONS = ['💙', '🫂', '✨', '🔥', '😢', '😠'];

export const GENERATED_NICKNAMES = [
  'Quiet Soul',
  'Midnight Thinker',
  'Anonymous Heart',
  'Silent Voice',
  'Hidden Truth',
  'Shadow Walker',
  'Dreamer Unknown',
  'Secret Keeper',
  'Lost Wanderer',
  'Gentle Spirit',
  'Moonlight Whisper',
  'Ocean Deep',
  'Star Gazer',
  'Rainy Day',
  'Coffee Shop',
  'Late Night',
  'Early Bird',
  'Day Dreamer',
  'Night Owl',
  'Free Spirit'
];

export function generateNickname(): string {
  return GENERATED_NICKNAMES[Math.floor(Math.random() * GENERATED_NICKNAMES.length)];
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function analyzeSentiment(content: string): Sentiment {
  const lower = content.toLowerCase();
  
  const happyWords = ['happy', 'joy', 'love', 'amazing', 'great', 'wonderful', 'excited', 'grateful', 'blessed'];
  const sadWords = ['sad', 'depressed', 'lonely', 'hurt', 'pain', 'crying', 'tears', 'miss', 'lost'];
  const angryWords = ['angry', 'mad', 'hate', 'furious', 'annoyed', 'frustrated', 'rage'];
  const anxiousWords = ['anxious', 'worried', 'scared', 'nervous', 'afraid', 'panic', 'stress'];
  const lovingWords = ['love', 'adore', 'cherish', 'affection', 'romance', 'heart'];
  
  let scores = {
    happy: happyWords.filter(w => lower.includes(w)).length,
    sad: sadWords.filter(w => lower.includes(w)).length,
    angry: angryWords.filter(w => lower.includes(w)).length,
    anxious: anxiousWords.filter(w => lower.includes(w)).length,
    loving: lovingWords.filter(w => lower.includes(w)).length,
    neutral: 0
  };
  
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) return 'neutral';
  
  return Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0] as Sentiment;
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
