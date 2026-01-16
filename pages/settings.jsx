// pages/settings.jsx
import { useState, useEffect } from 'react';
import ThemeCustomizer from '../components/ThemeCustomizer';
import { getCurrentTheme, getThemeMode } from '../lib/themes';

export default function SettingsPage() {
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');
  const [currentMode, setCurrentMode] = useState('light');
  const [settings, setSettings] = useState({
    autoSave: true,
    showWordCount: true,
    enableAnimations: true,
    compactMode: false,
    fontSize: 'medium'
  });

  useEffect(() => {
    setCurrentTheme(getCurrentTheme());
    setCurrentMode(getThemeMode());
    
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('dg_settings');
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) });
    }
  }, []);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('dg_settings', JSON.stringify(newSettings));
  };

  return (
    <div>
      <h1>⚙️ Settings</h1>
      
      {/* Appearance Section */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 16 }}>🎨 Appearance</h2>
        
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Theme Customization</strong>
              <div className="small">Current: {currentTheme} ({currentMode} mode)</div>
            </div>
            <button 
              onClick={() => setShowThemeCustomizer(true)}
              className="btn--secondary"
            >
              Customize Theme
            </button>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Font Size</strong>
              <div className="small">Adjust text size throughout the app</div>
            </div>
            <select 
              value={settings.fontSize}
              onChange={(e) => updateSetting('fontSize', e.target.value)}
              style={{ padding: '6px 8px' }}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Compact Mode</strong>
              <div className="small">Reduce spacing for more content</div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input 
                type="checkbox"
                checked={settings.compactMode}
                onChange={(e) => updateSetting('compactMode', e.target.checked)}
              />
              Enable
            </label>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Animations</strong>
              <div className="small">Enable smooth transitions and effects</div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input 
                type="checkbox"
                checked={settings.enableAnimations}
                onChange={(e) => updateSetting('enableAnimations', e.target.checked)}
              />
              Enable
            </label>
          </div>
        </div>
      </div>
      
      {/* Editor Section */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 16 }}>✏️ Editor</h2>
        
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Auto-save</strong>
              <div className="small">Automatically save changes every 3 seconds</div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input 
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => updateSetting('autoSave', e.target.checked)}
              />
              Enable
            </label>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Word Count</strong>
              <div className="small">Show word and character count in editor</div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input 
                type="checkbox"
                checked={settings.showWordCount}
                onChange={(e) => updateSetting('showWordCount', e.target.checked)}
              />
              Show
            </label>
          </div>
        </div>
      </div>
      
      {/* Data Section */}
      <div className="card">
        <h2 style={{ marginBottom: 16 }}>💾 Data Management</h2>
        
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ padding: 12, background: 'rgba(15,23,36,0.02)', borderRadius: 8 }}>
            <strong>Storage Location</strong>
            <div className="small" style={{ marginTop: 4 }}>Your notes are stored locally in your browser</div>
          </div>
          
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn--secondary">Export All Data</button>
            <button className="btn--secondary">Import Data</button>
            <button className="btn--danger">Clear All Data</button>
          </div>
        </div>
      </div>
      
      <ThemeCustomizer 
        show={showThemeCustomizer}
        onClose={() => setShowThemeCustomizer(false)}
      />
    </div>
  );
}