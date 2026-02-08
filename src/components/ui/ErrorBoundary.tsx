import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
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
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Algo salió mal</h2>
          <p className="text-gray-600 mb-6">Hubo un error al cargar esta sección. Por favor, intenta recargar.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
          >
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;