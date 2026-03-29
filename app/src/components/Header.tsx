import { useTheme } from '@/hooks/useTheme';
import { Cloud, Moon, Sun, Plus, Menu, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useConfessionStore } from '@/store/confessionStore';

interface HeaderProps {
  onPostClick: () => void;
  onFeedClick: () => void;
}

export function Header({ onPostClick, onFeedClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const adminMode = useConfessionStore(state => state.adminMode);
  const setAdminMode = useConfessionStore(state => state.setAdminMode);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 safe-transition ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-xl shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:block" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              SafeSpace
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={onFeedClick}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Feed
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
            <Button 
              onClick={onPostClick}
              className="rounded-full px-6 gap-2"
            >
              <Plus className="w-4 h-4" />
              Post
            </Button>
            <button
              onClick={() => setAdminMode(!adminMode)}
              className={`p-2 rounded-xl transition-colors ${
                adminMode ? 'bg-primary text-white' : 'hover:bg-secondary'
              }`}
              aria-label="Admin mode"
            >
              <Shield className="w-5 h-5" />
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border">
          <div className="px-4 py-4 space-y-3">
            <button 
              onClick={() => {
                onFeedClick();
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm font-medium"
            >
              Feed
            </button>
            <button 
              onClick={() => {
                toggleTheme();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full py-2 text-sm font-medium"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
            <Button 
              onClick={() => {
                onPostClick();
                setIsMobileMenuOpen(false);
              }}
              className="w-full rounded-full gap-2"
            >
              <Plus className="w-4 h-4" />
              Post a Confession
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
