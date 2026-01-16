// components/KeyboardShortcuts.jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function KeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        return;
      }

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      if (isCtrlOrCmd) {
        switch (e.key.toLowerCase()) {
          case "k":
            e.preventDefault();
            router.push("/search");
            break;
          case "n":
            e.preventDefault();
            router.push("/notes/new");
            break;
          case "h":
            e.preventDefault();
            router.push("/");
            break;
          case "d":
            e.preventDefault();
            router.push("/dashboard");
            break;
          case "g":
            e.preventDefault();
            router.push("/graph");
            break;
          case "r":
            e.preventDefault();
            router.push("/random");
            break;
          case "/":
            e.preventDefault();
            setShowHelp(true);
            break;
        }
      } else {
        switch (e.key) {
          case "?":
            e.preventDefault();
            setShowHelp(true);
            break;
          case "Escape":
            setShowHelp(false);
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const shortcuts = [
    { key: "Ctrl+K", desc: "Search notes" },
    { key: "Ctrl+N", desc: "New note" },
    { key: "Ctrl+H", desc: "Go home" },
    { key: "Ctrl+D", desc: "Dashboard" },
    { key: "Ctrl+G", desc: "Graph view" },
    { key: "Ctrl+R", desc: "Random note" },
    { key: "Ctrl+S", desc: "Save note (in editor)" },
    { key: "?", desc: "Show this help" },
    { key: "Esc", desc: "Close modals" }
  ];

  const editorShortcuts = [
    { key: "Ctrl+B", desc: "Bold text" },
    { key: "Ctrl+I", desc: "Italic text" },
    { key: "Ctrl+S", desc: "Save note" },
    { key: "[[", desc: "Start wiki link (shows suggestions)" },
    { key: "↑↓", desc: "Navigate link suggestions" },
    { key: "Enter", desc: "Select suggestion" }
  ];

  if (!showHelp) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999
      }}
      onClick={() => setShowHelp(false)}
    >
      <div
        className="card"
        style={{
          maxWidth: 500,
          width: "90%",
          maxHeight: "80vh",
          overflow: "auto"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>⌨️ Keyboard Shortcuts</h2>
          <button 
            onClick={() => setShowHelp(false)}
            className="btn--ghost btn--small"
          >
            ✕
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <h3>Global Shortcuts</h3>
            {shortcuts.map((shortcut, index) => (
              <div key={index} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span className="small">{shortcut.desc}</span>
                <code style={{ 
                  background: "rgba(15,23,36,0.06)", 
                  padding: "2px 6px", 
                  borderRadius: 4,
                  fontSize: 11
                }}>
                  {shortcut.key}
                </code>
              </div>
            ))}
          </div>

          <div>
            <h3>Editor Shortcuts</h3>
            {editorShortcuts.map((shortcut, index) => (
              <div key={index} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span className="small">{shortcut.desc}</span>
                <code style={{ 
                  background: "rgba(15,23,36,0.06)", 
                  padding: "2px 6px", 
                  borderRadius: 4,
                  fontSize: 11
                }}>
                  {shortcut.key}
                </code>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 16, padding: "12px", background: "var(--glass)", borderRadius: 8 }}>
          <p className="small" style={{ margin: 0 }}>
            💡 <strong>Tip:</strong> Press <code>?</code> or <code>Ctrl+/</code> anytime to see this help.
          </p>
        </div>
      </div>
    </div>
  );
}