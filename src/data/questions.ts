// ─────────────────────────────────────────────────────────────────────────────
// HEARTI Question Data
// Snapshot (31q): refreshed instrument for hearti.app top-of-funnel
// Enterprise (58q): original instrument — feeds 1,651-person benchmark
// ─────────────────────────────────────────────────────────────────────────────

export type Pillar = 'H' | 'E' | 'A' | 'R' | 'T' | 'I' | 'G'

export interface Question {
  id: string
  pillar: Pillar
  text: string
  reverse?: boolean
}

export const PILLAR_META: Record<Pillar, { name: string; label: string; color: string; description: string }> = {
  H: { name: 'Humility',       label: 'H', color: '#4B3FA0', description: 'Performance-based self-awareness' },
  E: { name: 'Empathy',        label: 'E', color: '#1D9E75', description: 'Impact awareness, not agreement' },
  A: { name: 'Accountability', label: 'A', color: '#BA7517', description: 'Alignment, not pressure' },
  R: { name: 'Resiliency',     label: 'R', color: '#D85A30', description: 'Adaptive capacity' },
  T: { name: 'Transparency',   label: 'T', color: '#7C6FD4', description: 'Trust through clarity' },
  I: { name: 'Inclusivity',    label: 'I', color: '#0F6E56', description: 'Belonging by design' },
  G: { name: 'Grace',          label: 'G', color: '#888780', description: 'Accountability without self-punishment' },
}

// ─── SNAPSHOT INSTRUMENT (31 questions) ──────────────────────────────────────

export const SNAPSHOT_QUESTIONS: Question[] = [
  // HUMILITY (5)
  { id: 'H1', pillar: 'H', text: 'I am clear about where my leadership strengths create the most value.' },
  { id: 'H2', pillar: 'H', text: 'I ask for support when a situation exceeds my expertise.' },
  { id: 'H3', pillar: 'H', text: 'I partner intentionally to compensate for my limitations.' },
  { id: 'H4', pillar: 'H', text: 'I do not equate uncertainty with incompetence.' },
  { id: 'H5', pillar: 'H', text: 'I seek recognition even when others contributed equally to the result.', reverse: true },

  // EMPATHY (5)
  { id: 'E1', pillar: 'E', text: 'I consider how my decisions affect others before acting.' },
  { id: 'E2', pillar: 'E', text: 'I listen for what\'s beneath behavior, not just what\'s said.' },
  { id: 'E3', pillar: 'E', text: 'I can acknowledge impact without abandoning my position.' },
  { id: 'E4', pillar: 'E', text: 'I separate understanding from responsibility.' },
  { id: 'E5', pillar: 'E', text: 'When a conversation becomes tense, I focus more on managing my response than on understanding theirs.', reverse: true },

  // ACCOUNTABILITY (5)
  { id: 'A1', pillar: 'A', text: 'Expectations I set are clear and observable.' },
  { id: 'A2', pillar: 'A', text: 'I follow through on commitments I make.' },
  { id: 'A3', pillar: 'A', text: 'I address misalignment directly rather than carrying it silently.' },
  { id: 'A4', pillar: 'A', text: 'I hold others accountable without micromanaging.' },
  { id: 'A5', pillar: 'A', text: 'When something goes wrong on my team, my first instinct is to identify who is responsible.', reverse: true },

  // RESILIENCY (5)
  { id: 'R1', pillar: 'R', text: 'I recover emotionally after high-pressure situations.' },
  { id: 'R2', pillar: 'R', text: 'I can reset without guilt after demanding days.' },
  { id: 'R3', pillar: 'R', text: 'I adapt my leadership approach during uncertainty.' },
  { id: 'R4', pillar: 'R', text: 'I notice stress signals before burnout occurs.' },
  { id: 'R5', pillar: 'R', text: 'I measure my leadership effectiveness by how much I can endure.', reverse: true },

  // TRANSPARENCY (5)
  { id: 'T1', pillar: 'T', text: 'I communicate changes proactively.' },
  { id: 'T2', pillar: 'T', text: 'I name uncertainty without undermining confidence.' },
  { id: 'T3', pillar: 'T', text: 'I repair trust when communication misses the mark.' },
  { id: 'T4', pillar: 'T', text: 'I ensure others understand their role in outcomes.' },
  { id: 'T5', pillar: 'T', text: 'My team understands why decisions are made.', reverse: true },

  // INCLUSIVITY (5)
  { id: 'I1', pillar: 'I', text: 'I actively create conditions where people with different perspectives feel safe to speak up.' },
  { id: 'I2', pillar: 'I', text: 'I have sponsored or advocated for someone from an underrepresented group in the past year.' },
  { id: 'I3', pillar: 'I', text: 'Diversity and inclusion issues are a distraction from pressing business problems.', reverse: true },
  { id: 'I4', pillar: 'I', text: 'I find it hard to recognize or understand the issues around DEI.', reverse: true },
  { id: 'I5', pillar: 'I', text: 'I adjust how I communicate based on the cultural backgrounds of the people I work with.' },

  // GRACE INDEX (6)
  { id: 'G1', pillar: 'G', text: 'When something goes wrong, I pause before assuming it\'s my fault.' },
  { id: 'G2', pillar: 'G', text: 'I can acknowledge mistakes without harsh self-judgment.' },
  { id: 'G3', pillar: 'G', text: 'I clarify ownership instead of absorbing responsibility.' },
  { id: 'G4', pillar: 'G', text: 'I recover emotionally after leadership missteps.' },
  { id: 'G5', pillar: 'G', text: 'I do not use shame to motivate myself.' },
  { id: 'G6', pillar: 'G', text: 'I allow myself to reset without "earning" rest.' },
]

