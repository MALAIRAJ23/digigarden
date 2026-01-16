// pages/analytics.jsx
import { useState, useEffect } from 'react';
import { getAllNotes } from '../lib/storage';
import { generateWritingHeatmap, calculateWritingStats, getTopicEvolution, getReadabilityScore } from '../lib/writingAnalytics';

export default function AnalyticsPage() {
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState({});
  const [heatmapData, setHeatmapData] = useState({});
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [topicEvolution, setTopicEvolution] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only run on client side to avoid hydration mismatch
    const loadData = async () => {
      const allNotes = await getAllNotes();
      const notesArray = Array.isArray(allNotes) ? allNotes : [];
      setNotes(notesArray);
      setStats(calculateWritingStats(notesArray));
      setHeatmapData(generateWritingHeatmap(notesArray, selectedYear));
      setTopicEvolution(getTopicEvolution(notesArray));
      setIsLoaded(true);
    };
    loadData();
  }, [selectedYear]);

  // Show loading state during hydration
  if (!isLoaded) {
    return (
      <div>
        <h1>📊 Writing Analytics</h1>
        <p>Loading analytics...</p>
      </div>
    );
  }

  const renderHeatmapCell = (dateStr, data) => {
    const intensity = Math.min(data.count / 3, 1); // Max intensity at 3+ notes
    const color = `rgba(37, 99, 235, ${intensity * 0.8})`;
    
    return (
      <div
        key={dateStr}
        title={`${dateStr}: ${data.count} notes, ${data.words} words`}
        style={{
          width: 12,
          height: 12,
          backgroundColor: data.count > 0 ? color : 'rgba(15,23,36,0.05)',
          borderRadius: 2,
          margin: 1,
          cursor: 'pointer'
        }}
      />
    );
  };

  const renderHeatmap = () => {
    const weeks = [];
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);
    
    // Start from the first Sunday of the year or before
    const firstSunday = new Date(startDate);
    firstSunday.setDate(startDate.getDate() - startDate.getDay());
    
    let currentDate = new Date(firstSunday);
    
    while (currentDate <= endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const data = heatmapData[dateStr] || { count: 0, words: 0, notes: [] };
        week.push(renderHeatmapCell(dateStr, data));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(
        <div key={weeks.length} style={{ display: 'flex', flexDirection: 'column' }}>
          {week}
        </div>
      );
    }
    
    return weeks;
  };

  const avgReadability = notes.length > 0 
    ? Math.round(notes.reduce((sum, note) => sum + getReadabilityScore(note.content), 0) / notes.length)
    : 0;

  return (
    <div>
      <h1>📊 Writing Analytics</h1>
      
      {/* Overview Stats */}
      <div className="grid" style={{ marginBottom: 24 }}>
        <div className="card">
          <h3>📈 Productivity</h3>
          <div className="kv">📝 Total Notes: <strong>{stats.totalNotes || 0}</strong></div>
          <div className="kv">📖 Total Words: <strong>{(stats.totalWords || 0).toLocaleString()}</strong></div>
          <div className="kv">⚡ Avg Words/Day: <strong>{stats.avgWordsPerDay || 0}</strong></div>
          <div className="kv">🎯 Consistency: <strong>{stats.consistency || 0}%</strong></div>
        </div>
        
        <div className="card">
          <h3>🕒 Writing Patterns</h3>
          <div className="kv">🌅 Most Productive Hour: <strong>{stats.mostProductiveHour || 'N/A'}</strong></div>
          <div className="kv">📅 Days Active (30d): <strong>{stats.daysWithNotes || 0}/30</strong></div>
          <div className="kv">📊 Notes/Day: <strong>{stats.avgNotesPerDay || 0}</strong></div>
          <div className="kv">📏 Avg Words/Note: <strong>{stats.avgWordsPerNote || 0}</strong></div>
        </div>
        
        <div className="card">
          <h3>🎨 Writing Quality</h3>
          <div className="kv">📚 Vocabulary Size: <strong>{stats.uniqueWords || 0}</strong></div>
          <div className="kv">🌈 Diversity: <strong>{stats.vocabularyDiversity || 0}%</strong></div>
          <div className="kv">📖 Readability: <strong>{avgReadability}/100</strong></div>
          <div className="kv">📝 Recent Notes: <strong>{stats.recentNotes || 0}</strong></div>
        </div>
      </div>

      {/* Writing Heatmap */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3>🔥 Writing Heatmap</h3>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={{ padding: '4px 8px' }}
          >
            {[2024, 2023, 2022, 2021].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: 2, 
          overflowX: 'auto', 
          padding: '8px 0',
          minHeight: 100
        }}>
          {renderHeatmap()}
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: 12,
          fontSize: 12,
          color: 'var(--muted)'
        }}>
          <span>Less</span>
          <div style={{ display: 'flex', gap: 2 }}>
            {[0, 0.2, 0.4, 0.6, 0.8].map(intensity => (
              <div
                key={intensity}
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: intensity > 0 ? `rgba(37, 99, 235, ${intensity})` : 'rgba(15,23,36,0.05)',
                  borderRadius: 2
                }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Topic Evolution */}
      <div className="card">
        <h3>🏷️ Topic Evolution</h3>
        <div style={{ maxHeight: 300, overflow: 'auto' }}>
          {Object.entries(topicEvolution)
            .sort(([a], [b]) => b.localeCompare(a))
            .slice(0, 12)
            .map(([month, topics]) => (
              <div key={month} style={{ 
                padding: '8px 0', 
                borderBottom: '1px solid rgba(15,23,36,0.05)' 
              }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{month}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {Object.entries(topics)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 8)
                    .map(([tag, count]) => (
                      <span 
                        key={tag} 
                        className="badge"
                        style={{ fontSize: 11 }}
                      >
                        {tag} ({count})
                      </span>
                    ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}