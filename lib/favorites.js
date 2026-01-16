// lib/favorites.js

const FAVORITES_KEY = "dg_favorites";

export function getFavorites() {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error reading favorites", e);
    return [];
  }
}

export function addToFavorites(noteId) {
  try {
    const favorites = getFavorites();
    if (!favorites.includes(noteId)) {
      favorites.push(noteId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      window.dispatchEvent(new Event("dg:favoritesUpdated"));
    }
    return true;
  } catch (e) {
    console.error("Error adding to favorites", e);
    return false;
  }
}

export function removeFromFavorites(noteId) {
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter(id => id !== noteId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event("dg:favoritesUpdated"));
    return true;
  } catch (e) {
    console.error("Error removing from favorites", e);
    return false;
  }
}

export function isFavorite(noteId) {
  const favorites = getFavorites();
  return favorites.includes(noteId);
}

export async function getFavoriteNotes() {
  const { getAllNotes } = require("./storage");
  const favorites = getFavorites();
  const allNotes = await getAllNotes();
  const notesArray = Array.isArray(allNotes) ? allNotes : [];
  
  return favorites
    .map(id => notesArray.find(note => note.id === id))
    .filter(Boolean); // Remove any notes that no longer exist
}