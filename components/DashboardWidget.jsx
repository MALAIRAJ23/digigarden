// components/DashboardWidget.jsx
import { useState } from 'react';

export default function DashboardWidget({ 
  title, 
  icon, 
  children, 
  size = 'medium',
  onRemove,
  onResize,
  removable = false 
}) {
  const [isMinimized, setIsMinimized] = useState(false);

  const sizeClasses = {
    small: 'widget-small',
    medium: 'widget-medium', 
    large: 'widget-large',
    full: 'widget-full'
  };

  return (
    <div className={`dashboard-widget ${sizeClasses[size]} ${isMinimized ? 'minimized' : ''}`}>
      <div className="widget-header">
        <div className="widget-title">
          {icon && <span className="widget-icon">{icon}</span>}
          <h3>{title}</h3>
        </div>
        <div className="widget-controls">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="widget-control"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? '⬆️' : '⬇️'}
          </button>
          {onResize && (
            <button 
              onClick={onResize}
              className="widget-control"
              title="Resize"
            >
              📐
            </button>
          )}
          {removable && (
            <button 
              onClick={onRemove}
              className="widget-control widget-control--danger"
              title="Remove widget"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      {!isMinimized && (
        <div className="widget-content">
          {children}
        </div>
      )}
    </div>
  );
}