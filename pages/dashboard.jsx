// pages/dashboard.jsx
import { useState, useEffect } from "react";
import { getAllNotes } from "../lib/storage";
import { calculateAnalytics } from "../lib/analytics";
import { getFavoriteNotes } from "../lib/favorites";
import NoteCard from "../components/Notecard";
import DashboardWidget from "../components/DashboardWidget";
import Link from "next/link";
import ExportImport from "../components/ExportImport";
import { LoadingGrid } from "../components/LoadingState";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [favoriteNotes, setFavoriteNotes] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [widgets, setWidgets] = useState([
    { id: 'overview', title: 'Overview', icon: '📊', size: 'medium', removable: false },
    { id: 'activity', title: 'Activity', icon: '🔥', size: 'medium', removable: false },
    { id: 'tags', title: 'Top Tags', icon: '🏷️', size: 'medium', removable: true },
    { id: 'links', title: 'Most Linked', icon: '🔗', size: 'medium', removable: true }
  ]);

  useEffect(() => {
    const loadData = async () => {
      const allNotes = await getAllNotes();
      const notesArray = Array.isArray(allNotes) ? allNotes : [];
      const analyticsData = calculateAnalytics(notesArray);
      const favorites = await getFavoriteNotes();
      
      setNotes(notesArray);
      setAnalytics(analyticsData);
      setFavoriteNotes(favorites);
      setIsLoaded(true);
    };
    loadData();
  }, []);

  const removeWidget = (widgetId) => {
    setWidgets(widgets.filter(w => w.id !== widgetId));
  };

  const resizeWidget = (widgetId) => {
    setWidgets(widgets.map(w => {
      if (w.id === widgetId) {
        const sizes = ['small', 'medium', 'large'];
        const currentIndex = sizes.indexOf(w.size);
        const nextIndex = (currentIndex + 1) % sizes.length;
        return { ...w, size: sizes[nextIndex] };
      }
      return w;
    }));
  };

  const renderWidget = (widget) => {
    switch (widget.id) {
      case 'overview':
        return (
          <DashboardWidget
            key={widget.id}
            title={widget.title}
            icon={widget.icon}
            size={widget.size}
            removable={widget.removable}
            onRemove={() => removeWidget(widget.id)}
            onResize={() => resizeWidget(widget.id)}
          >
            <div style={{ display: 'grid', gap: 8 }}>
              <div className="kv">📝 Total Notes: <strong>{analytics?.totalNotes || 0}</strong></div>
              <div className="kv">🌍 Public: <strong>{analytics?.publicNotes || 0}</strong></div>
              <div className="kv">📖 Total Words: <strong>{(analytics?.totalWords || 0).toLocaleString()}</strong></div>
              <div className="kv">📏 Avg Words/Note: <strong>{analytics?.avgWordsPerNote || 0}</strong></div>
            </div>
          </DashboardWidget>
        );

      case 'activity':
        return (
          <DashboardWidget
            key={widget.id}
            title={widget.title}
            icon={widget.icon}
            size={widget.size}
            removable={widget.removable}
            onRemove={() => removeWidget(widget.id)}
            onResize={() => resizeWidget(widget.id)}
          >
            <div style={{ display: 'grid', gap: 8 }}>
              <div className="kv">🔥 Writing Streak: <strong>{analytics?.streak || 0} days</strong></div>
              <div className="kv">📅 Today: <strong>{analytics?.notesToday || 0}</strong></div>
              <div className="kv">📆 This Week: <strong>{analytics?.notesThisWeek || 0}</strong></div>
              <div className="kv">🗓️ This Month: <strong>{analytics?.notesThisMonth || 0}</strong></div>
            </div>
          </DashboardWidget>
        );

      case 'tags':
        return (
          <DashboardWidget
            key={widget.id}
            title={widget.title}
            icon={widget.icon}
            size={widget.size}
            removable={widget.removable}
            onRemove={() => removeWidget(widget.id)}
            onResize={() => resizeWidget(widget.id)}
          >
            {analytics?.topTags?.length > 0 ? (
              analytics.topTags.map(([tag, count]) => (
                <div key={tag} className="kv" style={{ marginBottom: 6 }}>
                  <span className="badge">{tag}</span> <strong>{count}</strong>
                </div>
              ))
            ) : (
              <p className="small">No tags yet</p>
            )}
          </DashboardWidget>
        );

      case 'links':
        return (
          <DashboardWidget
            key={widget.id}
            title={widget.title}
            icon={widget.icon}
            size={widget.size}
            removable={widget.removable}
            onRemove={() => removeWidget(widget.id)}
            onResize={() => resizeWidget(widget.id)}
          >
            {analytics?.mostLinked?.length > 0 ? (
              analytics.mostLinked.map(([title, count]) => (
                <div key={title} className="kv" style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 13 }}>{title}</span> <strong>{count} links</strong>
                </div>
              ))
            ) : (
              <p className="small">No links yet</p>
            )}
          </DashboardWidget>
        );

      default:
        return null;
    }
  };

  if (!isLoaded) {
    return (
      <div>
        <h1>📊 Dashboard</h1>
        <LoadingGrid count={4} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>📊 Professional Dashboard</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/analytics" className="btn--secondary btn--small">
            📈 Full Analytics
          </Link>
          <Link href="/notes/new" className="btn">
            ✨ New Note
          </Link>
        </div>
      </div>
      
      {/* Widget Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: 16, 
        marginBottom: 32 
      }}>
        {widgets.map(renderWidget)}
      </div>

      <ExportImport />

      {favoriteNotes.length > 0 && (
        <>
          <h2 style={{ marginTop: 32, marginBottom: 16 }}>⭐ Favorite Notes</h2>
          <div className="grid" style={{ marginBottom: 32 }}>
            {favoriteNotes.slice(0, 4).map((n) => <NoteCard key={n.id} note={n} />)}
          </div>
        </>
      )}

      <h2 style={{ marginTop: 32, marginBottom: 16 }}>🕒 Recent Activity</h2>
      <div className="grid">
        {analytics?.recentNotes?.map((n) => <NoteCard key={n.id} note={n} />) || []}
      </div>
    </div>
  );
}