// ─── ENTERPRISE INSTRUMENT (58 questions — original HLQ) ─────────────────────

export const ENTERPRISE_QUESTIONS: Question[] = [
  // HUMILITY (9)
  { id: 'EH1', pillar: 'H', text: 'I regularly acknowledge when I don\'t know the answer.' },
  { id: 'EH2', pillar: 'H', text: 'I regularly ask for feedback.' },
  { id: 'EH3', pillar: 'H', text: 'If people express criticism, I try to learn from it.' },
  { id: 'EH4', pillar: 'H', text: 'I publicly give credit and publicly amplify the success of others.' },
  { id: 'EH5', pillar: 'H', text: 'Partnering with others is foundational to my success.' },
  { id: 'EH6', pillar: 'H', text: 'I get frustrated when I don\'t get recognition.', reverse: true },
  { id: 'EH7', pillar: 'H', text: 'I\'ve been told I\'m a micromanager.', reverse: true },
  { id: 'EH8', pillar: 'H', text: 'I let my team figure out how to get work done.' },
  { id: 'EH9', pillar: 'H', text: 'I listen more than I talk.' },

  // EMPATHY (9)
  { id: 'EE1', pillar: 'E', text: 'I seek to understand situations from another person\'s point of view by asking questions and being curious.' },
  { id: 'EE2', pillar: 'E', text: 'I reach out and express my support when I see that others are struggling.' },
  { id: 'EE3', pillar: 'E', text: 'When making an important decision, I deliberately consult with those who think differently than me.' },
  { id: 'EE4', pillar: 'E', text: 'I can recognize when others struggle without asking them.' },
  { id: 'EE5', pillar: 'E', text: 'I learn from the different views and opinions of others.' },
  { id: 'EE6', pillar: 'E', text: 'I strive to keep everyone happy, sometimes to a fault.', reverse: true },
  { id: 'EE7', pillar: 'E', text: 'I understand the best way to communicate feedback to each team member.' },
  { id: 'EE8', pillar: 'E', text: 'I prioritize delivering results even when there is a cost to the well-being of my team.', reverse: true },
  { id: 'EE9', pillar: 'E', text: 'When I am talking with someone, I often think about what I am going to say next.', reverse: true },

  // ACCOUNTABILITY (9)
  { id: 'EA1', pillar: 'A', text: 'I hold others accountable for their behaviors to create a workplace of belonging.' },
  { id: 'EA2', pillar: 'A', text: 'I take ownership of my decisions and the consequences of mistakes.' },
  { id: 'EA3', pillar: 'A', text: 'My colleagues trust me to get the job done.' },
  { id: 'EA4', pillar: 'A', text: 'I give individuals on my team the authority to make critical decisions.' },
  { id: 'EA5', pillar: 'A', text: 'I communicate when I can\'t meet a deadline.' },
  { id: 'EA6', pillar: 'A', text: 'When making decisions, I prefer to keep my options open.', reverse: true },
  { id: 'EA7', pillar: 'A', text: 'I hold others accountable for completing their assignments accurately and on time.' },
  { id: 'EA8', pillar: 'A', text: 'I hold others accountable even if it makes me feel uncomfortable.' },
  { id: 'EA9', pillar: 'A', text: 'My team tells me when they are behind on goals.' },

  // RESILIENCY (10)
  { id: 'ER1', pillar: 'R', text: 'Unexpected obstacles present opportunities.' },
  { id: 'ER2', pillar: 'R', text: 'I have a hard time giving up on a goal.', reverse: true },
  { id: 'ER3', pillar: 'R', text: 'When I fail, I am able to adapt and try an alternative approach.' },
  { id: 'ER4', pillar: 'R', text: 'I struggle to get over mistakes I made.', reverse: true },
  { id: 'ER5', pillar: 'R', text: 'I gain wisdom from my failures.' },
  { id: 'ER6', pillar: 'R', text: 'I achieve my goals.' },
  { id: 'ER7', pillar: 'R', text: 'I have a positive outlook on life.' },
  { id: 'ER8', pillar: 'R', text: 'I reach out to others for support when I am under stress.' },
  { id: 'ER9', pillar: 'R', text: 'I practice self-care to avoid burn out.' },
  { id: 'ER10', pillar: 'R', text: 'My team feels burned out.', reverse: true },

  // TRANSPARENCY (11)
  { id: 'ET1', pillar: 'T', text: 'I share information that allows my team to do their jobs more effectively.' },
  { id: 'ET2', pillar: 'T', text: 'I avoid difficult conversations.', reverse: true },
  { id: 'ET3', pillar: 'T', text: 'I am comfortable being vulnerable about my shortcomings and challenges.' },
  { id: 'ET4', pillar: 'T', text: 'I explain my decisions so others understand why.' },
  { id: 'ET5', pillar: 'T', text: 'I believe that information should be shared only on a need-to-know basis.', reverse: true },
  { id: 'ET6', pillar: 'T', text: 'I ensure my communications are relevant and appropriate to each audience.' },
  { id: 'ET7', pillar: 'T', text: 'I am willing to take a public stand on controversial issues.' },
  { id: 'ET8', pillar: 'T', text: 'I share my vision and purpose so others can better understand what motivates me.' },
  { id: 'ET9', pillar: 'T', text: 'I prioritize my time for important conversations.' },
  { id: 'ET10', pillar: 'T', text: 'When the news is bad, I don\'t try to gloss over the truth.' },
  { id: 'ET11', pillar: 'T', text: 'People tell me I am easy to talk to.' },

  // INCLUSIVITY (10)
  { id: 'EI1', pillar: 'I', text: 'I hire, refer, and recommend BIPOC candidates (Black, Indigenous, People of Color).' },
  { id: 'EI2', pillar: 'I', text: 'I seek out and participate in training on microaggressions, anti-racism, or white privilege.' },
  { id: 'EI3', pillar: 'I', text: 'I provide corrective feedback to people who behave in a sexist, racist, or homophobic manner.' },
  { id: 'EI4', pillar: 'I', text: 'There are people from different generations who are my close confidants at work.' },
  { id: 'EI5', pillar: 'I', text: 'I find it hard to recognize or understand the issues around DEI.', reverse: true },
  { id: 'EI6', pillar: 'I', text: 'Diversity and inclusion are a distraction from pressing business problems.', reverse: true },
  { id: 'EI7', pillar: 'I', text: 'I initiate conversations about challenging diversity and inclusion topics.' },
  { id: 'EI8', pillar: 'I', text: 'I actively sponsor people from underrepresented communities.' },
  { id: 'EI9', pillar: 'I', text: 'I ask BIPOC and LGBTQ+ colleagues about their experience in our work environment.' },
  { id: 'EI10', pillar: 'I', text: 'I collaborate with diverse talent to ensure our workplace programs and policies are inclusive.' },
]

