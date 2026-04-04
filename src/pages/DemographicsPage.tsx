import { useState } from 'react'
import type { AssessmentResult } from '../lib/supabase'
import { updateDemographics } from '../lib/supabase'

interface Props {
  result: AssessmentResult
  onComplete: () => void
}

const MANAGEMENT_LEVELS = [
  'Individual Contributor',
  'Student',
  'Manager',
  'Director',
  'VP',
  'C-Suite',
  'Entrepreneur',
  'Other',
]

const COMPANY_SIZES = ['1–250', '251–2,500', '2,501–10,000', '10,000+']

const INDUSTRIES = [
  'Technology',
  'Financial Services',
  'Healthcare',
  'Education',
  'Nonprofit',
  'Government',
  'Professional Services',
  'Consumer Goods',
  'Manufacturing',
  'Media & Entertainment',
  'Other',
]

const AGE_RANGES = ['18–24', '25–34', '35–44', '45–54', '55–64', '65+']

export function DemographicsPage({ result, onComplete }: Props) {
  const [managementLevel, setManagementLevel] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [industry, setIndustry] = useState('')
  const [ageRange, setAgeRange] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    if (saving) return
    setSaving(true)
    try {
      if (result.id) {
        await updateDemographics(result.id, {
          management_level: managementLevel || undefined,
          company_size: companySize || undefined,
          industry: industry || undefined,
          age_range: ageRange || undefined,
        })
      }
    } catch {
      // Non-blocking — proceed regardless
    }
    onComplete()
  }

  return (
    <div className="gate-page">
      <div className="gate-form-card" style={{ maxWidth: '480px' }}>
        <div className="gate-form-header">
          <span className="gate-form-badge">Optional</span>
          <span className="gate-form-time">~60 sec</span>
        </div>

        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.45rem',
          color: '#0F0E1A',
          marginBottom: '0.5rem',
          lineHeight: 1.3,
        }}>
          One last thing &mdash; help us improve HEARTI.
        </h2>
        <p style={{
          fontSize: '0.92rem',
          color: '#5A5870',
          marginBottom: '1.75rem',
          lineHeight: 1.5,
        }}>
          Optional. Takes 60 seconds. Helps us build better benchmarks for leaders like you.
        </p>

        <div className="gate-field">
          <label className="gate-label">Management Level</label>
          <select
            className="gate-input"
            value={managementLevel}
            onChange={e => setManagementLevel(e.target.value)}
          >
            <option value="">Select…</option>
            {MANAGEMENT_LEVELS.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <div className="gate-field">
          <label className="gate-label">Company Size</label>
          <select
            className="gate-input"
            value={companySize}
            onChange={e => setCompanySize(e.target.value)}
          >
            <option value="">Select…</option>
            {COMPANY_SIZES.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <div className="gate-field">
          <label className="gate-label">Industry</label>
          <select
            className="gate-input"
            value={industry}
            onChange={e => setIndustry(e.target.value)}
          >
            <option value="">Select…</option>
            {INDUSTRIES.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <div className="gate-field">
          <label className="gate-label">Age Range</label>
          <select
            className="gate-input"
            value={ageRange}
            onChange={e => setAgeRange(e.target.value)}
          >
            <option value="">Select…</option>
            {AGE_RANGES.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button
            className="cta-btn cta-btn-primary"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Saving\u2026' : 'Submit & See My Results \u2192'}
          </button>
          <button
            className="cta-btn cta-btn-ghost"
            onClick={onComplete}
            disabled={saving}
          >
            Skip \u2192
          </button>
        </div>
      </div>
    </div>
  )
}
