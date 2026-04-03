import { useState, useEffect } from 'react'
import { PILLAR_META, type Pillar } from '../data/questions'
import { getHabits, upsertHabit, deleteHabit, type HabitEntry } from '../lib/supabase'

interface Props {
  userEmail: string
  pillarScores?: Record<string, number>
  onBack: () => void
}

const HEARTI_PILLARS: Pillar[] = ['H', 'E', 'A', 'R', 'T', 'I']

const SUGGESTED_HABITS: Record<Pillar, string[]> = {
  H: [
    'Ask one person for feedback on a recent decision.',
    'Name one thing I don\'t know yet — out loud in a meeting.',
    'Give specific credit to a teammate in front of others.',
  ],
  E: [
    'Listen for 90 seconds before responding in a difficult conversation.',
    'Check in with one person who seems off today.',
    'Repeat back what I heard before sharing my view.',
  ],
  A: [
    'Send a follow-up on one open commitment.',
    'Name one misalignment I\'ve been carrying silently — then address it.',
    'Clarify expectations on one active project.',
  ],
  R: [
    'Take a 10-minute walk between high-pressure blocks.',
    'Name one thing that went wrong — and one thing I learned from it.',
    'Block 20 minutes to decompress before my first evening commitment.',
  ],
  T: [
    'Share the "why" behind one decision I made today.',
    'Send a proactive update on something that\'s changed.',
    'Have one conversation I\'ve been avoiding.',
  ],
  I: [
    'Ask a colleague from a different background about their experience this week.',
    'Actively bring a quieter voice into a group decision.',
    'Name one assumption I\'m carrying — then question it.',
  ],
  G: [],
}

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function weekDates() {
  const today = new Date()
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })
}

