import React from "react";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  view?: string;
  detailId?: string | null;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (view: string, detailId?: string | null) => void;
}

export default function Breadcrumb({ items, onNavigate }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="bg-lightgrey py-3 px-6 border-b border-navy/5">
      <div className="max-w-7xl mx-auto flex items-center flex-wrap gap-1.5 text-xs text-charcoal/60 font-medium">
        {/* Home Item */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-1 hover:text-gold text-navy transition-colors font-semibold cursor-pointer"
        >
          <Home size={12} />
          <span>Accueil</span>
        </button>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <React.Fragment key={idx}>
              <ChevronRight size={12} className="text-charcoal/30 shrink-0" />
              {isLast ? (
                <span className="text-charcoal font-semibold truncate max-w-[200px] sm:max-w-none" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={() => item.view && onNavigate(item.view, item.detailId)}
                  className="hover:text-gold text-charcoal/80 transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}
