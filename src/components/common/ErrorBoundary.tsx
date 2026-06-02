import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 px-6 py-20 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
          <div className="mx-auto max-w-2xl rounded-3xl border border-rose-200 bg-white p-10 shadow-soft dark:border-rose-700/50 dark:bg-slate-900/95">
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Something went wrong</h1>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">Please refresh the page or contact the support team if the issue persists.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
