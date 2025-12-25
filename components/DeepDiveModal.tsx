import React, { useState } from 'react';
import { MarketAsset, Recommendation } from '../types.ts';
import { getAssetIntelligence } from '../geminiService.ts';

interface DeepDiveModalProps {
    asset: MarketAsset;
    recommendation?: Recommendation;
    isAnalyzing?: boolean;
    onClose: () => void;
    onUpdateRecommendation: (rec: Recommendation) => void;
}

const DeepDiveModal: React.FC<DeepDiveModalProps> = ({ asset, recommendation, isAnalyzing: globalAnalyzing, onClose, onUpdateRecommendation }) => {
    const [isLocalAnalyzing, setIsLocalAnalyzing] = useState(false);
    const isPositive = asset.change >= 0;

    // --- TECHNICAL FALLBACK LOGIC ---
    const getTechnicalVerdict = () => {
        if (asset.rsi > 70) return { action: 'VENDRE (Technique)', color: 'text-rose-400', logic: "RSI en zone de surachat (>70). Prise de profits potentielle." };
        if (asset.rsi < 30) return { action: 'ACHETER (Technique)', color: 'text-emerald-400', logic: "RSI en zone de survente (<30). Rebond technique probable." };
        if (asset.macd.startsWith('+') && isPositive) return { action: 'ACHETER (Technique)', color: 'text-emerald-400', logic: "MACD positif aligné avec une tendance prix haussière." };
        if (asset.macd.startsWith('-') && !isPositive) return { action: 'VENDRE (Technique)', color: 'text-rose-400', logic: "MACD négatif confirmant la baisse du prix." };
        return { action: 'NEUTRE (Technique)', color: 'text-amber-400', logic: "Indicateurs techniques mitigés. Pas de signal directionnel clair." };
    };

    const techVerdict = getTechnicalVerdict();

    // Determine what to show: AI Recommendation OR Technical Fallback
    const displayAction = recommendation ? recommendation.action : techVerdict.action;

    const actionStyles = {
        BUY: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'ACHAT' },
        SELL: { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', label: 'VENTE' },
        HOLD: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'NEUTRE' }
    };

    // If it's a "real" AI action (BUY/SELL/HOLD), use style map. If it's a text string (Technical), create a custom style.
    const currentAction = actionStyles[displayAction as keyof typeof actionStyles] || {
        text: techVerdict.color,
        bg: techVerdict.color.replace('text-', 'bg-').replace('400', '500/10'),
        border: techVerdict.color.replace('text-', 'border-').replace('400', '500/30'),
        label: displayAction
    };

    const handleRunAnalysis = async () => {
        setIsLocalAnalyzing(true);
        const newRec = await getAssetIntelligence(asset);
        if (newRec) {
            onUpdateRecommendation(newRec);
        }
        setIsLocalAnalyzing(false);
    };

    const isBusy = globalAnalyzing || isLocalAnalyzing;

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
                    <div className={`p-6 rounded-3xl border ${currentAction.border} ${currentAction.bg} relative overflow-hidden group transition-all duration-500`}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="text-6xl font-black tracking-tighter">AI</span>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Verdict Stratégique</span>
                                    {!recommendation && <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">( Mode Technique )</span>}
                                </div>
                                {recommendation && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-slate-400">CONFIANCE</span>
                                        <span className="text-lg font-black text-blue-400">{recommendation.confidence}%</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 mb-4">
                                <div className="flex items-baseline gap-4">
                                    <span className={`text-3xl sm:text-4xl font-black ${currentAction.text}`}>{currentAction.label}</span>
                                    <span className="text-slate-500 text-sm font-medium whitespace-nowrap">{recommendation ? 'Suggéré par Gemini 3' : 'Calculé par OmniTrade'}</span>
                                </div>

                                <button
                                    onClick={handleRunAnalysis}
                                    disabled={isBusy}
                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all ${isBusy ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 hover:shadow-blue-600/40 transform hover:-translate-y-0.5'}`}
                                >
                                    {isBusy ? (
                                        <>
                                            <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                            Analyse...
                                        </>
                                    ) : (
                                        <>
                                            ✨ {recommendation ? 'Actualiser' : 'Expertise IA'}
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="bg-black/20 backdrop-blur-sm p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                                {isBusy && (
                                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px] z-20 flex items-center justify-center p-6 text-center">
                                        <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-300">
                                            <div className="w-8 h-8 relative">
                                                <span className="absolute inset-0 rounded-full border-4 border-blue-500/20"></span>
                                                <span className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin"></span>
                                            </div>
                                            <div>
                                                <p className="text-blue-400 font-black text-xs uppercase tracking-widest leading-relaxed">Interrogation de Gemini Pro...</p>
                                                <p className="text-slate-500 text-[10px] uppercase tracking-wide">Analyse des rapports & indicateurs</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <p className="text-slate-300 leading-relaxed italic text-lg text-center relative z-10">
                                    "{recommendation?.justification || techVerdict.logic}"
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
                                    <div className="w-full text-center py-6 bg-slate-800/20 rounded-2xl border border-dashed border-slate-700 flex flex-col items-center justify-center gap-2">
                                        <span className="text-[10px] font-black text-slate-600 uppercase">Aucun signal spécifique</span>
                                        <span className="text-[8px] text-slate-700">Lancer une analyse IA pour détecter des signaux</span>
                                    </div>
                                )}
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                                <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-bold text-center italic">
                                    {recommendation
                                        ? `L'intelligence collective FinTwit montre une convergence de ${recommendation.confidence}% sur cet actif.`
                                        : "Données de sentiment social en attente d'analyse IA."}
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
