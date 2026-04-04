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
  const shareSpectraRef = useRef<SpectraHandle>(null)
  const [copied, setCopied] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [sharing, setSharing] = useState(false)

  const band = result.band as ScoringBand
  const bandMeta = BAND_META[band]
  const graceBand = result.grace_score !== null ? getGraceBand(result.grace_score) : null

  const sortedPillars = HEARTI_PILLARS
    .map(p => ({ pillar: p, score: result.pillar_scores[p] ?? 0 }))
    .sort((a, b) => b.score - a.score)

  const strength = sortedPillars[0]
  const vulnerability = sortedPillars[sortedPillars.length - 1]
  const strengthPillar = strength.pillar as Pillar

  const handleShare = async () => {
    setSharing(true)
    const dataUrl = shareSpectraRef.current?.toDataURL()
    if (!dataUrl) { setSharing(false); return }

    const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent)

    if (isMobile && navigator.share) {
      const res = await fetch(dataUrl)
      const blob = await res.blob()
      const file = new File([blob], 'my-hearti-spectra.png', { type: 'image/png' })
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file] }).catch(() => {})
        setSharing(false)
        return
      }
    }

    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'my-hearti-spectra.png'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setSharing(false)
  }

  const resultUrl = result.id
    ? `${window.location.origin}?result=${result.id}`
    : window.location.href

  const teaserText = `Just found out my leadership strength and growth edge. 10 minutes. Free. What's yours? heartiquotient.com #leadership #HEARTI`

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(teaserText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyResultLink = async () => {
    await navigator.clipboard.writeText(resultUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleLinkedIn = async () => {
    const linkedInTeaserText = `Just discovered my leadership strength is ${PILLAR_META[strengthPillar].name}. Curious what yours is? Free 10-minute assessment → heartiquotient.com #leadership #HEARTI`
    await navigator.clipboard.writeText(linkedInTeaserText)
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://heartiquotient.com')}`
    window.open(linkedInUrl, '_blank', 'width=600,height=600')
  }

  return (
    <div className="results-page">
      {/* Hidden off-screen share chart (blurred teaser) */}
      {(() => { console.log('Share chart strengthPillar:', strengthPillar, 'scores:', Object.keys(result.pillar_scores)); return null })()}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, pointerEvents: 'none' }}>
        <SpectraChart
          ref={shareSpectraRef}
          scores={result.pillar_scores}
          size={340}
          animate={false}
          showLabels={true}
          strengthPillar={strengthPillar}
          showCTA={true}
          blurred={true}
        />
      </div>

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
            strengthPillar={strength.pillar}
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
          <div className="grace-explainer">
            <div className="grace-explainer-title">What is the Grace Index?</div>
            <p className="grace-explainer-body">
              The Grace Index measures how you relate to responsibility when things go wrong.
              It is not about whether you hold yourself accountable — it is about whether you
              can do so without self-punishment, over-absorption, or burnout.
            </p>
            <p className="grace-explainer-body">
              Leaders with low Grace scores tend to internalize failure, carry weight that
              isn't theirs, and struggle to reset after mistakes. This creates a compounding
              cost: the harder you are on yourself, the less capacity you have for the
              leadership your team actually needs.
            </p>
            <p className="grace-explainer-body">
              Leaders with high Grace scores can acknowledge mistakes, repair quickly, and
              return to steadiness — without collapsing or hardening. This is not softness.
              It is the psychological infrastructure that makes sustainable leadership possible.
            </p>
            <div className="grace-explainer-note">
              Grace Index is scored separately from your HEARTI dimensions. It is developmental
              feedback about your relationship with accountability — not a judgment of your
              leadership effectiveness.
            </div>
          </div>
        </div>
      )}

      {/* Share section */}
      <div className="share-section">
        <div className="share-title">Share your Spectra</div>
        <div className="share-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem' }}>
          <button
            className="share-btn"
            style={{ background: '#1D9E75', color: '#fff', border: 'none' }}
            onClick={handleShare}
            disabled={sharing}
          >
            {sharing ? 'Preparing…' : 'Download graphic'}
          </button>
          <button
            className="share-btn"
            style={{ background: '#0A66C2', color: '#fff', border: 'none' }}
            onClick={handleLinkedIn}
          >
            Copy + Share to LinkedIn →
          </button>
          <button
            className="share-btn share-secondary"
            onClick={handleCopyLink}
          >
            {copied ? 'Copied!' : 'Copy for Instagram / Threads'}
          </button>
        </div>
        <p className="share-hint">LinkedIn &amp; Instagram: text is copied to your clipboard — paste it into your post.</p>
        <button
          className="cta-btn cta-btn-ghost"
          style={{ marginTop: '0.75rem', width: '100%' }}
          onClick={handleCopyResultLink}
        >
          {copiedLink ? 'Copied!' : 'Copy result link'}
        </button>
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
          {result.instrument === 'enterprise' && (
            <button className="cta-btn cta-btn-secondary" onClick={onViewHabits}>
              Track leadership habits →
            </button>
          )}
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
