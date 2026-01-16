// lib/writingAnalytics.js

export function generateWritingHeatmap(notes, year = new Date().getFullYear()) {
  const heatmapData = {};
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  
  // Initialize all days with 0
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    heatmapData[dateStr] = { count: 0, words: 0, notes: [] };
  }
  
  // Count notes and words per day
  notes.forEach(note => {
    const noteDate = new Date(note.createdAt);
    if (noteDate.getFullYear() === year) {
      const dateStr = noteDate.toISOString().split('T')[0];
      if (heatmapData[dateStr]) {
        heatmapData[dateStr].count++;
        heatmapData[dateStr].words += note.content ? note.content.split(/\s+/).filter(Boolean).length : 0;
        heatmapData[dateStr].notes.push(note);
      }
    }
  });
  
  return heatmapData;
}

export function calculateWritingStats(notes) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const recentNotes = notes.filter(n => new Date(n.createdAt) >= thirtyDaysAgo);
  const weeklyNotes = notes.filter(n => new Date(n.createdAt) >= sevenDaysAgo);
  
  const totalWords = notes.reduce((sum, n) => sum + (n.content ? n.content.split(/\s+/).filter(Boolean).length : 0), 0);
  const recentWords = recentNotes.reduce((sum, n) => sum + (n.content ? n.content.split(/\s+/).filter(Boolean).length : 0), 0);
  
  // Calculate writing velocity (words per day)
  const avgWordsPerDay = recentWords / 30;
  const avgNotesPerDay = recentNotes.length / 30;
  
  // Find most productive hours
  const hourCounts = {};
  notes.forEach(note => {
    const hour = new Date(note.createdAt).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  
  const mostProductiveHour = Object.entries(hourCounts)
    .sort(([,a], [,b]) => b - a)[0];
  
  // Calculate consistency (days with notes in last 30 days)
  const daysWithNotes = new Set(
    recentNotes.map(n => new Date(n.createdAt).toDateString())
  ).size;
  
  const consistency = (daysWithNotes / 30) * 100;
  
  // Vocabulary diversity
  const allWords = notes
    .map(n => n.content || '')
    .join(' ')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  
  const uniqueWords = new Set(allWords).size;
  const vocabularyDiversity = allWords.length > 0 ? (uniqueWords / allWords.length) * 100 : 0;
  
  return {
    totalNotes: notes.length,
    totalWords,
    avgWordsPerNote: notes.length > 0 ? Math.round(totalWords / notes.length) : 0,
    avgWordsPerDay: Math.round(avgWordsPerDay),
    avgNotesPerDay: Math.round(avgNotesPerDay * 10) / 10,
    recentNotes: recentNotes.length,
    weeklyNotes: weeklyNotes.length,
    mostProductiveHour: mostProductiveHour ? `${mostProductiveHour[0]}:00` : 'N/A',
    consistency: Math.round(consistency),
    vocabularyDiversity: Math.round(vocabularyDiversity),
    uniqueWords,
    daysWithNotes
  };
}

export function getTopicEvolution(notes) {
  const monthlyTopics = {};
  
  notes.forEach(note => {
    const date = new Date(note.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyTopics[monthKey]) {
      monthlyTopics[monthKey] = {};
    }
    
    (note.tags || []).forEach(tag => {
      monthlyTopics[monthKey][tag] = (monthlyTopics[monthKey][tag] || 0) + 1;
    });
  });
  
  return monthlyTopics;
}

export function getReadabilityScore(text) {
  if (!text) return 0;
  
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const words = text.split(/\s+/).filter(Boolean);
  const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
  
  if (sentences.length === 0 || words.length === 0) return 0;
  
  // Flesch Reading Ease Score
  const avgSentenceLength = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;
  
  const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

function countSyllables(word) {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  
  const vowels = 'aeiouy';
  let count = 0;
  let previousWasVowel = false;
  
  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !previousWasVowel) {
      count++;
    }
    previousWasVowel = isVowel;
  }
  
  // Handle silent e
  if (word.endsWith('e')) {
    count--;
  }
  
  return Math.max(1, count);
}