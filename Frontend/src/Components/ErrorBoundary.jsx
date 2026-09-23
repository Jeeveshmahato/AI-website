import { Component } from "react";
import { isChunkLoadError, reloadFresh } from "../lib/staleDeploy";

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
    // A failed lazy-loaded page chunk usually means a new deploy deleted the old files:
    // reload once, bypassing the CDN's cached index.html.
    if (isChunkLoadError(error)) reloadFresh();
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-canvas p-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-fg">Something went wrong</h1>
        <p className="mt-3 max-w-md text-fg-muted">An unexpected error occurred. Refreshing the page usually fixes it.</p>
        <button type="button" onClick={() => window.location.reload()} className="btn-primary mt-8">
          Refresh page
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
