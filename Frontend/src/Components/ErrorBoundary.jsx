import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
          <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-400 mb-6">An unexpected error occurred. Please try refreshing the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
