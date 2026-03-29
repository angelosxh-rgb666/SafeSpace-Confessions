import { Compass, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onPostClick: () => void;
  onFeedClick: () => void;
}

export function HeroSection({ onPostClick, onFeedClick }: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-screen gradient-hero overflow-hidden z-10">
      {/* Decorative Clouds */}
      <div className="absolute left-[6vw] top-[72vh] w-[10vw] opacity-30">
        <svg viewBox="0 0 100 60" className="w-full">
          <ellipse cx="30" cy="40" rx="25" ry="18" fill="currentColor" className="text-primary/30" />
          <ellipse cx="55" cy="35" rx="30" ry="22" fill="currentColor" className="text-primary/30" />
          <ellipse cx="75" cy="42" rx="20" ry="15" fill="currentColor" className="text-primary/30" />
        </svg>
      </div>
      <div className="absolute right-[12vw] top-[12vh] w-[8vw] opacity-25">
        <svg viewBox="0 0 100 60" className="w-full">
          <ellipse cx="25" cy="38" rx="22" ry="16" fill="currentColor" className="text-primary/30" />
          <ellipse cx="50" cy="32" rx="28" ry="20" fill="currentColor" className="text-primary/30" />
          <ellipse cx="72" cy="38" rx="18" ry="14" fill="currentColor" className="text-primary/30" />
        </svg>
      </div>

      {/* Content Container */}
      <div className="relative w-full min-h-screen flex items-center pt-20">
        {/* Text Block */}
        <div className="absolute left-[8vw] top-[18vh] w-[90%] max-w-xl lg:w-[34vw]">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Share your story
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8">
            Anonymous confessions. Real support. Zero judgment.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={onPostClick}
              size="lg"
              className="rounded-full px-8 gap-2"
            >
              <Plus className="w-5 h-5" />
              Post a confession
            </Button>
            <Button 
              onClick={onFeedClick}
              variant="outline"
              size="lg"
              className="rounded-full px-8 gap-2"
            >
              <Compass className="w-5 h-5" />
              Explore the feed
            </Button>
          </div>
          
          {/* Comforting Message */}
          <p className="mt-8 text-sm text-muted-foreground italic">
            &ldquo;You&apos;re not alone. Someone out there understands.&rdquo;
          </p>
        </div>

        {/* Post Card Preview - Desktop Only */}
        <div className="hidden lg:block absolute left-[52vw] top-[16vh] w-[40vw] max-w-lg glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">What&apos;s on your mind?</h3>
          <div className="h-32 rounded-xl bg-secondary/50 mb-4 flex items-center justify-center text-muted-foreground text-sm">
            Write freely. No names attached.
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {['Love', 'School', 'Family', 'Secrets'].map((cat) => (
              <span 
                key={cat}
                className="px-3 py-1 rounded-full text-xs bg-secondary"
              >
                {cat}
              </span>
            ))}
          </div>
          <Button className="w-full rounded-full">
            Post anonymously
          </Button>
        </div>

        {/* Mascot */}
        <img 
          src="/cloud-mascot.png"
          alt="SafeSpace Mascot"
          className="absolute left-[42vw] bottom-[10vh] w-[30vw] max-w-[200px] lg:w-[18vw]"
        />
      </div>
    </section>
  );
}
