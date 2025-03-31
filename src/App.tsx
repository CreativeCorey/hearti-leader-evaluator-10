
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Layout from './components/Layout';
import Index from './pages/Index';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';
import NotFound from './pages/NotFound';
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
            <Route path="/" element={<Layout><Outlet /></Layout>}>
              <Route element={<AuthGuard />}>
                <Route index element={<Index />} />
              </Route>
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
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
