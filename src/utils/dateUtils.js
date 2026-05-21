export function isToday(dateStr) {
  return isSameDay(dateStr, new Date())
}

export function isSameDay(dateStr, target) {
  const d = new Date(dateStr)
  const t = new Date(target)
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  )
}

export function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export function formatDateFull(dateStr) {
  return new Date(dateStr).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}
