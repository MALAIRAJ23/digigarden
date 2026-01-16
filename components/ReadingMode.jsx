// components/ReadingMode.jsx
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ReadingMode({ note, onClose }) {
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [maxWidth, setMaxWidth] = useState(700);

  // Reading time calculation (average 200 words per minute)
  const wordCount = note.content ? note.content.split(/\s+/).filter(Boolean).length : 0;
  const readingTime = Math.ceil(wordCount / 200);

  useEffect(() => {
    // Prevent body scroll when reading mode is active
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "var(--bg)",
        zIndex: 9999,
        overflow: "auto",
        padding: "20px"
      }}
    >
      {/* Header Controls */}
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          display: "flex",
          gap: 8,
          background: "var(--surface)",
          padding: "8px 12px",
          borderRadius: 8,
          boxShadow: "var(--shadow-md)",
          zIndex: 10000
        }}
      >
        <button
          onClick={() => setFontSize(prev => Math.max(12, prev - 2))}
          className="btn--ghost btn--small"
          title="Decrease font size"
        >
          A-
        </button>
        <button
          onClick={() => setFontSize(prev => Math.min(24, prev + 2))}
          className="btn--ghost btn--small"
          title="Increase font size"
        >
          A+
        </button>
        <button
          onClick={() => window.print()}
          className="btn--ghost btn--small"
          title="Print"
        >
          🖨️
        </button>
        <button
          onClick={onClose}
          className="btn--ghost btn--small"
          title="Exit reading mode (Esc)"
        >
          ✕
        </button>
      </div>

      {/* Reading Content */}
      <div
        style={{
          maxWidth: maxWidth,
          margin: "60px auto 40px auto",
          fontSize: fontSize,
          lineHeight: lineHeight,
          color: "var(--text)"
        }}
      >
        {/* Article Header */}
        <header style={{ marginBottom: 32, paddingBottom: 16, borderBottom: "1px solid rgba(15,23,36,0.1)" }}>
          <h1 style={{ 
            fontSize: fontSize * 1.8, 
            marginBottom: 12, 
            fontWeight: 700,
            lineHeight: 1.2
          }}>
            {note.title}
          </h1>
          
          <div style={{ 
            display: "flex", 
            gap: 16, 
            fontSize: fontSize * 0.8, 
            color: "var(--muted)",
            flexWrap: "wrap"
          }}>
            <span>📖 {readingTime} min read</span>
            <span>📝 {wordCount} words</span>
            <span>🏷️ {note.tags?.join(", ") || "No tags"}</span>
            <span>📅 {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}</span>
          </div>
        </header>

        {/* Article Content */}
        <article
          style={{
            fontSize: fontSize,
            lineHeight: lineHeight
          }}
        >
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              // Custom styling for reading mode
              h1: ({children}) => <h1 style={{fontSize: fontSize * 1.6, marginTop: 32, marginBottom: 16}}>{children}</h1>,
              h2: ({children}) => <h2 style={{fontSize: fontSize * 1.4, marginTop: 28, marginBottom: 14}}>{children}</h2>,
              h3: ({children}) => <h3 style={{fontSize: fontSize * 1.2, marginTop: 24, marginBottom: 12}}>{children}</h3>,
              p: ({children}) => <p style={{marginBottom: 16, lineHeight: lineHeight}}>{children}</p>,
              blockquote: ({children}) => (
                <blockquote style={{
                  borderLeft: "4px solid var(--accent)",
                  paddingLeft: 16,
                  margin: "16px 0",
                  fontStyle: "italic",
                  color: "var(--muted-2)"
                }}>
                  {children}
                </blockquote>
              ),
              code: ({children}) => (
                <code style={{
                  background: "rgba(15,23,36,0.06)",
                  padding: "2px 6px",
                  borderRadius: 4,
                  fontFamily: "var(--mono)",
                  fontSize: fontSize * 0.9
                }}>
                  {children}
                </code>
              ),
              pre: ({children}) => (
                <pre style={{
                  background: "rgba(15,23,36,0.06)",
                  padding: 16,
                  borderRadius: 8,
                  overflow: "auto",
                  fontFamily: "var(--mono)",
                  fontSize: fontSize * 0.9,
                  lineHeight: 1.4
                }}>
                  {children}
                </pre>
              )
            }}
          >
            {note.content || "_No content_"}
          </ReactMarkdown>
        </article>

        {/* Reading Progress Indicator */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: 3,
            background: "var(--accent)",
            transition: "width 0.1s ease",
            zIndex: 10001
          }}
          id="reading-progress"
        />
      </div>
    </div>
  );
}