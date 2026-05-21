import { useState, useEffect, useCallback } from 'react'
import { formatSteps, formatCalories, formatWeight, formatSleep, formatSyncTime } from '../utils/healthUtils'

const ENDPOINT = '/.netlify/functions/health-sync'

export default function HealthKitPlaceholder() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch(ENDPOINT)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData(json.data)
    } catch {
      setError('Could not reach health sync endpoint.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-12">
        <span className="subheader" style={{ marginBottom: 0 }}>Health Data</span>
        <button
          className="btn btn-gray"
          style={{ fontSize: 12, padding: '5px 10px' }}
          onClick={fetchData}
          disabled={isLoading}
        >
          {isLoading ? '…' : '↻ Refresh'}
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      {!data && !isLoading && !error && (
        <p className="hk-note">
          No health data synced yet. Send a POST to{' '}
          <code style={{ fontSize: 11 }}>/.netlify/functions/health-sync</code> from
          an iOS Shortcut with <code style={{ fontSize: 11 }}>steps</code>,{' '}
          <code style={{ fontSize: 11 }}>activeCalories</code>,{' '}
          <code style={{ fontSize: 11 }}>weight</code>, and{' '}
          <code style={{ fontSize: 11 }}>sleep</code>.
        </p>
      )}

      {data && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 10 }}>
            <StatBox
              label="Steps"
              value={formatSteps(data.steps)}
              color="var(--accent-green)"
              icon="👟"
            />
            <StatBox
              label="Active Cal"
              value={formatCalories(data.activeCalories)}
              color="var(--accent-orange)"
              icon="🔥"
            />
            <StatBox
              label="Weight"
              value={formatWeight(data.weight)}
              color="var(--accent)"
              icon="⚖️"
            />
            <StatBox
              label="Sleep"
              value={formatSleep(data.sleep)}
              color="var(--accent-purple)"
              icon="🌙"
            />
          </div>

          {data.syncedAt && (
            <p style={{ fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'right' }}>
              Last synced {formatSyncTime(data.syncedAt)}
            </p>
          )}
        </>
      )}
    </div>
  )
}

function StatBox({ label, value, color, icon }) {
  return (
    <div style={{
      background: 'var(--bg)',
      borderRadius: 10,
      padding: '10px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontSize: 20, fontWeight: 700, color }}>{value}</span>
      <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{label}</span>
    </div>
  )
}
