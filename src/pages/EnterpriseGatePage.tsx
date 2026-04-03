import { useState } from 'react'
import { validateEnterpriseToken } from '../lib/supabase'
import type { UserSession } from '../App'

interface Props {
  onComplete: (session: UserSession) => void
}

export function EnterpriseGatePage({ onComplete }: Props) {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [token, setToken] = useState(new URLSearchParams(window.location.search).get('token') ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!firstName.trim()) { setError('Please enter your first name.'); return }
    if (!email.trim() || !email.includes('@')) { setError('Please enter a valid work email.'); return }
    if (!token.trim()) { setError('Please enter your enterprise access code.'); return }

    setLoading(true)
    setError('')

    const valid = await validateEnterpriseToken(token.trim().toUpperCase())
    if (!valid) {
      setError('This access code is invalid or has already been used. Contact your administrator.')
      setLoading(false)
      return
    }

    setLoading(false)
    onComplete({
      email: email.trim().toLowerCase(),
      firstName: firstName.trim(),
      instrument: 'enterprise',
      enterpriseToken: token.trim().toUpperCase(),
    })
  }

  return (
    <div className="gate-page enterprise-gate">
      <div className="gate-brand">
        <div className="gate-logo">HEARTI</div>
        <div className="gate-tagline enterprise-tag">Enterprise Assessment</div>
      </div>

      <div className="gate-hero">
        <h1 className="gate-headline">
          HEARTI Leader Quotient
        </h1>
        <p className="gate-sub">
          The full 58-question assessment — research-grade, benchmarked against 1,651+ leaders.
          Enterprise access required.
        </p>
      </div>

      <div className="gate-form-card">
        <div className="gate-form-header">
          <span className="gate-form-badge enterprise-badge">Enterprise Access</span>
          <span className="gate-form-time">~20 min</span>
        </div>

        <div className="gate-field">
          <label className="gate-label">First name</label>
          <input
            className="gate-input"
            type="text"
            placeholder="Alex"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
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
          />
        </div>

        <div className="gate-field">
          <label className="gate-label">Access code</label>
          <input
            className="gate-input gate-input-code"
            type="text"
            placeholder="HEARTI-XXXX"
            value={token}
            onChange={e => setToken(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        {error && <div className="gate-error">{error}</div>}

        <button
          className="gate-cta enterprise-cta"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Verifying…' : 'Begin Full Assessment →'}
        </button>

        <p className="gate-privacy">
          Access codes are issued by PrismWork. Contact{' '}
          <a href="mailto:hello@prismwork.com">hello@prismwork.com</a> for your organization's access.
        </p>
      </div>

      <div className="gate-enterprise-link" style={{ marginTop: '1.5rem' }}>
        <a href="/" className="gate-enterprise-a">
          ← Take the free Snapshot instead
        </a>
      </div>
    </div>
  )
}
