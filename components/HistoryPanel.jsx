// components/HistoryPanel.jsx
import { getHistory, revertToVersion } from "../lib/storage";

export default function HistoryPanel({ noteId }) {
  const versions = getHistory(noteId);

  if (!versions.length) return <div className="card">No history available.</div>;

  return (
    <div className="card">
      <h4>Version History</h4>
      <ul>
        {versions.map((v, idx) => (
          <li key={idx} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 13 }}>
              <strong>{new Date(v.at).toLocaleString()}</strong> — {v.title}
            </div>
            <div style={{ fontSize: 13, color: "#666" }}>{v.content.slice(0, 120)}...</div>
            <div style={{ marginTop: 6 }}>
              <button className="btn" onClick={() => {
                if (confirm("Revert to this version?")) {
                  revertToVersion(noteId, idx);
                  window.dispatchEvent(new Event("dg:notesUpdated"));
                  alert("Reverted. Refreshing page.");
                  window.location.reload();
                }
              }}>Revert</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
