import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ConfessionCard } from '@/components/ConfessionCard';
import { useConfessionStore } from '@/store/confessionStore';
import type { Category } from '@/types';
import { CATEGORIES } from '@/types';
import { Search, Filter, TrendingUp, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

type SortOption = 'newest' | 'popular';

interface FeedSectionProps {
  selectedCategory?: Category | null;
  onClearCategory: () => void;
}

export function FeedSection({ selectedCategory, onClearCategory }: FeedSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | null>(selectedCategory || null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);
  
  const confessions = useConfessionStore(state => state.getActiveConfessions());
  const confessionOfTheDay = useConfessionStore(state => state.getConfessionOfTheDay());
  
  // Update active category when prop changes
  useEffect(() => {
    setActiveCategory(selectedCategory || null);
  }, [selectedCategory]);
  
  // Filter and sort confessions
  const filteredConfessions = confessions
    .filter(c => {
      if (activeCategory && c.category !== activeCategory) return false;
      if (searchQuery) {
        const lower = searchQuery.toLowerCase();
        return c.content.toLowerCase().includes(lower) || 
               c.nickname.toLowerCase().includes(lower);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.createdAt - a.createdAt;
      return b.likes - a.likes;
    });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = section.querySelectorAll('.feed-card');
      gsap.fromTo(cards,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.08,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, [filteredConfessions.length]);

  const handleCategoryClick = (category: Category) => {
    setActiveCategory(activeCategory === category ? null : category);
    onClearCategory();
  };

  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-screen bg-background py-20 lg:py-24 z-[90]"
    >
      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Confession Feed</h2>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search confessions..."
                className="w-full pl-12 pr-4 py-3 rounded-full bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-background transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-full gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
          
          {/* Filter Options */}
          {showFilters && (
            <div className="glass-card p-4 mb-6 space-y-4">
              {/* Categories */}
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className={`category-chip ${activeCategory === category ? 'active' : ''}`}
                    >
                      {category}
                    </button>
                  ))}
                  {activeCategory && (
                    <button
                      onClick={() => {
                        setActiveCategory(null);
                        onClearCategory();
                      }}
                      className="category-chip text-destructive hover:bg-destructive/10"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              
              {/* Sort */}
              <div>
                <label className="text-sm font-medium mb-2 block">Sort by</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy('newest')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${
                      sortBy === 'newest' 
                        ? 'bg-primary text-white' 
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    Newest
                  </button>
                  <button
                    onClick={() => setSortBy('popular')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${
                      sortBy === 'popular' 
                        ? 'bg-primary text-white' 
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    Most Popular
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confession of the Day */}
        {confessionOfTheDay && !activeCategory && !searchQuery && sortBy === 'newest' && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg">⭐</span>
              </div>
              <h3 className="font-semibold">Confession of the Day</h3>
            </div>
            <ConfessionCard confession={confessionOfTheDay} featured />
          </div>
        )}

        {/* Confessions Grid */}
        <div className="max-w-2xl mx-auto space-y-6">
          {filteredConfessions.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">No confessions found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or be the first to post!
              </p>
            </div>
          ) : (
            filteredConfessions.map((confession) => (
              <div key={confession.id} className="feed-card">
                <ConfessionCard confession={confession} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
