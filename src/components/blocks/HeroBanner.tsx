import React from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

interface HeroBannerProps {
  media: string; // Image URL
  title: string;
  subtitle: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  heightClass?: string; // e.g. "min-h-[80vh]" or "h-screen"
}

export default function HeroBanner({
  media,
  title,
  subtitle,
  ctaLabel,
  onCtaClick,
  heightClass = "min-h-[85vh]"
}: HeroBannerProps) {
  return (
    <section
      id="hero-banner"
      className={`relative ${heightClass} flex items-center justify-center overflow-hidden bg-navy`}
    >
      {/* Background image with subtle zoom-in animation effect */}
      <div className="absolute inset-0 z-0">
        <img
          src={media}
          alt="Omnia Nexus Banner Background"
          className="w-full h-full object-cover opacity-35 scale-105 transition-transform duration-10000 ease-out animate-pulse"
          style={{ animationDuration: "15s" }}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/70 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/25"></div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white flex flex-col items-center">
        {/* Animated decorative golden top bar */}
        <div className="w-16 h-[2px] bg-gold mb-8 animate-bounce" style={{ animationDuration: "3s" }}></div>

        {/* Big high-contrast display heading */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight sm:leading-none max-w-4xl text-white">
          {title}
        </h1>

        {/* Elegant subheader with inter-letter spacing */}
        <p className="mt-6 text-base sm:text-xl text-white/80 max-w-2xl font-light font-sans tracking-wide leading-relaxed">
          {subtitle}
        </p>

        {/* CTA Button */}
        {ctaLabel && onCtaClick && (
          <button
            onClick={onCtaClick}
            className="mt-10 px-8 py-3.5 bg-gold text-navy font-bold rounded-xs uppercase text-xs tracking-widest hover:bg-white hover:text-navy hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2 group cursor-pointer"
          >
            <span>{ctaLabel}</span>
            <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
          </button>
        )}

        {/* Small aesthetic scroll down prompt */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-70 animate-bounce cursor-pointer" onClick={() => window.scrollBy({ top: 600, behavior: "smooth" })}>
          <span className="text-[10px] uppercase tracking-widest font-mono text-gold">Découvrir</span>
          <ChevronDown size={14} className="text-white" />
        </div>
      </div>
    </section>
  );
}
