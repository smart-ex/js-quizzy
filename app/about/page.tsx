'use client';

import Link from 'next/link';
import { Navigation } from '@/components/Navigation';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fadeInUp">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-sm mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About JS Quizzy
          </div>
          <h1 className="hero-title mb-6">
            <span className="text-[var(--text-primary)]">Learn JavaScript</span>
            <br />
            <span className="gradient-text">One Question at a Time</span>
          </h1>
        </div>

        {/* Project Description */}
        <div className="glass-card p-8 mb-8 animate-fadeInUp stagger-1">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xl">JS</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
                About This Project
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                JS Quizzy is a 100% open source, offline-first Progressive Web App (PWA) 
                designed to help developers master JavaScript through interactive quizzes. 
                The app focuses on deep concepts like event loops, closures, async/await, 
                this binding, type coercion, prototypes, and more.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                With over 220+ questions covering 11 core JavaScript categories, you can 
                test your knowledge, track your progress, and become a JavaScript expert 
                at your own pace. The app works completely offline after the first visit 
                and can be installed on both mobile and desktop devices.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="glass-card p-6 animate-fadeInUp stagger-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Offline-First</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Works completely offline after first visit. No internet connection required.
            </p>
          </div>

          <div className="glass-card p-6 animate-fadeInUp stagger-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Track Progress</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Monitor your performance with detailed statistics and progress tracking.
            </p>
          </div>

          <div className="glass-card p-6 animate-fadeInUp stagger-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">PWA Support</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Installable on mobile and desktop. Works like a native app.
            </p>
          </div>

          <div className="glass-card p-6 animate-fadeInUp stagger-5">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">220+ Questions</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Comprehensive coverage of 11 core JavaScript categories.
            </p>
          </div>
        </div>

        {/* Credits Section */}
        <div className="glass-card p-8 mb-8 animate-fadeInUp stagger-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-3">
            <svg className="w-6 h-6 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Credits & Acknowledgments
          </h2>
          
          <div className="space-y-6">
            {/* Lydia Hallie Credit */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                    Special Thanks to Lydia Hallie
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-4 leading-relaxed">
                    A significant portion of the questions in this quiz app are inspired by and 
                    adapted from the excellent{' '}
                    <a
                      href="https://github.com/lydiahallie/javascript-questions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent-primary)] hover:underline font-medium"
                    >
                      javascript-questions
                    </a>
                    {' '}repository by{' '}
                    <a
                      href="https://github.com/lydiahallie"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent-primary)] hover:underline font-medium"
                    >
                      @lydiahallie
                    </a>
                    . This repository contains an amazing collection of advanced JavaScript 
                    questions with detailed explanations that have helped thousands of developers 
                    deepen their understanding of JavaScript.
                  </p>
                  <a
                    href="https://github.com/lydiahallie/javascript-questions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-medium)] hover:border-[var(--accent-primary)] text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-all group"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span className="font-medium">View Repository</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Developer Info */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                    Developer
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-4 leading-relaxed">
                    JS Quizzy is developed and maintained as an open-source project. 
                    Contributions, suggestions, and feedback are always welcome!
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://github.com/smart-ex/js-quizzy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-medium)] hover:border-[var(--accent-primary)] text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-all group"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <span className="font-medium">View on GitHub</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="glass-card p-8 mb-8 animate-fadeInUp stagger-7">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-3">
            <svg className="w-6 h-6 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Tech Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Next.js 16', color: 'from-black to-gray-800' },
              { name: 'TypeScript', color: 'from-blue-500 to-blue-600' },
              { name: 'Zustand', color: 'from-purple-500 to-pink-500' },
              { name: 'Tailwind CSS', color: 'from-cyan-500 to-blue-500' },
            ].map((tech, idx) => (
              <div
                key={tech.name}
                className="p-4 rounded-lg bg-gradient-to-br bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-center hover:border-[var(--accent-primary)] transition-all"
                style={{ animationDelay: `${(idx + 8) * 100}ms` }}
              >
                <p className="text-sm font-medium text-[var(--text-primary)]">{tech.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* License */}
        <div className="glass-card p-8 animate-fadeInUp stagger-8">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
            <svg className="w-6 h-6 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            License
          </h2>
          <p className="text-[var(--text-secondary)] mb-4">
            This project is open source and available under the{' '}
            <a
              href="https://opensource.org/licenses/MIT"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-primary)] hover:underline font-medium"
            >
              MIT License
            </a>
            .
          </p>
          <p className="text-[var(--text-secondary)]">
            Contributions are welcome! Feel free to open issues, submit pull requests, 
            or suggest new features.
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12 animate-fadeInUp stagger-9">
          <Link
            href="/"
            className="glow-button inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}

