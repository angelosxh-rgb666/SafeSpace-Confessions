import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Confession, Comment, ConfessionFormData, Category } from '@/types';
import { 
  generateId, 
  generateNickname, 
  analyzeSentiment
} from '@/types';

interface ConfessionState {
  confessions: Confession[];
  likedConfessions: string[];
  votedPolls: Record<string, string>;
  bannedIps: string[];
  adminMode: boolean;
  
  // Actions
  addConfession: (data: ConfessionFormData, userIp?: string) => Confession;
  deleteConfession: (id: string) => void;
  likeConfession: (id: string) => void;
  addComment: (confessionId: string, content: string, nickname?: string) => Comment;
  deleteComment: (confessionId: string, commentId: string) => void;
  flagConfession: (id: string, reason: string) => void;
  unflagConfession: (id: string) => void;
  votePoll: (confessionId: string, optionId: string) => void;
  incrementViews: (id: string) => void;
  banIp: (ip: string) => void;
  unbanIp: (ip: string) => void;
  setAdminMode: (enabled: boolean) => void;
  
  // Getters
  getConfessionById: (id: string) => Confession | undefined;
  getConfessionByToken: (token: string) => Confession | undefined;
  getTopConfessions: (limit?: number) => Confession[];
  getConfessionOfTheDay: () => Confession | undefined;
  getConfessionsByCategory: (category: Category) => Confession[];
  getFilteredConfessions: (search: string, category?: Category) => Confession[];
  getFlaggedConfessions: () => Confession[];
  getActiveConfessions: () => Confession[];
  getStats: () => {
    totalConfessions: number;
    totalComments: number;
    totalLikes: number;
    activeCategories: Record<Category, number>;
    peakHours: Record<number, number>;
    flaggedContent: number;
  };
}

const EXPIRY_OPTIONS: Record<number, number> = {
  24: 24 * 60 * 60 * 1000,
  48: 48 * 60 * 60 * 1000,
  72: 72 * 60 * 60 * 1000,
};

export const useConfessionStore = create<ConfessionState>()(
  persist(
    (set, get) => ({
      confessions: [],
      likedConfessions: [],
      votedPolls: {},
      bannedIps: [],
      adminMode: false,

      addConfession: (data, userIp) => {
        const now = Date.now();
        const confession: Confession = {
          id: generateId(),
          content: data.content,
          nickname: data.nickname || generateNickname(),
          category: data.category,
          mood: data.mood,
          sentiment: analyzeSentiment(data.content),
          createdAt: now,
          expiresAt: data.expiresIn ? now + EXPIRY_OPTIONS[data.expiresIn] : null,
          likes: 0,
          reactions: {},
          comments: [],
          isPrivate: data.isPrivate,
          shareToken: data.isPrivate ? generateId() : undefined,
          views: 0,
          isDeleted: false,
          isFlagged: false,
          userIp,
          poll: data.includePoll && data.pollQuestion ? {
            id: generateId(),
            question: data.pollQuestion,
            options: (data.pollOptions || []).map(text => ({
              id: generateId(),
              text,
              votes: 0
            })),
            totalVotes: 0
          } : undefined
        };

        set(state => ({
          confessions: [confession, ...state.confessions]
        }));

        return confession;
      },

      deleteConfession: (id) => {
        set(state => ({
          confessions: state.confessions.map(c => 
            c.id === id ? { ...c, isDeleted: true } : c
          )
        }));
      },

      likeConfession: (id) => {
        const { likedConfessions } = get();
        const isLiked = likedConfessions.includes(id);

        set(state => ({
          confessions: state.confessions.map(c =>
            c.id === id 
              ? { ...c, likes: c.likes + (isLiked ? -1 : 1) }
              : c
          ),
          likedConfessions: isLiked
            ? state.likedConfessions.filter(lid => lid !== id)
            : [...state.likedConfessions, id]
        }));
      },

      addComment: (confessionId, content, nickname) => {
        const comment: Comment = {
          id: generateId(),
          confessionId,
          content,
          nickname: nickname || generateNickname(),
          createdAt: Date.now(),
          likes: 0
        };

        set(state => ({
          confessions: state.confessions.map(c =>
            c.id === confessionId
              ? { ...c, comments: [...c.comments, comment] }
              : c
          )
        }));

        return comment;
      },

      deleteComment: (confessionId, commentId) => {
        set(state => ({
          confessions: state.confessions.map(c =>
            c.id === confessionId
              ? { ...c, comments: c.comments.map(cm => 
                  cm.id === commentId ? { ...cm, isDeleted: true } : cm
                )}
              : c
          )
        }));
      },

      flagConfession: (id, reason) => {
        set(state => ({
          confessions: state.confessions.map(c =>
            c.id === id ? { ...c, isFlagged: true, flagReason: reason } : c
          )
        }));
      },

      unflagConfession: (id) => {
        set(state => ({
          confessions: state.confessions.map(c =>
            c.id === id ? { ...c, isFlagged: false, flagReason: undefined } : c
          )
        }));
      },

      votePoll: (confessionId, optionId) => {
        const { votedPolls } = get();
        if (votedPolls[confessionId]) return;

        set(state => ({
          confessions: state.confessions.map(c =>
            c.id === confessionId && c.poll
              ? {
                  ...c,
                  poll: {
                    ...c.poll,
                    options: c.poll.options.map(o =>
                      o.id === optionId ? { ...o, votes: o.votes + 1 } : o
                    ),
                    totalVotes: c.poll.totalVotes + 1
                  }
                }
              : c
          ),
          votedPolls: { ...state.votedPolls, [confessionId]: optionId }
        }));
      },

      incrementViews: (id) => {
        set(state => ({
          confessions: state.confessions.map(c =>
            c.id === id ? { ...c, views: c.views + 1 } : c
          )
        }));
      },

      banIp: (ip) => {
        set(state => ({
          bannedIps: [...state.bannedIps, ip]
        }));
      },

      unbanIp: (ip) => {
        set(state => ({
          bannedIps: state.bannedIps.filter(banned => banned !== ip)
        }));
      },

      setAdminMode: (enabled) => {
        set({ adminMode: enabled });
      },

      getConfessionById: (id) => {
        return get().confessions.find(c => c.id === id && !c.isDeleted);
      },

      getConfessionByToken: (token) => {
        return get().confessions.find(c => c.shareToken === token && !c.isDeleted);
      },

      getTopConfessions: (limit = 5) => {
        return get().confessions
          .filter(c => !c.isDeleted && !c.isPrivate)
          .sort((a, b) => b.likes - a.likes)
          .slice(0, limit);
      },

      getConfessionOfTheDay: () => {
        const active = get().confessions.filter(c => 
          !c.isDeleted && !c.isPrivate && c.likes > 10
        );
        if (active.length === 0) return undefined;
        
        const today = new Date().getDate();
        return active[today % active.length];
      },

      getConfessionsByCategory: (category) => {
        return get().confessions.filter(c => 
          c.category === category && !c.isDeleted && !c.isPrivate
        );
      },

      getFilteredConfessions: (search, category) => {
        const lower = search.toLowerCase();
        return get().confessions.filter(c => {
          if (c.isDeleted || c.isPrivate) return false;
          if (category && c.category !== category) return false;
          return c.content.toLowerCase().includes(lower) ||
                 c.nickname.toLowerCase().includes(lower);
        });
      },

      getFlaggedConfessions: () => {
        return get().confessions.filter(c => c.isFlagged && !c.isDeleted);
      },

      getActiveConfessions: () => {
        const now = Date.now();
        return get().confessions.filter(c => 
          !c.isDeleted && 
          !c.isPrivate &&
          (!c.expiresAt || c.expiresAt > now)
        );
      },

      getStats: () => {
        const confessions = get().confessions.filter(c => !c.isDeleted);
        const comments = confessions.flatMap(c => c.comments);
        
        const activeCategories = {} as Record<Category, number>;
        confessions.forEach(c => {
          activeCategories[c.category] = (activeCategories[c.category] || 0) + 1;
        });

        const peakHours: Record<number, number> = {};
        confessions.forEach(c => {
          const hour = new Date(c.createdAt).getHours();
          peakHours[hour] = (peakHours[hour] || 0) + 1;
        });

        return {
          totalConfessions: confessions.length,
          totalComments: comments.length,
          totalLikes: confessions.reduce((sum, c) => sum + c.likes, 0),
          activeCategories,
          peakHours,
          flaggedContent: confessions.filter(c => c.isFlagged).length
        };
      }
    }),
    {
      name: 'safespace-confessions',
      partialize: (state) => ({
        confessions: state.confessions,
        likedConfessions: state.likedConfessions,
        votedPolls: state.votedPolls,
        bannedIps: state.bannedIps
      })
    }
  )
);

