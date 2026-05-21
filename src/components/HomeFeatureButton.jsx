import { Link } from 'react-router-dom'

export default function HomeFeatureButton({ title, icon, color, to }) {
  return (
    <Link to={to} className="feature-btn">
      <div className="feature-btn-icon" style={{ background: color }}>
        {icon}
      </div>
      <span className="feature-btn-label">{title}</span>
    </Link>
  )
}
