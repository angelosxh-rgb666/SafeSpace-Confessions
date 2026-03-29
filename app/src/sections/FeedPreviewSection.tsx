import { Heart, MessageCircle, Eye } from 'lucide-react';

const sampleConfessions = [
  {
    id: 'preview-1',
    content: "I finally told my friend I'm not okay and they actually listened. It felt like a weight lifted off my chest.",
    nickname: "Quiet Soul",
    category: "Mental Health",
    mood: "😌 Peaceful",
    sentiment: "sad",
    likes: 24,
    comments: 3,
    views: 156,
  },
  {
    id: 'preview-2',
    content: "I'm scared to graduate. Everyone seems excited but I feel like I'm losing my safety net.",
    nickname: "Midnight Thinker",
    category: "School",
    mood: "😰 Anxious",
    sentiment: "anxious",
    likes: 41,
    comments: 7,
    views: 289,
  },
  {
    id: 'preview-3',
    content: "I said sorry to my sister after years of not talking. It was awkward but I'm glad I did it.",
    nickname: "Anonymous Heart",
    category: "Family",
    mood: "😊 Happy",
    sentiment: "happy",
    likes: 17,
    comments: 2,
    views: 98,
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

export function FeedPreviewSection() {
  return (
    <section className="relative w-full py-20 lg:py-32 bg-[hsl(var(--background-secondary))] z-30">
      {/* Title */}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12">
        The feed
      </h2>

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
