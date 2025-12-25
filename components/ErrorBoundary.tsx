import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-red-900/50 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
                        <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h1 className="text-xl font-bold text-red-400 mb-2">Système OmniTrade Interrompu</h1>
                        <p className="text-gray-400 text-sm mb-6">
                            Une erreur critique est survenue. Le système de sécurité a stoppé l'exécution pour protéger les données.
                        </p>
                        <div className="bg-black/50 p-4 rounded-lg text-left mb-6 overflow-auto max-h-32 border border-gray-800">
                            <code className="text-xs text-red-300 font-mono">
                                {this.state.error?.toString()}
                            </code>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors font-medium text-sm w-full"
                        >
                            Redémarrer le Système
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
