// lib/advancedSearch.js
import { fuzzyMatch } from "./fuzzySearch";

export function advancedSearch(notes, filters = {}) {
  const {
    query = "",
    tags = [],
    dateRange = { start: "", end: "" },
    wordCountRange = { min: 0, max: Infinity },
    visibility = "all",
    sortBy = "relevance",
    includeContent = true,
    includeTitle = true
  } = filters;

  let results = [...notes];

  // Text search
  if (query.trim()) {
    results = results.map(note => {
      let searchText = "";
      if (includeTitle) searchText += note.title + " ";
      if (includeContent) searchText += (note.content || "") + " ";
      searchText += (note.tags || []).join(" ");

      const match = fuzzyMatch(query, searchText);
      return {
        ...note,
        searchScore: match.score,
        searchMatches: match.matches
      };
    }).filter(note => note.searchScore > 0.1);
  }

  // Tag filter
  if (tags.length > 0) {
    results = results.filter(note => 
      note.tags && tags.some(tag => 
        note.tags.some(noteTag => 
          noteTag.toLowerCase().includes(tag.toLowerCase())
        )
      )
    );
  }

  // Date range filter
  if (dateRange.start || dateRange.end) {
    results = results.filter(note => {
      const noteDate = new Date(note.updatedAt || note.createdAt);
      const start = dateRange.start ? new Date(dateRange.start) : new Date(0);
      const end = dateRange.end ? new Date(dateRange.end) : new Date();
      
      return noteDate >= start && noteDate <= end;
    });
  }

  // Word count filter
  if (wordCountRange.min > 0 || wordCountRange.max < Infinity) {
    results = results.filter(note => {
      const wordCount = note.content ? note.content.split(/\s+/).filter(Boolean).length : 0;
      return wordCount >= wordCountRange.min && wordCount <= wordCountRange.max;
    });
  }

  // Visibility filter
  if (visibility !== "all") {
    results = results.filter(note => note.visibility === visibility);
  }

  // Sorting
  switch (sortBy) {
    case "relevance":
      if (query.trim()) {
        results.sort((a, b) => (b.searchScore || 0) - (a.searchScore || 0));
      } else {
        results.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
      }
      break;
    case "newest":
      results.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
      break;
    case "oldest":
      results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    case "alphabetical":
      results.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "wordCount":
      results.sort((a, b) => {
        const aWords = a.content ? a.content.split(/\s+/).filter(Boolean).length : 0;
        const bWords = b.content ? b.content.split(/\s+/).filter(Boolean).length : 0;
        return bWords - aWords;
      });
      break;
  }

  return results;
}

export function findOrphanedNotes(notes) {
  const titleMap = new Map(notes.map(n => [n.title.toLowerCase(), n.id]));
  
  return notes.filter(note => {
    // Check if this note is referenced by any other note
    const isReferenced = notes.some(otherNote => 
      otherNote.id !== note.id && 
      otherNote.content && 
      otherNote.content.includes(`[[${note.title}]]`)
    );
    
    return !isReferenced;
  });
}

export function findBrokenLinks(notes) {
  const titleMap = new Map(notes.map(n => [n.title.toLowerCase(), n]));
  const brokenLinks = [];
  
  notes.forEach(note => {
    if (!note.content) return;
    
    const linkMatches = note.content.match(/\[\[([^\]]+)\]\]/g) || [];
    linkMatches.forEach(match => {
      const targetTitle = match.replace(/\[\[|\]\]/g, "").trim();
      if (!titleMap.has(targetTitle.toLowerCase())) {
        brokenLinks.push({
          sourceNote: note,
          targetTitle,
          linkText: match
        });
      }
    });
  });
  
  return brokenLinks;
}

export function getSimilarNotes(targetNote, allNotes, limit = 5) {
  if (!targetNote.content && !targetNote.tags?.length) return [];
  
  const targetText = `${targetNote.title} ${targetNote.content || ""} ${(targetNote.tags || []).join(" ")}`;
  
  const similarities = allNotes
    .filter(note => note.id !== targetNote.id)
    .map(note => {
      const noteText = `${note.title} ${note.content || ""} ${(note.tags || []).join(" ")}`;
      const similarity = calculateSimilarity(targetText, noteText);
      
      return {
        note,
        similarity,
        commonTags: (targetNote.tags || []).filter(tag => 
          (note.tags || []).includes(tag)
        ).length
      };
    })
    .filter(item => item.similarity > 0.1 || item.commonTags > 0)
    .sort((a, b) => {
      // Prioritize common tags, then similarity
      if (a.commonTags !== b.commonTags) {
        return b.commonTags - a.commonTags;
      }
      return b.similarity - a.similarity;
    })
    .slice(0, limit);
    
  return similarities;
}

function calculateSimilarity(text1, text2) {
  const words1 = text1.toLowerCase().split(/\s+/).filter(Boolean);
  const words2 = text2.toLowerCase().split(/\s+/).filter(Boolean);
  
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}