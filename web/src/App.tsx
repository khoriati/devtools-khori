import { useMemo } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSettings } from './context/SettingsContext';
import { buildTheme } from './theme';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import ToolView from './components/ToolView';
import VLibrasWidget from './components/VLibrasWidget';
import SignMtWidget from './components/SignMtWidget';

export default function App() {
  const { mode } = useSettings();
  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="tool/:id" element={<ToolView />} />
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      {/*
        Sign-language access: VLibras (Libras) for pt-BR, sign.mt for the others.
        Rendered AFTER the router so the floating button is LAST in the tab order
        (the skip link must remain the first focusable element).
      */}
      <VLibrasWidget />
      <SignMtWidget />
    </ThemeProvider>
  );
}
