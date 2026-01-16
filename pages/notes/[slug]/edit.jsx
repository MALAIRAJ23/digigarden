// pages/notes/[slug]/edit.jsx
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Editor from "../../../components/editor";
import { findBySlug, saveNote } from "../../../lib/storage";

export default function EditNote() {
  const router = useRouter();
  const { slug } = router.query;
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    try {
      const foundNote = findBySlug(slug);
      if (!foundNote) {
        setError("Note not found");
        setLoading(false);
        return;
      }
      setNote(foundNote);
      setLoading(false);
    } catch (err) {
      setError("Failed to load note");
      setLoading(false);
    }
  }, [slug]);

  async function handleSave(payload) {
    try {
      const updated = await saveNote({
        id: note.id,
        title: payload.title,
        content: payload.content,
        tags: payload.tags,
        visibility: payload.visibility,
      });
      router.push(`/notes/${updated.slug || slug}`);
      return updated;
    } catch (err) {
      throw new Error("Failed to save note");
    }
  }

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
        <div className="skeleton skeleton-card">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text" />
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 40 }}>
        <h2>❌ {error || "Note not found"}</h2>
        <p>The note you're trying to edit doesn't exist.</p>
        <button onClick={() => router.push("/notes")} className="btn">
          Back to Notes
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1>Edit Note</h1>
        <button onClick={() => router.push(`/notes/${slug}`)} className="btn--secondary">
          Cancel
        </button>
      </div>
      <Editor
        id={note.id}
        onSave={handleSave}
        saveLabel="Update Note"
        initialTitle={note.title}
        initialContent={note.content}
        initialTags={note.tags || []}
        initialVisibility={note.visibility || "private"}
      />
    </div>
  );
}
