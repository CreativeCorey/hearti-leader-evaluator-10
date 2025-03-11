
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import { initializeAnalytics } from './utils/analytics'

// Initialize Google Analytics with your measurement ID
initializeAnalytics('G-BS7VZ4FXK6');

createRoot(document.getElementById("root")!).render(<App />);
