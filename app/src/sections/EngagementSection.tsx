import { Heart, MessageCircle, Bookmark } from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Send love',
    description: 'A simple reaction can mean everything.',
  },
  {
    icon: MessageCircle,
    title: 'Comment kindly',
    description: 'Replies are anonymous too.',
  },
  {
    icon: Bookmark,
    title: 'Save what helps',
    description: 'Bookmark confessions that resonate.',
  },
];

export function EngagementSection() {
  return (
    <section className="relative w-full py-20 lg:py-32 bg-background z-[60]">
      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-16">
          React & support
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {features.map((feature) => (
            <div 
              key={feature.title}
              className="glass-card p-8 text-center group hover:shadow-xl transition-shadow duration-300"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
