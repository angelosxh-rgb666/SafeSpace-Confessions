import { Button } from '@/components/ui/button';
import { Plus, Compass, Cloud, Heart } from 'lucide-react';

interface FooterSectionProps {
  onPostClick: () => void;
  onFeedClick: () => void;
}

export function FooterSection({ onPostClick, onFeedClick }: FooterSectionProps) {
  return (
    <section className="relative w-full bg-background z-[80]">
      {/* CTA Block */}
      <div className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 xl:px-12 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Ready to let it out?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Write your first confession. It stays between you and the community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
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
              Browse the feed
            </Button>
          </div>
          
          {/* Comforting Message */}
          <p className="mt-8 text-sm text-muted-foreground italic">
            &ldquo;You&apos;re not alone. Someone out there understands.&rdquo;
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 xl:px-12 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                SafeSpace
              </span>
            </div>

            {/* Links */}
            <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <button className="hover:text-foreground transition-colors">About</button>
              <button className="hover:text-foreground transition-colors">Guidelines</button>
              <button className="hover:text-foreground transition-colors">Safety</button>
              <button className="hover:text-foreground transition-colors">Contact</button>
              <button className="hover:text-foreground transition-colors">Privacy</button>
            </nav>

            {/* Copyright */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-destructive fill-current" />
              <span>for everyone</span>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}
