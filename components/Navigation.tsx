'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [clientState, setClientState] = useState({
    mounted: false,
    isInstalled: false,
  });

  useEffect(() => {
    // Note: Browser APIs (window.matchMedia, navigator) must be read after mount, requiring useEffect
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInStandaloneMode = (window.navigator as { standalone?: boolean }).standalone === true;
    const installed = isStandalone || isInStandaloneMode;
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setClientState({
      mounted: true,
      isInstalled: installed,
    });
    
    if (installed) {
      console.log('PWA already installed');
      }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      console.log('PWA install prompt available');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.log('No install prompt available');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('Install prompt outcome:', outcome);
      
      if (outcome === 'accepted') {
        setClientState(prev => ({ ...prev, isInstalled: true }));
      }
    } catch (error) {
      console.error('Error showing install prompt:', error);
    }
    
    setDeferredPrompt(null);
  };

  useEffect(() => {
    if (clientState.mounted) {
      console.log('PWA Install Status:', {
        mounted: clientState.mounted,
        isInstalled: clientState.isInstalled,
        hasPrompt: deferredPrompt !== null,
        showButton: clientState.mounted && !clientState.isInstalled && deferredPrompt !== null
      });
    }
  }, [clientState.mounted, clientState.isInstalled, deferredPrompt]);

  const showInstallButton = clientState.mounted && !clientState.isInstalled && deferredPrompt !== null;

  const links = [
    { href: '/quiz', label: 'Quiz', icon: QuizIcon },
    { href: '/questions', label: 'Questions', icon: QuestionsIcon },
    { href: '/stats', label: 'Stats', icon: StatsIcon },
    { href: '/about', label: 'About', icon: AboutIcon },
  ];

  return (
    <nav className="nav-glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
                <span className="text-white font-bold text-lg">JS</span>
              </div>
              <span className="text-xl font-bold text-[var(--text-primary)] hidden sm:block">
                Quizzy
              </span>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:items-center sm:gap-1">
              {links.map(link => {
                const isActive = pathname === link.href || 
                  (link.href === '/quiz' && pathname.startsWith('/quiz'));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`nav-link flex items-center gap-2 ${isActive ? 'active' : ''}`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {showInstallButton ? (
              <>
                <button
                  onClick={handleInstall}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white hover:shadow-lg hover:shadow-[var(--accent-primary)]/25 transition-all group"
                  aria-label="Install PWA"
                >
                  <InstallIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Install</span>
                </button>
                <button
                  onClick={handleInstall}
                  className="sm:hidden p-2 rounded-lg text-[var(--accent-primary)] hover:bg-[var(--bg-card)] transition-colors"
                  aria-label="Install PWA"
                >
                  <InstallIcon className="w-5 h-5" />
                </button>
              </>
            ) : null}
            
            <a
              href="https://github.com/smart-ex/js-quizzy"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all group"
            >
              <GitHubIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Star</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--accent-primary)] group-hover:bg-[var(--accent-primary)]/10">
                ★
              </span>
            </a>
            <a
              href="https://github.com/smart-ex/js-quizzy"
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
              aria-label="View on GitHub"
            >
              <GitHubIcon className="w-5 h-5" />
            </a>
          
            <button
              type="button"
              className="sm:hidden inline-flex items-center justify-center p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden animate-fadeIn" id="mobile-menu">
          <div className="px-4 pt-2 pb-4 space-y-1 border-t border-[var(--border-subtle)]">
            {links.map(link => {
              const isActive = pathname === link.href ||
                (link.href === '/quiz' && pathname.startsWith('/quiz'));
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive
                      ? 'bg-[var(--bg-card)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/20'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}

function QuizIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function QuestionsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function StatsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function AboutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function InstallIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3m-3 3l-3-3m3 3h6M3 13.5h10.5m-10.5 0V19.5A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5V13.5m-16.5 0V6a1.5 1.5 0 011.5-1.5h15A1.5 1.5 0 0121 6v7.5" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}
