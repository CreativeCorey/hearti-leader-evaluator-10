import { useState, useEffect, useCallback } from 'react'
import type { UserSession } from '../App'
import type { AssessmentResult } from '../lib/supabase'
import {
  SNAPSHOT_QUESTIONS, ENTERPRISE_QUESTIONS, PILLAR_META,
  calcPillarScore, calcGraceScore, calcTotalScore, getBand,
  type Pillar, type Question
} from '../data/questions'
import { saveAssessmentResult, triggerNurtureEmail } from '../lib/supabase'

interface Props {
  session: UserSession
  onComplete: (result: AssessmentResult) => void
}

function buildScreens(questions: Question[], instrument: 'snapshot' | 'enterprise') {
  if (instrument === 'snapshot') {
    const pillars: Pillar[] = ['H', 'E', 'A', 'R', 'T', 'I', 'G']
    return pillars.map(p => questions.filter(q => q.pillar === p)).filter(s => s.length > 0)
  }
  const pillars: Pillar[] = ['H', 'E', 'A', 'R', 'T', 'I']
  return pillars.map(p => questions.filter(q => q.pillar === p)).filter(s => s.length > 0)
}

const SCALE = [
  { value: 1, label: 'Strongly\nDisagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly\nAgree' },
]

export function AssessmentPage({ session, onComplete }: Props) {
  const questions = session.instrument === 'snapshot' ? SNAPSHOT_QUESTIONS : ENTERPRISE_QUESTIONS
  const screens = buildScreens(questions, session.instrument)

  const [screenIdx, setScreenIdx] = useState(0)
  const [qIdx, setQIdx] = useState(0)
  const [responses, setResponses] = useState<Record<string, number>>({})
  const [animating, setAnimating] = useState(false)
  const [saving, setSaving] = useState(false)

  const currentScreen = screens[screenIdx]
  const currentQ = currentScreen?.[qIdx]
  const totalScreens = screens.length
  const totalQs = questions.length
  const answeredCount = Object.keys(responses).length
  const progress = Math.round((answeredCount / totalQs) * 100)

  const pillar = currentScreen?.[0]?.pillar as Pillar
  const pillarMeta = pillar ? PILLAR_META[pillar] : null

  const finalize = useCallback(async (allResponses: Record<string, number>) => {
    setSaving(true)
    const allPillars: Pillar[] = ['H', 'E', 'A', 'R', 'T', 'I']
    const pillarScores: Record<string, number> = {}
    for (const p of allPillars) {
      pillarScores[p] = calcPillarScore(allResponses, questions, p)
    }

    const graceScore = session.instrument === 'snapshot'
      ? calcGraceScore(allResponses, questions)
      : null

    const totalScore = calcTotalScore(pillarScores)
    const band = getBand(totalScore)

    const sorted = Object.entries(pillarScores).sort((a, b) => b[1] - a[1])
    const strengthPillar = sorted[0][0]
    const vulnerabilityPillar = sorted[sorted.length - 1][0]

    // Fix TS2322: enterprise_token must be string | null, not string | undefined
    const result: AssessmentResult = {
      email: session.email,
      first_name: session.firstName,
      instrument: session.instrument,
      responses: allResponses,
      pillar_scores: pillarScores,
      grace_score: graceScore,
      total_score: totalScore,
      band,
      strength_pillar: strengthPillar,
      vulnerability_pillar: vulnerabilityPillar,
      enterprise_token: session.enterpriseToken ?? null,
    }

    try {
      const saved = await saveAssessmentResult(result)
      result.id = saved.id
      result.created_at = saved.created_at

      await triggerNurtureEmail({
        email: session.email,
        firstName: session.firstName,
        resultId: saved.id ?? '',
        band,
        strengthPillar,
        vulnerabilityPillar,
      })
    } catch (e) {
      console.error('Save failed, showing results anyway:', e)
    }

    setSaving(false)
    onComplete(result)
  }, [session, questions, onComplete])

  const handleAnswer = useCallback((value: number) => {
    if (!currentQ || animating) return
    const newResponses = { ...responses, [currentQ.id]: value }
    setResponses(newResponses)
    setAnimating(true)

    setTimeout(() => {
      setAnimating(false)
      if (qIdx < currentScreen.length - 1) {
        setQIdx(qIdx + 1)
      } else if (screenIdx < totalScreens - 1) {
        setScreenIdx(screenIdx + 1)
        setQIdx(0)
      } else {
        finalize(newResponses)
      }
    }, 280)
  }, [currentQ, animating, responses, qIdx, screenIdx, currentScreen, totalScreens, finalize])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const num = parseInt(e.key)
      if (num >= 1 && num <= 5) handleAnswer(num)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleAnswer])

  if (saving) {
    return (
      <div className="assessment-saving">
        <div className="saving-spinner" />
        <p>Building your profile…</p>
      </div>
    )
  }

  if (!currentQ) return null

  return (
    <div className="assessment-page">
      <div className="assessment-header">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-meta">
          <span style={{ color: pillarMeta?.color }}>{pillarMeta?.name}</span>
          <span>{answeredCount} of {totalQs}</span>
        </div>
      </div>

      <div className="pillar-label" style={{ borderColor: pillarMeta?.color }}>
        <span className="pillar-letter" style={{ color: pillarMeta?.color }}>{pillar}</span>
        <span className="pillar-desc">{pillarMeta?.description}</span>
      </div>

      <div className={`question-block ${animating ? 'fading' : 'visible'}`}>
        <div className="question-count">
          {qIdx + 1} of {currentScreen.length}
        </div>
        <h2 className="question-text">{currentQ.text}</h2>
        {currentQ.reverse && (
          <div className="reverse-indicator">Consider carefully</div>
        )}
      </div>

      <div className={`scale-row ${animating ? 'fading' : 'visible'}`}>
        {SCALE.map(s => {
          const selected = responses[currentQ.id] === s.value
          return (
            <button
              key={s.value}
              className={`scale-btn${selected ? ' selected' : ''}`}
              onClick={() => handleAnswer(s.value)}
              style={selected ? { borderColor: pillarMeta?.color, background: (pillarMeta?.color ?? '') + '18' } : {}}
            >
              <span className="scale-num" style={selected ? { color: pillarMeta?.color } : {}}>{s.value}</span>
              <span className="scale-label">{s.label}</span>
            </button>
          )
        })}
      </div>

      <p className="keyboard-hint">Press 1–5 to answer quickly</p>

      <div className="screen-dots">
        {screens.map((_, i) => (
          <div
            key={i}
            className={`dot${i === screenIdx ? ' active' : i < screenIdx ? ' done' : ''}`}
            style={i === screenIdx ? { background: pillarMeta?.color } : {}}
          />
        ))}
      </div>
    </div>
  )
}
