import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // You can also log the error to an error reporting service here
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        // Reload the page as a hard reset
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-50 dark:bg-[#0A101D] flex flex-col items-center justify-center p-6 text-center font-sans">
                    <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-100 dark:border-red-500/20 shadow-sm">
                        <AlertTriangle className="w-10 h-10 text-red-500 dark:text-red-400" />
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Beklenmedik Bir Hata Oluştu</h1>

                    <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
                        Uygulama çalışırken bir sorunla karşılaştık. Endişelenmeyin, bu geçici bir durum olabilir. Sayfayı yenileyerek tekrar deneyebilirsiniz.
                    </p>

                    {/* Dev only error details */}
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <div className="mb-8 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl text-left overflow-auto max-w-full w-full border border-slate-200 dark:border-white/5">
                            <p className="text-xs text-red-600 dark:text-red-400 font-mono font-bold mb-1">{this.state.error.toString()}</p>
                            <pre className="text-[10px] text-slate-500 dark:text-slate-500 font-mono whitespace-pre-wrap">
                                {this.state.error.stack}
                            </pre>
                        </div>
                    )}

                    <button
                        onClick={this.handleReset}
                        className="flex items-center gap-2.5 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold transition-all shadow-md shadow-emerald-600/20"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Uygulamayı Yeniden Başlat
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
