// pages/random.jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAllNotes } from "../lib/storage";
import NoteCard from "../components/Notecard";

export default function RandomNote() {
  const [randomNote, setRandomNote] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadNotes = async () => {
      const notes = await getAllNotes();
      const notesArray = Array.isArray(notes) ? notes : [];
      setAllNotes(notesArray);
      if (notesArray.length > 0) {
        const randomIndex = Math.floor(Math.random() * notesArray.length);
        setRandomNote(notesArray[randomIndex]);
      }
    };
    loadNotes();
  }, []);

  const getAnotherRandom = () => {
    if (allNotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * allNotes.length);
      setRandomNote(allNotes[randomIndex]);
    }
  };

  const openNote = () => {
    if (randomNote) {
      router.push(`/notes/${randomNote.slug}`);
    }
  };

  if (!randomNote) {
    return (
      <div>
        <h1>🎲 Random Discovery</h1>
        <p>No notes available for random discovery.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>🎲 Random Discovery</h1>
      <p>Discover something unexpected from your digital garden!</p>
      
      <div style={{ marginBottom: 16 }}>
        <button onClick={getAnotherRandom} className="btn--secondary" style={{ marginRight: 8 }}>
          🎲 Another Random Note
        </button>
        <button onClick={openNote} className="btn">
          📖 Read This Note
        </button>
      </div>

      <div style={{ maxWidth: 400 }}>
        <NoteCard note={randomNote} />
      </div>

      <div className="card" style={{ marginTop: 24, background: "var(--glass)" }}>
        <h3>💡 Discovery Tips</h3>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Use random discovery to rediscover forgotten notes</li>
          <li>Great for finding inspiration when you're stuck</li>
          <li>Helps you see connections you might have missed</li>
          <li>Perfect for reviewing old ideas and thoughts</li>
        </ul>
      </div>
    </div>
  );
}