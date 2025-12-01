'use client';

import { useState, useEffect } from 'react';
import type { Leaderboard as LeaderboardType, LeaderboardEntry } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/constants';

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'allTime'>('allTime');

  useEffect(() => {
    fetch('/leaderboard.json')
      .then(res => res.json())
      .then((data: LeaderboardType) => {
        setLeaderboard(data);
        setLoading(false);
      })
      .catch(() => {
        // If leaderboard doesn't exist, use empty data
        setLeaderboard({
          daily: [],
          weekly: [],
          allTime: [],
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const entries: LeaderboardEntry[] = leaderboard?.[selectedPeriod] || [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Leaderboard</h2>
        <div className="flex gap-2">
          {(['daily', 'weekly', 'allTime'] as const).map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {period === 'allTime' ? 'All Time' : period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No entries yet. Be the first to share your score!
        </div>
      ) : (
        <div className="space-y-2">
          {entries.slice(0, 10).map((entry, index) => (
            <div
              key={`${entry.userId}-${entry.date}`}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {entry.githubUsername || entry.user}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {CATEGORY_LABELS[entry.category]} • {new Date(entry.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {entry.score}/{entry.total}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

