import React from "react";
import { ArrowRight } from "lucide-react";

interface ZigZagBlockProps {
  index: number;
  image: string;
  category?: string;
  title: string;
  description: string;
  bulletPoints?: string[];
  ctaLabel?: string;
  onCtaClick?: () => void;
  bgLight?: boolean;
}

export default function ZigZagBlock({
  index,
  image,
  category,
  title,
  description,
  bulletPoints,
  ctaLabel,
  onCtaClick,
  bgLight = false
}: ZigZagBlockProps) {
  const isImageLeft = index % 2 === 0;

  return (
    <section
      id={`zigzag-block-${index}`}
      className={`py-16 md:py-24 ${bgLight ? "bg-lightgrey text-charcoal" : "bg-white text-charcoal"}`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          {/* Image Container */}
          <div
            className={`col-span-1 md:col-span-6 w-full ${
              isImageLeft ? "md:order-1" : "md:order-2"
            }`}
          >
            <div className="relative group overflow-hidden rounded-xs shadow-xl border border-black/5 bg-navy/5">
              <img
                src={image}
                alt={title}
                className="w-full h-[320px] sm:h-[400px] object-cover hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              {/* Corner design accents */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-gold/70"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-gold/70"></div>
            </div>
          </div>

          {/* Text Content Container */}
          <div
            className={`col-span-1 md:col-span-6 flex flex-col justify-center ${
              isImageLeft ? "md:order-2" : "md:order-1"
            }`}
          >
            {/* Category Surtitre */}
            {category && (
              <span className="text-xs font-mono font-bold text-gold uppercase tracking-[0.2em] mb-3">
                {category}
              </span>
            )}

            {/* High-Contrast Section Title */}
            <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-navy leading-tight mb-6">
              {title}
            </h2>

            {/* Divider */}
            <div className="w-12 h-[1px] bg-gold mb-6"></div>

            {/* Paragraph description */}
            <p className="text-base sm:text-lg text-charcoal/80 font-light leading-relaxed mb-6 whitespace-pre-line">
              {description}
            </p>

            {/* Bullet Points */}
            {bulletPoints && bulletPoints.length > 0 && (
              <ul className="space-y-3 mb-8">
                {bulletPoints.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-charcoal/90 font-medium">
                    <span className="text-gold font-bold text-lg leading-none shrink-0">&bull;</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* CTA button */}
            {ctaLabel && onCtaClick && (
              <div>
                <button
                  onClick={onCtaClick}
                  className="px-6 py-3 border border-navy/25 text-navy font-bold rounded-xs text-xs uppercase tracking-widest hover:border-gold hover:bg-gold hover:text-navy transition-all flex items-center gap-2 group cursor-pointer shadow-xs hover:shadow-md"
                >
                  <span>{ctaLabel}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
