import React from "react";
import { ArrowRight, MapPin, Briefcase, Calendar } from "lucide-react";

interface EntityCardProps {
  key?: React.Key;
  type: "news" | "subsidiary" | "pole" | "job";
  image?: string;
  category?: string;
  title: string;
  description: string;
  dateOrMeta?: string; // Date for news, Sector for subsidiary, Contract type for job, etc.
  metaExtra?: string; // Author for news, location for job
  onClick: () => void;
  ctaLabel?: string;
}

export default function EntityCard({
  type,
  image,
  category,
  title,
  description,
  dateOrMeta,
  metaExtra,
  onClick,
  ctaLabel = "En savoir plus"
}: EntityCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-black/5 rounded-xs hover:border-gold/30 hover:shadow-xl transition-all duration-300 group flex flex-col h-full cursor-pointer overflow-hidden"
    >
      {/* Card Image */}
      {(type === "news" || type === "subsidiary" || type === "pole") && image && (
        <div className="relative overflow-hidden aspect-video bg-navy/5 shrink-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            referrerPolicy="no-referrer"
          />
          {category && (
            <span className="absolute top-3 left-3 bg-navy/95 border border-gold/30 text-gold text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
              {category}
            </span>
          )}
        </div>
      )}

      {/* Card Body */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Job Metadata Header */}
        {type === "job" && (
          <div className="flex flex-wrap gap-3 mb-3 text-xs font-mono font-bold uppercase tracking-wider text-gold">
            <span className="flex items-center gap-1 bg-navy/5 px-2 py-1 rounded-sm text-navy">
              <Briefcase size={12} className="text-gold" />
              {dateOrMeta} {/* e.g. CDI */}
            </span>
            <span className="flex items-center gap-1 bg-navy/5 px-2 py-1 rounded-sm text-charcoal/80">
              <MapPin size={12} className="text-gold" />
              {metaExtra} {/* e.g. Abidjan */}
            </span>
          </div>
        )}

        {/* News Metadata Header */}
        {type === "news" && dateOrMeta && (
          <div className="flex items-center gap-2 text-xs font-mono text-charcoal/50 mb-3">
            <Calendar size={12} className="text-gold" />
            <span>
              {new Date(dateOrMeta).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })}
            </span>
            {metaExtra && (
              <>
                <span>&bull;</span>
                <span className="truncate">{metaExtra}</span>
              </>
            )}
          </div>
        )}

        {/* Subsidiary Metadata Surtitre */}
        {type === "subsidiary" && dateOrMeta && (
          <span className="text-xs font-mono font-bold text-gold uppercase tracking-wider mb-2 block">
            {dateOrMeta} {/* e.g. Secteur */}
          </span>
        )}

        {/* Title */}
        <h3 className="font-serif text-lg sm:text-xl font-bold text-navy group-hover:text-gold transition-colors tracking-tight line-clamp-2 leading-snug mb-3">
          {title}
        </h3>

        {/* Description / Snippet */}
        <p className="text-sm sm:text-base text-charcoal/70 font-light leading-relaxed line-clamp-3 mb-6 flex-grow">
          {description}
        </p>

        {/* CTA Section */}
        <div className="flex items-center justify-between pt-4 border-t border-navy/5 mt-auto">
          <span className="text-xs font-bold text-navy uppercase tracking-widest group-hover:text-gold group-hover:translate-x-1.5 transition-all flex items-center gap-1.5">
            {ctaLabel}
            <ArrowRight size={12} />
          </span>
          {type === "subsidiary" && (
            <span className="text-[10px] text-charcoal/40 font-mono tracking-widest uppercase">OMNIA NEXUS</span>
          )}
        </div>
      </div>
    </div>
  );
}
