import React from 'react';
import { MarketNews } from '../geminiService.ts';

interface NewsCardProps {
  news: MarketNews;
  isFeatured?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, isFeatured }) => {
  const sentimentStyles = {
    positive: {
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      label: 'HAUSSIER',
      icon: '↗'
    },
    negative: {
      bg: 'bg-rose-500/20',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      label: 'BAISSIER',
      icon: '↘'
    },
    neutral: {
      bg: 'bg-slate-500/20',
      text: 'text-slate-400',
      border: 'border-slate-500/30',
      label: 'NEUTRE',
      icon: '→'
    }
  };

  const style = sentimentStyles[news.sentiment] || sentimentStyles.neutral;

  return (
    <a 
      href={news.uri} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`group relative overflow-hidden rounded-2xl border border-slate-800 transition-all duration-500 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col ${isFeatured ? 'col-span-1 md:col-span-2 row-span-2 min-h-[300px]' : 'h-full bg-slate-900/40'}`}
    >
      <div className={`absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105 ${news.imageUrl ? '' : 'bg-gradient-to-br from-slate-800 to-slate-900'}`}>
        {news.imageUrl ? (
          <img 
            src={news.imageUrl} 
            alt={news.title} 
            className="h-full w-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center opacity-10">
            <span className="text-4xl">📰</span>
          </div>
        )}
        <div className={`absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent ${isFeatured ? 'opacity-100' : 'opacity-80'}`} />
      </div>

      <div className="absolute top-4 left-4 z-20">
        <span className={`inline-flex items-center gap-1.5 text-[8px] font-black px-2.5 py-1 rounded-full border backdrop-blur-xl tracking-[0.15em] transition-all duration-300 group-hover:scale-110 shadow-lg ${style.bg} ${style.text} ${style.border}`}>
          <span className="text-[10px]">{style.icon}</span>
          {style.label}
        </span>
      </div>

      <div className={`relative z-10 flex h-full flex-col justify-end p-5 sm:p-6`}>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/80">{news.time}</span>
          </div>
          <span className="rounded-lg bg-white/5 px-2 py-1 text-[9px] font-bold uppercase tracking-tighter text-slate-400 backdrop-blur-md border border-white/5 group-hover:bg-white/10 transition-colors">
            {news.source}
          </span>
        </div>
        
        <h3 className={`font-bold text-white transition-colors group-hover:text-blue-100 ${isFeatured ? 'text-xl sm:text-2xl leading-tight' : 'text-sm leading-snug'}`}>
          {news.title}
        </h3>

        {isFeatured && (
          <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-blue-400 group-hover:text-blue-300 transition-colors">
            <span className="tracking-[0.2em] uppercase">Consulter le rapport complet</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        )}
      </div>
    </a>
  );
};

export default NewsCard;