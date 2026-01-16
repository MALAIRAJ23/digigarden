// components/Editor.jsx
import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useToast } from "./ToastContext";
import MarkdownToolbar from "./MarkdownToolbar";
import LinkSuggestions from "./LinkSuggestions";
import MathRenderer from "./MathRenderer";
import CodeHighlighter from "./CodeHighlighter";

export default function Editor({
  id = null,
  initialTitle = "",
  initialContent = "",
  initialTags = [],
  initialVisibility = "private",
  onSave,
  saveLabel = "Save",
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tagsInput, setTagsInput] = useState(initialTags.join(", "));
  const [visibility, setVisibility] = useState(initialVisibility);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Link suggestions state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionQuery, setSuggestionQuery] = useState("");
  const [suggestionPosition, setSuggestionPosition] = useState({ top: 0, left: 0 });
  const [linkStart, setLinkStart] = useState(0);
  
  const autoSaveRef = useRef(null);
  const textareaRef = useRef(null);
  const { push } = useToast();

  // Word count calculation
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const charCount = content.length;

  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setTagsInput(initialTags.join(", "));
    setVisibility(initialVisibility);
  }, [initialTitle, initialContent, initialTags, initialVisibility]);

  // Track unsaved changes
  useEffect(() => {
    const hasChanges = 
      title !== initialTitle ||
      content !== initialContent ||
      tagsInput !== initialTags.join(", ") ||
      visibility !== initialVisibility;
    setHasUnsavedChanges(hasChanges);
  }, [title, content, tagsInput, visibility, initialTitle, initialContent, initialTags, initialVisibility]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveRef.current) {
      clearTimeout(autoSaveRef.current);
    }
    
    if (hasUnsavedChanges && id) {
      autoSaveRef.current = setTimeout(() => {
        handleSave(null, true);
      }, 3000);
    }
    
    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
    };
  }, [title, content, tagsInput, visibility, hasUnsavedChanges, id]);

  // Handle link suggestions
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    setContent(newContent);
    
    // Check for [[ pattern
    const beforeCursor = newContent.substring(0, cursorPos);
    const linkMatch = beforeCursor.match(/\[\[([^\]]*)$/);
    
    if (linkMatch) {
      const query = linkMatch[1];
      const linkStartPos = cursorPos - query.length;
      
      setShowSuggestions(true);
      setSuggestionQuery(query);
      setLinkStart(linkStartPos);
      
      // Calculate position for suggestions dropdown
      const textarea = e.target;
      const rect = textarea.getBoundingClientRect();
      setSuggestionPosition({
        top: rect.top + 20,
        left: rect.left + 20
      });
    } else {
      setShowSuggestions(false);
    }
  };

  const handleLinkSelect = (noteTitle) => {
    const beforeLink = content.substring(0, linkStart - 2); // -2 for [[
    const afterCursor = content.substring(textareaRef.current.selectionStart);
    const newContent = beforeLink + `[[${noteTitle}]]` + afterCursor;
    
    setContent(newContent);
    setShowSuggestions(false);
    
    // Focus back to textarea
    setTimeout(() => {
      textareaRef.current.focus();
      const newPos = beforeLink.length + noteTitle.length + 4; // 4 for [[]]
      textareaRef.current.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleToolbarInsert = (start, end, text) => {
    const before = content.substring(0, start);
    const after = content.substring(end);
    const newContent = before + text + after;
    setContent(newContent);
  };

  function parseTags(input) {
    return input
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  async function handleSave(e, silent = false) {
    e?.preventDefault();
    if (!title.trim()) {
      if (!silent) push("Please enter a title.", "error");
      return;
    }
    setSaving(true);
    try {
      const saved = await onSave({
        id,
        title: title.trim(),
        content,
        tags: parseTags(tagsInput),
        visibility,
      });
      if (!silent) push("Saved note", "info");
      setHasUnsavedChanges(false);
      return saved;
    } catch (err) {
      if (!silent) push("Failed to save note", "error");
      throw err;
    } finally {
      setSaving(false);
    }
  }

  // Enhanced keyboard shortcuts for editor
  useEffect(() => {
    const onKey = (e) => {
      if (e.target !== textareaRef.current) return;
      
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      
      if (isCtrlOrCmd) {
        switch (e.key.toLowerCase()) {
          case "s":
            e.preventDefault();
            handleSave();
            break;
          case "b":
            e.preventDefault();
            handleToolbarInsert(
              textareaRef.current.selectionStart,
              textareaRef.current.selectionEnd,
              "**bold**"
            );
            break;
          case "i":
            e.preventDefault();
            handleToolbarInsert(
              textareaRef.current.selectionStart,
              textareaRef.current.selectionEnd,
              "*italic*"
            );
            break;
        }
      }
    };
    
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [title, content, tagsInput, visibility]);

  return (
    <div style={{ position: "relative" }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: "block", fontSize: 13 }}>Title</label>
        <input 
          aria-label="Note title" 
          placeholder="Note title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }} 
        />
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
        <input 
          aria-label="Tags" 
          placeholder="tags (comma separated)" 
          value={tagsInput} 
          onChange={(e) => setTagsInput(e.target.value)} 
          style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #ddd" }} 
        />
        <select 
          aria-label="Visibility" 
          value={visibility} 
          onChange={(e) => setVisibility(e.target.value)} 
          style={{ padding: 8, borderRadius: 6 }}
        >
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
      </div>

      <div className="editor-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <label style={{ fontSize: 13 }}>Content (Markdown)</label>
            <div className="small">
              {wordCount} words • {charCount} chars
              {hasUnsavedChanges && <span style={{ color: "var(--accent)", marginLeft: 8 }}>• Unsaved</span>}
            </div>
          </div>
          
          <MarkdownToolbar onInsert={handleToolbarInsert} textareaRef={textareaRef} />
          
          <textarea 
            ref={textareaRef}
            aria-label="Note content" 
            placeholder="Write markdown here... Type [[ to link to other notes" 
            value={content} 
            onChange={handleContentChange}
            style={{ width: "100%", minHeight: 320, padding: 10, borderRadius: 6, border: "1px solid #ddd" }} 
          />
        </div>

        <div className="editor-preview" style={{ background: "var(--surface)", padding: 12, borderRadius: 6, minHeight: 320, overflow: "auto", border: "1px solid #eee" }}>
          <h4 style={{ marginTop: 0 }}>Preview</h4>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : 'text';
                
                if (inline) {
                  return <code className={className} {...props}>{children}</code>;
                }
                
                return (
                  <CodeHighlighter 
                    code={String(children).replace(/\n$/, '')} 
                    language={language}
                  />
                );
              },
              // Math rendering
              p({children}) {
                const text = children?.toString() || '';
                if (text.startsWith('$$') && text.endsWith('$$')) {
                  return <MathRenderer>{text.slice(2, -2)}</MathRenderer>;
                }
                return <p>{children}</p>;
              },
              // Inline math
              inlineCode({children}) {
                const text = children?.toString() || '';
                if (text.startsWith('$') && text.endsWith('$')) {
                  return <MathRenderer inline>{text.slice(1, -1)}</MathRenderer>;
                }
                return <code>{children}</code>;
              }
            }}
          >
            {content || "_Nothing yet_"}
          </ReactMarkdown>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <button className="btn" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : saveLabel}
        </button>
        {id && (
          <span className="small" style={{ marginLeft: 12 }}>
            Auto-saves every 3 seconds • Press Ctrl+S to save manually
          </span>
        )}
      </div>
      
      <LinkSuggestions
        show={showSuggestions}
        query={suggestionQuery}
        position={suggestionPosition}
        onSelect={handleLinkSelect}
        onClose={() => setShowSuggestions(false)}
      />
    </div>
  );
}
