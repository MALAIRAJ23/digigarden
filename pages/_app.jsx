// pages/_app.jsx
import "../styles/globals.css";
import Link from "next/link";
import Head from "next/head";
import Script from "next/script";
import { useState, useEffect } from "react";
import { ToastProvider } from "../components/ToastContext";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import ThemeToggle from "../components/ThemeToggle";
import KeyboardShortcuts from "../components/KeyboardShortcuts";
import CommandPalette from "../components/CommandPalette";
import MobileNav from "../components/MobileNav";
import HamburgerMenu from "../components/HamburgerMenu";
import ErrorBoundary from "../components/ErrorBoundary";

export default function App({ Component, pageProps }) {
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  // Global keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <div className="app-root">
          <Head>
            <title>Digital Garden</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </Head>
          
          <Script
            id="env-config"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.ENV = {
                  NEXT_PUBLIC_SUPABASE_URL: '${process.env.NEXT_PUBLIC_SUPABASE_URL || ''}',
                  NEXT_PUBLIC_SUPABASE_ANON_KEY: '${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}'
                };
              `
            }}
          />

          <Header onOpenCommandPalette={() => setShowCommandPalette(true)} />

          <main className="container">
            <Component {...pageProps} />
          </main>
          
          <MobileNav />
          <KeyboardShortcuts />
          <CommandPalette 
            show={showCommandPalette} 
            onClose={() => setShowCommandPalette(false)} 
          />
        </div>
      </ToastProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}

function Header({ onOpenCommandPalette }) {
  const { user, signOut } = useAuth();

  return (
    <header className="header" role="banner">
      <div className="logo">
        <Link href="/">Digital Garden</Link>
      </div>

      <div className="header-actions">
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link href="/">Home</Link>
          <span style={{ margin: "0 8px" }}>|</span>
          <Link href="/dashboard">Dashboard</Link>
          <span style={{ margin: "0 8px" }}>|</span>
          <Link href="/notes">Notes</Link>
          <span style={{ margin: "0 8px" }}>|</span>
          <Link href="/collections">Collections</Link>
          <span style={{ margin: "0 8px" }}>|</span>
          <Link href="/analytics">Analytics</Link>
          <span style={{ margin: "0 8px" }}>|</span>
          <Link href="/graph">Graph</Link>
          <span style={{ margin: "0 8px" }}>|</span>
          <Link href="/search">Search</Link>
          <span style={{ margin: "0 8px" }}>|</span>
          <Link href="/random">Random</Link>
          <span style={{ margin: "0 8px" }}>|</span>
          <Link href="/settings">Settings</Link>
          <span style={{ margin: "0 8px" }}>|</span>
          <button 
            onClick={onOpenCommandPalette}
            className="btn--ghost btn--small" 
            title="Command Palette (Ctrl+K)"
          >
            ⌘K
          </button>
          <span style={{ margin: "0 8px" }}>|</span>
          <ThemeToggle />
          <span style={{ margin: "0 8px" }}>|</span>
          <button 
            className="btn--ghost btn--small" 
            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }))}
            title="Keyboard shortcuts (?)"
          >
            ⌨️
          </button>
          {user && (
            <>
              <span style={{ margin: "0 8px" }}>|</span>
              <span style={{ color: "var(--muted)", fontSize: "14px" }}>{user.email}</span>
              <button 
                onClick={signOut}
                className="btn--ghost btn--small"
                title="Logout"
              >
                🚪
              </button>
            </>
          )}
          {!user && (
            <>
              <span style={{ margin: "0 8px" }}>|</span>
              <Link href="/login" className="btn--ghost btn--small">Login</Link>
            </>
          )}
        </nav>
        
        <div className="mobile-header-actions">
          <ThemeToggle />
          {user && (
            <button 
              onClick={signOut}
              className="btn--ghost btn--small"
              title="Logout"
            >
              🚪
            </button>
          )}
          <HamburgerMenu onOpenCommandPalette={onOpenCommandPalette} />
        </div>
      </div>
    </header>
  );
}
