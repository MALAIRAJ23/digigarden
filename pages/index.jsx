// pages/index.jsx
import { useState, useEffect } from "react";
import { getAllNotes, saveNote } from "../lib/storage";
import Link from "next/link";
import FileUpload from "../components/FileUpload";
import DraggableNoteList from "../components/DraggableNoteList";
import MigrationBanner from "../components/MigrationBanner";
import { useRouter } from "next/router";
import { LoadingGrid } from "../components/LoadingState";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadNotes = async () => {
      const allNotes = await getAllNotes();
      setNotes(allNotes);
      setIsLoaded(true);
    };
    loadNotes();
  }, []);

  const handleFileUpload = async (files) => {
    for (const fileData of files) {
      if (fileData.file.type.startsWith('text/')) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const note = {
            title: fileData.name.replace(/\.[^/.]+$/, ""),
            content: e.target.result,
            tags: ['imported']
          };
          const savedNote = await saveNote(note);
          setNotes(prev => [savedNote, ...prev]);
        };
        reader.readAsText(fileData.file);
      }
    }
    setShowUpload(false);
  };

  const handleNotesReorder = async (reorderedNotes) => {
    setNotes(reorderedNotes);
    // Save each note with updated order
    for (let index = 0; index < reorderedNotes.length; index++) {
      const note = reorderedNotes[index];
      const updatedNote = { ...note, order: index };
      await saveNote(updatedNote);
    }
  };

  const handleNoteClick = (note) => {
    router.push(`/notes/${note.id}`);
  };

  if (!isLoaded) {
    return (
      <div>
        <h1>Welcome to Your Digital Garden 🌿</h1>
        <p>A place to store your notes, connect ideas, and visualize knowledge.</p>
        <Link href="/notes/new" className="btn" style={{ marginTop: "20px", display: "inline-block" }}>+ Create New Note</Link>
        
        <h2 style={{ marginTop: "30px" }}>Recent Notes</h2>
        <LoadingGrid count={6} />
      </div>
    );
  }

  return (
    <div>
      <MigrationBanner />
      
      <h1>Welcome to Your Digital Garden 🌿</h1>
      <p>A place to store your notes, connect ideas, and visualize knowledge.</p>

      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
        <Link href="/notes/new" className="btn">+ Create New Note</Link>
        <button 
          onClick={() => setShowUpload(!showUpload)} 
          className="btn--secondary"
        >
          📁 Import Files
        </button>
      </div>

      {showUpload && (
        <div style={{ marginTop: '20px' }}>
          <FileUpload 
            onUpload={handleFileUpload}
            accept={['text/plain', 'text/markdown', 'text/csv']}
          />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px' }}>
        <h2>Recent Notes ({notes.length})</h2>
        <div className="small" style={{ color: 'var(--muted)' }}>
          💡 Drag notes to reorder
        </div>
      </div>
      
      {notes.length > 0 ? (
        <DraggableNoteList 
          notes={notes.slice(0, 12)}
          onReorder={handleNotesReorder}
          onNoteClick={handleNoteClick}
        />
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '40px', marginTop: '20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
          <h3>No notes yet</h3>
          <p>Create your first note or import existing files to get started.</p>
        </div>
      )}
    </div>
  );
}