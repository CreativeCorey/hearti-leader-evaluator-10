import { useState, useEffect, useCallback, useMemo } from 'react'
import type { UserSession } from '../App'
import type { AssessmentResult } from '../lib/supabase'
import {
  SNAPSHOT_QUESTIONS, ENTERPRISE_QUESTIONS, PILLAR_META,
  calcPillarScore, calcGraceScore, calcTotalScore, getBand,
  type Pillar
} from '../data/questions'
import { saveAssessmentResult, triggerNurtureEmail } from '../lib/supabase'

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr]
  let s = (seed ^ 0xdeadbeef) >>> 0
  for (let i = result.length - 1; i > 0; i--) {
    s = Math.imul(s ^ (s >>> 15), s | 1)
    s ^= s + Math.imul(s ^ (s >>> 7), s | 61)
    s = ((s ^ (s >>> 14)) >>> 0)
    const j = s % (i + 1)
    const tmp = result[i]
    result[i] = result[j]
    result[j] = tmp
  }
  return result
}


const SCALE = [
  { value: 1, label: 'Nearly\nNever' },
  { value: 2, label: 'Rarely' },
  { value: 3, label: 'Sometimes' },
  { value: 4, label: 'Often' },
  { value: 5, label: 'Almost\nAlways' },
]

interface Props {
  session: UserSession
  onComplete: (result: AssessmentResult) => void
}

export function AssessmentPage({ session, onComplete }: Props) {
  const questions = useMemo(() => {
    const seed = (Date.now() ^ (Math.random() * 0x100000000)) >>> 0
    const shuffled = seededShuffle(
      session.instrument === 'snapshot' ? SNAPSHOT_QUESTIONS : ENTERPRISE_QUESTIONS,
      seed
    )
    return shuffled
  }, [])

const [currentIdx, setCurrentIdx] = useState(0)
  const [responses, setResponses] = useState<Record<string, number>>({})
  const [animating, setAnimating] = useState(false)
  const [saving, setSaving] = useState(false)

  const totalQs = questions.length
  const currentQ = questions[currentIdx]
  const answeredCount = Object.keys(responses).length
  const progress = Math.round((answeredCount / totalQs) * 100)

  const pillar = currentQ?.pillar as Pillar
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
      if (currentIdx < totalQs - 1) {
        setCurrentIdx(prev => prev + 1)
      } else {
        finalize(newResponses)
      }
    }, 280)
  }, [currentQ, animating, responses, currentIdx, totalQs, finalize])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === 'Backspace' || e.key === 'ArrowLeft') && currentIdx > 0) {
        setCurrentIdx(prev => prev - 1)
        return
      }
      const num = parseInt(e.key)
      if (num >= 1 && num <= 5) handleAnswer(num)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleAnswer, currentIdx])

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
        {currentIdx > 0 && (
          <button className="assessment-back" onClick={() => setCurrentIdx(prev => prev - 1)}>
            ← Back
          </button>
        )}
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-meta">
          <span>{answeredCount} of {totalQs}</span>
        </div>
      </div>

      <div className={`question-block ${animating ? 'fading' : 'visible'}`}>
        <h2 className="question-text">{currentQ.text}</h2>
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
        {questions.map((_, i) => (
          <div
            key={i}
            className={`dot${i === currentIdx ? ' active' : i < currentIdx ? ' done' : ''}`}
            style={i === currentIdx ? { background: pillarMeta?.color } : {}}
          />
        ))}
      </div>
    </div>
  )
}
