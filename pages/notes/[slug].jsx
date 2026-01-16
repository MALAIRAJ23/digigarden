// pages/notes/[slug].jsx
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { findBySlug, getAllNotes, deleteNoteById, createShareToken } from "../../lib/storage";
import { getSimilarNotes } from "../../lib/advancedSearch";
import Link from "next/link";
import HistoryPanel from "../../components/HistoryPanel";
import FavoriteButton from "../../components/FavoriteButton";
import ReadingMode from "../../components/ReadingMode";

export default function NoteView() {
  const router = useRouter();
  const { slug } = router.query;
  const [showReadingMode, setShowReadingMode] = useState(false);
  const [note, setNote] = useState(null);
  const [backlinks, setBacklinks] = useState([]);
  const [similarNotes, setSimilarNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!slug) return;
    
    const loadNote = async () => {
      setLoading(true);
      const foundNote = findBySlug(slug);
      if (!foundNote) {
        setLoading(false);
        return;
      }
      
      const all = await getAllNotes();
      const allNotes = Array.isArray(all) ? all : [];
      const noteBacklinks = allNotes.filter((n) => n.content && n.content.includes(`[[${foundNote.title}]]`));
      const similar = getSimilarNotes(foundNote, allNotes, 3);
      
      setNote(foundNote);
      setBacklinks(noteBacklinks);
      setSimilarNotes(similar);
      setLoading(false);
    };
    
    loadNote();
  }, [slug]);
  
  if (!slug || loading) return <div>Loading...</div>;
  
  if (!note) {
    return (
      <div>
        <h2>Note not found</h2>
        <p><Link href="/notes">Back to notes</Link></p>
      </div>
    );
  }

  function handleDelete() {
    if (!note.id) return;
    const ok = confirm("Delete this note? This action cannot be undone.");
    if (!ok) return;
    const removed = deleteNoteById(note.id);
    if (removed) router.push("/notes");
    else alert("Only locally created notes can be deleted.");
  }

  function handleCreateShare() {
    const token = createShareToken(note.slug);
    const url = `${window.location.origin}/share/${token}`;
    prompt("Shareable link (copy it):", url);
  }

  // Reading time calculation
  const wordCount = note.content ? note.content.split(/\s+/).filter(Boolean).length : 0;
  const readingTime = Math.ceil(wordCount / 200);

  if (showReadingMode) {
    return <ReadingMode note={note} onClose={() => setShowReadingMode(false)} />;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <h1>{note.title}</h1>
        <FavoriteButton noteId={note.id} />
      </div>
      
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 12 }}>
        <p className="meta" style={{ margin: 0 }}>
          {note.tags?.join(", ")} • {note.visibility} • {readingTime} min read
        </p>
      </div>
      
      <div className="card" style={{ marginTop: 12 }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.content}</ReactMarkdown>
      </div>

      <div style={{ marginTop: 12 }}>
        <button 
          onClick={() => setShowReadingMode(true)}
          className="btn--secondary"
          style={{ marginRight: 8 }}
        >
          📝 Reading Mode
        </button>
        <Link href={`/notes/${note.slug}/edit`} className="btn">Edit</Link>
        <button style={{ marginLeft: 8 }} className="btn" onClick={handleDelete}>Delete</button>
        <button style={{ marginLeft: 8 }} className="btn" onClick={handleCreateShare}>Share</button>
      </div>

      {similarNotes.length > 0 && (
        <section style={{ marginTop: 20 }}>
          <h3>Similar Notes</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {similarNotes.map(({ note: simNote, commonTags }) => (
              <div key={simNote.id} style={{ padding: 8, background: "var(--glass)", borderRadius: 6 }}>
                <Link href={`/notes/${simNote.slug}`} style={{ fontWeight: 600 }}>
                  {simNote.title}
                </Link>
                {commonTags > 0 && (
                  <span className="small" style={{ marginLeft: 8, color: "var(--muted)" }}>
                    {commonTags} common tags
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section style={{ marginTop: 20 }}>
        <h3>Backlinks</h3>
        {backlinks.length === 0 ? <p>No backlinks yet.</p> : (
          <ul>{backlinks.map((b) => <li key={b.id}><Link href={`/notes/${b.slug}`}>{b.title}</Link></li>)}</ul>
        )}
      </section>

      <section style={{ marginTop: 20 }}>
        <h3>Version History</h3>
        <HistoryPanel noteId={note.id} />
      </section>
    </div>
  );
}
