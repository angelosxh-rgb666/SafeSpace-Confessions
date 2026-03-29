import { Pencil, Send, Users } from 'lucide-react';

const steps = [
  {
    icon: Pencil,
    title: 'Write',
    description: 'Share what\'s on your mind. No account needed.',
  },
  {
    icon: Send,
    title: 'Post',
    description: 'Your confession goes live anonymously.',
  },
  {
    icon: Users,
    title: 'Connect',
    description: 'Read, react, and support others.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative w-full py-20 lg:py-32 bg-background z-20">
      {/* Radial Gradient Background */}
      <div className="absolute inset-0 gradient-radial pointer-events-none" />
      
      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-16">
          How SafeSpace works
        </h2>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={step.title}
              className="glass-card p-8 text-center group hover:shadow-xl transition-shadow duration-300"
            >
              {/* Step Number */}
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
                {index + 1}
              </div>
              
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
