'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAStatus() {
  // Initialize with safe defaults to prevent hydration mismatch
  const [clientState, setClientState] = useState({
    mounted: false,
    isOnline: true,
    isInstalled: false,
  });
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [userAcceptedInstall, setUserAcceptedInstall] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Set actual values after mounting to avoid hydration mismatch
    // Batch all initial client-side values in a single state update
    // Note: Browser APIs (navigator, window) must be read after mount, requiring useEffect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setClientState({
      mounted: true,
      isOnline: navigator.onLine,
      isInstalled: window.matchMedia('(display-mode: standalone)').matches,
    });

    const handleOnline = () => setClientState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setClientState(prev => ({ ...prev, isOnline: false }));

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
  if (!clientState.mounted) return null;
  if ((clientState.isInstalled || userAcceptedInstall) && clientState.isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-50">
      {!clientState.isOnline && (
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
        <div className="glass-card p-4 animate-fadeInUp max-w-sm border border-[var(--accent-primary)]/20 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-white font-bold text-base">JS</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-[var(--text-primary)] mb-1">Установите JS Quizzy</p>
              <p className="text-sm text-[var(--text-secondary)] mb-4">Добавьте приложение на главный экран для быстрого доступа</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleInstall}
                  className="px-4 py-2.5 bg-[var(--accent-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--accent-primary)]/90 hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3m-3 3l-3-3m3 3h6M3 13.5h10.5m-10.5 0V19.5A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5V13.5m-16.5 0V6a1.5 1.5 0 011.5-1.5h15A1.5 1.5 0 0121 6v7.5" />
                  </svg>
                  Установить
                </button>
                <button
                  onClick={() => setDismissed(true)}
                  className="px-4 py-2.5 text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-card)] rounded-lg text-sm font-medium transition-colors"
                >
                  Не сейчас
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
