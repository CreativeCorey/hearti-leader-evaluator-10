import { useState } from 'react'
import type { UserSession } from '../App'

interface Props {
  onComplete: (session: UserSession) => void
}

export function GatePage({ onComplete }: Props) {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!firstName.trim()) { setError('Please enter your first name.'); return }
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    const parts = email.trim().split('@')
    if (parts.length !== 2 || parts[0].length < 1 || !parts[1].includes('.') || parts[1].split('.').pop()!.length < 2) {
      setError('Please enter a valid work email address.')
      return
    }
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onComplete({ email: email.trim().toLowerCase(), firstName: firstName.trim(), instrument: 'snapshot' })
    }, 400)
  }

  return (
    <div className="gate-page">
      <div className="gate-brand">
        <div className="gate-logo">HEARTI</div>
        <div className="gate-tagline">Leader Snapshot</div>
      </div>

      <div className="gate-hero">
        <h1 className="gate-headline">
          Find out where your<br />leadership is strong —<br />
          <span className="gate-headline-accent">and where it's costing you.</span>
        </h1>
        <p className="gate-sub">
          31 questions. 10–12 minutes. A personalized strength–vulnerability profile
          built on behavioral data from 1,651+ leaders — delivered free, instantly.
        </p>
      </div>

      <div className="gate-form-card">
        <div className="gate-form-header">
          <span className="gate-form-badge">Free Assessment</span>
          <span className="gate-form-time">~12 min</span>
        </div>

        <div className="gate-field">
          <label className="gate-label">First name</label>
          <input
            className="gate-input"
            type="text"
            placeholder="Alex"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            autoFocus
          />
        </div>

        <div className="gate-field">
          <label className="gate-label">Work email</label>
          <input
            className="gate-input"
            type="email"
            placeholder="alex@company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        {error && <div className="gate-error">{error}</div>}

        <button
          className="gate-cta"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Starting…' : 'Begin your Snapshot →'}
        </button>

        <p className="gate-privacy">
          Your results will be emailed to you. No spam. No password required.
        </p>
      </div>

      <div className="gate-pillars">
        {['Humility', 'Empathy', 'Accountability', 'Resiliency', 'Transparency', 'Inclusivity'].map(p => (
          <div key={p} className="gate-pillar-chip">{p}</div>
        ))}
        <div className="gate-pillar-chip gate-pillar-grace">+ Grace Index</div>
      </div>


    </div>
  )
}
