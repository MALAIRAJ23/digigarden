import { useState } from 'react'
import { migrateLocalToSupabase } from '../lib/storage'
import { useAuth } from '../contexts/AuthContext'

export default function MigrationBanner() {
  const [migrating, setMigrating] = useState(false)
  const [result, setResult] = useState(null)
  const [dismissed, setDismissed] = useState(false)
  const auth = useAuth()
  
  // Safety check for SSR
  if (!auth || !auth.user || dismissed || result) return null

  const handleMigrate = async () => {
    setMigrating(true)
    try {
      const res = await migrateLocalToSupabase()
      setResult(res)
    } catch (error) {
      alert('Migration failed: ' + error.message)
    } finally {
      setMigrating(false)
    }
  }

  if (result) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, var(--success), #059669)',
        color: 'white',
        padding: '16px 20px',
        borderRadius: '10px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <strong>✅ Migration Complete!</strong>
          <p style={{ margin: '4px 0 0 0', opacity: 0.9 }}>
            Migrated {result.notes} notes and {result.collections} collections to cloud.
          </p>
        </div>
        <button 
          onClick={() => setResult(null)}
          style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', color: 'white' }}
        >
          Dismiss
        </button>
      </div>
    )
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--accent), rgba(37,99,235,0.9))',
      color: 'white',
      padding: '16px 20px',
      borderRadius: '10px',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <strong>☁️ Migrate to Cloud</strong>
        <p style={{ margin: '4px 0 0 0', opacity: 0.9 }}>
          Move your local notes to the cloud for multi-device access.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          onClick={handleMigrate}
          disabled={migrating}
          className="btn"
          style={{ background: 'white', color: 'var(--accent)' }}
        >
          {migrating ? 'Migrating...' : 'Migrate Now'}
        </button>
        <button 
          onClick={() => setDismissed(true)}
          style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', color: 'white' }}
        >
          Later
        </button>
      </div>
    </div>
  )
}