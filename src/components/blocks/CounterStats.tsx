import React, { useState, useEffect } from "react";
import { ChiffreCle } from "../../types";
import { Award, Layers, Users, TrendingUp, Sparkles } from "lucide-react";

interface CounterStatsProps {
  stats: ChiffreCle[];
}

// Custom hook or small component for individual count animation
function AnimatedCounter({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressPercent = Math.min(progress / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progressPercent, 3);
      const currentValue = Math.floor(startValue + (value - startValue) * easeProgress);
      
      setCount(currentValue);

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span className="font-serif text-4xl sm:text-5xl font-bold tracking-tight">{count}</span>;
}

export default function CounterStats({ stats }: CounterStatsProps) {
  // Map icons to stats based on labels/orders
  const getIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("filiale")) return <Layers size={24} className="text-gold" />;
    if (l.includes("pôle") || l.includes("secteur")) return <TrendingUp size={24} className="text-gold" />;
    if (l.includes("collaborateur") || l.includes("personnel")) return <Users size={24} className="text-gold" />;
    if (l.includes("milliard") || l.includes("fcfa") || l.includes("investi")) return <Award size={24} className="text-gold" />;
    return <Sparkles size={24} className="text-gold" />;
  };

  return (
    <section id="counter-stats" className="bg-navy py-16 md:py-20 text-white relative">
      {/* Visual background textures */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(176,141,87,0.08),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <span className="text-xs font-mono font-bold text-gold uppercase tracking-[0.25em] block mb-4">
          NOTRE GROUPE EN CHIFFRES
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold mb-12 max-w-2xl mx-auto tracking-tight">
          Un impact économique mesurable en Côte d'Ivoire et dans la sous-région
        </h2>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="p-6 bg-white/5 border border-white/10 rounded-sm hover:border-gold/30 hover:bg-white/10 transition-all flex flex-col items-center group text-center"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {getIcon(stat.label)}
              </div>
              <div className="text-gold mb-2 flex items-baseline justify-center">
                <AnimatedCounter value={stat.valeur} />
                {stat.label.toLowerCase().includes("milliard") || stat.label.toLowerCase().includes("fcfa") ? (
                  <span className="font-serif text-2xl font-bold ml-1 text-gold">+</span>
                ) : stat.valeur > 10 ? (
                  <span className="font-serif text-2xl font-bold ml-1 text-gold">+</span>
                ) : null}
              </div>
              <p className="text-xs sm:text-sm text-white/70 font-medium font-sans tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
