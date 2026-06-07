import { useTranslation } from 'react-i18next';

/** Consistent brand mark. Uses theme-agnostic colors with a strong focus dot. */
export default function Logo({ size = 36, withText = true }: { size?: number; withText?: boolean }) {
  const { t } = useTranslation();
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={t('app.title')} focusable="false">
        <rect x="4" y="4" width="56" height="56" rx="14" fill="#0B3D91" />
        <path
          d="M18 22 L28 32 L18 42"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="32" y1="44" x2="46" y2="44" stroke="#FFD23F" strokeWidth="5" strokeLinecap="round" />
        <circle cx="44" cy="22" r="6" fill="none" stroke="#FFD23F" strokeWidth="3" />
        <circle cx="44" cy="22" r="1.5" fill="#FFD23F" />
      </svg>
      {withText && (
        <span style={{ fontWeight: 800, fontSize: size * 0.5, letterSpacing: '-0.01em' }} aria-hidden="true">
          KHORI&nbsp;DevTools
        </span>
      )}
    </span>
  );
}
