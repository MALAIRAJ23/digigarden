// pages/collections.jsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getCollections, getNotesInCollection, createCollection, deleteCollection } from "../lib/collections";
import { getAllNotes } from "../lib/storage";
import NoteCard from "../components/Notecard";
import Link from "next/link";
import { LoadingPage } from "../components/LoadingState";

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [notes, setNotes] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [allNotes, setAllNotes] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const cols = getCollections();
      const notesList = await getAllNotes();
      const notesArray = Array.isArray(notesList) ? notesList : [];
      setCollections(cols);
      setAllNotes(notesArray);
      
      // Auto-select first collection
      if (cols.length > 0 && !selectedCollection) {
        setSelectedCollection(cols[0]);
      }
      setIsLoaded(true);
    };

    loadData();
    
    const handleUpdate = () => loadData();
    window.addEventListener("dg:collectionsUpdated", handleUpdate);
    window.addEventListener("dg:notesUpdated", handleUpdate);
    
    return () => {
      window.removeEventListener("dg:collectionsUpdated", handleUpdate);
      window.removeEventListener("dg:notesUpdated", handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (selectedCollection && isLoaded) {
      const collectionNotes = getNotesInCollection(selectedCollection, allNotes);
      setNotes(collectionNotes);
    }
  }, [selectedCollection, allNotes, isLoaded]);

  const handleCreateCollection = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const type = formData.get("type");
    const tags = formData.get("tags");
    const color = formData.get("color");

    let query = {};
    if (type === "tag") {
      query.tags = tags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
    }

    const newCollection = createCollection(name, type, query, color);
    setShowCreateForm(false);
    setSelectedCollection(newCollection);
    e.target.reset();
  };

  if (!isLoaded) {
    return <LoadingPage message="Loading collections..." />;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1>📁 Collections</h1>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="btn"
        >
          + New Collection
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: 20 }}>
        {/* Collections Sidebar */}
        <div className="card" style={{ height: "fit-content" }}>
          <h3 style={{ marginBottom: 12 }}>Collections</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {collections.map(collection => (
              <button
                key={collection.id}
                onClick={() => setSelectedCollection(collection)}
                className={selectedCollection?.id === collection.id ? "btn btn--small" : "btn--ghost btn--small"}
                style={{
                  justifyContent: "flex-start",
                  borderLeft: `3px solid ${collection.color}`,
                  textAlign: "left"
                }}
              >
                {collection.name}
              </button>
            ))}
          </div>
        </div>

        {/* Collection Content */}
        <div>
          {selectedCollection ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h2 style={{ margin: 0, color: selectedCollection.color }}>
                    {selectedCollection.name}
                  </h2>
                  <p className="small" style={{ margin: "4px 0 0 0" }}>
                    {notes.length} notes • {selectedCollection.type} collection
                  </p>
                </div>
                
                {selectedCollection.id !== "favorites" && selectedCollection.id !== "recent" && (
                  <button
                    onClick={() => {
                      if (confirm(`Delete collection "${selectedCollection.name}"?`)) {
                        deleteCollection(selectedCollection.id);
                        setSelectedCollection(collections[0]);
                      }
                    }}
                    className="btn--danger btn--small"
                  >
                    Delete
                  </button>
                )}
              </div>

              {notes.length > 0 ? (
                <div className="grid">
                  {notes.map(note => (
                    <NoteCard key={note.id} note={note} />
                  ))}
                </div>
              ) : (
                <div className="card" style={{ textAlign: "center", padding: 40 }}>
                  <p>No notes in this collection yet.</p>
                  <Link href="/notes/new" className="btn">
                    Create your first note
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="card" style={{ textAlign: "center", padding: 40 }}>
              <p>Select a collection to view its notes.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Collection Modal */}
      {showCreateForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }}
          onClick={() => setShowCreateForm(false)}
        >
          <form
            onSubmit={handleCreateCollection}
            className="card"
            style={{ width: 400, maxWidth: "90%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Create New Collection</h3>
            
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>Name</label>
              <input
                name="name"
                placeholder="Collection name"
                required
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>Type</label>
              <select name="type" style={{ width: "100%" }} required>
                <option value="tag">Tag-based</option>
                <option value="manual">Manual</option>
              </select>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
                Tags (comma-separated)
              </label>
              <input
                name="tags"
                placeholder="work, project, meeting"
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>Color</label>
              <input
                name="color"
                type="color"
                defaultValue="#6b7280"
                style={{ width: "100%", height: 40 }}
              />
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn--secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn">
                Create Collection
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}