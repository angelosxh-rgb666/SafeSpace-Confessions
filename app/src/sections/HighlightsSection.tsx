import { Trophy, Heart, MessageCircle, Eye } from 'lucide-react';

const sampleConfessions = [
  {
    id: 'highlight-1',
    content: "I'm learning to be okay alone. It's hard but I'm discovering who I really am.",
    nickname: "Shadow Walker",
    category: "Mental Health",
    mood: "😌 Peaceful",
    sentiment: "happy",
    likes: 128,
    comments: 15,
    views: 892,
  },
  {
    id: 'highlight-2',
    content: "I forgave someone who never apologized. Not for them, but for my own peace.",
    nickname: "Silent Voice",
    category: "Hope",
    mood: "😊 Happy",
    sentiment: "happy",
    likes: 203,
    comments: 28,
    views: 1456,
  },
  {
    id: 'highlight-3',
    content: "Small progress is still progress. Today I got out of bed when I didn't want to.",
    nickname: "Hidden Truth",
    category: "Mental Health",
    mood: "😊 Happy",
    sentiment: "happy",
    likes: 96,
    comments: 12,
    views: 634,
  },
];

const sentimentColors: Record<string, string> = {
  happy: 'text-green-500',
  sad: 'text-blue-500',
  angry: 'text-red-500',
  anxious: 'text-yellow-500',
  loving: 'text-pink-500',
  neutral: 'text-gray-500'
};

export function HighlightsSection() {
  return (
    <section className="relative w-full py-20 lg:py-32 bg-[hsl(var(--background-secondary))] z-[70]">
      {/* Title */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md mb-4">
          <Trophy className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">This Week on SafeSpace</span>
        </div>
      </div>

      {/* Cards */}
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 max-w-6xl mx-auto">
          {sampleConfessions.map((confession) => (
            <div key={confession.id} className="w-full lg:w-1/3 max-w-sm glass-card p-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">
                  {confession.mood.split(' ')[0]}
                </div>
                <div>
                  <p className="font-medium text-sm">{confession.nickname}</p>
                  <p className="text-xs text-muted-foreground">Just now</p>
                </div>
              </div>

              {/* Category & Sentiment */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {confession.category}
                </span>
                <span className={`text-xs font-medium ${sentimentColors[confession.sentiment]}`}>
                  {confession.sentiment}
                </span>
              </div>

              {/* Content */}
              <p className="text-sm leading-relaxed mb-4">{confession.content}</p>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {confession.views}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <button className="flex items-center gap-1 text-sm hover:text-primary transition-colors">
                  <Heart className="w-4 h-4" />
                  <span>{confession.likes}</span>
                </button>
                <button className="flex items-center gap-1 text-sm hover:text-primary transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>{confession.comments}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mascot */}
      <img 
        src="/cloud-mascot.png"
        alt="SafeSpace Mascot"
        className="mx-auto mt-12 w-[20vw] max-w-[150px]"
      />
    </section>
  );
}
