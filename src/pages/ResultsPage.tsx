import { useRef, useState } from 'react'
import { SpectraChart, type SpectraHandle } from '../components/results/SpectraChart'
import {
  PILLAR_META, BAND_META, GRACE_BANDS, getGraceBand,
  type Pillar, type ScoringBand
} from '../data/questions'
import type { AssessmentResult } from '../lib/supabase'

interface Props {
  result: AssessmentResult
  userEmail: string
  onViewHabits: () => void
  onRetake: () => void
}

const HEARTI_PILLARS: Pillar[] = ['H', 'E', 'A', 'R', 'T', 'I']

export function ResultsPage({ result, onViewHabits, onRetake }: Props) {
  const spectraRef = useRef<SpectraHandle>(null)
  const [copied, setCopied] = useState(false)
  const [sharing, setSharing] = useState(false)

  const band = result.band as ScoringBand
  const bandMeta = BAND_META[band]
  const graceBand = result.grace_score !== null ? getGraceBand(result.grace_score) : null

  const sortedPillars = HEARTI_PILLARS
    .map(p => ({ pillar: p, score: result.pillar_scores[p] ?? 0 }))
    .sort((a, b) => b.score - a.score)

  const strength = sortedPillars[0]
  const vulnerability = sortedPillars[sortedPillars.length - 1]

  const handleShare = async () => {
    setSharing(true)
    const dataUrl = spectraRef.current?.toDataURL()
    if (!dataUrl) { setSharing(false); return }

    // Convert to blob and share
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    const file = new File([blob], 'my-hearti-spectra.png', { type: 'image/png' })

    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: 'My HEARTI Leader Snapshot',
        text: `My leadership strength is ${PILLAR_META[strength.pillar as Pillar].name}. Find out yours at heartiquotient.com`,
        files: [file],
      }).catch(() => {})
    } else {
      // Fallback: download
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = 'my-hearti-spectra.png'
      a.click()
    }
    setSharing(false)
  }

  const handleCopyLink = async () => {
    const url = result.id
      ? `${window.location.origin}?result=${result.id}`
      : window.location.href
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="results-page">
      {/* Header */}
      <div className="results-header">
        <div className="results-logo">HEARTI</div>
        <div className="results-name">
          {result.first_name}'s Leader Snapshot
        </div>
      </div>

      {/* Band banner */}
      <div className="band-banner" style={{ borderColor: bandMeta.color }}>
        <div className="band-label" style={{ color: bandMeta.color }}>{bandMeta.label}</div>
        <div className="band-score">
          <span className="band-score-num" style={{ color: bandMeta.color }}>{result.total_score}</span>
          <span className="band-score-denom">/120</span>
        </div>
        <p className="band-message">{bandMeta.message}</p>
      </div>

      {/* Spectra + strength/vulnerability */}
      <div className="results-spectra-section">
        <div className="spectra-wrap">
          <SpectraChart
            ref={spectraRef}
            scores={result.pillar_scores}
            size={300}
            animate
            showLabels
          />
        </div>

        <div className="sv-panel">
          <div className="sv-card sv-strength">
            <div className="sv-eyebrow">Strength</div>
            <div className="sv-pillar-name" style={{ color: PILLAR_META[strength.pillar as Pillar].color }}>
              {PILLAR_META[strength.pillar as Pillar].name}
            </div>
            <div className="sv-score">{strength.score.toFixed(2)}<span className="sv-denom">/5</span></div>
            <div className="sv-desc">{PILLAR_META[strength.pillar as Pillar].description}</div>
          </div>

          <div className="sv-card sv-vulnerability">
            <div className="sv-eyebrow">Growth edge</div>
            <div className="sv-pillar-name" style={{ color: PILLAR_META[vulnerability.pillar as Pillar].color }}>
              {PILLAR_META[vulnerability.pillar as Pillar].name}
            </div>
            <div className="sv-score">{vulnerability.score.toFixed(2)}<span className="sv-denom">/5</span></div>
            <div className="sv-desc">{PILLAR_META[vulnerability.pillar as Pillar].description}</div>
          </div>
        </div>
      </div>

      {/* Pillar bars */}
      <div className="pillar-bars">
        <div className="pillar-bars-title">All six dimensions</div>
        {sortedPillars.map(({ pillar, score }) => {
          const meta = PILLAR_META[pillar as Pillar]
          return (
            <div key={pillar} className="pillar-bar-row">
              <div className="pillar-bar-label">
                <span className="pillar-bar-name">{meta.name}</span>
                <span className="pillar-bar-score" style={{ color: meta.color }}>{score.toFixed(2)}</span>
              </div>
              <div className="pillar-bar-track">
                <div
                  className="pillar-bar-fill"
                  style={{ width: `${((score - 1) / 4) * 100}%`, background: meta.color }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Grace Index (Snapshot only) */}
      {result.grace_score !== null && graceBand && (
        <div className="grace-section">
          <div className="grace-header">
            <div className="grace-title">Grace Index</div>
            <div className="grace-subtitle">How you relate to responsibility under pressure</div>
          </div>
          <div className="grace-gauge-wrap">
            <div className="grace-gauge">
              <div
                className="grace-gauge-fill"
                style={{ width: `${result.grace_score}%`, background: graceBand.color }}
              />
            </div>
            <div className="grace-score-label" style={{ color: graceBand.color }}>
              {result.grace_score}/100
            </div>
          </div>
          <div className="grace-band-row">
            {GRACE_BANDS.map(b => (
              <div
                key={b.label}
                className={`grace-band-chip ${b.label === graceBand.label ? 'active' : ''}`}
                style={b.label === graceBand.label ? { borderColor: b.color, color: b.color, background: b.color + '14' } : {}}
              >
                {b.label}
              </div>
            ))}
          </div>
          <p className="grace-description">{graceBand.description}</p>
          <p className="grace-note">Grace Index is developmental feedback, not a judgment.</p>
        </div>
      )}

      {/* Share section */}
      <div className="share-section">
        <div className="share-title">Share your Spectra</div>
        <p className="share-desc">
          Your leadership shape is unique. Share the graphic — scores are yours alone.
        </p>
        <div className="share-actions">
          <button className="share-btn share-primary" onClick={handleShare} disabled={sharing}>
            {sharing ? 'Preparing…' : 'Download Spectra graphic'}
          </button>
          <button className="share-btn share-secondary" onClick={handleCopyLink}>
            {copied ? 'Link copied!' : 'Copy shareable link'}
          </button>
        </div>
      </div>

      {/* CTA section */}
      <div className="results-cta-section">
        <div className="results-cta-card cta-primary">
          <div className="cta-eyebrow">Next step</div>
          <div className="cta-headline">
            {band === 'excellence'
              ? 'Scale your impact with HEARTI for Teams'
              : 'Go deeper with HEARTI Foundations'}
          </div>
          <div className="cta-detail">
            {band === 'excellence'
              ? 'Bring the diagnostic to your entire team. Group spectra. Facilitated lab. Shared language.'
              : '14-day structured clarity experience built on this data. $397. Start anytime.'}
          </div>
          <a
            className="cta-btn cta-btn-primary"
            href={band === 'excellence'
              ? 'https://prismwork.com/for-organizations'
              : 'https://heartiquotient.com/for-leaders'}
            target="_blank"
            rel="noreferrer"
          >
            {bandMeta.cta} →
          </a>
        </div>

        <div className="results-cta-row">
          <button className="cta-btn cta-btn-secondary" onClick={onViewHabits}>
            Track leadership habits →
          </button>
          <button className="cta-btn cta-btn-ghost" onClick={onRetake}>
            Retake assessment
          </button>
        </div>
      </div>

      <div className="results-footer">
        <p>Results emailed to {result.email}. Built by <a href="https://prismwork.com" target="_blank" rel="noreferrer">PrismWork</a>.</p>
      </div>
    </div>
  )
}
