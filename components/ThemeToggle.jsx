// components/ThemeToggle.jsx
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("system");
  const [resolvedTheme, setResolvedTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const saved = localStorage.getItem("dg_theme") || "system";
      setTheme(saved);
      updateResolvedTheme(saved);
    }
  }, [mounted]);

  useEffect(() => {
    if (mounted && theme === "system") {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateResolvedTheme("system");
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, mounted]);

  const updateResolvedTheme = (themeValue) => {
    let resolved;
    if (themeValue === "system") {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
    } else {
      resolved = themeValue;
    }
    
    setResolvedTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
  };

  const cycleTheme = () => {
    if (typeof window === 'undefined') return;
    
    const themes = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    
    setTheme(nextTheme);
    localStorage.setItem("dg_theme", nextTheme);
    updateResolvedTheme(nextTheme);
  };

  if (!mounted) {
    return (
      <button className="btn--ghost btn--small" disabled>
        🌙
      </button>
    );
  }

  const getIcon = () => {
    if (theme === "system") return "🖥️";
    return resolvedTheme === "light" ? "🌙" : "☀️";
  };

  const getTitle = () => {
    if (theme === "system") return "Using system preference";
    return `Switch to ${resolvedTheme === "light" ? "dark" : "light"} mode`;
  };

  return (
    <button
      onClick={cycleTheme}
      className="btn--ghost btn--small"
      title={getTitle()}
    >
      {getIcon()}
    </button>
  );
}