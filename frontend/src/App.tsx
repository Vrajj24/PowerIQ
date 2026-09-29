import { Component, type ErrorInfo, type ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router';
import { AuthProvider } from './context/AuthContext';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#090d14] text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bg-[#121824] border border-[#1e293b] rounded-xl p-6 max-w-xl space-y-4 shadow-xl text-left">
            <h2 className="text-lg font-bold text-slate-100">Rendering Exception Caught</h2>
            <div className="bg-[#090d14] border border-[#1e293b] rounded-lg p-3 font-mono text-xs text-rose-400 overflow-x-auto">
              <p className="font-bold">{this.state.error?.name}: {this.state.error?.message}</p>
              {this.state.error?.stack && (
                <pre className="text-[10px] text-slate-400 mt-2 overflow-x-auto whitespace-pre-wrap">
                  {this.state.error.stack}
                </pre>
              )}
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              className="px-4 py-2 bg-slate-100 text-slate-950 font-semibold text-xs rounded-lg hover:bg-white transition-all"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
