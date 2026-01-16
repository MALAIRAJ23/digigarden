// lib/linkParser.js
export function extractLinksFromContent(content = "", allNotes = []) {
  if (!content) return [];
  const matches = content.match(/\[\[([^\]]+)\]\]/g) || [];
  const titleMap = new Map(allNotes.map((n) => [n.title.toLowerCase(), n.id]));
  const idMap = new Map(allNotes.map((n) => [n.id, n.id]));
  const results = [];

  matches.forEach((m) => {
    const inner = m.replace(/\[\[|\]\]/g, "").trim();

    // id:... link
    const idMatch = inner.match(/^id:(.+)$/i);
    if (idMatch) {
      const targetId = idMatch[1].trim();
      if (idMap.has(targetId)) {
        results.push({ raw: m, type: "id", targetId, display: null });
        return;
      }
    }

    // alias: Title|Display
    if (inner.includes("|")) {
      const [titlePart, display] = inner.split("|").map((s) => s.trim());
      const targetId = titleMap.get(titlePart.toLowerCase());
      if (targetId) {
        results.push({ raw: m, type: "alias", targetId, display });
        return;
      }
    }

    // exact title
    const exact = titleMap.get(inner.toLowerCase());
    if (exact) {
      results.push({ raw: m, type: "title", targetId: exact, display: null });
      return;
    }

    // fuzzy
    let fuzzyFound = null;
    for (const n of allNotes) {
      if (n.title.toLowerCase().includes(inner.toLowerCase()) || inner.toLowerCase().includes(n.title.toLowerCase())) {
        fuzzyFound = n.id;
        break;
      }
    }
    if (fuzzyFound) {
      results.push({ raw: m, type: "fuzzy", targetId: fuzzyFound, display: null });
      return;
    }

    // unresolved
    results.push({ raw: m, type: "unresolved", targetId: null, display: null });
  });

  return results;
}
