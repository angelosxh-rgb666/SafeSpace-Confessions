import { Shield, ArrowRight } from 'lucide-react';

export function SafetySection() {
  return (
    <section className="relative w-full py-20 lg:py-32 bg-[hsl(var(--background-secondary))] z-50">
      {/* Large Radial Glow */}
      <div className="absolute inset-0 gradient-radial opacity-70 pointer-events-none" />
      
      {/* Content */}
      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-lg mb-8">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            You&apos;re safe here
          </h2>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
            No names. No tracking. Just people being honest. 
            We keep it kind with community moderation and clear guidelines.
          </p>
          
          <button className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-300">
            Read our community guidelines
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Mascot */}
        <img 
          src="/cloud-mascot.png"
          alt="SafeSpace Mascot"
          className="mx-auto mt-12 w-[20vw] max-w-[200px]"
        />
      </div>
    </section>
  );
}
