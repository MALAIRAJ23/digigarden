// components/SplitLayout.jsx
import { useState, useRef, useEffect } from 'react';

export default function SplitLayout({ 
  leftPanel, 
  rightPanel, 
  defaultSplit = 50,
  minSplit = 20,
  maxSplit = 80,
  direction = 'horizontal' // 'horizontal' or 'vertical'
}) {
  const [splitPercentage, setSplitPercentage] = useState(defaultSplit);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      let percentage;

      if (direction === 'horizontal') {
        percentage = ((e.clientX - rect.left) / rect.width) * 100;
      } else {
        percentage = ((e.clientY - rect.top) / rect.height) * 100;
      }

      percentage = Math.max(minSplit, Math.min(maxSplit, percentage));
      setSplitPercentage(percentage);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, direction, minSplit, maxSplit]);

  const containerStyle = {
    display: 'flex',
    flexDirection: direction === 'horizontal' ? 'row' : 'column',
    height: '100%',
    width: '100%',
    overflow: 'hidden'
  };

  const leftPanelStyle = {
    [direction === 'horizontal' ? 'width' : 'height']: `${splitPercentage}%`,
    overflow: 'auto',
    background: 'var(--surface)',
    borderRight: direction === 'horizontal' ? '1px solid rgba(15,23,36,0.1)' : 'none',
    borderBottom: direction === 'vertical' ? '1px solid rgba(15,23,36,0.1)' : 'none'
  };

  const rightPanelStyle = {
    [direction === 'horizontal' ? 'width' : 'height']: `${100 - splitPercentage}%`,
    overflow: 'auto',
    background: 'var(--bg)'
  };

  const resizerStyle = {
    [direction === 'horizontal' ? 'width' : 'height']: '4px',
    [direction === 'horizontal' ? 'height' : 'width']: '100%',
    background: isDragging ? 'var(--accent)' : 'transparent',
    cursor: direction === 'horizontal' ? 'col-resize' : 'row-resize',
    transition: 'background 0.2s ease',
    position: 'relative',
    zIndex: 10
  };

  return (
    <div ref={containerRef} style={containerStyle} className="split-layout">
      <div style={leftPanelStyle} className="split-panel split-panel--left">
        {leftPanel}
      </div>
      
      <div 
        style={resizerStyle}
        className="split-resizer"
        onMouseDown={handleMouseDown}
      >
        <div className="split-resizer-handle" />
      </div>
      
      <div style={rightPanelStyle} className="split-panel split-panel--right">
        {rightPanel}
      </div>
    </div>
  );
}