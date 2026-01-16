// components/CodeHighlighter.jsx
import { useMemo } from 'react';

const LANGUAGE_KEYWORDS = {
  javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'async', 'await', 'try', 'catch'],
  python: ['def', 'class', 'import', 'from', 'return', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'with', 'as', 'lambda'],
  java: ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'static', 'final', 'void', 'int', 'String', 'boolean'],
  css: ['color', 'background', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position', 'flex', 'grid'],
  html: ['div', 'span', 'p', 'h1', 'h2', 'h3', 'a', 'img', 'ul', 'li', 'table', 'tr', 'td'],
  sql: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'TABLE', 'INDEX', 'JOIN', 'INNER', 'LEFT', 'RIGHT']
};

const LANGUAGE_PATTERNS = {
  string: /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g,
  comment: /(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/gm,
  number: /\b\d+\.?\d*\b/g,
  operator: /[+\-*/%=<>!&|]+/g,
  punctuation: /[{}[\]();,.:]/g
};

export default function CodeHighlighter({ code, language = 'text', showLineNumbers = true }) {
  const highlightedCode = useMemo(() => {
    if (!code || language === 'text') return code;

    let highlighted = code;
    const keywords = LANGUAGE_KEYWORDS[language.toLowerCase()] || [];

    // Escape HTML
    highlighted = highlighted
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Highlight strings first (to avoid highlighting keywords inside strings)
    highlighted = highlighted.replace(LANGUAGE_PATTERNS.string, (match) => 
      `<span class="code-string">${match}</span>`
    );

    // Highlight comments
    highlighted = highlighted.replace(LANGUAGE_PATTERNS.comment, (match) => 
      `<span class="code-comment">${match}</span>`
    );

    // Highlight keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, (match) => 
        `<span class="code-keyword">${match}</span>`
      );
    });

    // Highlight numbers
    highlighted = highlighted.replace(LANGUAGE_PATTERNS.number, (match) => 
      `<span class="code-number">${match}</span>`
    );

    // Highlight operators
    highlighted = highlighted.replace(LANGUAGE_PATTERNS.operator, (match) => 
      `<span class="code-operator">${match}</span>`
    );

    return highlighted;
  }, [code, language]);

  const lines = code ? code.split('\n') : [];

  return (
    <div className="code-block" style={{
      background: 'var(--surface)',
      border: '1px solid rgba(15,23,36,0.1)',
      borderRadius: '8px',
      overflow: 'hidden',
      fontFamily: 'var(--mono)',
      fontSize: '14px',
      margin: '16px 0'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(15,23,36,0.05)',
        padding: '8px 12px',
        borderBottom: '1px solid rgba(15,23,36,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>
          {language.toUpperCase()}
        </span>
        <button
          onClick={() => navigator.clipboard?.writeText(code)}
          className="btn--ghost btn--small"
          style={{ fontSize: '11px', padding: '4px 6px' }}
          title="Copy code"
        >
          📋
        </button>
      </div>

      {/* Code Content */}
      <div style={{ display: 'flex' }}>
        {/* Line Numbers */}
        {showLineNumbers && (
          <div style={{
            background: 'rgba(15,23,36,0.02)',
            padding: '12px 8px',
            borderRight: '1px solid rgba(15,23,36,0.1)',
            color: 'var(--muted)',
            fontSize: '12px',
            lineHeight: '1.5',
            textAlign: 'right',
            minWidth: '40px',
            userSelect: 'none'
          }}>
            {lines.map((_, index) => (
              <div key={index}>{index + 1}</div>
            ))}
          </div>
        )}

        {/* Code */}
        <div style={{
          padding: '12px',
          overflow: 'auto',
          flex: 1,
          lineHeight: '1.5'
        }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
          </pre>
        </div>
      </div>
    </div>
  );
}