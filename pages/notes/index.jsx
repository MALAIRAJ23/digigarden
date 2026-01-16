// pages/notes/index.jsx
import { useState, useEffect } from "react";
import Link from "next/link";
import NoteCard from "../../components/Notecard";
import { getAllNotes } from "../../lib/storage";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadNotes = async () => {
      const allNotes = await getAllNotes();
      setNotes(Array.isArray(allNotes) ? allNotes : []);
      setIsLoaded(true);
    };
    loadNotes();
  }, []);

  if (!isLoaded) {
    return (
      <div>
        <h1>All Notes</h1>
        <div style={{ margin: "12px 0" }}>
          <Link href="/notes/new" className="btn">+ New Note</Link>
        </div>
        <div className="grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="skeleton skeleton-card">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>All Notes</h1>
      <div style={{ margin: "12px 0" }}>
        <Link href="/notes/new" className="btn">+ New Note</Link>
      </div>
      <div className="grid">
        {notes.length > 0 ? (
          notes.map((note) => <NoteCard key={note.id} note={note} />)
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <h3>No notes yet</h3>
            <p>Create your first note to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
