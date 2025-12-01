'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/utils';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Get basePath from environment or use empty string
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      const swPath = `${basePath}/sw.js`;
      
      navigator.serviceWorker
        .register(swPath)
        .then(registration => {
          logger.log('Service Worker registered:', registration);
        })
        .catch(error => {
          logger.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  return null;
}

