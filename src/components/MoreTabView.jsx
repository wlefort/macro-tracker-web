import { Link } from 'react-router-dom'

const links = [
  { to: '/more/goals', label: 'Macro Goals' },
  { to: '/more/settings', label: 'Settings' },
  { to: '/more/history', label: 'Calendar History' },
  { to: '/more/history/log', label: 'Full Log History' },
  { to: '/more/progress', label: 'Progress Charts' },
]

export default function MoreTabView() {
  return (
    <div className="page">
      <h1 className="page-header">More</h1>
      <div className="settings-section">
        {links.map(({ to, label }) => (
          <Link key={to} to={to} className="more-row">
            <span>{label}</span>
            <span className="chevron">›</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
