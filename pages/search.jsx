// pages/search.jsx
import { useMemo, useState, useEffect } from "react";
import NoteCard from "../components/Notecard";
import { getAllNotes } from "../lib/storage";
import { searchNotes } from "../lib/fuzzySearch";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [allNotes, setAllNotes] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadNotes = async () => {
      const notes = await getAllNotes();
      setAllNotes(Array.isArray(notes) ? notes : []);
      setIsLoaded(true);
    };
    loadNotes();
  }, []);

  const tags = useMemo(() => {
    const s = new Set();
    allNotes.forEach((n) => (n.tags || []).forEach((t) => s.add(t)));
    return Array.from(s);
  }, [allNotes]);

  const results = useMemo(() => {
    let filtered = allNotes;
    
    // Apply tag filter first
    if (tagFilter) {
      filtered = filtered.filter(n => (n.tags || []).includes(tagFilter));
    }
    
    // Apply search query
    if (q.trim()) {
      filtered = searchNotes(filtered, q, { sortBy });
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "alphabetical") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    return filtered;
  }, [allNotes, q, tagFilter, sortBy]);

  if (!isLoaded) {
    return (
      <div>
        <h1>Search Notes</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Search Notes</h1>
      <div style={{ margin: "12px 0 24px 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input 
          placeholder="Search notes..." 
          value={q} 
          onChange={(e) => setQ(e.target.value)} 
          style={{ flex: 1, minWidth: 200, padding: 8, borderRadius: 6, border: "1px solid #ddd" }} 
        />
        <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} style={{ padding: 8 }}>
          <option value="">All tags</option>
          {tags.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: 8 }}>
          <option value="relevance">Relevance</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="alphabetical">A-Z</option>
        </select>
      </div>

      <p className="small">{results.length} notes found</p>
      <div className="grid">{results.map((n) => <NoteCard key={n.id} note={n} />)}</div>
    </div>
  );
}
