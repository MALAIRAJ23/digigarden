// components/DraggableNoteList.jsx
import { useState } from 'react';

export default function DraggableNoteList({ notes, onReorder, onNoteClick }) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    // Only clear if we're leaving the container entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newNotes = [...notes];
    const draggedNote = newNotes[draggedIndex];
    
    // Remove dragged item
    newNotes.splice(draggedIndex, 1);
    
    // Insert at new position
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newNotes.splice(insertIndex, 0, draggedNote);
    
    onReorder?.(newNotes);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="draggable-note-list">
      {notes.map((note, index) => (
        <div key={note.id}>
          {dragOverIndex === index && draggedIndex !== null && (
            <div className="drop-indicator active" />
          )}
          
          <div
            className={`note-card draggable ${
              draggedIndex === index ? 'dragging' : ''
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onClick={() => draggedIndex === null && onNoteClick?.(note)}
            style={{ position: 'relative' }}
          >
            <div className="note-drag-handle" style={{ 
              position: 'absolute', 
              right: 8, 
              top: 8, 
              cursor: 'grab',
              opacity: 0.5,
              fontSize: 16,
              userSelect: 'none'
            }}>
              ⋮⋮
            </div>
            
            <h3 className="note-title">{note.title}</h3>
            <div className="note-preview">{note.content?.substring(0, 150)}...</div>
            <div className="note-meta">
              <span>{new Date(note.updatedAt || note.createdAt).toLocaleDateString()}</span>
              <span>{note.tags?.length || 0} tags</span>
            </div>
          </div>
        </div>
      ))}
      
      {dragOverIndex === notes.length && draggedIndex !== null && (
        <div className="drop-indicator active" />
      )}
    </div>
  );
}