// ─── SCORING UTILITIES ────────────────────────────────────────────────────────

export function scoreResponse(value: number, reverse: boolean): number {
  return reverse ? 6 - value : value
}

export function calcPillarScore(
  responses: Record<string, number>,
  questions: Question[],
  pillar: Pillar
): number {
  const pillarQs = questions.filter(q => q.pillar === pillar)
  if (pillarQs.length === 0) return 0
  const sum = pillarQs.reduce((acc, q) => {
    const raw = responses[q.id] ?? 3
    return acc + scoreResponse(raw, !!q.reverse)
  }, 0)
  return Math.round((sum / pillarQs.length) * 100) / 100
}

export function calcGraceScore(responses: Record<string, number>, questions: Question[]): number {
  const score = calcPillarScore(responses, questions, 'G')
  return Math.round(((score - 1) / 4) * 100)
}

export type ScoringBand = 'excellence' | 'growth' | 'awareness' | 'reset'

export function getBand(totalScore: number): ScoringBand {
  if (totalScore >= 100) return 'excellence'
  if (totalScore >= 80)  return 'growth'
  if (totalScore >= 60)  return 'awareness'
  return 'reset'
}

export function calcTotalScore(pillarScores: Record<string, number>): number {
  const pillars: Pillar[] = ['H', 'E', 'A', 'R', 'T', 'I']
  const avg = pillars.reduce((acc, p) => acc + (pillarScores[p] ?? 0), 0) / pillars.length
  return Math.round(avg * 25)
}

