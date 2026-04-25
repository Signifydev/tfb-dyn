'use client';

import { useEffect } from 'react';
import {
  safeLocalStorageRemove,
  safeSessionStorageRemove,
} from '@/lib/browser-storage';

const RECOVERY_VERSION_KEY = 'tfb-session-recovery-version';
const RECOVERY_VERSION = '2026-04-25-2';
const STALE_SESSION_KEYS = [
  'tfb-chatbot-open',
  'tfb-chatbot-last-route',
  'tfb-landing-promo-shown',
];

function hasOpenDialog() {
  return Boolean(document.querySelector('[role="dialog"][data-state="open"]'));
}

function repairDocumentInteractivity() {
  if (typeof document === 'undefined' || hasOpenDialog()) {
    return;
  }

  document.body.style.pointerEvents = '';
  document.body.style.overflow = '';
  document.body.style.removeProperty('padding-right');
  document.body.removeAttribute('data-scroll-locked');
}

export function ClientSessionRecovery() {
  useEffect(() => {
    const hasAppliedCurrentVersion =
      typeof window !== 'undefined' &&
      window.localStorage.getItem(RECOVERY_VERSION_KEY) === RECOVERY_VERSION;

    if (!hasAppliedCurrentVersion) {
      STALE_SESSION_KEYS.forEach((key) => {
        safeLocalStorageRemove(key);
        safeSessionStorageRemove(key);
      });

      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(RECOVERY_VERSION_KEY, RECOVERY_VERSION);
        } catch {
          // Ignore storage failures on restricted browsers.
        }
      }
    }

    repairDocumentInteractivity();

    const timers = [100, 600, 1500, 3000].map((delay) =>
      window.setTimeout(repairDocumentInteractivity, delay)
    );

    const handlePageShow = () => repairDocumentInteractivity();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        repairDocumentInteractivity();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null;
}
