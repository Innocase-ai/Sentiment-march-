
import React from 'react';
import { MarketNews } from '../geminiService.ts';

interface NewsCardProps {
    news: MarketNews;
    isFeatured?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, isFeatured }) => {
    return (
        <a
            href={news.uri}
            target="_blank"
            rel="noopener noreferrer"
            className={`block group relative overflow-hidden rounded-3xl border transition-all ${isFeatured
                ? 'bg-gradient-to-br from-slate-900 to-slate-950 border-slate-700/50'
                : 'bg-slate-900/40 border-slate-800/50 hover:bg-slate-800/60'
                }`}
        >
            {news?.imageUrl && (
                <div className="aspect-video w-full overflow-hidden relative">
                    <img
                        src={news.imageUrl}
                        alt={news?.title ?? 'News Image'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                </div>
            )}

            <div className="p-4 relative">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                        {news?.source ?? 'Unknown'}
                    </span>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                        {news?.time ?? 'Live'}
                    </span>
                </div>

                <h4 className={`font-bold leading-tight text-white mb-2 group-hover:text-blue-400 transition-colors ${isFeatured ? 'text-base' : 'text-xs'}`}>
                    {news?.title ?? 'No Title Available'}
                </h4>

                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${news?.sentiment === 'positive' ? 'bg-emerald-500' :
                        news?.sentiment === 'negative' ? 'bg-rose-500' :
                            'bg-slate-500'
                        }`}></div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        MARKET {news?.sentiment ?? 'NEUTRAL'}
                    </span>
                </div>
            </div>
        </a>
    );
};

export default NewsCard;
