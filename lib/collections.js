// lib/collections.js

const COLLECTIONS_KEY = "dg_collections";

export function getCollections() {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(COLLECTIONS_KEY);
    return raw ? JSON.parse(raw) : getDefaultCollections();
  } catch (e) {
    console.error("Error reading collections", e);
    return getDefaultCollections();
  }
}

function getDefaultCollections() {
  return [
    {
      id: "favorites",
      name: "⭐ Favorites",
      type: "smart",
      query: { favorites: true },
      color: "#fbbf24"
    },
    {
      id: "recent",
      name: "🕒 Recent",
      type: "smart", 
      query: { days: 7 },
      color: "#60a5fa"
    },
    {
      id: "work",
      name: "💼 Work",
      type: "tag",
      query: { tags: ["work", "meeting", "project"] },
      color: "#34d399"
    },
    {
      id: "learning",
      name: "📚 Learning",
      type: "tag",
      query: { tags: ["learning", "book", "course", "study"] },
      color: "#a78bfa"
    }
  ];
}

export function saveCollections(collections) {
  try {
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
    window.dispatchEvent(new Event("dg:collectionsUpdated"));
    return true;
  } catch (e) {
    console.error("Error saving collections", e);
    return false;
  }
}

export function createCollection(name, type, query, color = "#6b7280") {
  const collections = getCollections();
  const newCollection = {
    id: Date.now().toString(),
    name,
    type,
    query,
    color,
    createdAt: new Date().toISOString()
  };
  
  collections.push(newCollection);
  saveCollections(collections);
  return newCollection;
}

export function deleteCollection(id) {
  const collections = getCollections();
  const filtered = collections.filter(c => c.id !== id);
  return saveCollections(filtered);
}

export function getNotesInCollection(collection, allNotes) {
  const { getFavorites } = require("./favorites");
  
  switch (collection.type) {
    case "smart":
      if (collection.query.favorites) {
        const favorites = getFavorites();
        return allNotes.filter(note => favorites.includes(note.id));
      }
      if (collection.query.days) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - collection.query.days);
        return allNotes.filter(note => 
          new Date(note.updatedAt || note.createdAt) >= cutoff
        );
      }
      break;
      
    case "tag":
      return allNotes.filter(note => 
        note.tags && note.tags.some(tag => 
          collection.query.tags.includes(tag.toLowerCase())
        )
      );
      
    case "manual":
      return allNotes.filter(note => 
        collection.query.noteIds && collection.query.noteIds.includes(note.id)
      );
      
    default:
      return [];
  }
  
  return [];
}