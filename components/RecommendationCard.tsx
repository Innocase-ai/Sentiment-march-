
import React from 'react';
import { Recommendation } from '../types.ts';

interface RecommendationCardProps {
    rec: Recommendation;
    featured?: boolean;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ rec, featured }) => {
    return (
        <div className={`p-6 rounded-3xl border transition-all ${featured
            ? 'bg-blue-600/10 border-blue-500/30 shadow-xl shadow-blue-900/10'
            : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/60'
            }`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="text-lg font-black text-white uppercase tracking-tight">{rec?.asset ?? 'Unknown'}</h4>
                    <div className="flex gap-2 mt-2">
                        {rec?.signals?.map((s, i) => (
                            <span key={i} className="text-[7px] font-black px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-400 rounded uppercase tracking-tighter">
                                {s}
                            </span>
                        ))}
                    </div>
                </div>
                <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${rec?.action === 'BUY' ? 'bg-emerald-600 text-white' :
                    rec?.action === 'SELL' ? 'bg-rose-600 text-white' :
                        'bg-blue-600 text-white'
                    }`}>
                    {rec?.action ?? 'HOLD'}
                </div>
            </div>

            <p className="text-xs text-slate-300 font-medium leading-relaxed mb-4 italic">
                "{rec?.justification ?? 'Waiting for analysis...'}"
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Confiance Alpha</span>
                <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ${(rec?.confidence ?? 0) > 75 ? 'bg-emerald-500' : (rec?.confidence ?? 0) > 50 ? 'bg-blue-500' : 'bg-orange-500'
                                }`}
                            style={{ width: `${rec?.confidence ?? 0}%` }}
                        ></div>
                    </div>
                    <span className="text-[10px] font-black text-white">{rec?.confidence ?? 0}%</span>
                </div>
            </div>
        </div>
    );
};

export default RecommendationCard;
