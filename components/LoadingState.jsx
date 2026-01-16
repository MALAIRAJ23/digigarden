// components/LoadingState.jsx

export function LoadingSpinner({ size = "medium" }) {
  const sizes = {
    small: 16,
    medium: 32,
    large: 48
  };

  return (
    <div style={{
      display: "inline-block",
      width: sizes[size],
      height: sizes[size],
      border: "3px solid rgba(37,99,235,0.1)",
      borderTopColor: "var(--accent)",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite"
    }} />
  );
}

export function LoadingPage({ message = "Loading..." }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "400px",
      gap: "16px"
    }}>
      <LoadingSpinner size="large" />
      <p style={{ color: "var(--muted)" }}>{message}</p>
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="skeleton skeleton-card">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text" />
    </div>
  );
}

export function LoadingGrid({ count = 6 }) {
  return (
    <div className="grid">
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
}
