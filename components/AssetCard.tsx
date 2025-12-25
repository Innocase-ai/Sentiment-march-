
import React from 'react';
import { MarketAsset, Recommendation } from '../types.ts';

interface AssetCardProps {
    asset: MarketAsset;
    recommendation?: Recommendation;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, recommendation }) => {
    const isPositive = (asset?.change ?? 0) >= 0;

    return (
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-5 rounded-3xl hover:bg-slate-800/60 transition-all group shadow-lg">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                        {asset.icon}
                    </div>
                    <div>
                        <h4 className="font-black text-sm uppercase tracking-tight text-white">{asset?.name ?? 'Unknown Asset'}</h4>
                        <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">{asset?.symbol ?? '???'}</span>
                    </div>
                </div>
                {recommendation && (
                    <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${recommendation.action === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        recommendation.action === 'SELL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                            'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                        {recommendation.action}
                    </div>
                )}
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-end">
                    <div className="text-xl font-black text-white tracking-tighter">
                        {asset?.price?.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 4 }) ?? '0.00'}
                    </div>
                    <div className={`text-xs font-black flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPositive ? '↑' : '↓'} {Math.abs(asset?.change ?? 0).toFixed(2)}%
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-950/50 p-2 rounded-xl border border-white/5">
                        <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">RSI (14)</span>
                        <span className={`text-[10px] font-black ${(asset?.rsi ?? 50) > 70 ? 'text-rose-400' : (asset?.rsi ?? 50) < 30 ? 'text-emerald-400' : 'text-blue-400'}`}>
                            {asset?.rsi ?? 'N/A'}
                        </span>
                    </div>
                    <div className="bg-slate-950/50 p-2 rounded-xl border border-white/5">
                        <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">MACD</span>
                        <span className="text-[10px] font-black text-slate-300">
                            {asset?.macd ?? 'N/A'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetCard;
