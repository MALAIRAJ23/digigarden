// components/FavoriteButton.jsx
import { useState, useEffect } from "react";
import { isFavorite, addToFavorites, removeFromFavorites } from "../lib/favorites";

export default function FavoriteButton({ noteId, size = "normal" }) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(noteId));
  }, [noteId]);

  useEffect(() => {
    const handleFavoritesUpdate = () => {
      setFavorite(isFavorite(noteId));
    };

    window.addEventListener("dg:favoritesUpdated", handleFavoritesUpdate);
    return () => window.removeEventListener("dg:favoritesUpdated", handleFavoritesUpdate);
  }, [noteId]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (favorite) {
      removeFromFavorites(noteId);
    } else {
      addToFavorites(noteId);
    }
  };

  const buttonClass = size === "small" ? "btn--ghost btn--small" : "btn--ghost";
  const iconSize = size === "small" ? 12 : 16;

  return (
    <button
      onClick={toggleFavorite}
      className={buttonClass}
      title={favorite ? "Remove from favorites" : "Add to favorites"}
      style={{
        padding: size === "small" ? "4px 6px" : "6px 8px",
        color: favorite ? "#fbbf24" : "var(--muted)",
        border: "none",
        background: "transparent"
      }}
    >
      {favorite ? "⭐" : "☆"}
    </button>
  );
}