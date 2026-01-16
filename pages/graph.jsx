// pages/graph.jsx
import { useEffect, useRef, useState } from "react";
import { getAllNotes } from "../lib/storage";
import Link from "next/link";

export default function GraphPage() {
  const ref = useRef(null);
  const networkRef = useRef(null);
  const [netInfo, setNetInfo] = useState({ nodes: 0, edges: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    let destroyed = false;

    const buildGraphData = async () => {
      const notes = await getAllNotes();
      const notesArray = Array.isArray(notes) ? notes : [];
      const nodes = notesArray.map((n) => ({ id: n.id, label: n.title, title: n.title, shape: "dot", value: Math.max(1, Math.min(3, (n.content || "").length / 200)) }));
      const titleMap = new Map(notesArray.map((n) => [n.title, n.id]));
      const edges = [];
      notesArray.forEach((source) => {
        const matches = (source.content || "").match(/\[\[([^\]]+)\]\]/g) || [];
        matches.forEach((m) => {
          const targetTitle = m.replace(/\[\[|\]\]/g, "").trim();
          const targetId = titleMap.get(targetTitle);
          if (targetId) edges.push({ from: source.id, to: targetId });
        });
      });
      return { nodes, edges, notes: notesArray };
    };

    const renderNetwork = async () => {
      const { nodes, edges, notes } = await buildGraphData();
      setNetInfo({ nodes: nodes.length, edges: edges.length });

      if (networkRef.current) {
        try {
          networkRef.current.setData({ nodes, edges });
        } catch (e) {
          try { networkRef.current.destroy(); } catch {}
          networkRef.current = null;
        }
        return;
      }

      try {
        const vis = await import("vis-network");
        const container = ref.current;
        if (!container) return;
        const data = { nodes, edges };
        const options = {
          autoResize: true,
          nodes: { shape: "dot", size: 16, font: { size: 14 } },
          edges: { arrows: { to: { enabled: true, scaleFactor: 0.6 } }, smooth: { type: "continuous" } },
          physics: { stabilization: false, barnesHut: { gravitationalConstant: -2000, springLength: 120 } },
          interaction: { hover: true, tooltipDelay: 200, multiselect: false },
        };
        networkRef.current = new vis.Network(container, data, options);
        networkRef.current.on("doubleClick", function (params) {
          if (params.nodes && params.nodes.length > 0) {
            const nodeId = params.nodes[0];
            const note = notes.find((n) => n.id === nodeId);
            if (note) window.location.href = `/notes/${note.slug}`;
          }
        });
      } catch (e) {
        console.error("Error loading vis-network", e);
      }
    };

    renderNetwork();

    const onNotesUpdated = () => { if (!destroyed) renderNetwork(); };
    window.addEventListener("dg:notesUpdated", onNotesUpdated);
    const onStorage = (e) => { if (e.key === "dg_last_update_ts" && !destroyed) renderNetwork(); };
    window.addEventListener("storage", onStorage);
    const onFocus = () => { if (!destroyed) renderNetwork(); };
    window.addEventListener("focus", onFocus);

    return () => {
      destroyed = true;
      window.removeEventListener("dg:notesUpdated", onNotesUpdated);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
      try { if (networkRef.current && networkRef.current.destroy) networkRef.current.destroy(); } catch (e) {}
      networkRef.current = null;
    };
  }, []);

  return (
    <div>
      <h1>Notes Graph</h1>
      <p>Nodes: <strong>{netInfo.nodes}</strong> • Edges: <strong>{netInfo.edges}</strong></p>
      <div ref={ref} style={{ height: 600, border: "1px solid #eee", borderRadius: 8 }} />
      <p style={{ marginTop: 8 }}>Double-click a node to open the note. Edges represent <code>[[Title]]</code> links.</p>
      <p><Link href="/notes">Go to notes</Link></p>
    </div>
  );
}
