// lib/analytics.js

export function calculateAnalytics(notes) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisWeek = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Basic stats
  const totalNotes = notes.length;
  const publicNotes = notes.filter(n => n.visibility === "public").length;
  const totalWords = notes.reduce((sum, n) => sum + (n.content || "").split(/\s+/).filter(Boolean).length, 0);

  // Time-based stats
  const notesToday = notes.filter(n => new Date(n.createdAt) >= today).length;
  const notesThisWeek = notes.filter(n => new Date(n.createdAt) >= thisWeek).length;
  const notesThisMonth = notes.filter(n => new Date(n.createdAt) >= thisMonth).length;

  // Tag analysis
  const tagCounts = {};
  notes.forEach(n => {
    (n.tags || []).forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const topTags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Link analysis
  const linkCounts = {};
  notes.forEach(n => {
    const matches = (n.content || "").match(/\[\[([^\]]+)\]\]/g) || [];
    matches.forEach(match => {
      const title = match.replace(/\[\[|\]\]/g, "").trim();
      linkCounts[title] = (linkCounts[title] || 0) + 1;
    });
  });
  const mostLinked = Object.entries(linkCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Recent activity
  const recentNotes = notes
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 5);

  // Writing streak (consecutive days with notes)
  let streak = 0;
  let checkDate = new Date(today);
  while (true) {
    const dayStart = new Date(checkDate);
    const dayEnd = new Date(checkDate.getTime() + 24 * 60 * 60 * 1000);
    const hasNote = notes.some(n => {
      const noteDate = new Date(n.createdAt);
      return noteDate >= dayStart && noteDate < dayEnd;
    });
    
    if (hasNote) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
    
    if (streak > 365) break; // Prevent infinite loop
  }

  return {
    totalNotes,
    publicNotes,
    totalWords,
    notesToday,
    notesThisWeek,
    notesThisMonth,
    topTags,
    mostLinked,
    recentNotes,
    streak,
    avgWordsPerNote: totalNotes > 0 ? Math.round(totalWords / totalNotes) : 0
  };
}