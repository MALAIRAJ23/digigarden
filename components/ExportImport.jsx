// components/ExportImport.jsx
import { getAllNotes } from "../lib/storage";

export default function ExportImport() {
  async function handleExportJson() {
    const data = await getAllNotes();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `digital-garden-export-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImportFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!Array.isArray(parsed)) {
          alert("Invalid export file. Expected array of notes.");
          return;
        }
        const existing = await getAllNotes();
        const existingSlugs = new Set(existing.map((n) => n.slug));
        const toMerge = parsed.filter((n) => !existingSlugs.has(n.slug));
        const { saveNote } = require("../lib/storage");
        for (const n of toMerge) {
          await saveNote({
            title: n.title || "Untitled",
            content: n.content || "",
            tags: n.tags || [],
            visibility: n.visibility || "private",
          });
        }
        alert(`Imported ${toMerge.length} notes.`);
        window.dispatchEvent(new Event("dg:notesUpdated"));
      } catch (err) {
        alert("Failed to import file: " + err.message);
      }
    };
    reader.readAsText(f);
  }

  return (
    <div className="card">
      <h3>Export / Import</h3>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn" onClick={handleExportJson}>Export JSON</button>
        <label className="btn" style={{ cursor: "pointer" }}>
          Import JSON
          <input type="file" accept=".json" onChange={handleImportFile} style={{ display: "none" }} />
        </label>
      </div>
      <p style={{ marginTop: 8, fontSize: 13, color: "#666" }}>
        Export all notes as JSON. Import merges new notes (by slug).
      </p>
    </div>
  );
}
