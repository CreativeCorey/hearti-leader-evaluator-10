
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Layout from './components/Layout';
import Index from './pages/Index';
import Auth from './pages/Auth';
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
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route element={<Layout><Outlet /></Layout>}>
              <Route element={<AuthGuard />}>
                <Route index element={<Index />} />
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
