// components/CommandPalette.jsx
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { getAllNotes } from '../lib/storage';
import { fuzzyMatch } from '../lib/fuzzySearch';

export default function CommandPalette({ show, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [notes, setNotes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadNotes = async () => {
      const allNotes = await getAllNotes();
      setNotes(Array.isArray(allNotes) ? allNotes : []);
    };
    loadNotes();
  }, []);

  const commands = useMemo(() => {
    
    const staticCommands = [
      {
        id: 'new-note',
        title: 'Create New Note',
        description: 'Start writing a new note',
        icon: '📝',
        action: () => router.push('/notes/new'),
        category: 'Actions'
      },
      {
        id: 'search',
        title: 'Search Notes',
        description: 'Find notes by content or title',
        icon: '🔍',
        action: () => router.push('/search'),
        category: 'Navigation'
      },
      {
        id: 'dashboard',
        title: 'Go to Dashboard',
        description: 'View analytics and overview',
        icon: '📊',
        action: () => router.push('/dashboard'),
        category: 'Navigation'
      },
      {
        id: 'collections',
        title: 'View Collections',
        description: 'Browse note collections',
        icon: '📁',
        action: () => router.push('/collections'),
        category: 'Navigation'
      },
      {
        id: 'graph',
        title: 'Knowledge Graph',
        description: 'Visualize note connections',
        icon: '🕸️',
        action: () => router.push('/graph'),
        category: 'Navigation'
      },
      {
        id: 'random',
        title: 'Random Note',
        description: 'Discover a random note',
        icon: '🎲',
        action: () => router.push('/random'),
        category: 'Discovery'
      },
      {
        id: 'export',
        title: 'Export All Notes',
        description: 'Download notes as JSON',
        icon: '📤',
        action: async () => {
          const data = await getAllNotes();
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `digital-garden-export-${new Date().toISOString().split('T')[0]}.json`;
          a.click();
          URL.revokeObjectURL(url);
        },
        category: 'Actions'
      },
      {
        id: 'toggle-theme',
        title: 'Toggle Theme',
        description: 'Switch between light and dark mode',
        icon: '🌓',
        action: () => {
          const current = document.documentElement.getAttribute('data-theme') || 'light';
          const newTheme = current === 'light' ? 'dark' : 'light';
          document.documentElement.setAttribute('data-theme', newTheme);
          localStorage.setItem('dg_theme', newTheme);
        },
        category: 'Settings'
      }
    ];

    // Add notes as commands
    const noteCommands = notes.map(note => ({
      id: `note-${note.id}`,
      title: note.title,
      description: `Open "${note.title}"`,
      icon: '📄',
      action: () => router.push(`/notes/${note.slug}`),
      category: 'Notes',
      tags: note.tags || [],
      content: note.content || ''
    }));

    return [...staticCommands, ...noteCommands];
  }, [router, notes]);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;

    return commands
      .map(cmd => {
        const titleMatch = fuzzyMatch(query, cmd.title);
        const descMatch = fuzzyMatch(query, cmd.description);
        const categoryMatch = fuzzyMatch(query, cmd.category);
        const tagsMatch = cmd.tags ? fuzzyMatch(query, cmd.tags.join(' ')) : { score: 0 };
        
        const maxScore = Math.max(
          titleMatch.score * 2,
          descMatch.score,
          categoryMatch.score,
          tagsMatch.score
        );

        return { ...cmd, searchScore: maxScore };
      })
      .filter(cmd => cmd.searchScore > 0.2)
      .sort((a, b) => b.searchScore - a.searchScore);
  }, [commands, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands]);

  useEffect(() => {
    if (!show) {
      setQuery('');
      setSelectedIndex(0);
      return;
    }

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [show, filteredCommands, selectedIndex, onClose]);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh',
        zIndex: 9999
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '600px',
          maxWidth: '90vw',
          maxHeight: '70vh',
          padding: 0,
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(15,23,36,0.1)' }}>
          <input
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              fontSize: '16px',
              outline: 'none'
            }}
          />
        </div>

        {/* Results */}
        <div style={{ maxHeight: '400px', overflow: 'auto' }}>
          {filteredCommands.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)' }}>
              No commands found
            </div>
          ) : (
            filteredCommands.map((cmd, index) => (
              <div
                key={cmd.id}
                onClick={() => {
                  cmd.action();
                  onClose();
                }}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  background: index === selectedIndex ? 'var(--accent)' : 'transparent',
                  color: index === selectedIndex ? 'white' : 'var(--text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderBottom: '1px solid rgba(15,23,36,0.05)'
                }}
              >
                <span style={{ fontSize: '18px' }}>{cmd.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>
                    {cmd.title}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    opacity: 0.8,
                    marginTop: '2px'
                  }}>
                    {cmd.description}
                  </div>
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  opacity: 0.6,
                  background: index === selectedIndex ? 'rgba(255,255,255,0.2)' : 'rgba(15,23,36,0.1)',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  {cmd.category}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ 
          padding: '8px 16px', 
          borderTop: '1px solid rgba(15,23,36,0.1)',
          fontSize: '11px',
          color: 'var(--muted)',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>↑↓ Navigate • Enter Select • Esc Close</span>
          <span>{filteredCommands.length} commands</span>
        </div>
      </div>
    </div>
  );
}