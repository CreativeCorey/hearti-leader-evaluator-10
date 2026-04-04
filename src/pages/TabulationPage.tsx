import { useEffect, useState } from 'react'
import type { AssessmentResult } from '../lib/supabase'

interface Props {
  result: AssessmentResult
  onComplete: () => void
}

const STATEMENTS = [
  { text: 'Mapping your Humility signature\u2026',       color: '#4B3FA0' },
  { text: 'Reading your Empathy patterns\u2026',          color: '#1D9E75' },
  { text: 'Scoring your Accountability behaviors\u2026',  color: '#BA7517' },
  { text: 'Measuring your Resiliency capacity\u2026',     color: '#D85A30' },
  { text: 'Analyzing your Transparency signals\u2026',    color: '#7C6FD4' },
  { text: 'Evaluating your Inclusivity practices\u2026',  color: '#0F6E56' },
]

const INTERVAL_MS = 550   // each statement appears every 550ms → 6 × 550 = 3300ms
const FINAL_DELAY_MS = 400 // pause before "Building your Spectra…" appears
const COMPLETE_MS = 700   // how long "Building…" shows before calling onComplete
// Total ≈ 3300 + 400 + 700 = 4400ms

export function TabulationPage({ onComplete }: Props) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [showFinal, setShowFinal] = useState(false)

  useEffect(() => {
    // Stagger each statement
    const timers: ReturnType<typeof setTimeout>[] = []

    STATEMENTS.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), i * INTERVAL_MS))
    })

    // Show final "Building…" line
    const finalAppear = STATEMENTS.length * INTERVAL_MS + FINAL_DELAY_MS
    timers.push(setTimeout(() => setShowFinal(true), finalAppear))

    // Call onComplete
    timers.push(setTimeout(onComplete, finalAppear + COMPLETE_MS))

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8F7FF',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      {/* Logo */}
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.6rem',
        fontWeight: 700,
        color: '#4B3FA0',
        letterSpacing: '0.04em',
        marginBottom: '3rem',
      }}>
        HEARTI
      </div>

      {/* Statement list */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        width: '100%',
        maxWidth: '420px',
      }}>
        {STATEMENTS.map((s, i) => (
          <div
            key={i}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1rem',
              color: s.color,
              fontWeight: 500,
              opacity: visibleCount > i ? 1 : 0,
              transform: visibleCount > i ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            {s.text}
          </div>
        ))}

        {/* Final line */}
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '1.05rem',
            color: '#4B3FA0',
            fontWeight: 600,
            marginTop: '0.5rem',
            opacity: showFinal ? 1 : 0,
            transform: showFinal ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            animation: showFinal ? 'tabPulse 1s ease-in-out infinite' : 'none',
          }}
        >
          Building your Spectra profile\u2026
        </div>
      </div>

      <style>{`
        @keyframes tabPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
      `}</style>
    </div>
  )
}
