'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAStatus() {
  // Initialize with safe defaults to prevent hydration mismatch
  const [isOnline, setIsOnline] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [userAcceptedInstall, setUserAcceptedInstall] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set actual values after mounting to avoid hydration mismatch
    setMounted(true);
    setIsOnline(navigator.onLine);
    setIsInstalled(window.matchMedia('(display-mode: standalone)').matches);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setUserAcceptedInstall(true);
    }
    
    setDeferredPrompt(null);
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) return null;
  if ((isInstalled || userAcceptedInstall) && isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-50">
      {!isOnline && (
        <div className="glass-card px-4 py-3 flex items-center gap-3 border-[var(--accent-warning)]/30 animate-fadeIn">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-warning)]/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-[var(--accent-warning)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Offline Mode</p>
            <p className="text-xs text-[var(--text-muted)]">Using cached data</p>
          </div>
        </div>
      )}
      {deferredPrompt && !dismissed && (
        <div className="glass-card p-4 animate-fadeInUp max-w-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">JS</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">Install JS Quizzy</p>
              <p className="text-xs text-[var(--text-muted)] mb-3">Add to your home screen for quick access</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleInstall}
                  className="px-3 py-1.5 bg-[var(--accent-primary)] text-[var(--bg-primary)] rounded-lg text-xs font-semibold hover:shadow-lg transition-all"
                >
                  Install
                </button>
                <button
                  onClick={() => setDismissed(true)}
                  className="px-3 py-1.5 text-[var(--text-muted)] hover:text-[var(--text-secondary)] text-xs font-medium transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
