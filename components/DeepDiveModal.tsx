import React from 'react';
import { MarketAsset, Recommendation } from '../types.ts';

interface DeepDiveModalProps {
    asset: MarketAsset;
    recommendation?: Recommendation;
    onClose: () => void;
}

const DeepDiveModal: React.FC<DeepDiveModalProps> = ({ asset, recommendation, onClose }) => {
    const isPositive = asset.change >= 0;

    const actionStyles = {
        BUY: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'ACHAT' },
        SELL: { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', label: 'VENTE' },
        HOLD: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'NEUTRE' }
    };

    const currentAction = recommendation ? actionStyles[recommendation.action] : { text: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30', label: 'NON ANALYSÉ' };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#0f172a] border border-slate-700 rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col animate-in zoom-in duration-300">

                {/* Header Section */}
                <div className="p-8 pb-4 flex justify-between items-start">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-4xl border border-white/5 shadow-inner">
                            {asset.icon}
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tight">{asset.name}</h2>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-sm text-slate-500 font-mono font-bold tracking-widest uppercase">{asset.symbol}</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                    {isPositive ? '↗' : '↘'} {Math.abs(asset.change).toFixed(2)}%
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content Section */}
                <div className="p-8 pt-4 overflow-y-auto no-scrollbar space-y-8">

                    {/* AI Signal Panel */}
                    <div className={`p-6 rounded-3xl border ${currentAction.border} ${currentAction.bg} relative overflow-hidden group`}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="text-6xl font-black tracking-tighter">AI</span>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Verdict Stratégique IA</span>
                                {recommendation && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-slate-400">CONFIANCE</span>
                                        <span className="text-lg font-black text-blue-400">{recommendation.confidence}%</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-baseline gap-4 mb-4">
                                <span className={`text-4xl font-black ${currentAction.text}`}>{currentAction.label}</span>
                                <span className="text-slate-500 text-sm font-medium">Suggéré par Gemini 3</span>
                            </div>

                            <div className="bg-black/20 backdrop-blur-sm p-5 rounded-2xl border border-white/5">
                                <p className="text-slate-300 leading-relaxed italic text-lg">
                                    "{recommendation?.justification || "Analyse approfondie en cours. L'IA n'a pas encore émis de recommandation spécifique pour cet intervalle."}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Technical Deep Dive */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                Indicateurs Techniques (Hard Data)
                            </h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-slate-800/30 p-4 rounded-2xl border border-white/5">
                                    <span className="text-xs font-bold text-slate-400">RSI (Relative Strength Index)</span>
                                    <span className={`font-mono font-black ${asset.rsi > 70 ? 'text-rose-400' : asset.rsi < 30 ? 'text-emerald-400' : 'text-blue-400'}`}>
                                        {asset.rsi.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-800/30 p-4 rounded-2xl border border-white/5">
                                    <span className="text-xs font-bold text-slate-400">MACD Trend Line</span>
                                    <span className={`font-mono font-black ${asset.macd.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {asset.macd}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-800/30 p-4 rounded-2xl border border-white/5">
                                    <span className="text-xs font-bold text-slate-400">Prix Actuel</span>
                                    <span className="font-mono font-black text-white">
                                        {asset.price.toLocaleString('fr-FR', { minimumFractionDigits: asset.price < 10 ? 4 : 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                Signaux Détectés (Soft Data)
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {recommendation?.signals && recommendation.signals.length > 0 ? (
                                    recommendation.signals.map((sig, idx) => (
                                        <span key={idx} className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-black rounded-xl uppercase tracking-wider">
                                            ⚡ {sig}
                                        </span>
                                    ))
                                ) : (
                                    <div className="w-full text-center py-6 bg-slate-800/20 rounded-2xl border border-dashed border-slate-700">
                                        <span className="text-[10px] font-black text-slate-600 uppercase">Aucun signal spécifique</span>
                                    </div>
                                )}
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                                <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-bold text-center italic">
                                    L'intelligence collective FinTwit montre une convergence de {recommendation?.confidence || 50}% sur cet actif.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-slate-800 bg-slate-900/50 flex justify-between items-center">
                    <div className="text-[9px] text-slate-500 uppercase tracking-widest font-black max-w-xs">
                        Analyse effectuée en temps réel via le moteur hybride OmniTrade Alpha
                    </div>
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all font-black text-xs uppercase tracking-widest"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeepDiveModal;
