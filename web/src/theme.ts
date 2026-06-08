import { createTheme, type Theme } from '@mui/material/styles';

export type ThemeMode = 'light' | 'dark' | 'high-contrast';

export const THEME_MODES: ThemeMode[] = ['light', 'dark', 'high-contrast'];

// All foreground/background pairs below are chosen to clear the WCAG 2.1 AAA
// contrast threshold of 7:1 for normal text (4.5:1 for large text).
const palettes = {
  light: {
    mode: 'light' as const,
    background: { default: '#ffffff', paper: '#f3f5fa' },
    primary: { main: '#0b3d91', contrastText: '#ffffff' }, // 10.4:1 on white
    secondary: { main: '#6a1b9a', contrastText: '#ffffff' },
    text: { primary: '#14181f', secondary: '#3a414d' }, // 16.8:1 / 9.4:1
    error: { main: '#b00020', contrastText: '#ffffff' },
    success: { main: '#1b5e20', contrastText: '#ffffff' },
    link: '#0b3d91',
    focus: '#0b3d91',
  },
  dark: {
    mode: 'dark' as const,
    background: { default: '#0e1116', paper: '#161b22' },
    primary: { main: '#7ab8ff', contrastText: '#001226' }, // light blue, dark text
    secondary: { main: '#d6a8ff', contrastText: '#1a0033' },
    text: { primary: '#f0f3f8', secondary: '#c2cad6' }, // 16:1 / 10:1 on bg
    error: { main: '#ff8a90', contrastText: '#2a0006' },
    success: { main: '#8ce0a0', contrastText: '#00210a' },
    link: '#9ecbff',
    focus: '#ffd23f',
  },
  'high-contrast': {
    mode: 'dark' as const,
    background: { default: '#000000', paper: '#000000' },
    primary: { main: '#ffe100', contrastText: '#000000' }, // 19:1
    secondary: { main: '#00e5ff', contrastText: '#000000' },
    text: { primary: '#ffffff', secondary: '#ffffff' }, // 21:1
    error: { main: '#ff6e6e', contrastText: '#000000' },
    success: { main: '#3dff7a', contrastText: '#000000' },
    link: '#ffe100',
    focus: '#ffffff',
  },
};

export function buildTheme(mode: ThemeMode): Theme {
  const p = palettes[mode];
  const highContrast = mode === 'high-contrast';
  return createTheme({
    palette: {
      mode: p.mode,
      background: p.background,
      primary: p.primary,
      secondary: p.secondary,
      text: p.text,
      error: p.error,
      success: p.success,
      contrastThreshold: 7,
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: '"Atkinson Hyperlegible", "Inter", system-ui, -apple-system, sans-serif',
      fontSize: 16,
      // Generous line-height aids low-vision and dyslexic readers (WCAG 1.4.8/1.4.12).
      body1: { lineHeight: 1.7 },
      body2: { lineHeight: 1.7 },
      button: { textTransform: 'none', fontWeight: 700 },
      h1: { fontSize: '2rem', fontWeight: 800, lineHeight: 1.25 },
      h2: { fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3 },
      h3: { fontSize: '1.2rem', fontWeight: 700 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ':root': { colorScheme: p.mode },
          // Strong, always-visible keyboard focus indicator (WCAG 2.4.7 / 2.4.13).
          'a:focus-visible, button:focus-visible, [tabindex]:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible, .MuiButtonBase-root:focus-visible':
            {
              outline: `3px solid ${p.focus}`,
              outlineOffset: '2px',
              borderRadius: '4px',
            },
          // Respect users who ask for reduced motion (WCAG 2.3.3).
          '@media (prefers-reduced-motion: reduce)': {
            '*, *::before, *::after': {
              animationDuration: '0.001ms !important',
              transitionDuration: '0.001ms !important',
              scrollBehavior: 'auto !important',
            },
          },
          body: { backgroundColor: p.background.default },
        },
      },
      // Disable the ripple everywhere: it injects an absolutely-positioned
      // overlay (.MuiTouchRipple-root) over button/list/card text that prevents
      // automated contrast checkers (axe "bgOverlap") from verifying contrast,
      // and it also respects users who prefer reduced motion.
      MuiButtonBase: {
        defaultProps: { disableRipple: true },
      },
      MuiCardActionArea: {
        styleOverrides: {
          // The focus highlight is another transparent overlay over the content;
          // we rely on the global focus-visible outline + a hover background.
          focusHighlight: { display: 'none' },
          root: {
            '@media (hover: hover)': { '&:hover': { backgroundColor: 'rgba(127,127,127,0.10)' } },
          },
        },
      },
      MuiLink: {
        defaultProps: { underline: 'always' },
        styleOverrides: { root: { color: p.link, fontWeight: 600 } },
      },
      MuiButton: {
        styleOverrides: {
          root: { minHeight: 44, paddingInline: 18 }, // 44px target size (WCAG 2.5.5 AAA)
          ...(highContrast && { outlined: { borderWidth: 2 } }),
        },
      },
      // WCAG 2.5.5 Target Size (Enhanced): interactive targets at least 44x44px.
      MuiIconButton: {
        styleOverrides: { root: { minWidth: 44, minHeight: 44 } },
      },
      MuiToggleButton: {
        // Default ToggleButton text is ~#757575 (4.6:1 on white) — fails AAA.
        // Use the primary text color so it clears the 7:1 threshold.
        styleOverrides: { root: { color: p.text.primary } },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: highContrast ? { borderWidth: 2, borderColor: '#ffffff' } : undefined,
        },
      },
      MuiTooltip: {
        defaultProps: { enterDelay: 200 },
      },
    },
  });
}
