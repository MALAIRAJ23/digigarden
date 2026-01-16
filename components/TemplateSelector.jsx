// components/TemplateSelector.jsx
import { NOTE_TEMPLATES } from "../lib/templates";

export default function TemplateSelector({ onSelect, selectedTemplate }) {
  const templates = [
    { key: "blank", name: "📝 Blank Note", desc: "Start from scratch" },
    { key: "daily", name: "📅 Daily Journal", desc: "Daily reflection template" },
    { key: "meeting", name: "🤝 Meeting Notes", desc: "Structured meeting notes" },
    { key: "project", name: "🚀 Project Plan", desc: "Project planning template" },
    { key: "book", name: "📚 Book Review", desc: "Book review template" },
    { key: "idea", name: "💡 Idea Capture", desc: "Brainstorm and idea template" }
  ];

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <h3 style={{ marginBottom: 12 }}>Choose a Template</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
        {templates.map(template => (
          <button
            key={template.key}
            onClick={() => onSelect(template.key)}
            className={`btn--ghost ${selectedTemplate === template.key ? "btn" : ""}`}
            style={{ 
              padding: 12, 
              textAlign: "left", 
              flexDirection: "column", 
              alignItems: "flex-start",
              height: "auto"
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{template.name}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{template.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}