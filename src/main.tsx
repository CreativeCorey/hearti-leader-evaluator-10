
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import { initializeAnalytics } from './utils/analytics'

// Initialize Google Analytics with your measurement ID
// Replace "G-XXXXXXXXXX" with your actual Google Analytics measurement ID
initializeAnalytics('G-XXXXXXXXXX');

createRoot(document.getElementById("root")!).render(<App />);
