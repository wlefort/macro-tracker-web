import { useState } from 'react'

export default function HealthKitPlaceholder() {
  const [steps, setSteps] = useState(() => {
    const saved = localStorage.getItem('manualSteps')
    return saved ? parseInt(saved, 10) : 0
  })
  const [editing, setEditing] = useState(false)
  const [input, setInput] = useState('')

  function save() {
    const val = parseInt(input, 10)
    if (!isNaN(val)) {
      setSteps(val)
      localStorage.setItem('manualSteps', String(val))
    }
    setEditing(false)
    setInput('')
  }

  return (
    <div className="card">
      <div className="steps-box">
        <div className="steps-count">{steps.toLocaleString()}</div>
        <div className="steps-label">Steps Today</div>
        {!editing ? (
          <button
            className="btn btn-gray mt-8"
            style={{ fontSize: 12, padding: '6px 12px' }}
            onClick={() => setEditing(true)}
          >
            Log Steps Manually
          </button>
        ) : (
          <div className="water-add-row mt-8">
            <input
              className="input water-input"
              type="number"
              placeholder="steps"
              value={input}
              autoFocus
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && save()}
            />
            <button className="btn btn-primary" onClick={save}>Save</button>
          </div>
        )}
      </div>
      <p className="hk-note mt-8">
        HealthKit is not available in the browser. Steps are logged manually here.
        A future iOS Shortcut webhook integration is possible to sync steps automatically.
      </p>
    </div>
  )
}
