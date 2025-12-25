import React, { useState } from 'react';

interface APIKeyModalProps {
    onSave: (key: string) => void;
}

const APIKeyModal: React.FC<APIKeyModalProps> = ({ onSave }) => {
    const [apiKey, setApiKey] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (apiKey.trim()) {
            onSave(apiKey.trim());
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/95 backdrop-blur-md">
            <div className="w-full max-w-md p-8 bg-[#0f172a] border border-blue-500/30 rounded-3xl shadow-2xl relative overflow-hidden">
                {/* Glow effect */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 space-y-6">
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto flex items-center justify-center text-2xl shadow-lg shadow-blue-600/30">
                            🔑
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Configuration Requise</h2>
                        <p className="text-sm text-slate-400">
                            Pour activer l'intelligence de Gemini 3, veuillez entrer votre clé API.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="apiKey" className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                Clé API Gemini
                            </label>
                            <input
                                type="text"
                                id="apiKey"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="AIzaSy..."
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                                required
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-600/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wider text-xs"
                            >
                                Activer le Système
                            </button>
                        </div>
                    </form>

                    <div className="text-center">
                        <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors uppercase tracking-widest"
                        >
                            Obtenir une clé gratuitement
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default APIKeyModal;
