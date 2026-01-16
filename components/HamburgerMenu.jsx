import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function HamburgerMenu({ onOpenCommandPalette }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/notes', label: 'Notes' },
    { href: '/collections', label: 'Collections' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/graph', label: 'Graph' },
    { href: '/search', label: 'Search' },
    { href: '/random', label: 'Random' },
    { href: '/settings', label: 'Settings' }
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="hamburger-menu">
      <button 
        className="hamburger-button"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
      </button>

      {isOpen && (
        <>
          <div className="hamburger-overlay" onClick={closeMenu}></div>
          <div className="hamburger-dropdown">
            <nav className="hamburger-nav">
              {navItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={`hamburger-nav-item ${router.pathname === item.href ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              ))}
              <button 
                onClick={() => {
                  onOpenCommandPalette();
                  closeMenu();
                }}
                className="hamburger-nav-item hamburger-button-item"
              >
                ⌘ Command Palette
              </button>
            </nav>
          </div>
        </>
      )}

      <style jsx>{`
        .hamburger-menu {
          position: relative;
          display: none;
        }

        @media (max-width: 768px) {
          .hamburger-menu {
            display: block;
          }
        }

        .hamburger-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          border-radius: 6px;
          transition: background 0.2s ease;
        }

        .hamburger-button:hover {
          background: rgba(15,23,36,0.05);
        }

        .hamburger-line {
          width: 20px;
          height: 2px;
          background: var(--text);
          transition: all 0.3s ease;
          border-radius: 2px;
        }

        .hamburger-line.open:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .hamburger-line.open:nth-child(2) {
          opacity: 0;
        }

        .hamburger-line.open:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -6px);
        }

        .hamburger-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.3);
          z-index: 998;
        }

        .hamburger-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          z-index: 999;
          min-width: 200px;
          margin-top: 8px;
          backdrop-filter: blur(10px);
        }

        .hamburger-nav {
          padding: 12px 0;
        }

        .hamburger-nav-item {
          display: block;
          padding: 12px 20px;
          color: var(--text);
          text-decoration: none;
          font-size: var(--font-base);
          font-weight: 500;
          transition: all 0.2s ease;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }

        .hamburger-nav-item:hover {
          background: rgba(37,99,235,0.08);
          color: var(--accent);
        }

        .hamburger-nav-item.active {
          background: rgba(37,99,235,0.1);
          color: var(--accent);
          font-weight: 600;
        }

        .hamburger-button-item {
          border-top: 1px solid var(--border);
          margin-top: 8px;
          padding-top: 16px;
        }
      `}</style>
    </div>
  );
}