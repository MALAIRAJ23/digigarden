// components/ThemeCustomizer.jsx
import { useState, useEffect } from 'react';
import { THEME_PRESETS, applyTheme, getCurrentTheme, getThemeMode } from '../lib/themes';

export default function ThemeCustomizer({ show, onClose }) {
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [currentMode, setCurrentMode] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && show) {
      setSelectedTheme(getCurrentTheme());
      setCurrentMode(getThemeMode());
    }
  }, [show, mounted]);

  const handleThemeChange = (themeKey) => {
    setSelectedTheme(themeKey);
    applyTheme(themeKey, currentMode);
  };

  const handleModeChange = (mode) => {
    if (typeof window === 'undefined') return;
    
    setCurrentMode(mode);
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem('dg_theme', mode);
    applyTheme(selectedTheme, mode);
  };

  if (!show || !mounted) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '500px',
          maxWidth: '90vw',
          maxHeight: '80vh',
          overflow: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0 }}>🎨 Customize Theme</h2>
          <button onClick={onClose} className="btn--ghost btn--small">✕</button>
        </div>

        {/* Mode Selection */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 12 }}>Appearance Mode</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => handleModeChange('light')}
              className={currentMode === 'light' ? 'btn' : 'btn--secondary'}
            >
              ☀️ Light
            </button>
            <button
              onClick={() => handleModeChange('dark')}
              className={currentMode === 'dark' ? 'btn' : 'btn--secondary'}
            >
              🌙 Dark
            </button>
          </div>
        </div>

        {/* Theme Presets */}
        <div>
          <h3 style={{ marginBottom: 12 }}>Color Scheme</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {Object.entries(THEME_PRESETS).map(([key, theme]) => (
              <div
                key={key}
                onClick={() => handleThemeChange(key)}
                style={{
                  padding: '12px',
                  border: selectedTheme === key ? '2px solid var(--accent)' : '1px solid rgba(15,23,36,0.1)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: selectedTheme === key ? 'rgba(37,99,235,0.05)' : 'transparent'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{theme.name}</div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {Object.values(theme[currentMode]).map((color, index) => (
                      <div
                        key={index}
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          background: color,
                          border: '1px solid rgba(0,0,0,0.1)'
                        }}
                      />
                    ))}
                  </div>
                </div>
                {selectedTheme === key && (
                  <div style={{ color: 'var(--accent)', fontSize: 18 }}>✓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div style={{ marginTop: 24, padding: 16, background: 'rgba(15,23,36,0.02)', borderRadius: 8 }}>
          <h4 style={{ margin: '0 0 8px 0' }}>Preview</h4>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <button className="btn btn--small">Primary</button>
            <button className="btn--secondary btn--small">Secondary</button>
            <button className="btn--ghost btn--small">Ghost</button>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            Sample text in current theme colors
          </div>
        </div>

        <div style={{ marginTop: 20, textAlign: 'right' }}>
          <button onClick={onClose} className="btn">
            Apply Theme
          </button>
        </div>
      </div>
    </div>
  );
}