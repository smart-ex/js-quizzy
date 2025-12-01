'use client';

import { Navigation } from '@/components/Navigation';
import { StatsDashboard } from '@/components/StatsDashboard';
import { useStorage } from '@/lib/useStorage';

export default function StatsPage() {
  const { getStats } = useStorage();
  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          Your Statistics
        </h1>
        <StatsDashboard stats={stats} />
      </main>
    </div>
  );
}

