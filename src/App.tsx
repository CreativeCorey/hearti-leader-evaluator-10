import { useState, useEffect, useCallback } from 'react'
import { GatePage } from './pages/GatePage'
import { AssessmentPage } from './pages/AssessmentPage'
import { TabulationPage } from './pages/TabulationPage'
import { DemographicsPage } from './pages/DemographicsPage'
import { ResultsPage } from './pages/ResultsPage'
import { HabitsPage } from './pages/HabitsPage'
import type { AssessmentResult } from './lib/supabase'

export type AppPage = 'gate' | 'assessment' | 'tabulation' | 'demographics' | 'results' | 'habits'

export interface UserSession {
  email: string
  firstName: string
  instrument: 'snapshot' | 'enterprise'
  enterpriseToken?: string
}

export default function App() {
  const [page, setPage] = useState<AppPage>('gate')
  const [session, setSession] = useState<UserSession | null>(null)
  const [result, setResult] = useState<AssessmentResult | null>(null)

  // Check URL params for enterprise mode or result deep-link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const rid = params.get('result')

    if (rid) {
      // Deep-link to results — load from Supabase
      import('./lib/supabase').then(({ getAssessmentResult }) => {
        getAssessmentResult(rid).then(r => {
          setResult(r)
          setPage('results')
        }).catch(() => setPage('gate'))
      })
    }
  }, [])

  const handleGateComplete = useCallback((sess: UserSession) => {
    setSession(sess)
    setPage('assessment')
  }, [])

  const handleAssessmentComplete = useCallback((r: AssessmentResult) => {
    setResult(r)
    setPage('tabulation')
  }, [])

  const handleTabulationComplete = useCallback(() => setPage('demographics'), [])
  const handleDemographicsComplete = useCallback(() => setPage('results'), [])

  const handleViewHabits = useCallback(() => {
    if (session || result) setPage('habits')
  }, [session, result])

  const handleRetake = useCallback(() => {
    setResult(null)
    setPage('gate')
  }, [])

  return (
    <div className="app-shell">
      {page === 'gate' && (
        <GatePage onComplete={handleGateComplete} />
      )}
      {page === 'assessment' && session && (
        <AssessmentPage
          session={session}
          onComplete={handleAssessmentComplete}
        />
      )}
      {page === 'tabulation' && result && (
        <TabulationPage
          result={result}
          onComplete={handleTabulationComplete}
        />
      )}
      {page === 'demographics' && result && (
        <DemographicsPage
          result={result}
          onComplete={handleDemographicsComplete}
        />
      )}
      {page === 'results' && result && (
        <ResultsPage
          result={result}
          onViewHabits={handleViewHabits}
          onRetake={handleRetake}
          userEmail={session?.email ?? result.email}
        />
      )}
      {page === 'habits' && (result || session) && (
        <HabitsPage
          userEmail={session?.email ?? result?.email ?? ''}
          pillarScores={result?.pillar_scores}
          onBack={() => setPage('results')}
        />
      )}
    </div>
  )
}
