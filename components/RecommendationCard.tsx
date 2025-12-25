
import React from 'react';
import { Recommendation } from '../types';

interface RecommendationCardProps {
  rec: Recommendation;
  featured?: boolean;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ rec, featured }) => {
  const actionColor = rec.action === 'BUY' ? 'text-emerald-500' : rec.action === 'SELL' ? 'text-rose-500' : 'text-amber-500';
  const actionIcon = rec.action === 'BUY' ? '↑' : rec.action === 'SELL' ? '↓' : '→';
  
  const actionLabel = rec.action === 'BUY' ? 'ACHAT' : rec.action === 'SELL' ? 'VENTE' : 'NEUTRE';

  return (
    <div className={`bg-[#1a2332] border rounded-xl p-4 sm:p-5 text-center flex flex-col items-center justify-between h-full min-w-[260px] sm:min-w-0 snap-center ${featured ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-[#334155]'}`}>
      <div className="w-full">
        <div className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest mb-1">Conseil IA</div>
        <div className="text-base sm:text-lg font-bold mb-2 sm:mb-3 truncate">{rec.asset}</div>
        <div className={`text-2xl sm:text-3xl font-black ${actionColor} mb-2 flex items-center justify-center gap-2`}>
           <span>{actionIcon}</span>
           <span>{actionLabel}</span>
        </div>
        <div className="text-[10px] sm:text-xs text-slate-400 mb-3 sm:mb-4">
          Confiance : <span className="text-blue-400 font-bold">{rec.confidence}%</span>
        </div>
      </div>
      <div className="bg-white/5 p-3 rounded-lg text-[11px] sm:text-xs leading-relaxed text-slate-300 italic w-full">
        "{rec.justification}"
      </div>
    </div>
  );
};

export default RecommendationCard;
