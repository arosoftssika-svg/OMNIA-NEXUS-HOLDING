import React from "react";
import { Actualite } from "../../types";
import { AlertCircle } from "lucide-react";

interface NewsTickerProps {
  newsList: Actualite[];
  onSelectNews: (news: Actualite) => void;
}

export default function NewsTicker({ newsList, onSelectNews }: NewsTickerProps) {
  const tickerNews = newsList.slice(0, 4);

  if (tickerNews.length === 0) return null;

  return (
    <div id="news-ticker" className="bg-navy border-b border-gold/20 text-white py-2 text-xs overflow-hidden relative z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center">
        <div className="bg-gold text-navy font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider text-[10px] mr-4 flex items-center gap-1 shrink-0">
          <AlertCircle size={12} />
          Flash Info
        </div>
        <div className="overflow-hidden relative w-full h-5">
          <div className="animate-ticker absolute flex gap-12 items-center whitespace-nowrap pl-[100%]">
            {/* Double the list to ensure infinite scroll effect */}
            {[...tickerNews, ...tickerNews].map((news, idx) => (
              <button
                key={`${news.id}-${idx}`}
                onClick={() => onSelectNews(news)}
                className="text-white/90 hover:text-gold transition-colors font-medium flex items-center gap-2 cursor-pointer text-left"
              >
                <span className="w-1.5 h-1.5 bg-gold rounded-full inline-block"></span>
                <span>{news.titre}</span>
                <span className="text-white/40 text-[10px] font-mono">
                  ({new Date(news.publieLe).toLocaleDateString("fr-FR")})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
