// components/NoteCard.jsx
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";

export default function NoteCard({ note }) {
  return (
    <div className="note-card" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <Link href={`/notes/${note.slug}`} style={{ textDecoration: "none", color: "#111" }}>
          <h3 style={{ margin: 0 }}>{note.title}</h3>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FavoriteButton noteId={note.id} size="small" />
          <small style={{ color: "#666", fontSize: 12 }}>{note.visibility}</small>
        </div>
      </div>

      <div className="meta" style={{ fontSize: 12, color: "#666" }}>
        Tags: {note.tags?.length ? note.tags.join(", ") : "—"}
      </div>

      <p className="excerpt" style={{ margin: "8px 0 0 0" }}>
        {note.content ? note.content.replace(/\n/g, " ").slice(0, 140) : "No content"}...
      </p>

      <div style={{ marginTop: 10 }}>
        <Link href={`/notes/${note.slug}`} className="btn" style={{ marginRight: 8 }}>
          Read
        </Link>
        <Link href={`/notes/${note.slug}/edit`} className="btn" style={{ marginLeft: 8 }}>
          Edit
        </Link>
      </div>
    </div>
  );
}
