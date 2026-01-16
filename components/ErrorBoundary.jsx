// components/ErrorBoundary.jsx
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "40px",
          textAlign: "center",
          maxWidth: "600px",
          margin: "60px auto"
        }}>
          <div className="card">
            <h1 style={{ fontSize: "48px", margin: 0 }}>⚠️</h1>
            <h2 style={{ marginTop: "16px" }}>Something went wrong</h2>
            <p style={{ color: "var(--muted)", marginBottom: "24px" }}>
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details style={{ 
                textAlign: "left", 
                background: "rgba(220,38,38,0.1)", 
                padding: "16px", 
                borderRadius: "8px",
                marginBottom: "16px"
              }}>
                <summary style={{ cursor: "pointer", fontWeight: "600", marginBottom: "8px" }}>
                  Error Details
                </summary>
                <pre style={{ 
                  fontSize: "12px", 
                  overflow: "auto",
                  color: "var(--danger)"
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
              <button 
                onClick={() => window.location.reload()} 
                className="btn"
              >
                Refresh Page
              </button>
              <button 
                onClick={() => window.location.href = "/"} 
                className="btn--secondary"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
