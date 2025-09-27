
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Layout from './components/Layout';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Intro from './pages/Intro';
import AuthCallback from './pages/AuthCallback';
import PasswordReset from './pages/PasswordReset';
import NotFound from './pages/NotFound';
import PaymentSuccess from './pages/PaymentSuccess';
import Profile from './pages/Profile';
import EnhancedCoachDashboard from './pages/EnhancedCoachDashboard';
import Admin from './pages/Admin';
import AuthGuard from './components/AuthGuard';
import AuthProvider from './contexts/auth/AuthProvider';
import LanguageProvider from './contexts/language/LanguageProvider';
import './App.css';

function App() {
  console.log('App component rendering...');
  
  // Emergency fallback for debugging
  if (typeof window !== 'undefined' && window.location.search.includes('debug=true')) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <h1>Debug Mode - App is Working</h1>
        <p>React is rendering successfully</p>
        <p>Current path: {window.location.pathname}</p>
      </div>
    );
  }

  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route element={<Layout><Outlet /></Layout>}>
              <Route element={<AuthGuard />}>
                <Route index element={<Index />} />
                <Route path="/intro" element={<Intro />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/coach" element={<EnhancedCoachDashboard />} />
                <Route path="/admin" element={<Admin />} />
              </Route>
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/password-reset" element={<PasswordReset />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
