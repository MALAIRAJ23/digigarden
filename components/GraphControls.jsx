// components/GraphControls.jsx
import { useState } from "react";

export default function GraphControls({ 
  tags, 
  onTagFilter, 
  onDateFilter, 
  onExportGraph,
  onResetView,
  selectedTags = [],
  dateRange = { start: "", end: "" }
}) {
  const [showControls, setShowControls] = useState(false);

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Toggle Controls */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="btn--secondary"
        style={{ marginBottom: showControls ? 12 : 0 }}
      >
        🎛️ {showControls ? "Hide" : "Show"} Controls
      </button>

      {showControls && (
        <div className="card" style={{ padding: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            
            {/* Tag Filters */}
            <div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: 14 }}>Filter by Tags</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, maxHeight: 120, overflow: "auto" }}>
                {tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => onTagFilter(tag)}
                    className={selectedTags.includes(tag) ? "btn--small" : "btn--ghost btn--small"}
                    style={{ fontSize: 11 }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <button
                  onClick={() => onTagFilter(null)} // Clear all
                  className="btn--ghost btn--small"
                  style={{ marginTop: 8, fontSize: 11 }}
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Date Range */}
            <div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: 14 }}>Date Range</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => onDateFilter({ ...dateRange, start: e.target.value })}
                  style={{ padding: 6, fontSize: 12 }}
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => onDateFilter({ ...dateRange, end: e.target.value })}
                  style={{ padding: 6, fontSize: 12 }}
                />
                <button
                  onClick={() => onDateFilter({ start: "", end: "" })}
                  className="btn--ghost btn--small"
                  style={{ fontSize: 11 }}
                >
                  Clear Dates
                </button>
              </div>
            </div>

            {/* Graph Actions */}
            <div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: 14 }}>Actions</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={onResetView} className="btn--secondary btn--small">
                  🎯 Reset View
                </button>
                <button onClick={onExportGraph} className="btn--secondary btn--small">
                  📸 Export PNG
                </button>
                <button 
                  onClick={() => {
                    const graphElement = document.querySelector('#graph-container');
                    if (graphElement) {
                      graphElement.requestFullscreen?.();
                    }
                  }}
                  className="btn--secondary btn--small"
                >
                  🔍 Fullscreen
                </button>
              </div>
            </div>

            {/* Graph Stats */}
            <div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: 14 }}>Graph Stats</h4>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                <div>Visible nodes: <strong id="visible-nodes">0</strong></div>
                <div>Visible edges: <strong id="visible-edges">0</strong></div>
                <div>Clusters: <strong id="clusters">0</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}