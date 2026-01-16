// components/FileUpload.jsx
import { useState } from 'react';
import { useDragDrop } from '../hooks/useDragDrop';

export default function FileUpload({ onUpload, accept = ['image', 'text', 'application/pdf'] }) {
  const [files, setFiles] = useState([]);

  const { isDragOver, dragProps } = useDragDrop({
    onFileDrop: handleFileDrop,
    accept
  });

  function handleFileDrop(droppedFiles) {
    const newFiles = droppedFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      url: URL.createObjectURL(file)
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    onUpload?.(newFiles);
  }

  function handleFileSelect(e) {
    const selectedFiles = Array.from(e.target.files);
    handleFileDrop(selectedFiles);
  }

  function removeFile(id) {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== id);
      const removed = prev.find(f => f.id === id);
      if (removed?.url) URL.revokeObjectURL(removed.url);
      return updated;
    });
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function getFileIcon(type) {
    if (type.startsWith('image/')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.startsWith('text/')) return '📝';
    return '📎';
  }

  return (
    <div>
      <div 
        className={`drag-zone ${isDragOver ? 'drag-over' : ''}`}
        {...dragProps}
        onClick={() => document.getElementById('file-input').click()}
      >
        <div className="drag-zone-content">
          <div className="drag-zone-icon">📁</div>
          <div>
            <strong>Drop files here</strong> or click to browse
          </div>
          <div className="small">
            Supports images, documents, and text files
          </div>
        </div>
      </div>

      <input
        id="file-input"
        type="file"
        multiple
        accept={accept.join(',')}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {files.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h4>Uploaded Files ({files.length})</h4>
          {files.map(file => (
            <div key={file.id} className="file-upload-preview">
              <div className="file-icon">{getFileIcon(file.type)}</div>
              <div className="file-info">
                <div className="file-name">{file.name}</div>
                <div className="file-size">{file.size}</div>
              </div>
              <button 
                className="file-remove"
                onClick={() => removeFile(file.id)}
                title="Remove file"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}