// Initialize with sample confessions if empty
export function initializeSampleConfessions() {
  const store = useConfessionStore.getState();
  
  if (store.confessions.length === 0) {
    const sampleConfessions = [
      {
        content: "I finally told my friend I'm not okay and they actually listened. It felt like a weight lifted off my chest.",
        nickname: "Quiet Soul",
        category: "Mental Health" as Category,
        mood: "😌 Peaceful" as const,
        isPrivate: false,
        expiresIn: null as number | null,
        includePoll: false
      },
      {
        content: "I'm scared to graduate. Everyone seems excited but I feel like I'm losing my safety net.",
        nickname: "Midnight Thinker",
        category: "School" as Category,
        mood: "😰 Anxious" as const,
        isPrivate: false,
        expiresIn: null,
        includePoll: false
      },
      {
        content: "I said sorry to my sister after years of not talking. It was awkward but I'm glad I did it.",
        nickname: "Anonymous Heart",
        category: "Family" as Category,
        mood: "😊 Happy" as const,
        isPrivate: false,
        expiresIn: null,
        includePoll: false
      },
      {
        content: "I forgave someone who never apologized. Not for them, but for my own peace.",
        nickname: "Silent Voice",
        category: "Hope" as Category,
        mood: "😌 Peaceful" as const,
        isPrivate: false,
        expiresIn: null,
        includePoll: false
      },
      {
        content: "Small progress is still progress. Today I got out of bed when I didn't want to.",
        nickname: "Hidden Truth",
        category: "Mental Health" as Category,
        mood: "😊 Happy" as const,
        isPrivate: false,
        expiresIn: null,
        includePoll: false
      },
      {
        content: "I'm learning to be okay alone. It's hard but I'm discovering who I really am.",
        nickname: "Shadow Walker",
        category: "Mental Health" as Category,
        mood: "😌 Peaceful" as const,
        isPrivate: false,
        expiresIn: null,
        includePoll: false
      }
    ];

    sampleConfessions.forEach((confession, index) => {
      setTimeout(() => {
        const created = store.addConfession(confession);
        // Add some initial likes
        for (let i = 0; i < Math.floor(Math.random() * 50) + 10; i++) {
          store.likeConfession(created.id);
        }
      }, index * 100);
    });
  }
}
