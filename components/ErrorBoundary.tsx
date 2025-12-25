import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error in widget:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 flex flex-col items-center justify-center min-h-[100px] text-center">
                    <span className="text-lg mb-1">⚠️</span>
                    <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Widget Error</span>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
