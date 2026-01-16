// components/MarkdownToolbar.jsx
export default function MarkdownToolbar({ onInsert, textareaRef }) {
  
  const insertText = (before, after = "", placeholder = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const replacement = selectedText || placeholder;
    
    const newText = before + replacement + after;
    onInsert(start, end, newText);
    
    // Set cursor position
    setTimeout(() => {
      const newStart = start + before.length;
      const newEnd = newStart + replacement.length;
      textarea.setSelectionRange(newStart, newEnd);
      textarea.focus();
    }, 0);
  };

  const tools = [
    {
      icon: "B",
      title: "Bold (Ctrl+B)",
      action: () => insertText("**", "**", "bold text"),
      style: { fontWeight: "bold" }
    },
    {
      icon: "I",
      title: "Italic (Ctrl+I)",
      action: () => insertText("*", "*", "italic text"),
      style: { fontStyle: "italic" }
    },
    {
      icon: "H1",
      title: "Heading 1",
      action: () => insertText("# ", "", "Heading"),
      style: { fontSize: "12px" }
    },
    {
      icon: "H2",
      title: "Heading 2", 
      action: () => insertText("## ", "", "Heading"),
      style: { fontSize: "11px" }
    },
    {
      icon: "[]",
      title: "Link",
      action: () => insertText("[", "](url)", "link text")
    },
    {
      icon: "[[]]",
      title: "Wiki Link",
      action: () => insertText("[[", "]]", "Note Title")
    },
    {
      icon: "•",
      title: "Bullet List",
      action: () => insertText("- ", "", "List item")
    },
    {
      icon: "1.",
      title: "Numbered List",
      action: () => insertText("1. ", "", "List item")
    },
    {
      icon: "`",
      title: "Inline Code",
      action: () => insertText("`", "`", "code")
    },
    {
      icon: "```",
      title: "Code Block",
      action: () => insertText("```\n", "\n```", "code")
    },
    {
      icon: ">",
      title: "Quote",
      action: () => insertText("> ", "", "Quote text")
    },
    {
      icon: "—",
      title: "Horizontal Rule",
      action: () => insertText("\n---\n", "", "")
    }
  ];

  return (
    <div style={{ 
      display: "flex", 
      flexWrap: "wrap", 
      gap: 4, 
      padding: "8px 0", 
      borderBottom: "1px solid rgba(15,23,36,0.06)",
      marginBottom: 8
    }}>
      {tools.map((tool, index) => (
        <button
          key={index}
          onClick={tool.action}
          title={tool.title}
          className="btn--ghost btn--small"
          style={{
            minWidth: 32,
            height: 28,
            padding: "4px 6px",
            fontSize: 11,
            ...tool.style
          }}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
}