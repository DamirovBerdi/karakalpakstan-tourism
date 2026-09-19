import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from '@/lib/AuthContext';
import { initHoneypot } from '@/lib/honeypot';

// Initialize pentest honeypot traps and DevTools console decoy
initHoneypot();

// Register Service Worker for caching and PWA support
registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
