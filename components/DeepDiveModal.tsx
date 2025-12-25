import React, { useState, useEffect, useRef } from 'react';
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
    const [isVisible, setIsVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isPositive = asset.change >= 0;

    const isMounted = useRef(true);

    useEffect(() => {
        setIsVisible(true);
        return () => {
            setIsVisible(false);
            isMounted.current = false;
        };
    }, []);

    // --- TECHNICAL FALLBACK LOGIC ---
    const getTechnicalVerdict = () => {
        if (asset.rsi > 70) return { action: 'VENDRE', logic: "RSI en zone de surachat (>70). Prise de profits potentielle.", score: 85, color: 'rose' };
        if (asset.rsi < 30) return { action: 'ACHETER', logic: "RSI en zone de survente (<30). Rebond technique probable.", score: 85, color: 'emerald' };
        if (asset.macd.startsWith('+') && isPositive) return { action: 'ACHETER', logic: "MACD positif aligné avec une tendance prix haussière.", score: 75, color: 'emerald' };
        if (asset.macd.startsWith('-') && !isPositive) return { action: 'VENDRE', logic: "MACD négatif confirmant la baisse du prix.", score: 75, color: 'rose' };
        return { action: 'NEUTRE', logic: "Indicateurs techniques mitigés. Pas de signal directionnel clair.", score: 50, color: 'amber' };
    };

    const techVerdict = getTechnicalVerdict();

    // Determine what to show: AI Recommendation OR Technical Fallback
    const displayData = recommendation ? {
        action: recommendation.action,
        logic: recommendation.justification,
        score: recommendation.confidence,
        color: recommendation.action === 'BUY' ? 'emerald' : recommendation.action === 'SELL' ? 'rose' : 'amber',
        isAi: true
    } : {
        action: techVerdict.action,
        logic: techVerdict.logic,
        score: techVerdict.score,
        color: techVerdict.color,
        isAi: false
    };

    const handleRunAnalysis = async () => {
        setIsLocalAnalyzing(true);
        setError(null);
        try {
            const newRec = await getAssetIntelligence(asset);
            if (!isMounted.current) return; // Prevent update if unmounted

            if (newRec) {
                onUpdateRecommendation(newRec);
            } else {
                setError("Analyse impossible. Veuillez réessayer.");
            }
        } catch (err) {
            if (isMounted.current) setError("Une erreur est survenue.");
        }
        if (isMounted.current) setIsLocalAnalyzing(false);
    };

    const isBusy = globalAnalyzing || isLocalAnalyzing;

    // Helper for color classes
    const getColorClasses = (color: string) => {
        const map: Record<string, any> = {
            emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/20' },
            rose: { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', glow: 'shadow-rose-500/20' },
            amber: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', glow: 'shadow-amber-500/20' },
            blue: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', glow: 'shadow-blue-500/20' },
        };
        return map[color] || map.blue;
    };

    const theme = getColorClasses(displayData.color);

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-500 ${isVisible ? 'bg-black/80 backdrop-blur-md opacity-100' : 'bg-black/0 backdrop-blur-none opacity-0'}`}>
            <div
                className={`w-full max-w-4xl bg-[#0a0a0a] rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden transition-all duration-700 transform ${isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-10 opacity-0'}`}
                style={{
                    boxShadow: `0 0 100px -20px ${displayData.color === 'emerald' ? 'rgba(16, 185, 129, 0.1)' : displayData.color === 'rose' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)'}`
                }}
            >
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-blue-600/10 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-t from-purple-600/10 to-transparent rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row h-full max-h-[90vh]">

                    {/* LEFT PANEL: ASSET IDENTITY & ACTIONS */}
                    <div className="w-full md:w-1/3 p-8 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between bg-white/[0.02]">
                        <div className="space-y-8">
                            {/* Header */}
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-lg`}>
                                    {asset.icon}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tight">{asset.symbol}</h2>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{asset.name}</p>
                                </div>
                            </div>

                            {/* Price Hero */}
                            <div className="space-y-2">
                                <div className="text-5xl font-black text-white tracking-tighter">
                                    {asset.price.toLocaleString('fr-FR', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}
                                </div>
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                    <span className="text-lg font-bold">{isPositive ? '↗' : '↘'}</span>
                                    <span className="text-sm font-bold tracking-wide">{Math.abs(asset.change).toFixed(2)}% (24h)</span>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleRunAnalysis}
                                    disabled={isBusy}
                                    className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all duration-300 group ${isBusy ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-1'}`}
                                >
                                    {isBusy ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Analyse en cours...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-lg group-hover:rotate-180 transition-transform duration-500">✨</span>
                                            <span>{recommendation ? 'Actualiser l\'IA' : 'Lancer Omni-Intelligence'}</span>
                                        </>
                                    )}
                                </button>
                                {error && (
                                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                        <p className="text-rose-400 text-xs font-bold leading-tight">{error}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="mt-8 pt-8 border-t border-white/5">
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold text-center">
                                Données de marché en temps réel<br />
                                Propulsé par Google Gemini 3
                            </p>
                        </div>
                    </div>


                    {/* RIGHT PANEL: INTELLIGENCE & METRICS */}
                    <div className="w-full md:w-2/3 p-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar">

                        {/* 1. THE VERDICT CARD */}
                        <div className={`relative overflow-hidden rounded-3xl p-1 ${theme.bg} transition-all duration-500`}>
                            <div className={`absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-${displayData.color}-500 to-transparent blur-xl`} />

                            <div className="relative bg-[#0F1115] rounded-[1.3rem] p-6 border border-white/5 h-full flex flex-col justify-between group">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">
                                            {displayData.isAi ? 'STRATÉGIE IA' : 'SIGNAL TECHNIQUE'}
                                        </div>
                                        <div className={`text-4xl md:text-5xl font-black tracking-tight ${theme.text} drop-shadow-sm`}>
                                            {displayData.action}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">CONFIANCE</div>
                                        <div className="text-3xl font-black text-white">{displayData.score}%</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-slate-300 text-lg leading-relaxed font-medium">
                                        "{displayData.logic}"
                                    </p>

                                    {/* AI Signals Badges */}
                                    {recommendation?.signals && (
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {recommendation.signals.map((sig, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-slate-300 uppercase tracking-wide">
                                                    ⚡ {sig}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {!displayData.isAi && !isBusy && (
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[1.3rem]">
                                        <button onClick={handleRunAnalysis} className="px-6 py-3 bg-white text-black font-black text-xs uppercase tracking-widest rounded-full transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                            Activer l'Expertise IA
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 2. METRICS GRID */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* RSI CARD */}
                            <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/5">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs font-bold text-slate-500 uppercase">RSI (14)</span>
                                    <span className={`text-xl font-black ${asset.rsi > 70 ? 'text-rose-400' : asset.rsi < 30 ? 'text-emerald-400' : 'text-slate-300'}`}>
                                        {asset.rsi.toFixed(1)}
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${asset.rsi > 70 ? 'bg-rose-500' : asset.rsi < 30 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                        style={{ width: `${asset.rsi}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[8px] text-slate-600 mt-1 uppercase font-bold">
                                    <span>Survente (30)</span>
                                    <span>Surachat (70)</span>
                                </div>
                            </div>

                            {/* MACD CARD */}
                            <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/5">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs font-bold text-slate-500 uppercase">MACD Trend</span>
                                    <span className={`text-xl font-black ${asset.macd.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {asset.macd.startsWith('+') ? 'HAUSSIER' : 'BAISSIER'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${asset.macd.startsWith('+') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                        {asset.macd}
                                    </span>
                                    <span className="text-[10px] text-slate-500">Divergence</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* CLOSE BUTTON ABSOLUTE */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-white/10 text-slate-400 hover:text-white transition-colors backdrop-blur-md"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                </div>
            </div>
        </div>
    );
};

export default DeepDiveModal;
