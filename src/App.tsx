import { useState, useEffect } from 'react'
import { GatePage } from './pages/GatePage'
import { AssessmentPage } from './pages/AssessmentPage'
import { TabulationPage } from './pages/TabulationPage'
import { DemographicsPage } from './pages/DemographicsPage'
import { ResultsPage } from './pages/ResultsPage'
import { HabitsPage } from './pages/HabitsPage'
import { EnterpriseGatePage } from './pages/EnterpriseGatePage'
import type { AssessmentResult } from './lib/supabase'

export type AppPage = 'gate' | 'enterprise-gate' | 'assessment' | 'tabulation' | 'demographics' | 'results' | 'habits'

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
    const mode = params.get('mode')
    const token = params.get('token')
    const rid = params.get('result')

    if (mode === 'enterprise' || token) {
      setPage('enterprise-gate')
    }
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

  const handleGateComplete = (sess: UserSession) => {
    setSession(sess)
    setPage('assessment')
  }

  const handleAssessmentComplete = (r: AssessmentResult) => {
    setResult(r)
    setPage('tabulation')
  }

  const handleViewHabits = () => {
    if (session || result) setPage('habits')
  }

  const handleRetake = () => {
    setResult(null)
    setPage('gate')
  }

  return (
    <div className="app-shell">
      {page === 'gate' && (
        <GatePage onComplete={handleGateComplete} />
      )}
      {page === 'enterprise-gate' && (
        <EnterpriseGatePage onComplete={handleGateComplete} />
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
          onComplete={() => setPage('demographics')}
        />
      )}
      {page === 'demographics' && result && (
        <DemographicsPage
          result={result}
          onComplete={() => setPage('results')}
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
