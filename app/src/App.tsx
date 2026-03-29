import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { PostForm } from '@/components/PostForm';
import { HeroSection } from '@/sections/HeroSection';
import { HowItWorksSection } from '@/sections/HowItWorksSection';
import { FeedPreviewSection } from '@/sections/FeedPreviewSection';
import { CategoriesSection } from '@/sections/CategoriesSection';
import { SafetySection } from '@/sections/SafetySection';
import { EngagementSection } from '@/sections/EngagementSection';
import { HighlightsSection } from '@/sections/HighlightsSection';
import { FooterSection } from '@/sections/FooterSection';
import { FeedSection } from '@/sections/FeedSection';
import { initializeSampleConfessions } from '@/store/confessionStore';
import { useTheme } from '@/hooks/useTheme';
import type { Category } from '@/types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const { theme } = useTheme();
  const [showPostForm, setShowPostForm] = useState(false);
  const [showFeed, setShowFeed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Initialize sample confessions on mount
  useEffect(() => {
    initializeSampleConfessions();
  }, []);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setShowFeed(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToFeed = () => {
    setShowFeed(true);
    setSelectedCategory(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToPost = () => {
    setShowPostForm(true);
  };

  return (
    <div className={`min-h-screen ${theme}`}>
      <Toaster position="top-center" />
      
      <Header 
        onPostClick={scrollToPost}
        onFeedClick={scrollToFeed}
      />

      <main className="relative">
        {showFeed ? (
          <FeedSection 
            selectedCategory={selectedCategory}
            onClearCategory={() => setSelectedCategory(null)}
          />
        ) : (
          <>
            <HeroSection 
              onPostClick={scrollToPost}
              onFeedClick={scrollToFeed}
            />
            <HowItWorksSection />
            <FeedPreviewSection />
            <CategoriesSection onCategorySelect={handleCategorySelect} />
            <SafetySection />
            <EngagementSection />
            <HighlightsSection />
            <FooterSection 
              onPostClick={scrollToPost}
              onFeedClick={scrollToFeed}
            />
          </>
        )}
      </main>

      <Dialog open={showPostForm} onOpenChange={setShowPostForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto p-0 bg-transparent border-none">
          <PostForm onClose={() => setShowPostForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
