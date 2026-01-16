// hooks/useDragDrop.js
import { useState, useCallback } from 'react';

export function useDragDrop({ onFileDrop, onReorder, accept = [] }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const dragData = e.dataTransfer.getData('text/plain');

    if (files.length > 0 && onFileDrop) {
      const validFiles = accept.length > 0 
        ? files.filter(file => accept.some(type => file.type.includes(type)))
        : files;
      onFileDrop(validFiles);
    } else if (dragData && onReorder) {
      try {
        const data = JSON.parse(dragData);
        onReorder(data);
      } catch (error) {
        console.warn('Invalid drag data:', error);
      }
    }
  }, [onFileDrop, onReorder, accept]);

  const handleItemDragStart = useCallback((e, item) => {
    setDraggedItem(item);
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleItemDragEnd = useCallback(() => {
    setDraggedItem(null);
  }, []);

  return {
    isDragOver,
    draggedItem,
    dragProps: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    },
    itemDragProps: (item) => ({
      draggable: true,
      onDragStart: (e) => handleItemDragStart(e, item),
      onDragEnd: handleItemDragEnd,
    }),
  };
}