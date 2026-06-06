import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { ThemeMode } from '../theme';

type SettingsValue = {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  language: string;
  setLanguage: (l: string) => void;
  /** Global tool-search query, shared between the nav and the home grid. */
  query: string;
  setQuery: (q: string) => void;
  /** Announce a message to screen readers via a polite live region. */
  announce: (message: string) => void;
};

const SettingsContext = createContext<SettingsValue | null>(null);

const STORAGE_KEY = 'devtools-theme';

function initialMode(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  if (stored === 'light' || stored === 'dark' || stored === 'high-contrast') return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [mode, setModeState] = useState<ThemeMode>(initialMode);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const liveRef = useRef<HTMLDivElement>(null);

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    localStorage.setItem(STORAGE_KEY, m);
  };

  const setLanguage = (l: string) => {
    i18n.changeLanguage(l);
  };

  // Re-announce by clearing first so identical consecutive messages still fire.
  const announce = (msg: string) => {
    setMessage('');
    window.setTimeout(() => setMessage(msg), 50);
  };

  useEffect(() => {
    if (liveRef.current) liveRef.current.textContent = message;
  }, [message]);

  const value = useMemo<SettingsValue>(
    () => ({ mode, setMode, language: i18n.language, setLanguage, query, setQuery, announce }),
    [mode, i18n.language, query],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
      {/* Visually hidden polite live region for status announcements. */}
      <div
        ref={liveRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      />
    </SettingsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings(): SettingsValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
