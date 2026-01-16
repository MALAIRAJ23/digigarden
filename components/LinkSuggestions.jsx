// components/LinkSuggestions.jsx
import { useState, useEffect } from "react";
import { getAllNotes } from "../lib/storage";

export default function LinkSuggestions({ 
  show, 
  query, 
  position, 
  onSelect, 
  onClose 
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!show || !query) {
      setSuggestions([]);
      return;
    }

    const notes = getAllNotes();
    const filtered = notes
      .filter(note => 
        note.title.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 8)
      .map(note => ({
        title: note.title,
        slug: note.slug,
        tags: note.tags || []
      }));

    setSuggestions(filtered);
    setSelectedIndex(0);
  }, [show, query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!show || suggestions.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (suggestions[selectedIndex]) {
            onSelect(suggestions[selectedIndex].title);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [show, suggestions, selectedIndex, onSelect, onClose]);

  if (!show || suggestions.length === 0) return null;

  return (
    <div
      className="link-suggestions"
      style={{
        position: "absolute",
        top: position.top + 20,
        left: position.left,
        background: "var(--surface)",
        border: "1px solid rgba(15,23,36,0.1)",
        borderRadius: "8px",
        boxShadow: "var(--shadow-md)",
        zIndex: 1000,
        minWidth: 200,
        maxWidth: 300,
        maxHeight: 200,
        overflow: "auto"
      }}
    >
      {suggestions.map((suggestion, index) => (
        <div
          key={suggestion.slug}
          className={`suggestion-item ${index === selectedIndex ? "selected" : ""}`}
          onClick={() => onSelect(suggestion.title)}
          style={{
            padding: "8px 12px",
            cursor: "pointer",
            borderBottom: index < suggestions.length - 1 ? "1px solid rgba(15,23,36,0.05)" : "none",
            backgroundColor: index === selectedIndex ? "var(--accent)" : "transparent",
            color: index === selectedIndex ? "white" : "var(--text)"
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 14 }}>
            {suggestion.title}
          </div>
          {suggestion.tags.length > 0 && (
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>
              {suggestion.tags.slice(0, 3).join(", ")}
            </div>
          )}
        </div>
      ))}
      <div style={{ 
        padding: "6px 12px", 
        fontSize: 11, 
        color: "var(--muted)", 
        borderTop: "1px solid rgba(15,23,36,0.05)" 
      }}>
        ↑↓ Navigate • Enter Select • Esc Close
      </div>
    </div>
  );
}