export function HabitsPage({ userEmail, pillarScores, onBack }: Props) {
  const [habits, setHabits] = useState<HabitEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPillar, setSelectedPillar] = useState<Pillar>('H')
  const [newHabit, setNewHabit] = useState('')
  const [adding, setAdding] = useState(false)
  const [activeTab, setActiveTab] = useState<'today' | 'week'>('today')

  const today = todayStr()
  const week = weekDates()

  // Load habits for the past 7 days
  useEffect(() => {
    setLoading(true)
    getHabits(userEmail, week[0], today)
      .then(setHabits)
      .catch(() => setHabits([]))
      .finally(() => setLoading(false))
  }, [userEmail])

  const todayHabits = habits.filter(h => h.date === today)

  const handleToggle = async (habit: HabitEntry) => {
    const updated = { ...habit, completed: !habit.completed }
    setHabits(prev => prev.map(h => h.id === habit.id ? updated : h))
    try {
      await upsertHabit(updated)
    } catch {
      // revert on failure
      setHabits(prev => prev.map(h => h.id === habit.id ? habit : h))
    }
  }

  const handleAddHabit = async (text: string) => {
    if (!text.trim()) return
    setAdding(true)
    const entry: HabitEntry = {
      user_email: userEmail,
      date: today,
      pillar: selectedPillar,
      habit_text: text.trim(),
      completed: false,
    }
    try {
      const saved = await upsertHabit(entry)
      setHabits(prev => [saved, ...prev])
      setNewHabit('')
    } catch (e) {
      console.error(e)
    }
    setAdding(false)
  }

  const handleDelete = async (habit: HabitEntry) => {
    if (!habit.id) return
    setHabits(prev => prev.filter(h => h.id !== habit.id))
    try {
      await deleteHabit(habit.id)
    } catch {
      setHabits(prev => [habit, ...prev])
    }
  }

  // Weekly completion rate per pillar
  const weeklyStats = HEARTI_PILLARS.map(p => {
    const pillarHabits = habits.filter(h => h.pillar === p)
    const done = pillarHabits.filter(h => h.completed).length
    const total = pillarHabits.length
    return { pillar: p, done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 }
  })

  // Vulnerability pillar (lowest score) gets highlighted
  const vulnerabilityPillar = pillarScores
    ? HEARTI_PILLARS.reduce((a, b) =>
        (pillarScores[a] ?? 5) < (pillarScores[b] ?? 5) ? a : b)
    : null

  return (
    <div className="habits-page">
      <div className="habits-header">
        <button className="habits-back" onClick={onBack}>← Results</button>
        <div className="habits-title">Leadership Habits</div>
        <div className="habits-subtitle">Daily practice for your HEARTI dimensions</div>
      </div>

      {/* Tab bar */}
      <div className="habits-tabs">
        <button
          className={`habits-tab ${activeTab === 'today' ? 'active' : ''}`}
          onClick={() => setActiveTab('today')}
        >Today</button>
        <button
          className={`habits-tab ${activeTab === 'week' ? 'active' : ''}`}
          onClick={() => setActiveTab('week')}
        >7-Day View</button>
      </div>

      {activeTab === 'today' && (
        <>
          {/* Pillar selector */}
          <div className="pillar-selector">
            {HEARTI_PILLARS.map(p => {
              const meta = PILLAR_META[p]
              const isVuln = p === vulnerabilityPillar
              return (
                <button
                  key={p}
                  className={`pillar-sel-btn ${selectedPillar === p ? 'selected' : ''}`}
                  style={selectedPillar === p ? { borderColor: meta.color, background: meta.color + '18' } : {}}
                  onClick={() => setSelectedPillar(p)}
                >
                  <span className="pillar-sel-letter" style={{ color: meta.color }}>{p}</span>
                  {isVuln && <span className="pillar-vuln-dot" style={{ background: meta.color }} />}
                </button>
              )
            })}
          </div>

          {vulnerabilityPillar && selectedPillar === vulnerabilityPillar && (
            <div className="vuln-nudge">
              <span style={{ color: PILLAR_META[vulnerabilityPillar].color }}>
                {PILLAR_META[vulnerabilityPillar].name}
              </span> is your growth edge — habits here compound fastest.
            </div>
          )}

          {/* Add habit */}
          <div className="add-habit-row">
            <input
              className="habit-input"
              placeholder="Add a custom habit for today…"
              value={newHabit}
              onChange={e => setNewHabit(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddHabit(newHabit)}
            />
            <button
              className="habit-add-btn"
              onClick={() => handleAddHabit(newHabit)}
              disabled={adding}
              style={{ borderColor: PILLAR_META[selectedPillar].color, color: PILLAR_META[selectedPillar].color }}
            >
              +
            </button>
          </div>

          {/* Suggested habits */}
          <div className="suggested-section">
            <div className="suggested-label">Suggested for {PILLAR_META[selectedPillar].name}</div>
            {(SUGGESTED_HABITS[selectedPillar] ?? []).map(habit => {
              const exists = todayHabits.some(h => h.habit_text === habit)
              return (
                <button
                  key={habit}
                  className={`suggested-chip ${exists ? 'exists' : ''}`}
                  onClick={() => !exists && handleAddHabit(habit)}
                  style={exists ? { opacity: 0.5 } : {}}
                >
                  {exists ? '✓ ' : '+ '}{habit}
                </button>
              )
            })}
          </div>

          {/* Today's habits list */}
          <div className="habits-list">
            {loading && <div className="habits-loading">Loading…</div>}
            {!loading && todayHabits.length === 0 && (
              <div className="habits-empty">
                Add a habit above, or choose a suggestion to get started.
              </div>
            )}
            {todayHabits.map(habit => {
              const meta = PILLAR_META[habit.pillar as Pillar]
              return (
                <div key={habit.id ?? habit.habit_text} className={`habit-row ${habit.completed ? 'done' : ''}`}>
                  <button
                    className="habit-check"
                    onClick={() => handleToggle(habit)}
                    style={{ borderColor: habit.completed ? meta.color : undefined,
                             background: habit.completed ? meta.color : undefined }}
                  >
                    {habit.completed && <span className="habit-check-mark">✓</span>}
                  </button>
                  <div className="habit-body">
                    <span className="habit-pill" style={{ background: meta.color + '22', color: meta.color }}>
                      {meta.name}
                    </span>
                    <div className={`habit-text ${habit.completed ? 'strikethrough' : ''}`}>
                      {habit.habit_text}
                    </div>
                  </div>
                  <button
                    className="habit-delete"
                    onClick={() => handleDelete(habit)}
                    aria-label="Remove"
                  >×</button>
                </div>
              )
            })}
          </div>
        </>
      )}

      {activeTab === 'week' && (
        <div className="week-view">
          <div className="week-stats">
            {weeklyStats.map(({ pillar, done, total, pct }) => {
              const meta = PILLAR_META[pillar]
              return (
                <div key={pillar} className="week-stat-row">
                  <div className="week-stat-label">
                    <span style={{ color: meta.color, fontWeight: 500 }}>{meta.name}</span>
                    <span className="week-stat-count">{done}/{total}</span>
                  </div>
                  <div className="week-stat-track">
                    <div
                      className="week-stat-fill"
                      style={{ width: `${pct}%`, background: meta.color }}
                    />
                  </div>
                  <span className="week-stat-pct" style={{ color: meta.color }}>{pct}%</span>
                </div>
              )
            })}
          </div>

          {/* Calendar heatmap — simple 7-day grid */}
          <div className="week-calendar-header">
            <div className="week-cal-title">This week</div>
            <div className="week-cal-dates">
              {week.map(d => {
                const dayHabits = habits.filter(h => h.date === d)
                const done = dayHabits.filter(h => h.completed).length
                const label = new Date(d + 'T12:00:00').toLocaleDateString('en', { weekday: 'short' })
                const isToday = d === today
                return (
                  <div key={d} className={`week-cal-day ${isToday ? 'today' : ''}`}>
                    <div className="week-cal-day-label">{label}</div>
                    <div
                      className="week-cal-dot"
                      style={{
                        background: done > 0 ? '#4B3FA0' : 'var(--color-border-tertiary)',
                        opacity: done > 0 ? Math.min(0.4 + done * 0.15, 1) : 1,
                      }}
                    />
                    <div className="week-cal-count">{done > 0 ? done : '—'}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
