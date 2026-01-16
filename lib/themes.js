// lib/themes.js

export const THEME_PRESETS = {
  default: {
    name: 'Default Blue',
    light: {
      '--accent': '#2563eb',
      '--accent-2': '#7c3aed',
      '--success': '#16a34a',
      '--danger': '#dc2626'
    },
    dark: {
      '--accent': '#60a5fa',
      '--accent-2': '#9f7aea',
      '--success': '#22c55e',
      '--danger': '#ef4444'
    }
  },
  
  emerald: {
    name: 'Emerald Green',
    light: {
      '--accent': '#059669',
      '--accent-2': '#0d9488',
      '--success': '#16a34a',
      '--danger': '#dc2626'
    },
    dark: {
      '--accent': '#34d399',
      '--accent-2': '#5eead4',
      '--success': '#22c55e',
      '--danger': '#ef4444'
    }
  },

  purple: {
    name: 'Royal Purple',
    light: {
      '--accent': '#7c3aed',
      '--accent-2': '#a855f7',
      '--success': '#16a34a',
      '--danger': '#dc2626'
    },
    dark: {
      '--accent': '#a78bfa',
      '--accent-2': '#c084fc',
      '--success': '#22c55e',
      '--danger': '#ef4444'
    }
  },

  orange: {
    name: 'Sunset Orange',
    light: {
      '--accent': '#ea580c',
      '--accent-2': '#f59e0b',
      '--success': '#16a34a',
      '--danger': '#dc2626'
    },
    dark: {
      '--accent': '#fb923c',
      '--accent-2': '#fbbf24',
      '--success': '#22c55e',
      '--danger': '#ef4444'
    }
  },

  rose: {
    name: 'Rose Pink',
    light: {
      '--accent': '#e11d48',
      '--accent-2': '#ec4899',
      '--success': '#16a34a',
      '--danger': '#dc2626'
    },
    dark: {
      '--accent': '#fb7185',
      '--accent-2': '#f472b6',
      '--success': '#22c55e',
      '--danger': '#ef4444'
    }
  },

  slate: {
    name: 'Professional Slate',
    light: {
      '--accent': '#475569',
      '--accent-2': '#64748b',
      '--success': '#16a34a',
      '--danger': '#dc2626'
    },
    dark: {
      '--accent': '#94a3b8',
      '--accent-2': '#cbd5e1',
      '--success': '#22c55e',
      '--danger': '#ef4444'
    }
  }
};

export function applyTheme(themeKey, mode = 'light') {
  if (typeof window === 'undefined') return;
  
  const theme = THEME_PRESETS[themeKey];
  if (!theme) return;

  const colors = theme[mode];
  const root = document.documentElement;

  Object.entries(colors).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });

  // Save theme preference
  localStorage.setItem('dg_theme_preset', themeKey);
}

export function getCurrentTheme() {
  if (typeof window === 'undefined') return 'default';
  return localStorage.getItem('dg_theme_preset') || 'default';
}

export function getThemeMode() {
  if (typeof window === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') || 'light';
}