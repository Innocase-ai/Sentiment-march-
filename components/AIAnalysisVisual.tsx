import React, { useEffect, useState } from 'react';

const MESSAGES = [
    "Initialisation des protocoles IA...",
    "Scan du réseau FinTwit en cours...",
    "Analyse des signaux macro-économiques...",
    "Détection des corrélations de marché...",
    "Synthèse des recommandations..."
];

const AIAnalysisVisual: React.FC = () => {
    const [msgIndex, setMsgIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMsgIndex(prev => (prev + 1) % MESSAGES.length);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm transition-all duration-500">
            <div className="flex flex-col items-center gap-8 p-10 bg-[#0f172a] border border-blue-500/30 rounded-[2rem] shadow-2xl shadow-blue-500/20 max-w-lg w-full mx-4 relative overflow-hidden">

                {/* Decorative Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                {/* Top Scan Line */}
                <div className="absolute top-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_15px_rgba(96,165,250,0.8)]"></div>

                {/* Central Visual */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Outer Rings */}
                    <div className="absolute inset-0 border-2 border-slate-700/50 rounded-full"></div>
                    <div className="absolute inset-0 border-2 border-t-blue-500 border-r-blue-500/50 rounded-full animate-spin [animation-duration:3s]"></div>

                    {/* Inner Rings */}
                    <div className="absolute inset-4 border-2 border-slate-700/50 rounded-full"></div>
                    <div className="absolute inset-4 border-2 border-b-cyan-400 border-l-cyan-400/50 rounded-full animate-spin [animation-duration:2s] [animation-direction:reverse]"></div>

                    {/* Core */}
                    <div className="absolute inset-10 bg-blue-500/10 rounded-full animate-pulse flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,1)]"></div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="text-center space-y-3 z-10 w-full">
                    <h3 className="text-2xl font-black text-white uppercase tracking-widest bg-gradient-to-r from-blue-300 via-white to-blue-300 bg-clip-text text-transparent">
                        Gemini 3 Processing
                    </h3>
                    <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto opacity-50"></div>
                    <p className="text-sm text-cyan-400 font-mono h-6 transition-all duration-300 flex items-center justify-center gap-2">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></span>
                        {MESSAGES[msgIndex]}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AIAnalysisVisual;
