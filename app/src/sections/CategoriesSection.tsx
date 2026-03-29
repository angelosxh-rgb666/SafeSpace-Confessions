import { useState } from 'react';
import { CATEGORIES } from '@/types';
import type { Category } from '@/types';
import { Search, Heart, Frown, GraduationCap, Home, Briefcase, Brain, Lock, Sparkles } from 'lucide-react';

const categoryIcons: Record<Category, typeof Heart> = {
  'Love': Heart,
  'Regret': Frown,
  'School': GraduationCap,
  'Family': Home,
  'Work': Briefcase,
  'Mental Health': Brain,
  'Secrets': Lock,
  'Hope': Sparkles,
};

interface CategoriesSectionProps {
  onCategorySelect: (category: Category) => void;
}

export function CategoriesSection({ onCategorySelect }: CategoriesSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section className="relative w-full py-20 lg:py-32 bg-background z-40">
      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Discover confessions
          </h2>
          
          {/* Search */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, feelings, keywords..."
              className="w-full pl-12 pr-4 py-3 rounded-full bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {CATEGORIES.map((category) => {
            const Icon = categoryIcons[category];
            return (
              <button
                key={category}
                onClick={() => onCategorySelect(category)}
                className="group relative p-6 lg:p-8 rounded-3xl bg-secondary/50 hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all duration-300 text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{category}</h3>
                <p className="text-sm text-muted-foreground">
                  Explore {category.toLowerCase()} confessions
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
