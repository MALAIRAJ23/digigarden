// lib/fuzzySearch.js

// Simple fuzzy search implementation
export function fuzzyMatch(pattern, text) {
  const patternLower = pattern.toLowerCase();
  const textLower = text.toLowerCase();
  
  if (patternLower === "") return { score: 1, matches: [] };
  if (textLower.includes(patternLower)) return { score: 0.9, matches: [] };
  
  let patternIdx = 0;
  let score = 0;
  const matches = [];
  
  for (let i = 0; i < textLower.length && patternIdx < patternLower.length; i++) {
    if (textLower[i] === patternLower[patternIdx]) {
      matches.push(i);
      score += 1;
      patternIdx++;
    }
  }
  
  if (patternIdx === patternLower.length) {
    return { score: score / pattern.length * 0.8, matches };
  }
  
  return { score: 0, matches: [] };
}

export function searchNotes(notes, query, options = {}) {
  const { minScore = 0.3, sortBy = "relevance" } = options;
  
  if (!query.trim()) return notes;
  
  const results = notes.map(note => {
    const titleMatch = fuzzyMatch(query, note.title);
    const contentMatch = fuzzyMatch(query, note.content || "");
    const tagMatch = note.tags ? fuzzyMatch(query, note.tags.join(" ")) : { score: 0 };
    
    const maxScore = Math.max(titleMatch.score * 2, contentMatch.score, tagMatch.score);
    
    return {
      ...note,
      searchScore: maxScore,
      titleMatch,
      contentMatch,
      tagMatch
    };
  }).filter(note => note.searchScore >= minScore);
  
  if (sortBy === "relevance") {
    results.sort((a, b) => b.searchScore - a.searchScore);
  }
  
  return results;
}