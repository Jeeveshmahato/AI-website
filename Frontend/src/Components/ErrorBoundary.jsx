import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    // A failed lazy-loaded chunk usually means a new deploy replaced old assets; reload once.
    if (/Failed to fetch dynamically imported module|Importing a module script failed/i.test(error?.message)) {
      try {
        if (!sessionStorage.getItem("chunk_reload")) {
          sessionStorage.setItem("chunk_reload", "1");
          window.location.reload();
        }
      } catch {
        // ignore
      }
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-ink-950 p-6 text-center">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Something went wrong</h1>
        <p className="mt-3 max-w-md text-slate-400">An unexpected error occurred. Refreshing the page usually fixes it.</p>
        <button type="button" onClick={() => window.location.reload()} className="btn-primary mt-8">
          Refresh page
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
