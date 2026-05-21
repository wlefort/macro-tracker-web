import { useState } from 'react'
import { useDailyLogContext } from '../context/DailyLogContext'
import { isSameDay, formatDate } from '../utils/dateUtils'

function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d))
  return days
}

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function CalendarHistoryView() {
  const { foodItems, relogForToday } = useDailyLogContext()
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(today)

  const days = buildCalendarDays(viewYear, viewMonth)

  const dateDaysWithData = new Set(
    foodItems.map((i) => {
      const d = new Date(i.date)
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    })
  )

  function hasData(date) {
    if (!date) return false
    return dateDaysWithData.has(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`)
  }

  function isToday(date) {
    if (!date) return false
    return isSameDay(date.toISOString(), today)
  }

  function isSelected(date) {
    if (!date) return false
    return isSameDay(date.toISOString(), selectedDate)
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const filteredItems = foodItems.filter((i) => isSameDay(i.date, selectedDate))

  return (
    <div className="page">
      <h1 className="page-header">Calendar History</h1>

      <div className="card">
        <div className="flex justify-between items-center mb-12">
          <button className="btn btn-gray" style={{ padding: '6px 12px' }} onClick={prevMonth}>‹</button>
          <span style={{ fontWeight: 600 }}>{MONTH_NAMES[viewMonth]} {viewYear}</span>
          <button className="btn btn-gray" style={{ padding: '6px 12px' }} onClick={nextMonth}>›</button>
        </div>

        <div className="calendar-grid">
          {DAY_LABELS.map((l) => (
            <div key={l} className="calendar-day-label">{l}</div>
          ))}
          {days.map((date, i) => (
            <button
              key={i}
              className={[
                'calendar-day',
                date && isToday(date) ? 'today' : '',
                date && isSelected(date) ? 'selected' : '',
                date && hasData(date) ? 'has-data' : '',
              ].filter(Boolean).join(' ')}
              disabled={!date}
              onClick={() => date && setSelectedDate(date)}
              style={{ visibility: date ? 'visible' : 'hidden' }}
            >
              {date?.getDate()}
            </button>
          ))}
        </div>
      </div>

      <h2 className="subheader">{formatDate(selectedDate.toISOString())}</h2>

      {filteredItems.length === 0 ? (
        <p className="text-secondary">No items logged on this day.</p>
      ) : (
        <ul className="log-list">
          {filteredItems.map((item) => (
            <li key={item.id} className="log-item">
              <div className="log-item-header">
                <span className="log-item-name">{item.name}</span>
              </div>
              <p className="log-item-macros">
                Cals: {Math.round(item.calories)} · P: {Math.round(item.protein)}g · C: {Math.round(item.carbs)}g · F: {Math.round(item.fat)}g
              </p>
              <button
                className="btn btn-green"
                style={{ fontSize: 12, padding: '5px 10px', marginTop: 6 }}
                onClick={() => relogForToday(item)}
              >
                Log for Today
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
