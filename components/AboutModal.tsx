import React from 'react';

interface AboutModalProps {
    onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="sticky top-0 bg-gray-900/95 backdrop-blur border-b border-gray-800 p-6 flex justify-between items-center z-10">
                    <div>
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                            Architecture OmniTrade AI
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">Moteur d'Intelligence Hybride "Hard & Soft Data"</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-12">

                    {/* Architecture Diagram */}
                    <div className="relative">
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent hidden md:block"></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">

                            {/* INPUTS */}
                            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all text-center group">
                                <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600/20 transition-colors">
                                    <span className="text-2xl">📡</span>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">1. Ingestion de Données</h3>
                                <div className="text-sm text-gray-400 space-y-2 text-left bg-gray-900/50 p-3 rounded-lg">
                                    <div className="flex justify-between">
                                        <span className="text-blue-300">Hard Data</span>
                                        <span className="text-xs border border-blue-900 bg-blue-900/20 px-1 rounded">Proven</span>
                                    </div>
                                    <p className="text-xs">Zacks Rank, Seeking Alpha Quant, Consensus Analystes, Prix/RSI Live.</p>
                                    <div className="w-full h-px bg-gray-700 my-2"></div>
                                    <div className="flex justify-between">
                                        <span className="text-purple-300">Soft Data</span>
                                        <span className="text-xs border border-purple-900 bg-purple-900/20 px-1 rounded">Sentiment</span>
                                    </div>
                                    <p className="text-xs">FinTwit (Twitter Finance), Narratifs Viraux, Peur/Avidité.</p>
                                </div>
                            </div>

                            {/* PROCESSING */}
                            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all text-center group ring-1 ring-cyan-500/20">
                                <div className="w-12 h-12 bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                    <span className="text-2xl">🧠</span>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">2. Fusion Cognitive</h3>
                                <div className="text-sm text-gray-400 space-y-2 text-left bg-gray-900/50 p-3 rounded-lg">
                                    <p className="font-mono text-cyan-400 text-xs text-center mb-2">Gemini 3 Flash Preview</p>
                                    <ul className="list-disc pl-4 space-y-1 text-xs">
                                        <li>Persona: <em className="text-gray-300">Lead Quant Strategist</em></li>
                                        <li>Chain of Thought: <span className="text-gray-300">Raisonnement par étapes</span></li>
                                        <li>Cross-Reference: <span className="text-gray-300">Validation croisée</span></li>
                                    </ul>
                                </div>
                            </div>

                            {/* OUTPUT */}
                            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-green-500/50 transition-all text-center group">
                                <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600/20 transition-colors">
                                    <span className="text-2xl">💎</span>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">3. Alpha Signal</h3>
                                <div className="text-sm text-gray-400 space-y-2 text-left bg-gray-900/50 p-3 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="text-xs font-bold text-gray-200">BUY</span>
                                        <span className="text-[10px] text-gray-500">= Soft Bull + Hard Bull</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        <span className="text-xs font-bold text-gray-200">SELL</span>
                                        <span className="text-[10px] text-gray-500">= Soft Bear OR Hard Bear</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                        <span className="text-xs font-bold text-gray-200">HOLD</span>
                                        <span className="text-[10px] text-gray-500">= Divergence détectée</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Deep Dive Text */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="text-blue-400 font-semibold border-b border-gray-700 pb-2">Pourquoi Hard vs Soft Data ?</h4>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Les marchés modernes sont pilotés par deux forces souvent contradictoires :
                                les <strong>fondamentaux</strong> (Hard Data) et les <strong>narratifs</strong> (Soft Data).
                                <br /><br />
                                La plupart des robots ne regardent que le prix. OmniTrade AI écoute ce que "dit" le marché (Twitter, Experts)
                                puis vérifie si les chiffres (Bilans, Analystes Pro) confirment ce bruit.
                                C'est cette <strong>double validation</strong> qui filtre les faux signaux.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-cyan-400 font-semibold border-b border-gray-700 pb-2">Sources de Confiance</h4>
                            <ul className="space-y-3 text-sm text-gray-300">
                                <li className="flex items-start gap-3">
                                    <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded text-xs font-mono mt-0.5">SA</span>
                                    <span><strong>Seeking Alpha Quant:</strong> Algorithme prédictif backtesté sur 10 ans.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs font-mono mt-0.5">ZR</span>
                                    <span><strong>Zacks Rank:</strong> Basé sur les révisions de bénéfices (Earnings Surprises).</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded text-xs font-mono mt-0.5">X</span>
                                    <span><strong>FinTwit Elite:</strong> Sélection de comptes experts (Pas de bots/scams).</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="bg-gray-900 border-t border-gray-800 p-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium text-sm"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};
