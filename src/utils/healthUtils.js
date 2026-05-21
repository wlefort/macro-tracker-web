const DASH = '—'

/** 8432 → "8,432" */
export function formatSteps(steps) {
  if (steps == null) return DASH
  return Math.round(steps).toLocaleString()
}

/** 320.6 → "321 kcal" */
export function formatCalories(cal) {
  if (cal == null) return DASH
  return `${Math.round(cal)} kcal`
}

/** 174.5 → "174.5 lbs" */
export function formatWeight(lbs) {
  if (lbs == null) return DASH
  return `${(+lbs).toFixed(1)} lbs`
}

/**
 * Decimal hours → "7h 12m"
 * 7.0 → "7h 0m", 7.75 → "7h 45m"
 */
export function formatSleep(hours) {
  if (hours == null) return DASH
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return `${h}h ${m}m`
}

/**
 * ISO timestamp → human-readable relative time
 * "Just now", "3 min ago", "2 hrs ago", "Yesterday", or full date
 */
export function formatSyncTime(isoString) {
  if (!isoString) return ''
  const synced = new Date(isoString)
  const now = new Date()
  const diffMs = now - synced
  const diffMin = Math.floor(diffMs / 60_000)
  const diffHr = Math.floor(diffMs / 3_600_000)

  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin} min ago`
  if (diffHr < 24) return `${diffHr} hr${diffHr !== 1 ? 's' : ''} ago`
  if (diffHr < 48) return 'yesterday'

  return synced.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