export const BAND_META: Record<ScoringBand, { label: string; message: string; cta: string; color: string }> = {
  excellence: {
    label: 'HEARTI Leader Excellence',
    message: 'You lead sustainably. Your next edge is strategic influence and enterprise-wide impact.',
    cta: 'Explore HEARTI for Teams',
    color: '#1D9E75',
  },
  growth: {
    label: 'HEARTI Growth Zone',
    message: 'Strong foundation. Your biggest opportunity is expanding your time freedom and leadership footprint.',
    cta: 'Start HEARTI Foundations',
    color: '#4B3FA0',
  },
  awareness: {
    label: 'HEARTI Awareness',
    message: 'You\'re carrying more than you need to. Leadership clarity will create real space.',
    cta: 'Start HEARTI Foundations',
    color: '#BA7517',
  },
  reset: {
    label: 'HEARTI Reset',
    message: 'Overwhelm risk is high. HEARTI will stabilize your leadership before it costs more.',
    cta: 'Start HEARTI Foundations — Now',
    color: '#D85A30',
  },
}

export const GRACE_BANDS = [
  { max: 40,  label: 'Over-Carrying',     description: 'Responsibility is frequently internalized. High burnout risk.', color: '#D85A30' },
  { max: 70,  label: 'Transitional',      description: 'Awareness is emerging. Pausing and repair are inconsistent.', color: '#BA7517' },
  { max: 100, label: 'Integrated Grace',  description: 'Accountability and recovery are well-balanced. Leadership is sustainable.', color: '#1D9E75' },
]

export function getGraceBand(score: number) {
  return GRACE_BANDS.find(b => score <= b.max) ?? GRACE_BANDS[GRACE_BANDS.length - 1]
}
